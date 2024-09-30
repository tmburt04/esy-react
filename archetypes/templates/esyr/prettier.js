const { join } = require('path');
const { writeFile, writeJson } = require('fs-extra');

/**
 * @name prettierFactory
 * @description Create a prettier configuration file and prettier ignore file
 */
const prettierFactory = async ({projectPath}) => {
    await Promise.all([
        await writeJson(join(projectPath, '.prettierrc.json'), prettierRC, { spaces: 2 }), // Create prettier configuration file
        await writeFile(join(projectPath, '.prettierignore'), prettierIgnore.trim()), // Create prettier ignore file
    ]);
};

module.exports = { prettierFactory };

const prettierIgnore = `dist
node_modules
.prettierrc.json`

const prettierRC = {
    "printWidth": 100,
    "tabWidth": 2,
    "useTabs": false,
    "semi": true,
    "singleQuote": true,
    "quoteProps": "as-needed",
    "jsxSingleQuote": false,
    "trailingComma": "es5",
    "bracketSpacing": true,
    "bracketSameLine": false,
    "arrowParens": "always",
    "proseWrap": "preserve",
    "htmlWhitespaceSensitivity": "css",
    "endOfLine": "lf",
    "embeddedLanguageFormatting": "auto",
    "overrides": [
        {
            "files": ["*.js", "*.jsx", "*.ts", "*.tsx"],
            "options": {
                "parser": "typescript"
            }
        },
        {
            "files": ["*.css", "*.scss"],
            "options": {
                "parser": "css"
            }
        },
        {
            "files": "*.json",
            "options": {
                "parser": "json"
            }
        },
        {
            "files": "*.py",
            "options": {
                "parser": "python"
            }
        },
        {
            "files": "*.rs",
            "options": {
                "parser": "rust"
            }
        }
    ]
};