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
    await contract.waitForDeployment();

    console.log(`\nContract deployed successfully!`.green);
    console.log(`Contract address: ${contract.target}`.cyan);
    console.log(`Explorer URL: ${network.explorer}/address/${contract.target}`.blue);

    // Mint tokens
    await mintTokens(contract, supply);

    // Send tokens to random address
    const randomWalletAddress = randomAddress();
    await sendTokens(contract, randomWalletAddress, supply);

    return contract.target; // Return the contract address
  } catch (error) {
    console.error(`Error deploying contract: ${error.message}`.red);
    process.exit(1);
  }
}

// Mint Tokens Function
async function mintTokens(contract, supply) {
  try {
    const mintTx = await contract.mint(contract.target, supply);
    await mintTx.wait();
    console.log(`Successfully minted ${supply} tokens to ${contract.target}`.green);
  } catch (error) {
    console.error(`Error minting tokens: ${error.message}`.red);
  }
}

// Send Tokens Function
async function sendTokens(contract, to, amount) {
  try {
    const sendTx = await contract.transfer(to, amount);
    await sendTx.wait();
    console.log(`Successfully sent ${amount} tokens to ${to}`.green);
  } catch (error) {
    console.error(`Error sending tokens: ${error.message}`.red);
  }
}

// Random Address Function
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

// Exports
module.exports = { deployContract };
