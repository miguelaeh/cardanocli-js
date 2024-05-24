import { CliCommand } from "./command";
import { filesShouldExist, filesShouldNotExist, mkdirp } from "./helpers";

export class StakeAddressCommand extends CliCommand {
    command = "stake-address";

    /**
     *
     * @param account Name of the account
     * @returns Object with the path to the verification key file and the signgin key file
     */
    keyGen(account: string): {vkey: string, skey: string } {
        const privAccountDir = `${this.cli.options.dir}/priv/wallet/${account}`;
        const vkey = `${privAccountDir}/${account}.stake.vkey`;
        const skey = `${privAccountDir}/${account}.stake.skey`;
        filesShouldNotExist([vkey, skey]);
        mkdirp(privAccountDir);

        this.run("key-gen", [
            { name: "verification-key-file", value: vkey },
            { name: "signing-key-file", value: skey },
        ]);

        return {
            vkey,
            skey,
        };
    }

    /**
     * Get a stake address key hash
     * @param account
     * @returns hash of the key as string
     */
    keyHash(account: string): string {
        const privAccountDir = `${this.cli.options.dir}/priv/wallet/${account}`;
        const stakeVKeyFile = `${privAccountDir}/${account}.stake.vkey`;

        return this.run("key-hash", [
            { name: "stake-verification-key-file", value: stakeVKeyFile },
        ]);
    }

    /**
     *
     * @param account Name of the account
     * @returns Path to the stake address file
     */
    build(account: string) {
        const privAccountDir = `${this.cli.options.dir}/priv/wallet/${account}`;
        const stakeVKeyFile = `${privAccountDir}/${account}.stake.vkey`;
        const addrFilePath = `${privAccountDir}/${account}.stake.addr`;
        filesShouldExist([stakeVKeyFile]);
        filesShouldNotExist([addrFilePath]);
        mkdirp(privAccountDir);

        this.run("build", [
            { name: "stake-verification-key-file", value: stakeVKeyFile },
            { name: "out-file", value: addrFilePath },
        ], true);

        return addrFilePath;
    }

    /**
     *
     * @param account Account name
     * @return  file path of the generated certificate
     */
    registrationCertificate(account: string): string {
        const privAccountDir = `${this.cli.options.dir}/priv/wallet/${account}`;
        const stakeVKeyFile = `${privAccountDir}/${account}.stake.vkey`;
        const stakeRegCertFile = `${privAccountDir}/${account}/${account}-reg.stake.cert`;

        filesShouldExist([stakeVKeyFile]);
        filesShouldNotExist([stakeRegCertFile]);
        mkdirp(privAccountDir);

        this.run("registration-certificate", [
            { name: "stake-verification-key-file", value: stakeVKeyFile },
            { name: "key-reg-deposit-amt", value: this.cli.query.govState().currentPParams.stakeAddressDeposit },
            { name: "out-file", value: stakeRegCertFile },
        ]);

        return stakeRegCertFile;
    }

     /**
     *
     * @param account Account name
     * @return  file path of the generated certificate
     */
     deRegistrationCertificate(account: string, options: { stakeScriptFile?: string, amount?: string }): string {
        const privAccountDir = `${this.cli.options.dir}/priv/wallet/${account}`;
        const stakeVKeyFile = `${privAccountDir}/${account}.stake.vkey`;
        const stakeDeregCertFile = `${privAccountDir}/${account}/${account}-dereg.stake.cert`;

        filesShouldExist([stakeVKeyFile]);
        if (options.stakeScriptFile) filesShouldExist([options.stakeScriptFile]);
        filesShouldNotExist([stakeDeregCertFile]);
        mkdirp(privAccountDir);

        let params = [
            { name: "stake-verification-key-file", value: stakeVKeyFile },
            { name: "key-reg-deposit-amt", value: this.cli.query.govState().currentPParams.stakeAddressDeposit },
            { name: "out-file", value: stakeDeregCertFile },
        ];
        if (options.amount) params.push({ name: "key-reg-deposit-amt", value: options.amount });
        if (options.stakeScriptFile) params.push( { name: "stake-script-file", value: options.stakeScriptFile });

        this.run("deregistration-certificate", params);

        return stakeDeregCertFile;
    }

     /**
     * Create stake delegation certificate. If no stake script file is provided it uses the account stake verification key.
     * @param account Account name
     * @return file path of the generated certificate
     */
     delegationCertificate(account: string, options: { stakePoolId: string, stakeScriptFile?: string }): string {
        const privAccountDir = `${this.cli.options.dir}/priv/wallet/${account}`;
        const stakeVKeyFile = `${privAccountDir}/${account}.stake.vkey`;
        const stakeDelegCertFile = `${privAccountDir}/${account}/${account}.deleg.cert`;

        if (!options.stakePoolId) throw "Missing options.stakePoolId in call to delegationCertificate";

        filesShouldExist([stakeVKeyFile]);
        if (options.stakeScriptFile) filesShouldExist([options.stakeScriptFile]);
        filesShouldNotExist([stakeDelegCertFile]);
        mkdirp(privAccountDir);

        let params = [
            { name: "stake-pool-id", value: options.stakePoolId },
            { name: "out-file", value: stakeDelegCertFile },
        ];
        // One of the following is required
        if (options.stakeScriptFile) {
            params.push({ name: "stake-script-file", value: options.stakeScriptFile });
        } else {
            params.push({ name: "stake-verification-key-file", value: stakeVKeyFile });
        }

        this.run("stake-delegation-certificate", params);

        return stakeDelegCertFile;
    }
}
