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

async function getBlockHeight() {
  return await eth_web3.eth.getBlockNumber();
}

async function isConnected() {
  return await eth_web3.eth.net.isListening();
}

async function isValidAddr(address) {
  return await eth_web3.utils.isAddress(address);
}

async function getWalletBalance(address, block = "latest") {
  return await infura_api.GetBalance(address, block).then(results => {
    let balance = eth_web3.utils.fromWei(results);
    return balance;
  });
}

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
  getBlockHeight: getBlockHeight,
  isConnected: isConnected,
  ethValidAddr: isValidAddr,
  ethWalletBalance: getWalletBalance,
  ethSignRawTransaction: signRawTransaction
};
