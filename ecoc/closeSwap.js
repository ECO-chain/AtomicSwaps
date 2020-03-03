/**
 * @file closeSwap - closes the swap
 * @arg - swap_id:  the id of the swap
 * @arg - secret:  the secret
 * @author ECOCHAIN developers
 */

const contract = require("./swapContract");

let swap_id = process.argv[2];
let secret = process.argv[3];

if (!(typeof swap_id !== "undefined" && swap_id)) {
  console.log("swap id is missing");
  process.exit();
}

if (!(typeof secret !== "undefined" && secret)) {
  console.log("You must provide the secret to close the swap");
  process.exit();
}

/* call the close() function */
contract.ecoc_close_swap(swap_id, secret)
  .then(results => {
    console.log(results);
  })
  .catch(error => {
    console.log(error);
  });
