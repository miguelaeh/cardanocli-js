import { CardanoCliJs } from "./cardanoclijs";
import { CommandParameter } from "./types";

/**
 * Super class that all CLI commands extend. =
 * Makes it easy to run subcommands
 */
export abstract class CliCommand {
    cli: CardanoCliJs;
    abstract command: string; // To be set on each subclass

    constructor(cli: CardanoCliJs) {
        this.cli = cli;
    }

    run(subcommand: string, parameters: CommandParameter[], needsNetwork: boolean = false): string {
        if (needsNetwork) {
            if (this.cli.options.network == "mainnet") {
                parameters.push({ name: "mainnet", value: "" })
            } else {
                parameters.push({ name: "testnet-magic", value: this.cli.options.network })
            }
        }

        return this.cli.runCommand({
            command: this.command,
            subcommand,
            parameters,
        }).toString().trim();
    }
}
