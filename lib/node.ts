import { CliCommand } from "./command";
import { filesShouldExist, filesShouldNotExist, mkdirp } from "./helpers";

export class NodeCommand extends CliCommand {
    command = "node";

    /**
     * Generate a new node keys
     * @param poolName
     * @returns vkey, skey and counter with the file paths to the key files
     */
    keyGen(poolName: string): { vkey: string, skey: string, counter: string } {
        const nodeAccountDir = `${this.cli.options.dir}/priv/pool/${poolName}`;
        const vkey = `${nodeAccountDir}/${poolName}.node.vkey`;
        const skey = `${nodeAccountDir}/${poolName}.node.skey`;
        const counter = `${nodeAccountDir}/${poolName}.node.counter`;

        filesShouldNotExist([vkey, skey, counter]);
        mkdirp(nodeAccountDir);

        this.run("key-gen", [
            { name: "cold-verification-key-file", value: vkey },
            { name: "cold-signing-key-file", value: skey },
            { name: "operational-certificate-issue-counter", value: counter },
        ]);

        return { vkey, skey, counter };
    }

    /**
     * Generate node KES keys
     * @param poolName
     * @returns vkey and skey with the paths to the generated key files
     */
    keyGenKES(poolName: string): { vkey: string, skey: string } {
        const nodeAccountDir = `${this.cli.options.dir}/priv/pool/${poolName}`;
        const vkey = `${nodeAccountDir}/${poolName}.kes.vkey`;
        const skey = `${nodeAccountDir}/${poolName}.kes.skey`;

        filesShouldNotExist([vkey, skey]);
        mkdirp(nodeAccountDir);

        this.run("key-gen-KES", [
            { name: "verification-key-file", value: vkey },
            { name: "signing-key-file", value: skey },
        ]);

        return { vkey, skey };
    }

    /**
     * Generate node VRF keys
     * @param poolName
     * @returns vkey and skey with the paths to the generated key files
     */
    keyGenVRF(poolName: string) {
        const nodeAccountDir = `${this.cli.options.dir}/priv/pool/${poolName}`;
        const vkey = `${nodeAccountDir}/${poolName}.vrf.vkey`;
        const skey = `${nodeAccountDir}/${poolName}.vrf.skey`;

        filesShouldNotExist([vkey, skey]);
        mkdirp(nodeAccountDir);

        this.run("key-gen-VRF", [
            { name: "verification-key-file", value: vkey },
            { name: "signing-key-file", value: skey },
        ]);

        return { vkey, skey };
    }

     /**
     * Get the VRF key hash
     * @param poolName
     * @returns the hash of the VRF key
     */
     keyHashVRF(poolName: string) {
        const nodeAccountDir = `${this.cli.options.dir}/priv/pool/${poolName}`;
        const vkey = `${nodeAccountDir}/${poolName}.vrf.vkey`;

        filesShouldExist([vkey]);

        const hash = this.run("key-hash-VRF", [
            { name: "verification-key-file", value: vkey },
        ]);

        return hash;
    }

    /**
     * Generate a new node counter certificate
     * @param poolName
     * @param counterValue
     * @returns path to the issue counter file
     */
    newCounter(poolName: string, counterValue: number): string {
        const nodeAccountDir = `${this.cli.options.dir}/priv/pool/${poolName}`;
        const nodeCounter = `${nodeAccountDir}/${poolName}.node.counter`;
        const nodeColdVkey = `${nodeAccountDir}/${poolName}.node.vkey`;

        filesShouldExist([nodeCounter, nodeColdVkey]);
        mkdirp(nodeAccountDir);

        this.run("new-counter", [
            { name: "cold-verification-key-file", value: nodeColdVkey },
            { name: "counter-value", value: counterValue },
            { name: "operational-certificate-issue-counter-file", value: nodeCounter },
        ]);

        return nodeCounter;
    }

    /**
     * Generate a new operational certificate for the node
     * @param poolName
     * @param options
     * @returns string - Path to the node operational certificate
     */
    issueOpCert(poolName: string, options: { kesPeriod?: number}) : string {
        const nodeAccountDir = `${this.cli.options.dir}/priv/pool/${poolName}`;
        const kesVKey = `${nodeAccountDir}/${poolName}.kes.vkey`;
        const nodeCounter = `${nodeAccountDir}/${poolName}.node.counter`;
        const nodeColdSkey = `${nodeAccountDir}/${poolName}.node.skey`;
        const nodeCert = `${nodeAccountDir}/${poolName}.node.cert`;

        filesShouldExist([kesVKey, nodeCounter, nodeColdSkey]);
        mkdirp(nodeAccountDir);

        this.run("issue-op-cert", [
            { name: "kes-verification-key-file", value: kesVKey },
            { name: "cold-signing-key-file", value: nodeColdSkey },
            { name: "operational-certificate-issue-counter-file", value: nodeCounter },
            { name: "kes-period", value: options.kesPeriod ? options.kesPeriod : this.cli.getKesPeriod()},
            { name: "out-file", value: nodeCert },
            ],
            true
        );

        return nodeCert;
    }
}
