export function setContractAddress(platformAddress: any): void;
export function transfer(owner: any, tokenId: any, value: any, assetId: any): Promise<any>;
export function onSale(nftAddress: any, nftid: any, value: any, fee: any, amount: any, chainAddress: any): Promise<any>;
export function onSaleBatch(nftAddresss: any, nftids: any, values: any, fee: any, amounts: any, chainAddresss: any): Promise<any>;
export function placeOrder(nftAddress: any, nftId: any, toAddress: any, price: any): Promise<any>;
export function offSale(nftAddress: any, nftid: any): Promise<any>;
export function offSaleBatch(nftAddress: any, nftids: any): Promise<any>;
export function revokeApprove(tokenArr: any, onAssetIds: any, value: any): Promise<any>;
