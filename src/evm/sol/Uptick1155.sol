pragma solidity 0.6.4;
pragma experimental ABIEncoderV2;
import "./ERC1155.sol";

contract Uptick1155 is ERC1155{


    // Token name
    string private nftName;
    // Token symbol
    string private symbol;
    mapping(uint256 =>  address) internal idCreatorMap;

    address[] internal minterBurnList;
    address owner;

    modifier onlyOwner() {
        require(msg.sender == owner,"must be owner");
        _;
    }

    constructor (string memory _nftName, string memory _symbol, string memory _uri) public
    ERC1155(_uri)
    {
        nftName = _nftName;
        symbol = _symbol;
        owner = msg.sender;
        minterBurnList.push(owner);
    }


    //function _mint(address account, uint256 id, uint256 amount, bytes memory data) internal virtual {
    /**
    * Custom accessor to create a unique token
    */
    function mint(
        address _to,
        uint256 _tokenId,
        uint256 _amount,
        bytes memory _data
    ) public
    {
        checkAuth();

        super._mint(_to, _tokenId,_amount,_data);
        idCreatorMap[_tokenId] = _to;
    }

    //function _mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal virtual {
    function mintBatch(
        address _to,
        uint256[] memory _tokenIds,
        uint256[] memory _amounts,
        bytes memory _data
    ) public
    {
        checkAuth();

        super._mintBatch(_to, _tokenIds,_amounts,_data);
        uint256 tokenLen = _tokenIds.length;
        for(uint i = 0 ;i < tokenLen ;i ++){
            idCreatorMap[_tokenIds[i]] = _to;
        }

    }

    /**
     * @dev See {IERC1155Metadata-name}.
     */
    function name() public view returns (string memory) {
        return nftName;
    }

    function getCreator(uint256 _tokenId) external view returns(address){
        return idCreatorMap[_tokenId];
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

}
