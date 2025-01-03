import {
    connect,
    initProofContract,
    wallectConnectSendTransaction,
    isWalletConnect
} from "./common";


import {
    abi, bytecode
} from "../abi/LazyNFT1948.json";
import {utils} from "ethers";

const base = require('./base');
const Web3 = require('web3');

let contractAddress = "0xf4fd5200f7ffa79e910fdfa22549fceb3a530206"
let contractAddressPlatform = ""

export function setContractAddress(address) {

    if (address) {
        contractAddress = address;
    }

}

export function stringToBytes32(str) {
    let web3 = new Web3();
    const padded = web3.utils.padLeft(web3.utils.asciiToHex(str), 64); //
    return padded;
}


export async function deploy(name, metadataUrl, lazySignAddress) {

    const ProofContractObj = await initProofContract(abi)
    const account = await base.getSigner();

    let gasSetting = await base.getGasPriceAndGasLimit();

    let proof = await ProofContractObj.proofContract
        .deploy({
            data: bytecode,
            arguments: [name, '', lazySignAddress],
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


export async function lazyMint(toAddress, tokenId, baseurl, payAddress, payAmount, creatorFee, signature, data, fee) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
        let gasSetting = await base.getGasPriceAndGasLimit();

        let result = await contract.lazyMint(
            toAddress, tokenId, baseurl, payAddress, payAmount, creatorFee, signature, stringToBytes32(data),
            {value: fee, gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit}
        );
        return result;

    } else {
        let data = contract.methods.lazyMint(toAddress, tokenId, baseurl, payAddress, payAmount, creatorFee, signature, stringToBytes32(data)).encodeABI();
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, payAmount);
        return result;

    }


}
