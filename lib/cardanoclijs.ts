import { AddressCommand } from "./address";
import { fileToObject } from "./helpers";
import { NodeCommand } from "./node";
import { QueryCommand } from "./query";
import { StakeAddressCommand } from "./stake_address";
import { StakePoolCommand } from "./stake_pool";
import { TransactionCommand } from "./transaction";
import { CommandParameter } from "./types";

const execSync = require("child_process").execSync;

type CommandDef = {
    command: string,
    subcommand?: string,
    parameters?: CommandParameter[],
};

/*
 * Options that the user passes to the constructor
 */
export type UserOptions = {
    network?: string,
    era?: string,
    dir?: string,
    cliPath?: string,
    socketPath?: string,
    shelleyGenesisPath: string,
};

class Command {
    command: CommandDef;
    constructor(cmd: CommandDef) {
        this.command = cmd;
    }

    run(options: CardanoCliJsOptions) {
        const command = [
            options.cliPath,
            options.era,
            this.command.command,
            this.command.subcommand || "",
            this.command.parameters?.map(p => `--${p.name} ${p.value}`).join(" ") || "",
        ];

        return execSync(command.join(" "));
    }
}

export class CardanoCliJsOptions {
    network: string;
    era: string;
    dir: string;
    cliPath: string;
    shelleyGenesis: any;
    socketPath: string;

    constructor(opts: UserOptions) {
        this.network = opts.network || "mainnet";
        this.era = opts.era || "conway";
        this.dir = opts.dir || ".";
        this.cliPath = opts.cliPath || "cardano-cli";

        this.socketPath = process.env["CARDANO_NODE_SOCKET_PATH"] || "";
        if (opts.socketPath) this.socketPath = opts.socketPath;
        if (!this.socketPath) {
            throw new Error("Please provide socketPath in the options or set the CARDANO_NODE_SOCKET_PATH env var");
        }

        if (opts.shelleyGenesisPath) {
            this.shelleyGenesis = fileToObject(opts.shelleyGenesisPath);
        } else {
            throw new Error("Missing shelleyGenesisPath options");
        }
    }
}

export class CardanoCliJs {
    options: CardanoCliJsOptions;
    public query: QueryCommand;
    public address: AddressCommand;
    public stake_address: StakeAddressCommand;
    public node: NodeCommand;
    public stake_pool: StakePoolCommand;
    public transaction: TransactionCommand;

    constructor(opts: CardanoCliJsOptions) {
        this.options = opts;
        this.query = new QueryCommand(this);
        this.address = new AddressCommand(this);
        this.stake_address = new StakeAddressCommand(this);
        this.node = new NodeCommand(this);
        this.stake_pool = new StakePoolCommand(this);
        this.transaction = new TransactionCommand(this);
    }

    runCommand(cmd: CommandDef) {
        const command = new Command(cmd);
        return command.run(this.options);
    }

    getKesPeriod() : number {
        const slotsPerKESPeriod = this.options.shelleyGenesis.slotsPerKESPeriod;
        const tip = this.query.tip();
        return tip.slot / slotsPerKESPeriod;
    }
}
