import CardanoCliJs from "../index";
import { CardanoCliJsOptions } from "../lib/cardanoclijs";
import fs from 'fs';

const options = new CardanoCliJsOptions({ shelleyGenesisPath: `${__dirname}/../tests/assets/shelley-genesis.json` });
const cli = new CardanoCliJs(options);

const createWallet = (account) => {
  const payment = cardanocliJs.address.keyGen(account);
  const stake = cardanocliJs.stake_address.keyGen(account);
  cardanocliJs.stake_address.build(account);
  const addr = cardanocliJs.address.build(account, {
    paymentVkey: payment.vkey,
    stakeVkey: stake.vkey,
  });
  return addr;
};

const walletName = "test-wallet";
const wallet = createWallet(walletName);
const mintScript = {
  keyHash: cli.address.keyHash(walletName),
  type: "sig",
};
const scriptFile = fs.writeFileSync("/tmp/script.json", JSON.stringify(mintScript));
const policyId = cli.transaction.transactionPolicyId(scriptFile);
const realAssetName = "Berrycoin"
const assetName = Buffer.from(realAssetName).toString('hex')
const BERRYCOIN = policyId + "." + assetName;

const addr = fs.readFileSync(`${cli.options.dir}/priv/wallet/${walletName}/${walletName}.payment.addr`, 'utf8');
const utxos = cli.query.utxo(addr);
const balance = utxos.forEach((utxo) => {
  Object.keys(utxo.value).forEach((asset) => {
    if (!value[asset]) value[asset] = 0;
    value[asset] += utxo.value[asset];
  });
});

// Create raw tx
const raw_opts = [];
for (let utxo of Object.keys(utxos)) {
  raw_opts.push({ name: 'tx-in', value: utxo});
}
raw_opts.push({ name: 'tx-out', value: `${addr} ${balance}`});
// Mint 100 tokens
raw_opts.push({ name: 'mint', value: `100 ${BERRYCOIN}`});
raw_opts.push({ name: 'minting-script-file', value: scriptFile });
const draftTxFile = cli.transaction.buildRaw(raw_opts);
const fee = cli.transaction.calculateMinFee(draftTxFile, utxos.length, 1, 1);

// Create the options again with the correct amount (removing the fee)
const opts = [];
for (let utxo of Object.keys(utxos)) {
  opts.push({ name: 'tx-in', value: utxo});
}
opts.push({ name: 'tx-out', value: `${addr} ${balance - fee}`});
// Mint 100 tokens
opts.push({ name: 'mint', value: `100 ${BERRYCOIN}`});
opts.push({ name: 'minting-script-file', value: scriptFile });
opts.push({ name: 'fee', value: fee });
const rawTxFile = cli.transaction.buildRaw(opts);

const signedTxFile = cli.transaction.sign(rawTxFile, [
  `${cli.options.dir}/priv/wallet/${walletName}/${walletName}.payment.skey`
]);

console.log(cli.transaction.view({ txFile: signedTxFile }));

// Submit the transaction to actually mint the asset
cli.transaction.submit(signedTxFile);
