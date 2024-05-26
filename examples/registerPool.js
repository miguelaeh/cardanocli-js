import CardanoCliJs from "../index";
import { CardanoCliJsOptions } from "../lib/cardanoclijs";

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

const poolName = "test-pool";
const poolKesKeys = cli.node.keyGenKES(poolName);
const poolKeys = cli.node.keyGen(poolName);
const poolOpCert = cli.node.issueOpCert(poolName, {});
const poolVrfKeys = cli.node.keyGenVRF(poolName);

const poolId = cli.stake_pool.id(poolName);
const poolCert = cli.stake_pool.registrationCertificate(poolName, {
  pledge: 100000000,
  margin: 0.0015,
  cost: 340000000,
  url: "https://test-url.com",
  metaHash: cli.stake_pool.metadataHash({
    name: "YourPoolName",
    description: "Your pool description",
    ticker: "TEST",
    homepage: "https://yourpoollink.com"
  }),
  rewardAccountFile: `${cli.options.dir}/priv/wallet/${walletName}/${walletName}.stake.vkey`,
  ownersStakeVKeyFiles: [ `${cli.options.dir}/priv/wallet/${walletName}/${walletName}.stake.vkey` ],
  relays: [
    { host: "relay.one.io", port: 3001 },
    { host: "relay.two.io", port: 3001 },
  ],
});

const stakeAddrDelegCert = cli.stake_address.delegationCertificate(walletName, { stakePoolId: poolId });
const poolDeposit = cli.query.protocolParameters().poolDeposit;

// Just create the transaction as always and sign with 3 witness count:
// `${cli.options.dir}/priv/wallet/${walletName}/${walletName}.payment.skey`
// `${cli.options.dir}/priv/wallet/${walletName}/${walletName}.stake.vkey`
// `${cli.options.dir}/priv/wallet/${poolName}/${poolName}.node.skey`
