const contract = require("./swapContract");
const crypto_utils = require("../utils/crypto");

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

/* get the swap hash and check if the much the secret */
contract.eth_check_swap(swap_id)
.then(results => {
  let swap_hash = results.SHA3Hash;
  if(!crypto_utils.checkSHA3(secret,swap_hash)){
    console.log('Secret is wrong. Save your gas until you know the secret.')
    process.exit()
  }
  
})
.catch(error => {
  console.log(error);
});


/* call the close() function */
contract.eth_close_swap(swap_id, secret)
  .then(results => {
    console.log(results);
  })
  .catch(error => {
    console.log(error);
  });
