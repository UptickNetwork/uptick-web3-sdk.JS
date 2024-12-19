import {
    connect,
    connectCheck,
    initProofContract,
    wallectConnectSendTransaction,
    isWalletConnect
} from "./common";

import {
    abi, bytecode
} from "../abi/Uptick721.json";
import {resolve} from "path";

const base = require('./base');


let contractAddress = "0x679e2af9c4571c5617fa1df4f3094eb62d90f6ee";
let contractAddressPlatform = "0xd3e379f75d08ba91f632b363f021ceda01d94984";

export function setContractAddress(address, platformAddress) {
    if (address) {
        contractAddress = address;
    }
    if (platformAddress) {
        contractAddressPlatform = platformAddress;
    }
}

export async function deploy(name, metadataUrl,) {
    const ProofContractObj = await initProofContract(abi)

    const account = await base.getSigner();

    let gasSetting = await base.getGasPriceAndGasLimit();

    let proof = await ProofContractObj.proofContract
        .deploy({
            data: bytecode,
            arguments: [name, ''],
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


export async function transferFrom(toAddress, tokenId) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let result = await contract.transferFrom(
            fromAddress, toAddress, tokenId,
            {gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit}
        );
        return result;
    } else {
        let data = contract.methods.transferFrom(fromAddress, toAddress, tokenId).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
        return result;

    }


}


export async function mintNft(toAddress, tokenId, baseurl, mintByCreatorFee) {
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
            toAddress, tokenId, baseurl, mintByCreatorFee,
            {gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit}
        );
        return result;
    } else {
        let data = contract.methods.mintByCreatorFee(toAddress, tokenId, baseurl, mintByCreatorFee).encodeABI()

        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0");
        return result;

    }

}

export async function isApprovedForAll() {

    const account = await base.getSigner();
    const json = localStorage.getItem("key_user");
    let address = JSON.parse(json);
    const fromAddress = address.did

    let contract
    if (!contract) {
        contract = await connectCheck(contractAddress, abi, account);
    }
    let result = await contract.isApprovedForAll(
        fromAddress, contractAddressPlatform
    );
    return result;
}

export async function setApprovalForAll() {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }

    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let result = await contract.setApprovalForAll(
            contractAddressPlatform, true
        );
        return result;
    } else {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let data = contract.methods.setApprovalForAll(contractAddressPlatform, true).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0", {
            gasPrice: gasSetting.gasPrice,
            gasLimit: gasSetting.gasLimit
        });
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
    if (!hasWalletConnect) {
        let result = await contract.approve(
            offerAddress, tokenId
        );
        return result;
    } else {
        let gasSetting = await base.getGasPriceAndGasLimit();
        let data = contract.methods.approve(offerAddress, tokenId).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, "0", {
            gasPrice: gasSetting.gasPrice,
            gasLimit: gasSetting.gasLimit
        });
        return result;

    }

}

