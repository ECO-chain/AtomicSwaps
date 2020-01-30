assert = require("assert");
require("dotenv").config();
const { Ecocw3 } = require("ecoweb3");
const ECOC = {
  ADDR: process.env.ECOC_ADDR,
  PRIV_KEY: process.env.ECOC_PRIV_KEY,
  ENDPOINT: process.env.ECOCNODE_ENDPOINT
};
const ecocw3 = Ecocw3.Rpc(ECOC.ENDPOINT);
const ecoc_utils = require("../ecoc/utils.js");

describe("ECOC utilis tests", function() {
  context("address to hex", function() {
    it("should be equal", async function() {
      var addr = "eELfUyry7GkMVi7xNjq9zpuYbKbRsa6Hdg";
      var hex = "864f980d88cdfb44a2e3293ecc01084e6d686e7a";
      await ecoc_utils.getHexAddress(addr).then(results => {
        var computed_hex = results;
        assert.equal(computed_hex, hex);
      });
    });
  });
  it("should be equal", async function() {
    var addr = "eRE1FUvaQdfCzHANAAcKoimPgBcxq2vMsN";
    var hex = "fdb69114c41081ba5af1a6074a4d6950739a77b0";
    await ecoc_utils.getHexAddress(addr).then(results => {
      var computed_hex = results;
      assert.equal(computed_hex, hex);
    });
  });
});
