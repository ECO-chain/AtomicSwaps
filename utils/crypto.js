const crypto = require("crypto");

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
