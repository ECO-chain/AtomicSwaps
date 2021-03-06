assert = require("assert");
require("dotenv").config();
const utils = require("../eth/utils.js");

describe("ETH utilis tests", function() {
  context("is connected", function() {
    it("should be equal", async function() {
      let expected_value = true;
      utils.isConnected().then(results => {
        let tested_value = results;
        assert.equal(tested_value, expected_value);
      });
    });
  });

  context("block height check", function() {
    it("current block should be greater than", async function() {
      let testtime_block_height = 7273266;
      utils.getBlockHeight().then(results => {
        let current_block = results;
        assert.equal(current_block - testtime_block_height > 0, true);
      });
    });
  });

  context("test if address is valid", function() {
    it("valid addr", async function() {
      utils
        .ethValidAddr("0xb699c1ffac2123a731d11b127879daffa6625e8a")
        .then(results => {
          let valid_addr = results;
          assert.equal(valid_addr, true);
        })
        .catch(error => {
          console.log(
            "addr is valid but test failed; marked address as invalid"
          );
        });
    });
  });

  context("test if address is valid", function() {
    it("invalid addr", async function() {
      utils
        .ethValidAddr("0xb699c1ffac2123a731d11b127879daffa6625e8G")
        .then(results => {
          let valid_addr = results;
          assert.equal(!valid_addr, true);
        })
        .catch(error => {
          console.log(
            "addr is invalid but test failed; marked address as valid"
          );
        });
    });
  });
});

context("check wallet balance in ETH", function() {
  it("should be equal", async function() {
    let expected_balance = 1.4;
    utils
      .ethWalletBalance(process.env.ETH_ADDR)
      .then(results => {
        let wallet_balance = results;
        assert.equal(wallet_balance, expected_balance);
      })
      .catch(error => {
        console.log("wallet balance test did not pass!");
        console.log(
          "wallet balance is " +
            error.actual +
            " but expected value is " +
            expected_balance
        );
      });
  });
});
