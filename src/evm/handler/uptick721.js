import {
   connect,
   connectCheck,
   wallectConnectSendTransaction,
   isWalletConnect
} from "./common";

import {
    abi,bytecode
} from "../abi/Uptick721.json";

const base = require('./base');

//xxl todo get from .evn
let contractAddress = "0x679e2af9c4571c5617fa1df4f3094eb62d90f6ee";
let contractAddressPlatform = "0xd3e379f75d08ba91f632b363f021ceda01d94984";

export function setContractAddress(address, platformAddress) {
    if(address) {
        contractAddress = address;
    }
    if(platformAddress) {
        contractAddressPlatform = platformAddress;
    }
}

export async function deploy(name, metadataUrl) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
let gasSetting = await base.getGasPriceAndGasLimit();
		
		let contract
		if (!contract) {
		    contract = await connect('', abi, account);
		}
				
 
 let proof = await contract
			    .deploy({
			      data: bytecode,
			      arguments: [name, metadataUrl],
			    })
			    .send(
			      {
			        from: account,
			        gasPrice: gasSetting.gasPrice ,
			        gasLimit: gasSetting.gasLimit,
			      },
			      function (e, contract) {}
			    )
			    .on("receipt", function (receipt) {
					return receipt;
			    
			    })
          .on('error', (error) => {
            console.error(error);
            // 合约部署失败时的处理逻辑
          })
		  

  


	
	

}


export async function transferFrom(toAddress, tokenId) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    console.log("wxl ---- fromAddress",fromAddress);


    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }

  

let hasWalletConnect = isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
		console.log("gasSetting", gasSetting);
		let result = await contract.transferFrom(
		    fromAddress, toAddress, tokenId,
		    { gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit }
		);
		return result;
	}else{
		  let data= contract.methods.transferFrom(fromAddress, toAddress, tokenId).encodeABI()
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,"0");
		return result;
		 
	}
	
	

}




export async function mintNft( toAddress,tokenId,baseurl,mintByCreatorFee) {
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
		let result = await contract.mintByCreatorFee(
		    toAddress, tokenId, baseurl,mintByCreatorFee,
		    { gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit }
		);
		return result;
	}else{
		  let data= contract.methods.mintByCreatorFee(toAddress, tokenId, baseurl,mintByCreatorFee).encodeABI()
		 
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,"0");
		return result;
		 
	}
	
}

export async function isApprovedForAll() {
    console.log('====================================');
    console.log(contractAddress,contractAddressPlatform);
    console.log('====================================');

    const account = await base.getSigner();
    // const fromAddress = await account.getAddress();
    const json = localStorage.getItem("key_user");
    let address = JSON.parse(json);
    const fromAddress = address.did

    let contract
    if (!contract) {
        contract = await connectCheck(contractAddress, abi, account);
    }
    console.log("wxl ----2222",contract);
    let result = await contract.isApprovedForAll(
        fromAddress, contractAddressPlatform
    );
    console.log("isApprovedForAll", result);
    return result;
}

export async function setApprovalForAll() {
    console.log("wxl --- 33333333333");
    const account = await base.getAccounts();
    console.log("wxl --- 4444444444");
    const fromAddress = await account.getAddress();
    console.log("wxl --- 55555555");

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
    	
let hasWalletConnect = isWalletConnect();
	if(!hasWalletConnect){
		let result = await contract.setApprovalForAll(
		    contractAddressPlatform, true
		);
		console.log("setApprovalForAll", result);
		return result;
	}else{
        let gasSetting = await base.getGasPriceAndGasLimit();
		let data= contract.methods.setApprovalForAll(contractAddressPlatform, true).encodeABI()
        console.log('wxl setApprovalForAll ========================',data);
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,"0", { gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit });
		return result;
		 
	}
	
}


export async function setApprovTokenid(offerAddress, tokenId) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
    	
let hasWalletConnect = isWalletConnect();
	if(!hasWalletConnect){
		let result = await contract.approve(
		    offerAddress, tokenId
		);
		console.log("approveTokenID", result);
		return result;
	}else{
        let gasSetting = await base.getGasPriceAndGasLimit();
		let data= contract.methods.approve(offerAddress, tokenId).encodeABI()
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,"0", { gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit });
		return result;
		 
	}
	
}

