require("dotenv").config({ path: "../.env" });
const { Ecocw3 } = require("ecoweb3");
const ECOC = {
  ADDR: process.env.ECOC_ADDR,
  PRIV_KEY: process.env.ECOC_PRIV_KEY,
  ENDPOINT: process.env.ECOCNODE_ENDPOINT,
  NET: process.env.CHAIN_MODE,
  CONTRACT_ADDR: process.env.ECOC_SMARTCONTRACT
};

config = {
  rpcProvider: ECOC.ENDPOINT,
  networkStr: ECOC.NET
};

const ecocw3 = new Ecocw3(config);

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
async function call_check(AtomicSwapID) {
  var params = {
    methodArgs: [AtomicSwapID],
    senderAddress: ECOC.ADDR
  };
  return await contract.call("check", params);
}

function wrap_call_check(AtomicSwapID) {
  call_check(AtomicSwapID)
    .then(results => {
      r = {
        timelock: results.executionResult.formattedOutput.timelock,
        value: results.executionResult.formattedOutput.value,
        receiverAddress:
          results.executionResult.formattedOutput.receiverAddress,
        SHA3Hash: results.executionResult.formattedOutput.SHA3Hash,
        secretKey: results.executionResult.formattedOutput.secretKey
      };
      console.log(r);

      return r;
    })
    .catch(error => {
      console.log(error);
    });
}
