# CardanoJs

## Overview

### Structure

All files will be stored and used in the directory you choose when instantiating CardanoJs (<code>dir</code>).
The directory is split in two subfolders <code>tmp</code> and <code>priv</code>.
In the <code>tmp</code> folder are stored protocol paramters, raw transactions, signed transactions and witnesses with unique identifiers.
The <code>priv</code> folder is again divided into two subolders holding on one site the pools <code>pool</code> and on the other side the wallets <code>wallet</code>

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
