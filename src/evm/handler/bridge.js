import {
    connect,
    wallectConnectSendTransaction,
    isWalletConnect
} from "./common";
import {ethers} from "ethers";
import {
    abi
} from "../abi/Bridge.json";

const base = require('./base');


let uptickContractAddress = "0xfe800a21a5f97fdc520320e215c3ae1e6c6239c7"
let polygonContractAddress = "0xec786d399fd357e4dc00abe4670c2bc3bf1efdae"


export function setContractAddress(platformAddress) {
    if (platformAddress) {
        uptickContractAddress = platformAddress;
    }
}

// 获取跨链手续费
export async function getFeeByChainID(tokenIds, chainID) {

    try {

        const account = await base.getSigner();
        let contract
        if (!contract) {
            contract = new ethers.Contract(uptickContractAddress, abi, account);
        }
        let rep = await contract.getFeeByChainID(tokenIds, Number(chainID));

        return parseInt(rep._hex, 16);


    } catch (error) {
        console.log('error', error);
    }

}

// uptick -> polygon
export async function uptickCrossToEVM(srcChainName, destinationChainId, toAddress, metadate, fee) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
    let contract
    if (!contract) {
        contract = await connect(uptickContractAddress, abi, account);
    }

    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {

        let gasSetting = await base.getGasPriceAndGasLimit();
        if (srcChainName == 'ARBITRUM') {
            gasSetting.gasLimit = "0x2DC6C0"
        }
        let rep = await contract.depositGeneric(destinationChainId, toAddress, metadate, {
            value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {
        let data = contract.methods.depositGeneric(destinationChainId, toAddress, metadate).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, uptickContractAddress, data, fee);
        return result;

    }
}


