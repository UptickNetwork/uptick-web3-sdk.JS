import {
    connect,
    wallectConnectSendTransaction,
    isWalletConnect
} from "./common";

import {
    abi
} from "../abi/ERC3643Token.json";

const base = require('./base');


let contractAddress = "0xd3e379f75d08ba91f632b363f021ceda01d94984"

export function setContractAddress(platformAddress) {
    if (platformAddress) {
        contractAddress = platformAddress;
    }
}

export async function transfer(tokenAddress, toAddress, amount) {
    const account = await base.getAccounts();
    const fromAddress = await account.getAddress();
    let contract
    if (!contract) {
        contract = await connect(tokenAddress, abi, account);
    }


    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {

        let gasSetting = await base.getGasPriceAndGasLimit();
        let rep = await contract.transfer(toAddress, amount, {
             gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit
        });
        return rep;

    } else {
        let data = contract.methods.transfer(toAddress, amount).encodeABI()
        let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data);
        return result;

    }


}
// export async function transfer(tokenAddress, toAddress, amount) {
//   let weiAmount = web3Obj.utils.toWei(amount, 'ether');
//   const ProofContractObj = await initProofContract(abi);
//   const txData = {
//     from: ProofContractObj.account,
//     to: tokenAddress,
//     gasPrice: 1000000000000000000,
//     data: ProofContractObj.proofContract.methods
//       .transfer(toAddress, weiAmount)
//       .encodeABI(),
//   };
//   let signer = await getAccounts();
//   let contract = await connect(tokenAddress, abi, signer);
//   let gasSetting = await getGasPriceAndGasLimit(txData);
//   let result = await contract.transfer(toAddress, weiAmount, {
//     gasPrice: gasSetting.gasPrice,
//     gasLimit: gasSetting.gasLimit,
//   });
//   return result;
// }

export async function approve(tokenAddress, spender, amount) {
  console.log('wxl --- approve tokenAddress', tokenAddress);
  console.log('wxl --- approve spender', spender);
  console.log('wxl --- approve amount', amount);

  const account = await base.getAccounts();
  const fromAddress = await account.getAddress();
  let contract
  if (!contract) {
    contract = await connect(tokenAddress, abi, account);
  }
  let hasWalletConnect = isWalletConnect();
  if (!hasWalletConnect) {
    let gasSetting = await base.getGasPriceAndGasLimit();
    let result = await contract.approve(spender, amount, {
      gasPrice: gasSetting.gasPrice,
      gasLimit: gasSetting.gasLimit,
    });
  }
  else {
    let data = contract.methods.approve(spender, amount).encodeABI()
    let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, amount);
    return result;
  }
}

// 单个检查白名单
export async function checkWhitelist(tokenAddress, whiteAddress) {
  const account = await base.getAccounts();
  const fromAddress = await account.getAddress();
  let contract
  if (!contract) {
      contract = await connect(tokenAddress, abi, account);
    }
    let hasWalletConnect = isWalletConnect();
    if (!hasWalletConnect) {
      let gasSetting = await base.getGasPriceAndGasLimit();
      let result = await contract.isWhitelisted(whiteAddress, {
        gasPrice: gasSetting.gasPrice,
        gasLimit: gasSetting.gasLimit,
      });
      return result;
    }
    else {
      let data = contract.methods.isWhitelisted(whiteAddress).encodeABI()
      let result = await wallectConnectSendTransaction(fromAddress, contractAddress, data, whiteAddress);
      return result;
    }
}





