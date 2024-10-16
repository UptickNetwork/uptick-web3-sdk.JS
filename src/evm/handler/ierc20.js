import {
    connect,
	connectCheck,
	wallectConnectSendTransaction,
	isWalletConnect
} from "./common";

import {
    abi
} from "../abi/IERC20.json";

const base = require('./base');

//xxl todo get from .evn
let contractAddress,contractAddressPlatform;


export function setContractAddress(token20Address,platformAddress) {

    if(token20Address) {
        contractAddress = token20Address;
    }
    if(platformAddress) {
        contractAddressPlatform = platformAddress;
    }
    
}

// export async function mint(tokenId, memo) {
//     const account = await base.getAccounts();
//     let address = await account.getAddress();

//     let contract
//     if (!contract) {
//         contract = await connect(contractAddress, abi, account);
//     }

//     let result = await contract.mint(
//         address, tokenId, memo
//     );

//     console.log(result);

//     // let rep = await result.wait();
//     // console.log(rep);


// }

export async function getTokenBalance(owner) {
    debugger
    // const account = await base.getAccounts();


    const account = await base.getSigner();



    let contract
    console.log("getTokenBalance --- 1111",contractAddress);
    if (!contract) {
        contract = await connectCheck(contractAddress, abi, account);
    }

    let result = await contract.balanceOf(
        owner
    );
    let balance = result._hex.slice(2)
    if(contractAddress == '0xbbd60b4d3764974a9ed68eeaa4513ad1826f4c6b' || contractAddress == '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619' || contractAddress =='0xa8178660c2534f5d2074a4a9d269e9408963e649' || contractAddress =='0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' ){
        result=hex2int(balance)/1000000000000000000
    }else{
        result=hex2int(balance)/1000000
    }
   
    return result;


}

export async function isApprovedForAll() {
    const account = await base.getSigner();
    // const fromAddress = await account.getAddress();
    const json = localStorage.getItem("key_user");
    let address = JSON.parse(json);
    const fromAddress = address.did

    let contract
    if (!contract) {
        contract = await connectCheck(contractAddress, abi, account);
    }
    let result = await contract.allowance(
        fromAddress, contractAddressPlatform
    );
    console.log("isApprovedForAll", result);
    return result;
}

export async function setApprovalForAll(price) {
   
    const account = await base.getSigner();
    // const fromAddress = await account.getAddress();
    const json = localStorage.getItem("key_user");
    let address = JSON.parse(json);
    const fromAddress = address.did

    let contract
    if (!contract) {
        contract = await connect(contractAddress, abi, account);
    }
    
	
	
	let hasWalletConnect = isWalletConnect();
	if(!hasWalletConnect){
		let gasSetting = await base.getGasPriceAndGasLimit();
    let result = await contract.approve(
        contractAddressPlatform,price,
        { gasPrice: gasSetting.gasPrice, gasLimit: gasSetting.gasLimit }
    );
	
	console.log("setApprovalForAll", result);
	return result;
	}else{
		  let data= contract.methods.approve(  contractAddressPlatform,price).encodeABI()
		let result = await wallectConnectSendTransaction(fromAddress,contractAddress,data,"0");
		return result;
		 
	}
	
}
function hex2int(hex) {
    var len = hex.length, a = new Array(len), code;
    for (var i = 0; i < len; i++) {
        code = hex.charCodeAt(i);
        if (48<=code && code < 58) {
            code -= 48;
        } else {
            code = (code & 0xdf) - 65 + 10;
        }
        a[i] = code;
    }
     
    return a.reduce(function(acc, c) {
        acc = 16 * acc + c;
        return acc;
    }, 0);
}



