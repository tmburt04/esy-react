const { prompt } = require("inquirer");
const { setEnvVar, getEnvVar } = require("../utils/env.util");

async function tryAskPath(type, defaultPath = '') {
    const key = `DEFAULT_${type.toUpperCase().replace('\s', '_')}_PATH`;
    // Prompt user if they want to give a description to claude
    let resolvedPath = await getEnvVar(key);
    if (!resolvedPath) {
        const { providedPath } = await prompt([
            {
                type: 'input',
                name: 'providedPath',
                message: `\nWhere should a '${type}' be created? (user preference)\n`,
                default: (defaultPath || './src/' + type + 's'),
            },
        ]);
        resolvedPath = providedPath;
        await setEnvVar(key, resolvedPath);
    }
    return resolvedPath;
}

const PrefProvider = { tryAskPath };
module.exports = {PrefProvider};