const clUtils = require('../../chainlink/cl-utils');

const DeliveryLink = artifacts.require('DeliveryLink');
const Oracle = artifacts.require('Oracle');

module.exports = async callback => {
  const oracle = await Oracle.deployed();
  const timestampJob = clUtils.createJob('runlog');
  timestampJob.initiators[0].params.address = oracle.address;
  timestampJob.tasks.push(clUtils.createTask('httpget'));
  timestampJob.tasks.push(clUtils.createTask('jsonparse'));
  timestampJob.tasks.push(clUtils.createTask('ethuint256'));
  timestampJob.tasks.push(clUtils.createTask('ethtx'));
  console.log('Creating timestamp job on Chainlink node...');
  const timestampJobRes = await clUtils.postJob(timestampJob);
  console.log(`Job created! Job ID: ${timestampJobRes.data.id}.`);

  console.log('Adding timestamp job ID to DeliveryLink contract...');
  const deliveryLink = await DeliveryLink.deployed();
  const tx = await deliveryLink.setTimestampJobId(timestampJobRes.data.id);
  console.log(`Job ID added to contract! Transaction ID: ${tx.tx}.`);

  console.log('Creating EasyPost bridge on Chainlink node...');
  const easyPostBridge = clUtils.createBridge('easypost', 'http://easypost:6221');
  const easyPostBridgeRes = await clUtils.postBridge(easyPostBridge);
  console.log(`Bridge created! Bridge ID: ${easyPostBridgeRes.data.id}.`);

  const easyPostJob = clUtils.createJob('web');
  const easyPostTask = clUtils.createTask('easypost');
  easyPostTask.params.car = "USPS";
  easyPostTask.params.code = "EZ1000000001";
  easyPostJob.tasks.push(easyPostTask);
  console.log('Creating EasyPost job on Chainlink node...');
  const easyPostJobRes = await clUtils.postJob(easyPostJob);
  console.log(`Job created! Job ID: ${easyPostJobRes.data.id}.`);
  callback();
}
