# uptick-web3-sdk

#### Essential Web3 functions rolled into a single package
Uptick Web3 SDK is a core element of these services. It consolidates essential Web3 functions into a single package, enabling developers to efficiently create business-specific applications using Uptick infrastructure. This approach allows developers to focus on business logic without needing to manage general-purpose modules or possess deep blockchain expertise.

#### Supports Vue Development Framework with React Native SDK coming soon
Uptick Web3 SDK is a JavaScript SDK that currently supports the Vue development framework. React and React Native developers can refer to the contract files and calling methods within the SDK to assemble the signature manually. The React Native version of the SDK will be launched soon. SDKs for other programming languages are also in development, so stay tuned.

#### What Can Developers Do with the Uptick Web3 SDK？
The Uptick Web3 SDK is a powerful tool for Vue projects, simplifying user connections to decentralized applications (DApps) and streamlining blockchain interactions. It supports both MetaMask and WalletConnect logins, making it ideal for applications that require user authentication and blockchain transactions. 

This enables traditional businesses to integrate smoothly with Web3, and combines essential blockchain operations all into one package. The SDK saves time and resources, and empowers developers to build applications that integrate business logic without unnecessary complexity.

The SDK offers a range of NFT and RWA operations, including:
- Deploying smart contracts
- Minting NFTs/RWAs
- Transferring assets
- Supporting multiple sales modes, such as fixed-price listings, discounted sales, timed auctions, and lazy mints

These features allow developers to create decentralized wallets, launch NFT/RWA trading markets with a wide range of sales models, build membership systems, and engage with the evolving RWA ecosystem.

#### What's next?
This SDK release marks the first step in making Uptick’s full range of services available to developers. 

Next, we’ll deliver Uptick Services via cloud APIs, rolling out the service layer through iterative releases to simplify Web3 business application development for traditional developers.



## Installing the SDK

To install with Yarn, run:
```
yarn add @uptickjs/uptick-web3-sdk
```
To install with NPM, run:
```
npm install @uptickjs/uptick-web3-sdk
```

## Initialize SDK

Initialize SDK in the project entry file app.js

```
import { init as metaMaskInit } from '@uptickjs/uptick-web3-sdk/src/index';

let chainId=process.env.VUE_APP_ADD_NETWORK_CHAIN_ID;

let rpc=process.env.VUE_APP_ADD_NETWORK_CHAIN_UPC_URL;


let wallet=metaMaskInit(rpc,chainId)
Vue.prototype.$wallet = wallet.wallet;
```

## Initialize walletConnect

```
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";

export async function initProvider(){
		 const provider = await EthereumProvider.init({
		   projectId,
		   optionalChains: [chainIdInt], //current chainId
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
            117:uptickUrl,
        
          }
		 });
		 provider.chainId=chainIdInt;
		const WalletProvider = new ethers.providers.Web3Provider(provider)
		  provider.on("display_uri", (uri) => {
		   		    events.$emit('wallet_is_connect',uri)
		  });
		  // chain changed
		  provider.on('chainChanged', (result) => {
		   
		  });
		  // accounts changed
		  provider.on('accountsChanged', (accounts) => {
		    
                
		  });
		  // session established
		  provider.on('connect', (result) => {
		  let walletparams = {
            connected:true
          }
              localStorage.setItem("walletconnect",JSON.stringify(walletparams) );
		   
		  });
		  
		  provider.on('session_event', (result) => {
		    		  });
		  provider.on('disconnect',(result) => {
		  		  });
		
		  window.walletProvider=provider;
		  return provider;
		 
	 }
	 

```

## Method introduction

#### Get user information, get the currently linked wallet address
```
getAccountInfo()
```
#### Convert Evm address to Uptick address
```
getUptickAddress()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
evmAddress | String | User address

#### Get balance
```
getTokenBalance()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
owner | String | User address

#### Create a contract
```
deploy()
```
Params | Parameter type | Require | Parameter description
:---: | :---: | :---: | :---:
nftType | String | true| nft type
name | String | true | contract name
metadataUrl | String | false | metadata information
lazySignAddress | String | false | signature address, used to verify signature when minting assets

#### Mint NFTs
```
mintNft()
```
Params | Parameter type | Require | Parameter description
:---: | :---: | :---: | :---:
nftType | String | true| nft type
toAddress | String | true | receiving address
nftId | String | true | nftId
metaDataUrl | String | true | metadata information
royaltyPercentage | String | true | Share ratio
amountValue | Number | false | Quantity

#### Lazy mint NFTs
```
lazyNftMint()
```
Params | Parameter type | Require | Parameter description
:---: | :---: | :---: | :---:
toAddress | String | true | Receiving address
nftId | String | true | nftId
metaDataUrl | String | true | Metadata information
payAddress | String | true | Payment address of token contract
payAmount | Number | true | Payment amount
creatorFee | Number | true | Payment fee
signature | String | true | Signature information

####  Set the contract address
```
setContractAddress()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
nftType | String | nft type
platformAddress | String | transaction contract address


#### NFT Transfer
```
transferFrom()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
toAddress | String | receiving address
nftId | String | nftId
amountValue | Number | transfer amount

#### NFT Listing
```
onSale()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
nftAddress | String | nft contract address
nftid | String | nftid
value | String | Listing price
fee | Number | Handling fee
amount | Number | Listing quantity
payAddress | String | The token contract address for selling your NFT 

#### NFT Listing in Batches
```
onSaleBatch()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
nftAddress | String | nft contract address
nftids | Array | nftid
value | Array | Listing price
fee | Number | Handling fee
amounts | Array | Listing quantity
payAddress | Array | The token contract address for selling your NFT

#### Discounted Sales
```
couponOnSale()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
nftAddress | String | nft contract address
nftid | String | nftid
value | String | Listing price
couponCode | String | Discount code
reducedPrice | Number | Discount price
fee | Number | Handling fee
amount | Number | Listing quantity
payAddress | String | The token contract address for selling your NFT

#### Timed-auction
```
auction_onsale()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
nftAddress | String | nft contract address
nftid | String | nftid
startTimeStamp | String | auction start time
endTimeStamp | String | auction end time
startBid | String | starting price
fixPrice | String | fixed price
ReserveBid | String | reserve price
fee | Number | handling fee
amount | Number | listing quantity
payAddress | String | The token contract address for selling your NFT

#### Place a bid in auction
```
auction_placeBid()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
nftAddress | String | nft contract address
nftid | String | nftid
fixPrice | Number | Bidding price
payAddress | String | The token contract address for bidding
owner | String | Bidder address

#### NFT Delisting
```
offSale()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
nftAddress | String | nft contract address
nftid | String | nftid

#### NFT Delisting in Batches
```
offSaleBatch()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType | String | nft type
nftAddress | String | nft contract address
nftids | Array | nftid

#### Withdraw an auction
```
auction_end()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
nftAddress | String | nft contract address
nftid | String | nftid
owner | String | ERC1155 type, requires the address of the owner

#### NFT Purchasing
```
placeOrder()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
nftAddress | String | nft contract address
nftid | String | nftid
toAddress | String | buyer address
price | Number | purchase price
marketType | String | purchase type
couponCode | String | coupon code, fill in ‘0’ if none
couponLink | String | couponLink, fill in ‘0’ if none
payAddress | String | The token contract address for purchasing

#### Place an Offer
```
createOffer()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
offerNumber | String | Offer number (random number)
nftAddress | String | nft contract address
nftid | String | nftid
payAddress | String | The token contract address for offer
payAmount | Number | Offer amount
expiry | String | Offer validity period
fee | Number | Handling fee

#### Withdraw an Offer
```
cancelOffer()
```
Params | Parameter type | Parameter description
:---: | :---: | :---:
nftType | String | nft type
offerNumber | String | Offer number (random number)

#### Accept an Offer
```
acceptOffer()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType | String | nft type
offerNumber | String | offer number (random number)
nftAddress | String | nft contract address
nftid | String | nftid
offerPlatformAddress | String | offer contract address

#### Authorize cross-chain contracts
```
setBridgeApproval()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType | String | nft type


#### Query cross-chain transfer fees
```
getFeeByChainID()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
tokenIds  | Array | tokenid
chainId  | Number | chainid



#### Support NFT cross-chain transfer, between Uptick with Polygon\Arbitrum\BSC 

```
uptickCrossToEVM()
```
Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
srcChainName | String | Source chain name
destinationChainId | Number | Target chain chainid
toAddress | String | Receiving address
metadate | String | Metadate information
offerPlatformAddress | String | Offer contract address



## Problem Reporting

https://github.com/UptickNetwork/uptick-web3-sdk/issues

