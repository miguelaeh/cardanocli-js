import { CliCommand } from "./command";
import { CommandParameter } from "./types";

export class TransactionCommand extends CliCommand {
    command = "transaction";

    /**
     * Build a raw transaction
     * @param options - Array of parameters. Usually tx-in and tx-out in the form [{ name: "tx-in", value: "hash#outId" }, { name: "tx-out", value: "addr amount" }]. You can also add other parameters
     */
    buildRaw(options: CommandParameter[]) {
        const tx_in = options.find((o) => o.name === "tx-in");
        if (!tx_in) throw new Error("At least one tx-in must be provided");
        const tx_out = options.find((o) => o.name === "tx-out");
        if (!tx_out) throw new Error("At least one tx-out must be provided");

        const invalid_hereafter = options.find((o) => o.name === "invalid-hereafter");
        if (!invalid_hereafter) options.push({ name: "invalid-hereafter", value: Number(this.cli.query.tip().slot) + 10000 });
        const invalid_before = options.find((o) => o.name === "invalid-before");
        if (!invalid_before) options.push({ name: "invalid-before", value: 0 });
        const fee = options.find((o) => o.name === "fee");
        if (!fee) options.push({ name: "fee", value: 0 });

        let uid = Math.random().toString(36).substring(2, 9);
        const out_file = `/tmp/transaction-${uid}.raw`;
        options.push({ name: "out-file", value: out_file });

        this.run("build-raw", options);

        return out_file;
    }

     /**
     * Build a transaction
     * @param options - Array of parameters. Usually tx-in and tx-out in the form [{ name: "tx-in", value: "hash#outId" }, { name: "tx-out", value: "addr#amount" }]. You can also add other parameters
     */
    build(options: CommandParameter[]) {
        const tx_in = options.find((o) => o.name === "tx-in");
        if (!tx_in) throw new Error("At least one tx-in must be provided");
        const tx_out = options.find((o) => o.name === "tx-out");
        if (!tx_out) throw new Error("At least one tx-out must be provided");

        const invalid_hereafter = options.find((o) => o.name === "invalid-hereafter");
        if (!invalid_hereafter) options.push({ name: "invalid-hereafter", value: Number(this.cli.query.tip().slot) + 10000 });
        const invalid_before = options.find((o) => o.name === "invalid-before");
        if (!invalid_before) options.push({ name: "invalid-before", value: 0 });
        //const protocol_params = options.find((o) => o.name === "protocol-params-file");
        //if (!protocol_params) options.push({ name: "protocol-params-file", value: this.cli.query.protocolParametersFile() });

        let uid = Math.random().toString(36).substring(2, 9);
        const out_file = `/tmp/transaction-${uid}.raw`;
        options.push({ name: "out-file", value: out_file });

        this.run("build", options, true);

        return out_file;
    }

    /**
     * Calcuate the min fee of a transaction
     * @param txFilePath
     * @param txInCount
     * @param txOutCount
     * @param witnessCount
     * @returns number - the min fee in lovelace
     */
    calculateMinFee(
        txFilePath: string,
        txInCount: number,
        txOutCount: number,
        witnessCount: number
    ): number {
        const res = this.run("calculate-min-fee", [
            { name: "tx-body-file", value: txFilePath },
            { name: "tx-in-count", value: txInCount },
            { name: "tx-out-count", value: txOutCount },
            { name: "witness-count", value: witnessCount },
            { name: "protocol-params-file", value: this.cli.query.protocolParametersFile() },
        ]);
        const minFee = res.split(" ")[0];
        return parseInt(minFee);
    }

    /**
     * Get the transaction policy id from the script file
     * @param scriptFile
     * @returns string - the policy id
     */
    transactionPolicyId(scriptFile: string): string {
        return this.run("policyid", [
            { name: "script-file", value: scriptFile }
        ]);
    }

    /**
     * Get the script data hash (datum hash)
     * @param scriptData Object containing the script data
     * @returns string - Datum hash
     */
    hashScriptData(scriptData: any) : string {
        return this.run("hash-script-data", [
            { name: "script-data-value", value: JSON.stringify(scriptData) }
        ]);
    }

    /**
     * Sign a transaction and returns the signed transaction file path
     * @param txBodyFile string - file path for the transaction  body file
     * @param signingKeyFiles string - an array of file paths to the signing keys
     * @returns string - Signed transaction file path
     */
    sign(txBodyFile: string, signingKeyFiles: string[]) : string {
        let uid = Math.random().toString(36).substring(2, 9);
        const outFile = `/tmp/transaction-${uid}.signed`;
        const params =  [
            { name: "tx-body-file", value: txBodyFile },
            { name: "out-file", value: outFile },
        ];
        const signings = signingKeyFiles.map((s) => ({ name: "signing-key-file", value: s }));
        params.concat(signings);

        this.run("sign", params);

        return outFile;
    }

    /**
     * Create witness file for a transaction
     * @param txBodyFile string - File path of the transcation body
     * @param signingKeyFiles string[] - List of signing key file paths
     * @returns string - file path for the generated witness file
     */
    witness(txBodyFile: string, signingKeyFiles: string[]) {
        let uid = Math.random().toString(36).substring(2, 9);
        const outFile = `/tmp/transaction-${uid}.witness`;
        const params = [
            { name: "tx-body-file", value: txBodyFile },
            { name: "out-file", value: outFile },
        ];
        const signings = signingKeyFiles.map((s) => ({ name: "signing-key-file", value: s }));
        params.concat(signings);

        this.run("witness", params);

        return outFile;
    }

    /**
     * Assemble a transaction from a transaction body and some witnesses
     * @param txBodyFile string - path to the tx body
     * @param witnessFiles string[] - list of witness file paths
     * @returns string - file path to the assembled transaction
     */
    assemble(txBodyFile: string, witnessFiles: string[]) : string {
        let uid = Math.random().toString(36).substring(2, 9);
        const outFile = `/tmp/transaction-${uid}.signed`;
        const params = [
            { name: "tx-body-file", value: txBodyFile },
            { name: "out-file", value: outFile },
        ];
        const witnesses = witnessFiles.map((s) => ({ name: "witness-file", value: s }));
        params.concat(witnesses);

        this.run("assemble", params);

        return outFile;
    }

    /**
     * Calucate the min required UTxo of a transaction.
     * @param options List of command parameters in the form [{name: "param-name", value: "someValue" | number }]. "protocol-params-file" is automatically added
     * @returns the min requierd utxo for a transaction
     */
    calculateMinRequiredUtxo(options: CommandParameter[]) : string {
        const protocol_params = options.find((o) => o.name === "protocol-params-file");
        if (!protocol_params) options.push({ name: "protocol-params-file", value: this.cli.query.protocolParametersFile() });

        const res = this.run("calculate-min-required-utxo", options);
        const minRequiredUtxo = res.split(" ")[1];
        return minRequiredUtxo;
    }

    submit(signedTxFile: string) {
        this.run("submit", [
            { name: "tx-file", value: signedTxFile },
            { name: "socket-path", value: this.cli.options.socketPath }
        ]);

        return this.txId({ txFile: signedTxFile });
    }

    /**
     * Return the transaction Id
     * @param options
     * @returns string - transaction ID
     */
    txId(options: { txBodyFile?: string, txFile?: string }) {
        if (!options.txBodyFile && !options.txFile) {
            throw new Error("Either txBodyFile or txFile must be provided to the txId function");
        }
        if (options.txBodyFile && options.txFile) {
            throw new Error("Only one of txBodyFile or txFile must be provided to the txId function");
        }
        const params = [];
        if (options.txBodyFile) params.push({name: "tx-body-file", value: options.txBodyFile });
        if (options.txFile) params.push({name: "tx-body-file", value: options.txFile });
        return this.run("txid", params);
    }

    /**
     * Return tx view information
     * @param options
     * @returns
     */
    view(options: { txBodyFile?: string, txFile?: string }): any {
        if (!options.txBodyFile && !options.txFile) {
            throw new Error("Either txBodyFile or txFile must be provided to the view function");
        }
        if (options.txBodyFile && options.txFile) {
            throw new Error("Only one of txBodyFile or txFile must be provided to the view function");
        }
        const params = [
            { name: "output-json", value: "" }
        ];
        if (options.txBodyFile) params.push({name: "tx-body-file", value: options.txBodyFile });
        if (options.txFile) params.push({name: "tx-body-file", value: options.txFile });
        return this.run("view", params);
    }
}
