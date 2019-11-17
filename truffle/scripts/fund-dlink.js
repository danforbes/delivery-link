const DeliveryLink = artifacts.require('DeliveryLink');
const LinkToken = artifacts.require('LinkToken');

module.exports = async callback => {
  const deliveryLink = await DeliveryLink.deployed();
  const tokenAddress = await deliveryLink.getChainlinkToken();
  const token = await LinkToken.at(tokenAddress);
  console.log(`Transfering 100 LINK to ${deliveryLink.address}...`);
  const tx = await token.transfer(deliveryLink.address, `${100e18}`);
  console.log(`Transfer succeeded! Transaction ID: ${tx.tx}.`);
  callback();
}
