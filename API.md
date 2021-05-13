## Classes

<dl>
<dt><a href="#CardanocliJs">CardanocliJs</a></dt>
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
<dt><a href="#TxIn">TxIn</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#TxOut">TxOut</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#MintAction">MintAction</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Mint">Mint</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Certificate">Certificate</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Withdrawal">Withdrawal</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="CardanocliJs"></a>

## CardanocliJs
**Kind**: global class  

* [CardanocliJs](#CardanocliJs)
    * [new CardanocliJs(options)](#new_CardanocliJs_new)
    * [.queryProtocolParameters()](#CardanocliJs+queryProtocolParameters) ⇒ <code>object</code>
    * [.queryTip()](#CardanocliJs+queryTip) ⇒ <code>object</code>
    * [.queryStakeAddressInfo(address)](#CardanocliJs+queryStakeAddressInfo) ⇒ <code>object</code>
    * [.queryUtxo(address)](#CardanocliJs+queryUtxo) ⇒ <code>object</code>
    * [.addressKeyGen(account)](#CardanocliJs+addressKeyGen)
    * [.stakeAddressKeyGen(account)](#CardanocliJs+stakeAddressKeyGen)
    * [.stakeAddressBuild(account)](#CardanocliJs+stakeAddressBuild) ⇒ [<code>path</code>](#path)
    * [.addressBuild(account, options)](#CardanocliJs+addressBuild)
    * [.addressKeyHash(account)](#CardanocliJs+addressKeyHash)
    * [.addressInfo(address)](#CardanocliJs+addressInfo) ⇒ <code>object</code>
    * [.addressBuildScript(script)](#CardanocliJs+addressBuildScript) ⇒ [<code>paymentAddr</code>](#paymentAddr)
    * [.wallet(account)](#CardanocliJs+wallet)
    * [.pool(poolName)](#CardanocliJs+pool)
    * [.stakeAddressRegistrationCertificate(account)](#CardanocliJs+stakeAddressRegistrationCertificate) ⇒ [<code>path</code>](#path)
    * [.stakeAddressDeregistrationCertificate(account)](#CardanocliJs+stakeAddressDeregistrationCertificate) ⇒ [<code>path</code>](#path)
    * [.stakeAddressDelegationCertificate(account, poolId)](#CardanocliJs+stakeAddressDelegationCertificate) ⇒ [<code>path</code>](#path)
    * [.stakeAddressKeyHash(account)](#CardanocliJs+stakeAddressKeyHash) ⇒ <code>string</code>
    * [.nodeKeyGenKES(poolName)](#CardanocliJs+nodeKeyGenKES)
    * [.nodeKeyGen(poolName)](#CardanocliJs+nodeKeyGen)
    * [.nodeIssueOpCert(poolName, [kesPeriod])](#CardanocliJs+nodeIssueOpCert) ⇒ [<code>path</code>](#path)
    * [.nodeKeyGenVRF(poolName)](#CardanocliJs+nodeKeyGenVRF)
    * [.stakePoolId(poolName)](#CardanocliJs+stakePoolId) ⇒ <code>string</code>
    * [.stakePoolMetadataHash(metadata)](#CardanocliJs+stakePoolMetadataHash) ⇒ <code>string</code>
    * [.stakePoolRegistrationCertificate(poolName, options)](#CardanocliJs+stakePoolRegistrationCertificate) ⇒ [<code>path</code>](#path)
    * [.stakePoolDeregistrationCertificate(poolName, epoch)](#CardanocliJs+stakePoolDeregistrationCertificate) ⇒ [<code>path</code>](#path)
    * [.transactionBuildRaw(options)](#CardanocliJs+transactionBuildRaw) ⇒ [<code>path</code>](#path)
    * [.transactionCalculateMinFee(options)](#CardanocliJs+transactionCalculateMinFee) ⇒ [<code>lovelace</code>](#lovelace)
    * [.transactionPolicyid(script)](#CardanocliJs+transactionPolicyid) ⇒ <code>string</code>
    * [.transactionSign(options)](#CardanocliJs+transactionSign) ⇒ [<code>path</code>](#path)
    * [.transactionWitness(options)](#CardanocliJs+transactionWitness) ⇒ [<code>path</code>](#path)
    * [.transactionAssemble(options)](#CardanocliJs+transactionAssemble) ⇒ [<code>path</code>](#path)
    * [.transactionCalculateMinValue(value)](#CardanocliJs+transactionCalculateMinValue) ⇒ [<code>lovelace</code>](#lovelace)
    * [.transactionSubmit(tx)](#CardanocliJs+transactionSubmit) ⇒ <code>string</code>
    * [.transactionTxid(options)](#CardanocliJs+transactionTxid) ⇒ [<code>path</code>](#path)
    * [.transactionView(options)](#CardanocliJs+transactionView) ⇒ [<code>path</code>](#path)
    * [.KESPeriod()](#CardanocliJs+KESPeriod) ⇒ <code>number</code>
    * [.getDownloadUrl(filePath)](#CardanocliJs+getDownloadUrl) ⇒ [<code>path</code>](#path)
    * [.toLovelace(ada)](#CardanocliJs+toLovelace) ⇒ [<code>lovelace</code>](#lovelace)
    * [.toAda(lovelace)](#CardanocliJs+toAda) ⇒ <code>number</code>

<a name="new_CardanocliJs_new"></a>

### new CardanocliJs(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| [options.shelleyGenesisPath] | [<code>path</code>](#path) |  |
| [options.socketPath] | [<code>path</code>](#path) | Default: Env Variable |
| [options.cliPath] | [<code>path</code>](#path) | Default: Env Variable |
| [options.dir] | [<code>path</code>](#path) | Default: Working Dir |
| [options.era] | <code>string</code> |  |
| [options.network] | <code>string</code> | Default: mainnet |
| [options.httpProvider] | <code>string</code> | Optional - Useful when using cli at different location than node or in browser |

<a name="CardanocliJs+queryProtocolParameters"></a>

### cardanocliJs.queryProtocolParameters() ⇒ <code>object</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  
<a name="CardanocliJs+queryTip"></a>

### cardanocliJs.queryTip() ⇒ <code>object</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  
<a name="CardanocliJs+queryStakeAddressInfo"></a>

### cardanocliJs.queryStakeAddressInfo(address) ⇒ <code>object</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| address | [<code>stakeAddr</code>](#stakeAddr) | 

<a name="CardanocliJs+queryUtxo"></a>

### cardanocliJs.queryUtxo(address) ⇒ <code>object</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| address | [<code>paymentAddr</code>](#paymentAddr) | 

<a name="CardanocliJs+addressKeyGen"></a>

### cardanocliJs.addressKeyGen(account)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of account |

<a name="CardanocliJs+stakeAddressKeyGen"></a>

### cardanocliJs.stakeAddressKeyGen(account)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of account |

<a name="CardanocliJs+stakeAddressBuild"></a>

### cardanocliJs.stakeAddressBuild(account) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of account |

<a name="CardanocliJs+addressBuild"></a>

### cardanocliJs.addressBuild(account, options)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of account |
| options | <code>Object</code> |  |
| [options.paymentVkey] | [<code>path</code>](#path) |  |
| [options.stakeVkey] | [<code>path</code>](#path) |  |
| [options.paymentScript] | <code>object</code> |  |
| [options.stakeScript] | <code>object</code> |  |

<a name="CardanocliJs+addressKeyHash"></a>

### cardanocliJs.addressKeyHash(account)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of account |

<a name="CardanocliJs+addressInfo"></a>

### cardanocliJs.addressInfo(address) ⇒ <code>object</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| address | [<code>paymentAddr</code>](#paymentAddr) | 

<a name="CardanocliJs+addressBuildScript"></a>

### cardanocliJs.addressBuildScript(script) ⇒ [<code>paymentAddr</code>](#paymentAddr)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| script | <code>object</code> | 

<a name="CardanocliJs+wallet"></a>

### cardanocliJs.wallet(account)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of the account |

<a name="CardanocliJs+pool"></a>

### cardanocliJs.pool(poolName)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanocliJs+stakeAddressRegistrationCertificate"></a>

### cardanocliJs.stakeAddressRegistrationCertificate(account) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of the account |

<a name="CardanocliJs+stakeAddressDeregistrationCertificate"></a>

### cardanocliJs.stakeAddressDeregistrationCertificate(account) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of the account |

<a name="CardanocliJs+stakeAddressDelegationCertificate"></a>

### cardanocliJs.stakeAddressDelegationCertificate(account, poolId) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of the account |
| poolId | <code>string</code> | Stake pool verification key (Bech32 or hex-encoded) |

<a name="CardanocliJs+stakeAddressKeyHash"></a>

### cardanocliJs.stakeAddressKeyHash(account) ⇒ <code>string</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| account | <code>string</code> | Name of the account |

<a name="CardanocliJs+nodeKeyGenKES"></a>

### cardanocliJs.nodeKeyGenKES(poolName)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanocliJs+nodeKeyGen"></a>

### cardanocliJs.nodeKeyGen(poolName)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanocliJs+nodeIssueOpCert"></a>

### cardanocliJs.nodeIssueOpCert(poolName, [kesPeriod]) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>string</code> | Name of the pool |
| [kesPeriod] | <code>number</code> | Optional (Offline mode) |

<a name="CardanocliJs+nodeKeyGenVRF"></a>

### cardanocliJs.nodeKeyGenVRF(poolName)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanocliJs+stakePoolId"></a>

### cardanocliJs.stakePoolId(poolName) ⇒ <code>string</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>string</code> | Name of the pool |

<a name="CardanocliJs+stakePoolMetadataHash"></a>

### cardanocliJs.stakePoolMetadataHash(metadata) ⇒ <code>string</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| metadata | <code>string</code> | Raw File |

<a name="CardanocliJs+stakePoolRegistrationCertificate"></a>

### cardanocliJs.stakePoolRegistrationCertificate(poolName, options) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>string</code> | Name of the pool |
| options | <code>Object</code> |  |
| options.pledge | [<code>lovelace</code>](#lovelace) |  |
| options.margin | <code>number</code> |  |
| options.cost | [<code>lovelace</code>](#lovelace) |  |
| options.url | <code>string</code> |  |
| options.metaHash | <code>string</code> |  |
| options.rewardAccount | [<code>path</code>](#path) |  |
| options.owners | [<code>Array.&lt;path&gt;</code>](#path) |  |
| options.relays | <code>Array.&lt;Object&gt;</code> |  |

<a name="CardanocliJs+stakePoolDeregistrationCertificate"></a>

### cardanocliJs.stakePoolDeregistrationCertificate(poolName, epoch) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>string</code> | Name of the pool |
| epoch | <code>number</code> | Retirement Epoch |

<a name="CardanocliJs+transactionBuildRaw"></a>

### cardanocliJs.transactionBuildRaw(options) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.txIn | [<code>Array.&lt;TxIn&gt;</code>](#TxIn) |  |
| options.txOut | [<code>Array.&lt;TxOut&gt;</code>](#TxOut) |  |
| [options.withdrawals] | [<code>Array.&lt;Withdrawal&gt;</code>](#Withdrawal) |  |
| [options.certs] | [<code>Array.&lt;Certificate&gt;</code>](#Certificate) |  |
| [options.fee] | [<code>lovelace</code>](#lovelace) |  |
| [options.mint] | [<code>Mint</code>](#Mint) |  |
| [options.auxScript] | <code>Array.&lt;object&gt;</code> |  |
| [options.metadata] | <code>object</code> |  |
| [options.invalidBefore] | <code>number</code> | Default: 0 |
| [options.invalidAfter] | <code>number</code> | Default: current+10000 |

<a name="CardanocliJs+transactionCalculateMinFee"></a>

### cardanocliJs.transactionCalculateMinFee(options) ⇒ [<code>lovelace</code>](#lovelace)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| options.txBody | [<code>path</code>](#path) | 
| options.txIn | <code>Array.&lt;object&gt;</code> | 
| options.txOut | <code>Array.&lt;object&gt;</code> | 
| options.witnessCount | <code>number</code> | 

<a name="CardanocliJs+transactionPolicyid"></a>

### cardanocliJs.transactionPolicyid(script) ⇒ <code>string</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  
**Returns**: <code>string</code> - - Policy Id  

| Param | Type |
| --- | --- |
| script | <code>object</code> | 

<a name="CardanocliJs+transactionSign"></a>

### cardanocliJs.transactionSign(options) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.signingKeys | [<code>Array.&lt;path&gt;</code>](#path) | One ore more signing keys |
| options.txBody | [<code>path</code>](#path) |  |

<a name="CardanocliJs+transactionWitness"></a>

### cardanocliJs.transactionWitness(options) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| options.txBody | [<code>path</code>](#path) | 
| options.signingKey | [<code>path</code>](#path) | 

<a name="CardanocliJs+transactionAssemble"></a>

### cardanocliJs.transactionAssemble(options) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| options.txBody | [<code>path</code>](#path) | 
| options.witnessFiles | [<code>Array.&lt;path&gt;</code>](#path) | 

<a name="CardanocliJs+transactionCalculateMinValue"></a>

### cardanocliJs.transactionCalculateMinValue(value) ⇒ [<code>lovelace</code>](#lovelace)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| value | <code>object</code> | 

<a name="CardanocliJs+transactionSubmit"></a>

### cardanocliJs.transactionSubmit(tx) ⇒ <code>string</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  
**Returns**: <code>string</code> - - Transaction Hash  

| Param | Type | Description |
| --- | --- | --- |
| tx | [<code>path</code>](#path) \| <code>string</code> | Path or Signed Tx File |

<a name="CardanocliJs+transactionTxid"></a>

### cardanocliJs.transactionTxid(options) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| [options.txBody] | [<code>path</code>](#path) | 
| [options.txFile] | [<code>path</code>](#path) | 

<a name="CardanocliJs+transactionView"></a>

### cardanocliJs.transactionView(options) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| [options.txBody] | [<code>path</code>](#path) | 
| [options.txFile] | [<code>path</code>](#path) | 

<a name="CardanocliJs+KESPeriod"></a>

### cardanocliJs.KESPeriod() ⇒ <code>number</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  
<a name="CardanocliJs+getDownloadUrl"></a>

### cardanocliJs.getDownloadUrl(filePath) ⇒ [<code>path</code>](#path)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  
**Returns**: [<code>path</code>](#path) - - Download link for the file  

| Param | Type |
| --- | --- |
| filePath | [<code>path</code>](#path) | 

<a name="CardanocliJs+toLovelace"></a>

### cardanocliJs.toLovelace(ada) ⇒ [<code>lovelace</code>](#lovelace)
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| ada | <code>number</code> | 

<a name="CardanocliJs+toAda"></a>

### cardanocliJs.toAda(lovelace) ⇒ <code>number</code>
**Kind**: instance method of [<code>CardanocliJs</code>](#CardanocliJs)  

| Param | Type |
| --- | --- |
| lovelace | [<code>lovelace</code>](#lovelace) | 

<a name="lovelace"></a>

## lovelace
**Kind**: global typedef  
**Properties**

| Type |
| --- |
| <code>number</code> | 

<a name="path"></a>

## path
**Kind**: global typedef  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="paymentAddr"></a>

## paymentAddr
**Kind**: global typedef  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="stakeAddr"></a>

## stakeAddr
**Kind**: global typedef  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="TxIn"></a>

## TxIn : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| txHash | <code>string</code> | 
| txId | <code>string</code> | 
| [script] | <code>object</code> | 

<a name="TxOut"></a>

## TxOut : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| address | <code>string</code> | 
| value | <code>object</code> | 

<a name="MintAction"></a>

## MintAction : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| action | <code>string</code> | 
| quantity | <code>number</code> | 
| asset | <code>string</code> | 

<a name="Mint"></a>

## Mint : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| mintAction | [<code>Array.&lt;MintAction&gt;</code>](#MintAction) | 
| script | <code>Array.&lt;object&gt;</code> | 

<a name="Certificate"></a>

## Certificate : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| cert | [<code>path</code>](#path) | 
| [script] | <code>object</code> | 

<a name="Withdrawal"></a>

## Withdrawal : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| stakingAddress | <code>string</code> | 
| reward | [<code>lovelace</code>](#lovelace) | 
| [script] | <code>object</code> | 

