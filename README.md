# uptick-web3-sdk
 uptick-web3-sdk
uptick web3 SDK 是一个适用与 vue项目的,非常轻松地将用户连接到您的 Dapp 并开始与区块链交互，支持metamask WalletConnect 。

通过SDK 您可以操作 NFT 发布合约，创建资产，转送资产，多种销售模式（普通上架，优惠上架，懒铸造发布，货品卡发布）等。同时，如果您使用uptick api 服务（开发中，请期待）能更容易的做dapp，但是却包含了NFT从创建到销售的完整功能。

##安装SDK

##初始化SDK
在项目入口文件 app.js 初始化SDK

```
import { init as metaMaskInit } from '@xyyz1207/uptick-web3-sdk/src/index';

let chainId=process.env.VUE_APP_ADD_NETWORK_CHAIN_ID;

let rpc=process.env.VUE_APP_ADD_NETWORK_CHAIN_UPC_URL;


let wallet=metaMaskInit(rpc,chainId)
 Vue.prototype.$wallet = wallet.wallet;
Vue.prototype.$chainName = "UPTICK EVM";
```

##方法介绍
获取余额
```

```
Params     | 是否必须     | exapmle
-------- | ----- | -----
address  | true | 0xabc...

##参考demo

##联系我们


https://github.com/reown-com/appkit/tree/main
