pragma solidity 0.6.4;


import "./Ownable.sol";
import "./IERC1155.sol";
import "./SafeMath.sol";
import "./Address.sol";
import "./ERC165.sol";
import "./ERC1155Holder.sol";


/**
 * @dev 交易托管合约 .
 */
contract ERC1155Platform is
Ownable, ERC165, ERC1155Holder
{

    //加减乘除计算库
    using SafeMath for uint256;

    using Address for address;
    // 1155合约地址
    address public token1155;

    address public platformAddress;
    //收取费用
    uint256 public platformExpenses;

    uint256 public creatorExpenses;

    uint256 public onSaleFee;



    //删除授权信息事件
    event RevokeApproveSingle (
        address assetAddress,
        address _owner,
        uint256 _tokenId,
        uint256 _amount,
        uint256 _price,
        bytes _data
    );

    event RevokeApproveBatch (
        address assetAddress,
        address _owner,
        uint256[] _tokenId,
        uint256[] _amount,
        uint256[] _price,
        bytes _data
    );

    //交易事件
    event TransferSingle  (
        address assetAddress,
        address _from,
        address _to,
        uint256 _tokenId,
        uint256 _amount,
        uint256 _price,
        bytes _data
    );
    event TransferBatch   (
        address assetAddress,
        address _from,
        address _to,
        uint256[] _tokenId,
        uint256[] _amount,
        uint256[] _price,
        bytes _data
    );

    //保存授权信息事件
    event SaveApproveSingle (
        address assetAddress,
        address _owner,
        uint256 _tokenId,
        uint256 _amount,
        uint256 _price,
        bytes _data
    );
    event SaveApproveBatch  (
        address assetAddress,
        address _owner,
        uint256[] _tokenId,
        uint256[] _amount,
        uint256[] _price,
        bytes _data
    );



    // 所有转卖资产列表  tokenid > address > price > amount
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) internal allAsset;
    // 所有资产价格列表  tokenid > price >amount
    mapping(uint256 => mapping(uint256 => uint256)) internal allAssetPrice;
    //上架资产数量 address > tokenid > amount
    mapping(address => mapping(uint256 => uint256)) internal assetCount;


    // 构造函数
    constructor(
        address _token1155,
        address _platformAddress,
        uint256 _platformExpenses,
        uint256 _creatorExpenses,
        uint256 _onSaleFee
    )
    public
    {

        require(token1155.isContract() == true);
        token1155 = _token1155;
        platformAddress = _platformAddress;
        platformExpenses = _platformExpenses;
        onSaleFee = _onSaleFee;
        creatorExpenses = _creatorExpenses;

    }


    function setPlatformAddress(
        address _platformAddress
    )
    onlyOwner
    public
    {
        require(_platformAddress != address(0));

        platformAddress = _platformAddress;
    }


    function setPlatformExpensesExpenses(
        uint256 _platformExpenses
    )
    onlyOwner
    public
    {
        platformExpenses = _platformExpenses;
    }


    function setOnSaleFee(
        uint256 _onSaleFee
    )
    onlyOwner
    public
    {
        onSaleFee = _onSaleFee;
    }


    function setCreatorExpenses(
        uint256 _creatorExpenses
    )
    onlyOwner
    public
    {
        creatorExpenses = _creatorExpenses;
    }

    /**
     * @dev 以数组方式保存授权信息
     * @param _tokenArr   资产编号数组
     * @param _prices     每份资产售卖价值
     * @param _amounts     每份资产售卖价值
     */
    function saveBatchApprove(
        uint256[]  calldata _tokenArr,
        uint256[]  calldata _prices,
        uint256[]  calldata _amounts,
        bytes calldata data
    )
    external
    payable
    {
        address owner = msg.sender;
        bool isAll = IERC1155(token1155).isApprovedForAll(owner, address(this));
        require(isAll, "invalid approve address");
        uint256 total = 0;
        for (uint256 i = 0; i < _tokenArr.length; i ++) {
            uint256 _tokenId = _tokenArr[i];
            uint256 _price = _prices[i];
            uint256 _amount = _amounts[i];
            total = total.add(_amount);
            _saveApprove(owner, _tokenId, _price, _amount);

        }
        IERC1155(token1155).safeBatchTransferFrom(owner, address(this), _tokenArr, _amounts, data);

        if (onSaleFee > 0) {
            uint256 totalFee = onSaleFee.mul(total);
            address payable feeAddress = payable(platformAddress);
            feeAddress.transfer(totalFee);
        }
        emit SaveApproveBatch(token1155, owner, _tokenArr, _amounts, _prices, data);

    }


    /**
     * @dev  保存用户授权信息，资产上线
     * @param _tokenId   资产编号
     * @param _price     资产售卖价值
     */
    function saveApprove(
        uint256 _tokenId,
        uint256 _price,
        uint256 _amount,
        bytes calldata data
    )
    external
    payable
    {
        address _owner = msg.sender;
        bool isAll = IERC1155(token1155).isApprovedForAll(_owner, address(this));
        require(isAll, "invalid approve address");

        _saveApprove(_owner, _tokenId, _price, _amount);
        IERC1155(token1155).safeTransferFrom(_owner, address(this), _tokenId, _amount, data);
        if (onSaleFee > 0) {
            uint256 totalFee = onSaleFee.mul(_amount);
            address payable feeAddress = payable(platformAddress);
            feeAddress.transfer(totalFee);
        }
        emit SaveApproveSingle(token1155, _owner, _tokenId, _amount, _price, data);
    }






    /**
     * @dev 批量删除授权信息
     * @param _tokenArr    资产编号数组
     */
    function revokeBatchApprove(
        uint256[] calldata _tokenArr,
        uint256[]  calldata _prices,
        uint256[]  calldata _amounts,
        bytes calldata data
    )
    external
    {
        address _owner = msg.sender;
        for (uint256 i = 0; i < _tokenArr.length; i ++) {
            uint256 _tokenId = _tokenArr[i];
            uint256 _price = _prices[i];
            uint256 _amount = _amounts[i];
            _revokeApprove(_tokenId, _price, _amount);

        }
        IERC1155(token1155).safeBatchTransferFrom(address(this), msg.sender, _tokenArr, _amounts, data);

        emit RevokeApproveBatch(token1155, _owner, _tokenArr, _amounts, _prices, data);
    }


    /**
    * @dev 删除授权信息
    * @param _tokenId    资产编号
    */
    function revokeApprove(
        uint256 _tokenId,
        uint256 _price,
        uint256 _amount,
        bytes calldata data

    )
    external

    {
        address _owner = msg.sender;
        _revokeApprove(_tokenId, _price, _amount);
        IERC1155(token1155).safeTransferFrom(address(this), msg.sender, _tokenId, _amount, data);
        emit RevokeApproveSingle(token1155, _owner, _tokenId, _amount, _price, data);
    }


    /**
    * @dev 删除授权信息
    * @param _tokenId    资产编号
     */
    function _revokeApprove(
        uint256 _tokenId,
        uint256 _price,
        uint256 _amount
    )
    internal
    {
        address _owner = msg.sender;
        require(allAssetPrice[_tokenId][_price] > 0, "asset shoud exist");
        require(allAsset[_tokenId][_owner][_price] > 0, "asset shoud exist");

        _deleteApprove(_owner, _tokenId, _price, _amount);

    }




    /**
    * @dev 根据传入信息进行匹配，完成 IERC1155 token 代币与eth的交换
    * @param _tokenArr       资产编号数组
    * @param _prices     总资产价格
    * @param _to             资产接收者地址
    */
    function batchTransfer(
        address _owner,
        uint256[] memory _tokenArr,
        uint256[] memory _prices,
        uint256[] memory _amounts,
        address _to,
        bytes memory data
    )
    public
    payable
    returns (bool)
    {


        require(_to != address(0), "to address error");
        _payOrder(_owner, msg.value, _tokenArr, _prices, _amounts);
        IERC1155(token1155).safeBatchTransferFrom(address(this), _to, _tokenArr, _amounts, data);

        if (msg.value > 0) {

            address creatorAddr = address(0);
            uint256 totalToFee = 0;
            uint256 totalToCreator = 0;

            for (uint256 index = 0; index < _tokenArr.length; index++) {
                uint256 tid = _tokenArr[index];
                uint256 onePrice = _prices[index].mul(_amounts[index]);

                if (onePrice > 0) {
                    address creator = IERC1155(token1155).getCreator(tid);
                    if (creatorAddr == address(0)) {
                        creatorAddr = creator;
                    } else {
                        require(creatorAddr == creator, "tokenid creator error");
                        creatorAddr = creator;
                    }
                    if (platformExpenses > 0) {
                        totalToFee = totalToFee.add(onePrice.div(1000).mul(platformExpenses));
                    }
                    if (creatorExpenses > 0) {
                        totalToCreator = totalToCreator.add(onePrice.div(1000).mul(creatorExpenses));
                    }


                }

            }

            if (totalToCreator > 0) {
                address payable creatorAddrPay = payable(creatorAddr);
                creatorAddrPay.transfer(totalToCreator);
            }

            if (totalToFee > 0) {
                address payable feePay = payable(platformAddress);
                feePay.transfer(totalToFee);
            }
            uint256 totalToOwner = msg.value.sub(totalToCreator).sub(totalToFee);
            address payable totalToOwnerPay = payable(_owner);
            totalToOwnerPay.transfer(totalToOwner);
        }

        emit TransferBatch(token1155, _owner, _to, _tokenArr, _amounts, _prices, data);
        return true;

    }




    /**
    * @dev 根据传入信息进行匹配，完成 IERC1155 token 代币与eth的交换
    * @param _tokenId        资产编号
    * @param _price          资产价格
    */
    function transfer(
        address _owner,
        uint256 _tokenId,
        uint256 _price,
        uint256 _amount,
        address _to,
        bytes calldata data
    )
    external
    payable
    returns (bool)
    {

        require(_to != address(0), "to address error");

        uint256 [] memory tokenids = new uint256 [](1);
        tokenids[0] = _tokenId;
        uint256 [] memory prices = new uint256 [](1);
        prices[0] = _price;
        uint256 [] memory amounts = new uint256 [](1);
        amounts[0] = _amount;
        _payOrder(_owner, msg.value, tokenids, prices, amounts);


        if (msg.value > 0) {
            uint256 platformValue = 0;
            uint256 creatorrValue = 0;
            if (platformExpenses > 0) {
                platformValue = msg.value.div(1000).mul(platformExpenses);
            }
            if (creatorExpenses > 0) {
                creatorrValue = msg.value.div(1000).mul(creatorExpenses);
            }
            uint256 ownerValue = msg.value.sub(platformValue).sub(creatorrValue);
            if (platformValue > 0) {
                address payable _fee = payable(platformAddress);
                _fee.transfer(platformValue);
            }
            if (ownerValue > 0) {
                address payable pay = payable(_owner);
                pay.transfer(ownerValue);
            }

            if (creatorrValue > 0) {
                address creatorAddress = IERC1155(token1155).getCreator(_tokenId);
                if (creatorAddress != address(0)) {
                    address payable creatorPay = payable(creatorAddress);
                    creatorPay.transfer(creatorrValue);
                }

            }

        }


        IERC1155(token1155).safeTransferFrom(address(this), _to, _tokenId, _amount, data);
        emit TransferSingle(token1155, _owner, _to, _tokenId, _amount, _price, data);
        return true;
    }




    /**
    * @dev  订单支付
    * @param _tokenIds          资产id
    * @param _prices        资产编号
    * @param _amounts          资产价格
    */
    function _payOrder(
        address _owner,
        uint256 _payValue,
        uint256[] memory _tokenIds,
        uint256[]  memory _prices,
        uint256[] memory _amounts
    )
    internal
    returns (bool)
    {


        uint256 pay = 0;

        for (uint256 i = 0; i < _tokenIds.length; i ++) {
            uint256 _tokenId = _tokenIds[i];
            uint256 _price = _prices[i];
            uint256 _amount = _amounts[i];
            uint256 assetAmount = allAsset[_tokenId][_owner][_price];
            require(assetAmount > 0, "Insufficient inventory");
            uint256 totalFee = _amount.mul(_price);
            pay = pay.add(totalFee);

            _deleteApprove(_owner, _tokenId, _price, _amount);


        }

        require(_payValue == pay, "pay error");
        return true;

    }






    /**
     * @dev 保存授权信息
     * @param _amount       资产数量
     * @param _tokenId      资产编号
     * @param _owner        资产所有者
     * @param _price        资产售卖价值
     */
    function _saveApprove(
        address _owner,
        uint256 _tokenId,
        uint256 _price,
        uint256 _amount
    )
    internal
    {

        require(_price >= 0, "value could more than 0");
        require(_tokenId > 0, "tokenId should more than 0");
        require(_amount > 0, "amount should more than 0");


        uint256 totalPriceAmount = allAssetPrice[_tokenId][_price];
        totalPriceAmount = totalPriceAmount.add(_amount);
        allAssetPrice[_tokenId][_price] = totalPriceAmount;


        uint256 totalAssetAmount = allAsset[_tokenId][_owner][_price];
        totalAssetAmount = totalAssetAmount.add(_amount);
        allAsset[_tokenId][_owner][_price] = totalAssetAmount;


        incAssetCnt(_owner, _tokenId, _amount);
    }




    /**
    * @dev 删除保存的授权信息
    * @param _owner     资产所有者
    * @param _tokenId     资产编号
    */

    function _deleteApprove(
        address _owner,
        uint256 _tokenId,
        uint256 _price,
        uint256 _amount
    )
    internal
    {


        uint256 totalPriceAmount = allAssetPrice[_tokenId][_price];
        totalPriceAmount = totalPriceAmount.sub(_amount);
        allAssetPrice[_tokenId][_price] = totalPriceAmount;

        uint256 totalAssetAmount = allAsset[_tokenId][_owner][_price];
        totalAssetAmount = totalAssetAmount.sub(_amount);
        allAsset[_tokenId][_owner][_price] = totalAssetAmount;

        decAssetCnt(_owner, _tokenId, _amount);
    }






    /**
    * @dev 增加用户的资产计数
    * @param _owner     用户地址
    */
    function incAssetCnt(
        address _owner,
        uint256 _tokenid,
        uint256 _amount
    )
    internal
    {
        uint256 toal = assetCount[_owner][_tokenid];
        toal = toal.add(_amount);
        assetCount[_owner][_tokenid] = toal;
    }

    /**
    * @dev 减少用户的资产计数
    * @param _owner     用户地址
    */
    function decAssetCnt(
        address _owner,
        uint256 _tokenid,
        uint256 _amount
    )
    internal
    {
        require(assetCount[_owner][_tokenid] > 0);
        uint256 toal = assetCount[_owner][_tokenid];
        toal = toal.sub(_amount);
        assetCount[_owner][_tokenid] = toal;
    }


}