const contract = require("./swapContract.js");

let swap_id = process.argv[2];

if (!(typeof swap_id !== "undefined" && swap_id)) {
  console.log("swap id is missing");
} else {
  contract.ecoc_check_swap(swap_id);
}
