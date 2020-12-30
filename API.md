## Classes

<dl>
<dt><a href="#CardanoJs">CardanoJs</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#lovelace">lovelace</a></dt>
<dd></dd>
<dt><a href="#path">path</a></dt>
<dd></dd>
<dt><a href="#paymentAddr">paymentAddr</a></dt>
<dd></dd>
<dt><a href="#stakeAddr">stakeAddr</a></dt>
<dd></dd>
<dt><a href="#wallet">wallet</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#pool">pool</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="CardanoJs"></a>

## CardanoJs

**Kind**: global class

- [CardanoJs](#CardanoJs)
  - [new CardanoJs(options)](#new_CardanoJs_new)
  - [.queryProtcolParameters()](#CardanoJs+queryProtcolParameters) ⇒ <code>object</code>
  - [.queryTip()](#CardanoJs+queryTip) ⇒ <code>object</code>
  - [.queryStakeAddressInfo(address)](#CardanoJs+queryStakeAddressInfo) ⇒ <code>object</code>
  - [.queryUtxo(address)](#CardanoJs+queryUtxo) ⇒ <code>object</code>
  - [.addressKeyGen(account)](#CardanoJs+addressKeyGen)
  - [.stakeAddressKeyGen(account)](#CardanoJs+stakeAddressKeyGen)
  - [.stakeAddressBuild(account)](#CardanoJs+stakeAddressBuild) ⇒ [<code>path</code>](#path)
  - [.addressBuild(account)](#CardanoJs+addressBuild) ⇒ [<code>path</code>](#path)
  - [.addressKeyHash(account)](#CardanoJs+addressKeyHash)
  - [.addressInfo(address)](#CardanoJs+addressInfo)
  - [.addressBuildScript(script)](#CardanoJs+addressBuildScript) ⇒ [<code>paymentAddr</code>](#paymentAddr)
  - [.wallet(account)](#CardanoJs+wallet) ⇒ [<code>wallet</code>](#wallet)
  - [.pool(poolName)](#CardanoJs+pool) ⇒ [<code>pool</code>](#pool)
  - [.stakeAddressRegistrationCertificate(account)](#CardanoJs+stakeAddressRegistrationCertificate) ⇒ [<code>path</code>](#path)
  - [.stakeAddressDeregistrationCertificate(account)](#CardanoJs+stakeAddressDeregistrationCertificate) ⇒ [<code>path</code>](#path)
  - [.stakeAddressDelegationCertificate(account, poolId)](#CardanoJs+stakeAddressDelegationCertificate) ⇒ [<code>path</code>](#path)
  - [.stakeAddressKeyHash(account)](#CardanoJs+stakeAddressKeyHash) ⇒ <code>string</code>
  - [.nodeKeyGenKES(poolName)](#CardanoJs+nodeKeyGenKES)
  - [.nodeKeyGen(poolName)](#CardanoJs+nodeKeyGen)
  - [.nodeIssueOpCert(poolName)](#CardanoJs+nodeIssueOpCert) ⇒ [<code>path</code>](#path)
  - [.nodeKeyGenVRF(poolName)](#CardanoJs+nodeKeyGenVRF)
  - [.stakePoolId(poolName)](#CardanoJs+stakePoolId) ⇒ <code>string</code>
  - [.stakePoolMetadataHash(metadata)](#CardanoJs+stakePoolMetadataHash) ⇒ <code>string</code>
  - [.stakePoolRegistrationCertificate(poolName, options)](#CardanoJs+stakePoolRegistrationCertificate) ⇒ [<code>path</code>](#path)
  - [.stakePoolDeregistrationCertificate(poolName, epoch)](#CardanoJs+stakePoolDeregistrationCertificate) ⇒ [<code>path</code>](#path)
  - [.transactionBuildRaw(options)](#CardanoJs+transactionBuildRaw) ⇒ [<code>path</code>](#path)
  - [.transactionCalculateMinFee(options)](#CardanoJs+transactionCalculateMinFee) ⇒ [<code>lovelace</code>](#lovelace)
  - [.transactionSign(options)](#CardanoJs+transactionSign) ⇒ [<code>path</code>](#path)
  - [.transactionWitness(options)](#CardanoJs+transactionWitness) ⇒ [<code>path</code>](#path)
  - [.transactionAssemble(options)](#CardanoJs+transactionAssemble) ⇒ [<code>path</code>](#path)
  - [.transactionSubmit(tx)](#CardanoJs+transactionSubmit) ⇒ <code>string</code>
  - [.transactionTxid(options)](#CardanoJs+transactionTxid) ⇒ [<code>path</code>](#path)
  - [.KESPeriod()](#CardanoJs+KESPeriod) ⇒ <code>number</code>
  - [.toLovelace(ada)](#CardanoJs+toLovelace) ⇒ [<code>lovelace</code>](#lovelace)
  - [.toAda(lovelace)](#CardanoJs+toAda) ⇒ <code>number</code>

<a name="new_CardanoJs_new"></a>

### new CardanoJs(options)

| Param                        | Type                       | Description           |
| ---------------------------- | -------------------------- | --------------------- |
| options                      | <code>Object</code>        |                       |
| [options.shelleyGenesisPath] | [<code>path</code>](#path) |                       |
| [options.socketPath]         | [<code>path</code>](#path) | Default: Env Variable |
| [options.cliPath]            | [<code>path</code>](#path) | Default: Env Variable |
| [options.dir]                | [<code>path</code>](#path) | Default: Working Dir  |
| [options.era]                | <code>string</code>        |                       |
| [options.network]            | <code>string</code>        | Default: mainnet      |

<a name="CardanoJs+queryProtcolParameters"></a>

### cardanoJs.queryProtcolParameters() ⇒ <code>object</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)  
<a name="CardanoJs+queryTip"></a>

### cardanoJs.queryTip() ⇒ <code>object</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)  
<a name="CardanoJs+queryStakeAddressInfo"></a>

### cardanoJs.queryStakeAddressInfo(address) ⇒ <code>object</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                                 |
| ------- | ------------------------------------ |
| address | [<code>stakeAddr</code>](#stakeAddr) |

<a name="CardanoJs+queryUtxo"></a>

### cardanoJs.queryUtxo(address) ⇒ <code>object</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                                     |
| ------- | ---------------------------------------- |
| address | [<code>paymentAddr</code>](#paymentAddr) |

<a name="CardanoJs+addressKeyGen"></a>

### cardanoJs.addressKeyGen(account)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                | Description     |
| ------- | ------------------- | --------------- |
| account | <code>string</code> | Name of account |

<a name="CardanoJs+stakeAddressKeyGen"></a>

### cardanoJs.stakeAddressKeyGen(account)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                | Description     |
| ------- | ------------------- | --------------- |
| account | <code>string</code> | Name of account |

<a name="CardanoJs+stakeAddressBuild"></a>

### cardanoJs.stakeAddressBuild(account) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                | Description     |
| ------- | ------------------- | --------------- |
| account | <code>string</code> | Name of account |

<a name="CardanoJs+addressBuild"></a>

### cardanoJs.addressBuild(account) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)  
**Returns**: [<code>path</code>](#path) - - Path to the payment address

| Param   | Type                | Description     |
| ------- | ------------------- | --------------- |
| account | <code>string</code> | Name of account |

<a name="CardanoJs+addressKeyHash"></a>

### cardanoJs.addressKeyHash(account)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                | Description     |
| ------- | ------------------- | --------------- |
| account | <code>string</code> | Name of account |

<a name="CardanoJs+addressInfo"></a>

### cardanoJs.addressInfo(address)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                                     |
| ------- | ---------------------------------------- |
| address | [<code>paymentAddr</code>](#paymentAddr) |

<a name="CardanoJs+addressBuildScript"></a>

### cardanoJs.addressBuildScript(script) ⇒ [<code>paymentAddr</code>](#paymentAddr)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param  | Type                |
| ------ | ------------------- |
| script | <code>object</code> |

<a name="CardanoJs+wallet"></a>

### cardanoJs.wallet(account) ⇒ [<code>wallet</code>](#wallet)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| account | <code>string</code> | Name of the account |

<a name="CardanoJs+pool"></a>

### cardanoJs.pool(poolName) ⇒ [<code>pool</code>](#pool)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param    | Type                | Description      |
| -------- | ------------------- | ---------------- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanoJs+stakeAddressRegistrationCertificate"></a>

### cardanoJs.stakeAddressRegistrationCertificate(account) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| account | <code>string</code> | Name of the account |

<a name="CardanoJs+stakeAddressDeregistrationCertificate"></a>

### cardanoJs.stakeAddressDeregistrationCertificate(account) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| account | <code>string</code> | Name of the account |

<a name="CardanoJs+stakeAddressDelegationCertificate"></a>

### cardanoJs.stakeAddressDelegationCertificate(account, poolId) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                | Description                                         |
| ------- | ------------------- | --------------------------------------------------- |
| account | <code>string</code> | Name of the account                                 |
| poolId  | <code>string</code> | Stake pool verification key (Bech32 or hex-encoded) |

<a name="CardanoJs+stakeAddressKeyHash"></a>

### cardanoJs.stakeAddressKeyHash(account) ⇒ <code>string</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param   | Type                | Description         |
| ------- | ------------------- | ------------------- |
| account | <code>string</code> | Name of the account |

<a name="CardanoJs+nodeKeyGenKES"></a>

### cardanoJs.nodeKeyGenKES(poolName)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param    | Type                | Description      |
| -------- | ------------------- | ---------------- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanoJs+nodeKeyGen"></a>

### cardanoJs.nodeKeyGen(poolName)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param    | Type                | Description      |
| -------- | ------------------- | ---------------- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanoJs+nodeIssueOpCert"></a>

### cardanoJs.nodeIssueOpCert(poolName) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param    | Type                | Description      |
| -------- | ------------------- | ---------------- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanoJs+nodeKeyGenVRF"></a>

### cardanoJs.nodeKeyGenVRF(poolName)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param    | Type                | Description      |
| -------- | ------------------- | ---------------- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanoJs+stakePoolId"></a>

### cardanoJs.stakePoolId(poolName) ⇒ <code>string</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param    | Type                | Description      |
| -------- | ------------------- | ---------------- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanoJs+stakePoolMetadataHash"></a>

### cardanoJs.stakePoolMetadataHash(metadata) ⇒ <code>string</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param    | Type                | Description |
| -------- | ------------------- | ----------- |
| metadata | <code>string</code> | Raw File    |

<a name="CardanoJs+stakePoolRegistrationCertificate"></a>

### cardanoJs.stakePoolRegistrationCertificate(poolName, options) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param                 | Type                                     | Description      |
| --------------------- | ---------------------------------------- | ---------------- |
| poolName              | <code>string</code>                      | Name of the pool |
| options               | <code>Object</code>                      |                  |
| options.pledge        | [<code>lovelace</code>](#lovelace)       |                  |
| options.margin        | <code>number</code>                      |                  |
| options.cost          | [<code>lovelace</code>](#lovelace)       |                  |
| options.url           | <code>string</code>                      |                  |
| options.metaHash      | <code>string</code>                      |                  |
| options.rewardAccount | [<code>path</code>](#path)               |                  |
| options.owners        | [<code>Array.&lt;path&gt;</code>](#path) |                  |
| options.relays        | <code>Array.&lt;Object&gt;</code>        |                  |

<a name="CardanoJs+stakePoolDeregistrationCertificate"></a>

### cardanoJs.stakePoolDeregistrationCertificate(poolName, epoch) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param    | Type                | Description      |
| -------- | ------------------- | ---------------- |
| poolName | <code>string</code> | Name of the pool |
| epoch    | <code>number</code> | Retirement Epoch |

<a name="CardanoJs+transactionBuildRaw"></a>

### cardanoJs.transactionBuildRaw(options) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param                | Type                                     |
| -------------------- | ---------------------------------------- |
| options              | <code>Object</code>                      |
| options.txIn         | <code>object</code>                      |
| options.txOut        | <code>object</code>                      |
| [options.withdrawal] | <code>object</code>                      |
| [options.certs]      | [<code>Array.&lt;path&gt;</code>](#path) |
| [options.fee]        | [<code>lovelace</code>](#lovelace)       |

<a name="CardanoJs+transactionCalculateMinFee"></a>

### cardanoJs.transactionCalculateMinFee(options) ⇒ [<code>lovelace</code>](#lovelace)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param                | Type                       |
| -------------------- | -------------------------- |
| options              | <code>Object</code>        |
| options.txBody       | [<code>path</code>](#path) |
| options.txIn         | <code>object</code>        |
| options.txOut        | <code>object</code>        |
| options.witnessCount | <code>number</code>        |

<a name="CardanoJs+transactionSign"></a>

### cardanoJs.transactionSign(options) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param                | Type                                     | Description               |
| -------------------- | ---------------------------------------- | ------------------------- |
| options              | <code>Object</code>                      |                           |
| options.signingKeys  | [<code>Array.&lt;path&gt;</code>](#path) | One ore more signing keys |
| [options.scriptFile] | <code>object</code>                      |                           |
| options.txBody       | [<code>path</code>](#path)               |                           |

<a name="CardanoJs+transactionWitness"></a>

### cardanoJs.transactionWitness(options) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param                | Type                       |
| -------------------- | -------------------------- |
| options              | <code>Object</code>        |
| options.txBody       | [<code>path</code>](#path) |
| options.signingKey   | [<code>path</code>](#path) |
| [options.scriptFile] | <code>object</code>        |

<a name="CardanoJs+transactionAssemble"></a>

### cardanoJs.transactionAssemble(options) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param                | Type                                     |
| -------------------- | ---------------------------------------- |
| options              | <code>Object</code>                      |
| options.txBody       | [<code>path</code>](#path)               |
| options.witnessFiles | [<code>Array.&lt;path&gt;</code>](#path) |

<a name="CardanoJs+transactionSubmit"></a>

### cardanoJs.transactionSubmit(tx) ⇒ <code>string</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)  
**Returns**: <code>string</code> - - Transaction hash

| Param | Type                       | Description                     |
| ----- | -------------------------- | ------------------------------- |
| tx    | [<code>path</code>](#path) | Path to signed transaction file |

<a name="CardanoJs+transactionTxid"></a>

### cardanoJs.transactionTxid(options) ⇒ [<code>path</code>](#path)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param            | Type                       |
| ---------------- | -------------------------- |
| options          | <code>Object</code>        |
| [options.txBody] | [<code>path</code>](#path) |
| [options.txFile] | [<code>path</code>](#path) |

<a name="CardanoJs+KESPeriod"></a>

### cardanoJs.KESPeriod() ⇒ <code>number</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)  
<a name="CardanoJs+toLovelace"></a>

### cardanoJs.toLovelace(ada) ⇒ [<code>lovelace</code>](#lovelace)

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param | Type                |
| ----- | ------------------- |
| ada   | <code>number</code> |

<a name="CardanoJs+toAda"></a>

### cardanoJs.toAda(lovelace) ⇒ <code>number</code>

**Kind**: instance method of [<code>CardanoJs</code>](#CardanoJs)

| Param    | Type                               |
| -------- | ---------------------------------- |
| lovelace | [<code>lovelace</code>](#lovelace) |

<a name="lovelace"></a>

## lovelace

**Kind**: global typedef  
**Properties**

| Type                |
| ------------------- |
| <code>number</code> |

<a name="path"></a>

## path

**Kind**: global typedef  
**Properties**

| Type                |
| ------------------- |
| <code>string</code> |

<a name="paymentAddr"></a>

## paymentAddr

**Kind**: global typedef  
**Properties**

| Type                |
| ------------------- |
| <code>string</code> |

<a name="stakeAddr"></a>

## stakeAddr

**Kind**: global typedef  
**Properties**

| Type                |
| ------------------- |
| <code>string</code> |

<a name="wallet"></a>

## wallet : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name        | Type                                                      | Description                        |
| ----------- | --------------------------------------------------------- | ---------------------------------- |
| name        | <code>string</code>                                       |                                    |
| paymentAddr | [<code>paymentAddr</code>](#paymentAddr)                  |                                    |
| stakeAddr   | [<code>stakeAddr</code>](#stakeAddr)                      |                                    |
| balance     | [<code>lovelace</code>](#lovelace)                        |                                    |
| reward      | [<code>lovelace</code>](#lovelace) \| <code>string</code> |                                    |
| file        | <code>function</code>                                     | File name as argument returns path |

<a name="pool"></a>

## pool : <code>Object</code>

**Kind**: global typedef  
**Properties**

| Name | Type                  | Description                        |
| ---- | --------------------- | ---------------------------------- |
| name | <code>string</code>   |                                    |
| file | <code>function</code> | File name as argument returns path |
