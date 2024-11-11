const fs = require('fs');
const path = require('path');
const readline = require('readline');
const util = require('util');
const dotenv = require('dotenv');
const { setEnvVar, getEnvVar } = require('../utils/env.util');

// Get the directory where the CLI tool is being run
const getCurrentDirectory = () => process.cwd();

async function promptForApiKey(vendor) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = util.promisify(rl.question).bind(rl);
  
  try {
    console.log('\nNo API key found in environment variables.');
    const apiKey = await question('Please enter your API key: \n');
    rl.close();
    
    // Store the new API key
    await setEnvVar(`${vendor}_API_KEY`,apiKey);
    return apiKey;
  } catch (error) {
    rl.close();
    throw error;
  }
}

async function getApiKey(vendor = 'CLAUDE') {
  try {
    vendor=vendor.toUpperCase();
    // Load .env file
    dotenv.config();
    
    const apiKey = await getEnvVar(`${vendor}_API_KEY`);
    
    if (apiKey) {
      return apiKey;
    }
    
    // If no API key is found, prompt for one
    return await promptForApiKey(vendor);
  } catch (error) {
    console.error('Error retrieving API key:', error.message);
    throw error;
  }
}

// Helper function to check if key is set
async function isApiKeySet(vendor = 'CLAUDE') {
  vendor=vendor.toUpperCase();
  dotenv.config();
  return !!process.env[`${vendor}_API_KEY`];
}

// Helper function to remove API key
async function removeApiKey(vendor) {
  try {
    if (!vendor) {
      throw new Error('Vendor name is required');
    }
    vendor=vendor.toUpperCase();
    const envPath = path.join(getCurrentDirectory(), '.env');
    
    if (fs.existsSync(envPath)) {
      const envVars = dotenv.parse(fs.readFileSync(envPath));
      delete envVars.CLAUDE_API_KEY;
      
      const envString = Object.entries(envVars)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      await fs.promises.writeFile(envPath, envString, {
        mode: 0o600,
        flag: 'w'
      });
      
      console.log('API key successfully removed');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing API key:', error.message);
    return false;
  }
}

const ApiProvider = {
  getApiKey,
  isApiKeySet,
  removeApiKey
};
module.exports = {ApiProvider};