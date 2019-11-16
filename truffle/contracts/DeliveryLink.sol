pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";
import "chainlink/contracts/vendor/Ownable.sol";

contract DeliveryLink is ChainlinkClient, Ownable {
  uint256 constant private ORACLE_PAYMENT = 1 * LINK;

  string private timestampJobId;
  uint256 public timestamp;

  event RequestEthereumPriceFulfilled(
    bytes32 indexed requestId,
    uint256 indexed timestamp
  );

  constructor(address _link, address _oracle) public Ownable() {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestTimestamp()
    public
    onlyOwner
  {
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(timestampJobId), this, this.handleTimestampResponse.selector);
    req.add("get", "https://showcase.linx.twenty57.net:8080/UnixTime/tounixtimestamp?datetime=now");
    req.add("path", "UnixTimeStamp");
    sendChainlinkRequest(req, ORACLE_PAYMENT);
  }

  function handleTimestampResponse(bytes32 _requestId, uint256 _timestamp)
    public
    recordChainlinkFulfillment(_requestId)
  {
    emit RequestEthereumPriceFulfilled(_requestId, _timestamp);
    timestamp = _timestamp;
  }

  function setTimestampJobId(string _timestampJobId) public onlyOwner {
    timestampJobId = _timestampJobId;
  }

  function getChainlinkOracle() public view returns (address) {
    return chainlinkOracleAddress();
  }

  function updateChainlinkOracle(address _oracle) public onlyOwner {
    setChainlinkOracle(_oracle);
  }

  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }

  function updateChainlinkToken(address _link) public onlyOwner {
    setChainlinkToken(_link);
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
    onlyOwner
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }

}