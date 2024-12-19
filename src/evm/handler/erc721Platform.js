import {
    connect,
    wallectConnectSendTransaction,
    isWalletConnect
} from "./common";

import {
    abi
} from "../abi/ERC721Platform.json";

const base = require('./base');


let contractAddress = "0xd3e379f75d08ba91f632b363f021ceda01d94984"

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

//placeOrder
export async function placeOrder(nftAddress, nftId, toAddress, price) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();

        let result = await contract.placeOrder(
            nftAddress, nftId, fromAddress,
            {value: price, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit}
        );
        return result;


    } else {
        let data = contract.methods.placeOrder(nftAddress, nftId, fromAddress).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, price);
        return result;

    }


}

// onSaleBatch
export async function onSaleBatch(nftAddresss, nftids, values, fee, payAddresss) {



    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.onSaleBatch(nftAddresss, nftids, values, payAddresss, {
            value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {
        let data = contract.methods.onSaleBatch(nftAddresss, nftids, values, payAddresss).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, fee);
        return result;

    }


}

export async function onSale(nftAddress, nftid, value, fee, payAddress) {

    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }

    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.onSale(nftAddress, nftid, value, payAddress, {
            value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {

        let data = contract.methods.onSale(nftAddress, nftid, value, payAddress).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, fee);
        return result;

    }


}

export async function offSaleBatch(nftAddress, nftids) {

    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.offSaleBatch(nftAddress, nftids, {
            gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {
        let data = contract.methods.offSaleBatch(nftAddress, nftids).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
        return result;

    }


}

export async function offSale(nftAddress, nftid) {

    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.offSale(nftAddress, nftid, {
            gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {
        let data = contract.methods.offSale(nftAddress, nftid).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
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
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.revokeApprovesWithArray(tokenArr,
            {gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit}
        );
        return rep;


    } else {
        let data = contract.methods.revokeApprovesWithArray(tokenArr).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
        return result;

    }

}
