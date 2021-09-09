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
  network: "testnet-magic 1097911063",
  era: "alonzo",
  dir: dir,
  shelleyGenesisPath: shelleyPath,
  socketPath: path.join(os.homedir(), "testnet", "db", "socket"),
});

console.log(cardanocliJs.queryTip());
