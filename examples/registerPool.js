const CardanocliJs = require("../index.js");
const os = require("os");
const path = require("path");
const fetch = require("sync-fetch");

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

const createPool = (name) => {
  cardanocliJs.nodeKeyGenKES(name);
  cardanocliJs.nodeKeyGen(name);
  cardanocliJs.nodeIssueOpCert(name);
  cardanocliJs.nodeKeyGenVRF(name);
  return cardanocliJs.pool(name);
};

const registerPool = (pool, wallet, data) => {
  let name = pool.name;
  let poolId = cardanocliJs.stakePoolId(name);
  let poolCert = cardanocliJs.stakePoolRegistrationCertificate(name, data);
  let delegCert = cardanocliJs.stakeAddressDelegationCertificate(
    wallet.name,
    poolId
  );
  let poolDeposit = cardanocliJs.queryProtocolParameters().poolDeposit;
  let tx = {
    txIn: wallet.balance().utxo,
    txOut: [
      {
        address: wallet.paymentAddr,
        value: { lovelace: wallet.balance().value.lovelace - poolDeposit },
      },
    ],
    witnessCount: 3,
    certs: [{ cert: poolCert }, { cert: delegCert }],
  };
  let txBodyRaw = cardanocliJs.transactionBuildRaw(tx);
  let fee = cardanocliJs.transactionCalculateMinFee({
    ...tx,
    txBody: txBodyRaw,
  });
  tx.txOut[0].value.lovelace -= fee;
  let txBody = cardanocliJs.transactionBuildRaw({ ...tx, fee });
  let txSigned = cardanocliJs.transactionSign({
    txBody,
    signingKeys: [wallet.payment.skey, wallet.stake.skey, pool.node.skey],
  });
  return txSigned;
};

let pool = createPool("BerryJs");

const wallet = cardanocliJs.wallet("Ada");
console.log(wallet);

const poolData = {
  pledge: cardanocliJs.toLovelace(100),
  margin: 0.015,
  cost: cardanocliJs.toLovelace(340),
  owners: [wallet.stake.vkey],
  rewardAccount: wallet.stake.vkey,
  relays: [
    { host: "relay.one.io", port: 3001 },
    { host: "relay.two.io", port: 3001 },
  ],
  url: "<URL>",
  metaHash: cardanocliJs.stakePoolMetadataHash(fetch("<URl>").text()),
};

console.log(poolData);

let tx = registerPool(pool, wallet, poolData);

let txHash = cardanocliJs.transactionSubmit(tx);

console.log("TxHash: " + txHash);
