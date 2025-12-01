const { writeFile } = require('fs-extra');
const { join } = require('path');
const { renderScaffold } = require('../../../../utils/template.util');

/**
 * Builds a React hook file
 */
const reactHookFactory = async ({ hookName, hookPath, useTypeScript, fileOverwrite }) => {
  const hookFileName = `${hookName}.${useTypeScript ? 'ts' : 'js'}`;

  let hookFileContent;
  if (fileOverwrite?.length > 0) {
    hookFileContent = fileOverwrite;
  } else {
    hookFileContent = renderScaffold('hook.eta', { hookName });
  }

  await writeFile(join(hookPath, hookFileName), hookFileContent);
};

module.exports = { reactHookFactory };
