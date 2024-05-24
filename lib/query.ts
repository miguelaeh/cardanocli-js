import { CliCommand } from "./command";
import { Utxo } from "./types";

const fs = require("fs");

export class QueryCommand extends CliCommand {
    command = "query";

    /**
     * Fetch the protocol parameters into a file
     * @returns string - Path to file containing protocol parameters
     */
    protocolParameters() : any {
        const file = `${this.cli.options.dir}/tmp/protocolParams.json`;

        const opts = [{ name: "out-file", value: file }];
        this.run("protocol-parameters", opts, true);
        return JSON.parse(fs.readFileSync(file));
    }

    /**
     *
     * @returns The tip as a number
     */
    tip(): any {
        return this.run("tip", [], true);
    }

    /**
     *
     * @param address Address string
     * @returns the Stake address information
     */
    stakeAddressInfo(address: string) : any {
        return this.run("stake-address-info", [{
            name: "address",
            value: address,
        }], true);
    }

    /**
     *
     * @param address Address string
     * @returns Array of UTxO objects
     */
    utxo(address: string): Utxo[] {
        const rawResult = this.run("utxo", [
            {
                name: "address",
                value: address,
            },
            {
                name: "output-json",
                value: "",
            }
        ], true);
        return JSON.parse(rawResult);
    }

    /**
     * Query the governance state
     * @returns JSON object with the governance state
     */
    govState() {
        const file = `${this.cli.options.dir}/tmp/govState.json`;
        const opts = [{ name: "out-file", value: file }];
        this.run("gov-state", opts, true);
        return JSON.parse(fs.readFileSync(file));
    }

    /**
     * Query DRep state
     * @param opts
     */
    drepState(opts: { drepVKeyFile?: string, drepKeyHash?: string }) {
        const params = [];
        if (!opts.drepVKeyFile && !opts.drepKeyHash) {
            params.push({ name: "all-dreps", value: ""})
        }
        if (opts.drepVKeyFile && opts.drepKeyHash) {
            throw new Error("'drepVKeyFile and drepKeyHash cannot be set at the same time");
        } else if (opts.drepKeyHash) {
            params.push({ name: "--drep-key-hash", value: opts.drepKeyHash });
        } else if (opts.drepVKeyFile) {
            params.push({ name: "drep-verification-key-file", value: opts.drepVKeyFile });
        }

        const file = `${this.cli.options.dir}/tmp/drepState.json`;
        params.push({ name: "out-file", value: file });
        this.run("drep-state", params, true);
        return JSON.parse(fs.readFileSync(file));
    }

    /**
     * Query DRep stake distribution
     * @param opts
     */
    drepStakeDistribution(opts: { drepVKeyFile?: string, drepKeyHash?: string }) {
        const params = [];
        if (!opts.drepVKeyFile && !opts.drepKeyHash) {
            params.push({ name: "all-dreps", value: ""})
        }
        if (opts.drepVKeyFile && opts.drepKeyHash) {
            throw new Error("'drepVKeyFile and drepKeyHash cannot be set at the same time");
        } else if (opts.drepKeyHash) {
            params.push({ name: "--drep-key-hash", value: opts.drepKeyHash });
        } else if (opts.drepVKeyFile) {
            params.push({ name: "drep-verification-key-file", value: opts.drepVKeyFile });
        }

        const file = `${this.cli.options.dir}/tmp/drepState.json`;
        params.push({ name: "out-file", value: file });
        this.run("drep-stake-distribution", params, true);
        return JSON.parse(fs.readFileSync(file));
    }
}
