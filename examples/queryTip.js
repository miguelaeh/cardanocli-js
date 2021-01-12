const CardanocliJs = require("../index.js");
const os = require("os");
const path = require("path");

const dir = path.join(os.homedir(), "testnet");
const shelleyPath = path.join(
  os.homedir(),
  "testnet",
  "testnet-shelley-genesis.json"
);

const cardanocliJs = new CardanocliJs({
  httpProvider: "http://192.168.178.33:3000/api/v1", //fetching node information from different location
});

console.log(cardanocliJs.queryTip());
