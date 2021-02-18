const execSync =
  typeof window !== "undefined" || require("child_process").execSync;
const fs = typeof window !== "undefined" || require("fs");
const {
  ownerToString,
  relayToString,
  certToString,
  txInToString,
  txOutToString,
  signingKeysToString,
  witnessFilesToString,
  fileException,
  setKeys,
  fileExists,
  mintToString,
} = require("./helper");
const fetch =
  typeof window !== "undefined" ? window.fetch : require("sync-fetch");

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

class CardanocliJs {
  /**
   *
   * @param {Object} options
   * @param {path=} options.shelleyGenesisPath
   * @param {path=} options.socketPath - Default: Env Variable
   * @param {path=} options.cliPath - Default: Env Variable
   * @param {path=} options.dir - Default: Working Dir
   * @param {string=} options.era
   * @param {string=} options.network - Default: mainnet
   * @param {string=} options.httpProvider - Optional - Useful when using cli at different location than node or in browser
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
      options.httpProvider && (this.httpProvider = options.httpProvider);
      if (!this.httpProvider && typeof window !== "undefined")
        throw new Error("httpProvider required");
      if (this.httpProvider) {
        if (typeof window === "undefined") {
          this.shelleyGenesis = fetch(
            `${this.httpProvider}/shelleyGenesis`
          ).json();
        } else {
          (() => async () => {
            this.shelleyGenesis = await fetch(
              `${this.httpProvider}/shelleyGenesis`
            ).then((res) => res.json());
          })();
        }
      }
    }

    typeof window !== "undefined" || execSync(`mkdir -p ${this.dir}/tmp`);
  }

  /**
   * @returns {object}
   */
  queryProtocolParameters() {
    if (this.httpProvider) {
      let response = fetch(`${this.httpProvider}/queryProtocolParameters`);
      if (typeof window === "undefined") {
        response = response.json();
        fs.writeFileSync(
          `${this.dir}/tmp/protocolParams.json`,
          JSON.stringify(response)
        );
        this.protocolParametersPath = `${this.dir}/tmp/protocolParams.json`;
        return response;
      }
      return response.then((res) => res.json());
    }
    execSync(`${this.cliPath} query protocol-parameters \
                            --${this.network} \
                            --cardano-mode \
                            --out-file ${this.dir}/tmp/protocolParams.json \
                            ${this.era}
                        `);
    this.protocolParametersPath = `${this.dir}/tmp/protocolParams.json`;
    return JSON.parse(execSync(`cat ${this.dir}/tmp/protocolParams.json`));
  }

  /**
   * @returns {object}
   */
  queryTip() {
    if (this.httpProvider) {
      let response = fetch(`${this.httpProvider}/queryTip`);
      return typeof window !== "undefined"
        ? response.then((res) => res.json())
        : response.json();
    }
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
    if (this.httpProvider) {
      let response = fetch(
        `${this.httpProvider}/queryStakeAddressInfo/${address}`
      );
      return typeof window !== "undefined"
        ? response.then((res) => res.json())
        : response.json();
    }
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
    if (this.httpProvider) {
      let response = fetch(`${this.httpProvider}/queryUtxo/${address}`);
      return typeof window !== "undefined"
        ? response.then((res) => res.json())
        : response.json();
    }
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
      let txHash = utxo[0];
      let txId = utxo[1];
      let assets = utxo.slice(2, utxo.length).join(" ").split("+");
      let amount = {};
      assets.forEach((asset) => {
        let [value, currency] = asset.trim().split(" ");
        value = parseInt(value);
        amount[currency] = value;
      });
      return {
        txHash: utxo[0],
        txId: parseInt(utxo[1]),
        amount,
      };
    });

    return result;
  }

  /**
   *
   * @param {string} account - Name of account
   */
  addressKeyGen(account) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/${account}/addressKeyGen`);
      return response.then((res) => res.json());
    }
    let vkey = `${this.dir}/priv/wallet/${account}/${account}.payment.vkey`;
    let skey = `${this.dir}/priv/wallet/${account}/${account}.payment.skey`;
    fileExists([vkey, skey]);
    execSync(`mkdir -p ${this.dir}/priv/wallet/${account}`);
    execSync(`${this.cliPath} address key-gen \
                        --verification-key-file ${vkey} \
                        --signing-key-file ${skey}
                    `);
    return {
      vkey,
      skey,
    };
  }

  /**
   *
   * @param {string} account - Name of account
   */
  stakeAddressKeyGen(account) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(
        `${this.httpProvider}/${account}/stakeAddressKeyGen`
      );
      return response.then((res) => res.json());
    }
    let vkey = `${this.dir}/priv/wallet/${account}/${account}.stake.vkey`;
    let skey = `${this.dir}/priv/wallet/${account}/${account}.stake.skey`;
    fileExists([vkey, skey]);
    execSync(`mkdir -p ${this.dir}/priv/wallet/${account}`);
    execSync(`${this.cliPath} stake-address key-gen \
                        --verification-key-file ${vkey} \
                        --signing-key-file ${skey}
                    `);
    return {
      vkey,
      skey,
    };
  }

  /**
   *
   * @param {string} account - Name of account
   * @returns {path}
   */
  stakeAddressBuild(account) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/${account}/stakeAddressBuild`);
      return response.then((res) => res.text());
    }
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/${account}/addressBuild`);
      return response.then((res) => res.text());
    }
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/${account}/addressKeyHash`);
      return response.then((res) => res.text());
    }
    return execSync(`${this.cliPath} address key-hash \
                        --payment-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.vkey \
                    `)
      .toString()
      .trim();
  }

  /**
   *
   * @param {paymentAddr} address
   * @returns {object}
   */
  addressInfo(address) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/addressInfo/${address}`);
      return response.then((res) => res.json());
    }
    return JSON.parse(
      execSync(`${this.cliPath} address info \
            --address ${address} \
            `)
        .toString()
        .replace(/\s+/g, " ")
    );
  }

  /**
   *
   * @param {object} script
   * @returns {paymentAddr}
   */
  addressBuildScript(script) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/addressBuildScript`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(script),
      });
      return response.then((res) => res.text());
    }
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
   */
  wallet(account) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}${account}/wallet`);
      return response.then((res) => res.json());
    }
    let paymentAddr = "No payment keys generated";
    let stakingAddr = "No staking keys generated";

    fileException(() => {
      paymentAddr = fs
        .readFileSync(
          `${this.dir}/priv/wallet/${account}/${account}.payment.addr`
        )
        .toString();
    });
    fileException(() => {
      stakingAddr = fs
        .readFileSync(
          `${this.dir}/priv/wallet/${account}/${account}.stake.addr`
        )
        .toString();
    });

    let files = fs.readdirSync(`${this.dir}/priv/wallet/${account}`);
    let keysPath = {};
    files.forEach((file) => {
      let name = file.split(".")[1] + "." + file.split(".")[2];
      setKeys(keysPath, name, `${this.dir}/priv/wallet/${account}/${file}`);
    });

    let balance = () => {
      let utxos = this.queryUtxo(paymentAddr);
      let amount = {};
      utxos.forEach((utxo) => {
        Object.keys(utxo.amount).forEach((currency) => {
          if (!amount[currency]) amount[currency] = 0;
          amount[currency] += utxo.amount[currency];
        });
      });

      return { utxo: utxos, amount };
    };
    let reward = () => {
      let r;
      try {
        r = this.queryStakeAddressInfo(stakingAddr);
        r = r.find((delegation) => delegation.address == stakingAddr)
          .rewardAccountBalance;
      } catch {
        r = "Staking key is not registered";
      }
      return r;
    };

    return {
      name: account,
      paymentAddr,
      stakingAddr,
      balance,
      reward,
      ...keysPath,
    };
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   */
  pool(poolName) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}${poolName}/pool`);
      return response.then((res) => res.json());
    }
    let id;
    fileException(() => {
      fs.readFileSync(
        `${this.dir}/priv/pool/${poolName}/${poolName}.node.vkey`
      );
      id = this.stakePoolId(poolName);
    });
    let files = fs.readdirSync(`${this.dir}/priv/pool/${poolName}`);
    let keysPath = {};
    files.forEach((file) => {
      let name = file.split(".")[1] + "." + file.split(".")[2];
      setKeys(keysPath, name, `${this.dir}/priv/pool/${poolName}/${file}`);
    });
    return {
      name: poolName,
      id,
      ...keysPath,
    };
  }

  /**
   *
   * @param {string} account - Name of the account
   * @returns {path}
   */
  stakeAddressRegistrationCertificate(account) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(
        `${this.httpProvider}${account}/stakeAddressRegistrationCertificate`
      );
      return response.then((res) => res.text());
    }
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(
        `${this.httpProvider}${account}/stakeAddressDeregistrationCertificate`
      );
      return response.then((res) => res.text());
    }
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(
        `${this.httpProvider}${account}/stakeAddressDelegationCertificate?poolId=${poolId}`
      );
      return response.then((res) => res.text());
    }
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(
        `${this.httpProvider}/${account}/stakeAddressKeyHash`
      );
      return response.then((res) => res.text());
    }
    return execSync(`${this.cliPath} stake-address key-hash \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                    `)
      .toString()
      .trim();
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   */
  nodeKeyGenKES(poolName) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/${poolName}/nodeKeyGenKES`);
      return response.then((res) => res.json());
    }
    let vkey = `${this.dir}/priv/pool/${poolName}/${poolName}.kes.vkey`;
    let skey = `${this.dir}/priv/pool/${poolName}/${poolName}.kes.skey`;
    fileExists([vkey, skey]);
    execSync(`mkdir -p ${this.dir}/priv/pool/${poolName}`);
    execSync(`${this.cliPath} node key-gen-KES \
                        --verification-key-file ${vkey} \
                        --signing-key-file ${skey}
                    `);
    return {
      vkey,
      skey,
    };
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   */
  nodeKeyGen(poolName) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/${poolName}/nodeKeyGen`);
      return response.then((res) => res.json());
    }
    let vkey = `${this.dir}/priv/pool/${poolName}/${poolName}.node.vkey`;
    let skey = `${this.dir}/priv/pool/${poolName}/${poolName}.node.skey`;
    let counter = `${this.dir}/priv/pool/${poolName}/${poolName}.node.counter`;
    fileExists([vkey, skey, counter]);
    execSync(`mkdir -p ${this.dir}/priv/pool/${poolName}`);
    execSync(`${this.cliPath} node key-gen \
                        --cold-verification-key-file ${vkey} \
                        --cold-signing-key-file ${skey} \
                        --operational-certificate-issue-counter ${counter}
                    `);
    return {
      vkey,
      skey,
      counter,
    };
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   * @param {number=} kesPeriod - Optional (Offline mode)
   * @returns {path}
   */
  nodeIssueOpCert(poolName, kesPeriod) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/${poolName}/nodeIssueOpCert`);
      return response.then((res) => res.text());
    }
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
                        --kes-period ${
                          kesPeriod ? kesPeriod : this.KESPeriod()
                        } \
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/${poolName}/nodeKeyGenVRF`);
      return response.then((res) => res.json());
    }
    let vkey = `${this.dir}/priv/pool/${poolName}/${poolName}.vrf.vkey`;
    let skey = `${this.dir}/priv/pool/${poolName}/${poolName}.vrf.skey`;
    fileExists([vkey, skey]);
    execSync(`mkdir -p ${this.dir}/priv/pool/${poolName}`);
    execSync(`${this.cliPath} node key-gen-VRF \
                        --verification-key-file ${vkey} \
                        --signing-key-file ${skey}
                    `);
    return {
      vkey,
      skey,
    };
  }

  nodeNewCounter(poolName, counter) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(
        `${this.httpProvider}/${poolName}/nodeNewCounter?counter=${counter}`
      );
      return response.then((res) => res.text());
    }

    execSync(`mkdir -p ${this.dir}/priv/pool/${poolName}`);
    execSync(`${this.cliPath} node new-counter \
                        --cold-verification-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.node.vkey \
                        --counter-value ${counter} \
                        --operational-certificate-issue-counter-file ${this.dir}/priv/pool/${poolName}/${poolName}.node.counter
                    `);
    return `${this.dir}/priv/pool/${poolName}/${poolName}.node.counter`;
  }

  /**
   *
   * @param {string} poolName - Name of the pool
   * @returns {string}
   */
  stakePoolId(poolName) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/${poolName}/stakePoolId`);
      return response.then((res) => res.text());
    }
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/stakePoolMetadataHash`, {
        method: "POST",
        body: metadata,
      });
      return response.then((res) => res.text());
    }
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

    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(
        `${this.httpProvider}/${poolName}/stakePoolRegistrationCertificate`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(options),
        }
      );
      return response.then((res) => res.text());
    }

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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(
        `${this.httpProvider}/${poolName}/stakePoolDeregistrationCertificate`
      );
      return response.then((res) => res.text());
    }
    execSync(`${this.cliPath} stake-pool deregistration-certificate \
                --cold-verification-key-file ${this.dir}/priv/pool/${poolName}/${poolName}.node.vkey \
                --epoch ${epoch} \
                --out-file ${this.dir}/priv/pool/${poolName}/${poolName}.pool.cert
              `);
    return `${this.dir}/priv/pool/${poolName}/${poolName}.pool.cert`;
  }

  /**
   *
   * @param {Object} options
   * @param {Array<object>} options.txIn
   * @param {Array<object>} options.txOut
   * @param {object=} options.withdrawal
   * @param {Array<path>=} options.certs
   * @param {lovelace=} options.fee
   * @param {Array<object>} options.mint
   * @param {object=} options.script
   * @param {object=} options.metadata
   * @param {number=} options.invalidBefore - Default: 0
   * @param {number=} options.invalidAfter - Default: 10000
   * @returns {path}
   */
  transactionBuildRaw(options) {
    if (!(options && options.txIn && options.txOut))
      throw new Error("TxIn and TxOut required");
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/transactionBuildRaw`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(options),
      });
      return response.then((res) => res.text());
    }
    let scriptFile = "";
    if (options.script) {
      let scriptUID = Math.random().toString(36).substr(2, 9);
      fs.writeFileSync(
        `${this.dir}/tmp/script_${scriptUID}.json`,
        JSON.stringify(options.script)
      );
      scriptFile = `--script-file ${this.dir}/tmp/script_${scriptUID}.json`;
    }
    let metadataFile = "";
    if (options.metadata) {
      let metatUID = Math.random().toString(36).substr(2, 9);
      fs.writeFileSync(
        `${this.dir}/tmp/metadata_${metatUID}.json`,
        JSON.stringify(options.metadata)
      );
      metadataFile = `--metadata-json-file ${this.dir}/tmp/metadata_${metatUID}.json`;
    }
    let UID = Math.random().toString(36).substr(2, 9);
    let certs = options.certs ? certToString(options.certs) : "";
    let withdrawal = options.withdrawal
      ? `--withdrawal ${options.withdrawal.stakingAddress}+${options.withdrawal.reward}`
      : "";
    let txInString = txInToString(options.txIn);
    let txOutString = txOutToString(options.txOut);
    let mintString = options.mint ? mintToString(options.mint) : "";
    execSync(`${this.cliPath} transaction build-raw \
                ${txInString} \
                ${txOutString} \
                ${certs} \
                ${withdrawal} \
                ${mintString} \
                ${scriptFile} \
                ${metadataFile} \
                --invalid-hereafter ${
                  options.invalidAfter
                    ? options.invalidAfter
                    : this.queryTip().slotNo + 10000
                } \
                --invalid-before ${
                  options.invalidBefore ? options.invalidBefore : 0
                } \
                --fee ${options.fee ? options.fee : 0} \
                --out-file ${this.dir}/tmp/tx_${UID}.raw \
                ${this.era}`);

    return `${this.dir}/tmp/tx_${UID}.raw`;
  }

  /**
   *
   * @param {Object} options
   * @param {path} options.txBody
   * @param {Array<object>} options.txIn
   * @param {Array<object>} options.txOut
   * @param {number} options.witnessCount
   * @returns {lovelace}
   */
  transactionCalculateMinFee(options) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/transactionCalculateMinFee`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(options),
      });
      return response.then((res) => res.text());
    }
    this.queryProtocolParameters();
    return parseInt(
      execSync(`${this.cliPath} transaction calculate-min-fee \
                --tx-body-file ${options.txBody} \
                --tx-in-count ${options.txIn.length} \
                --tx-out-count ${options.txOut.length} \
                --mainnet \
                --witness-count ${options.witnessCount} \
                --protocol-params-file ${this.protocolParametersPath}`)
        .toString()
        .replace(/\s+/g, " ")
        .split(" ")[0]
    );
  }

  /**
   *
   * @param {object} script
   * @returns {string} - Policy Id
   */
  transactionPolicyid(script) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/transactionPolicyid`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(script),
      });
      return response.then((res) => res.text());
    }
    let UID = Math.random().toString(36).substr(2, 9);
    fs.writeFileSync(
      `${this.dir}/tmp/script_${UID}.json`,
      JSON.stringify(script)
    );
    return execSync(
      `${this.cliPath} transaction policyid --script-file ${this.dir}/tmp/script_${UID}.json`
    )
      .toString()
      .trim();
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/transactionSign`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(options),
      });
      return response.then((res) => res.text());
    }
    let UID = Math.random().toString(36).substr(2, 9);
    let signingKeys = signingKeysToString(options.signingKeys);
    let scriptFile = "";
    if (options.scriptFile) {
      let UIDScript = Math.random().toString(36).substr(2, 9);
      fs.writeFileSync(
        `${this.dir}/tmp/script_${UIDScript}.json`,
        JSON.stringify(options.scriptFile)
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/transactionWitness`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(options),
      });
      return response.then((res) => res.text());
    }
    let UID = Math.random().toString(36).substr(2, 9);
    let scriptFile = "";
    if (options.scriptFile) {
      let UIDScript = Math.random().toString(36).substr(2, 9);
      fs.writeFileSync(
        `${this.dir}/tmp/script_${UIDScript}.json`,
        JSON.stringify(options.scriptFile)
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
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/transactionAssemble`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(options),
      });
      return response.then((res) => res.text());
    }
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
   * @param {path | string} tx - Path or Signed Tx File
   * @returns {string} - Transaction Hash
   */
  transactionSubmit(tx) {
    if (this.httpProvider) {
      if (typeof window === "undefined") {
        let body = fs.readFileSync(tx).toString();
        return fetch(`${this.httpProvider}/transactionSubmit`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: body,
        }).text();
      } else {
        return fetch(
          `${this.httpProvider}/transactionSubmit?filePath=${tx}`
        ).response.then((res) => res.text());
      }
    }
    let UID = Math.random().toString(36).substr(2, 9);
    let parsedTx;

    if (typeof tx == "object") {
      fs.writeFileSync(`${this.dir}/tmp/tx_${UID}.signed`, JSON.stringify(tx));
      parsedTx = `${this.dir}/tmp/tx_${UID}.signed`;
    } else {
      parsedTx = tx;
    }
    execSync(
      `${this.cliPath} transaction submit --${this.network} --tx-file ${parsedTx}`
    );
    return this.transactionTxid({ txFile: parsedTx });
  }

  /**
   *
   * @param {Object} options
   * @param {path=} options.txBody
   * @param {path=} options.txFile
   * @returns {path}
   */
  transactionTxid(options) {
    if (this.httpProvider && typeof window !== "undefined") {
      let response = fetch(`${this.httpProvider}/transactionTxid`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(options),
      });
      return typeof window !== "undefined"
        ? response.then((res) => res.text())
        : response.text();
    }
    let txArg = options.txBody
      ? `--tx-body-file ${options.txBody}`
      : `--tx-file ${options.txFile}`;
    return execSync(`${this.cliPath} transaction txid ${txArg}`)
      .toString()
      .trim();
  }

  /**
   * @returns {number}
   */
  KESPeriod() {
    if (this.httpProvider) {
      let response = fetch(`${this.httpProvider}/KESPeriod`);
      return typeof window !== "undefined"
        ? response.then((res) => parseInt(res.text()))
        : parseInt(response.text());
    }
    if (!this.shelleyGenesis) throw new Error("shelleyGenesisPath required");
    return parseInt(
      this.queryTip().slotNo / this.shelleyGenesis.slotsPerKESPeriod
    );
  }

  /**
   *
   * @param {path} filePath
   * @returns {path} - Download link for the file
   */
  getDownloadUrl(filePath) {
    if (!this.httpProvider) throw new Error("No httpProvider");
    let response = fetch(
      `${this.httpProvider}/getDownloadUrl?filePath=${filePath}`
    );
    return typeof window !== "undefined"
      ? response.then((res) => res.text())
      : response.text();
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

module.exports = CardanocliJs;
