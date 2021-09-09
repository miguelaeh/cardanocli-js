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
  dir: dir,
  shelleyGenesisPath: shelleyPath,
});

const createTransaction = (tx) => {
  let raw = cardanocliJs.transactionBuildRaw(tx);
  let fee = cardanocliJs.transactionCalculateMinFee({
    ...tx,
    txBody: raw,
  });
  tx.txOut[0].value.lovelace -= fee;
  return cardanocliJs.transactionBuildRaw({ ...tx, fee });
};

const signTransaction = (wallet, tx, script) => {
  return cardanocliJs.transactionSign({
    signingKeys: [wallet.payment.skey, wallet.payment.skey],
    txBody: tx,
  });
};

const wallet = cardanocliJs.wallet("Berry");
const mintScript = {
  keyHash: cardanocliJs.addressKeyHash(wallet.name),
  type: "sig",
};
const policy = cardanocliJs.transactionPolicyid(mintScript);
const BERRYCOIN = policy + ".Berrycoin";

const tx = {
  txIn: wallet.balance().utxo,
  txOut: [
    {
      address: wallet.paymentAddr,
      value: { ...wallet.balance().value, [BERRYCOIN]: 100 },
    },
  ],
  mint: [
    { action: "mint", quantity: 100, asset: BERRYCOIN, script: mintScript },
  ],
  witnessCount: 2,
};

const raw = createTransaction(tx);
const signed = signTransaction(wallet, raw);
console.log(cardanocliJs.transactionView({ txFile: signed }));
const txHash = cardanocliJs.transactionSubmit(signed);
console.log(txHash);
