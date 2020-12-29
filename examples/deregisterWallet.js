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

const deregisterWallet = (wallet) => {
  let account = wallet.name;
  let keyDeposit = cardanoJs.queryProtcolParameters().keyDeposit;
  let stakeCert = cardanoJs.stakeAddressDeregistrationCertificate(account);
  let paymentAddress = cardanoJs.wallet(account).paymentAddr;
  let balance = cardanoJs.wallet(account).balance;
  let tx = {
    txIn: cardanoJs.queryUtxo(paymentAddress),
    txOut: [{ address: paymentAddress, amount: balance + keyDeposit }],
    certs: [stakeCert],
    witnessCount: 2,
  };
  let txBodyRaw = cardanoJs.transactionBuildRaw(tx);
  let fee = cardanoJs.transactionCalculateMinFee({
    ...tx,
    txBody: txBodyRaw,
  });
  tx.txOut[0].amount -= fee;
  let txBody = cardanoJs.transactionBuildRaw({ ...tx, fee });
  let txSigned = cardanoJs.transactionSign({
    txBody,
    signingKeys: [
      cardanoJs.wallet(account).file("payment.skey"),
      cardanoJs.wallet(account).file("stake.skey"),
    ],
  });

  return txSigned;
};

let wallet = cardanoJs.wallet("Test");

console.log(wallet);

let tx = deregisterWallet(wallet);

let txHash = cardanoJs.transactionSubmit(tx);

console.log("TxHash: " + txHash);
