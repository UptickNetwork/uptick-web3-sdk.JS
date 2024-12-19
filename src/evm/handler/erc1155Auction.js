import {
    connect,
    wallectConnectSendTransaction,
    isWalletConnect
} from "./common";

import {
    abi
} from "../abi/ERC1155Auction.json";
import {utils} from "ethers";

const base = require('./base');


let contractAddress = "0x99a415da5b4d061556e2d55c3382cfeda02a5a7d"

export function setContractAddress(platformAddress) {

    if (platformAddress) {
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

    let data = JSON.stringify({assetId: [assetId]});
    let amount = 1;


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();

        let rep = await contract.transfer(owner, tokenId, value, amount, address, utils.toUtf8Bytes(data), {
            value: value, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;


    } else {
        let data = contract.methods.transfer(owner, tokenId, value, amount, address, utils.toUtf8Bytes(data)).encodeABI()
        let result = await wallectConnectSendTransaction(address, contractAddress, data, value);
        return result;

    }


}

export async function onSale(nftAddress, nftid, startTimeStamp, endTimeStamp, startBid, fixPrice, ReserveBid, fee, amount, payAddress) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();

        let rep = await contract.createAuction(nftAddress, nftid, amount, startTimeStamp, endTimeStamp, startBid, fixPrice, ReserveBid, payAddress, {
            value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });

        return rep;

    } else {
        let data = contract.methods.createAuction(nftAddress, nftid, amount, startTimeStamp, endTimeStamp, startBid, fixPrice, ReserveBid, payAddress).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, fee);
        return result;

    }


}


export async function placeBid(nftAddress, nftid, fixPrice, owner, fee) {

    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();


    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();

        let rep = await contract.bid(nftAddress, owner, nftid, fixPrice, {
            value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });

        return rep;


    } else {
        let data = contract.methods.bid(nftAddress, owner, nftid, fixPrice).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, fixPrice);
        return result;

    }


}


export async function end(nftAddress, nftid, owner) {

    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();

        let rep = await contract.endAuction(nftAddress, owner, nftid, {
            gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });

        return rep;

    } else {
        let data = contract.methods.endAuction(nftAddress, owner, nftid).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
        return result;

    }


}

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
            nftAddress, nftId, toAddress, 1, fromAddress, utils.toUtf8Bytes(''),
            {value: price, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit}
        );
        return result;


    } else {
        let data = contract.methods.placeOrder(nftAddress, nftId, toAddress, 1, fromAddress, utils.toUtf8Bytes('')).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, price);
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
        let rep = await contract.offSale(nftAddress, nftid, fromAddress, {
            gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {
        let data = contract.methods.offSale(nftAddress, nftid, fromAddress).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
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
    let data = JSON.stringify({assetId: onAssetIds});
    let amount = onAssetIds.length;


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.revokeApprove(tokenArr[0], value, amount, utils.toUtf8Bytes(data),
            {gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit}
        );
        return rep;

    } else {
        let data = contract.methods.revokeApprove(tokenArr[0], value, amount, utils.toUtf8Bytes(data)).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
        return result;

    }
}
