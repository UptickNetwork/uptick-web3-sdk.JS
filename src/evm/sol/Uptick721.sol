pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;


import "./ERC721.sol";
import "./Counters.sol";

contract Uptick721 is ERC721 {

    mapping(uint256 =>  address) internal idCreatorMap;
    address[] internal minterBurnList;
    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner,"must be owner");
        _;
    }

    constructor (string memory _name, string memory _symbol) public
    ERC721(_name, _symbol)
    {
        owner = msg.sender;
        minterBurnList.push(owner);
    }

    /**
    * Custom accessor to create a unique token
    */
    function burn(
        uint256 _tokenId
    ) public
    {
        checkAuth();
        super._burn(_tokenId);
    }

    function addAuth(address minter) public onlyOwner{
        minterBurnList.push(minter);
    }

    function delAuth(address minter) public onlyOwner{

        uint256 len = minterBurnList.length;
        for(uint256 i = 0 ;i < len ;i ++){
            if(minterBurnList[i] == minter){
                minterBurnList[i] = minterBurnList[len - 1];
                minterBurnList.pop();
            }
        }


    }

    /**
    * Custom accessor to create a unique token
    */
    function mint(
        address _to,
        uint256 _tokenId,
        string memory _tokenURI
    ) public
    {

        checkAuth();
        super._mint(_to, _tokenId);
        super._setTokenURI(_tokenId, _tokenURI);
        idCreatorMap[_tokenId] = _to;
    }

    function getCreator(uint256 _tokenId) external view returns(address){
        return idCreatorMap[_tokenId];
    }

    /**
    * Custom accessor to create a unique token
    */
    function mintBatch(
        address[] memory _to,
        uint256[] memory _tokenIds,
        string[] memory _tokenURI
    ) public
    {
        checkAuth();

        uint256 batchLen = _to.length;

        for(uint256 i = 0 ;i < batchLen ;i ++){
            super._mint(_to[i], _tokenIds[i]);
            super._setTokenURI(_tokenIds[i], _tokenURI[i]);
            idCreatorMap[_tokenIds[i]] = _to[i];
        }
    }

    function exists(uint256 _tokenId) public view returns(bool) {
        return super._exists(_tokenId);
    }


    function checkAuth() internal view{

        uint256 len = minterBurnList.length;
        bool isExist = false;
        for(uint256 i = 0 ;i < len ;i ++ ){
            if(msg.sender == minterBurnList[i]){
                isExist = true;
                break;
            }
        }
        require(isExist,"do not have the right to mint or burn");
    }
}