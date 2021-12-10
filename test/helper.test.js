require('dotenv').config();
const helper = require("../helper.js");
const path = require("path");
const fs = require('fs');
const rimraf = require("rimraf");


let tmpPath = "",
    tmpSignedPath = "",
    tmpWitnessPath = "";

afterAll(() => {
    cleanUpTestDirectory();
});

describe('Basics & Utilities', () => {

    test('queryProtocolParameters()', () => {
      const redeemer = 42
      const redeemerJSON = {
        constructor: 0,
        fields: []
      }

      helper.mintRedeemerToString(tmpPath, redeemer, undefined)
      helper.mintRedeemerToString(tmpPath, undefined, redeemerJSON)
    });
});

function cleanUpTestDirectory() {
    rimraf.sync(process.env.TEST_WORKSPACE_DIR);
}
