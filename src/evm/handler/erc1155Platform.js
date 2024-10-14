import {
    connect,
	wallectConnectSendTransaction,
	isWalletConnect
} from "./common";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
    abi
} from "../artifact/ERC1155Platform.json";
import { utils } from "ethers";
import Web3 from 'web3';
const base = require('./base');

//xxl todo get from .evn
let contractAddress = "0x99a415da5b4d061556e2d55c3382cfeda02a5a7d"

export function setContractAddress(platformAddress) {
    if(platformAddress) {
        contractAddress = platformAddress;
    }
}

// address _owner,
// uint256 _tokenId,
// uint256 _price,
// uint256 _amount,
// address _to,
// bytes calldata data
export async function transfer(owner, tokenId, value, assetId) {
    const account = await base.getAccounts();
    const address = await account.getAddress();
    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }

    let data = JSON.stringify({ assetId: [assetId] });
    let amount = 1;
    let gasSetting = await base.getGasPriceAndGasLimit();


	
	let hasWalletConnect=isWalletConnect();
	if(!hasWalletConnect){
		 let result = await contract.transfer(owner, tokenId, value, amount, address, utils.toUtf8Bytes(data), {
		     value: value, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
		 });     
		return result;
	}else{
		  let data= contract.methods.transfer(owner, tokenId, value, amount, address, utils.toUtf8Bytes(data)).encodeABI()
		let result = await wallectConnectSendTransaction(address,contractAddress,data,value);
		return result;
		 
	}
	
}

export async function onSale(nftAddress,nftid, value,fee,amount,chainAddress) {
	debugger
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
  

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
  
let hasWalletConnect=isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
		
		let rep = await contract.onSale(nftAddress, nftid, value,amount,chainAddress, {
		    value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
		});
		return rep;
	}else{
		  let data= contract.methods.onSale(nftAddress, nftid, value,amount,chainAddress).encodeABI()
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,fee);
		return result;
		 
	}
}
// onSaleBatch
export async function onSaleBatch(nftAddresss,nftids, values,fee,amounts,chainAddresss) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
    console.log(fee);

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }

  
	let hasWalletConnect=isWalletConnect();
		if(!hasWalletConnect){
			let gasSetting = await base.getGasPriceAndGasLimit();
			
			let rep = await contract.onSaleBatch(nftAddresss, nftids, values,amounts,chainAddresss, {
			    value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
			});
			return rep;
		}else{
			  let data= contract.methods.onSaleBatch(nftAddresss, nftids, values,amounts,chainAddresss).encodeABI()
			let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,fee);
			return result;
			 
		}

}


export async function placeOrder( nftAddress,nftId, toAddress, price) {

     const account = await base.getAccounts();
     const fromAddress = await account.getAddress();
	 console.log("wxl ----- placeOrder",fromAddress);
    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
   let hasWalletConnect=isWalletConnect();
   if(!hasWalletConnect){
	       let gasSetting = await base.getGasPriceAndGasLimit();
    console.log("gasSetting", gasSetting);
    let result = await contract.placeOrder(
        nftAddress, nftId,toAddress,1,fromAddress,utils.toUtf8Bytes(''),
        { value:price,gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit }
    );
	return result;
   }else{
	
	  let data= contract.methods.placeOrder(nftAddress, nftId,toAddress,1,fromAddress,utils.toUtf8Bytes('')).encodeABI()
	  
	let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,price);
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
   
  
	
	let hasWalletConnect=isWalletConnect();
	if(!hasWalletConnect){
		 let gasSetting = await base.getGasPriceAndGasLimit();
		    let rep = await contract.offSale(nftAddress, nftid,fromAddress,{
		        gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
		    });
			return rep;
	}else{
		
		  let data= contract.methods.offSale(nftAddress, nftid,fromAddress).encodeABI()
		  
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,"0");
		return result;
		 
	}
	
	
}
////offSaleBatch
export async function offSaleBatch( nftAddress,nftids) {
    debugger
    let fromaddressarr = [];

    const account = await base.getAccounts();
     const fromAddress = await account.getAddress();
     for (let i = 0; i < nftids.length; i++) {
        fromaddressarr.push(fromAddress)
    }
        

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
   
	
	
	let hasWalletConnect=isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
		let rep = await contract.offSaleBatch(nftAddress, nftids,fromaddressarr,{
		    gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
		});
			return rep;
	}else{
		
		  let data= contract.methods.offSaleBatch(nftAddress, nftids,fromaddressarr).encodeABI()
		  
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,"0");
		return result;
		 
	}
	
}

export async function revokeApprove(tokenArr, onAssetIds, value) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
    let data = JSON.stringify({ assetId: onAssetIds });
    let amount = onAssetIds.length;
    
	let hasWalletConnect=isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
		let rep = await contract.revokeApprove(tokenArr[0], value, amount, utils.toUtf8Bytes(data),
		    { gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit }
		);
			return rep;
	}else{
		  let data= contract.methods.revokeApprove(tokenArr[0], value, amount, utils.toUtf8Bytes(data)).encodeABI()
		  
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,0);
		return result;
		 
	}
}
