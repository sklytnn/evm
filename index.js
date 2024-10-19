require('dotenv').config();
require('colors');
const ethers = require('ethers');
const { loadNetworkConfig, displayHeader, delay } = require('./src/utils');
const { deployContract } = require('./src/deploy');
const readlineSync = require('readline-sync');

// Helper Functions
const randomWords = [
  "Adventure", "Breeze", "Courage", "Dawn", "Eclipse", "Fortune", "Glimmer", "Horizon", "Illusion", "Journey", 
  "Kismet", "Legacy", "Mystique", "Nirvana", "Odyssey", "Pinnacle", "Quest", "Radiance", "Saga", "Tranquil", 
  "Unveil", "Venture", "Whimsy", "Zenith", "Abyss", "Blaze", "Celestial", "Daring", "Ember", "Fable", 
  "Griffin", "Harmony", "Infinity", "Jubilant", "Kaleidoscope", "Labyrinth", "Mirage", "Nexus", "Oasis", 
  "Paradigm", "Quasar", "Rapture", "Serenity", "Tempest", "Unity", "Vortex", "Wander", "Xenith", "Yearning", 
  "Zephyr", "Allegory", "Bounty", "Chroma", "Drift", "Elysium", "Frost", "Grove", "Haven", "Iris", 
  "Juniper", "Kismet", "Lustre", "Myriad", "Noble", "Opulent", "Pulsate", "Quintessence", "Resonance", 
  "Solstice", "Tapestry", "Umbra", "Veil", "Whisper", "Aether", "Bloom", "Cascade", "Dusk", "Echo", 
  "Flare", "Glade", "Horizon", "Illume", "Jewel", "Kite", "Luna", "Mosaic", "Nimbus", "Omen", 
  "Plume", "Quill", "Ripple", "Scribe", "Thrive", "Utopia", "Vista", "Wisp", "Xplore", "Yonder", 
  "Arcane", "Brisk", "Cinder", "Dune", "Ember", "Fathom", "Glint", "Hollow", "Iridescent", "Jubilant", 
  "Kaleidoscope", "Lunar", "Mystic", "Noble", "Oracle", "Pinnacle", "Quasar", "Reverie", "Sapphire", 
  "Tidal", "Umbrella", "Vivid", "Wanderlust", "Xenon", "Yearn", "Zenith", "Aurora", "Breeze", 
  "Celeste", "Dream", "Eclipse", "Fable", "Gratitude", "Harmony", "Illuminated", "Journey", "Kismet", 
  "Lucent", "Mirage", "Nexus", "Obsidian", "Ponder", "Quest", "Radiant", "Scribe", "Tidal", 
  "Umber", "Vortex", "Whisper", "Zenith", "Arcadia", "Blossom", "Cascade", "Dew", "Elysian", 
  "Fable", "Glimpse", "Horizon", "Indigo", "Jewel", "Karma", "Lilt", "Mirth", "Nebula", "Oasis", 
  "Ponder", "Quilt", "Reverie", "Solstice", "Tranquil", "Unity", "Vapor", "Wisp", "Xenith", 
  "Yield", "Zenith", "Alchemy", "Bramble", "Chant", "Drizzle", "Echo", "Fjord", "Grove", 
  "Hope", "Ivy", "Jovial", "Kite", "Lattice", "Mist", "Nestle", "Ogle", "Pine", "Quench", 
  "Riddle", "Sparrow", "Thistle", "Uproar", "Vine", "Wanderer", "Xplore", "Yonder", "Zephyr", 
  "Amber", "Brisk", "Cloud", "Dewdrop", "Ember", "Fable", "Glow", "Haven", "Iris", "Jasper", 
  "Kaleidoscope", "Lark", "Meadow", "Nurture", "Opal", "Petal", "Quiver", "Radiance", "Sway", 
  "Twilight", "Utopia", "Vibrant", "Wildflower", "Xanadu", "Yarn", "Zest", "Aspire", "Bliss", 
  "Cascade", "Delight", "Eden", "Flame", "Glisten", "Horizon", "Illusion", "Jade", "Kismet", 
  "Loom", "Mystery", "Nest", "Olive", "Pique", "Quest", "Rustle", "Siren", "Tumble", "Umbra", 
  "Vista", "Wisp", "Xenith", "Yearning", "Zing", "Allure", "Breeze", "Crescent", "Drift", "Elysium", 
  "Frost", "Glimpse", "Horizon", "Inspire", "Journey", "Kaleidoscope", "Lush", "Mingle", "Noble", 
  "Orb", "Ponder", "Quench", "Rove", "Silhouette", "Thrive", "Understory", "Venture", "Whim", 
  "Xcite", "Yonder", "Zenith"
];

// Generate a random word from the list
function randomWord() {
  if (randomWords.length === 0) {
    return 'DEFAULT';
  }
  return randomWords[Math.floor(Math.random() * randomWords.length)];
}

// Generate a random supply
function randomSupply() {
  return Math.floor(Math.random() * 1000000) + 1; // Random supply between 1 and 1,000,000
}

// Main function to deploy tokens
async function main() {
  displayHeader();
  console.log(`Please wait...\n`.yellow);
  await delay(500);
  console.log('Welcome to EVM Auto Deploy!'.green.bold);

  const networkType = process.argv[2] || 'testnet';
  const networks = loadNetworkConfig(networkType);

  // Display available networks
  console.log(`Available networks:`.yellow);
  networks.forEach((network, index) => {
    console.log(`${index + 1}. ${network.name}`);
  });

  // Select network
  const networkIndex = parseInt(readlineSync.question('\nSelect a network (enter number): '.cyan)) - 1;
  const selectedNetwork = networks[networkIndex];

  if (!selectedNetwork) {
    console.error('Invalid network selection'.red);
    process.exit(1);
  }

  // Get number of deployments
  const numDeployments = parseInt(readlineSync.question('Enter number of deployments: '.cyan));

  // Deploy tokens
  for (let i = 0; i < numDeployments; i++) {
    const name = `${randomWord()}_${randomWord()}`; // Two random words for token name
    const symbol = name.toUpperCase().replace(/_/g, '').slice(0, 3); // First three letters of the token name for symbol, no underscore
    const supply = randomSupply(); // Random supply for minting

    const contractAddress = await deployContract(selectedNetwork, name, symbol, supply);
   
    console.log(`\nDeployment #${i + 1} completed!`.green.bold);
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);
    console.log(`Token Supply: ${supply}`);
    console.log(`Contract Address: ${contractAddress}`);
  }
}

// Execute the main function
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
