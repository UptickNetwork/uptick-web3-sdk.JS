'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('@/ethereum/evm/index');

function wallet() {
  let wt = {
    getMyBalance: index.getMyBalance,
    transfer: index.transfer,
    transferFrom: index.transferFrom,
    onSale: index.onSale,
    onSaleBatch: index.onSaleBatch,
    couponOnSale: index.couponOnSale,
    offSale: index.offSale,
    offSaleBatch: index.offSaleBatch,
    revokeApprovesWithArray: index.revokeApprovesWithArray,
    orderPay: index.orderPay,
    getAccountInfo: index.getAccountInfo,
    getUptickAddress: index.getUptickAddress,
    setContractAddress: index.setContractAddress,
    mintNft: index.mintNft,
    placeOrder: index.placeOrder,
    auction_onsale: index.auction_onsale,
    auction_placeBid: index.auction_placeBid,
    auction_end: index.auction_end,
    getTokenBalance: index.getTokenBalance,
    createOffer: index.createOffer,
    cancelOffer: index.cancelOffer,
    acceptOffer: index.acceptOffer,
    lazyNftMint: index.lazyNftMint,
    uptickToPolygon: index.uptickToPolygon,
    getFeeByChainID: index.getFeeByChainID,
    setBridgeApproval: index.setBridgeApproval,
    setWalletConnect: setWalletConnect
  };
  return wt;
}
function init(rpc, chainId) {
  index.setProvider(rpc, chainId);
  return {
    wallet: wallet()
  };
}

exports.init = init;
exports.wallet = wallet;
//# sourceMappingURL=uptick-web3-sdk.cjs.development.js.map
