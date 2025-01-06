const { utils } = require('ethers');

const Web3 = require('web3');
import { getMaskmaskProvider } from './evm/handler/base';

export const getMatamaskWeb3 = async () => {
  var web3;
  let ethereum = await getMaskmaskProvider();
  if (ethereum) {
    // Modern dapp browsers
    web3 = new Web3(ethereum);
    try {
      // await window.ethereum.eth_requestAccounts();
      ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log(error);
    }
  } else {
  }
  let accounts = await web3.eth.getAccounts();
  return accounts;
};

export const isMatamasklogin = async () => {
  if (await checkConnection()) {
    getMatamaskWeb3();
  }
};

async function checkConnection() {
  try {
    let ethereum = await getMaskmaskProvider();
    const accounts = await ethereum.request({
      method: 'eth_accounts',
    });
    console.log('connect success');
    return accounts.length > 0;
  } catch (error) {
    console.error('connect success', error);
    return false;
  }
}
