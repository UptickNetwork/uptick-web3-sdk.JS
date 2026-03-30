import {
    connect,
    wallectConnectSendTransaction,
    isWalletConnect
} from "@uptickjs/uptick-web3-sdk/src/evm/handler/common";

import {
    abi
} from "@uptickjs/uptick-web3-sdk/src/evm/abi/ERC20Platform.json";
const base = require('./base');
const ierc20 = require('./ierc20');



let contractAddress = "0xabE5fD84c853a2Ca249ecC3d47CB7FEf000D41F6"

export function setContractAddress(platformAddress) {
    if (platformAddress) {
        contractAddress = platformAddress;
    }
}

export async function transfer(toAddress, tokenId, value) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {

        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.transfer(toAddress, tokenId, value, {
            value: value, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {
        let data = contract.methods.transfer(toAddress, tokenId, value).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, value);
        return result;

    }


}



export async function OnSale(nftAddress, amount, price, payAddress) {

    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    console.log('wxl --- OnSale contractAddress', contractAddress);
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }

    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.onSale(nftAddress, amount, price, payAddress, {
            gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {

        let data = contract.methods.onSale(nftAddress, amount, price, payAddress).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, fee);
        return result;

    }


}



export async function offSale(orderId) {

    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.offSale(orderId, {
            gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {
        let data = contract.methods.offSale(orderId).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
        return result;

    }


}

export async function placeOrder(orderId, toAddress, amount, value, payAddress,marketAddress) {
    console.log('wxl --- placeOrder value', value);
    console.log('wxl --- placeOrder amount', amount);
    console.log('wxl --- placeOrder toAddress', toAddress);
    console.log('wxl --- placeOrder orderId', orderId);
    console.log('wxl --- placeOrder payAddress', payAddress);
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
  
    if (payAddress != '0x0000000000000000000000000000000000000000') {
        await ierc20.setContractAddress(payAddress,marketAddress);
            
    let isApproved;
    let setApproval = await ierc20.setApprovalForAll(value);
    if (setApproval.hash) {
      isApproved = await ierc20.isApprovedForAll();
    }
    if (!isApproved) {
      return;
    }
    value = 0;
      }
      let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
    console.log('wxl --- placeOrder contractAddress', contractAddress);
console.log('wxl --- placeOrder orderId', orderId);
console.log('wxl --- placeOrder toAddress', toAddress);
console.log('wxl --- placeOrder amount', amount);
    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.placeOrder(orderId, toAddress, amount, {
            value: value,
            gasPrice: gasSetting.gasPrice,
            gasLimit: gasSetting.gasLimit
        });
        return rep;
    }

    let data = contract.methods.placeOrder(orderId, toAddress, amount).encodeABI();
    let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, value);
    return result;
}

