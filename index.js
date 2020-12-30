const execSync = require("child_process").execSync;
const fs = require("fs");
const {
  ownerToString,
  relayToString,
  certToString,
  txInToString,
  txOutToString,
  signingKeysToString,
  witnessFilesToString,
} = require("./helper");

/**
 * @typedef lovelace
 * @property {number}
 */

/**
 * @typedef path
 * @property {string}
 */

/**
 * @typedef paymentAddr
 * @property {string}
 */

/**
 * @typedef stakeAddr
 * @property {string}
 */

/**
 * @typedef {Object} wallet
 * @property {string} name
 * @property {paymentAddr} paymentAddr
 * @property {stakeAddr} stakeAddr
 * @property {lovelace} balance
 * @property {(lovelace | string)} reward
 * @property {function} file - File name as argument returns path
 */

/**
 * @typedef {Object} pool
 * @property {string} name
 * @property {function} file - File name as argument returns path
 */

class CardanoJs {
  /**
   *
   * @param {Object} options
   * @param {path=} options.shelleyGenesisPath
   * @param {path=} options.socketPath - Default: Env Variable
   * @param {path=} options.cliPath - Default: Env Variable
   * @param {path=} options.dir - Default: Working Dir
   * @param {string=} options.era
   * @param {string=} options.network - Default: mainnet
   */

  constructor(options) {
    this.network = "mainnet";
    this.era = "";
    this.dir = ".";
    this.cliPath = "cardano-cli";

    if (options) {
      options.shelleyGenesisPath &&
        (this.shelleyGenesis = JSON.parse(
          execSync(`cat ${options.shelleyGenesisPath}`).toString()
        ));

      options.socketPath &&
        (process.env["CARDANO_NODE_SOCKET_PATH"] = options.socketPath);
      options.era && (this.era = "--" + options.era + "-era");
      options.network && (this.network = options.network);
      options.dir && (this.dir = options.dir);
      options.cliPath && (this.cliPath = options.cliPath);
    }

    execSync(`mkdir -p ${this.dir}/tmp`);
  }

  /**
   * @returns {object}
   */
  queryProtcolParameters() {
    execSync(`${this.cliPath} query protocol-parameters \
                            --${this.network} \
                            --cardano-mode \
                            --out-file ${this.dir}/tmp/protocolParams.json \
                            ${this.era}
                        `);
    this.protcolParametersPath = `${this.dir}/tmp/protocolParams.json`;
    return JSON.parse(execSync(`cat ${this.dir}/tmp/protocolParams.json`));
  }

  /**
   * @returns {object}
   */
  queryTip() {
    return JSON.parse(
      execSync(`${this.cliPath} query tip \
        --${this.network} \
        --cardano-mode
                        `).toString()
    );
  }

  /**
   * @param {stakeAddr} address
   * @returns {object}
   */
  queryStakeAddressInfo(address) {
    return JSON.parse(
      execSync(`${this.cliPath} query stake-address-info \
        --${this.network} \
        --address ${address} \
        ${this.era}
        `).toString()
    );
  }

  /**
   * @param {paymentAddr} address
   * @returns {object}
   */
  queryUtxo(address) {
    let utxosRaw = execSync(`${this.cliPath} query utxo \
            --${this.network} \
            --address ${address} \
            --cardano-mode \
            ${this.era}
            `).toString();

    let utxos = utxosRaw.split("\n");
    utxos.splice(0, 1);
    utxos.splice(0, 1);
    utxos.splice(utxos.length - 1, 1);
    let result = utxos.map((raw, index) => {
      let utxo = raw.replace(/\s+/g, " ").split(" ");
      return {
        txHash: utxo[0],
        txId: parseInt(utxo[1]),
        amount: parseInt(utxo[2]),
      };
    });

    return result;
  }

  /**
   *
   * @param {string} account - Name of account
   */
  addressKeyGen(account) {
    execSync(`mkdir -p ${this.dir}/priv/wallet/${account}`);
    execSync(`${this.cliPath} address key-gen \
                        --verification-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.vkey \
                        --signing-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.skey
                    `);
  }

  /**
   *
   * @param {string} account - Name of account
   */
  stakeAddressKeyGen(account) {
    execSync(`mkdir -p ${this.dir}/priv/wallet/${account}`);
    execSync(`${this.cliPath} stake-address key-gen \
                        --verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --signing-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.skey
                    `);
  }

  /**
   *
   * @param {string} account - Name of account
   * @returns {path}
   */
  stakeAddressBuild(account) {
    execSync(`${this.cliPath} stake-address build \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.stake.addr \
                        --${this.network}
                    `);
    return `${this.dir}/priv/wallet/${account}/${account}.stake.addr`;
  }

  /**
   *
   * @param {string} account - Name of account
   * @returns {path} - Path to the payment address
   */
  addressBuild(account) {
    execSync(`${this.cliPath} address build \
                    --payment-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.vkey \
                    --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                    --out-file ${this.dir}/priv/wallet/${account}/${account}.payment.addr \
                    --${this.network}
                `);
    return `${this.dir}/priv/wallet/${account}/${account}.payment.addr`;
  }

  /**
   *
   * @param {string} account - Name of account
   */
  addressKeyHash(account) {
    return execSync(`${this.cliPath} address key-hash \
                        --payment-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.vkey \
                    `)
      .toString()
      .replace(/\s+/g, " ");
  }

  /**
   *
   * @param {paymentAddr} address
   */
  addressInfo(address) {
    return execSync(`${this.cliPath} address info \
            --address ${address} \
            `)
      .toString()
      .replace(/\s+/g, " ");
  }

  /**
   *
   * @param {object} script
   * @returns {paymentAddr}
   */
  addressBuildScript(script) {
    let UID = Math.random().toString(36).substr(2, 9);
    fs.writeFileSync(
      `${this.dir}/tmp/script_${UID}.json`,
      JSON.stringify(script)
    );
    let scriptAddr = execSync(
      `${this.cliPath} address build-script --script-file ${this.dir}/tmp/script_${UID}.json --${this.network}`
    )
      .toString()
      .replace(/\s+/g, " ");
    return scriptAddr;
  }

  /**
   *
   * @param {string} account - Name of the account
   * @returns {wallet}
   */
  wallet(account) {
    const paymentAddr = fs
      .readFileSync(
        `${this.dir}/priv/wallet/${account}/${account}.payment.addr`
      )
      .toString();
    const stakingAddr = fs
      .readFileSync(`${this.dir}/priv/wallet/${account}/${account}.stake.addr`)
      .toString();

    const balance = this.queryUtxo(paymentAddr).reduce(
      (acc, curr) => acc + curr.amount,
      0
    );

    let reward = this.queryStakeAddressInfo(stakingAddr);
    reward = reward.find((delegation) => delegation.address == stakingAddr)
      ? reward.find((delegation) => delegation.address == stakingAddr)
          .rewardAccountBalance
      : "Staking key not registered";

    return {
      name: account,
      paymentAddr,
      stakingAddr,
      balance,
      reward,
      file: (fileName) => {
        try {
          fs.readFileSync(
            `${this.dir}/priv/wallet/${account}/${account}.${fileName}`
          );
          return `${this.dir}/priv/wallet/${account}/${account}.${fileName}`;
        } catch (err) {
          throw new Error(
            `File ${fileName} of Account ${account} doesn't exist`
          );
        }
      },
    };
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   * @returns {pool}
   */
  pool(poolName) {
    return {
      name: poolName,
      file: (fileName) => {
        try {
          fs.readFileSync(`${this.dir}/priv/pool/${name}/${name}.${fileName}`);
          return `${this.dir}/priv/pool/${name}/${name}.${fileName}`;
        } catch (err) {
          throw new Error(`File ${fileName} of Pool ${name} doesn't exist`);
        }
      },
    };
  }

  /**
   *
   * @param {string} account - Name of the account
   * @returns {path}
   */
  stakeAddressRegistrationCertificate(account) {
    execSync(`${this.cliPath} stake-address registration-certificate \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.stake.cert
                    `);
    return `${this.dir}/priv/wallet/${account}/${account}.stake.cert`;
  }

  /**
   *
   * @param {string} account - Name of the account
   * @returns {path}
   */
  stakeAddressDeregistrationCertificate(account) {
    execSync(`${this.cliPath} stake-address deregistration-certificate \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.stake.cert
                    `);
    return `${this.dir}/priv/wallet/${account}/${account}.stake.cert`;
  }

  /**
   *
   * @param {string} account - Name of the account
   * @param {string} poolId - Stake pool verification key (Bech32 or hex-encoded)
   * @returns {path}
   */
  stakeAddressDelegationCertificate(account, poolId) {
    execSync(`${this.cliPath} stake-address delegation-certificate \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --stake-pool-id ${poolId} \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.deleg.cert
                    `);
    return `${this.dir}/priv/wallet/${account}/${account}.deleg.cert`;
  }

  /**
   *
   * @param {string} account - Name of the account
   * @returns {string}
   */
  stakeAddressKeyHash(account) {
    return execSync(`${this.cliPath} stake-address key-hash \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                    `)
      .toString()
      .replace(/\s+/g, " ");
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   */
  nodeKeyGenKES(poolName) {
    execSync(`mkdir -p ${this.dir}/priv/pool/${poolName}`);
    execSync(`${this.cliPath} node key-gen-KES \
                        --verification-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.kes.vkey \
                        --signing-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.kes.skey
                    `);
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   */
  nodeKeyGen(poolName) {
    execSync(`mkdir -p ${this.dir}/priv/pool/${poolName}`);
    execSync(`${this.cliPath} node key-gen \
                        --cold-verification-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.node.vkey \
                        --cold-signing-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.node.skey \
                        --operational-certificate-issue-counter ${this.dir}/priv/pool/${poolName}/${poolName}.node.counter 
                    `);
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   * @returns {path}
   */
  nodeIssueOpCert(poolName) {
    execSync(`${this.cliPath} node issue-op-cert \
                        --kes-verification-key-file ${
                          this.dir
                        }/priv/pool/${poolName}/${poolName}.kes.vkey \
                        --cold-signing-key-file ${
                          this.dir
                        }/priv/pool/${poolName}/${poolName}.node.skey \
                        --operational-certificate-issue-counter ${
                          this.dir
                        }/priv/pool/${poolName}/${poolName}.node.counter \
                        --kes-period ${this.KESPeriod()} \
                        --out-file ${
                          this.dir
                        }/priv/pool/${poolName}/${poolName}.node.cert 
                    `);
    return `${this.dir}/priv/pool/${poolName}/${poolName}.node.cert`;
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   */
  nodeKeyGenVRF(poolName) {
    execSync(`mkdir -p ${this.dir}/priv/pool/${poolName}`);
    execSync(`${this.cliPath} node key-gen-VRF \
                        --verification-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.vrf.vkey \
                        --signing-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.vrf.skey
                    `);
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   * @returns {string}
   */
  stakePoolId(poolName) {
    return execSync(
      `${this.cliPath} stake-pool id --cold-verification-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.node.vkey`
    )
      .toString()
      .replace(/\s+/g, " ");
  }

  /**
   *
   * @param {string} metadata - Raw File
   * @returns {string}
   */
  stakePoolMetadataHash(metadata) {
    fs.writeFileSync(`${this.dir}/tmp/poolmeta.json`, metadata);
    let metaHash = execSync(
      `${this.cliPath} stake-pool metadata-hash --pool-metadata-file ${this.dir}/tmp/poolmeta.json`
    )
      .toString()
      .replace(/\s+/g, " ");
    execSync(`rm ${this.dir}/tmp/poolmeta.json`);
    return metaHash;
  }

  /**
   * @param {string} poolName - Name of the pool
   * @param {Object} options
   * @param {lovelace} options.pledge
   * @param {number} options.margin
   * @param {lovelace} options.cost
   * @param {string} options.url
   * @param {string} options.metaHash
   * @param {path} options.rewardAccount
   * @param {Array<path>} options.owners
   * @param {Array<Object>} options.relays
   * @returns {path}
   */
  stakePoolRegistrationCertificate(poolName, options) {
    if (
      !(
        options &&
        options.pledge &&
        options.margin &&
        options.cost &&
        options.url &&
        options.metaHash &&
        options.rewardAccount &&
        options.owners &&
        options.relays
      )
    )
      throw new Error("All options are required");
    let owners = ownerToString(options.owners);
    let relays = relayToString(options.relays);

    execSync(`${this.cliPath} stake-pool registration-certificate \
                --cold-verification-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.node.vkey \
                --vrf-verification-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.vrf.vkey \
                --pool-pledge ${options.pledge} \
                --pool-cost ${options.cost} \
                --pool-margin ${options.margin} \
                --pool-reward-account-verification-key-file ${options.rewardAccount} \
                ${owners} \
                ${relays} \
                --${this.network} \
                --metadata-url ${options.url} \
                --metadata-hash ${options.metaHash} \
                --out-file ${this.dir}/priv/pool/${poolName}/${poolName}.pool.cert
            `);
    return `${this.dir}/priv/pool/${poolName}/${poolName}.pool.cert`;
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   * @param {number} epoch - Retirement Epoch
   * @returns {path}
   */
  stakePoolDeregistrationCertificate(poolName, epoch) {
    execSync(`${this.cliPath} stake-pool deregistration-certificate \
                --cold-verification-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.node.vkey \
                --epoch ${epoch}
                --out-file ${this.dir}/priv/pool/${poolName}/${poolName}.pool.dereg
              `);
    return `${this.dir}/priv/pool/${poolName}/${poolName}.pool.dereg`;
  }

  /**
   *
   * @param {Object} options
   * @param {object} options.txIn
   * @param {object} options.txOut
   * @param {object=} options.withdrawal
   * @param {Array<path>=} options.certs
   * @param {lovelace=} options.fee
   * @returns {path}
   */
  transactionBuildRaw(options) {
    if (!(options && options.txIn && options.txOut))
      throw new Error("TxIn and TxOut required");
    let UID = Math.random().toString(36).substr(2, 9);
    let certs = options.certs ? certToString(options.certs) : "";
    let withdrawal = options.withdrawal
      ? `--withdrawal ${options.withdrawal.stakingAddress}+${options.withdrawal.reward}`
      : "";
    let txInString = txInToString(options.txIn);
    let txOutString = txOutToString(options.txOut);
    execSync(`${this.cliPath} transaction build-raw \
                ${txInString} \
                ${txOutString} \
                ${certs} \
                ${withdrawal} \
                --invalid-hereafter ${this.queryTip().slotNo + 10000} \
                --fee ${options.fee ? options.fee : 0} \
                --out-file ${this.dir}/tmp/tx_${UID}.raw \
                ${this.era}`);

    return `${this.dir}/tmp/tx_${UID}.raw`;
  }

  /**
   *
   * @param {Object} options
   * @param {path} options.txBody
   * @param {object} options.txIn
   * @param {object} options.txOut
   * @param {number} options.witnessCount
   * @returns {lovelace}
   */
  transactionCalculateMinFee(options) {
    this.queryProtcolParameters();
    return parseInt(
      execSync(`${this.cliPath} transaction calculate-min-fee \
                --tx-body-file ${options.txBody} \
                --tx-in-count ${options.txIn.length} \
                --tx-out-count ${options.txOut.length} \
                --mainnet \
                --witness-count ${options.witnessCount} \
                --protocol-params-file ${this.protcolParametersPath}`)
        .toString()
        .replace(/\s+/g, " ")
        .split(" ")[0]
    );
  }

  /**
   *
   * @param {Object} options
   * @param {Array<path>} options.signingKeys - One ore more signing keys
   * @param {object=} options.scriptFile
   * @param {path} options.txBody
   * @returns {path}
   */
  transactionSign(options) {
    let UID = Math.random().toString(36).substr(2, 9);
    let signingKeys = signingKeysToString(options.signingKeys);
    let scriptFile = "";
    if (options.scriptFile) {
      let UIDScript = Math.random().toString(36).substr(2, 9);
      fs.writeFileSync(
        `${this.dir}/tmp/script_${UIDScript}.json`,
        JSON.stringify(script)
      );
      scriptFile = `--script-file ${this.dir}/tmp/script_${UIDScript}.json`;
    }
    execSync(`${this.cliPath} transaction sign \
        --tx-body-file ${options.txBody} \
        ${scriptFile} \
        --${this.network} \
        ${signingKeys} \
        --out-file ${this.dir}/tmp/tx_${UID}.signed`);
    return `${this.dir}/tmp/tx_${UID}.signed`;
  }

  /**
   *
   * @param {Object} options
   * @param {path} options.txBody
   * @param {path} options.signingKey
   * @param {object=} options.scriptFile
   * @returns {path}
   */
  transactionWitness(options) {
    let UID = Math.random().toString(36).substr(2, 9);
    let scriptFile = "";
    if (options.scriptFile) {
      let UIDScript = Math.random().toString(36).substr(2, 9);
      fs.writeFileSync(
        `${this.dir}/tmp/script_${UIDScript}.json`,
        JSON.stringify(script)
      );
      scriptFile = `--script-file ${this.dir}/tmp/script_${UIDScript}.json`;
    }
    execSync(`${this.cliPath} transaction witness \
        --tx-body-file ${options.txBody} \
        ${scriptFile} \
        --${this.network} \
        --signing-key-file ${options.signingKey} \
        --out-file ${this.dir}/tmp/tx_${UID}.witness`);
    return `${this.dir}/tmp/tx_${UID}.witness`;
  }

  /**
   *
   * @param {Object} options
   * @param {path} options.txBody
   * @param {Array<path>} options.witnessFiles
   * @returns {path}
   */
  transactionAssemble(options) {
    let UID = Math.random().toString(36).substr(2, 9);
    let witnessFiles = witnessFilesToString(options.witnessFiles);
    execSync(`${this.cliPath} transaction assemble \
        --tx-body-file ${options.txBody} \
        ${witnessFiles} \
        --out-file ${this.dir}/tmp/tx_${UID}.signed`);
    return `${this.dir}/tmp/tx_${UID}.signed`;
  }

  /**
   *
   * @param {path} tx - Path to signed transaction file
   * @returns {string} - Transaction hash
   */
  transactionSubmit(tx) {
    execSync(
      `${this.cliPath} transaction submit --${this.network} --tx-file ${tx}`
    );
    return this.transactionTxid({ txFile: tx });
  }

  /**
   *
   * @param {Object} options
   * @param {path=} options.txBody
   * @param {path=} options.txFile
   * @returns {path}
   */
  transactionTxid(options) {
    let txArg = options.txBody
      ? `--tx-body-file ${options.txBody}`
      : `--tx-file ${options.txFile}`;
    return execSync(`${this.cliPath} transaction txid ${txArg}`)
      .toString()
      .replace(/\s+/g, " ");
  }

  /**
   * @returns {number}
   */
  KESPeriod() {
    if (!this.shelleyGenesis) throw new Error("shelleyGenesisPath required");
    return parseInt(
      this.queryTip().slotNo / this.shelleyGenesis.slotsPerKESPeriod
    );
  }

  /**
   *
   * @param {number} ada
   * @returns {lovelace}
   */
  toLovelace(ada) {
    return ada * 1000000;
  }

  /**
   *
   * @param {lovelace} lovelace
   * @returns {number}
   */
  toAda(lovelace) {
    return lovelace / 1000000;
  }
}

module.exports = CardanoJs;
