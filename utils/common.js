const crypto = require("crypto");

/**
 * creates a random number using the crypto library
 * @param {number} length
 * @return {string} random string
 */
function createSecret(length = 128) {
  if (length<64) {
    console.log('Secret length is too short. It must be at least 64');
    process.exit();
  }
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // convert to hexadecimal format
    .slice(0, length); // return required number of characters
}
