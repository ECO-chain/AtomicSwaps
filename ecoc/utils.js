require("dotenv").config({ path: "../.env" });
const createHash = require("create-hash");
const bs58 = require("bs58");

const { Ecocw3 } = require("ecoweb3");
const ECOC = {
  ADDR: process.env.ECOC_ADDR,
  PRIV_KEY: process.env.ECOC_PRIV_KEY,
  ENDPOINT: process.env.ECOCNODE_ENDPOINT,
  NET: process.env.CHAIN_MODE
};
const ecocw3 = Ecocw3.Rpc(ECOC.ENDPOINT);

async function getBlockCount() {
  return await ecocw3.getBlockCount();
}

async function isConnected() {
  return await ecocw3.isConnected();
}

async function getHexAddress(addr) {
  return await ecocw3.getHexAddress(addr);
}

async function fromHexAddress(addr) {
  return await ecocw3.fromHexAddress(addr);
}

function hex_to_ecoc_addr(hex_addr, net = ECOC.NET) {
  var ecoAdress = hex_addr;
  // Add network byte
  if (net == "mainnet") {
    ecoAdress = "21" + ecoAdress;
  } else {
    ecoAdress = "5c" + ecoAdress;
  }

  const ecoAdressBuffer = Buffer.from(ecoAdress, "hex");
  // Double SHA256 hash
  const hash1 = createHash("sha256")
    .update(ecoAdressBuffer)
    .digest("Hex");
  const hash1Buffer = Buffer.from(hash1, "hex");
  const hash2 = createHash("sha256")
    .update(hash1Buffer)
    .digest("Hex");

  // get first 4 bytes
  ecoAdress += hash2.slice(0, 8);

  // base58 encode
  const address = bs58.encode(Buffer.from(ecoAdress, "hex"));
  return address;
}

function hex2Buffer(hexString) {
  const buffer = [];
  let i;
  for (i = 0; i < hexString.length; i += 2) {
    buffer[buffer.length] =
      (parseInt(hexString[i], 16) << 4) | parseInt(hexString[i + 1], 16); // eslint-disable-line no-bitwise
  }
  return Buffer.from(buffer);
}

module.exports = {
  getBlockCount: getBlockCount,
  isConnected: isConnected,
  getHexAddress: getHexAddress,
  fromHexAddress: fromHexAddress,
  hex_to_ecoc_addr: hex_to_ecoc_addr,
  hex2Buffer: hex2Buffer
};
