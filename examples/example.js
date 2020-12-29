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

console.log(cardanoJs.queryProtcolParameters());

console.log(cardanoJs.queryTip());

//query utxo of an address
// console.log(
//   cardanoJs.queryUtxo(
//     "Ae2tdPwUPEYwNguM7TB3dMnZMfZxn1pjGHyGdjaF4mFqZF9L3bj6cdhiH8t"
//   )
// );

//create a wallet

// const createWallet = (accout) => {
//   cardanoJs.addressKeyGen(accout);
//   cardanoJs.stakeAddressKeyGen(accout);
//   cardanoJs.stakeAddressBuild(accout);
//   cardanoJs.addressBuild(accout);
// };

// createWallet("Wow");

//read out wallet info
// console.log(cardanoJs.wallet("Wow"));
//read out wallet file content
// console.log(cardanoJs.wallet("Wow").file("payment.skey"));

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

// cardanoJs.stakeAddressDelegationCertificate(
//   "Wow",
//   cardanoJs.stakePoolId("Cool")
// );

// console.log(cardanoJs.wallet("Wow").stakingAddr);

// cardanoJs.stakeAddressDeregistrationCertificate("Wow");

// console.log(cardanoJs.wallet("Wow").file("stake.vkey"));
// console.log(cardanoJs.stakeAddressKeyHash("Wow"));

// console.log(cardanoJs.addressKeyHash("Wow"));

// console.log(cardanoJs.addressInfo(cardanoJs.wallet("Wow").paymentAddr));

// let script = {
//   scripts: [
//     {
//       keyHash: "2f3d4cf10d0471a1db9f2d2907de867968c27bca6272f062cd1c2413",
//       type: "sig",
//     },
//     {
//       keyHash: "f856c0c5839bab22673747d53f1ae9eed84afafb085f086e8e988614",
//       type: "sig",
//     },
//     {
//       keyHash: "b275b08c999097247f7c17e77007c7010cd19f20cc086ad99d398538",
//       type: "sig",
//     },
//     {
//       keyHash: "686024aecb5884d73a11b9ae4e63931112ba737e878d74638b78513a",
//       type: "sig",
//     },
//   ],
//   required: 2,
//   type: "atLeast",
// };

// let scriptAddr = cardanoJs.addressBuildScript(script);
// console.log(scriptAddr);

// let meta =
//   '{\n  "name": "Berry",\n  "ticker": "BERRY",\n  "description": "Decentralizing Cardano in the most beautiful way - Let\'s shape the future together!",\n  "homepage": "https://pipool.online",\n  "extended": "https://github.com/alessandrokonrad/Pi-Pool/raw/master/meta/extended_poolmeta.json"\n}\n';

// let pool = {
//   pledge: cardanoJs.toLovelace(1000),
//   margin: 0.05,
//   cost: cardanoJs.toLovelace(340),
//   rewardAccount: cardanoJs.wallet("Wow").file("stake.vkey"),
//   url: "https://pool.io",
//   metaHash: cardanoJs.stakePoolMetadataHash(meta),
//   owners: [cardanoJs.wallet("Wow").file("stake.vkey")],
//   relays: [
//     { host: "node.relay.io", port: 3001 },
//     { ip: "79.248.97.37", port: 3005 },
//   ],
// };

// let cert = cardanoJs.stakePoolRegistrationCertificate("Cool", pool);

// let tx = {
//   txIn: cardanoJs.queryUtxo(
//     "Ae2tdPwUPEYwNguM7TB3dMnZMfZxn1pjGHyGdjaF4mFqZF9L3bj6cdhiH8t"
//   ),
//   txOut: [
//     {
//       address: "Ae2tdPwUPEYwNguM7TB3dMnZMfZxn1pjGHyGdjaF4mFqZF9L3bj6cdhiH8t",
//       amount: 1000000,
//     },
//   ],
//   witnessCount: 3,
//   certs: [cardanoJs.wallet("Wow").file("deleg.cert")],
//   withdrawal: {
//     stakingAddress: cardanoJs.wallet("Wow").stakingAddr,
//     reward: 0,
//   },
// };

// let txBody = cardanoJs.transactionBuildRaw(tx);

// //witness0
// let txWitness = cardanoJs.transactionWitness({
//   txBody: txBody,
//   signingKey: cardanoJs.wallet("Wow").file("payment.skey"),
// });

// //witness1
// let txWitness1 = cardanoJs.transactionWitness({
//   txBody: txBody,
//   signingKey: cardanoJs.wallet("Wow").file("payment.skey"),
// });

// let txSigned = cardanoJs.transactionAssemble({
//   txBody: txBody,
//   witnessFiles: [txWitness, txWitness1],
// });

// console.log(txSigned);
