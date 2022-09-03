# cardanocli-js

## Overview

This is a library, which wraps the cardano-cli with JavaScript and makes it possible to interact with the cli-commands much faster and more efficient.

#### This library was initially brought by [BerryPool](http://pipool.online/) and currently maintained by [Shareslake](https://www.shareslake.com). You can support the work by delegating to the Berry pool.

#### Donations (ADA):

- Shareslake:
```
addr1q9rsrh7kjhct7llm88dug6l5mh047gq6yq3wt3gjfd6uk3ldch4wp7w7v3ac4wp6q33gz2kemwn8ap6zch0u3za6pypshaa6ry
```
- Berry: 
```
addr1q97x8rfnkw4pmdgnwjzavl8jvg77tuy6wn3wm90x9emwgj8nhh356yzp7k3qwmhe4fk0g5u6kx5ka4rz5qcq4j7mvh2sg67tj5
```


## Prerequisites

- `cardano-node >= 1.29.0`
- `node.js >= 12.19.0`

## Install

#### NPM

```bash
npm install cardanocli-js
```

#### From source

```bash
git clone https://github.com/shareslake/cardanocli-js.git
cd cardanocli-js
npm install
```

## Getting started

```javascript
const CardanocliJs = require("cardanocli-js");
const shelleyGenesisPath = "/home/ada/mainnet-shelley-genesis.json";

const cardanocliJs = new CardanocliJs({ shelleyGenesisPath });

const createWallet = (account) => {
  const payment = cardanocliJs.addressKeyGen(account);
  const stake = cardanocliJs.stakeAddressKeyGen(account);
  cardanocliJs.stakeAddressBuild(account);
  cardanocliJs.addressBuild(account, {
    paymentVkey: payment.vkey,
    stakeVkey: stake.vkey,
  });
  return cardanocliJs.wallet(account);
};

const createPool = (name) => {
  cardanocliJs.nodeKeyGenKES(name);
  cardanocliJs.nodeKeyGen(name);
  cardanocliJs.nodeIssueOpCert(name);
  cardanocliJs.nodeKeyGenVRF(name);
  return cardanocliJs.pool(name);
};

const wallet = createWallet("Ada");
const pool = createPool("Berry");

console.log(wallet.paymentAddr);
console.log(pool.vrf.vkey);
```

Check /examples for more use cases.

## API

- <a href="./API.md">API Documentation</a>

## Structure

All files will be stored and used in the directory you choose when instantiating CardanocliJs (`dir`).
The directory is split in two subfolders `tmp` and `priv`.
In the `tmp` folder are stored protocol paramters, raw transactions, signed transactions and witnesses with unique identifiers.
The `priv` folder is again divided into two subolders holding on one site the pools `pool` and on the other side the wallets `wallet` (like [CNTools](https://cardano-community.github.io/guild-operators/#/) structure).

Example structure:

```
dir
    tmp
        <tx_1.raw>
        ...
    priv
        pool
            Berry
                <Berry.node.vkey>
                <Berry.node.skey>
                <Berry.vrf.vkey>
                ...
        wallet
            Lovelace
                <Lovelace.payment.vkey>
                <Lovelace.stake.skey>
                ...
```

## Tests

Install npm dev dependencies using `npm install --also=dev`.

Tests are using Jest framework and can be run by using `npm -s run test` command.

To configure the test suite, make a copy of `.env.dist` and rename it `.env`. Then change all parameters values to fit your environment.

**Caution**: The `TEST_WORKSPACE_DIR` will be deleted at the end of the test suite. **NEVER USE AN EXISTING DIRECTORY !!!** You may disable this behavior by commenting the cleanup function in `test/index.test.js`:

    afterAll(() => {
        // cleanUpTestDirectory();
    });
