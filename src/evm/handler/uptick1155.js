import {
    connect,
    initProofContract,
    connectCheck,
    wallectConnectSendTransaction,
    isWalletConnect
} from "./common";


import {
    abi, bytecode
} from "../abi/Uptick1155.json";
import {utils} from "ethers";

const base = require('./base');


let contractAddress = "0xf4fd5200f7ffa79e910fdfa22549fceb3a530206"
let contractAddressPlatform = ""

export function setContractAddress(address, platformAddress) {

    if (address) {
        contractAddress = address;
    }
    if (platformAddress) {
        contractAddressPlatform = platformAddress;
    }
}

export async function deploy(name, metadataUrl) {

    const ProofContractObj = await initProofContract(abi)
    const account = await base.getSigner();

    let gasSetting = await base.getGasPriceAndGasLimit();

    let proof = await ProofContractObj.proofContract
        .deploy({
            data: bytecode,
            arguments: [name, '', metadataUrl],
        })
        .send(
            {
                from: ProofContractObj.account,
                gasPrice: gasSetting.gasPrice,
                gasLimit: gasSetting.gasLimit,
            },
            function (e, contract) {
            }
        )
        .on("receipt", function (receipt) {


        })
        .on('error', (error) => {
            console.error(error);
            // 合约部署失败时的处理逻辑
        })

    return proof._address


}


// 转送
export async function safeTransferFrom(toAddress, tokenId, countValue) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();

        let result = await contract.safeTransferFrom(
            fromAddress, toAddress, tokenId, countValue, utils.toUtf8Bytes(''),
            {gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit}
        );
        return result;
    } else {
        let data = contract.methods.safeTransferFrom(fromAddress, toAddress, tokenId, countValue, utils.toUtf8Bytes('')).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
        return result;

    }


}

export async function mintNft(toAddress, tokenId, baseurl, royaltyPercentage, amountValue) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let result = await contract.mintByCreatorFee(
            toAddress, tokenId, amountValue, utils.toUtf8Bytes(baseurl), royaltyPercentage,
            {gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit}
        );
        return result;

    } else {
        let data = contract.methods.mintByCreatorFee(toAddress, tokenId, amountValue, utils.toUtf8Bytes(''), royaltyPercentage).encodeABI();
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
        return result;

    }


}

export async function isApprovedForAll(operator) {

    const account = await base.getSigner();
    // const fromAddress = await account.getAddress();
    const json = localStorage.getItem("key_user");
    let address = JSON.parse(json);
    const fromAddress = address.did
    let contract
    if (!contract) {
        contract = await connectCheck(contractAddress, abi, account);
    }
    if (!operator) {
        operator = contractAddressPlatform
    }
    let result = await contract.isApprovedForAll(
        fromAddress, operator
    );
    return result;

}

export async function setApprovalForAll(operator) {
    const account = await base.getAccounts();
    const address = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
    if (!operator) {
        operator = contractAddressPlatform
    }

    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let result = await contract.setApprovalForAll(
            operator, true
        );
        return result;
    } else {
        let data = contract.methods.setApprovalForAll(operator, true).encodeABI()
        let result = await wallectConnectSendTransaction(address, contractAddress, data, "0");
        return result;

    }


}
