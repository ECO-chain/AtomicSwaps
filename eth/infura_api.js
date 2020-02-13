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
        msg = "Server returned status " + response.status;
        return msg;
      }
    })
    .catch(error => {
      console.error(error);
    });
}

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


module.exports = {
  CurrentHeight: getBlockHeight,
  GetNonce: getNonce,
  SendRawTransaction: sendRawTransaction,
  GetGasPrice : getGasPrice
};