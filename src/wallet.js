
const { utils } = require('ethers')

const Web3 = require('web3');

export const getMatamaskWeb3 = async () => {
	var web3;
	if (window.ethereum) {
		// Modern dapp browsers
		web3 = new Web3(window.ethereum);
		try {
			console.log("连接metamask钱包")
			await window.ethereum.enable();
			await window.ethereum.eth_requestAccounts();
		} catch (error) {
			console.log('denied');
		}
	} else {
		this.$Message.error('Link the metamask！');
	}
	let accounts = await web3.eth.getAccounts();
	return accounts;
};

export const isMatamasklogin = async () => {
  if(window.ethereum.isConnected()){
    getMatamaskWeb3();
  }
};
