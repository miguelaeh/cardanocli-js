const CardanocliJs = require("../index.js");
const os = require("os");
const path = require("path");

const dir = path.join(os.homedir(), "launchpad");
const shelleyPath = path.join(
  os.homedir(),
  "launchpad",
  "launchpad-shelley-genesis.json"
);

const cardanocliJs = new CardanocliJs({
  era: "mary",
  network: "testnet-magic 3",
  dir: dir,
  shelleyGenesisPath: shelleyPath,
});

const createTransaction = (tx) => {
  let raw = cardanocliJs.transactionBuildRaw(tx);
  let fee = cardanocliJs.transactionCalculateMinFee({
    ...tx,
    txBody: raw,
  });
  tx.txOut[0].amount.lovelace -= fee;
  return cardanocliJs.transactionBuildRaw({ ...tx, fee });
};

const signTransaction = (wallet, tx, script) => {
  return cardanocliJs.transactionSign({
    signingKeys: [wallet.payment.skey, wallet.payment.skey],
    scriptFile: script,
    txBody: tx,
  });
};

let wallet = cardanocliJs.wallet("Berry");
let mintScript = {
  keyHash: cardanocliJs.addressKeyHash(wallet.name),
  type: "sig",
};
let policy = cardanocliJs.transactionPolicyid(mintScript);
const BERRYCOIN = policy + ".Berrycoin";

let tx = {
  txIn: wallet.balance().utxo,
  txOut: [
    {
      address: wallet.paymentAddr,
      amount: { ...wallet.balance().amount, [BERRYCOIN]: 100 },
    },
  ],
  mint: [{ action: "mint", amount: 100, token: BERRYCOIN }],
  witnessCount: 2,
};

let raw = createTransaction(tx);
let signed = signTransaction(wallet, raw, mintScript);
let txHash = cardanocliJs.transactionSubmit(signed);
console.log(txHash);
