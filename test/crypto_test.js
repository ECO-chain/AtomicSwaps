require("dotenv").config();
assert = require("assert");
crypto = require("crypto");
const h_sha256 = crypto.createHash("sha256");
const h_sha3_256 = crypto.createHash("sha3-256");

describe("crypto tests", function() {
  context("compute sha3-256", function() {
    it("should be equal", async function() {
      var message = "sha3 256 hash";
      var correct_hash =
        "7821fa7fce825b8328550770228212d822720bbf406a663bd2ec376d122eb5a1";
      var computed_hash = h_sha3_256.update(message).digest("hex");
      assert.equal(computed_hash, correct_hash);
    });

    it("should be equal", async function() {
      var correct_hash_string =
        "7821fa7fce825b8328550770228212d822720bbf406a663bd2ec376d122eb5a1";
      var correct_hash_hex = correct_hash_string.toString("binary");
      assert.equal(correct_hash_hex, correct_hash_string);
    });
  });

  context("compute sha256", function() {
    it("should be equal", async function() {
      var message = "sha2 256 hash";
      var correct_hash =
        "af902cdde8603bf6dc261a7af4a9d58f52bb185fc665de2f910ab587e4b13f95";
      var computed_hash = h_sha256.update(message).digest("hex");
      assert.equal(computed_hash, correct_hash);
    });
  });
});
