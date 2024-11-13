const { setEnvVar, getEnvVar } = require('../utils/env.util');
const { prompt } = require("inquirer");


async function promptForApiKey(vendor) {
  console.log(`\nNo API key for '${vendor}' found in environment. `);
  const { apiKey } = await prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: `\nPlease enter a valid API key to continue:\n`
    }
  ]);

  // Store the new API key
  vendor = vendor.toUpperCase();
  await setEnvVar(`${vendor}_API_KEY`, apiKey);
  return apiKey;
}

async function getApiKey(vendor) {
  try {
    vendor = vendor.toUpperCase();
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
async function isApiKeySet(vendor) {
  vendor = vendor.toUpperCase();
  return !!await getEnvVar(`${vendor}_API_KEY`);
}

const ApiProvider = {
  getApiKey,
  isApiKeySet,
};
module.exports = { ApiProvider };