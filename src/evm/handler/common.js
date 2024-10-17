import { ethers } from "ethers";

import Web3 from 'web3';
const uptickUrl = window.location.protocol + "//" + window.location.host + "/uptick";
const base = require('./base');
export async function connect(address, abi, signer) {
	
	let hasWalletConnect=isWalletConnect();
	if(hasWalletConnect){
	let provider=window.walletProvider;
	let accountsPro=await provider.enable();
	let web3 = new Web3(provider);
	let contract=new web3.eth.Contract(abi,address,{
	  from: await signer.getAddress() // default from address
	});
	 return contract;
	}else{
		let contract = new ethers.Contract(address, abi, signer);
		return contract;
	}


}

export async function initProofContract(abi) {
	let web3

	let hasWalletConnect = isWalletConnect();
	if (hasWalletConnect) {
		let provider=window.walletProvider;
		let accountsPro=await provider.enable();
	  //  Create Web3
	  web3 = new Web3(provider);
	} else {
	  web3 = new Web3(window.ethereum);
	}

  let proofContract = new web3.eth.Contract(abi);
 let  accounts = await web3.eth.getAccounts();
 let proofContractObj = {
	proofContract:proofContract,
	account:accounts[0]

 }

  
return  proofContractObj
	
	
}
export async function connectCheck(address, abi, signer) {
	console.log("wxl --- connectCheck",address);
let contract = new ethers.Contract(address, abi, signer);
		return contract;


}

export async function wallectConnectSendTransaction(fromAddress,contractAddress,data,price){

	let provider=window.walletProvider;
		await provider.enable();
		let gasSetting = await base.getGasPriceAndGasLimit();
		let params= [
		  {
		    from: fromAddress,
		    to:contractAddress,
		    data:data,
			value:price,
			gasPrice: gasSetting.gasPrice,
			gasLimit: gasSetting.gasLimit
		  }
		];
		 let result={};
		let hash=await provider.request({
		   method: 'eth_sendTransaction',
		   params
		 }).catch((error) => {
		    console.error("provider.request error:",error)
			result.error=error;
		  })
		  result.hash=hash;
		  return result
		 
		
		
}


export  function isWalletConnect(){
	let isWalletConnect=false;
	const data = localStorage.getItem("walletconnect");
	if(!data)
	{
	    isWalletConnect = false
	} else{
	    isWalletConnect = JSON.parse(data).connected
	}
	return isWalletConnect;
}
