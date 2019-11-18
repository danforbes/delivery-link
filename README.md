# Delivery Link

This is a workshop project that uses Chainlink to implement secure, decentralized payment-on-delivery. This project is
built on top of [Chainlink Dev](https://github.com/danforbes/chainlink-dev/tree/1c775a89b77bee0b0f7ea76545ef232554b9a559).

The goal of this project is to allow the user to go from a bare development setup (Docker, Ganache, etc) to deploying a
fully sandboxed, fully functional Chainlink network in a single command. Run the `npm start` command to achieve the
following:

1. Migrate a `LINK` token, Chainlink oracle and Chainlink client smart contract to Ganache with Truffle.
1. Deploy a local, pre-configured Chainlink node with Docker. The Chainlink node will be connected to Ganache.
1. Deploy a Chainlink external adapter locally with Docker.
1. Perform the following tasks with Truffle scripts:
   1. Fund the Chainlink client smart contract with 100 `LINK` tokens.
   1. Set fulfillment permission to `true` for your Chainlink node on your oracle smart contract.
   1. Fund the Chainlink node with 1 `ETH`.
   1. Add jobs to the Chainlink node, including one that exercises the external adapter.
   1. Configure the Chainlink client smart contract to use the jobs on the Chainlink node.

## Disclaimers

This project is intended for development purposes **only**. A number of the configuration settings used by this project
should **never** be deployed in a production setting.

As of 2019-11-18 this project is still in a rather unpolished state and has only been tested on Linux.

## Dependencies

In addition to the dependencies described in [the `package.json` file](package.json), this project is also dependent
upon Docker/Docker Compose, Ganache and possibly others.

In order to exercise the external adapter capabilities, you will need to provide an API key for
[the EasyPost API](https://www.easypost.com/docs/api).

## Usage

1. Run `npm i` to install dependencies.
1. Update the `API_KEY` key value in [the `adapters/easypost/.env` file](/adapters/easypost/.env) to reflect the value
   of your EasyPost API key.
1. Create a new workspace in Ganache:
  1. On the `Workspace` tab, add `truffle/truffle-config.js` from this project.
  1. On the server tab, select the `0.0.0.0 - All Interfaces` hostname.
  1. Save the workspace.
1. Run `npm start` to perform the steps described above.
1. Run `npm run chainlink:logs` to view the Chainlink node logs and ensure it started successfully.
1. Sign in to the Chainlink node's web UI:
   1. Use your web browser to navigate to http://localhost:6688.
   1. Login with the following credentials:
      * Email: `user@example.com`
      * Password: `password`
1. Use the Chainlink node web UI to inspect the bridge and jobs that were created when you ran `npm start`.
1. Use Remix to interact with the deployed Chainlink client smart contract:
   1. Run `npm run remix` to invoke the `remixd` command. `remixd` will allow you to use the Remix web IDE to
      interact with Solidity smart contracts on your local file system.
   1. Use your web browser to navigate to https://remix.ethereum.org and follow the steps to connect Remix to
      `localhost`.
   1. Use the Remix file explorer to open
      [the `truffle/contracts/DeliveryLink.sol` contract](/truffle/contracts/DeliveryLink.sol) from this project.
   1. Use the Remix Solidity compiler to compile the `DeliveryLink` contract.
   1. Use the Remix UI to configure Ganache as your Web3 provider.
   1. Use Ganache to get the address of the deployed `DeliveryLink` contract.
   1. Use Remix to load the deployed instance of `DeliveryLink`.
   1. Use Remix to inspect the `DeliveryLink` contract and view the values of some of its state variables; correlate
      these with values found on the Chainlink node web UI:
      * `getChainlinkOracle`
      * `getChainlinkToken`
      * `getDeliveryStatusJobId`
      * `getTimestampJobId`
   1. Use Remix to inspect the value of the `timestamp` state variable; you should note that the value has not been
      set.
   1. Use Remix to inspect the definition of the `requestCurrentTimestamp` function on the `DeliveryLink` contract and
      then execute it.
   1. Use the Chainlink node web UI to view the completed job run that was executed as a result of calling the
      function on the `DeliveryLink` contract.
   1. Use Remix to inspect the updated value of the `timestamp` state variable.
   1. Use Remix to inspect the value of the `deliveryStatus` state variable; you should note that the value has not
      been set.
   1. Use Remix to execute the following functions with the provided parameters in order to prepare the `DeliveryLink`
      contract to exercise the external adapter that was deployed using Docker. The parameter values are test values
      provided by EasyPost for the purpose of developing with their API:
      * `setPackageCarrier`: `USPS`
      * `setPackageCode`: `EZ1000000001`
   1. Use Remix to inspect the definition of the `requestDeliveryStatus` function on the `DeliveryLink` contract and
      then execute it.
   1. Use the Chainlink node web UI to view the completed job run that was executed as a result of calling the
      function on the `DeliveryLink` contract.
   1. Use Remix to inspect the updated value of the `deliveryStatus` state variable.

## Features and Capabilities for Further Development

This project is meant to expose a host of features and capabilities that can be reused for further development.

### Chainlink Node REST API

[The `chainlink/cl-utils.js` file](/chainlink/cl-utils.js) implements a minimal client for
[the Chainlink node REST API](https://docs.chain.link/reference) as well as some helper functions to assist in
exercising the REST API's capabilities.

#### `createBridge(name, url)`

This helper function is meant to be used in conjunction with `postBridge(bridge)`.

Return value:
```json
{
   "name": name,
   "url": url
}
```

#### `createJob(initiatorType)`

This helper function is meant to be used in conjunction with `postJob(job)`.

Return value:
```json
{
    "initiators": [
      {
        "type": initiatorType,
        "params": {}
      }
    ],
    "tasks": []
  }
```

#### `createTask(type)`

This helper function is meant to be used to add elements to the `tasks` array of the object returned by `createJob`.

Return value:
```json
{
   "type": type,
   "params": {}
}
```

#### `getAcctAddr()`

Retrieves the account address of the Chainlink node from the Chainlink node's REST API.

#### `postBridge(bridge)`

Create [a bridge](https://docs.chain.link/docs/node-operators) on the Chainlink node using the Chainlink node REST API.

#### `postJob(job)`

Create [a job](https://docs.chain.link/docs/job-specifications) on the Chainlink node using the Chainlink node REST
API.

### External Adapters

A key feature of this project is the ease with which
[external adapters](https://docs.chain.link/docs/external-adapters) can be deployed and consumed.

To deploy a new external adapter, simply add it as a service to [the `docker-compose.yml` file](/docker-compose.yml)
found in this project. The included [EasyPost adapter](/adapters/easypost) is deployed from source by referring to
[the provided Dockerfile](/adapters/easypost/Dockerfile).

To see an example of how the features and capabilities of this project can be used to configure a Chainlinked smart
contract to consume an external adapter, please refer to
[the provided `add-jobs.js` script](/truffle/scripts/add-jobs.js) and the usage steps described above.
