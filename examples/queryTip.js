import CardanoCliJs from "../index";
import { CardanoCliJsOptions } from "../lib/cardanoclijs";

const options = new CardanoCliJsOptions({ shelleyGenesisPath: `${__dirname}/../tests/assets/shelley-genesis.json` });
const cli = new CardanoCliJs(options);

console.log(cli.query.tip());
