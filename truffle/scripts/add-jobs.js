const clUtils = require('../../chainlink/cl-utils');

const DeliveryLink = artifacts.require('DeliveryLink');
const Oracle = artifacts.require('Oracle');

module.exports = async callback => {
  const oracle = await Oracle.deployed();
  const timestampJob = clUtils.getRunLogJobForOracle(oracle.address);
  timestampJob.tasks.push(clUtils.getTaskForType('httpGet'));
  timestampJob.tasks.push(clUtils.getTaskForType('jsonParse'));
  timestampJob.tasks.push(clUtils.getTaskForType('ethUint256'));
  timestampJob.tasks.push(clUtils.getTaskForType('ethTx'));
  console.log('Creating timestamp job on Chainlink node...');
  const timestampJobRes = await clUtils.postJob(timestampJob);
  console.log(`Job created! Job ID: ${timestampJobRes.data.id}.`);

  console.log('Add timestamp job ID to DeliveryLink contract...');
  const deliveryLink = await DeliveryLink.deployed();
  const tx = await deliveryLink.setTimestampJobId(timestampJobRes.data.id);
  console.log(`Job ID added to contract! Transaction ID: ${tx.tx}.`);
  callback();
}
