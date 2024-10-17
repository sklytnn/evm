// deploy.js
require('colors');
const ethers = require('ethers');
const { generateContractCode } = require('./contractCode');

// Helper Functions

// Generate a random string of specified length
function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate a random supply between 1 and 1,000,000
function randomSupply() {
  return Math.floor(Math.random() * 1000000) + 1;
}

// Generate a random Ethereum address
function randomAddress() {
  let address = '0x';
  const chars = '0123456789abcdef';

  // Generate random address
  for (let i = 0; i < 40; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Ensure address does not start with 0x00000
  while (address.startsWith('0x00000')) {
    address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  return address;
}

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

// Send Tokens Function
async function sendTokens(contractAddress, recipient, amount) {
  // Implement the logic for sending tokens
  // This function should interact with the deployed contract to transfer tokens
}

// Auto Multi Deploy Function
async function autoMultiDeploy(network, numDeployments) {
  for (let i = 0; i < numDeployments; i++) {
    const name = `Token_${randomString(5)}`;
    const symbol = randomString(3).toUpperCase();
    const supply = randomSupply();

    const contractAddress = await deployContract(network, name, symbol, supply);

    const randomRecipient = randomAddress();
    await sendTokens(contractAddress, randomRecipient, supply);
  }
}

// Exports
module.exports = { deployContract, sendTokens, autoMultiDeploy }; // Ensure sendTokens is exported
