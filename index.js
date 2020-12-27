const execSync = require("child_process").execSync;

class CardanoJs {
    /**
     *
     * @param {JSON} options - {socketPath: optional, era:optional, network: optional, dir: optional}
     */

    constructor(options) {
        this.network = `--mainnet`;
        this.era = "";
        this.dir = ".";
        if (options) {
            options.socketPath &&
                execSync(`export CARDANO_NODE_SOCKET_PATH=${options.socketPath}`);
            options.era && (this.era = "--" + options.era + "-era");
            options.network && (this.network = "--" + options.network);
            options.dir && (this.dir = options.dir);
        }
        this.protocolParameters = this.queryProtcolParameters();
    }

    queryProtcolParameters() {
        execSync(`mkdir -p ${this.dir}/tmp`)
        execSync(`cardano-cli query protocol-parameters \
                            ${this.network} \
                            --cardano-mode \
                            --out-file ${this.dir}/tmp/protocolParams.json \
                            ${this.era}
                        `)
        return JSON.parse(
            execSync(`cat ${this.dir}/tmp/protocolParams.json`))
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
            `).toString()

        let utxos = utxosRaw.split('\n');
        utxos.splice(0, 1);
        utxos.splice(0, 1);
        utxos.splice(utxos.length - 1, 1);
        let result = utxos.map((raw, index) => {
            let utxo = raw.replace(/\s+/g, " ").split(" ");
            return { txHash: utxo[0], txId: parseInt(utxo[1]), amount: parseInt(utxo[2]) }
        })


        return result;
    }

    /**
     * 
     * @param {string} account - Name for the payment account keys 
     */
    addressKeyGen(account) {
        execSync(`mkdir -p ${this.dir}/priv/wallet/${account}`)
        execSync(`cardano-cli address key-gen \
                        --verification-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.vkey \
                        --signing-key-file ${this.dir}/priv/wallet/${account}/${account}.payment.skey
                    `)
    }

    /**
     * 
     * @param {string} account - Name for the stake account keys 
     */
    stakeAddressKeyGen(account) {
        execSync(`mkdir -p ${this.dir}/priv/wallet/${account}`)
        execSync(`cardano-cli stake-address key-gen \
                        --verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --signing-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.skey
                    `)
    }

    /**
   * 
   * @param {string} account - Name for the account
   */
    stakeAddressBuild(account) {
        execSync(`cardano-cli stake-address build \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.stake.addr \
                        --mainnet
                    `)
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
                    --mainnet
                `)
    }

    address(account) {
        return execSync(`cat ${this.dir}/priv/wallet/${account}/${account}.payment.addr`).toString();
    }

    stakingAddress(account) {
        return execSync(`cat ${this.dir}/priv/wallet/${account}/${account}.stake.addr`).toString();
    }

    stakeAddressRegistrationCertificate(account) {
        execSync(`cardano-cli stake-address registration-certificate \
                        --staking-verification-key-file ${this.dir}/priv/wallet/${account}/${account}.stake.vkey \
                        --out-file ${this.dir}/priv/wallet/${account}/${account}.stake.cert
                    `)
    }

}


module.exports = CardanoJs;