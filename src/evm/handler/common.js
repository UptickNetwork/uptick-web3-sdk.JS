import { ethers } from "ethers";
 import { initProvider} from "../../walletConnectU";
import Web3 from 'web3';
const uptickUrl = window.location.protocol + "//" + window.location.host + "/uptick";
const base = require('./base');
export async function connect(address, abi, signer) {
	
	let isWalletConnect=isWalletConnect();
	if(isWalletConnect){
	let provider=await initProvider();
	let accountsPro=await provider.enable();
	console.log("accountsPro===",accountsPro);
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
export async function connectCheck(address, abi, signer) {
	console.log("wxl --- connectCheck",address);
let contract = new ethers.Contract(address, abi, signer);
		return contract;


}

export async function wallectConnectSendTransaction(fromAddress,contractAddress,data,price){

	let provider=await initProvider();
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
	return window.isWalletConnect
	// let isWalletConnect=false;
	// const data = localStorage.getItem("walletconnect");
	// if(!data)
	// {
	//     isWalletConnect = false
	// } else{
	//     isWalletConnect = JSON.parse(data).connected
	// }
	// return isWalletConnect;
}
