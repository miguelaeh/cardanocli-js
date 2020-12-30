const CardanoJs = require("../index.js");
const os = require("os");
const path = require("path");

const dir = path.join(os.homedir(), "testnet");
const shelleyPath = path.join(
  os.homedir(),
  "testnet",
  "testnet-shelley-genesis.json"
);

const cardanoJs = new CardanoJs({
  era: "allegra",
  network: "testnet-magic 1097911063",
  dir: dir,
  shelleyGenesisPath: shelleyPath,
});

const pool = cardanoJs.pool("BerryJs");

console.log("Generating new KES keys and Node Operational certificate");
cardanoJs.nodeKeyGenKES(pool.name);
cardanoJs.nodeIssueOpCert(pool.name);
