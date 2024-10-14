export function connect(address: any, abi: any, signer: any): Promise<any>;
export function connectCheck(address: any, abi: any, signer: any): Promise<any>;
export function wallectConnectSendTransaction(fromAddress: any, contractAddress: any, data: any, price: any): Promise<{
    hash: unknown;
}>;
export function isWalletConnect(): any;
