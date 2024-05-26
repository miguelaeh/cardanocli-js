import CardanoCliJs from "../index";
import { CardanoCliJsOptions } from "../lib/cardanoclijs";

const accountName = "test-account";

const options = new CardanoCliJsOptions({ shelleyGenesisPath: `${__dirname}/assets/shelley-genesis.json`, network: "4" });
const cli = new CardanoCliJs(options);

describe('Query Commands', () => {

    test('query protocol-parameters', () => {
        let obj = cli.query.protocolParameters();

	// Just check one field, no need to check all of them
        expect(obj.hasOwnProperty('stakePoolDeposit')).toBeTruthy();
    });

    test('query tip', () => {
        const tip = cli.query.tip();
        expect(tip).toBeTruthy();
    });

    test('query stake-address-info', () => {
        const tip = cli.query.stakeAddressInfo("stake1u94zcxqmhq2vq7nlekdq2rgklmzqkm6g886f0sfjuc0htvcsw9z7c");
        expect(tip).toBeTruthy();
    });

    test('query utxo', () => {
        const utxos = cli.query.utxo("addr_test1qz63slx7l0zmf8wuz76z8sre7pchwgdq8zp28vn9h4xp9cyq7vn27vqzw0ge6kj5r4zm4fpwhszzvkqkwddsy66lxjjqxnc9zk");
        expect(utxos).toBeTruthy();
    });

    test('query gov-state', () => {
        const govState = cli.query.govState();
        expect(govState).toBeTruthy();
    });

    test('query drep-state', () => {
        const state = cli.query.drepState({});
        expect(state).toBeTruthy();
    });

    test('query drep-stake-distribution', () => {
        const stake = cli.query.drepStakeDistribution({});
        expect(stake).toBeTruthy();
    });
});
