import {
    connect,
    wallectConnectSendTransaction,
    isWalletConnect
} from "./common";

import {
    abi
} from "../abi/ERC721Auction.json";

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

export async function onSale(nftAddress, nftid, startTimeStamp, endTimeStamp, startBid, fixPrice, ReserveBid, fee, payAddress) {


    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.createAuction(nftAddress, nftid, startTimeStamp, endTimeStamp, startBid, fixPrice, ReserveBid, payAddress, {
            value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {
        let data = contract.methods.createAuction(nftAddress, nftid, startTimeStamp, endTimeStamp, startBid, fixPrice, ReserveBid, payAddress).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, fee);
        return result;

    }

}


export async function placeBid(nftAddress, nftid, fixPrice, fee) {

    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.bid(nftAddress, nftid, fixPrice, {
            value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;


    } else {
        let data = contract.methods.bid(nftAddress, nftid, fixPrice).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, fixPrice);
        return result;

    }


}

export async function end(nftAddress, nftid) {

    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.endAuction(nftAddress, nftid, {
            gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;


    } else {
        let data = contract.methods.endAuction(nftAddress, nftid).encodeABI()
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
