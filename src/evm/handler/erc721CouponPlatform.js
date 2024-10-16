import {
    connect,
	connectCheck,
	wallectConnectSendTransaction,
	isWalletConnect
} from "./common";

import {
    abi
} from "../abi/ERC721CouponPlatform.json";

const base = require('./base');

//xxl todo get from .evn
let contractAddress = "0xd3e379f75d08ba91f632b363f021ceda01d94984"

export function setContractAddress(platformAddress) {
    if(platformAddress) {
        contractAddress = platformAddress;
    }
}


export async function onSale( nftAddress,nftid, value,couponCode,reducedPrice,fee,chainAddress) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }

	
	
	let hasWalletConnect = isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
		let rep = await contract.onSale(nftAddress, nftid, value,chainAddress,couponCode,reducedPrice, {
		    value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
		});
		return rep;
		
	}else{
		  let data= contract.methods.onSale(nftAddress, nftid, value,chainAddress,couponCode,reducedPrice).encodeABI()
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,fee);
		return result;
		 
	}
	
}

export async function offSale( nftAddress,nftid) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }

	
	
	let hasWalletConnect = isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
		let rep = await contract.offSale(nftAddress, nftid,{
		    gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
		});
		return rep;
		
		
	}else{
		  let data= contract.methods.offSale(nftAddress, nftid).encodeABI()
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,"0");
		return result;
		 
	}
	
	
}

export async function revokeApprovesWithArray(tokenArr) {
    const account = await base.getAccounts();
 const fromAddress = await account.getAddress();
    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
   
	
	
	let hasWalletConnect = isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
		let rep = await contract.revokeApprovesWithArray(tokenArr,
		    { gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit }
		);
		return rep;
		
	}else{
		  let data= contract.methods.revokeApprovesWithArray( tokenArr).encodeABI()
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,"0");
		return result;
		 
	}
	
	
}

//placeOrder    

export async function placeOrder( nftAddress,nftId, toAddress, price,couponCode,couponLink) {

	if(couponCode == null){
		couponCode = 0
	}
	if(couponLink == null){
		couponLink = 0
	}
     const account = await base.getAccounts();
     const fromAddress = await account.getAddress();
    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


	
	
	let hasWalletConnect = isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
		console.log("gasSetting", gasSetting);
		let result = await contract.placeOrder(
		    nftAddress, nftId,fromAddress,couponCode,couponLink,
		    { value:price,gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit }
		);
		return result;
		
	}else{
		  let data= contract.methods.placeOrder(  nftAddress, nftId,fromAddress,couponCode,couponLink).encodeABI()
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,price);
		return result;
		 
	}

}
