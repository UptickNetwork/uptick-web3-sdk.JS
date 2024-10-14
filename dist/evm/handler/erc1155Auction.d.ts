export function setContractAddress(platformAddress: any): void;
export function transfer(owner: any, tokenId: any, value: any, assetId: any): Promise<any>;
export function onSale(nftAddress: any, nftid: any, startTimeStamp: any, endTimeStamp: any, startBid: any, fixPrice: any, ReserveBid: any, fee: any, amount: any, chainAddress: any): Promise<any>;
export function placeBid(nftAddress: any, nftid: any, fixPrice: any, owner: any, fee: any): Promise<any>;
export function end(nftAddress: any, nftid: any, owner: any): Promise<any>;
export function placeOrder(nftAddress: any, nftId: any, toAddress: any, price: any): Promise<any>;
export function offSale(nftAddress: any, nftid: any): Promise<any>;
export function revokeApprove(tokenArr: any, onAssetIds: any, value: any): Promise<any>;
