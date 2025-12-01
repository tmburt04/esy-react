const { join } = require('path');
const { writeFile, ensureDir } = require('fs-extra');
const { kebabCase } = require('../../../../utils/common.util');
const { renderScaffold } = require('../../../../utils/template.util');

/**
 * @name reactComponentFactory
 * @description Builds a React component file (depending on the user's choice of TypeScript and SASS)
 */
const reactComponentFactory = async ({ useTypeScript, useSass, componentName, componentPath, fileOverwrite, contentOverwrite }) => {
  const requiredArgs = [useTypeScript, useSass, componentName, componentPath];
  if (requiredArgs.some((arg) => arg == undefined || arg == null)) {
    throw new Error('Missing required arguments');
  }
  await ensureDir(componentPath);

  const kebabName = kebabCase(componentName);
  const styleFileName = `${componentName}.${useSass ? 'scss' : 'css'}`;
  const componentFileName = `${componentName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  if (fileOverwrite) {
    await writeFile(join(componentPath, componentFileName), fileOverwrite);
  } else {
    const componentFileContent = renderScaffold('component.eta', {
      componentName,
      kebabName,
      styleFileName,
      useTypeScript,
      contentOverwrite
    });

    const componentStyleFileContent = renderScaffold('component.css.eta', { kebabName, useSass });

    await Promise.all([
      writeFile(join(componentPath, componentFileName), componentFileContent),
      writeFile(join(componentPath, styleFileName), componentStyleFileContent),
    ]);
  }
};

module.exports = { reactComponentFactory };
