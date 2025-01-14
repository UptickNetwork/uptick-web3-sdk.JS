# uptick-web3-sdk

uptick web3 SDK 是一个适用于 Vue 项目的工具，可以简化用户连接到您的去中心化应用（Dapp）的过程，并实现与区块链的交互。这个 SDK 支持 Metamask 和 WalletConnect
登录，这对于需要用户身份验证和区块链交易的应用来说是非常有用的。

通过SDK，开发者可以实现对 NFT的一系列操作 如：发布合约，创建资产，转送资产，支持多种销售模式（普通上架，优惠上架，懒铸造发布，货品卡发布）等。同时，如果您使用uptick api
服务（开发中，请期待）能够进一步简化的开发Dapp的开发过程，API服务支持NFT从创建到市场销售的完整功能。

## 安装SDK

To install with Yarn, run:

```
yarn add @uptickjs/uptick-web3-sdk
```

To install with NPM, run:

```
npm install @uptickjs/uptick-web3-sdk
```

## 初始化SDK

在项目入口文件 app.js 初始化SDK

```
import { init as metaMaskInit } from '@uptickjs/uptick-web3-sdk/src/index';

let chainId=process.env.VUE_APP_ADD_NETWORK_CHAIN_ID;

let rpc=process.env.VUE_APP_ADD_NETWORK_CHAIN_UPC_URL;


let wallet=metaMaskInit(rpc,chainId)
Vue.prototype.$wallet = wallet.wallet;
```

## 初始化walletConnect

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
            1170:uptickUrl,
        
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

## 方法介绍

获取用户信息,获得当前链接的钱包地址

```
getAccountInfo()
```

Evm地址转换为Uptick地址

```
getUptickAddress()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
evmAddress  | String | 用户地址

获取余额

```
getTokenBalance()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
owner  | String | 用户地址

创建合约

```
deploy()
```

Params     |  Parameter type     |  Require  | Parameter description
:---: | :---: | :---: | :---:
nftType  | String | true| nft类型
name  | String | true | 合约名字
metadataUrl  | String | false | metadata信息
lazySignAddress  | String | false | 签名地址，用于mint资产时验证签名

创建资产

```
mintNft()
```

Params     |  Parameter type     |  Require  | Parameter description
:---: | :---: | :---: | :---:
nftType  | String | true| nft类型
toAddress  | String | true | 接收地址
nftId  | String | true | nftId
metaDataUrl  | String | true | metadata信息
royaltyPercentage  | String | true | 分成比例
amountValue  | Number | false | 数量

懒铸造创建资产

```
lazyNftMint()
```

Params     |  Parameter type     |  Require  | Parameter description
:---: | :---: | :---: | :---:
toAddress  | String | true | 接收地址
nftId  | String | true | nftId
metaDataUrl  | String | true | metadata信息
payAddress  | String | true | 支付token合约地址
payAmount  | Number | true | 支付金额
creatorFee  | Number | true | 支付手续费
signature  | String | true | 签名信息

设置合约地址

```
setContractAddress()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---:
nftType  | String | nft类型
platformAddress  | String | 交易合约地址

资产转送

```
transferFrom()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
toAddress  | String | 接收地址
nftId  | String | nftId
amountValue  | Number  | 转送数量

资产普通销售上架

```
onSale()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
nftAddress  | String | nft合约地址
nftid  | String | nftid
value  | String | 上架价格
fee  | Number | 手续费
amount  | Number  | 上架数量
payAddress  | String  | 上架币种合约地址

资产普通销售批量上架

```
onSaleBatch()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
nftAddress  | String | nft合约地址
nftids  | Array | nftid
value  | Array | 上架价格
fee  | Number | 手续费
amounts  | Array  | 上架数量
payAddress  | Array  | 上架币种合约地址

资产优惠销售上架

```
couponOnSale()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
nftAddress  | String | nft合约地址
nftid  | String | nftid
value  | String | 上架价格
couponCode  | String | 优惠码
reducedPrice | Number | 优惠价格
fee  | Number | 手续费
amount  | Number  | 上架数量
payAddress  | String  | 上架币种合约地址

资产拍卖上架

```
auction_onsale()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
nftAddress  | String | nft合约地址
nftid  | String | nftid
startTimeStamp  | String | 拍卖开始时间
endTimeStamp  | String | 拍卖结束时间
startBid  | String | 起拍价
fixPrice  | String | 一口价
ReserveBid  | String | 保底价
fee  | Number | 手续费
amount  | Number  | 上架数量
payAddress  | String  | 上架币种合约地址

拍卖竞价

```
auction_placeBid()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
nftAddress  | String | nft合约地址
nftid  | String | nftid
fixPrice  | Number | 竞拍价格
payAddress  | String  | 支付币种合约地址
owner  | String  | 竞拍者地址

资产下架

```
offSale()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
nftAddress  | String | nft合约地址
nftid  | String | nftid

资产批量下架

```
offSaleBatch()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
nftAddress  | String | nft合约地址
nftids  | Array | nftid

拍卖下架

```
auction_end()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
nftAddress  | String | nft合约地址
nftid  | String | nftid
owner  | String  | ERC1155类型，需要上架者地址

购买资产

```
placeOrder()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
nftAddress  | String | nft合约地址
nftid  | String | nftid
toAddress  | String  | 购买者地址
price  | Number  | 购买价格
marketType  | String  | 购买类型
couponCode  | String  | 优惠码，没有就填‘0’
couponLink  | String  | couponLink，没有就填‘0’
payAddress  | String  | 支付币种合约地址

出价

```
createOffer()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
offerNumber  | String | 出价号码(随机数)
nftAddress  | String | nft合约地址
nftid  | String | nftid
payAddress  | String | 支付币种合约地址
payAmount  | Number | 出价金额
expiry | String | 出价有效期
fee  | Number | 手续费

取消出价

```
cancelOffer()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
offerNumber  | String | 出价号码(随机数)

接受出价

```
acceptOffer()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型
offerNumber  | String | 出价号码(随机数)
nftAddress  | String | nft合约地址
nftid  | String | nftid
offerPlatformAddress  | String | 出价合约地址

授权跨链合约

```
setBridgeApproval()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
nftType  | String | nft类型

查询跨链手续费

```
getFeeByChainID()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
tokenIds  | Array | tokenid
chainId  | Number | 链chainid

资产跨链，支持Uptick\Polygon\Arbitrum\BSC

```
uptickCrossToEVM()
```

Params     |  Parameter type  | Parameter description
:---: | :---: | :---: 
srcChainName  | String | 来源链名称
destinationChainId  | Number | 目标链chainid
toAddress  | String | 接受地址
metadate  | String | metadate信息
offerPlatformAddress  | String | 出价合约地址

## example

## issues报告

https://github.com/UptickNetwork/uptick-web3-sdk/issues
