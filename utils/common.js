const crypto = require("crypto");

/**
 * creates a random number using the crypto library
 * @param {number} length
 * @return {string} random string
 */
function createSecret(length = 128) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // convert to hexadecimal format
    .slice(0, length); // return required number of characters
}
