const execSync = require("child_process").execSync;
const fs = require("fs");

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
    this.protocolParameters = this.queryProtcolParameters();
  }

  queryProtcolParameters() {
    execSync(`cardano-cli query protocol-parameters \
                            ${this.network} \
                            --cardano-mode \
                            --out-file ${this.dir}/tmp/protocolParams.json \
                            ${this.era}
                        `);
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
        } catch (err) {
          throw new Error(`File ${file} of Account ${account} doesn't exist`);
        }
        return {
          path: `${this.dir}/priv/wallet/${account}/${account}.${fileName}`,
          content,
        };
      },
    };
  }

  stakeAddressRegistrationCertificate(account) {
    execSync(`cardano-cli stake-address registration-certificate \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.stake.cert
                    `);
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

  KESPeriod() {
    return parseInt(
      this.queryTip().slotNo / this.shelleyGenesis.slotsPerKESPeriod
    );
  }
}

module.exports = CardanoJs;
