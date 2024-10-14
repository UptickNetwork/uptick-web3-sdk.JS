export function setContractAddress(platformAddress: any): void;
export function transfer(toAddress: any, tokenId: any, value: any): Promise<any>;
export function placeOrder(nftAddress: any, nftId: any, toAddress: any, price: any): Promise<any>;
export function onSale(nftAddress: any, nftid: any, startTimeStamp: any, endTimeStamp: any, startBid: any, fixPrice: any, ReserveBid: any, fee: any, chainAddress: any): Promise<any>;
export function placeBid(nftAddress: any, nftid: any, fixPrice: any, fee: any): Promise<any>;
export function end(nftAddress: any, nftid: any): Promise<any>;
export function offSale(nftAddress: any, nftid: any): Promise<any>;
export function revokeApprovesWithArray(tokenArr: any): Promise<any>;
