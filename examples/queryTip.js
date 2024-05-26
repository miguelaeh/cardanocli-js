import { CardanoCliJs, CardanoCliJsOptions } from "../index";

const options = new CardanoCliJsOptions({ shelleyGenesisPath: `${__dirname}/../tests/assets/shelley-genesis.json` });
const cli = new CardanoCliJs(options);

console.log(cli.query.tip());
