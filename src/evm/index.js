// import Vue from "vue";
import Web3 from 'web3'

const web3Obj = new Web3();
let base = require('./handler/base.js');
let uptick721 = require('./handler/uptick721.js');
let uptick1155 = require('./handler/uptick1155.js');
let lazyNFT = require('./handler/lazyNFT.js');
let lazyNFT1948 = require('./handler/lazyNFT1948.js');
const erc721Platform = require("./handler/erc721Platform.js");
const erc1155Platform = require("./handler/erc1155Platform.js");
const erc721CouponPlatform = require("./handler/erc721CouponPlatform.js");
const erc1155CouponPlatform = require("./handler/erc1155CouponPlatform.js");
const erc721Auction = require("./handler/erc721Auction.js");
const erc1155Auction = require("./handler/erc1155Auction.js");
const ierc20 = require("./handler/ierc20.js");
const erc721Offer = require('./handler/erc721Offer.js');
const erc1155Offer = require('./handler/erc1155Offer.js');
const bridge = require('./handler/bridge.js');


export async function init(chainId,rpc,chainName,symbol,blockExplorerUrls) {
    // 判断是否在当前链
    let currentChainID = window.ethereum.networkVersion


    if (window.ethereum && !window.isWalletConnect) {
        if (parseInt(chainId, 16) !== currentChainID) await base.checkExitChain(chainId)
        let result = await base.containsChainId(chainId)
        if (result) {
            base.checkExitChain(chainId)
        } else {
			 base.addNetwork(chainId,chainName,symbol,rpc,blockExplorerUrls);
        }
        window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
}

export function setProvider(rpc,chainID,chainName,symbol,blockExplorerUrls) {
    base.setProvider(rpc);
    init(chainID,rpc,chainName,symbol,blockExplorerUrls)
}

async function handleAccountsChanged(accounts) {
    if (!window.isWalletConnect) {
        if (accounts.length == 0) return;

        let address = accounts[0];
        let did = getUptickAddress(address.substr(2));
        address = address.toLowerCase();
        window.bscAddress = address;
        // TODO 返回地址，在前端存储
        // return {
        // 	address:address,
        // 	uptickAddress:did
        // }
        localStorage.setItem("key_user", JSON.stringify({user: true, did: address, bscAddress: address}));

        location.reload();
    }

}

export async function getMyBalance() {
    let balance = {amount: await base.getBalance()};
    let amt = web3Obj.utils.fromWei(balance["amount"], "ether");

    balance["format"] = parseFloat(amt).toFixed(6);
    let mount = balance.format;
    localStorage.setItem("key_balance", mount);
    return balance;
}

export async function getAccountInfo() {
    await checkmetamaskconnect();
    let account = await base.getAccounts();
    return account;
}

const checkmetamaskconnect = async () => {
    var web3;
    if (window.ethereum) {
        // Modern dapp browsers
        web3 = new Web3(window.ethereum);
        try {
            localStorage.setItem("LogIn", true);
            await window.ethereum.enable();
            await window.ethereum.eth_requestAccounts();

        } catch (error) {
            console.log(error);
        }
    } else {
    }

};

export function getUptickAddress(evmAddress) {
    return base.getUptickAddress(evmAddress);
}

function getDenomName(name, address) {

    let denomName = name + "_" + Math.floor(Date.now() / 1000) + "_" + address.substr(address.length - 4);
    return denomName;

}


export async function orderPay(nftType, recipient, nftId, fee, assetId) {
    fee = web3Obj.utils.toWei(fee.toString());
    if (nftType == "ERC721" || nftType == "ERC1948") {
        let result = await erc721Platform.transfer(recipient, nftId, fee);
        return result;
    } else if (nftType == "ERC1155") {
        let result = await erc1155Platform.transfer(recipient, nftId, fee, assetId);
        return result;
    }
}


export async function onSaleBatch(nftType, nftAddresss, nftids, values, fee, amounts, payAddress) {

    let prices = []
    let payAddresss = []
    if (payAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || payAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || payAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687' || payAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || payAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || payAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831') {
        // uptick测试环境生产环境的IRIS ATOM 保留6位
        for (let i = 0; i < values.length; i++) {
            prices.push(values[i] * 1000000)
            payAddresss.push(payAddress)
        }
    } else {
        for (let i = 0; i < values.length; i++) {
            prices.push(web3Obj.utils.toWei(values[i].toString()))
            payAddresss.push(payAddress)
        }

    }

    if (nftType == "ERC721" || nftType == "ERC1948") {
        let isApproved = await uptick721.isApprovedForAll();

        if (!isApproved) {
            let setApproval = await uptick721.setApprovalForAll();
        }


        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc721Platform.onSaleBatch(nftAddresss, nftids, prices, fee, payAddresss);
        return result;
    } else if (nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();


        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
        }

        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc1155Platform.onSaleBatch(nftAddresss, nftids, prices, fee, amounts, payAddresss);
        return result;
    }

}

export async function onSale(nftType, nftAddress, nftid, value, fee, amount, payAddress) {

    if (payAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || payAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || payAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687' || payAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || payAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || payAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831') {
        // uptick测试环境生产环境的IRIS ATOM 保留6位
        value = value * 1000000
    } else {
        value = web3Obj.utils.toWei(value.toString());

    }

    if (nftType == "ERC721" || nftType == "ERC1948") {
        let isApproved = await uptick721.isApprovedForAll();

        if (!isApproved) {

            let setApproval = await uptick721.setApprovalForAll();

            if (!setApproval.hash) {
                return setApproval
            }
        }


        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc721Platform.onSale(nftAddress, nftid, value, fee, payAddress);
        return result;
    } else if (nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();

        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
            if (!setApproval.hash) {
                return setApproval
            }
        }

        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc1155Platform.onSale(nftAddress, nftid, value, fee, amount, payAddress);
        return result;
    }

}

export async function couponOnSale(nftType, nftAddress, nftid, value, couponCode, reducedPrice, fee, amount, payAddress) {
    if (payAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || payAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || payAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687' || payAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || payAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || payAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831') {
        // uptick测试环境生产环境的IRIS ATOM 保留6位
        value = value * 1000000
        reducedPrice = reducedPrice * 1000000
    } else {
        value = web3Obj.utils.toWei(value.toString());
        reducedPrice = web3Obj.utils.toWei(reducedPrice.toString());

    }

    if (nftType == "ERC721" || nftType == "ERC1948") {
        let isApproved = await uptick721.isApprovedForAll();

        if (!isApproved) {
            let setApproval = await uptick721.setApprovalForAll();
        }

        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc721CouponPlatform.onSale(nftAddress, nftid, value, couponCode, reducedPrice, fee, payAddress);
        return result;
    } else if (nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();
        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
        }
        fee = web3Obj.utils.toWei(fee.toString());

        let result = await erc1155CouponPlatform.onSale(nftAddress, nftid, value, couponCode, reducedPrice, fee, amount, payAddress);
        return result;
    }

}


export async function offSale(nftType, nftAddress, nftid) {
    if (nftType == "ERC721" || nftType == "ERC1948") {

        let result = await erc721Platform.offSale(nftAddress, nftid);
        return result;
    } else if (nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();
        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
        }

        let result = await erc1155Platform.offSale(nftAddress, nftid);
        return result;
    }

}

export async function offSaleBatch(nftType, nftAddress, nftids) {

    if (nftType == "ERC721" || nftType == "ERC1948") {

        let result = await erc721Platform.offSaleBatch(nftAddress, nftids);
        return result;
    } else if (nftType == "ERC1155") {


        let result = await erc1155Platform.offSaleBatch(nftAddress, nftids);
        return result;
    }

}

//auction_onsale

export async function auction_onsale(nftType, nftAddress, nftid, startTimeStamp, endTimeStamp, startBid, fixPrice, ReserveBid, fee, amount, payAddress) {

    if (payAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || payAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || payAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687' || payAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || payAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || payAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831') {
        // uptick测试环境生产环境的IRIS ATOM 保留6位
        startBid = startBid * 1000000
        fixPrice = fixPrice * 1000000
        ReserveBid = ReserveBid * 1000000
    } else {
        startBid = web3Obj.utils.toWei(startBid.toString());
        fixPrice = web3Obj.utils.toWei(fixPrice.toString());
        ReserveBid = web3Obj.utils.toWei(ReserveBid.toString());

    }
    if (nftType == "ERC721" || nftType == "ERC1948") {
        let isApproved = await uptick721.isApprovedForAll();
        if (!isApproved) {
            let setApproval = await uptick721.setApprovalForAll();
        }


        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc721Auction.onSale(nftAddress, nftid, startTimeStamp, endTimeStamp, startBid, fixPrice, ReserveBid, fee, payAddress);
        return result;
    } else if (nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();

        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
        }

        // value = web3Obj.utils.toWei(value.toString());
        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc1155Auction.onSale(nftAddress, nftid, startTimeStamp, endTimeStamp, startBid, fixPrice, ReserveBid, fee, amount, payAddress);
        return result;
    }

}

//auction_placeBid result = await this.$wallet.auction_placeBid(

export async function auction_placeBid(nftType, nftAddress, nftid, fixPrice, payAddress, owner) {
    let fee = 0
    if (payAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || payAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || payAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687' || payAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || payAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || payAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831') {
        // uptick测试环境生产环境的IRIS ATOM 保留6位
        fixPrice = fixPrice * 1000000
    } else {
        fixPrice = web3Obj.utils.toWei(fixPrice.toString());

    }

    if (payAddress != '0x0000000000000000000000000000000000000000') {


        let isApproved
        let setApproval = await ierc20.setApprovalForAll(fixPrice);
        if (setApproval.hash) {
            isApproved = await ierc20.isApprovedForAll();
        }
        if (!isApproved) {
            return
        }

    } else {
        fee = fixPrice
    }


    if (nftType == "ERC721" || nftType == "ERC1948") {

        let result = await erc721Auction.placeBid(nftAddress, nftid, fixPrice, fee);
        return result;
    } else if (nftType == "ERC1155") {
        // value = web3Obj.utils.toWei(value.toString());
        let result = await erc1155Auction.placeBid(nftAddress, nftid, fixPrice, owner, fee);
        return result;
    }

}

//auction_end
export async function auction_end(nftType, nftAddress, nftid, owner) {
    if (nftType == "ERC721" || nftType == "ERC1948") {

        let result = await erc721Auction.end(nftAddress, nftid);
        return result;
    } else if (nftType == "ERC1155") {


        let result = await erc1155Auction.end(nftAddress, nftid, owner);
        return result;
    }


}

//auction_end
export async function getTokenBalance(owner) {
    // ierc20


    let result = await ierc20.getTokenBalance(owner);
    return result;


}

export async function deploy(nftType, name, metadataUrl, lazySignAddress) {

    if (nftType == "ERC721") {
        let result = await uptick721.deploy(name, metadataUrl);
        return result;
    } else if (nftType == "ERC1155") {
        let result = await uptick1155.deploy(name, metadataUrl);
        return result;
    } else if (nftType == 'lazyCollection') {
        let result = await lazyNFT.deploy(name, metadataUrl, lazySignAddress);
        return result;

    } else if (nftType == 'ERC1948') {
        let result = await lazyNFT1948.deploy(name, metadataUrl, lazySignAddress);
        return result;

    }

}


export async function revokeApprovesWithArray(nftType, tokenArr, value, onAssetIds) {
    if (nftType == "ERC721" || nftType == "ERC1948") {
        let result = await erc721Platform.revokeApprovesWithArray(tokenArr);
        return result;
    } else if (nftType == "ERC1155") {
        value = web3Obj.utils.toWei(value.toString());
        let result = await erc1155Platform.revokeApprove(tokenArr, onAssetIds, value);
        return result;
    }
}

export async function transferFrom(nftType, toAddress, nftId, amountValue) {
    // let mint = await uptick721.mint(nftId, memo);
    if (nftType == "ERC721" || nftType == "ERC1948") {
        let transferFrom = await uptick721.transferFrom(toAddress, nftId);
        return transferFrom;
    } else if (nftType == "ERC1155") {
        let transferFrom = await uptick1155.safeTransferFrom(toAddress, nftId, amountValue);
        return transferFrom;
    }
}

export async function mintNft(nftType, toAddress, nftId, metaDataUrl, royaltyPercentage, amountValue) {
    if (nftType == "ERC721" || nftType == "ERC1948") {
        let transferFrom = await uptick721.mintNft(toAddress, nftId, metaDataUrl, royaltyPercentage);
        return transferFrom;
    } else if (nftType == "ERC1155") {
        let transferFrom = await uptick1155.mintNft(toAddress, nftId, metaDataUrl, royaltyPercentage, amountValue);
        return transferFrom;
    }
}

export async function lazyNftMint(toAddress, nftId, metaDataUrl, payAddress, payAmount, creatorFee, signature) {
    let fee = 0;
    if (payAddress == '0x0000000000000000000000000000000000000000') {
        fee = payAmount
    } else {
        let isApproved
        let setApproval = await ierc20.setApprovalForAll(payAmount);
        if (setApproval.hash) {
            isApproved = await ierc20.isApprovedForAll();
        }
        if (!isApproved) {
            return
        }
    }

    let mintFrom = await lazyNFT.lazyMint(toAddress, nftId, metaDataUrl, payAddress, payAmount, creatorFee, signature, fee);
    return mintFrom;


}

export async function lazyNft1948Mint(toAddress, tokenId, baseurl, payAddress, payAmount, creatorFee, signature, data) {
    let fee = 0;
    if (payAddress == '0x0000000000000000000000000000000000000000') {
        fee = payAmount
    } else {
        let isApproved
        let setApproval = await ierc20.setApprovalForAll(payAmount);
        if (setApproval.hash) {
            isApproved = await ierc20.isApprovedForAll();
        }
        if (!isApproved) {
            return
        }
    }

    let mintFrom = await lazyNFT1948.lazyMint(toAddress, tokenId, baseurl, payAddress, payAmount, creatorFee, signature, data, fee);
    return mintFrom;


}


// address, platformAddress
export function setContractAddress(nftType, addressObject) {
    if (nftType == "ERC721" || nftType == "ERC1948") {
        uptick721.setContractAddress(addressObject.address, addressObject.platformAddress);
        erc721Platform.setContractAddress(addressObject.platformAddress);
        erc721CouponPlatform.setContractAddress(addressObject.platformAddress);
        erc721Auction.setContractAddress(addressObject.platformAddress);
        erc721Offer.setContractAddress(addressObject.platformAddress);
        lazyNFT1948.setContractAddress(addressObject.address);
    } else if (nftType == "ERC1155") {
        uptick1155.setContractAddress(addressObject.address, addressObject.platformAddress);
        erc1155Platform.setContractAddress(addressObject.platformAddress);
        erc1155CouponPlatform.setContractAddress(addressObject.platformAddress);
        erc1155Auction.setContractAddress(addressObject.platformAddress);
        erc1155Offer.setContractAddress(addressObject.platformAddress);

    } else if (nftType == "LazyNft") {
        lazyNFT.setContractAddress(addressObject.address);
        erc721Offer.setContractAddress(addressObject.platformAddress);
    }
    ierc20.setContractAddress(addressObject.token20Address, addressObject.platformAddress)
    bridge.setContractAddress(addressObject.platformAddress)

}

//  placeOrder
export async function placeOrder(nftType, nftAddress, nftId, toAddress, price, marketType, couponCode, couponLink, payAddress) {
    if (payAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || payAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || payAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687' || payAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || payAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || payAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831') {
        // uptick测试环境生产环境的IRIS ATOM 保留6位
        price = price * 1000000
    } else {
        price = web3Obj.utils.toWei(price.toString());

    }

    if (payAddress != '0x0000000000000000000000000000000000000000') {


        let isApproved
        let setApproval = await ierc20.setApprovalForAll(price);
        if (setApproval.hash) {
            isApproved = await ierc20.isApprovedForAll();
        }
        if (!isApproved) {
            return
        }
        price = 0

    }

    if (nftType == "ERC721" || nftType == "ERC1948") {
        let transferFrom
        if (marketType == 3 || marketType == 5) {
            transferFrom = await erc721CouponPlatform.placeOrder(nftAddress, nftId, toAddress, price, couponCode, couponLink);
        } else {
            transferFrom = await erc721Platform.placeOrder(nftAddress, nftId, toAddress, price);
        }

        return transferFrom;
    } else if (nftType == "ERC1155") {
        let transferFrom
        if (marketType == 3 || marketType == 5) {
            transferFrom = await erc1155CouponPlatform.placeOrder(nftAddress, nftId, toAddress, price, couponCode, couponLink);
        } else {
            transferFrom = await erc1155Platform.placeOrder(nftAddress, nftId, toAddress, price);
        }


        return transferFrom;
    }
}

// createOffer
export async function createOffer(nftType, offerNumber, nftAddress, nftId, payAddress, payAmount, expiry, fee) {
    fee = web3Obj.utils.toWei(fee.toString());
    if (payAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || payAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || payAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687' || payAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || payAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || payAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831') {
        // uptick测试环境生产环境的IRIS ATOM 保留6位
        payAmount = payAmount * 1000000
    } else {
        payAmount = web3Obj.utils.toWei(payAmount.toString());

    }
    if (payAddress == '0x0000000000000000000000000000000000000000') {
        fee = Number(fee) + Number(payAmount)
    } else {
        let isApproved
        let setApproval = await ierc20.setApprovalForAll(payAmount);
        if (setApproval.hash) {
            isApproved = await ierc20.isApprovedForAll();
        }
        if (!isApproved) {
            return
        }

    }

    if (nftType == "ERC721" || nftType == "ERC1948") {
        let result = await erc721Offer.createOffer(offerNumber, nftAddress, nftId, payAddress, payAmount, expiry, fee.toString());
        return result;
    } else if (nftType == "ERC1155") {
        let result = await erc1155Offer.createOffer(offerNumber, nftAddress, nftId, payAddress, payAmount, expiry, fee.toString());
        return result;
    }
}

//CancelOffer
export async function cancelOffer(nftType, offerNumber) {

    if (nftType == "ERC721" || nftType == "ERC1948") {
        let result = await erc721Offer.cancelOffer(offerNumber);
        return result;
    } else if (nftType == "ERC1155") {
        let result = await erc1155Offer.cancelOffer(offerNumber);
        return result;
    }
}

//AcceptOffer
export async function acceptOffer(nftType, offerNumber, nftAddress, nftId, offerPlatformAddress) {
    if (nftType == "ERC721" || nftType == "ERC1948") {
        let setApproval = await uptick721.setApprovTokenid(offerPlatformAddress, nftId);
        let result = await erc721Offer.acceptOffer(offerNumber, nftAddress, nftId);
        return result;
    } else if (nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll(offerPlatformAddress);
        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll(offerPlatformAddress);
        }
        let result = await erc1155Offer.acceptOffer(offerNumber, nftAddress, nftId);
        return result;
    }
}

//  跨链 uptick -> Polygon

export async function setBridgeApproval(nftType) {
    if (nftType == 'ERC721') {
        let isApproved = await uptick721.isApprovedForAll();
        if (!isApproved) {
            let setApproval = await uptick721.setApprovalForAll();
            return setApproval;
        } else {
            let success = {
                hash: true
            }
            return success
        }
    } else {
        let isApproved = await uptick1155.isApprovedForAll();
        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
            return setApproval;
        } else {
            let success = {
                hash: true
            }
            return success

        }
    }

}


export async function uptickCrossToEVM(srcChainName, destinationChainId, toAddress, metadate, fee, bridgeAddress) {
    fee = web3Obj.utils.toWei(fee.toString());
    let result = await bridge.uptickCrossToEVM(srcChainName, destinationChainId, toAddress, metadate, fee)
    return result;
}

// 获取手续费
export async function getFeeByChainID(tokenIds, chainId) {
    let result = await bridge.getFeeByChainID(tokenIds, chainId)
    let fee = web3Obj.utils.fromWei(result.toString(), "ether");
    return fee
}

export async function transfer(tokenAddress, payAmount, toAddress) {
    if (tokenAddress != '0x0000000000000000000000000000000000000000') {
        if (tokenAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || tokenAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || tokenAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687' || tokenAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || payAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || tokenAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831') {
            // uptick测试环境生产环境的IRIS ATOM 保留6位
            payAmount = payAmount * 1000000
        } else {
            payAmount = web3Obj.utils.toWei(payAmount.toString());

        }

        ierc20.setContractAddress(tokenAddress, null);
        let result = ierc20.transfer(toAddress, payAmount);
        return result;

    } else {
        payAmount = web3Obj.utils.toWei(payAmount.toString());
        // 构造交易
        const tx = {
            to: toAddress,
            value: payAmount
        };

        const account = await base.getSigner();
        let result = account.sendTransaction(tx);
        return result;

    }

}






