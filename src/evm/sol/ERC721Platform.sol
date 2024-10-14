pragma solidity 0.6.4;


import "./Ownable.sol";
import "./IERC721.sol";
import "./SafeMath.sol";
import "./Address.sol";

/**
 * @dev 交易托管合约 .
 */
contract ERC721Platform is
Ownable
{

    //加减乘除计算库
    using SafeMath for uint256;

    using Address for address;

    address public token721;


    address public platformAddress;

    uint256 public  firstPlatformExpenses;

    uint256 public  firstCreatorExpenses;

    uint256 public  secondPlatformExpenses;

    uint256 public  secondCreatorExpenses;

    uint256 public onSaleFee;

    //删除授权信息事件
    event RevokeApprove (
        address assetAddress,
        address _owner,
        uint256 _tokenId
    );

    //交易事件
    event Transfer (
        address assetAddress,
        address _from,
        address _to,
        uint256 _tokenId,
        uint256 _value
    );

    //保存授权信息事件
    event SaveApprove (
        address assetAddress,
        address _owner,
        uint256 _tokenId,
        uint256 _value
    );



    // 所有转卖资产列表
    mapping(uint256 => address) internal allAsset;
    // 所有资产价格列表
    mapping(uint256 => uint256) internal allAssetPrice;
    //上架资产数量
    mapping(address => uint256) internal assetCount;

    //tokenid转卖次数
    mapping(uint256 => uint256) internal transferCount;



    // 构造函数
    constructor(
        address _token721,
        address _platformAddress
    )
    public
    {

        require(_token721.isContract() == true);
        token721 = _token721;
        platformAddress = _platformAddress;
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


    function setFirstPlatformExpenses(
        uint256 _firstPlatformExpenses
    )
    onlyOwner
    public
    {
        firstPlatformExpenses = _firstPlatformExpenses;
    }


    function setFirstCreatorExpenses(
        uint256 _firstCreatorExpenses
    )
    onlyOwner
    public
    {
        firstCreatorExpenses = _firstCreatorExpenses;
    }


    function setSecondPlatformExpenses(
        uint256 _secondPlatformExpenses
    )
    onlyOwner
    public
    {

        secondPlatformExpenses = _secondPlatformExpenses;
    }


    function setSecondCreatorExpenses(
        uint256 _secondCreatorExpenses
    )
    onlyOwner
    public
    {

        secondCreatorExpenses = _secondCreatorExpenses;
    }


    function setOnSaleFee(
        uint256 _onSaleFee
    )
    onlyOwner
    public
    {
        onSaleFee = _onSaleFee;
    }



    /**
     * @dev 保存授权信息
     * @param _tokenId      资产编号
     * @param _owner        资产所有者
     * @param _value        资产售卖价值
     */
    function _saveApprove(
        address _owner,
        uint256 _tokenId,
        uint256 _value
    )
    internal
    {

        require(_value >= 0, "value could more than 0");
        require(_tokenId > 0, "tokenId should more than 0");

        address approver = IERC721(token721).getApproved(_tokenId);
        bool isAll = IERC721(token721).isApprovedForAll(_owner, address(this));
        require((approver == address(this) || isAll), "invalid approve address");
        require(_owner == msg.sender, "invalid caller");
        IERC721(token721).transferFrom(_owner, address(this), _tokenId);
        allAssetPrice[_tokenId] = _value;
        incAssetCnt(_owner);
        allAsset[_tokenId] = _owner;
        emit SaveApprove(token721, _owner, _tokenId, _value);
    }

    /**
     * @dev 以数组方式保存授权信息
     * @param _owner     资产所有者
     * @param _tokenArr   资产编号数组
     * @param _value     每份资产售卖价值
     */
    function saveApproveWithArray(
        address _owner,
        uint256[] calldata _tokenArr,
        uint256 _value
    )
    external
    payable
    {

        for (uint256 idx = 0; idx < _tokenArr.length; idx++) {
            _saveApprove(_owner, _tokenArr[idx], _value);
        }

        if (onSaleFee > 0) {
            uint256 total = onSaleFee.mul(_tokenArr.length);
            require(total == msg.value, "Insufficient expenses");
            address payable feeAddress = payable(platformAddress);
            feeAddress.transfer(total);
        }

    }


    /**
     * @dev  保存用户授权信息，资产上线
     * @param _owner     资产所有者
     * @param _tokenId   资产编号
     * @param _value     资产售卖价值
     */
    function saveApprove(
        address _owner,
        uint256 _tokenId,
        uint256 _value
    )
    external
    payable
    {
        _saveApprove(_owner, _tokenId, _value);
        if (onSaleFee > 0) {
            uint256 total = onSaleFee.mul(1);
            require(total == msg.value, "Insufficient expenses");
            address payable feeAddress = payable(platformAddress);
            feeAddress.transfer(total);
        }
    }




    /**
     * @dev 获取用户的授权信息
     * @param _tokenId    资产编号
     */
    function getApproveInfo(
        uint256 _tokenId
    )
    external
    view
    returns (address _owner, uint256 _tId, uint256 _value)
    {
        _owner = allAsset[_tokenId];
        _value = allAssetPrice[_tokenId];
        _tId = _tokenId;
    }



    /**
     * @dev 批量删除授权信息
     * @param _tokenArr    资产编号数组
     */
    function revokeApprovesWithArray(
        uint256[] calldata _tokenArr
    )
    external
    {
        for (uint256 idx = 0; idx < _tokenArr.length; idx++) {
            _revokeApprove(_tokenArr[idx]);
        }
    }


    /**
    * @dev 删除授权信息
    * @param _tokenId    资产编号
    */
    function revokeApprove(
        uint256 _tokenId
    )
    external
    {
        _revokeApprove(_tokenId);
    }


    /**
    * @dev 删除授权信息
    * @param _tokenId    资产编号
     */
    function _revokeApprove(
        uint256 _tokenId
    )
    internal
    {

        require(allAssetPrice[_tokenId] >= 0, "asset shoud exist");
        require(allAsset[_tokenId] == msg.sender);
        IERC721(token721).transferFrom(address(this), allAsset[_tokenId], _tokenId);
        _deleteApprove(msg.sender, _tokenId);
        emit RevokeApprove(token721, msg.sender, _tokenId);
    }



    /**
    * @dev 根据传入信息进行匹配，完成 erc721 token 代币与eth的交换
    * @param _owner          资产拥有者地址
    * @param _tokenArr       资产编号数组
    * @param _totalValue     总资产价格
    */
    function transferWithArray(
        address _owner,
        uint256[] calldata _tokenArr,
        uint256 _totalValue
    )
    external
    payable
    returns (bool)
    {

        transferWithArray(_owner, _tokenArr, _totalValue, msg.sender);
        return true;

    }


    /**
    * @dev 根据传入信息进行匹配，完成 erc721 token 代币与eth的交换
    * @param _owner          资产拥有者地址
    * @param _tokenArr       资产编号数组
    * @param _totalValue     总资产价格
    * @param _to             资产接收者地址
    */
    function transferWithArray(
        address _owner,
        uint256[] memory _tokenArr,
        uint256 _totalValue,
        address _to
    )
    public
    payable
    returns (bool)
    {


        require(_to != address(0), "to address error");
        uint256 total = 0;
        for (uint256 idx = 0; idx < _tokenArr.length; idx++) {
            uint256 tid = _tokenArr[idx];

            require(allAsset[tid] != address(0), "asset shoud exist");
            require(allAsset[tid] == _owner);
            require(allAssetPrice[tid] >= 0, "asset shoud exist");
            total = total.add(allAssetPrice[tid]);

        }

        require(_totalValue == msg.value, "no enough value");
        require(_totalValue == total, "no enough value");
        _payOrder(_owner, _totalValue, _tokenArr);


        for (uint256 idxi = 0; idxi < _tokenArr.length; idxi++) {
            uint256 tidi = _tokenArr[idxi];
            _transferNFT(_owner, _to, tidi);
        }


        return true;

    }


    /**
    * @dev 根据传入信息进行匹配，完成 erc721 token 代币与eth的交换
    * @param _owner          资产拥有者地址
    * @param _tokenId        资产编号
    * @param _value          资产价格
    */
    function transfer(
        address _owner,
        uint256 _tokenId,
        uint256 _value
    )
    external
    payable
    returns (bool)
    {


        require(allAsset[_tokenId] != address(0), "asset shoud exist");
        require(allAsset[_tokenId] == _owner);
        require(allAssetPrice[_tokenId] >= 0, "asset shoud exist");
        require(_value == msg.value, "pay error");
        require(_value == allAssetPrice[_tokenId], "value  error");

        uint256 [] memory tokenids = new uint256 [](1);
        tokenids[0] = _tokenId;
        _payOrder(_owner, _value, tokenids);
        _transferNFT(_owner, msg.sender, _tokenId);
        return true;
    }





    /**
   * @dev  转移nftoken
   * @param _tokenIds          资产id
   * @param _owner        资产当前拥有者地址
   * @param _to          资产接收者地址
   */
    function _transferNFT(
        address _owner,
        address _to,
        uint256 _tokenIds
    )
    internal
    returns (bool)
    {


        uint256 onePrice = allAssetPrice[_tokenIds];
        IERC721(token721).transferFrom(address(this), _to, _tokenIds);
        emit Transfer(token721, _owner, _to, _tokenIds, onePrice);
        _deleteApprove(_owner, _tokenIds);
        return true;
    }



    /**
    * @dev  订单支付
    * @param _tokenIds          资产id
    * @param _payValue        资产编号
    * @param _payAddress          资产价格
    */
    function _payOrder(
        address _payAddress,
        uint256 _payValue,
        uint256[] memory _tokenIds
    )
    internal
    returns (bool)
    {


        if (_payValue > 0) {


            address creatorAddr = address(0);
            uint256 totalToFee = 0;
            uint256 totalToCreator = 0;

            for (uint256 index = 0; index < _tokenIds.length; index++) {
                uint256 tid = _tokenIds[index];
                uint256 onePrice = allAssetPrice[tid];

                if (onePrice > 0) {
                    address creator = IERC721(token721).getCreator(tid);
                    if (creatorAddr == address(0)) {
                        creatorAddr = creator;
                    } else {
                        require(creatorAddr == creator, "tokenid creator error");
                        creatorAddr = creator;
                    }


                    if (transferCount[tid] > 0) {
                        if (secondPlatformExpenses > 0) {
                            totalToFee = totalToFee.add(onePrice.div(1000).mul(secondPlatformExpenses));
                        }
                        if (secondCreatorExpenses > 0) {
                            totalToCreator = totalToCreator.add(onePrice.div(1000).mul(secondCreatorExpenses));
                        }


                    } else {
                        if (firstPlatformExpenses > 0) {
                            totalToFee = totalToFee.add(onePrice.div(1000).mul(firstPlatformExpenses));
                        }
                        if (firstCreatorExpenses > 0) {
                            totalToCreator = totalToCreator.add(onePrice.div(1000).mul(firstCreatorExpenses));
                        }


                    }
                }


                transferCount[tid] = transferCount[tid].add(1);
            }


            if (totalToCreator > 0) {
                address payable creatorAddrPay = payable(creatorAddr);
                creatorAddrPay.transfer(totalToCreator);
            }

            if (totalToFee > 0) {
                address payable feePay = payable(platformAddress);
                feePay.transfer(totalToFee);
            }


            address payable totalToOwnerPay = payable(_payAddress);
            uint256 totalToOwner = _payValue.sub(totalToCreator).sub(totalToFee);
            totalToOwnerPay.transfer(totalToOwner);


        }

        return true;

    }







    /**
    * @dev 删除保存的授权信息
    * @param _owner     资产所有者
    * @param _tokenId     资产编号
    */

    function _deleteApprove(
        address _owner,
        uint256 _tokenId
    )
    internal
    {
        delete allAssetPrice[_tokenId];
        delete allAsset[_tokenId];
        decAssetCnt(_owner);
    }


    /**
    * @dev 获取上架资产数量
    * @param _owner     用户地址
    */
    function getAssetCnt(
        address _owner
    )
    external
    view
    returns (uint256 _cnt)
    {
        _cnt = assetCount[_owner];
    }

    /**
    * @dev 增加用户的资产计数
    * @param _owner     用户地址
    */
    function incAssetCnt(
        address _owner
    )
    internal
    {
        assetCount[_owner] = assetCount[_owner].add(1);
    }

    /**
    * @dev 减少用户的资产计数
    * @param _owner     用户地址
    */
    function decAssetCnt(
        address _owner
    )
    internal
    {
        require(assetCount[_owner] > 0);
        assetCount[_owner] = assetCount[_owner].sub(1);
    }


}