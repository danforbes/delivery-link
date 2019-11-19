pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";
import "chainlink/contracts/vendor/Ownable.sol";

contract DeliveryLink is ChainlinkClient, Ownable {
  uint256 constant private ORACLE_PAYMENT = 1 * LINK;

  string private packageCarrier;
  string private packageCode;

  string private timestampJobId;
  uint256 public timestamp;

  event TimestampResponseReceived(
    bytes32 indexed requestId,
    uint256 indexed timestamp
  );

  string private deliveryStatusJobId;
  string public deliveryStatus;

  event DeliveryStatusResponseReceived(
    bytes32 indexed requestId,
    string indexed deliveryStatus
  );

  string private ethereumPriceJobId;
  uint256 public ethereumPriceEUR;

  event EthereumPriceEURResponseReceived(
    bytes32 indexed requestId,
    uint256 indexed ethereumPriceEUR
  );

  constructor(address _link, address _oracle) public Ownable() {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

  function requestCurrentTimestamp()
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
    emit TimestampResponseReceived(_requestId, _timestamp);
    timestamp = _timestamp;
  }

  function requestDeliveryStatus()
    public
    onlyOwner
  {
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(deliveryStatusJobId), this, this.handleDeliveryStatusResponse.selector);
    req.add("car", packageCarrier);
    req.add("code", packageCode);
    req.add("copyPath", "status");
    sendChainlinkRequest(req, ORACLE_PAYMENT);
  }

  function handleDeliveryStatusResponse(bytes32 _requestId, bytes32 _deliveryStatus)
    public
    recordChainlinkFulfillment(_requestId)
  {
    deliveryStatus = bytes32ToString(_deliveryStatus);
    emit DeliveryStatusResponseReceived(_requestId, deliveryStatus);
  }

  function requestEthereumPriceEUR()
    public
    onlyOwner
  {
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(ethereumPriceJobId), this, this.handleEthereumPriceEURResponse.selector);
    req.add("copyPath", "EUR");
    req.addInt("times", 100);
    sendChainlinkRequest(req, ORACLE_PAYMENT);
  }

  function handleEthereumPriceEURResponse(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId)
  {
    emit EthereumPriceEURResponseReceived(_requestId, _price);
    ethereumPriceEUR = _price;
  }

  function setPackageCarrier(string _packageCarrier) public onlyOwner {
    packageCarrier = _packageCarrier;
  }

  function getPackageCarrier() public view returns (string) {
    return packageCarrier;
  }

  function setPackageCode(string _packageCode) public onlyOwner {
    packageCode = _packageCode;
  }

  function getPackageCode() public view returns (string) {
    return packageCode;
  }

  function setTimestampJobId(string _timestampJobId) public onlyOwner {
    timestampJobId = _timestampJobId;
  }

  function getTimestampJobId() public view returns (string) {
    return timestampJobId;
  }

  function setDeliveryStatusJobId(string _deliveryStatusJobId) public onlyOwner {
    deliveryStatusJobId = _deliveryStatusJobId;
  }

  function getDeliveryStatusJobId() public view returns (string) {
    return deliveryStatusJobId;
  }

  function setEthereumPriceJobId(string _ethereumPriceJobId) public onlyOwner {
    ethereumPriceJobId = _ethereumPriceJobId;
  }

  function getEthereumPriceEURJobId() public view returns (string) {
    return ethereumPriceJobId;
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

  function bytes32ToString(bytes32 source) private pure returns (string result) {
    bytes memory tempBytes = new bytes(32);
    for (uint256 byteNdx; byteNdx < 32; ++byteNdx) {
      tempBytes[byteNdx] = source[byteNdx];
    }

    return string(tempBytes);
  }

}