require("dotenv").config({ path: "../.env" });
const utils = require("./utils");

const { Ecocw3 } = require("ecoweb3");
const ECOC = {
  ADDR: process.env.ECOC_ADDR,
  PRIV_KEY: process.env.ECOC_PRIV_KEY,
  ENDPOINT: process.env.ECOCNODE_ENDPOINT,
  NET: process.env.CHAIN_MODE,
  CONTRACT_ADDR: process.env.ECOC_SMARTCONTRACT,
  RECEIVERS_ADDR: process.env.ECOC_RECEIVER_ADDR
};

config = {
  rpcProvider: ECOC.ENDPOINT,
  networkStr: ECOC.NET
};

const ecocw3 = new Ecocw3(config);
const rpc = Ecocw3.Rpc(ECOC.ENDPOINT);

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

const contract = ecocw3.Contract(ECOC.CONTRACT_ADDR, contract_abi);
async function call_check(atomic_swap_ID) {
  let params = {
    methodArgs: [atomic_swap_ID],
    senderAddress: ECOC.ADDR
  };
  return await contract.call("check", params);
}


/**
 * Async function
 * Reads the state of a swap
 * @param {string} - id of swap
 * @returns {object} - returns a Promise of an object which holds the state of the swap
 * Returned object: { timelock, value, receiverAddress, SHA3Hash, secretKey }
 */
async function wrap_call_check(atomic_swap_ID) {
  return await call_check(atomic_swap_ID)
    .then(results => {
      /* check fon non existing swap */
      if (results.executionResult.formattedOutput.SHA3Hash==0) {
        return false ;
      }
      r = {
        timelock: results.executionResult.formattedOutput.timelock,
        value: results.executionResult.formattedOutput.value,
        receiverAddress: utils.hex_to_ecoc_addr(
          results.executionResult.formattedOutput.receiverAddress
        ),
        SHA3Hash: Buffer.from(results.executionResult.formattedOutput.SHA3Hash,'hex').toString(),
        secretKey: results.executionResult.formattedOutput.secretKey
      };
        return r;
    })
    .catch(error => {
      console.log(error);
    });
}

/**
 * Async function
 * Opens a swap
 * @param {string} - id of swap
 * @param {string} - reciever's public address of the asset
 * @param {string} - hash of the secret (SHA3-256 ago)
 * @param {string} - minimum block height that the sender can claim the asset back ("lock")
 * @param {string} - amount of the asset in ECOC
 * @param {number} - gas limit (optional, default is 250000)
 * @param {number} - gas price (optional, default is 0.0000004)
 * @returns {object} - returns a Promise of an object which holds the result of the transaction
 * Returned object: { txid, sender, hash160, args:{ contractAddress, amount, gasLimit, gasPrice}}
 */
async function send_open(
  atomic_swap_ID,
  receiver_addr,
  SHA3_hash,
  block_timelock,
  ecoc_amount,
  gas_limit = 250000,
  gas_price = 0.0000004
) {
  let params = {
    methodArgs: [atomic_swap_ID, receiver_addr, SHA3_hash, block_timelock],
    amount: ecoc_amount,
    gasLimit: gas_limit,
    gasPrice: gas_price,
    senderAddress: ECOC.ADDR
  };

  return await contract.send("open", params);
}

/**
 * Async function
 * Closes a swap
 * @param {string} - id of swap
 * @param {string} - the secret. The caller can get the secret from the other chain
 * @param {number} - gas limit (optional, default is 250000)
 * @param {number} - gas price (optional, default is 0.0000004)
 * @returns {object} - returns a Promise of an object which holds the result of the transaction
 * Returned object: { txid, sender, hash160, args:{ contractAddress, amount, gasLimit, gasPrice}}
 */
async function send_close(
  atomic_swap_ID,
  secret,
  gas_limit = 250000,
  gas_price = 0.0000004
) {
  let params = {
    methodArgs: [atomic_swap_ID, secret],
    amount: 0 , /* no ECOC to send*/
    gasLimit: gas_limit,
    gasPrice: gas_price,
    senderAddress: ECOC.ADDR
  };

  return await contract.send("close", params);
}

module.exports = {
  ecoc_open_swap : send_open,
  ecoc_close_swap : send_close,
  ecoc_check_swap : wrap_call_check,
};
