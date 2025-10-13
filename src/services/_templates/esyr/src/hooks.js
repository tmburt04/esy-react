const { writeFile } = require('fs-extra');
const { join } = require('path');

/**
 * Builds a React hook file
 */
const reactHookFactory = async ({ hookName, hookPath, useTypeScript, fileOverwrite }) => {
  let hookFileContent = `import React, { useEffect } from 'react';

export const ${hookName} = () => {

  useEffect(() => {
    console.log('${hookName} mounted!');
  }, []);

  return {}
}
  
export default ${hookName}`;

// Overwrite the file content if provided (b/c we want claude to handle function parameters)
if (fileOverwrite?.length > 0) {
  hookFileContent = fileOverwrite;
}

  const hookFileName = `${hookName}.${useTypeScript ? 'ts' : 'js'}`;

  await writeFile(join(hookPath, hookFileName), hookFileContent);
};

module.exports = { reactHookFactory };
