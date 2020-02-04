const crypto = require("crypto");
const contract = require("./swapContract");
const readlineSync = require("readline-sync");

const HASH_ALGO = "sha3-256";
const DEFAULT_GAS_LIMIT = 250000;
const DEFAULT_GAS_PRICE = 0.0000004;
const swap_id = process.argv[2];
const recievers_addr = process.argv[3];
const ecoc_amount = process.argv[4];
const block_timelock = process.argv[5];
const gas_limit = process.argv[6] || DEFAULT_GAS_LIMIT;
const gas_price = process.argv[7] || DEFAULT_GAS_PRICE;

if (process.argv.length < 6) {
  console.log("Wrong syntax. Usage is : ");
  console.log(
    "openSwap <swap id> <reciever's address> <ECOC amount> <block height timelock> <gas limit(optional)> <gas price(price)>"
  );
  process.exit();
}

/* input blocking to get the secret */
while (true) {
  var secret = readlineSync.question("provide the secret: ");
  break;
}
console.log("Secret provided and hashed. Keep the secret safe.");

const h_sha3 = crypto.createHash(HASH_ALGO);
var digest = h_sha3.update(secret).digest("ascii");

contract
  .ecoc_open_swap(
    swap_id,
    recievers_addr,
    digest,
    block_timelock,
    ecoc_amount,
    gas_limit,
    gas_price
  )
  .then(results => {
    console.log(results);
  })
  .catch(error => {
    console.log(error);
  });
