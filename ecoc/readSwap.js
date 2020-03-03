/**
 * @file readSwap - read the stap of the swap
 * @arg - swap_id:  the id of the swap
 * @author ECOCHAIN developers
 */

const contract = require("./swapContract");

let swap_id = process.argv[2];

if (!(typeof swap_id !== "undefined" && swap_id)) {
  console.log("swap id is missing");
} else {
  contract.ecoc_check_swap(swap_id)
  .then( results => {
    if(!results){
      console.log('Swap does not exist!');
      process.exit();
    }
  console.log('Swap '+swap_id+' exists');
  console.log(results);
  if(results.scretKey!=null) {
  console.log('Swap is already closed.');
  } else {
    console.log('Swap is still open.');
  }

  })
}
