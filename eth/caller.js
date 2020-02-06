const utils = require("./utils.js");

utils.isConnected().then(results => {
  console.log("Connected to Infura: " + results);
});
utils.getBlockHeight().then(results => {
  console.log("Last block: " + results);
});
