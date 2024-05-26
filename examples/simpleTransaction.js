import { CardanoCliJs, CardanoCliJsOptions } from "../index";

const options = new CardanoCliJsOptions({ shelleyGenesisPath: `${__dirname}/../tests/assets/shelley-genesis.json` });
const cli = new CardanoCliJs(options);

//funded wallet
const sender = "addr_test1qzjlc05tyyw264wy7m4u7np5yqdwglks0xhu6765cl4qex9r9kvav4hmznru9px9n7cpa2hmmv4593eegve3t834xppqwdsllm3km";
const utxos = cli.query.utxo(addr);
const utxoIds = Object.keys(utxos);
const balance = utxos.forEach((utxo) => {
  Object.keys(utxo.value).forEach((asset) => {
    if (!value[asset]) value[asset] = 0;
    value[asset] += utxo.value[asset];
  });
});

//receiver address
const receiver =
  "addr_test1qzjlc05tyyw264wy7m4u7np5yqdwglks0xhu6765cl4qex9r9kvav4hmznru9px9n7cpa2hmmv4593eegve3t834xppqwskp4t";

const amountToSend = 5000000; // 5 ADA
const rawTxFile = cli.transaction.build([
    ...utxoIds.map((u) => ({ name: "tx-in", value: u })),
    { name: 'tx-out', value: `${receiver} ${amountToSend}`},
    { name: "change-address", value: sender },
]);

const signedTxFile = cli.transaction.sign(rawTxFile, [
  `path/to/payment.skey`
]);

cli.transaction.submit(signedTxFile);
