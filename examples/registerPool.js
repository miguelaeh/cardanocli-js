const CardanoJs = require("../index.js");
const os = require("os");
const path = require("path");
const fetch = require("sync-fetch");

const dir = path.join(os.homedir());
const shelleyPath = os.homedir();

const cardanoJs = new CardanoJs({
  era: "allegra",
  network: "testnet-magic 1097911063",
  dir: dir,
  shelleyGenesisPath: shelleyPath,
});

const createPool = (name) => {
  cardanoJs.nodeKeyGenKES(name);
  cardanoJs.nodeKeyGen(name);
  cardanoJs.nodeIssueOpCert(name);
  cardanoJs.nodeKeyGenVRF(name);
  return cardanoJs.pool(name);
};

const registerPool = (pool, wallet, data) => {
  let name = pool.name;
  let poolId = cardanoJs.stakePoolId(name);
  let poolCert = cardanoJs.stakePoolRegistrationCertificate(name, data);
  let delegCert = cardanoJs.stakeAddressDelegationCertificate(
    wallet.name,
    poolId
  );
  let poolDeposit = cardanoJs.queryProtcolParameters().poolDeposit;
  let tx = {
    txIn: cardanoJs.queryUtxo(wallet.paymentAddr),
    txOut: [
      { address: wallet.paymentAddr, amount: wallet.balance - poolDeposit },
    ],
    witnessCount: 3,
    certs: [poolCert, delegCert],
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
      wallet.file("payment.skey"),
      wallet.file("stake.skey"),
      pool.file("node.skey"),
    ],
  });
  return txSigned;
};

let pool = createPool("BerryJs");

const wallet = cardanoJs.wallet("Ada");
console.log(wallet);

const poolData = {
  pledge: cardanoJs.toLovelace(100),
  margin: 0.015,
  cost: cardanoJs.toLovelace(340),
  owners: [wallet.file("stake.vkey")],
  rewardAccount: wallet.file("stake.vkey"),
  relays: [
    { host: "relay.one.io", port: 3001 },
    { host: "relay.two.io", port: 3001 },
  ],
  url: "<URL>",
  metaHash: cardanoJs.stakePoolMetadataHash(fetch("<URl>").text()),
};

console.log(poolData);

let tx = registerPool(pool, wallet, poolData);

let txHash = cardanoJs.transactionSubmit(tx);

console.log("TxHash: " + txHash);
