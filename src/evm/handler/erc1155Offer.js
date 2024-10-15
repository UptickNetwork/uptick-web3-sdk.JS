import {
    connect,
	wallectConnectSendTransaction,
	isWalletConnect
} from "./common";

import {
    abi
} from "../abi/MarketplaceOffer1155.json";

const base = require('./base');

//xxl todo get from .evn
let contractAddress = "0xe303064b7d62dd2479ae974f142db3d456b71ef7"

export function setContractAddress(platformAddress) {
    if(platformAddress) {
        contractAddress = platformAddress;
    }
}

export async function createOffer(offerNumber, nftAddress, tokenId,payAddress,value,expiry,fee) {
    try {

//     出价币种如果是Uptick,最后一个参数payamount和出价金额保持一致
// 出价币种如果是IRIS\ATOM等代币，最后一个参数 payamount=0
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
       let contract
       console.log("createOffer",contractAddress);
       if (!contract) {
           contract = await connect(contractAddress, abi, account);
       }
       let hasWalletConnect = isWalletConnect();
	  
	   
       if(!hasWalletConnect){
       let gasSetting = await base.getGasPriceAndGasLimit();
       let rep = await contract.createOffer(offerNumber, nftAddress, tokenId,payAddress,value,expiry, {
           value:fee,gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
       });
       return rep;
           
       }else{
             let data= contract.methods.createOffer(offerNumber, nftAddress, tokenId,payAddress,value,expiry).encodeABI()
           let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,fee);
           return result;
            
       }
        
    } catch (error) {
            console.log("error",error);
    }

	
	
}

//CancelOffer 
export async function cancelOffer(offerNumber) {

    //     出价币种如果是Uptick,最后一个参数payamount和出价金额保持一致
    // 出价币种如果是IRIS\ATOM等代币，最后一个参数 payamount=0
        const account = await base.getAccounts();
     const fromAddress = await account.getAddress();
        let contract
        if (!contract) {
            contract = await connect(contractAddress, abi, account);
        }
    
        
        
        let hasWalletConnect = isWalletConnect();
        if(!hasWalletConnect){
        
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.cancelOffer(offerNumber, {
            gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;
            
        }else{
              let data= contract.methods.cancelOffer(offerNumber).encodeABI()
            let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data);
            return result;
             
        }
        
        
    }
    export async function acceptOffer(offerNumber,nftAddress,tokenId) {
        //offerNumber nftAddress tokenId
                  const account = await base.getAccounts();
               const fromAddress = await account.getAddress();
                  let contract
                  if (!contract) {
                      contract = await connect(contractAddress, abi, account);
                  }
              
                  
                  
                  let hasWalletConnect = isWalletConnect();
                  if(!hasWalletConnect){
                  
                  let gasSetting = await base.getGasPriceAndGasLimit();
                  let rep = await contract.acceptOffer(offerNumber,nftAddress,tokenId,{
                      gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
                  });
                  return rep;
                      
                  }else{
                        let data= contract.methods.acceptOffer(offerNumber,nftAddress,tokenId).encodeABI()
                      let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data);
                      return result;
                       
                  }
                  
                  
              }



