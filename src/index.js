

import {
	setProvider,
    getMyBalance,
    transferFrom ,
    onSale,
    onSaleBatch,
    couponOnSale,
    offSale,
    offSaleBatch,
    revokeApprovesWithArray,
    orderPay,
    getAccountInfo,
    getUptickAddress,
    setContractAddress,
    mintNft,
    placeOrder,
    auction_onsale ,
    auction_placeBid,
    auction_end,
    getTokenBalance,
    createOffer,
    cancelOffer,
    acceptOffer,
    lazyNftMint,
    uptickToPolygon,
    getFeeByChainID,
    setBridgeApproval,
	deploy

} from './evm/index';


let chainName = "UPTICK EVM";


export function wallet() {
    let wt = {
            getMyBalance: getMyBalance,
            transferFrom: transferFrom,
            onSale: onSale,
            onSaleBatch:onSaleBatch,
            couponOnSale:couponOnSale,
            offSale : offSale,
            offSaleBatch:offSaleBatch,
            revokeApprovesWithArray: revokeApprovesWithArray,
            orderPay: orderPay,
            getAccountInfo: getAccountInfo,
            getUptickAddress: getUptickAddress,
            setContractAddress: setContractAddress,
            mintNft:mintNft,
            placeOrder:placeOrder,
            auction_onsale:auction_onsale,
            auction_placeBid:auction_placeBid,
            auction_end: auction_end,
            getTokenBalance: getTokenBalance,
            createOffer :createOffer,
            cancelOffer : cancelOffer,
            acceptOffer : acceptOffer,
            lazyNftMint : lazyNftMint,
            uptickToPolygon : uptickToPolygon,
            getFeeByChainID:getFeeByChainID,
            setBridgeApproval: setBridgeApproval,
			deploy:deploy
        };
    
    return wt;
};

export function init(rpc,chainId) {
 
	setProvider(rpc,chainId)
    
	return {wallet:wallet()}
}


