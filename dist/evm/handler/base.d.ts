export function getBalance(address: any): Promise<string>;
export function getAccounts(): Promise<any>;
export function getSigner(): Promise<any>;
export function containsChainId(targetChainId: any): Promise<boolean>;
export function checkExitChain(chainId: any): void;
export function getUptickAddress(evmAddress: any): any;
export function addNetwork(chainId: any, chainName: any, symbol: any, rpcUrl: any, blockExplorerUrls: any): Promise<boolean>;
export function transfer(toAddress: any, value: any, memo: any): Promise<any>;
export function getGasPriceAndGasLimit(): Promise<{
    gasPrice: string;
    gasLimit: string;
}>;
export function getWeb3Instance(): Web3;
export function setProvider(provider: string): void;
import Web3 from "web3";
