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
  context("hex to buffer", function() {
    it("should be equal", async function() {
      var hex_string =
        "7821fa7fce825b8328550770228212d822720bbf406a663bd2ec376d122eb5a1";
      var correct_value =
        "37383231666137666365383235623833323835353037373032323832313264383232373230626266343036613636336264326563333736643132326562356131";
      expected_value = Buffer(hex_string, "utf8").toString("hex");
      assert.equal(expected_value, correct_value);
    });
  });
  it("should be equal", async function() {
    var addr = "eELfUyry7GkMVi7xNjq9zpuYbKbRsa6Hdg";
    var hex = "864f980d88cdfb44a2e3293ecc01084e6d686e7a";
    await ecoc_utils.getHexAddress(addr).then(results => {
      var computed_hex = results;
      assert.equal(computed_hex, hex);
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
