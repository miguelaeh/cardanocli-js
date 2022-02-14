require('dotenv').config();
const CardanoJs = require("../index.js");
const path = require("path");
const fs = require('fs');
const rimraf = require("rimraf");

const options = {
    shelleyGenesisPath: process.env.TEST_GENESIS_PATH,
    dir: process.env.TEST_WORKSPACE_DIR,
    era: process.env.TEST_ERA,
    network: process.env.TEST_NETWORK
}

const cardanoJs = new CardanoJs(options);

let tmpPath = "",
    tmpSignedPath = "",
    tmpWitnessPath = "";

afterAll(() => {
    cleanUpTestDirectory();
});

describe('Basics & Utilities', () => {

    test('queryProtocolParameters()', () => {
        let obj = cardanoJs.queryProtocolParameters();
        
        expect(Object.keys(obj).length).toEqual(17);
    
        expect(obj.hasOwnProperty('stakePoolDeposit')).toBeTruthy();
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
    
    test('queryTip()', () => {
        let obj = cardanoJs.queryTip();
    
        expect(Object.keys(obj).length).toEqual(3);
    
        expect(obj.hasOwnProperty('blockNo')).toBeTruthy();
        expect(obj.hasOwnProperty('headerHash')).toBeTruthy();
        expect(obj.hasOwnProperty('slotNo')).toBeTruthy();
    });

    test('KESPeriod()', () => {
        let obj = cardanoJs.KESPeriod();
        expect(typeof obj).toEqual('number');
    });
    
    test('toLovelace(ada)', () => {
        let obj = cardanoJs.toLovelace(100);
    
        expect(obj).toEqual(100000000);
    });
    
    test('toAda(lovelace)', () => {
        let obj = cardanoJs.toAda(100000000);
    
        expect(obj).toEqual(100);
    });

});

describe('Wallet Operations', () => {

    test('addressKeyGen(account)', () => {
        cardanoJs.addressKeyGen(process.env.TEST_ACCOUNT_NAME);
    
        let keysPath = path.join(cardanoJs.dir, 'priv', 'wallet', process.env.TEST_ACCOUNT_NAME),
            vkey = path.join(keysPath, `${process.env.TEST_ACCOUNT_NAME}.payment.vkey`),
            skey = path.join(keysPath, `${process.env.TEST_ACCOUNT_NAME}.payment.skey`);
    
        expect(fs.existsSync(vkey)).toBeTruthy();
        expect(fs.existsSync(skey)).toBeTruthy();
    });
    
    test('stakeAddressKeyGen(account)', () => {
        cardanoJs.stakeAddressKeyGen(process.env.TEST_ACCOUNT_NAME);
    
        let keysPath = path.join(cardanoJs.dir, 'priv', 'wallet', process.env.TEST_ACCOUNT_NAME),
            vkey = path.join(keysPath, `${process.env.TEST_ACCOUNT_NAME}.stake.vkey`),
            skey = path.join(keysPath, `${process.env.TEST_ACCOUNT_NAME}.stake.skey`);
    
        expect(fs.existsSync(vkey)).toBeTruthy();
        expect(fs.existsSync(skey)).toBeTruthy();
    });

    test('stakeAddressBuild(account)', () => {
        cardanoJs.stakeAddressBuild(process.env.TEST_ACCOUNT_NAME);
    
        let keysPath = path.join(cardanoJs.dir, 'priv', 'wallet', process.env.TEST_ACCOUNT_NAME),
            addr = path.join(keysPath, `${process.env.TEST_ACCOUNT_NAME}.stake.addr`);
    
        expect(fs.existsSync(addr)).toBeTruthy();
    });
    
    test('addressBuild(account)', () => {
        cardanoJs.addressBuild(process.env.TEST_ACCOUNT_NAME);
    
        let keysPath = path.join(cardanoJs.dir, 'priv', 'wallet', process.env.TEST_ACCOUNT_NAME),
            addr = path.join(keysPath, `${process.env.TEST_ACCOUNT_NAME}.payment.addr`);
    
        expect(fs.existsSync(addr)).toBeTruthy();
    });

    test('addressBuildScript(script)', () => {

        let script = {
            "scripts": [
                {
                    "keyHash": "e09d36c79dec9bd1b3d9e152247701cd0bb860b5ebfd1de8abb6735a",
                    "type": "sig"
                },
                {
                    "keyHash": "a687dcc24e00dd3caafbeb5e68f97ca8ef269cb6fe971345eb951756",
                    "type": "sig"
                }
            ],
            "type": "all"
        };
    
        let obj = cardanoJs.addressBuildScript(script);
    
        expect(typeof obj).toEqual('string');
    });

    test('queryStakeAddressInfo(address)', () => {
        let obj = cardanoJs.queryStakeAddressInfo(process.env.TEST_STAKE_ADDRESS);
        
        expect(Array.isArray(obj)).toBeTruthy();
    
        obj = obj[0];
    
        expect(Object.keys(obj).length).toEqual(3);
    
        expect(obj.hasOwnProperty('address')).toBeTruthy();
        expect(obj.hasOwnProperty('delegation')).toBeTruthy();
        expect(obj.hasOwnProperty('rewardAccountBalance')).toBeTruthy();
    });
    
    test('queryUtxo(address)', () => {
        let obj = cardanoJs.queryUtxo(process.env.TEST_PAYMENT_ADDRESS);
        
        expect(Array.isArray(obj)).toBeTruthy();
        
        obj = obj[0];
    
        expect(Object.keys(obj).length).toEqual(3);
    
        expect(obj.hasOwnProperty('txHash')).toBeTruthy();
        expect(obj.hasOwnProperty('txId')).toBeTruthy();
        expect(obj.hasOwnProperty('amount')).toBeTruthy();
    });

    test('addressInfo(address)', () => {
        let obj = cardanoJs.addressInfo(process.env.TEST_PAYMENT_ADDRESS);
    
        expect(Object.keys(obj).length).toEqual(5);
    
        expect(obj.hasOwnProperty('address')).toBeTruthy();
        expect(obj.hasOwnProperty('base16')).toBeTruthy();
        expect(obj.hasOwnProperty('type')).toBeTruthy();
        expect(obj.hasOwnProperty('encoding')).toBeTruthy();
        expect(obj.hasOwnProperty('era')).toBeTruthy();
    });

    test('stakeAddressRegistrationCertificate(account)', () => {
        let obj = cardanoJs.stakeAddressRegistrationCertificate(process.env.TEST_ACCOUNT_NAME);
    
        expect(typeof obj).toEqual('string');
        expect(fs.existsSync(obj)).toBeTruthy();
    });
    
    test('stakeAddressDeregistrationCertificate(account)', () => {
        let obj = cardanoJs.stakeAddressDeregistrationCertificate(process.env.TEST_ACCOUNT_NAME);
    
        expect(typeof obj).toEqual('string');
        expect(fs.existsSync(obj)).toBeTruthy();
    });
    
    test('stakeAddressDelegationCertificate(account, poolId)', () => {
        let obj = cardanoJs.stakeAddressDelegationCertificate(
            process.env.TEST_ACCOUNT_NAME, process.env.TEST_POOL_ID);
        
        expect(typeof obj).toEqual('string');
        expect(fs.existsSync(obj)).toBeTruthy();
    });
    
    test('stakeAddressKeyHash(account)', () => {
        let obj = cardanoJs.stakeAddressKeyHash(process.env.TEST_ACCOUNT_NAME);
        
        expect(typeof obj).toEqual('string');
    });

    test('addressKeyHash(account)', () => {
        let obj = cardanoJs.addressKeyHash(process.env.TEST_ACCOUNT_NAME);
    
        expect(typeof obj).toEqual('string');
    });

    test('wallet(account)', () => {
        let obj = cardanoJs.wallet(process.env.TEST_ACCOUNT_NAME);
    
        expect(Object.keys(obj).length).toEqual(8);
    
        expect(obj.hasOwnProperty('name')).toBeTruthy();
        expect(obj.hasOwnProperty('paymentAddr')).toBeTruthy();
        expect(obj.hasOwnProperty('stakingAddr')).toBeTruthy();
        expect(obj.hasOwnProperty('balance')).toBeTruthy();
        expect(obj.hasOwnProperty('reward')).toBeTruthy();
    
        expect(obj.hasOwnProperty('deleg')).toBeTruthy();
        expect(Object.keys(obj.deleg).length).toEqual(1);
        expect(obj.deleg.hasOwnProperty('cert')).toBeTruthy();
    
        expect(obj.hasOwnProperty('payment')).toBeTruthy();
        expect(Object.keys(obj.payment).length).toEqual(3);
        expect(obj.payment.hasOwnProperty('addr')).toBeTruthy();
        expect(obj.payment.hasOwnProperty('skey')).toBeTruthy();
        expect(obj.payment.hasOwnProperty('vkey')).toBeTruthy();
    
        expect(obj.hasOwnProperty('stake')).toBeTruthy();
        expect(Object.keys(obj.stake).length).toEqual(4);
        expect(obj.stake.hasOwnProperty('addr')).toBeTruthy();
        expect(obj.stake.hasOwnProperty('skey')).toBeTruthy();
        expect(obj.stake.hasOwnProperty('vkey')).toBeTruthy();
        expect(obj.stake.hasOwnProperty('cert')).toBeTruthy();    
    });
    
    test('wallet(account).balance()', () => {
        let obj = cardanoJs.wallet(process.env.TEST_ACCOUNT_NAME).balance();
    
        expect(Object.keys(obj).length).toEqual(2);
        expect(obj.hasOwnProperty('utxo')).toBeTruthy();
        expect(obj.hasOwnProperty('amount')).toBeTruthy();
            
    });
    
    test('wallet(account).reward()', () => {
        let obj = cardanoJs.wallet(process.env.TEST_ACCOUNT_NAME).reward();
    
        if ('string' === typeof obj) {
            expect(obj).toEqual('Staking key is not registered');
        } else {
            expect(typeof obj).toEqual('number');
        }
    });
});

describe('Pool Operations', () => {

    test('nodeKeyGenKES(poolName)', () => {
        cardanoJs.nodeKeyGenKES(process.env.TEST_POOL_NAME);
        
        let keysPath = path.join(cardanoJs.dir, 'priv', 'pool', process.env.TEST_POOL_NAME),
            vkey = path.join(keysPath, `${process.env.TEST_POOL_NAME}.kes.vkey`),
            skey = path.join(keysPath, `${process.env.TEST_POOL_NAME}.kes.skey`);
    
        expect(fs.existsSync(vkey)).toBeTruthy();
        expect(fs.existsSync(skey)).toBeTruthy();
    });
    
    test('nodeKeyGen(poolName)', () => {
        cardanoJs.nodeKeyGen(process.env.TEST_POOL_NAME);
        
        let keysPath = path.join(cardanoJs.dir, 'priv', 'pool', process.env.TEST_POOL_NAME),
            vkey = path.join(keysPath, `${process.env.TEST_POOL_NAME}.node.vkey`),
            skey = path.join(keysPath, `${process.env.TEST_POOL_NAME}.node.skey`),
            counter = path.join(keysPath, `${process.env.TEST_POOL_NAME}.node.counter`);
    
        expect(fs.existsSync(vkey)).toBeTruthy();
        expect(fs.existsSync(skey)).toBeTruthy();
        expect(fs.existsSync(counter)).toBeTruthy();
    });
    
    test('nodeIssueOpCert(poolName)', () => {
        cardanoJs.nodeIssueOpCert(process.env.TEST_POOL_NAME);
        
        let keysPath = path.join(cardanoJs.dir, 'priv', 'pool', process.env.TEST_POOL_NAME),
            cert = path.join(keysPath, `${process.env.TEST_POOL_NAME}.node.cert`);
    
        expect(fs.existsSync(cert)).toBeTruthy();
    });
    
    test('nodeKeyGenVRF(poolName)', () => {
        cardanoJs.nodeKeyGenVRF(process.env.TEST_POOL_NAME);
        
        let keysPath = path.join(cardanoJs.dir, 'priv', 'pool', process.env.TEST_POOL_NAME),
            vkey = path.join(keysPath, `${process.env.TEST_POOL_NAME}.vrf.vkey`),
            skey = path.join(keysPath, `${process.env.TEST_POOL_NAME}.vrf.skey`);
    
        expect(fs.existsSync(vkey)).toBeTruthy();
        expect(fs.existsSync(skey)).toBeTruthy();
    });
    
    test('stakePoolId(poolName)', () => {
        let obj = cardanoJs.stakePoolId(process.env.TEST_POOL_NAME);
        
        expect(typeof obj).toEqual('string');
    });
    
    test('stakePoolMetadataHash(metadata)', () => {
        let obj = cardanoJs.stakePoolMetadataHash(
            `{
                "name": "Hello World",
                "description": "Hello World is the best pool ever!",
                "ticker": "HELLO",
                "homepage": "https://pool.com/",
                "extended": "https://pool.com/ext.json"
              }`
        );
        
        expect(typeof obj).toEqual('string');
    });
    
    test('stakePoolRegistrationCertificate(poolName, options)', () => {
        let obj = cardanoJs.stakePoolRegistrationCertificate(
            process.env.TEST_POOL_NAME,
            {
                pledge: cardanoJs.toLovelace(100000),
                margin: 0.05,
                cost: cardanoJs.toLovelace(340),
                owners: [cardanoJs.wallet(process.env.TEST_ACCOUNT_NAME).stake.vkey],
                rewardAccount: cardanoJs.wallet(process.env.TEST_ACCOUNT_NAME).stake.vkey,
                relays: [
                  { host: "relay.one.io", port: 3001 },
                  { host: "relay.two.io", port: 3001 },
                ],
                url: "my-metadata-hash.com",
                metaHash: "364261d6b5d896492f1d741303a7568ef0eddade304a5a67d0bf8700a644c6be",
            }
        );
    
        expect(typeof obj).toEqual('string');
        expect(fs.existsSync(obj)).toBeTruthy();
    });
    
    test('stakePoolDeregistrationCertificate(poolName, epoch)', () => {
        let obj = cardanoJs.stakePoolDeregistrationCertificate(process.env.TEST_POOL_NAME, 0);
    
        expect(typeof obj).toEqual('string');
        expect(fs.existsSync(obj)).toBeTruthy();
    });

    test('pool(poolName)', () => {
        let obj = cardanoJs.pool(process.env.TEST_POOL_NAME);
    
        expect(Object.keys(obj).length).toEqual(6);
    
        expect(obj.hasOwnProperty('name')).toBeTruthy();
        expect(obj.hasOwnProperty('id')).toBeTruthy();
    
        expect(obj.hasOwnProperty('kes')).toBeTruthy();
        expect(Object.keys(obj.kes).length).toEqual(2);
        expect(obj.kes.hasOwnProperty('skey')).toBeTruthy();
        expect(obj.kes.hasOwnProperty('vkey')).toBeTruthy();
    
        expect(obj.hasOwnProperty('node')).toBeTruthy();
        expect(Object.keys(obj.node).length).toEqual(4);
        expect(obj.node.hasOwnProperty('cert')).toBeTruthy();
        expect(obj.node.hasOwnProperty('counter')).toBeTruthy();
        expect(obj.node.hasOwnProperty('skey')).toBeTruthy();
        expect(obj.node.hasOwnProperty('vkey')).toBeTruthy();
        
        expect(obj.hasOwnProperty('pool')).toBeTruthy();
        expect(Object.keys(obj.pool).length).toEqual(1);
        expect(obj.pool.hasOwnProperty('cert')).toBeTruthy();
    
        expect(obj.hasOwnProperty('vrf')).toBeTruthy();
        expect(Object.keys(obj.vrf).length).toEqual(2);
        expect(obj.vrf.hasOwnProperty('skey')).toBeTruthy();
        expect(obj.vrf.hasOwnProperty('vkey')).toBeTruthy();
    });
});

describe('Transactions Building', () => {

    test('transactionBuildRaw(options)', () => {
        let obj = cardanoJs.transactionBuildRaw({
            txIn: [ 
                { 
                    txHash: '14800565f4adf3cb49ce7a61b26f966f742b8235ce9b6f926bc96773d361bf17',
                    txId: 0
                },
                {
                    txHash: '6535fb0b73645d79f05dce69fb148a6f0ce14fea8875bfa44d0f42d493da6951',
                    txId: 1
                }
            ],
            txOut: [
                {
                    address: process.env.TEST_PAYMENT_ADDRESS,
                    amount: cardanoJs.toLovelace(1000)
                },
                {
                    address: process.env.TEST_PAYMENT_ADDRESS,
                    amount: cardanoJs.toLovelace(500)
                }
            ],
            certs: [
                cardanoJs.wallet(process.env.TEST_ACCOUNT_NAME).stake.cert,
                cardanoJs.pool(process.env.TEST_POOL_NAME).pool.cert
            ]
        });
    
        expect(typeof obj).toEqual('string');
        expect(fs.existsSync(obj)).toBeTruthy();
    
        tmpPath = obj;
    });
    
    test('transactionCalculateMinFee(options)', () => {
        let obj = cardanoJs.transactionCalculateMinFee({
            txBody: tmpPath,
            txIn: [
                {
                    txHash: '14800565f4adf3cb49ce7a61b26f966f742b8235ce9b6f926bc96773d361bf17',
                    txId: 0
                },
                {
                    txHash: '6535fb0b73645d79f05dce69fb148a6f0ce14fea8875bfa44d0f42d493da6951',
                    txId: 1
                }
            ],
            txOut: [
                {
                    address: process.env.TEST_PAYMENT_ADDRESS,
                    amount: cardanoJs.toLovelace(1000)
                },
                {
                    address: process.env.TEST_PAYMENT_ADDRESS,
                    amount: cardanoJs.toLovelace(500)
                }
            ],
            witnessCount: 2
        });
    
        expect(typeof obj).toEqual('number');
    });
    
    test('transactionSign(options)', () => {
        let obj = cardanoJs.transactionSign({
            txBody: tmpPath,
            signingKeys: [
                cardanoJs.wallet(process.env.TEST_ACCOUNT_NAME).payment.skey,
                cardanoJs.wallet(process.env.TEST_ACCOUNT_NAME).stake.skey
            ]
        });
    
        expect(typeof obj).toEqual('string');
        expect(fs.existsSync(obj)).toBeTruthy();
    
        tmpSignedPath = obj;
    });
    
    test('transactionWitness(options)', () => {
        let obj = cardanoJs.transactionWitness({
            txBody: tmpPath,
            signingKey: cardanoJs.wallet(process.env.TEST_ACCOUNT_NAME).payment.skey
        });
    
        expect(typeof obj).toEqual('string');
        expect(fs.existsSync(obj)).toBeTruthy();
    
        tmpWitnessPath = obj;
    });
    
    test('transactionAssemble(options)', () => {
        let obj = cardanoJs.transactionAssemble({
            txBody: tmpPath,
            witnessFiles: [tmpWitnessPath, tmpWitnessPath]
        });
    
        expect(typeof obj).toEqual('string');
        expect(fs.existsSync(obj)).toBeTruthy();
    });
    
    test('transactionTxid(options)', () => {
        let obj1 = cardanoJs.transactionTxid({
            txBody: tmpPath
        });
        expect(typeof obj1).toEqual('string');
    
        let obj2 = cardanoJs.transactionTxid({
            txFile: tmpSignedPath
        });
        expect(typeof obj2).toEqual('string');
    
        expect(obj1).toEqual(obj2);
    });

});

function cleanUpTestDirectory() {   
    rimraf.sync(process.env.TEST_WORKSPACE_DIR);
}
