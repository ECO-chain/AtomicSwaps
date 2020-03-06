require("dotenv").config({ path: "../.env" });
const utils = require("./utils");
const infura_api = require("./infura_api");
const Web3 = require("web3");
const GAS_LIMIT = 250000;

const ETH = {
  ADDR: process.env.ETH_ADDR,
  PRIV_KEY: process.env.ETH_PRIV_KEY,
  NET: process.env.CHAIN_MODE,
  ENDPOINT: process.env.INFURA_ENDPOINT,
  SECRET: process.env.INFURA_SECRET,
  CONTRACT_ADDR: process.env.ETH_SMARTCONTRACT,
  RECEIVERS_ADDR: process.env.ETH_RECEIVER_ADDR
};
if (ETH.NET == "Testnet") {
  ETH.ENDPOINT = "https://ropsten." + ETH.ENDPOINT;
} else {
  ETH.ENDPOINT = "https://" + ETH.ENDPOINT;
}

const web3 = new Web3(ETH.ENDPOINT);

const contract_abi = [
  {
    constant: false,
    inputs: [
      {
        name: "_AtomicSwapID",
        type: "bytes32"
      },
      {
        name: "_receiverAddress",
        type: "address"
      },
      {
        name: "_SHA3Hash",
        type: "bytes32"
      },
      {
        name: "_blockNumber",
        type: "uint256"
      }
    ],
    name: "open",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_AtomicSwapID",
        type: "bytes32"
      },
      {
        name: "_secretKey",
        type: "bytes"
      }
    ],
    name: "close",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_AtomicSwapID",
        type: "bytes32"
      }
    ],
    name: "check",
    outputs: [
      {
        name: "timelock",
        type: "uint256"
      },
      {
        name: "value",
        type: "uint256"
      },
      {
        name: "receiverAddress",
        type: "address"
      },
      {
        name: "SHA3Hash",
        type: "bytes32"
      },
      {
        name: "secretKey",
        type: "bytes"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "_AtomicSwapID",
        type: "bytes32"
      },
      {
        indexed: false,
        name: "_receiverAddress",
        type: "address"
      },
      {
        indexed: false,
        name: "_SHA3Hash",
        type: "bytes32"
      }
    ],
    name: "Open",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "_AtomicSwapID",
        type: "bytes32"
      }
    ],
    name: "Expire",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "_AtomicSwapID",
        type: "bytes32"
      },
      {
        indexed: false,
        name: "_secretKey",
        type: "bytes"
      }
    ],
    name: "Close",
    type: "event"
  }
];

const contract = new web3.eth.Contract(contract_abi, ETH.CONTRACT_ADDR);

async function call_check(atomic_swap_ID) {
  let params = {
    methodArgs: [atomic_swap_ID],
    senderAddress: ETH.ADDR
  };

  return await contract.methods
    .check(atomic_swap_ID)
    .call()
    .then(results => {
      return results;
    });
}

/**
 * Asynchronous function
 * Reads the state for the swap
 * @param {string} atomic_swap_id - atomic swap id
 * @returns {object} - returns an object {timelock, ETH_amount, receiverAddress, SHA3Hash, secretKey}
 * if secretkey is null then swap is still open
 */
async function wrap_call_check(atomic_swap_ID) {
  atomic_swap_ID = Web3.utils.numberToHex(atomic_swap_ID);
  return await call_check(atomic_swap_ID)
    .then(results => {
      r = {
        timelock: results.timelock,
        ETH_amount: Web3.utils.fromWei(results.value, "ether"),
        receiverAddress: results.receiverAddress,
        SHA3Hash: results.SHA3Hash,
        secretKey: results.secretKey
      };
      console.log(r);
      return results;
    })
    .catch(error => {
      console.error(error);
    });
}

/**
 * Asynchronous function
 * Open a new swap with specific id
 * @param {string} atomic_swap_id - atomic swap id
 * @param {string} receiver_addr - public address of the beneficiary of the asset
 * @param {string} SHA3_hash - the hash of teh secret
 * @param {string} block_timelock - minimum block height that the sender can claim his asset back
 * @param {string} eth_amount - amount in ETH
 * @param {string} gas_limit - (optional) the gas limit of teh transaction
 * @returns {object} - returns an object of the resulted transaction 
 * {jsonrpc, id , result} result is the tx id if succesfull
 */
async function send_open(
  atomic_swap_ID,
  receiver_addr,
  SHA3_hash,
  block_timelock,
  eth_amount,
  gas_limit = GAS_LIMIT
) {
  return await infura_api
    .GetNonce()
    .then(nonce => {
      return nonce;
    })
    .catch(error => {
      console.error(error);
    })
    .then(nonce => {
      atomic_swap_ID = web3.utils.numberToHex(atomic_swap_ID);
      SHA3_hash = "0x" + SHA3_hash;
      block_timelock = web3.utils.numberToHex(block_timelock);

      let payload = contract.methods
        .open(atomic_swap_ID, receiver_addr, SHA3_hash, block_timelock)
        .encodeABI();
      return utils
        .ethSignRawTransaction(
          nonce,
          eth_amount,
          payload, //hexdata
          ETH.CONTRACT_ADDR
        )
        .then(results => {
          return results;
        })
        .catch(error => {
          console.error(error);
        });
    });
}

/**
 * Asynchronous function
 * Open a new swap with specific id
 * @param {string} atomic_swap_ID - atomic swap id
 * @param {string} secret - the secret message, hashed value must match the stored in blockchain
 * @param {string} gas_limit - (optional) the gas limit of teh transaction
 * @returns {object} - returns an object of the resulted transaction 
 * {jsonrpc, id , result} result is the tx id if succesfull
 */
async function send_close(atomic_swap_ID, secret, gas_limit = GAS_LIMIT) {
  return await infura_api
    .GetNonce()
    .then(nonce => {
      return nonce;
    })
    .catch(error => {
      console.error(error);
    })
    .then(nonce => {
      atomic_swap_ID = web3.utils.numberToHex(atomic_swap_ID);
      secret = web3.utils.asciiToHex(secret);
      let payload = contract.methods.close(atomic_swap_ID, secret).encodeABI();
      return utils
        .ethSignRawTransaction(
          nonce,
          "0",
          payload, //hexdata
          ETH.CONTRACT_ADDR
        )
        .then(results => {
          return results;
        })
        .catch(error => {
          console.error(error);
        });
    });
}

module.exports = {
  eth_open_swap: send_open,
  eth_close_swap: send_close,
  eth_check_swap: wrap_call_check
};
