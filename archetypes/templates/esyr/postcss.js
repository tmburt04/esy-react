const { join } = require('path');
const { writeFile } = require('fs-extra');

/**
 * @name postcssFactory
 * @description Create postcss.config.js
 */
const postcssFactory = async ({ projectPath }) => {

  const configFileName = 'postcss.config.js';
  const postCssConfigContent = `module.exports = {
    plugins: {
        'postcss-import': {},
        'tailwindcss/nesting': {},
        tailwindcss: { config: './tailwind.config.js' },
        autoprefixer: {},
    }
  }`;

  await Promise.all([
    await writeFile(join(projectPath, configFileName), postCssConfigContent.trim()), // Create postcss.config.js
  ]);
};

module.exports = { postcssFactory };
