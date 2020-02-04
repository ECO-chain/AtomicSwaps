const crypto = require("crypto");
const HASH_ALGO = "sha3-256";
const DEFAULT_GAS_LIMIT = 250000;
const DEFAULT_GAS_PRICE = 0.0000004;
const swap_id = process.argv[2];
const recievers_addr = process.argv[3];
const ecoc_amount = process.argv[4];
const block_timelock = process.argv[5];
const gas_limit = (process.argv[6] || DEFAULT_GAS_LIMIT);
const gas_price = (process.argv[7] || DEFAULT_GAS_PRICE);

const h_sha3 = crypto.createHash(HASH_ALGO);
var secret = "sha3 256 hash";
var digest = h_sha3.update(secret).digest("ascii");
send_open(
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
