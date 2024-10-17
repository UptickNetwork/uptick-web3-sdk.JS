import {
    connect,
	initProofContract,
	wallectConnectSendTransaction,
	isWalletConnect
} from "./common";


import {
    abi,bytecode
} from "../abi/LazyNFT1948.json";
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

export async function deploy(name, metadataUrl,lazySignAddress) {
 
    const ProofContractObj = await initProofContract(abi)
	const account = await base.getSigner();

	let gasSetting = await base.getGasPriceAndGasLimit();
	console.log('wxl ----  deploy --- 28 ProofContract',ProofContractObj.proofContract,ProofContractObj.account);
 
 let proof = await ProofContractObj.proofContract
			    .deploy({
			      data: bytecode,
			      arguments: [name, '',lazySignAddress],
			    })
			    .send(
			      {
			        from: ProofContractObj.account,
			        gasPrice: gasSetting.gasPrice ,
			        gasLimit: gasSetting.gasLimit,
			      },
			      function (e, contract) {}
			    )
			    .on("receipt", function (receipt) {
					console.log('wxl ----- receipt ---- 49',receipt);

					
				
	
			    
			    })
          .on('error', (error) => {
            console.error(error);
            // 合约部署失败时的处理逻辑
          })
		  
				return proof._address
  


	
	

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
