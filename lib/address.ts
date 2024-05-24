import { CliCommand } from "./command";
import { filesShouldExist, filesShouldNotExist, mkdirp, objectToFile } from "./helpers";

export class AddressCommand extends CliCommand {
    command = "address";

    /**
     *
     * @param account Name of the account
     * @returns Object with the path to the verification key file and the signgin key file
     */
    keyGen(account: string): {vkey: string, skey: string } {
        const privAccountDir = `${this.cli.options.dir}/priv/wallet/${account}`;
        const vkey = `${privAccountDir}/${account}.payment.vkey`;
        const skey = `${privAccountDir}/${account}.payment.skey`;
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
     *
     * @param account Name of the account
     * @returns Path to the payment address file
     */
    build(
        account: string,
        options: { paymentScriptFile?: string, stakeScriptFile?: string }
    ) {
        const privAccountDir = `${this.cli.options.dir}/priv/wallet/${account}`;
        const paymentVkeyFile = `${privAccountDir}/${account}.payment.vkey`;
        const stakeVKeyFile = `${privAccountDir}/${account}.stake.vkey`;
        const outPaymentAddrFile = `${privAccountDir}/${account}.payment.addr`;

        filesShouldExist([
            stakeVKeyFile,
            paymentVkeyFile,
        ]);
        if (options.paymentScriptFile) filesShouldExist([options.paymentScriptFile]);
        if (options.stakeScriptFile) filesShouldExist([options.stakeScriptFile]);
        filesShouldNotExist([outPaymentAddrFile]);

        const params = [
            { name: "payment-verification-key-file", value: paymentVkeyFile },
            { name: "stake-verification-key-file", value: stakeVKeyFile },
            { name: "out-file", value: outPaymentAddrFile },
        ];
        if (options.paymentScriptFile) params.push({ name: "payment-script-file", value: options.paymentScriptFile });
        if (options.stakeScriptFile) params.push({ name: "stake-script-file", value: options.stakeScriptFile });

        this.run("build", params, true);

        return outPaymentAddrFile;
    }

    /**
     *
     * @param account
     * @returns the payment verificaiton key hash string
     */
    keyHash(account: string): string {
        const privAccountDir = `${this.cli.options.dir}/priv/wallet/${account}`;
        const paymentVkeyFile = `${privAccountDir}/${account}.payment.vkey`;

        filesShouldExist([paymentVkeyFile]);

        return this.run("key-hash", [
            { name: "payment-verification-key-file", value: paymentVkeyFile }
        ]);
    }

    /**
     *
     * @param address
     * @returns
     */
    info(address: string): string {
        const res = this.run("info", [{ name: "address", value: address }]);
        return JSON.parse(res);
    }
}
