import {
    setProvider,
    getMyBalance,
    transfer,
    transferFrom,
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
    auction_onsale,
    auction_placeBid,
    auction_end,
    getTokenBalance,
    createOffer,
    cancelOffer,
    acceptOffer,
    lazyNftMint,
    lazyNft1948Mint,
    uptickCrossToEVM,
    getFeeByChainID,
    setBridgeApproval,
    deploy

} from './evm/index';


let chainName = "UPTICK EVM";


export function wallet() {
    let wt = {
        getMyBalance: getMyBalance,
        transfer: transfer,
        transferFrom: transferFrom,
        onSale: onSale,
        onSaleBatch: onSaleBatch,
        couponOnSale: couponOnSale,
        offSale: offSale,
        offSaleBatch: offSaleBatch,
        revokeApprovesWithArray: revokeApprovesWithArray,
        orderPay: orderPay,
        getAccountInfo: getAccountInfo,
        getUptickAddress: getUptickAddress,
        setContractAddress: setContractAddress,
        mintNft: mintNft,
        placeOrder: placeOrder,
        auction_onsale: auction_onsale,
        auction_placeBid: auction_placeBid,
        auction_end: auction_end,
        getTokenBalance: getTokenBalance,
        createOffer: createOffer,
        cancelOffer: cancelOffer,
        acceptOffer: acceptOffer,
        lazyNftMint: lazyNftMint,
        lazyNft1948Mint: lazyNft1948Mint,
        uptickCrossToEVM: uptickCrossToEVM,
        getFeeByChainID: getFeeByChainID,
        setBridgeApproval: setBridgeApproval,
        deploy: deploy
    };

    return wt;
};

export function init(rpc,chainRpc,chainId,chainName,symbol,blockExplorerUrls) {
 
	setProvider(rpc,chainRpc,chainId,chainName,symbol,blockExplorerUrls)
    
	return {wallet:wallet()}
}


