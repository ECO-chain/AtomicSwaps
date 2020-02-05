const contract = require("./swapContract.js");

var swap_id = process.argv[2];
var secret = process.argv[3];

if (!(typeof swap_id !== "undefined" && swap_id)) {
  console.log("swap id is missing");
}

if (!(typeof secret !== "undefined" && secret)) {
  console.log("You must provide the secret to close the swap");
}

/* call the close() function */
