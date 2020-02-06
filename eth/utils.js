require("dotenv").config({ path: "../.env" });
const createHash = require("create-hash");
const crypto = require("crypto");
const Web3 = require("web3");

const ETH = {
  ADDR: process.env.ETH_ADDR,
  PRIV_KEY: process.env.ETH_PRIV_KEY
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

module.exports = {
  getBlockHeight: getBlockHeight,
  isConnected: isConnected
  /* todo :
    getHexAddress: getHexAddress,
    fromHexAddress: fromHexAddress, 
    hex_to_eth_addr: hex_to_eth_addr,
    hex2Buffer: hex2Buffer,
    eth_valid_addr: is_valid_addr,
    eth_wallet_info : getWalletInfo
    */
};
