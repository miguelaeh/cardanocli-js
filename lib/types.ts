export type CommandParameter = {
    name: string,
    value: string | number,
};

export type Utxo = {
    txHash: string,
    txId: number,
    value: number,
    datum?: string,
    datumHash?: string,
};
