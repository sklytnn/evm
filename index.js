require('dotenv').config();
require('colors');

const {
  loadNetworkConfig,
  getUserInput,
  displayHeader,
  delay,
} = require('./src/utils');
const { deployContract, sendTokens, autoMultiDeploy } = require('./src/deploy');
const readlineSync = require('readline-sync');

// Helper Functions
const randomWords = [
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon',
  'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
  'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron',
  'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
  'Phi', 'Chi', 'Psi', 'Omega',
  'Lion', 'Eagle', 'Dolphin', 'Tiger', 'Wolf',
  'Fox', 'Bear', 'Parrot', 'Panda', 'Gecko',
  'Shark', 'Rhino', 'Octopus', 'Falcon', 'Cobra',
  'Antelope', 'Zebra', 'Cheetah', 'Llama', 'Otter',
  'Giraffe', 'Peacock', 'Squirrel', 'Crow', 'Bat',
  'Ant', 'Badger', 'Chimpanzee', 'Duck', 'Eel',
  'Finch', 'Hummingbird', 'Iguana', 'Jaguar', 'Koala',
  'Lynx', 'Moth', 'Nightingale', 'Owl', 'Porcupine',
  'Quokka', 'Raccoon', 'Sloth', 'Tortoise', 'Urchin',
  'Viper', 'Walrus', 'Xerus', 'Yak', 'Aardvark',
  'Bison', 'Chameleon', 'Dolphin', 'Elephant', 'Ferret',
  'Goldfish', 'Hamster', 'Ibex', 'Jackal', 'Koi',
  'Lemur', 'Manatee', 'Narwhal', 'Ocelot', 'Parakeet',
  'Quokka', 'Raptor', 'Seahorse', 'Tarantula', 'Urial',
  'Vulture', 'Whale', 'Xerus', 'Yeti', 'Armadillo',
  'Coyote', 'Dingo', 'Emu', 'Ferret', 'Gopher',
  'Hyena', 'Impala', 'Jaguar', 'Kangaroo', 'Lizard',
  'Marmoset', 'Nighthawk', 'Okapi', 'Platypus', 'Quail',
  'Raccoon', 'Salamander', 'Tapir', 'Urchin', 'Viper',
  'Wombat', 'Xerus', 'Yak', 'Zorse',
  'Agate', 'Bronze', 'Copper', 'Diamond', 'Electrum',
  'Ferro', 'Gold', 'Helix', 'Iridium', 'Jetstone',
  'Krypton', 'Lithium', 'Manganese', 'Nickel', 'Osmium',
  'Platinum', 'Quartz', 'Ruby', 'Silver', 'Titanium',
  'Uranium', 'Vanadium', 'Wood', 'Xenolith', 'Zircon',
  'Amethyst', 'Basalt', 'Calcite', 'Dolomite', 'Feldspar',
  'Galena', 'Hematite', 'Iolite', 'Jasper', 'Kyanite',
  'Lapis', 'Malachite', 'Nephrite', 'Olivine', 'Pyrite',
  'Quartz', 'Rhodonite', 'Sodalite', 'Tourmaline', 'Unakite',
  'Variscite', 'Wollastonite', 'Xenotime', 'Yellow', 'Zircon',
  'Celestial', 'DeepSpace', 'ExoWorld', 'Fermi', 'Galactic',
  'Helios', 'Infinite', 'Jovian', 'Kuiper', 'LightSpeed',
  'Meteor', 'Neutrino', 'Orbital', 'Pulsar', 'Quantum',
  'RedShift', 'Solar', 'Titan', 'Universe', 'Voyager',
  'Wormhole', 'Xenon', 'YellowDwarf', 'Zenith',
  'Alpha', 'Beta', 'Cosmic', 'DarkMatter', 'Eclipse',
  'Fractal', 'Galaxy', 'Helios', 'Intergalactic', 'Jetstream',
  'Kaleidoscope', 'Lightwave', 'MilkyWay', 'Nebula', 'Orion',
  'Pulsar', 'Quasar', 'Rocket', 'Stellar', 'Timewarp',
  'Universe', 'Vortex', 'WarpDrive', 'Xenon', 'Zenith',
  'Andromeda', 'Astral', 'Celestial', 'Cosmic', 'Exoplanet',
  'Galactic', 'Heliocentric', 'Interstellar', 'Krypton', 'Lightyear',
  'Mars', 'Neptune', 'OortCloud', 'Planetary', 'Quasar',
  'Radiant', 'Solar', 'Twilight', 'Universal', 'Voyager',
  'Warp', 'Zenith', 'Alpha', 'Beta', 'Comet',
  'DeepSpace', 'Ecliptic', 'Fermi', 'Galactic', 'Helios',
  'Infinity', 'Jovian', 'Kaleidoscope', 'LightSpeed', 'Meteor',
  'Nova', 'Orbit', 'Pulsar', 'Quasar', 'Rocket',
  'Solar', 'Titan', 'Universal', 'Vortex', 'Wormhole',
  'Xenon', 'YellowDwarf', 'Zenith',
];



function randomWord() {
  return randomWords[Math.floor(Math.random() * randomWords.length)];
}

function randomSupply() {
  return Math.floor(Math.random() * 1000000) + 1; // Random supply between 1 and 1,000,000
}

// index.js

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

    const randomRecipient = randomAddress();
    await sendTokens(contractAddress, randomRecipient, supply); // Assuming sendTokens takes these parameters
    console.log(`Sent ${supply} tokens to ${randomRecipient}`);
  }
}

// Execute Main Function
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
