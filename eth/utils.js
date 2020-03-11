require("dotenv").config({ path: "../.env" });
const infura_api = require("./infura_api");
const createHash = require("create-hash");
const crypto = require("crypto");
const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;

const ETH = {
  ADDR: process.env.ETH_ADDR,
  PRIV_KEY: process.env.ETH_PRIV_KEY,
  RECEIVERS_ADDR: process.env.ETH_RECEIVER_ADDR,
  SMARTCONTRACT: process.env.ETH_SMARTCONTRACT
};

const INFURA = {
  ENDPOINT: process.env.INFURA_ENDPOINT,
  SECRET: process.env.INFURA_SECRET
};

const eth_web3 = new Web3(new Web3.providers.HttpProvider(INFURA.ENDPOINT));
const GAS_LIMIT = 250000;

/**
 * Async function. No input params
 * Returns the current gas price
 *  @returns {number} gas price in wei
 */
async function getCurrentGasPrice() {
  return await infura_api
    .GetGasPrice()
    .then(results => {
      return results;
    })
    .catch(error => {
      console.error(error);
    });
}

/**
 * Async function. No input params
 * Returns the block height
 *  @returns {number} block height
 */
async function getBlockHeight() {
  return await eth_web3.eth.getBlockNumber();
}

/**
 * Async function. No input params
 * Check if there is connection to the API
 *  @returns {boolean} - true if connected, else false
 */
async function isConnected() {
  return await eth_web3.eth.net.isListening();
}

/**
 * Async function
 * Check if public address is correct
 * @param address - public address to be checked
 *  @returns {boolean} - true if the adress is correct, else false
 */
async function isValidAddr(address) {
  return await eth_web3.utils.isAddress(address);
}

/**
 * Async function
 * Gets the address balance
 * @param address - public address to be checked
 * @param block - block height, the latest by default
 *  @returns {number} - the balance in wei
 */
async function getWalletBalance(address, block = "latest") {
  return await infura_api.GetBalance(address, block).then(results => {
    let balance = eth_web3.utils.fromWei(results);
    return balance;
  });
}

/**
 * Async function
 * Signs a raw transaction. The private key must be already set in .env
 * @param {string} eth_amount - amount of ETH
 * @param {string} data - the payload of the transaction (method of smart contract encoded)
 * @param {string} to_addr - receiver's public address 
 * @returns {object} - returns an object of the resulted transaction 
 * {jsonrpc, id , result} result is the tx id if succesfull
 */
async function signRawTransaction(nonce, eth_amount, data, to_addr) {
  return await infura_api
    .GetGasPrice()
    .then(gas_price => {
      let params = {
        gasPrice: gas_price,
        gasLimit: "0x" + GAS_LIMIT.toString(16),
        to: to_addr,
        value:
          "0x" +
          parseInt(eth_web3.utils.toWei(eth_amount, "ether")).toString(16),
        data: data
      };
      return params;
    })
    .catch(error => {
      console.error(error);
    })
    .then(params => {
      return infura_api.GetNonce().then(nonce => {
        params.nonce = nonce;
        return params;
      });
    })
    .then(params => {
      let priv_key = Buffer.from(ETH.PRIV_KEY, "hex");
      if (process.env.CHAIN_MODE == "Testnet") {
        var chain_name = "ropsten";
      } else {
        var chain_name = "mainnet";
      }
      let rawTx = new Tx(params, { chain: chain_name });
      rawTx.sign(priv_key);
      let serializedData = rawTx.serialize();
      return infura_api.SendRawTransaction(
        "0x" + serializedData.toString("hex")
      );
    });
}

module.exports = {
  getCurrentGasPrice : getCurrentGasPrice,
  getBlockHeight: getBlockHeight,
  isConnected: isConnected,
  ethValidAddr: isValidAddr,
  ethWalletBalance: getWalletBalance,
  ethSignRawTransaction: signRawTransaction
};
