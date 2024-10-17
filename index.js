require('dotenv').config();
require('colors');

const {
  loadNetworkConfig,
  displayHeader,
  delay,
} = require('./src/utils');
const { deployContract } = require('./src/deploy');
const readlineSync = require('readline-sync');

// Helper Functions
const randomWords = [
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
  // ... (include the rest of your words here)
];

function randomWord() {
  if (randomWords.length === 0) {
    return 'DEFAULT'; // Return a default value if the array is empty
  }
  return randomWords[Math.floor(Math.random() * randomWords.length)];
}

function randomSupply() {
  return Math.floor(Math.random() * 1000000) + 1; // Random supply between 1 and 1,000,000
}

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

// Call randomAddress function
const newWalletAddress = randomAddress();
console.log(newWalletAddress);

// Main Function
async function main() {
  displayHeader();
  console.log(`Please wait...\n`.yellow);
  await delay(500);
  console.log('Welcome to EVM Auto Deploy!'.green.bold);

  const networkType = process.argv[2] || 'testnet';
  const networks = loadNetworkConfig(networkType);

  // Display Available Networks
  console.log(`Available networks:`.yellow);
  networks.forEach((network, index) => {
    console.log(`${index + 1}. ${network.name}`);
  });

  // Select Network
  const networkIndex = parseInt(readlineSync.question('\nSelect a network (enter number): '.cyan)) - 1;
  const selectedNetwork = networks[networkIndex];

  if (!selectedNetwork) {
    console.error('Invalid network selection'.red);
    process.exit(1);
  }

  // Get Number of Deployments
  const numDeployments = parseInt(readlineSync.question('Enter number of deployments: '.cyan));

  // Deploy Tokens
  for (let i = 0; i < numDeployments; i++) {
    const name = `${randomWord()}_${randomWord()}`; // Two random words for token name
    const symbol = randomWord().toUpperCase().slice(0, 3); // First three letters of a random word for symbol
    const supply = randomSupply();

    const contractAddress = await deployContract(selectedNetwork, name, symbol, supply);
   
    console.log(`\nDeployment #${i + 1} completed!`.green.bold);
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);
    console.log(`Token Supply: ${supply}`);
    console.log(`Contract Address: ${contractAddress}`);
  }
}

// Execute Main Function
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
