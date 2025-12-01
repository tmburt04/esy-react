const { join } = require('path');
const { writeFile } = require('fs-extra');
const { renderScaffold } = require('../../../utils/template.util');

/**
 * @name tailwindFactory
 * @description Create tailwind.config.js and src/theme.css files
 */
const tailwindFactory = async ({ projectName, projectPath }) => {
  const requiredArgs = [projectName, projectPath];
  if (requiredArgs.some((arg) => arg == undefined || arg == null)) {
    throw new Error('Missing required arguments');
  }

  const styleFileName = 'theme.css';
  const tailwindConfigContent = renderScaffold('tailwind.config.eta', {});
  const indexCssContent = renderScaffold('theme.css.eta', { projectName });

  await Promise.all([
    writeFile(join(projectPath, 'tailwind.config.js'), tailwindConfigContent.trim()),
    writeFile(join(projectPath, 'src', styleFileName), indexCssContent.trim()),
  ]);
};

module.exports = { tailwindFactory };
