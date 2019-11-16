const DeliveryLink = artifacts.require("DeliveryLink");
const LinkToken = artifacts.require('LinkToken');
const Oracle = artifacts.require('Oracle');

module.exports = async function(deployer) {
  await deployer.deploy(DeliveryLink, LinkToken.address, Oracle.address);
};
