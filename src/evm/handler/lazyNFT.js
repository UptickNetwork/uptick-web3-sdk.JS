import {
    connect,
	connectCheck,
	wallectConnectSendTransaction,
	isWalletConnect
} from "./common";


import {
    abi
} from "../artifact/LazyNFT.json";
import { utils } from "ethers";

const base = require('./base');

//xxl todo get from .evn
let contractAddress = "0xF4FD5200f7fFa79E910FdFa22549fCEB3a530206"
let contractAddressPlatform = ""

export function setContractAddress(address) {

    if(address) {
        contractAddress = address;
    }
   
}



export async function lazyMint( toAddress,tokenId,baseurl,payAddress,payAmount,creatorFee,signature,fee) {
     const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
	

	let hasWalletConnect = isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
		console.log("gasSetting 1155", gasSetting);
		
		let result = await contract.lazyMint(
		    toAddress, tokenId, baseurl,payAddress, payAmount,creatorFee,signature,
		    { value:fee,gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit }
		);
		return result;
		
	}else{
		  let data= contract.methods.lazyMint(toAddress, tokenId, baseurl,payAddress, payAmount,creatorFee,signature).encodeABI();
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,payAmount);
		return result;
		 
	}
	


	
	
}
