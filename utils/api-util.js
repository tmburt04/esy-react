const fs = require('fs');
const path = require('path');
const readline = require('readline');
const util = require('util');
const dotenv = require('dotenv');

// Get the directory where the CLI tool is being run
const getCurrentDirectory = () => process.cwd();

async function setApiKey(apiKey) {
  try {
    const envPath = path.join(getCurrentDirectory(), '.env');
    
    // Check if .env already exists
    let existingEnvVars = {};
    if (fs.existsSync(envPath)) {
      existingEnvVars = dotenv.parse(fs.readFileSync(envPath));
    }

    // Merge new API key with existing variables
    const envContent = {
      ...existingEnvVars,
      CLAUDE_API_KEY: apiKey
    };

    // Convert to .env file format
    const envString = Object.entries(envContent)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Write the file with restricted permissions
    await fs.promises.writeFile(envPath, envString, {
      mode: 0o600, // Read/write for owner only
      flag: 'w'
    });

    // Add .env to .gitignore if it exists
    await ensureGitignore();

    console.log(`API key successfully stored in ${envPath}`);
    console.log('Make sure to add .env to your .gitignore file to avoid committing sensitive data!');
    
    return true;
  } catch (error) {
    console.error('Error storing API key:', error.message);
    return false;
  }
}

async function getApiKey() {
  try {
    // Load .env file
    dotenv.config();
    
    // Check for API key in environment
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (apiKey) {
      return apiKey;
    }
    
    // If no API key is found, prompt for one
    return await promptForApiKey();
  } catch (error) {
    console.error('Error retrieving API key:', error.message);
    throw error;
  }
}

async function promptForApiKey() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = util.promisify(rl.question).bind(rl);
  
  try {
    console.log('\nNo API key found in environment variables.');
    const apiKey = await question('Please enter your API key: ');
    rl.close();
    
    // Store the new API key
    await setApiKey(apiKey);
    return apiKey;
  } catch (error) {
    rl.close();
    throw error;
  }
}

async function ensureGitignore() {
  const gitignorePath = path.join(getCurrentDirectory(), '.gitignore');
  
  try {
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = await fs.promises.readFile(gitignorePath, 'utf8');
    }

    // Check if .env is already in .gitignore
    if (!gitignoreContent.split('\n').some(line => line.trim() === '.env')) {
      // Add .env to .gitignore if it's not already there
      const newContent = gitignoreContent + (gitignoreContent.endsWith('\n') ? '' : '\n') + '.env\n';
      await fs.promises.writeFile(gitignorePath, newContent, { flag: 'w' });
      console.log('Added .env to .gitignore');
    }
  } catch (error) {
    console.warn('Warning: Could not update .gitignore:', error.message);
  }
}

// Helper function to check if key is set
async function isApiKeySet() {
  dotenv.config();
  return !!process.env.CLAUDE_API_KEY;
}

// Helper function to remove API key
async function removeApiKey() {
  try {
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
  setApiKey,
  getApiKey,
  isApiKeySet,
  removeApiKey
};
module.exports = ApiProvider;