require("dotenv").config({ path: "../.env" });
const crypto = require("crypto");
const utils = require("./utils");
const infura_api = require("./infura_api");
const swap = require("./swapContract");

swap_id ='01'
sha3_256 = crypto.createHash("sha3-256");
message = 'eth swap secret Sha3'
sha3Hash = '0x'+sha3_256.update(message).digest("hex");
block_lock = '123456'
eth_amount= '0.00005'
swap.eth_open_swap(swap_id,process.env.ETH_RECEIVER_ADDR,sha3Hash,block_lock,eth_amount)
.then( results => {
  console.log(results);
})
.catch(error => {
console.log(error);
})