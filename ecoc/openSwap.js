const crypto = require("crypto");
const contract = require("./swapContract");
const utils = require("./utils");
const readlineSync = require("readline-sync");

const HASH_ALGO = "sha3-256";
const DEFAULT_GAS_LIMIT = 250000;
const DEFAULT_GAS_PRICE = 0.0000004;
const swap_id = process.argv[2];
const recievers_addr = process.argv[3];
const ecoc_amount = parseFloat(process.argv[4]);
const block_timelock = parseInt(process.argv[5]);
const gas_limit = process.argv[6] || DEFAULT_GAS_LIMIT;
const gas_price = process.argv[7] || DEFAULT_GAS_PRICE;

if (process.argv.length < 6) {
  console.log("Wrong syntax. Usage is : ");
  console.log("openSwap <swap id> <reciever's address> <ECOC amount> <block height timelock> <gas limit(optional)> <gas price(price)>");
    process.exit();
}

let secret;
/* input blocking to get the secret */
while (true) {
  secret = readlineSync.question("provide the secret: ");
  if (secret == "") {
    continue;
  }
  break;
}
console.log("Secret provided and hashed. Keep the secret safe.");

const h_sha3 = crypto.createHash(HASH_ALGO);
let digest = h_sha3.update(secret).digest("hex");

/* check for valid ECOC address*/
if (!utils.ecoc_valid_addr(recievers_addr, process.env.CHAIN_MODE)) {
  console.log(
    "Wrong reciever's ecochain address. Check the address and net mode."
  );
  process.exit();
}

/* check for readonable block timelock*/
utils
  .getBlockCount()
  .then(blockheight => {
    //console.log(results);
    const MIN_BLOCK = parseInt(process.env.ECOC_MIN_BLOCK_LOCK);

    if (block_timelock <= blockheight + MIN_BLOCK) {
      console.log(
        "For security reasons, please set block time higher than " +
          (blockheight + MIN_BLOCK) +
          " (current block " +
          blockheight +
          "+" +
          MIN_BLOCK +
          ")"
      );
      process.exit();
    }
  })
  .catch(error => {
    console.log(error);
    process.exit();
  })
  /* check if wallet holds enough balance */
  .then(
    utils.ecoc_wallet_info().then(wallet_info => {
      let wallet_balance = wallet_info.balance;
      if (wallet_balance <= ecoc_amount) {
        console.log(
          "Not enough ECOC. Wallet balance is " + wallet_balance + " ECOC"
        );
        process.exit();
      }
    })
  )
  .catch(error => {
    console.log(error);
    process.exit();
  })
  .then(
    /* open the swap */
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
  )
  .catch(error => {
    console.log(error);
  });
