const crypto = require("crypto");
const contract = require("./swapContract");
const utils = require("./utils");
const infura_api = require("./infura_api");
const readlineSync = require("readline-sync");

const HASH_ALGO = "sha3-256";
const DEFAULT_GAS_LIMIT = 250000;
const DEFAULT_GAS_PRICE = 0.0000004;
const swap_id = process.argv[2];
const recievers_addr = process.argv[3];
const eth_amount = parseFloat(process.argv[4]);
const block_timelock = parseInt(process.argv[5]);
const gas_limit = process.argv[6] || DEFAULT_GAS_LIMIT;
const gas_price = process.argv[7] || DEFAULT_GAS_PRICE;

if (process.argv.length < 6) {
  console.log("Wrong syntax. Usage is : ");
  console.log(
    "openSwap <swap id> <reciever's address> <ETH amount> <block height timelock> <gas limit(optional)> <gas price(price)>"
  );
  process.exit();
}

/* input blocking to get the secret */
let secret;
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

/* check for valid ETH address*/
utils.ethValidAddr(recievers_addr).then(results => {
  if (!results) {
    console.log(
      "Wrong reciever's ethereum address. Check the address and net mode."
    );
    process.exit();
  } else {
    /* check for reasonable block timelock*/
    infura_api
      .CurrentHeight((base = "decimal"))
      .then(blockheight => {
        const MIN_BLOCK = parseInt(process.env.ETH_MIN_BLOCK_LOCK);
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
      .then(() => {
        /* check if wallet holds enough balance */
        utils
          .ethWalletBalance(process.env.ETH_ADDR)
          .then(balance => {
            if (balance < eth_amount) {
              console.log("Balance " + balance + " is not enough");
              process.exit();
            }
          })
          .catch(error => {
            console.log(error);
            process.exit();
          })
          .then(() => {
            console.log("Opening the swap:");
            ethAmount = eth_amount.toString();
            swapID = parseInt(swap_id);
            return contract.eth_open_swap(
              swapID,
              recievers_addr,
              digest,
              block_timelock,
              ethAmount
            );
          })
          .catch(error => {
            console.log(error);
            process.exit();
          })
          .then(results => {
            console.log(results);
          });
      });
  }
});
