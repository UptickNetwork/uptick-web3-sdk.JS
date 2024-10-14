import Vue from "vue";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { apiGetAccountAssets, apiGetGasPrices, apiGetAccountNonce } from "./helpers/api";
import {
    sanitizeHex,
    verifySignature,
    hashTypedDataMessage,
    hashMessage,
} from "./helpers/utilities";

import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";

let uptickUrl = window.location.protocol + "//" + window.location.host + "/uptickNode";





var Web3 = require('web3');
const web3Obj = new Web3();



const BigNumber = require('big-number');   
const { toUnitValue ,getMaxFeeBips} = require("../utils/helper");
let chainId = process.env.VUE_APP_ADD_NETWORK_CHAIN_ID
let chainIdInt = parseInt(chainId, 16)
console.log( '-------',chainIdInt);


let appState = {
    connector: null,
    fetching: false,
    connected: false,
    chainId: chainIdInt,
    showModal: false,
    pendingRequest: false,
    uri: "",
    accounts: [],
    address: "",
    result: null,
    assets: [],
};


(function () {
    const state = sessionStorage.getItem("walletconnect_appstate");
    let chainId;
    if (state && state.length > 0) {
        appState = JSON.parse(state);
        chainId = appState.chainId;
    }
    
})();


export const events = new Vue();
const projectId='fcdd88566430f26f30305932271b8e66';

function gethost() {
    let url = window.location.href 
    var urlstr = url.split("/"); 
    var urls = '';
    if (urlstr[2]) {
        urls = urlstr[0]+'//'+urlstr[2];
    }
    return urls
}
	 
	export async function initProvider(){
		 const provider = await EthereumProvider.init({
		   projectId,
		   optionalChains: [chainIdInt],
		   metadata: {
		       name: 'UptickNFT',
		       description: 'Build your NFT world on Uptick',
		       url: gethost(), // origin must match your domain & subdomain
		       icons: ['https://uptick.upticknft.com/logo.jpg']
		     },
		   optionalMethods: ["eth_sendTransaction",
		                  "personal_sign",
		                  "eth_estimateGas",
		                  
                            "eth_signTypedData"],
		   showQrModal: true,
		   qrModalOptions: {
		     themeMode: "light",
		   },

           rpcMap: {
            1170:uptickUrl,
            117:uptickUrl,
            137:uptickUrl,
            56:uptickUrl,
            42161:uptickUrl
          }
		 });
		 
		  const WalletProvider = new ethers.providers.Web3Provider(provider)
		  provider.on("display_uri", (uri) => {
		    console.log("display_uri", uri);
		    events.$emit('wallet_is_connect',uri)
		  });
		  // chain changed
		  provider.on('chainChanged', (result) => {
		    console.log("chainChanged", result);
		  });
		  // accounts changed
		  provider.on('accountsChanged', (accounts) => {
		    console.log("accountsChanged=============", accounts);
		 	 appState.accounts = accounts[0];
		 	events.$emit('connect',accounts[0])
            // events.$emit('accountsChanged',accounts[0])
                
		  });
		  // session established
		  provider.on('connect', (result) => {
		   console.log("wxl --- connect",result);
		   // appState.connected = true;
		   // appState.accounts = result;
		   //  console.log("connect", appState);
		   //  events.$emit('connect',appState)
		  });
		  // session event - chainChanged/accountsChanged/custom events
		  provider.on('session_event', (result) => {
		    console.log("session_event", result);
		  });
		  provider.on('disconnect',(result) => {
		    console.log("disconnect", result);
		  	  onDisconnect();
		  });
		  return provider;
		 
	 }

export async function connectWallets() {
   console.log("链接")
 // 1. Create a new EthereumProvider instance
 
   // session disconnected from the wallet - this won't be called when the disconnect function is called from the dapp.
 let provider=await initProvider();
await provider.connect();
	 
}


function resetApp() {
    appState.connector = null;
    appState.fetching = false;
    appState.connected = false;
    appState.chainId = chainIdInt;
    appState.showModal = false;
    appState.pendingRequest = false;
    appState.uri = "";
    appState.accounts = [];
    appState.address = "";
    appState.result = null;
    appState.assets = [];

    sessionStorage.removeItem("walletconnect_appstate");
};

async function onConnect(payload) {
    console.log("wxl --- eeee",payload)
    const { chainId, accounts } = payload.params[0];
    const address = accounts[0];

    appState.connected = true;
    appState.chainId = chainId;
    appState.accounts = accounts;
    appState.address = address;
    await getAccountAssets();

    events.$emit("connect", appState);
};

function onDisconnect() {
    resetApp();
    window.eventBus.$emit("disconnect",appState);

    // events.$emit("disconnect", appState);
   
};

export async function killSession(){

    let provider=await initProvider();
    console.log('killSession ------ 3',provider);
	provider.disconnect();
	
    onDisconnect();
}

async function onSessionUpdate(accounts, chainId) {
    const address = accounts[0];
    appState.chainId = chainId;
    appState.accounts = accounts;
    appState.address = address;

    await getAccountAssets();

    events.$emit("session_update", appState);
};

async function getAccountAssets() {
    const { address, chainId } = appState;
    appState.fetching = true;

    try {
        // get account balances
        const assets = await apiGetAccountAssets(address, chainId);

        appState.fetching = false;
        appState.address = assets;

        sessionStorage.setItem("walletconnect_appstate", JSON.stringify(appState));
    } catch (error) {
        console.error(error);
        appState.fetching = false;
    }
};

export async function signPersonalMessage() {
    const { connector, address, chainId } = appState;

    if (!connector) {
        return;
    }
    // test message
    const message = `My email is john@doe.com - ${new Date().toUTCString()}`;

    // encode message (hex)
    const hexMsg = convertUtf8ToHex(message);

    // eth_sign params
    const msgParams = [hexMsg, address];

    try {
        // toggle pending request indicator
        appState.pendingRequest = true;

        // send message
        const result = await connector.signPersonalMessage(msgParams);

        // verify signature
        const hash = hashMessage(message);
        // const valid = await verifySignature(address, result, hash, chainId);

        // format displayed result
        const formattedResult = {
            method: "personal_sign",
            address,
            // valid,
            result,
        };

        // display result
        appState.connector = connector;
        appState.pendingRequest = false;
        appState.result = formattedResult || null;
        return appState;
    } catch (error) {
        console.error(error);
        appState.connector = connector;
        appState.pendingRequest = false;
        appState.result = null;
    }
};


async function getAccountDetail() {

    
    try {
	
	 
	 
	 // 2. Pass the provider to ethers.js
	 const ethersWeb3Provider = new ethers.providers.Web3Provider(provider);
	 
      

        let fromAddress = appState.accounts[0];
        let chainId = appState.chainId;
        

    

        return { fromAddress};
    } catch (error) {
        console.log("WalletConnect getAccountDetail",error);

    }
}

// interface RequestArguments {
//   method: string;
//   params?: unknown[] | object;
// }

// // Send JSON RPC requests
// const result = await provider.request(payload: RequestArguments);

export function getAddresss() {
    const fromAddress = appState.accounts[0];
    return fromAddress;
}

