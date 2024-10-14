export function initProvider(): Promise<import("@walletconnect/ethereum-provider").default>;
export function connectWallets(): Promise<void>;
export function killSession(): Promise<void>;
export function signPersonalMessage(): Promise<{
    connector: null;
    fetching: boolean;
    connected: boolean;
    chainId: number;
    showModal: boolean;
    pendingRequest: boolean;
    uri: string;
    accounts: never[];
    address: string;
    result: null;
    assets: never[];
} | undefined>;
export function getAddresss(): never;
export const events: any;
