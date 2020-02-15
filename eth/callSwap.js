const contract = require("./swapContract");

let swap_id = process.argv[2];

if (!(typeof swap_id !== "undefined" && swap_id)) {
  console.log("swap id is missing");
} else {
  contract.eth_check_swap('0x'+swap_id);
}
