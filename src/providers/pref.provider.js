const { prompt } = require("inquirer");
const { setEnvVar, getEnvVar } = require("../utils/env.util");

async function tryAskPath(type, defaultPath = '') {
    const key = `DEFAULT_${type.toUpperCase()}_PATH`;
    // Prompt user if they want to give a description to claude
    let resolvedPath = await getEnvVar(key);
    if (!resolvedPath) {
        const { providedPath } = await prompt([
            {
                type: 'input',
                name: 'providedPath',
                message: `\nWhere should a '${type}' be created?\n`,
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