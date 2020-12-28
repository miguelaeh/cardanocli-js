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

class CardanoJs {
  /**
   *
   * @param {JSON} options - {shelleyGenesisPath: required, socketPath: optional, era:optional, network: optional, dir: optional}
   */

  constructor(options) {
    this.network = `--mainnet`;
    this.era = "";
    this.dir = ".";
    if (!options.shelleyGenesisPath)
      throw new Error("shelleyGenesisPath required");
    this.shelleyGenesis = JSON.parse(
      execSync(`cat ${options.shelleyGenesisPath}`).toString()
    );

    options.socketPath &&
      execSync(`export CARDANO_NODE_SOCKET_PATH=${options.socketPath}`);
    options.era && (this.era = "--" + options.era + "-era");
    options.network && (this.network = "--" + options.network);
    options.dir && (this.dir = options.dir);

    execSync(`mkdir -p ${this.dir}/tmp`);
    this.queryProtcolParameters();
  }

  queryProtcolParameters() {
    execSync(`cardano-cli query protocol-parameters \
                            ${this.network} \
                            --cardano-mode \
                            --out-file ${this.dir}/tmp/protocolParams.json \
                            ${this.era}
                        `);
    this.protcolParametersPath = `${this.dir}/tmp/protocolParams.json`;
    return JSON.parse(execSync(`cat ${this.dir}/tmp/protocolParams.json`));
  }

  queryTip() {
    return JSON.parse(
      execSync(`cardano-cli query tip \
        ${this.network} \
        --cardano-mode
                        `).toString()
    );
  }

  /**
   *
   * @param {string} address - Staking address
   */
  queryStakeAddressInfo(address) {
    return JSON.parse(
      execSync(`cardano-cli query stake-address-info \
        ${this.network} \
        --address ${address} \
        ${this.era}
        `).toString()
    );
  }

  /**
   *
   * @param {string} address - Payment address
   */
  queryUtxo(address) {
    let utxosRaw = execSync(`cardano-cli query utxo \
            ${this.network} \
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
   * @param {string} account - Name for the payment account keys
   */
  addressKeyGen(account) {
    execSync(`mkdir -p ${this.dir}/priv/wallet/${account}`);
    execSync(`cardano-cli address key-gen \
                        --verification-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.vkey \
                        --signing-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.skey
                    `);
  }

  /**
   *
   * @param {string} account - Name for the stake account keys
   */
  stakeAddressKeyGen(account) {
    execSync(`mkdir -p ${this.dir}/priv/wallet/${account}`);
    execSync(`cardano-cli stake-address key-gen \
                        --verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --signing-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.skey
                    `);
  }

  /**
   *
   * @param {string} account - Name for the account
   */
  stakeAddressBuild(account) {
    execSync(`cardano-cli stake-address build \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.stake.addr \
                        ${this.network}
                    `);
    return `${this.dir}/priv/wallet/${account}/${account}.stake.addr`;
  }

  /**
   *
   * @param {string} account - Name for the account
   */
  addressBuild(account) {
    execSync(`cardano-cli address build \
                    --payment-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.vkey \
                    --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                    --out-file ${this.dir}/priv/wallet/${account}/${account}.payment.addr \
                    ${this.network}
                `);
    return `${this.dir}/priv/wallet/${account}/${account}.payment.addr`;
  }

  addressKeyHash(account) {
    return execSync(`cardano-cli address key-hash \
                        --payment-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.vkey \
                    `)
      .toString()
      .replace(/\s+/g, " ");
  }

  addressInfo(address) {
    return execSync(`cardano-cli address info \
            --address ${address} \
            `)
      .toString()
      .replace(/\s+/g, " ");
  }

  /**
   *
   * @param {JSON} script
   */
  addressBuildScript(script) {
    fs.writeFileSync(`${this.dir}/tmp/script.json`, JSON.stringify(script));
    let scriptAddr = execSync(
      `cardano-cli address build-script --script-file ${this.dir}/tmp/script.json ${this.network}`
    )
      .toString()
      .replace(/\s+/g, " ");
    execSync(`rm ${this.dir}/tmp/script.json`);
    return scriptAddr;
  }

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
      ? /**
         *
         * @param {string} account - Name for the account
         */
        reward.find((delegation) => delegation.address == stakingAddr)
          .rewardAccountBalance
      : "Staking key not registered";

    return {
      summary: {
        paymentAddr,
        stakingAddr,
        balance,
        reward,
      },
      file: (fileName) => {
        let content;
        try {
          content = fs
            .readFileSync(
              `${this.dir}/priv/wallet/${account}/${account}.${fileName}`
            )
            .toString();
          return {
            path: `${this.dir}/priv/wallet/${account}/${account}.${fileName}`,
            content,
          };
        } catch (err) {
          throw new Error(
            `File ${fileName} of Account ${account} doesn't exist`
          );
        }
      },
    };
  }

  stakeAddressRegistrationCertificate(account) {
    execSync(`cardano-cli stake-address registration-certificate \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.stake.cert
                    `);
    return `${this.dir}/priv/wallet/${account}/${account}.stake.cert`;
  }

  stakeAddressDeregistrationCertificate(account) {
    execSync(`cardano-cli stake-address deregistration-certificate \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.stake.cert
                    `);
    return `${this.dir}/priv/wallet/${account}/${account}.stake.cert`;
  }

  stakeAddressDelegationCertificate(account, poolId) {
    execSync(`cardano-cli stake-address delegation-certificate \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --stake-pool-id ${poolId} \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.deleg.cert
                    `);
    return `${this.dir}/priv/wallet/${account}/${account}.deleg.cert`;
  }

  stakeAddressKeyHash(account) {
    return execSync(`cardano-cli stake-address key-hash \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                    `)
      .toString()
      .replace(/\s+/g, " ");
  }

  /**
   *
   * @param {string} pool - Pool name
   */
  nodeKeyGenKES(pool) {
    execSync(`mkdir -p ${this.dir}/priv/pool/${pool}`);
    execSync(`cardano-cli node key-gen-KES \
                        --verification-key-file ${this.dir}/priv/pool/${pool}/${pool}.kes.vkey \
                        --signing-key-file ${this.dir}/priv/pool/${pool}/${pool}.kes.skey
                    `);
  }

  nodeKeyGen(pool) {
    execSync(`mkdir -p ${this.dir}/priv/pool/${pool}`);
    execSync(`cardano-cli node key-gen \
                        --cold-verification-key-file ${this.dir}/priv/pool/${pool}/${pool}.node.vkey \
                        --cold-signing-key-file ${this.dir}/priv/pool/${pool}/${pool}.node.skey \
                        --operational-certificate-issue-counter ${this.dir}/priv/pool/${pool}/${pool}.node.counter 
                    `);
  }

  nodeIssueOpCert(pool) {
    execSync(`cardano-cli node issue-op-cert \
                        --kes-verification-key-file ${
                          this.dir
                        }/priv/pool/${pool}/${pool}.kes.vkey \
                        --cold-signing-key-file ${
                          this.dir
                        }/priv/pool/${pool}/${pool}.node.skey \
                        --operational-certificate-issue-counter ${
                          this.dir
                        }/priv/pool/${pool}/${pool}.node.counter \
                        --kes-period ${this.KESPeriod()} \
                        --out-file ${
                          this.dir
                        }/priv/pool/${pool}/${pool}.node.cert 
                    `);
    return `${this.dir}/priv/pool/${pool}/${pool}.node.cert`;
  }

  nodeKeyGenVRF(pool) {
    execSync(`mkdir -p ${this.dir}/priv/pool/${pool}`);
    execSync(`cardano-cli node key-gen-VRF \
                        --verification-key-file ${this.dir}/priv/pool/${pool}/${pool}.vrf.vkey \
                        --signing-key-file ${this.dir}/priv/pool/${pool}/${pool}.vrf.skey
                    `);
  }

  stakePoolId(pool) {
    return execSync(
      `cardano-cli stake-pool id --cold-verification-key-file ${this.dir}/priv/pool/${pool}/${pool}.node.vkey`
    )
      .toString()
      .replace(/\s+/g, " ");
  }

  /**
   *
   * @param {string} metadata | original file content
   */
  stakePoolMetadataHash(metadata) {
    fs.writeFileSync(`${this.dir}/tmp/poolmeta.json`, metadata);
    let metaHash = execSync(
      `cardano-cli stake-pool metadata-hash --pool-metadata-file ${this.dir}/tmp/poolmeta.json`
    )
      .toString()
      .replace(/\s+/g, " ");
    execSync(`rm ${this.dir}/tmp/poolmeta.json`);
    return metaHash;
  }

  /**
   *
   * @param {string} pool | Pool name
   * @param {JSON} options | {pledge: Int, cost: Int, margin: Float, url: String, metaHash: String, rewardAccount: String, owners: Array, relays: Array}
   */
  stakePoolRegistrationCertificate(pool, options) {
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

    execSync(`cardano-cli stake-pool registration-certificate \
                --cold-verification-key-file ${this.dir}/priv/pool/${pool}/${pool}.node.vkey \
                --vrf-verification-key-file ${this.dir}/priv/pool/${pool}/${pool}.vrf.vkey \
                --pool-pledge ${options.pledge} \
                --pool-cost ${options.cost} \
                --pool-margin ${options.margin} \
                --pool-reward-account-verification-key-file ${options.rewardAccount} \
                ${owners} \
                ${relays} \
                ${this.network} \
                --metadata-url ${options.url} \
                --metadata-hash ${options.metaHash} \
                --out-file ${this.dir}/priv/pool/${pool}/${pool}.pool.cert
            `);
    return `${this.dir}/priv/pool/${pool}/${pool}.pool.cert`;
  }

  /**
   *
   * @param {string} pool | Pool name
   * @param {number} epoch | Retirement Epoch
   */
  stakePoolDeregistrationCertificate(pool, epoch) {
    execSync(`cardano-cli stake-pool deregistration-certificate \
                --cold-verification-key-file ${this.dir}/priv/pool/${pool}/${pool}.node.vkey \
                --epoch ${epoch}
                --out-file ${this.dir}/priv/pool/${pool}/${pool}.pool.dereg
              `);
    return `${this.dir}/priv/pool/${pool}/${pool}.pool.dereg`;
  }

  transactionBuildRaw(options) {
    if (!(options && options.txIn && options.txOut && options.witnessCount))
      throw new Error("TxIn, TxOut and WitnessCount required");
    let UID = Math.random().toString(36).substr(2, 9);
    let certs = options.certs ? certToString(options.certs) : "";
    let withdrawal = options.withdrawal
      ? `--withdrawal ${options.withdrawal.stakingAddress}+${options.withdrawal.reward}`
      : "";
    let txIn = options.txIn;
    let txOut = options.txOut;
    let txInString = txInToString(txIn);
    let txOutString = txOutToString(txOut);
    execSync(`cardano-cli transaction build-raw \
                ${txInString} \
                ${txOutString} \
                ${certs} \
                ${withdrawal} \
                --invalid-hereafter ${this.queryTip().slotNo + 10000} \
                --fee 0 \
                --out-file ${this.dir}/tmp/tx.tmp \
                ${this.era}`);

    let fee = parseInt(
      execSync(`cardano-cli transaction calculate-min-fee \
                --tx-body-file ${this.dir}/tmp/tx.tmp \
                --tx-in-count ${txIn.length} \
                --tx-out-count ${txOut.length} \
                --mainnet \
                --witness-count ${options.witnessCount} \
                --protocol-params-file ${this.protcolParametersPath}`)
        .toString()
        .replace(/\s+/g, " ")
        .split(" ")[0]
    );

    txIn[0].amount -= fee;
    txInString = txInToString(txIn);
    execSync(`cardano-cli transaction build-raw \
                ${txInString} \
                ${txOutString} \
                ${certs} \
                ${withdrawal} \
                --invalid-hereafter ${this.queryTip().slotNo + 10000} \
                --fee ${fee} \
                --out-file ${this.dir}/tmp/tx_${UID}.raw \
                ${this.era}`);

    return `${this.dir}/tmp/tx_${UID}.raw`;
  }

  transactionSign(options) {
    let UID = Math.random().toString(36).substr(2, 9);
    let signingKeys = signingKeysToString(options.signingKeys);
    let scriptFile = options.scriptFile
      ? `--script-file ${options.scriptFile}`
      : "";
    execSync(`cardano-cli transaction sign \
        --tx-body-file ${options.txBody} \
        ${scriptFile} \
        ${this.network} \
        ${signingKeys} \
        --out-file ${this.dir}/tmp/tx_${UID}.signed`);
    return `${this.dir}/tmp/tx_${UID}.signed`;
  }

  transactionWitness(options) {
    let UID = Math.random().toString(36).substr(2, 9);
    let scriptFile = options.scriptFile
      ? `--script-file ${options.scriptFile}`
      : "";
    execSync(`cardano-cli transaction witness \
        --tx-body-file ${options.txBody} \
        ${scriptFile} \
        ${this.network} \
        --signing-key-file ${options.signingKey} \
        --out-file ${this.dir}/tmp/tx_${UID}.witness`);
    return `${this.dir}/tmp/tx_${UID}.witness`;
  }

  transactionAssemble(options) {
    let UID = Math.random().toString(36).substr(2, 9);
    let witnessFiles = witnessFilesToString(options.witnessFiles);
    execSync(`cardano-cli transaction assemble \
        --tx-body-file ${options.txBody} \
        ${witnessFiles} \
        --out-file ${this.dir}/tmp/tx_${UID}.signed`);
    return `${this.dir}/tmp/tx_${UID}.signed`;
  }

  KESPeriod() {
    return parseInt(
      this.queryTip().slotNo / this.shelleyGenesis.slotsPerKESPeriod
    );
  }

  toLovelace(ada) {
    return ada * 1000000;
  }

  toAda(lovelace) {
    return lovelace / 1000000;
  }
}

module.exports = CardanoJs;
