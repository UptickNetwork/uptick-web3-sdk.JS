import { ethers } from 'ethers';

let { bech32 } = require('bech32');
import Web3 from 'web3';

let rpcURL = 'https://json-rpc.uptick.network';
const web3Obj = new Web3(rpcURL);
import { MetaMaskSDK } from '@metamask/sdk';

export const getWeb3Instance = () => {
  return web3Obj;
};

export const setProvider = (provider) => {
  web3Obj.setProvider(provider);
};

export async function getMaskmaskProvider() {
  const MMSDK = new MetaMaskSDK({
    shouldShimWeb3: false,
  });
  let ethereum;
  await MMSDK.init();
  const accounts = await MMSDK.connect();
  // You can also access the Ethereum provider object.
  ethereum = await MMSDK.getProvider();
  return ethereum;
}
const fromHexString = (hexString) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

export async function getBalance() {
  // const account = await getAccounts();
  // 根据缓存获取地址
  const json = localStorage.getItem('key_user');
  let address = JSON.parse(json);
  let amt = web3Obj.eth.getBalance(address.did);
  return amt;
}

export async function getAccounts() {
  let web3Provider, provider;

  if (isWalletConnect()) {
    provider = window.walletProvider;
    await provider.enable();
    web3Provider = new ethers.providers.Web3Provider(provider);
  } else {
    let ethereum = await getMaskmaskProvider();
    web3Provider = new ethers.providers.Web3Provider(ethereum);
  }
  let signer = await web3Provider.getSigner();
  return signer;
}

export async function getSigner() {
  let provider, web3Provider;
  let ethereum = await getMaskmaskProvider();
  if (isWalletConnect()) {
    provider = window.walletProvider;
  } else {
    provider = ethereum;
  }

  web3Provider = new ethers.providers.Web3Provider(provider);

  let signer = await web3Provider.getSigner();
  //
  return signer;
}

// 检查是否包含特定的chainID
export async function containsChainId(targetChainId) {
  let ethereum = await getMaskmaskProvider();
  try {
    // 尝试切换到指定链
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChainId }],
    });
    console.log(`链 ID ${targetChainId} 已添加到 MetaMask`);
    return true;
  } catch (error) {
    if (error.code === 4902) {
      console.log(`链 ID ${targetChainId} 未添加到 MetaMask`);
      return false;
    } else {
      console.error('发生错误:', error);
      return false;
    }
  }
}

export async function checkExitChain(chainId) {
  // 检查是否安装了MetaMask
  let ethereumobj = await getMaskmaskProvider();
  if (typeof ethereumobj !== 'undefined') {
    const ethereum = ethereumobj;

    // 请求用户授权访问其钱包
    ethereum
      .enable()
      .then(() => {
        // 获取当前选定的网络ID
        const currentNetworkId = ethereum.networkVersion;

        // 切换到目标网络
        ethereum
          .request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }], // 目标网络的链ID
          })
          .then(() => {
            // 切换成功后的逻辑
            console.log('Chain change success');
          })
          .catch((error) => {
            // 切换失败后的逻辑
            console.error('Chain change failed', error);
            return false;
          });
      })
      .catch((error) => {
        // 用户拒绝授权访问钱包或发生其他错误
        console.error('change error', error);
        return false;
      });
  } else {
    // MetaMask未安装
    console.error('Install MetaMask');
    return false;
  }
}

export function getUptickAddress(evmAddress) {
  let words = bech32.toWords(fromHexString(evmAddress));
  return bech32.encode('uptick', words);
}

export async function addNetwork(
  chainId,
  chainName,
  symbol,
  rpcUrl,
  blockExplorerUrls
) {
  try {
    let ethereum = await getMaskmaskProvider();
    let res = await ethereum.request({
      method: 'wallet_addEthereumChain',

      params: [
        {
          chainId: chainId,
          chainName: chainName,
          nativeCurrency: {
            name: 'Ether',
            symbol: symbol, // 2-6 characters long
            decimals: 18,
          },
          rpcUrls: [rpcUrl],
          blockExplorerUrls: [blockExplorerUrls],
        },
      ],
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const { utils } = require('ethers');

export async function transfer(toAddress, value, memo) {
  let hexValue = utils.parseEther(value).toHexString();
  const gasPrice = '0x2540be400';
  const gas = '0xF4240';

  const account = await getAccounts();
  let address = await account.getAddress();

  const transactionParameters = {
    gasPrice,
    gas,
    to: toAddress,
    from: address,
    value: hexValue,
    data: memo,
  };
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });
  return txHash;
}

export async function getGasPriceAndGasLimit() {
  let gasPrice = await web3Obj.eth.getGasPrice();
  let gasLimit = '0x7A1200';

  return { gasPrice, gasLimit };
}

export function isWalletConnect() {
  let isWalletConnect = false;
  const data = localStorage.getItem('walletconnect');
  if (!data) {
    isWalletConnect = false;
  } else {
    isWalletConnect = JSON.parse(data).connected;
  }
  return isWalletConnect;
}
