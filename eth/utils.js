require("dotenv").config({ path: "../.env" });
const infura_api = require("./infura_api");
const createHash = require("create-hash");
const crypto = require("crypto");
const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;

const ETH = {
  ADDR: process.env.ETH_ADDR,
  PRIV_KEY: process.env.ETH_PRIV_KEY,
  RECEIVERS_ADDR: process.env.ETH_RECEIVER_ADDR
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

async function _getWalletInfo(address) {
  return await eth_web3.eth.getBalance(address);
}

async function getWalletBalance(address) {
  return await _getWalletInfo(address).then(results => {
    let balance = eth_web3.utils.fromWei(results);
    return balance;
  });
}

async function signRawTransaction(
  nonce,
  eth_amount,
  data,
  to_addr = ETH.RECEIVERS_ADDR
) {
  let priv_key = Buffer.from(ETH.PRIV_KEY, "hex");
  return await infura_api
    .GetGasPrice()
    .then(gas_price => {
      let params = {
        gasPrice: gas_price,
        gasLimit: "0x" + GAS_LIMIT.toString(16),
        to: to_addr,
        value: "0x" + eth_web3.utils.toWei(eth_amount, "ether"),
        data: data
      };
      return params;
    })
    .catch(error => {
      console.error(error);
    })
    .then ( params => {
    infura_api.GetNonce()
  .then ( nonce => {
    params.nonce = nonce;
    return params;
   console.log(params);
    process.exit()
  })
})
.then(params => {
      let rawTx = new Tx(params);
      rawTx.sign(priv_key);
      let serializedData = rawTx.serialize();
      return infura_api.SendRawTransaction(serializedData);
    });
}

module.exports = {
  getBlockHeight: getBlockHeight,
  isConnected: isConnected,
  ethValidAddr: isValidAddr,
  ethWalletBalance: getWalletBalance,
  ethSignRawTransaction: signRawTransaction
};
