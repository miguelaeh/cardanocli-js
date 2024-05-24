import CardanoCliJs from "../index";
import { CardanoCliJsOptions } from "../lib/cardanoclijs";
import fs from 'fs';

const options = new CardanoCliJsOptions({ shelleyGenesisPath: `${__dirname}/../tests/assets/shelley-genesis.json` });
const cli = new CardanoCliJs(options);

//funded wallet
const sender = "addr_test1qzjlc05tyyw264wy7m4u7np5yqdwglks0xhu6765cl4qex9r9kvav4hmznru9px9n7cpa2hmmv4593eegve3t834xppqwdsllm3km";
const utxos = cli.query.utxo(addr);
const balance = utxos.forEach((utxo) => {
  Object.keys(utxo.value).forEach((asset) => {
    if (!value[asset]) value[asset] = 0;
    value[asset] += utxo.value[asset];
  });
});

//receiver address
const receiver =
  "addr_test1qzjlc05tyyw264wy7m4u7np5yqdwglks0xhu6765cl4qex9r9kvav4hmznru9px9n7cpa2hmmv4593eegve3t834xppqwskp4t";
// Create raw tx
const raw_opts = [];
for (let utxo of utxos) {
  raw_opts.push({ name: 'tx-in', value: `${utxo.txHash}#${utxo.txId}`});
}
raw_opts.push({ name: 'tx-out', value: `${receiver} ${balance}`});

const draftTxFile = cli.transaction.buildRaw(raw_opts);
const fee = cli.transaction.calculateMinFee(draftTxFile, utxos.length, 1, 1);

// Create the options again with the correct amount (removing the fee)
const opts = [];
for (let utxo of utxos) {
  opts.push({ name: 'tx-in', value: `${utxo.txHash}#${utxo.txId}`});
}
opts.push({ name: 'tx-out', value: `${receiver} ${balance - fee}`});
opts.push({ name: 'fee', value: fee });
const rawTxFile = cli.transaction.buildRaw(opts);

const signedTxFile = cli.transaction.sign(rawTxFile, [
  `path/to/payment.skey`
]);

cli.transaction.submit(signedTxFile);
