const { writeFile } = require('fs-extra');
const { join } = require('path');

/**
 * Builds a React hook file
 */
const reactHookFactory = async ({ hookName, hookPath, useTypeScript }) => {
  const hookFileContent = `import React, { useEffect } from 'react';

export const ${hookName} = () => {

  useEffect(() => {
    console.log('${hookName} mounted!');
  }, []);

  return {}
}`;

  const hookFileName = `${hookName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  await writeFile(join(hookPath, hookFileName), hookFileContent);
};

module.exports = { reactHookFactory };
