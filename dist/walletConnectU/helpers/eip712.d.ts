export namespace eip712 {
    export { example };
}
declare namespace example {
    export namespace types {
        export const EIP712Domain: {
            name: string;
            type: string;
        }[];
        export const RelayRequest: {
            name: string;
            type: string;
        }[];
        export const GasData: {
            name: string;
            type: string;
        }[];
        export const RelayData: {
            name: string;
            type: string;
        }[];
    }
    export namespace domain {
        export const name: string;
        export const version: string;
        export const chainId: number;
        export const verifyingContract: string;
    }
    export const primaryType: string;
    export namespace message {
        export const target: string;
        export const encodedFunction: string;
        export namespace gasData {
            export const gasLimit: string;
            export const gasPrice: string;
            export const pctRelayFee: string;
            export const baseRelayFee: string;
        }
        export namespace relayData {
            export const senderAddress: string;
            export const senderNonce: string;
            export const relayWorker: string;
            export const paymaster: string;
        }
    }
}
export {};
