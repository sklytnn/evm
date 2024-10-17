// deploy.js
require('colors');
const ethers = require('ethers');
const { generateContractCode } = require('./contractCode');

// Deploy Contract Function
async function deployContract(network, name, symbol, supply) {
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`\nDeploying contract to ${network.name}...`.yellow);

    const { bytecode, abi } = generateContractCode(name, symbol, supply);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Deploy the contract and wait for the transaction to be mined
    const contract = await factory.deploy();
    await contract.waitForDeployment(); // Use waitForDeployment in v6

    console.log(`\nContract deployed successfully!`.green);
    console.log(`Contract address: ${contract.target}`.cyan); // Use contract.target in v6
    console.log(`Explorer URL: ${network.explorer}/address/${contract.target}`.blue);

    return contract.target; // Return the contract address
  } catch (error) {
    console.error(`Error deploying contract: ${error.message}`.red);
    process.exit(1);
  }
}

// Exports
module.exports = { deployContract };
