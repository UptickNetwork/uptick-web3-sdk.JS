import {
  connect,
  wallectConnectSendTransaction,
  isWalletConnect,
} from './common';

import { abi } from '../abi/MarketplaceOffer721.json';

const base = require('./base');

let contractAddress = '0x5c016b43d9c1d88a8907dcfe50e2e9080a231363';

export function setContractAddress(platformAddress) {
  if (platformAddress) {
    contractAddress = platformAddress;
  }
}

export async function createOffer(
  offerNumber,
  nftAddress,
  tokenId,
  payAddress,
  value,
  expiry,
  fee
) {
  //   If the bid currency is Uptick, the last parameter payamount is the same as the bid amount
  //   If the bidding currency is IRISATOM and other tokens, the last parameter payamount=0
  const account = await base.getAccounts();
  const fromAddress = await account.getAddress();
  let contract;
  if (!contract) {
    contract = await connect(contractAddress, abi, account);
  }

  let hasWalletConnect = isWalletConnect();
  if (!hasWalletConnect) {
    let gasSetting = await base.getGasPriceAndGasLimit();
    let rep = await contract.createOffer(
      offerNumber,
      nftAddress,
      tokenId,
      payAddress,
      value,
      expiry,
      {
        value: fee,
        gasPrice: gasSetting.gasPrice,
        gasLimit: gasSetting.gasLimit,
      }
    );
    return rep;
  } else {
    let data = contract.methods
      .createOffer(offerNumber, nftAddress, tokenId, payAddress, value, expiry)
      .encodeABI();
    let result = await wallectConnectSendTransaction(
      fromAddress,
      contractAddress,
      data,
      fee
    );
    return result;
  }
}

//CancelOffer
export async function cancelOffer(offerNumber) {
  //   If the bid currency is Uptick, the last parameter payamount is the same as the bid amount
  //   If the bidding currency is IRISATOM and other tokens, the last parameter payamount=0
  const account = await base.getAccounts();
  const fromAddress = await account.getAddress();
  let contract;
  if (!contract) {
    contract = await connect(contractAddress, abi, account);
  }

  let hasWalletConnect = isWalletConnect();
  if (!hasWalletConnect) {
    let gasSetting = await base.getGasPriceAndGasLimit();
    let rep = await contract.cancelOffer(offerNumber, {
      gasPrice: gasSetting.gasPrice,
      gasLimit: gasSetting.gasLimit,
    });
    return rep;
  } else {
    let data = contract.methods.cancelOffer(offerNumber).encodeABI();
    let result = await wallectConnectSendTransaction(
      fromAddress,
      contractAddress,
      data
    );
    return result;
  }
}

export async function acceptOffer(offerNumber, nftAddress, tokenId) {
  const account = await base.getAccounts();
  const fromAddress = await account.getAddress();
  let contract;
  if (!contract) {
    contract = await connect(contractAddress, abi, account);
  }

  let hasWalletConnect = isWalletConnect();
  if (!hasWalletConnect) {
    let gasSetting = await base.getGasPriceAndGasLimit();
    let rep = await contract.acceptOffer(offerNumber, nftAddress, tokenId, {
      gasPrice: gasSetting.gasPrice,
      gasLimit: gasSetting.gasLimit,
    });
    return rep;
  } else {
    let data = contract.methods
      .acceptOffer(offerNumber, nftAddress, tokenId)
      .encodeABI();
    let result = await wallectConnectSendTransaction(
      fromAddress,
      contractAddress,
      data
    );
    return result;
  }
}
