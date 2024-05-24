import CardanoCliJs from "../index";
import { CardanoCliJsOptions } from "../lib/cardanoclijs";

const accountName = "test-account";

const options = new CardanoCliJsOptions({ shelleyGenesisPath: `${__dirname}/assets/shelley-genesis.json` });
const cli = new CardanoCliJs(options);

describe('Query Commands', () => {

    test('query protocol-parameters', () => {
        let obj = cli.query.protocolParameters();

        expect(Object.keys(obj).length).toEqual(17);

        expect(obj.hasOwnProperty('poolDeposit')).toBeTruthy();
        expect(obj.hasOwnProperty('protocolVersion')).toBeTruthy();
        expect(obj.hasOwnProperty('minUTxOValue')).toBeTruthy();
        expect(obj.hasOwnProperty('decentralisationParam')).toBeTruthy();
        expect(obj.hasOwnProperty('maxTxSize')).toBeTruthy();
        expect(obj.hasOwnProperty('minPoolCost')).toBeTruthy();
        expect(obj.hasOwnProperty('minFeeA')).toBeTruthy();
        expect(obj.hasOwnProperty('maxBlockBodySize')).toBeTruthy();
        expect(obj.hasOwnProperty('minFeeB')).toBeTruthy();
        expect(obj.hasOwnProperty('eMax')).toBeTruthy();
        expect(obj.hasOwnProperty('extraEntropy')).toBeTruthy();
        expect(obj.hasOwnProperty('maxBlockHeaderSize')).toBeTruthy();
        expect(obj.hasOwnProperty('stakeAddressDeposit')).toBeTruthy();
        expect(obj.hasOwnProperty('nOpt')).toBeTruthy();
        expect(obj.hasOwnProperty('rho')).toBeTruthy();
        expect(obj.hasOwnProperty('a0')).toBeTruthy();
        expect(obj.hasOwnProperty('rho')).toBeTruthy();
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
        const utxos = cli.query.stakeAddressInfo("addr1qxy8x0f8u8jcvxm46ju8gn5045lc4w55zm2q5gvpx9dpa2m29svphwq5cpa8lnv6q5x3dlkypdh5sw05jlqn9eslwkes0tedq6");
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
