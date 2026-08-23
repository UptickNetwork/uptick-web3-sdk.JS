import { ethers } from 'ethers';

import Web3 from 'web3';

const uptickUrl =
  window.location.protocol + '//' + window.location.host + '/uptick';
const base = require('./base');
import { getMaskmaskProvider } from './base';

export async function connect(address, abi, signer) {
  let hasWalletConnect = isWalletConnect();
  if (hasWalletConnect) {
    let provider = window.walletProvider;
    let accountsPro = await provider.enable();
    let web3 = new Web3(provider);
    let contract = new web3.eth.Contract(abi, address, {
      from: await signer.getAddress(), // default from address
    });
    return contract;
  } else {
    let contract = new ethers.Contract(address, abi, signer);
    return contract;
  }
}

export async function initProofContract(abi) {
  let web3;

  let hasWalletConnect = isWalletConnect();
  if (hasWalletConnect) {
    let provider = window.walletProvider;
    let accountsPro = await provider.enable();
    //  Create Web3
    web3 = new Web3(provider);
  } else {
    let ethereum = await getMaskmaskProvider();
    web3 = new Web3(ethereum);
  }

  let proofContract = new web3.eth.Contract(abi);
  let accounts = await web3.eth.getAccounts();
  let proofContractObj = {
    proofContract: proofContract,
    account: accounts[0],
  };

  return proofContractObj;
}

export async function connectCheck(address, abi, signer) {
  let contract = new ethers.Contract(address, abi, signer);
  return contract;
}

export async function wallectConnectSendTransaction(
  fromAddress,
  contractAddress,
  data,
  price,
  gasLimitOverride
) {
  let provider = window.walletProvider;
  await provider.enable();
  let gasSetting = await base.getGasPriceAndGasLimit();
  let params = [
    {
      from: fromAddress,
      to: contractAddress,
      data: data,
      value: price,
      gasPrice: gasSetting.gasPrice,
      gasLimit: gasLimitOverride || gasSetting.gasLimit,
    },
  ];
  let result = {};
  let hash = await provider
    .request({
      method: 'eth_sendTransaction',
      params,
    })
    .catch((error) => {
      console.error('provider.request error:', error);
      result.error = error;
    });
  result.hash = hash;
  return result;
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

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

// Validate an EVM address. Throws before any chain interaction so a malformed
// or attacker-controlled value can never be forwarded to a contract call.
export function validateAddress(address, label = 'address') {
  if (typeof address !== 'string' || !ADDRESS_RE.test(address)) {
    throw new Error(`[uptick-sdk] Invalid ${label}: ${String(address)}`);
  }
  return address;
}

// Validate a numeric amount/price. Rejects NaN, empty and non-numeric garbage.
export function validateAmount(amount, label = 'amount') {
  if (
    amount === undefined ||
    amount === null ||
    amount === '' ||
    isNaN(Number(amount))
  ) {
    throw new Error(`[uptick-sdk] Invalid ${label}: ${String(amount)}`);
  }
  return amount;
}

// Validate an EIP-712 / personal_sign signature shape before sending on-chain.
export function validateSignature(signature, label = 'signature') {
  if (typeof signature !== 'string' || !/^0x[0-9a-fA-F]*$/.test(signature)) {
    throw new Error(`[uptick-sdk] Invalid ${label}: ${String(signature)}`);
  }
  return signature;
}

// Read the cached login identity, failing loudly instead of crashing on a
// missing/corrupted localStorage entry.
export function requireLogin() {
  const raw = localStorage.getItem('key_user');
  if (!raw) {
    throw new Error('[uptick-sdk] Not logged in: missing key_user in localStorage');
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error('[uptick-sdk] Corrupted key_user in localStorage');
  }
  if (
    !parsed ||
    typeof parsed.did !== 'string' ||
    !ADDRESS_RE.test(parsed.did)
  ) {
    throw new Error('[uptick-sdk] Invalid key_user.did in localStorage');
  }
  return parsed;
}
