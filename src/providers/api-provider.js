const { setEnvVar, getEnvVar } = require('../utils/env.util');
const { prompt } = require("inquirer");

/**
 * @description Fetch a URL with exponential backoff
 * @param {*} url The URL to fetch
 * @param {*} options The fetch options
 * @param {*} param2 The options for exponential backoff
 * @returns 
 */
async function fetchWithExpBackoff(url, options = {}, {
  maxRetries = 3, // Maximum number of retries
  baseDelay = 1000, // 1 second
  maxDelay = 30000, // 30 seconds
  timeout = 1000 * 15 // 15 seconds
} = {}) {
  const fetchWithTimeout = async (url, options) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  const exponentialBackoff = (attempt) => {
    const delay = Math.min(
      maxDelay, 
      baseDelay * Math.pow(2, attempt)
    );
    return delay + Math.floor(Math.random() * 1000); // Add jitter
  };

  let lastError = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);
      
      // Optional: You can add custom response handling here
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      // Avoid retrying on certain critical errors
      if (error.name === 'AbortError' || 
          (error.response && error.response.status < 500)) {
        throw error;
      }
      
      if (attempt === maxRetries - 1) {
        throw lastError;
      }
      
      const delay = exponentialBackoff(attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

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
  await setEnvVar(`${vendor}_API_KEY`, apiKey, true);
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
  fetchWithExpBackoff,
  getApiKey,
  isApiKeySet,
};
module.exports = { ApiProvider };