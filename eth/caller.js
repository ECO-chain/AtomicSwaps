const utils = require("./utils.js");

utils.isConnected()
.then(results => {
  console.log("Connected to Infura: " + results);
});
utils.getBlockHeight()
.then(results => {
  console.log("Last block: " + results);
});

utils.ethValidAddr("0xdddddddddddddddddddddddddddddddddd")
.then(results => {
    console.log("valid: " + results);
  });

  utils.ethValidAddr(process.env.ETH_ADDR)
.then(results => {
    console.log("valid: " + results);
  });
