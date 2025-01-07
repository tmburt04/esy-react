const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const os = require('os');
const { getRandomResetMsg } = require('../providers/joke.provider');

const KEY_PREFIX = 'ESYR_';

// Get the dir where the user stores settings/prefs
const getHomePath = (filename = '') => {
  const fp = path.join(os.homedir(), '.esyr-cli');
  // Create the path if it does not exist
  if (!fs.existsSync(fp)) {
    fs.mkdirSync(fp);
  }
  return path.join(fp, filename)
}

// Get the dir where the CLI tool is being run (this will not save at the config level)
const getCurrentDirectory = (filename = '') => path.join(process.cwd(), filename);

async function setEnvVar(key, value, homePref = false) {
  try {
    key = KEY_PREFIX + key;
    const envPath = homePref ? getHomePath('.env') : getCurrentDirectory('.env');
    if (homePref) {
      console.warn('Saving preference globally...')
    }

    // Check if .env already exists
    let existingEnvVars = {};
    if (fs.existsSync(envPath)) {
      existingEnvVars = dotenv.parse(fs.readFileSync(envPath));
    }

    // Merge new API key with existing variables
    const envContent = {
      ...existingEnvVars,
      [key]: value
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

    if (homePref) {
      console.warn('Global preference securely stored!')
    } else {
      // Add .env to .gitignore if it exists
      await ensureGitignore();
    }

    return true;
  } catch (error) {
    console.error('Error storing Env var:', error.message);
    return false;
  }
}

/**
 * @description Retrieve an environment variable
 * @param {*} key the key to retrieve
 * @returns the value of the key
 */
async function getEnvVar(key) {
  try {
    // Load .env file
    dotenv.config({ path: getHomePath('.env') });
    dotenv.config();
    key = KEY_PREFIX + key;
    return process.env[key];
  } catch (error) {
    console.error(`Error retrieving Env var '${key}':`, error.message);
    throw error;
  }
}

/**
 * @returns the relevant environment variables
 */
async function getEnv() {
  try {
    // Load .env file
    dotenv.config({ path: getHomePath('.env') });
    dotenv.config();
    const keys = Object.keys(process.env).filter(key => key.startsWith(KEY_PREFIX));
    return keys.reduce((acc, key) => {
      acc[key.replace(KEY_PREFIX, '')] = process.env[key];
      return acc;
    }, {});
  } catch (error) {
    console.error(`Error retrieving Env:`, error.message);
    throw error;
  }
}

/**
 * Ensure that .env is added to .gitignore
 */
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

/**
 * Reset the environment variables to their original state
 */
async function resetEnv() {
  try {
    const secureEnvPath = getHomePath('.env');
    // Load .env files
    dotenv.config({ path: secureEnvPath });
    dotenv.config();

    const envPath = getCurrentDirectory('.env');
    // Write the file with restricted permissions
    await fs.promises.writeFile(envPath, '', {
      mode: 0o600, // Read/write for owner only
      flag: 'w'
    });
    // Write the file with restricted permissions
    await fs.promises.writeFile(secureEnvPath, '', {
      mode: 0o600, // Read/write for owner only
      flag: 'w'
    });
    const resetMsg = getRandomResetMsg();
    console.log(`\n\n${resetMsg}\n\n`);
  } catch (error) {
    console.error(`Error overwriting env vars to default values:`, error.message);
    throw error;
  }
}

module.exports = {
  resetEnv,
  getEnv,
  getEnvVar,
  setEnvVar,
  ensureGitignore,
};