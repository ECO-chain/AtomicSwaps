require("dotenv").config();
const Web3 = require("web3");
const { Ecocw3 } = require("ecoweb3");
const ecoc_utils = require("./ecoc/utils.js");

const ETH = {
  ADDR: process.env.ETH_ADDR,
  PRIV_KEY: process.env.ETH_PRIV_KEY
};

const INFURA = {
  ENDPOINT: process.env.INFURA_ENDPOINT,
  SECRET: process.env.INFURA_SECRET
};

const ECOC = {
  ADDR: process.env.ECOC_ADDR,
  PRIV_KEY: process.env.ECOC_PRIV_KEY,
  ENDPOINT: process.env.ECOCNODE_ENDPOINT
};

const eth_web3 = new Web3(new Web3.providers.HttpProvider(INFURA.ENDPOINT));
const ecoc_web3 = Ecocw3.Rpc(ECOC.ENDPOINT);

eth_web3.eth.net.isListening().then(results => {
  console.log("connected to Infura: " + results);
});

ecoc_utils.isConnected().then(results => {
  console.log("connected to ecochain node: " + results);
});

let height;

ecoc_utils.getBlockCount().then(results  => {
    height = results;
    console.log('current height: '+height)
});
