const CardanoJs = require("./index.js");
const os = require("os");
const path = require("path");

const shelleyPath = "/opt/cardano/pi-core/files/mainnet-shelley-genesis.json";

const cardanoJs = new CardanoJs({
  era: "allegra",
  shelleyGenesisPath: shelleyPath,
});

//query utxo of an address
console.log(
  cardanoJs.queryUtxo(
    "Ae2tdPwUPEYwNguM7TB3dMnZMfZxn1pjGHyGdjaF4mFqZF9L3bj6cdhiH8t"
  )
);

//create a wallet

// const createWallet = (accout) => {
//   cardanoJs.addressKeyGen(accout);
//   cardanoJs.stakeAddressKeyGen(accout);
//   cardanoJs.stakeAddressBuild(accout);
//   cardanoJs.addressBuild(accout);
// };

// createWallet("Wow");

//read out wallet info
console.log(cardanoJs.wallet("Wow").summary);
//read out wallet file content
console.log(cardanoJs.wallet("Wow").file("payment.vkey"));

//create a pool
// const createPool = (pool) => {
//   cardanoJs.nodeKeyGenKES(pool);
//   cardanoJs.nodeKeyGen(pool);
//   cardanoJs.nodeIssueOpCert(pool);
//   cardanoJs.nodeKeyGenVRF(pool);
// };

// createPool("Test");

//pool meta hash
// const poolmeta =
//   '{\n  "name": "Berry",\n  "ticker": "BERRY",\n  "description": "Decentralizing Cardano in the most beautiful way - Let\'s shape the future together!",\n  "homepage": "https://pipool.online",\n  "extended": "https://github.com/alessandrokonrad/Pi-Pool/raw/master/meta/extended_poolmeta.json"\n}\n';

// console.log(cardanoJs.stakePoolMetadataHash(poolmeta));
