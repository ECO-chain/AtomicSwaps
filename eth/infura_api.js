require("dotenv").config({ path: "../.env" });
const axios = require("axios");

const ETH = {
  ADDR: process.env.ETH_ADDR,
  PRIV_KEY: process.env.ETH_PRIV_KEY,
  NET: process.env.CHAIN_MODE,
  ENDPOINT: process.env.INFURA_ENDPOINT,
  SECRET: process.env.INFURA_SECRET,
  CONTRACT_ADDR: process.env.ETH_SMARTCONTRACT,
  RECEIVERS_ADDR: process.env.ETH_RECEIVER_ADDR
};
if (ETH.NET == "Testnet") {
  ETH.ENDPOINT = "https://ropsten." + ETH.ENDPOINT;
} else {
  ETH.ENDPOINT = "https://" + ETH.ENDPOINT;
}

const HEADERS = {
  "Content-Type": "application/json"
};

/**
 * Asynchronous function
 * Gets the block height of the ethereum network
 * @param {string} base - hex or decimal. By default is set to "hex"
 * @returns {number} - returns the block height or response status on error
 */
async function getBlockHeight(base = "hex") {
  let config = {
    headers: HEADERS
  };
  let data = {
    jsonrpc: "2.0",
    method: "eth_blockNumber",
    params: [],
    id: 1
  };
  return await axios
    .post(ETH.ENDPOINT, data, config)
    .then(response => {
      if (response.status == 200) {
        if (base == "decimal") {
          msg = parseInt(response.data.result, 16);
        } else {
          msg = response.data.result;
        }
        return msg;
      } else {
        msg = response.status;
        return msg;
      }
    })
    .catch(error => {
      console.error(error);
    });
}

/**
 * Asynchronous function
 * Gets the nounce of the block for the spesific public address
 * @param {string} addr - the ETH public address
 * @param {string} block - block number, by default the latest
 * @returns {string} - returns the nounce
 */
async function getNonce(addr = ETH.ADDR, block = "latest") {
  let config = {
    headers: HEADERS
  };
  let data = {
    jsonrpc: "2.0",
    method: "eth_getTransactionCount",
    params: [addr, block],
    id: 1
  };
  return await axios
    .post(ETH.ENDPOINT, data, config)
    .then(response => {
      return response.data.result;
    })
    .catch(error => {
      console.error(error);
    });
}

/**
 * Asynchronous function
 * Signs a raw transaction if the data are already serialized
 * @param {string} serialized_data - ready serialized data for the tx
 * @returns {object} - returns an object of the resulted transaction 
 * {jsonrpc, id , result} result is the tx id if succesfull
 */
async function sendRawTransaction(serialized_data) {
  let config = {
    headers: HEADERS
  };
  let data = {
    jsonrpc: "2.0",
    method: "eth_sendRawTransaction",
    params: [serialized_data],
    id: 1
  };
  return await axios
    .post(ETH.ENDPOINT, data, config)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });
}

/**
 * Asynchronous function
 * Gets the current gas price of the ethereum network
 * @returns {number} - returns the gas price
 */
async function getGasPrice() {
  let config = {
    headers: HEADERS
  };
  let data = {
    jsonrpc: "2.0",
    method: "eth_gasPrice",
    params: [],
    id: 1
  };
  return await axios
    .post(ETH.ENDPOINT, data, config)
    .then(response => {
      return response.data.result;
    })
    .catch(error => {
      console.error(error);
    });
}

/**
 * Asynchronous function
 * Gets the balance of the ETH public addr at a specific block
 * @param {string} addr - the ETH public address
 * @param {string} block - block number, by default the latest
 * @returns {string} - returns the balance in wei
 */
async function getBalance(addr, block='latest') {
  let config = {
    headers: HEADERS
  };
  let data = {
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [addr, block],
    id: 1
  };
  return await axios
    .post(ETH.ENDPOINT, data, config)
    .then(response => {
      return response.data.result;
    })
    .catch(error => {
      console.error(error);
    });
}

module.exports = {
  GetBalance: getBalance,
  CurrentHeight: getBlockHeight,
  GetNonce: getNonce,
  SendRawTransaction: sendRawTransaction,
  GetGasPrice : getGasPrice
};