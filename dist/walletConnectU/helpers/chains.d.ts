export const SUPPORTED_CHAINS: {
    name: string;
    chain: string;
    rpc_url: string;
    network: string;
    native_currency: {
        name: string;
        symbol: string;
        decimals: string;
        contractAddress: string;
        balance: string;
    };
    short_name: string;
    chain_id: number;
    network_id: number;
}[];
