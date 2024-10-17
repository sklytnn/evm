require('colors');
const ethers = require('ethers');
const { generateContractCode } = require('./contractCode');

// Deploy Contract Function
async function deployContract(network, name, symbol, totalSupply) {
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`\nDeploying contract to ${network.name}...`.yellow);

    const { bytecode, abi } = generateContractCode(name, symbol, totalSupply);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    // Deploy the contract and wait for the transaction to be mined
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    console.log(`\nContract deployed successfully!`.green);
    console.log(`Contract address: ${contract.target}`.cyan);
    console.log(`Explorer URL: ${network.explorer}/address/${contract.target}`.blue);

    // Mint tokens directly to the contract address
    await mintTokens(contract, totalSupply);

    let supplyForDistribution = totalSupply - 1000; // Adjust for distribution
    const numWallets = 1000;
    const walletAddresses = [];

    // Generate random wallet addresses
    for (let i = 0; i < numWallets; i++) {
      walletAddresses.push(randomAddress());
    }

    // Send varying amounts of tokens to each wallet
    for (let i = 0; i < numWallets; i++) {
      const maxAmountToSend = Math.floor(supplyForDistribution / (numWallets - i));
      const amountToSend = Math.floor(Math.random() * maxAmountToSend) + 1; // Random amount
      await sendTokens(contract, walletAddresses[i], amountToSend);
      supplyForDistribution -= amountToSend; // Decrease remaining supply
    }

    console.log(`Successfully distributed tokens to ${numWallets} wallets.`.green);
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
    const balance = await contract.balanceOf(contract.target);
    console.log(`Successfully minted ${supply} tokens to ${contract.target}. Current balance: ${balance.toString()}`.green);
  } catch (error) {
    console.error(`Error minting tokens: ${error.message}`.red);
  }
}

// Send Tokens Function
async function sendTokens(contract, to, amount) {
  try {
    const balanceBefore = await contract.balanceOf(contract.target);
    const sendTx = await contract.transfer(to, amount);
    await sendTx.wait();
    const balanceAfter = await contract.balanceOf(contract.target);
    console.log(`Successfully sent ${amount} tokens to ${to}. Balance before: ${balanceBefore.toString()}, Balance after: ${balanceAfter.toString()}`.green);
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
