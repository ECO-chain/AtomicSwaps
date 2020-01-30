require("dotenv").config({ path: '../.env' });
const { Ecocw3 } = require("ecoweb3");
const ECOC = {
    ADDR: process.env.ECOC_ADDR,
    PRIV_KEY: process.env.ECOC_PRIV_KEY,
    ENDPOINT: process.env.ECOCNODE_ENDPOINT
  };
const ecocw3 = Ecocw3.Rpc(ECOC.ENDPOINT);


async function getBlockCount() {
    return await ecocw3.getBlockCount();
  }

  async function isConnected() {
    return await ecocw3.isConnected();
  }

  async function getHexAddress(addr) {
    return await ecocw3.getHexAddress(addr);
  }
  
module.exports = {
    getBlockCount : getBlockCount ,
    isConnected : isConnected ,
    getHexAddress : getHexAddress ,
}