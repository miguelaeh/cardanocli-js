import { CliCommand } from "./command";
import { filesShouldExist, objectToFile, removeFile, mkdirp, filesShouldNotExist } from "./helpers";

export class StakePoolCommand extends CliCommand {
    command = "stake-pool";

    /**
     * Get the stake pool Id
     * @param poolName
     * @returns string - Pool Id
     */
    id(poolName: string): string {
        const nodeAccountDir = `${this.cli.options.dir}/priv/pool/${poolName}`;
        const vkey = `${nodeAccountDir}/${poolName}.node.vkey`;

        return this.run("id", [
            { name: "cold-verification-key-file", value: vkey },
        ]);
    }

    /**
     * Get the stake pool metadata hash
     * @param metadata Metadata object
     * @returns string- Metadata hash
     */
    metadataHash(metadata: any): string {
        const metadataFile = "/tmp/pool-metadata.json";
        objectToFile(metadata, metadataFile);
        const hash = this.run("metadata-hash", [
            { name: "pool-metadata-file", value: metadataFile },
        ]);
        removeFile(metadataFile);
        return hash;
    }

    /**
     * Create pool registration certificate
     * @param poolName
     * @param options
     * @returns string - path to the registration certificate
     */
    registrationCertificate(
        poolName: string,
        options: {
            pledge: number,
            margin: number,
            cost: number,
            url: string,
            metaHash: string,
            rewardAccountFile: string,
            ownersStakeVKeyFiles: string[],
            relays: any[],
        }
    ) : string {
        if (!options || !options.pledge || !options.margin || !options.cost
            || !options.url || !options.metaHash || !options.rewardAccountFile
            || !options.ownersStakeVKeyFiles || !options.relays
        ) throw new Error("All options are required");

        const nodeAccountDir = `${this.cli.options.dir}/priv/pool/${poolName}`;
        const coldVkey = `${nodeAccountDir}/${poolName}.node.vkey`;
        const vrfVKey = `${nodeAccountDir}/${poolName}.vrf.vkey`;
        const poolRegCertFile = `${nodeAccountDir}/${poolName}-reg.pool.cert`;

	    mkdirp(nodeAccountDir);
        filesShouldExist([ nodeAccountDir, coldVkey, vrfVKey ]);
        filesShouldNotExist([poolRegCertFile]);

        let params = [
            { name: "cold-verification-key-file", value: coldVkey },
            { name: "vrf-verification-key-file", value: vrfVKey },
            { name: "pool-pledge", value: options.pledge },
            { name: "pool-cost", value: options.cost },
            { name: "pool-margin", value: options.margin },
            { name: "pool-reward-account-verification-key-file", value: options.rewardAccountFile },
            { name: "metadata-url", value: options.url },
            { name: "metadata-hash", value: options.metaHash },
            { name: "out-file", value: poolRegCertFile },
        ];
        const owners = options.ownersStakeVKeyFiles.map((o: string) => ({ name: "pool-owner-stake-verification-key-file", value: o }));
        params = params.concat(owners);

        const relays = options.relays.map((r: any) => {
            if (!((r.host || r.ip) && r.port) && !r.multiHost)
                throw new Error("Relay is missing arguments");
            if (r.host) {
                return [{ name: "single-host-pool-relay", value: r.host }, { name: "pool-relay-port", value: r.port }];
            } else if (r.ip) {
                return [{ name: "pool-relay-ipv4", value: r.ip }, { name: "pool-relay-port", value: r.port }];
            } else if (r.multiHost) {
                return [{ name: "multi-host-pool-relay", value: r.multiHost }];
            }
            return { name: "", value: "" }; // HACK: make compiler happy
        }).flat();
        params.concat(relays);

        this.run("registration-certificate", params, true);

        return poolRegCertFile;
    }

    /**
     * Create de-registration certificate for the pool
     * @param poolName
     * @param epoch
     * @returns string - File path of the deregistration certificate
     */
    deRegistrationCertificate(poolName: string, epoch: number): string {
        const nodeAccountDir = `${this.cli.options.dir}/priv/pool/${poolName}`;
        const coldVkey = `${nodeAccountDir}/${poolName}.node.vkey`;
        const poolDeRegCertFile = `${nodeAccountDir}/${poolName}-dereg.pool.cert`;

        mkdirp(nodeAccountDir);

        this.run("deregistration-certificate", [
            { name: "cold-verification-key-file", value: coldVkey },
            { name: "epoch", value: epoch },
            { name: "out-file", value: poolDeRegCertFile },
        ]);

        return poolDeRegCertFile;
    }
}
