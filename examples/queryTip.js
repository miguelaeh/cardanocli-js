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
  httpProvider: "http://192.168.178.114:3000/api/v1",
});

console.log(cardanocliJs.queryTip());

// const pool = cardanocliJs.pool("BerryJs");

// console.log("Generating new KES keys and Node Operational certificate");
// let kes = cardanocliJs.nodeKeyGenKES(pool.name);
// let op = cardanocliJs.nodeIssueOpCert(pool.name);

// console.log(kes);
// console.log(op);
