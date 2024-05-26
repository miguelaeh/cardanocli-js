# cardanocli-js

## Overview

This is a library wrapping the cardano-cli with TypeScript (can also be used in Javascript projects) which makes it possible to interact with the cardano CLI much faster and more efficient.

## Prerequisites

You need access to a Cardano Node socket. If you have a remote node you can create a ssh tunnel with the socket file as follows:

```
ssh -nNT -L /tmp/forwarded.socket:/path/to/remote/node.socket remote-machine-user@remote-machine-ip
```

## Install

#### NPM

```bash
npm install cardanocli-js
```

#### From source

```bash
git clone https://github.com/miguelaeh/cardanocli-js.git
cd cardanocli-js
npm install
```

## Getting started

```javascript
const CardanocliJs = require("cardanocli-js");
const shelleyGenesisPath = "/home/ada/mainnet-shelley-genesis.json";

const cardanocliJs = new CardanocliJs({ shelleyGenesisPath });

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

const walletAddr = createWallet("my-wallet-name");

console.log("My wallet address:", walletAddr);
```

Check /examples for more use cases.

## Tests

Install npm dev dependencies using `npm install --also=dev`.

Tests are using Jest framework and can be run by using `npm run-script test` command.

Tests are configured to run with the Sancho network. You may need to update your `cardano-cli` binary to the sancho one in order to run the tests.

## Major changes

### 5.0.0

Starting on version `4.0.0` the HTTP provider has been removed. There are better options for that as of today. For example, the blockfrost API.
This means than to use this library you need a fully synced node. And it is, as its name states, a wrapper over the CLI to make your life easier when creating scripts.
If you need to connect to your own remote cardano nodes you can forward the socket via an SSH tunnel:

```
ssh -nNT -L /tmp/forwarded.socket:/path/to/remote/node.socket remote-machine-user@remote-machine-ip
```

For better maintencane, the library has been moved to TypesScript and its internal structure changed.
