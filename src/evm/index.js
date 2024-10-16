// import Vue from "vue";
import Web3 from 'web3'
const web3Obj = new Web3();
let base = require('./handler/base.js');
let uptick721 = require('./handler/uptick721.js');
let uptick1155 = require('./handler/uptick1155.js');
let lazyNFT = require('./handler/lazyNFT.js');
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




export async function init(chainId) {
   // 判断是否在当前链
       let currentChainID =  window.ethereum.networkVersion
       console.log( '-------',currentChainID, parseInt(chainId, 16));
     
   
     if (window.ethereum && !window.isWalletConnect) {
         console.log(parseInt(chainId, 16),currentChainID);
         if(parseInt(chainId, 16) !== currentChainID) await base.checkExitChain(chainId)
       let result = await base.containsChainId(chainId)
   if(result){
    base.checkExitChain(chainId)
   }else{
       base.addNetwork();
   }
         window.ethereum.on('accountsChanged', handleAccountsChanged);
     }
}

export function setProvider(rpc,chainID){
	base.setProvider(rpc);
	init(chainID)
}
async function handleAccountsChanged(accounts) {
   console.log("zxx---handleAccountsChanged",accounts)
    if(!window.isWalletConnect)
    {
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
        localStorage.setItem("key_user", JSON.stringify({ user: true, did: address, bscAddress: address }));
        
        location.reload();
    }
   
}

export async function getMyBalance() {
    let balance = { amount: await base.getBalance() };
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

const  checkmetamaskconnect = async ()=>{
	var web3;
	if (window.ethereum) {
		// Modern dapp browsers
		web3 = new Web3(window.ethereum);
		try {
            localStorage.setItem("LogIn", true);
			console.log("连接metamask钱包")
			await window.ethereum.enable();
            await window.ethereum.eth_requestAccounts();
          
		} catch (error) {
			console.log('denied');
		}
	} else {
		console.log("连接metamask钱包")
	}

};

export function getUptickAddress(evmAddress) {
    return base.getUptickAddress(evmAddress);
}

function getDenomName(name, address) {

    let denomName = name + "_" + Math.floor(Date.now() / 1000) + "_" + address.substr(address.length - 4);
    return denomName;

}



export async function orderPay(nftType, recipient, tokenId, fee, assetId) {
    fee = web3Obj.utils.toWei(fee.toString());
    if(nftType == "ERC721") {
        let result = await erc721Platform.transfer(recipient, tokenId, fee);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
        let result = await erc1155Platform.transfer(recipient, tokenId, fee, assetId);
        console.log(result);
        return result;
    }
}


export async function onSaleBatch(nftType, nftAddresss,nftids, values,fee,amounts, chainAddress) {
    	
    let prices = []
    let chainAddresss= []
	if(chainAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || chainAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || chainAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687'|| chainAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || chainAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || chainAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831'){
		// uptick测试环境生产环境的IRIS ATOM 保留6位
	for (let i = 0; i < values.length; i++) {
	    prices.push(values[i] * 1000000)
	    chainAddresss.push(chainAddress)
	}
	}else{
	for (let i = 0; i < values.length; i++) {
	    prices.push(web3Obj.utils.toWei(values[i].toString()))  
	    chainAddresss.push(chainAddress)
	}
	   
	}

    if(nftType == "ERC721") {
        let isApproved = await uptick721.isApprovedForAll();
        console.log(isApproved);
    
        if (!isApproved) {
            let setApproval = await uptick721.setApprovalForAll();
            console.log(setApproval);
        }

        
         fee = web3Obj.utils.toWei(fee.toString());
         console.log("wxl --- chainAddresss",chainAddresss)
        let result = await erc721Platform.onSaleBatch(nftAddresss,nftids,prices,fee,chainAddresss);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();
    
    
        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
            console.log(setApproval);
        }
  
        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc1155Platform.onSaleBatch(nftAddresss,nftids, prices,fee,amounts,chainAddresss);
        console.log(result);
        return result;
    }
    
}

export async function onSale(nftType, nftAddress,nftid, value,fee,amount, chainAddress) {

        if(chainAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || chainAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || chainAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687'|| chainAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265'|| chainAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || chainAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831' ){
			// uptick测试环境生产环境的IRIS ATOM 保留6位
             value =  value * 1000000
        }else{
           value = web3Obj.utils.toWei(value.toString());
           
        }
		
	if(nftType == "ERC721") {
        let isApproved = await uptick721.isApprovedForAll();
        console.log(isApproved);
    
        if (!isApproved) {

            let setApproval = await uptick721.setApprovalForAll();
            console.log("setApproval,setApproval",setApproval);
         
            if(!setApproval.hash){
                return setApproval
            }
        }

        
         fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc721Platform.onSale(nftAddress,nftid, value,fee,chainAddress);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();
        console.log(isApproved);
    
        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
            console.log(setApproval);
            if(!setApproval.hash){
                return setApproval
            }
        }
    
        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc1155Platform.onSale(nftAddress,nftid, value,fee,amount,chainAddress);
        console.log(result);
        return result;
    }
    
}
export async function couponOnSale(nftType, nftAddress,nftid, value,couponCode,reducedPrice,fee,amount,chainAddress) {
    console.log("couponOnSale",fee);
        if(chainAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || chainAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || chainAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687'|| chainAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || chainAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || chainAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831'){
			// uptick测试环境生产环境的IRIS ATOM 保留6位
            value =  value * 1000000
            reducedPrice =  reducedPrice * 1000000
        }else{
          value = web3Obj.utils.toWei(value.toString());
          reducedPrice = web3Obj.utils.toWei(reducedPrice.toString());
           
        }
		
    if(nftType == "ERC721") {
        let isApproved = await uptick721.isApprovedForAll();
        console.log(isApproved);
    
        if (!isApproved) {
            let setApproval = await uptick721.setApprovalForAll();
            console.log(setApproval);
        }
   
        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc721CouponPlatform.onSale(nftAddress,nftid, value,couponCode,reducedPrice,fee,chainAddress);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();
        console.log(isApproved);
    
        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
            console.log(setApproval);
        }
        fee = web3Obj.utils.toWei(fee.toString());

        let result = await erc1155CouponPlatform.onSale(nftAddress,nftid, value,couponCode,reducedPrice,fee,amount,chainAddress);
        console.log(result);
        return result;
    }
    
}



export async function offSale(nftType, nftAddress,nftid) {
    if(nftType == "ERC721") {
       
        let result = await erc721Platform.offSale(nftAddress,nftid);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();
        console.log(isApproved);
    
        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
            console.log(setApproval);
        }
    
        let result = await erc1155Platform.offSale(nftAddress,nftid);
        console.log(result);
        return result;
    }
    
}

export async function offSaleBatch(nftType, nftAddress,nftids) {
 
    if(nftType == "ERC721") {
       
        let result = await erc721Platform.offSaleBatch(nftAddress,nftids);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
       
    
        let result = await erc1155Platform.offSaleBatch(nftAddress,nftids);
        console.log(result);
        return result;
    }
    
}

//auction_onsale

export async function auction_onsale(nftType, nftAddress,nftid, startTimeStamp,endTimeStamp,startBid,fixPrice,ReserveBid,fee,amount,chainAddress) {
	
	if(chainAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || chainAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || chainAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687'|| chainAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || chainAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || chainAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831'){
		// uptick测试环境生产环境的IRIS ATOM 保留6位
	startBid =  startBid * 1000000
	fixPrice =  fixPrice * 1000000
	ReserveBid =  ReserveBid * 1000000
	}else{
	startBid = web3Obj.utils.toWei(startBid.toString());
	fixPrice = web3Obj.utils.toWei(fixPrice.toString());
	ReserveBid = web3Obj.utils.toWei(ReserveBid.toString());
	   
	}
    if(nftType == "ERC721") {
        let isApproved = await uptick721.isApprovedForAll();
        console.log(isApproved);
    
        if (!isApproved) {
            let setApproval = await uptick721.setApprovalForAll();
            console.log(setApproval);
        }

    
       
         fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc721Auction.onSale(nftAddress,nftid,startTimeStamp,endTimeStamp,startBid,fixPrice,ReserveBid,fee,chainAddress);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
        let isApproved = await uptick1155.isApprovedForAll();
        console.log(isApproved);
    
        if (!isApproved) {
            let setApproval = await uptick1155.setApprovalForAll();
            console.log(setApproval);
        }
     
        // value = web3Obj.utils.toWei(value.toString());
        fee = web3Obj.utils.toWei(fee.toString());
        let result = await erc1155Auction.onSale(nftAddress,nftid,startTimeStamp,endTimeStamp,startBid,fixPrice,ReserveBid,fee,amount,chainAddress);
        console.log(result);
        return result;
    }
    
}

//auction_placeBid result = await this.$wallet.auction_placeBid(
    
export async function auction_placeBid(nftType, nftAddress,nftid,fixPrice,chainAddress,owner ) {
    let fee = 0
	if(chainAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || chainAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || chainAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687'|| chainAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || chainAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || chainAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831'){
		// uptick测试环境生产环境的IRIS ATOM 保留6位
	  fixPrice =  fixPrice * 1000000
	}else{
	 fixPrice = web3Obj.utils.toWei(fixPrice.toString());
	   
	}
	
    if(chainAddress != '0x0000000000000000000000000000000000000000' ){

      
        let isApproved
        let setApproval = await ierc20.setApprovalForAll(fixPrice);
        console.log(setApproval);
       if(setApproval.hash){
        isApproved = await ierc20.isApprovedForAll();
       }
       if(!isApproved){
           return
       }
       
    }else{
        fee = fixPrice
    }


    if(nftType == "ERC721") {
       
        let result = await erc721Auction.placeBid(nftAddress,nftid,fixPrice,fee);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") { 
        // value = web3Obj.utils.toWei(value.toString());
        let result = await erc1155Auction.placeBid(nftAddress,nftid,fixPrice,owner,fee);
        console.log(result);
        return result;
    }
    
}

//auction_end
export async function auction_end(nftType, nftAddress,nftid,owner) {
    if(nftType == "ERC721") {
       
        let result = await erc721Auction.end(nftAddress,nftid);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
       

        let result = await erc1155Auction.end(nftAddress,nftid,owner);
        console.log(result);
        return result;
    }
   
    
}

//auction_end
export async function getTokenBalance(owner) {
    // ierc20

       
        let result = await ierc20.getTokenBalance(owner);
        console.log(result);
        return result;
    
   
    
}
export async function deploy(nftType,name, metadataUrl,lazySignAddress) {
    // let mint = await uptick721.mint(tokenId, memo);
    // console.log(mint);
    if (nftType == "ERC721") {
        let result = await uptick721.deploy(name, metadataUrl);
        return result;
    }
    else if (nftType == "ERC1155") {
        let result = await uptick1155.deploy(name, metadataUrl);
        return result;
    }
	
}



export async function revokeApprovesWithArray(nftType, tokenArr, value, onAssetIds) {
    if(nftType == "ERC721") {
        let result = await erc721Platform.revokeApprovesWithArray(tokenArr);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
        value = web3Obj.utils.toWei(value.toString());
        let result = await erc1155Platform.revokeApprove(tokenArr, onAssetIds, value);
        console.log(result);
        return result;
    }
}

export async function transferFrom(nftType, toAddress, tokenId, countValue) {
    // let mint = await uptick721.mint(tokenId, memo);
    // console.log(mint);
    if (nftType == "ERC721") {
        let transferFrom = await uptick721.transferFrom(toAddress, tokenId);
        console.log(transferFrom);
    
        return transferFrom;
    }
    else if (nftType == "ERC1155") {
        let transferFrom = await uptick1155.safeTransferFrom(toAddress, tokenId, countValue);
        console.log(transferFrom);
    
        return transferFrom;
    }
}

export async function mintNft(nftType, toAddress, tokenId, baseurl,royaltyPercentage,amountValue) {
    if (nftType == "ERC721") {
        let transferFrom = await uptick721.mintNft(toAddress, tokenId,baseurl,royaltyPercentage);
        console.log(transferFrom);
    
        return transferFrom;
    }
    else if (nftType == "ERC1155") {
        let transferFrom = await uptick1155.mintNft(toAddress, tokenId, baseurl,royaltyPercentage,amountValue);
        console.log(transferFrom);
    
        return transferFrom;
    }
}
export async function lazyNftMint(toAddress,tokenId,baseurl,payAddress,payAmount,creatorFee,signature) {
	 let fee=0;
 if(payAddress == '0x0000000000000000000000000000000000000000' ){
	 fee=payAmount
 }else {
 	  let isApproved
 	   let setApproval = await ierc20.setApprovalForAll(payAmount);
 	   console.log("授权=",setApproval);
 	  if(setApproval.hash){
 	   isApproved = await ierc20.isApprovedForAll();
 	  }
 	  if(!isApproved){
 	      return
 	  }
 }
 
        let mintFrom = await lazyNFT.lazyMint(toAddress,tokenId,baseurl,payAddress,payAmount,creatorFee,signature,fee);
        console.log(mintFrom);
    
        return mintFrom;
    
  
}


// address, platformAddress
export function setContractAddress(nftType, addressObject) {
    console.log('setContractAddress');
    console.log(addressObject);
  
   
    if (nftType == "ERC721" || nftType == null ) {
        uptick721.setContractAddress(addressObject.address, addressObject.platformAddress);
        erc721Platform.setContractAddress(addressObject.platformAddress);
        erc721CouponPlatform.setContractAddress(addressObject.platformAddress);
        erc721Auction.setContractAddress(addressObject.platformAddress);
        erc721Offer.setContractAddress(addressObject.platformAddress);

    }
    else if (nftType == "ERC1155") {
        uptick1155.setContractAddress(addressObject.address, addressObject.platformAddress);
        erc1155Platform.setContractAddress(addressObject.platformAddress);
        erc1155CouponPlatform.setContractAddress(addressObject.platformAddress);
        erc1155Auction.setContractAddress(addressObject.platformAddress);
        erc1155Offer.setContractAddress(addressObject.platformAddress);
       
    }
	else if (nftType == "LazyNft") {
	    lazyNFT.setContractAddress(addressObject.address);
		erc721Offer.setContractAddress(addressObject.platformAddress);
    }
    ierc20.setContractAddress(addressObject.token20Address,addressObject.platformAddress)
    bridge.setContractAddress(addressObject.platformAddress)
	
}

//  placeOrder
export async function placeOrder(nftType, nftAddress, nftId, toAddress, price,marketType,couponCode,couponLink,chainAddress) {
   if(chainAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || chainAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || chainAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687'|| chainAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || chainAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || chainAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831'){
   	// uptick测试环境生产环境的IRIS ATOM 保留6位
    price =  price * 1000000
   }else{
    price = web3Obj.utils.toWei(price.toString());
      
   }
   
    if(chainAddress != '0x0000000000000000000000000000000000000000'){
   
       
        let isApproved
        let setApproval = await ierc20.setApprovalForAll(price);
        console.log(setApproval);
       if(setApproval.hash){
        isApproved = await ierc20.isApprovedForAll();
       }
       if(!isApproved){
           return
       }
       price = 0
       
    }

    if (nftType == "ERC721") {
        let transferFrom 
        if(marketType == 3 || marketType == 5){
            transferFrom = await erc721CouponPlatform.placeOrder(nftAddress, nftId,toAddress,price,couponCode,couponLink);
        }else{
            transferFrom = await erc721Platform.placeOrder(nftAddress, nftId,toAddress,price);
        }
        
        console.log(transferFrom);
    
        return transferFrom;
    }
    else if (nftType == "ERC1155") {
        let transferFrom
        if(marketType == 3 || marketType == 5){
            transferFrom = await erc1155CouponPlatform.placeOrder(nftAddress, nftId, toAddress,price,couponCode,couponLink);
        }else{
            transferFrom = await erc1155Platform.placeOrder(nftAddress, nftId, toAddress,price);
        }
        
    
        return transferFrom;
    }
}

// createOffer
export async function createOffer(nftType,offerNumber, nftAddress, tokenId,payAddress,payAmount,expiry,fee) {
	  	fee = web3Obj.utils.toWei(fee.toString());
	if(payAddress == '0x80b5a32e4f032b2a058b4f29ec95eefeeb87adcd' || payAddress == '0xd567b3d7b8fe3c79a1ad8da978812cfc4fa05e75' || payAddress == '0x5fd55a1b9fc24967c4db09c513c3ba0dfa7ff687'|| payAddress == '0xeceeefcee421d8062ef8d6b4d814efe4dc898265' || payAddress == '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' || payAddress == '0xaf88d065e77c8cc2239327c5edb3a432268e5831'){
		// uptick测试环境生产环境的IRIS ATOM 保留6位
	  payAmount =  payAmount * 1000000
	}else{
	 payAmount=web3Obj.utils.toWei(payAmount.toString());
	   
	}
   if(  payAddress == '0x0000000000000000000000000000000000000000' ){
      fee=Number(fee)+Number(payAmount)
   }else{
       let isApproved
       let setApproval = await ierc20.setApprovalForAll(payAmount);
       console.log(setApproval);
      if(setApproval.hash){
       isApproved = await ierc20.isApprovedForAll();
      }
      if(!isApproved){
          return
      }
      
   }
   
    if(nftType == "ERC721") {
        let result = await erc721Offer.createOffer(offerNumber, nftAddress, tokenId,payAddress,payAmount,expiry,fee.toString());
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
        let result = await erc1155Offer.createOffer(offerNumber, nftAddress, tokenId,payAddress,payAmount,expiry,fee.toString());
        console.log(result);
        return result;
    }
}

//CancelOffer
export async function cancelOffer(nftType,offerNumber) {

    if(nftType == "ERC721" || nftType == null) {
        let result = await erc721Offer.cancelOffer(offerNumber);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
        let result = await erc1155Offer.cancelOffer(offerNumber);
        console.log(result);
        return result;
    }
}

//AcceptOffer
export async function acceptOffer(nftType,offerNumber,nftAddress,tokenId,offerPlatformAddress) {
console.log("acceptOffer",nftType,offerNumber,nftAddress,tokenId);
    if(nftType == "ERC721") {
		
		 let setApproval = await uptick721.setApprovTokenid(offerPlatformAddress,tokenId);
        let result = await erc721Offer.acceptOffer(offerNumber,nftAddress,tokenId);
        console.log(result);
        return result;
    }
    else if(nftType == "ERC1155") {
		let isApproved = await uptick1155.isApprovedForAll(offerPlatformAddress);
		if (!isApproved) {
		    let setApproval = await uptick1155.setApprovalForAll(offerPlatformAddress);
		    console.log(setApproval);
		}
        let result = await erc1155Offer.acceptOffer(offerNumber,nftAddress,tokenId);
        console.log(result);
        return result;
    }
} 
//  跨链 uptick -> Polygon

export async function setBridgeApproval(nftType) {

console.log('setBridgeApproval',nftType);
if(nftType == 'ERC721'){
    let isApproved = await uptick721.isApprovedForAll();
    if (!isApproved) {
           let setApproval = await uptick721.setApprovalForAll();
           console.log(setApproval);
           return setApproval;
       }else{
        let success = {
            hash:true
        }
        return success
       }
}else{
    let isApproved = await uptick1155.isApprovedForAll();
    if (!isApproved) {
           let setApproval = await uptick1155.setApprovalForAll();
           console.log(setApproval);
           return setApproval;
       } else{
        let success = {
            hash:true
        }
        return success

       }
}
   
}


export async function uptickToPolygon(srcChainName,destinationChainId, toAddress,metadate,fee,bridgeAddress) {
   

    console.log("fee",fee);
    fee = web3Obj.utils.toWei(fee.toString());
   let result= await bridge.uptickToPolygon(srcChainName,destinationChainId, toAddress,metadate,fee)
   return result;
}

// 获取手续费
export async function getFeeByChainID(tokenIds,chainId) {
    console.log("getFeeByChainID",chainId,tokenIds);
  let result=  await bridge.getFeeByChainID(tokenIds,chainId)
  console.log("result",result);
  let fee = web3Obj.utils.fromWei(result.toString(),"ether");
  return fee
}








