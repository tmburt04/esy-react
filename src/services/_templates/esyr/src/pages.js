const { join } = require('path');
const { writeFile } = require('fs-extra');
const { kebabCase } = require('../../../../utils/common.util');
const { renderScaffold } = require('../../../../utils/template.util');

/**
 * @name reactPageFactory
 * @description Builds a React page file (depending on the user's choice of TypeScript and SASS)
 */
const reactPageFactory = async ({ useTypeScript, useSass, pageName, pagePath, fileOverwrite, contentOverwrite }) => {
  const requiredArgs = [useTypeScript, useSass, pageName, pagePath];
  if (requiredArgs.some((arg) => arg == undefined || arg == null)) {
    throw new Error('Missing required arguments');
  }

  const kebabName = kebabCase(pageName);
  const styleFileName = `${pageName}.${useSass ? 'scss' : 'css'}`;
  const pageFileName = `${pageName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  if (fileOverwrite) {
    await writeFile(join(pagePath, pageFileName), fileOverwrite);
  } else {
    const pageFileContent = renderScaffold('page.eta', {
      pageName,
      kebabName,
      styleFileName,
      contentOverwrite
    });

    const pageStyleFileContent = renderScaffold('page.css.eta', { kebabName, useSass });

    await Promise.all([
      writeFile(join(pagePath, pageFileName), pageFileContent),
      writeFile(join(pagePath, styleFileName), pageStyleFileContent),
    ]);
  }
};

module.exports = { reactPageFactory };
