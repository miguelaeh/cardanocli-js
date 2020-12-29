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

const createWallet = (accout) => {
  cardanoJs.addressKeyGen(accout);
  cardanoJs.stakeAddressKeyGen(accout);
  cardanoJs.stakeAddressBuild(accout);
  cardanoJs.addressBuild(accout);
  return cardanoJs.wallet(accout);
};

const registerWallet = (account) => {
  let keyDeposit = cardanoJs.queryProtcolParameters().keyDeposit;
  let stakeCert = cardanoJs.stakeAddressRegistrationCertificate(account);
  let paymentAddress = cardanoJs.wallet(account).summary.paymentAddr;
  let balance = cardanoJs.wallet(account).summary.balance;
  let tx = {
    txIn: cardanoJs.queryUtxo(paymentAddress),
    txOut: [{ address: paymentAddress, amount: balance - keyDeposit }],
    certs: [stakeCert],
    witnessCount: 2,
  };
  let txBody = cardanoJs.transactionBuildRaw(tx);
  let txSigned = cardanoJs.transactionSign({
    txBody,
    signingKeys: [
      cardanoJs.wallet(account).file("payment.skey").path,
      cardanoJs.wallet(account).file("stake.skey").path,
    ],
  });

  return txSigned;
};

let wallet = cardanoJs.wallet("Ales");

console.log(wallet);

// let tx = registerWallet("Ales");

// cardanoJs.transactionSubmit(tx);
