require("dotenv").config({ path: "../.env" });
const utils = require("./utils.js");
const Web3 = require("web3");

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

function wrap_call_check(atomic_swap_ID) {
  call_check(atomic_swap_ID)
    .then(results => {
      r = {
        timelock: results.timelock,
        value: results.value,
        receiverAddress: results.receiverAddress,
        SHA3Hash: Buffer.from(results.SHA3Hash,'hex').toString(),
        secretKey: results.secretKey
      };
      console.log(r);
        return r;
    })
    .catch(error => {
      console.log(error);
    });
}

/*
async function send_open(
  atomic_swap_ID,
  receiver_addr,
  SHA3_hash,
  block_timelock,
  eth_amount,
  gas_limit = 250000,
  gas_price = 0.0000004
) {
  let params = {
    methodArgs: [atomic_swap_ID, receiver_addr, SHA3_hash, block_timelock],
    amount: eth_amount,
    gasLimit: gas_limit,
    gasPrice: gas_price,
    senderAddress: ETH.ADDR
  };

  return await contract.send("open", params);
}

async function send_close(
  atomic_swap_ID,
  secret,
  gas_limit = 250000,
  gas_price = 0.0000004
) {
  let params = {
    methodArgs: [atomic_swap_ID, secret],
    amount: 0 ,
    gasLimit: gas_limit,
    gasPrice: gas_price,
    senderAddress: ETH.ADDR
  };

  return await contract.send("close", params);
}
*/
module.exports = {
  // eth_open_swap: send_open,
  // eth_close_swap: send_close,
 eth_check_swap: wrap_call_check
};
