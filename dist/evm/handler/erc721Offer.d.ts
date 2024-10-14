export function setContractAddress(platformAddress: any): void;
export function createOffer(offerNumber: any, nftAddress: any, tokenId: any, payAddress: any, value: any, expiry: any, fee: any): Promise<any>;
export function cancelOffer(offerNumber: any): Promise<any>;
export function acceptOffer(offerNumber: any, nftAddress: any, tokenId: any): Promise<any>;
