require("dotenv").config({ path: "../.env" });
const createHash = require("create-hash");
const crypto = require("crypto");
const Web3 = require("web3");
const Tx = require('ethereumjs-tx');
const GAS_LIMIT = 250000;
const GAS_PRICE = 0.0000004;

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

async function signRawTransaction(nonce, eth_amount, data, to_addr=ETH.RECEIVERS_ADDR) {
  let priv_key = new Buffer(ETH.PRIV_KEY,'hex');
  let params = {
    nonce: nonce.toString(16),
    gasPrice: GAS_PRICE.toString(16),
    gasLimit: GAS_LIMIT.toString(16),
    to: to_addr,
    value: eth_amount.toString(16),
    data: data
  }
let rawTx = new Tx(params);
rawTx.sign(priv_key);
let serializedData = rawTx.serialize();

return await infura.SendRawTransaction(serializedData)
.then( results => {
  return results;
  })
.catch(error => {
  console.log(error);
})
}

module.exports = {
  getBlockHeight: getBlockHeight,
  isConnected: isConnected,
  ethValidAddr: isValidAddr,
  ethWalletBalance: getWalletBalance,
  ethSignRawTransaction : signRawTransaction,
};
