const utils = require("./utils.js");
const infura_api = require("./infura_api.js");

utils.ethSignRawTransaction('0x01','0.000012','0x00003')
.then( results => {
    console.log(results);
  })
.catch(error => {
  console.log(error);
})
