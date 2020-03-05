const crypto = require("crypto");

/**
 * Sunchronous function
 * Checks if the hash of plaintext in SHa3-256 matches the givenhash
 * @param {string} plaintext - message to be hashed in SHA3-256
 * @param {string} hash - the hash to be checked
 *  @returns {boolean} - true if hash is correct, else false
 */
function checkSHA3(plaintext, hash) {
  const h_sha3 = crypto.createHash("sha3-256");
  let digest = h_sha3.update(plaintext).digest("hex");
  digest = "0x" + digest;
  if (digest == hash) {
    return true;
  }
  return false;
}
module.exports = {
  checkSHA3: checkSHA3
};
