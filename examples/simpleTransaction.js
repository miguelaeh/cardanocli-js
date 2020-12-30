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

//funded wallet
const sender = cardanoJs.wallet("Ales");
console.log(
  "Balance of Sender wallet: " + cardanoJs.toAda(sender.balance) + " ADA"
);

//receiver address
const receiver =
  "addr_test1qzjlc05tyyw264wy7m4u7np5yqdwglks0xhu6765cl4qex9r9kvav4hmznru9px9n7cpa2hmmv4593eegve3t834xppqwskp4t";

// create raw transaction
let txInfo = {
  txIn: cardanoJs.queryUtxo(sender.paymentAddr),
  txOut: [
    {
      address: sender.paymentAddr,
      amount: sender.balance - cardanoJs.toLovelace(5),
    }, //amount going back to sender
    { address: receiver, amount: cardanoJs.toLovelace(5) }, //amount going to receiver
  ],
};
let raw = cardanoJs.transactionBuildRaw(txInfo);

//calculate fee
let fee = cardanoJs.transactionCalculateMinFee({
  ...txInfo,
  txBody: raw,
  witnessCount: 1,
});

//pay the fee by subtracting it from the sender utxo
txInfo.txOut[0].amount -= fee;

//create final transaction
let tx = cardanoJs.transactionBuildRaw({ ...txInfo, fee });

//sign the transaction
let txSigned = cardanoJs.transactionSign({
  txBody: tx,
  signingKeys: [sender.file("payment.skey")],
});

//broadcast transaction
let txHash = cardanoJs.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);
