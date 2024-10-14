export namespace eip1271 {
    export { spec };
    export { isValidSignature };
}
declare namespace spec {
    export const magicValue: string;
    export const abi: {
        constant: boolean;
        inputs: {
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            name: string;
            type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
    }[];
}
declare function isValidSignature(address: any, sig: any, data: any, provider: any, abi?: {
    constant: boolean;
    inputs: {
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        name: string;
        type: string;
    }[];
    payable: boolean;
    stateMutability: string;
    type: string;
}[], magicValue?: string): Promise<boolean>;
export {};
