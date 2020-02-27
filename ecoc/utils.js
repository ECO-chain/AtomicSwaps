/**
 * @file Utils for ecoc atomic swaps
 * @author ECOCHAIN developers
 */


require("dotenv").config({ path: "../.env" });
const createHash = require("create-hash");
const bs58 = require("bs58");
const crypto = require("crypto");

const { Ecocw3 } = require("ecoweb3");
const ECOC = {
  ADDR: process.env.ECOC_ADDR,
  PRIV_KEY: process.env.ECOC_PRIV_KEY,
  ENDPOINT: process.env.ECOCNODE_ENDPOINT,
  NET: process.env.CHAIN_MODE
};
const ecocw3 = Ecocw3.Rpc(ECOC.ENDPOINT);

/**
 * Async function. No input params
 * Returns the block height
 *  @returns {number} block height
 */
async function getBlockCount() {
  return await ecocw3.getBlockCount();
}

/**
 * Async function. No input params
 * Checks if connection to the node is established
 *  @returns {boolean} true if connected, otherwise false
 */
async function isConnected() {
  return await ecocw3.isConnected();
}

/**
 * Async function.
 * Converts string to hex
 * @param {string} - the address to be converted to string
 *  @returns {number} address in hex format 
 */

async function getHexAddress(addr) {
  return await ecocw3.getHexAddress(addr);
}

/**
 * Async function.
 * Converts hex to string
 * @param {number} - the address to be converted to hex
 *  @returns {string} string address 
 */
async function fromHexAddress(addr) {
  return await ecocw3.fromHexAddress(addr);
}

/**
 * Async function. No input params
 * get the wallet info
 *  @returns {object} returns the wallet info
 */
async function getWalletInfo() {
  return await ecocw3.getWalletInfo();
}

function hex_to_ecoc_addr(hex_addr, net = ECOC.NET) {
  let ecoAdress = hex_addr;
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

function is_valid_addr(address, net = "mainnet") {
  if (net.toLowerCase() == "testnet") {
    characteristic = "e";
  } else {
    characteristic = "E";
  }
  if (address[0] != characteristic) {
    return false;
  }

  /* decode from base58 */
  let bytes_addr = bs58.decode(address);
  /* remove last 4 bytes */
  let checksum = Buffer.alloc(4);
  bytes_addr.copy(checksum, 0, bytes_addr.length - 4);
  checksum = Buffer.from(checksum, "hex").toString();
  let bytes_nochecksum = Buffer.alloc(bytes_addr.length - 4);
  bytes_addr.copy(bytes_nochecksum, 0, 0, bytes_addr.length - 4);
  /* two times hash256*/
  const h1_sha256 = crypto.createHash("sha256");
  const h2_sha256 = crypto.createHash("sha256");
  let first_hash = h1_sha256.update(bytes_nochecksum).digest("");
  first_hash.copy(first_hash, 0, 0, first_hash.length - 4);
  let second_hash = h2_sha256.update(first_hash).digest("");
  let second_hash_buff = Buffer.from(second_hash);
  let final_checksum = Buffer.alloc(4);
  second_hash_buff.copy(final_checksum, 0, 0, 4);
  /* compar the 4 checksum bytes with
   * the last 4 bytes after the hashing*/
  is_valid = checksum == final_checksum;
  return is_valid;
}

module.exports = {
  getBlockCount: getBlockCount,
  isConnected: isConnected,
  getHexAddress: getHexAddress,
  fromHexAddress: fromHexAddress, 
  hex_to_ecoc_addr: hex_to_ecoc_addr,
  hex2Buffer: hex2Buffer,
  ecoc_valid_addr: is_valid_addr,
  ecoc_wallet_info : getWalletInfo
}
