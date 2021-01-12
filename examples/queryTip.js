const CardanocliJs = require("../index.js");
const os = require("os");
const path = require("path");

const dir = path.join(os.homedir(), "testnet");
const shelleyPath = path.join(
  os.homedir(),
  "launchpad",
  "launchpad-shelley-genesis.json"
);

const cardanocliJs = new CardanocliJs({
  era: "allegra",
  network: "testnet-magic 1097911063",
  dir: dir,
  shelleyGenesisPath: shelleyPath,
  socketPath: path.join(os.homedir(), "testnet", "db", "socket"),
});

console.log(cardanocliJs.queryTip());
