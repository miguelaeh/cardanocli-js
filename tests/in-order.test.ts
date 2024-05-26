import CardanoCliJs from "../index";
import { CardanoCliJsOptions } from "../lib/cardanoclijs";
import fs from 'fs';

const accountName = "test-account";

const options = new CardanoCliJsOptions({ shelleyGenesisPath: `${__dirname}/assets/shelley-genesis.json`, network: "4" });
const cli = new CardanoCliJs(options);

let stakeAddrFile = "";

describe('Stake Address Commands', () => {
    test('stake address key-gen', () => {
        const { vkey, skey } = cli.stake_address.keyGen(accountName);

        expect(fs.existsSync(vkey)).toBe(true);
        expect(fs.existsSync(skey)).toBe(true);

        // Check if files are not empty
        expect(fs.statSync(vkey).size).toBeGreaterThan(0);
        expect(fs.statSync(skey).size).toBeGreaterThan(0);
    });

    test('stake address build', () => {
        stakeAddrFile = cli.stake_address.build(accountName);
        expect(fs.existsSync(stakeAddrFile)).toBe(true);
        // Check if files are not empty
        expect(fs.statSync(stakeAddrFile).size).toBeGreaterThan(0);
    });

    test('stake address key-hash', () => {
        const hash = cli.stake_address.keyHash(accountName);
        expect(hash).toBeTruthy();
    });

    test('stake address registration-certificate', () => {
        const certFile = cli.stake_address.registrationCertificate(accountName);
        expect(fs.existsSync(certFile)).toBe(true);
        // check it is non empty
        expect(fs.statSync(certFile).size).toBeGreaterThan(0);
    });
    test('stake address deregistration-certificate', () => {
        const certFile = cli.stake_address.deRegistrationCertificate(accountName, {});
        expect(fs.existsSync(certFile)).toBe(true);
        // check it is non empty
        expect(fs.statSync(certFile).size).toBeGreaterThan(0);
    });
    test('stake address delegation-certificate', () => {
        const certFile = cli.stake_address.delegationCertificate(accountName, { stakePoolId: "pool16agnvfan65ypnswgg6rml52lqtcqe5guxltexkn82sqgj2crqtx" });
        expect(fs.existsSync(certFile)).toBe(true);
        // check it is non empty
        expect(fs.statSync(certFile).size).toBeGreaterThan(0);
    });
});

const poolName = "test-pool";
let metadataHash = "";

describe('Node Commands', () => {
    test('node key-gen', () => {
        const { vkey, skey, counter } = cli.node.keyGen(poolName);

        expect(fs.existsSync(vkey)).toBe(true);
        expect(fs.existsSync(skey)).toBe(true);
        expect(fs.existsSync(counter)).toBe(true);

        // Check if files are not empty
        expect(fs.statSync(vkey).size).toBeGreaterThan(0);
        expect(fs.statSync(skey).size).toBeGreaterThan(0);
        expect(fs.statSync(counter).size).toBeGreaterThan(0);
    });

    test('node key-gen-kes', () => {
        const { vkey, skey } = cli.node.keyGenKES(poolName);

        expect(fs.existsSync(vkey)).toBe(true);
        expect(fs.existsSync(skey)).toBe(true);

        // Check if files are not empty
        expect(fs.statSync(vkey).size).toBeGreaterThan(0);
        expect(fs.statSync(skey).size).toBeGreaterThan(0);
    });

    test('node key-gen-vrf', () => {
        const { vkey, skey } = cli.node.keyGenVRF(poolName);

        expect(fs.existsSync(vkey)).toBe(true);
        expect(fs.existsSync(skey)).toBe(true);

        // Check if files are not empty
        expect(fs.statSync(vkey).size).toBeGreaterThan(0);
        expect(fs.statSync(skey).size).toBeGreaterThan(0);
    });

    test('node key-hash-vrf', () => {
        const hash = cli.node.keyHashVRF(poolName);
        expect(hash).toBeTruthy();
    });

    test('node new-counter', () => {
        const counterFile = cli.node.newCounter(poolName, 2);
        expect(fs.existsSync(counterFile)).toBe(true);
        // Check if files are not empty
        expect(fs.statSync(counterFile).size).toBeGreaterThan(0);
    });

    test('node issue-op-cert', () => {
        const certFile = cli.node.issueOpCert(poolName, {});
        expect(fs.existsSync(certFile)).toBe(true);
        // Check if files are not empty
        expect(fs.statSync(certFile).size).toBeGreaterThan(0);
    });
});

let paymentAddrFile = "";

describe('Address Commands', () => {
    test('address key-gen', () => {
        const { vkey, skey } = cli.address.keyGen(accountName);

        expect(fs.existsSync(vkey)).toBe(true);
        expect(fs.existsSync(skey)).toBe(true);

        // Check if files are not empty
        expect(fs.statSync(vkey).size).toBeGreaterThan(0);
        expect(fs.statSync(skey).size).toBeGreaterThan(0);
    });

    test('address build', () => {
        paymentAddrFile = cli.address.build(accountName, {});
        expect(fs.existsSync(paymentAddrFile)).toBe(true);
        // Check if files are not empty
        expect(fs.statSync(paymentAddrFile).size).toBeGreaterThan(0);
    });

//    test('address build with scripts', () => {
//        const scriptFile = `${__dirname}/assets/address-script-file.json`;
//        paymentAddrFile = cli.address.build(accountName, {
//            paymentScriptFile: scriptFile,
//        });
//        expect(fs.existsSync(paymentAddrFile)).toBe(true);
//        // Check if files are not empty
//        expect(fs.statSync(paymentAddrFile).size).toBeGreaterThan(0);
//    });

    test('address key-hash', () => {
        const hash = cli.address.keyHash(accountName);
        expect(hash).toBeTruthy();
    });

    test('address info', () => {
        const address = fs.readFileSync(paymentAddrFile, "utf-8");
        const info = cli.address.info(address);
        expect(info).toBeTruthy();
    });
});

describe('Stake Pool Commands', () => {
    test('stake-pool id', () => {
        const id = cli.stake_pool.id(poolName);
        expect(id).toBeTruthy();
    });

    test('stake-pool metadata-hash', () => {
        const metadata = {
            name: "YourPoolName",
            description: "Your pool description",
            ticker: "TEST",
            homepage: "https://yourpoollink.com"
        };
        metadataHash = cli.stake_pool.metadataHash(metadata);
        expect(metadataHash).toBeTruthy();
    });

    test('stake-pool registration-certificate', () => {
        const certFile = cli.stake_pool.registrationCertificate(
            poolName,
            {
                pledge: 3,
                margin: 0.001,
                cost: 5,
                url: "https://test.example.com/pool",
                metaHash: metadataHash,
                rewardAccountFile: `priv/wallet/${accountName}/${accountName}.stake.vkey`,
                ownersStakeVKeyFiles: [`priv/wallet/${accountName}/${accountName}.stake.vkey`],
                relays: [{ host: "some-node.com", port: 1111 }],
            },
        );

        expect(fs.existsSync(certFile)).toBe(true);
        // Check if files are not empty
        expect(fs.statSync(certFile).size).toBeGreaterThan(0);
    });

    test('stake-pool deregistration-certificate', () => {
        const certFile = cli.stake_pool.deRegistrationCertificate(poolName, 30);
        expect(fs.existsSync(certFile)).toBe(true);
        // Check if files are not empty
        expect(fs.statSync(certFile).size).toBeGreaterThan(0);
    });
});

let rawTxFilePath = "";
let txFilePath = "";
let minFee = 0;

describe('Transaction Commands', () => {
    test('transcation build-raw', () => {
        // NOTE: We use a mock transaction for the tests, we won't submit it
        rawTxFilePath = cli.transaction.buildRaw([
            { name: "tx-in", value: "4e3a6e7fdcb0d0efa17bf79c13aed2b4cb9baf37fb1aa2e39553d5bd720c5c99#4" },
            { name: "tx-out", value: "addr_test1wr64gtafm8rpkndue4ck2nx95u4flhwf643l2qmg9emjajg2ww0nj+0" },
            { name: "tx-out", value: "addr_test1wr64gtafm8rpkndue4ck2nx95u4flhwf643l2qmg9emjajg2ww0nj+0" },
        ]);

        expect(fs.existsSync(rawTxFilePath)).toBe(true);
        // Check if files are not empty
        expect(fs.statSync(rawTxFilePath).size).toBeGreaterThan(0);
    });

    test('transaction calculate-min-fee', () => {
        // NOTE: We use the txInCount, txOutCount and witnessCount based on the TX hardcoded above
        minFee = cli.transaction.calculateMinFee(rawTxFilePath, 1, 2, 1);
        expect(minFee).toBeTruthy();
    });

    test('transaction build', () => {
        // NOTE: We use a mock transaction for the tests, we won't submit it
        // TODO: this is an unstable test as it depends on the address below and that the UTxOs do not contain assets in the future
        const utxos = cli.query.utxo("addr_test1qz63slx7l0zmf8wuz76z8sre7pchwgdq8zp28vn9h4xp9cyq7vn27vqzw0ge6kj5r4zm4fpwhszzvkqkwddsy66lxjjqxnc9zk");
        const utxoIds = Object.keys(utxos);
        txFilePath = cli.transaction.build([
            { name: "tx-in", value: utxoIds[0] },
            { name: "tx-out", value: "addr_test1qz63slx7l0zmf8wuz76z8sre7pchwgdq8zp28vn9h4xp9cyq7vn27vqzw0ge6kj5r4zm4fpwhszzvkqkwddsy66lxjjqxnc9zk+1000000" },
            { name: "change-address", value: "addr_test1qz63slx7l0zmf8wuz76z8sre7pchwgdq8zp28vn9h4xp9cyq7vn27vqzw0ge6kj5r4zm4fpwhszzvkqkwddsy66lxjjqxnc9zk" },
        ]);

        expect(fs.existsSync(txFilePath)).toBe(true);
        // Check if files are not empty
        expect(fs.statSync(txFilePath).size).toBeGreaterThan(0);
    });

    test('transaction sign', () => {
        // NOTE: the sKey does not really belong to the hash hardcoded above, just used to test the sign command
        const minFee = cli.transaction.sign(txFilePath, ['priv/wallet/test-account/test-account.payment.skey']);
        expect(minFee).toBeTruthy();
    });

    test('transaction tx-id', () => {
        const id = cli.transaction.txId({ txFile: txFilePath });
        expect(id).toBeTruthy();
    });

    test('transaction view', () => {
        const view = cli.transaction.txId({ txFile: txFilePath });
        expect(view).toBeTruthy();
    });
});
