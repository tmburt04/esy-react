const { writeFile } = require('fs-extra');
const { join } = require('path');

/**
 * Builds a React hook file
 */
const reactHookFactory = async ({ hookName, hookPath, useTypeScript, contentOverride }) => {
  const hookFileContent = `import React, { useEffect } from 'react';

export const ${hookName} = () => {

  ${contentOverride?.length > 0 ? contentOverride : `
  useEffect(() => {
    console.log('${hookName} mounted!');
  }, []);

  return {}`}
}
  
export default ${hookName}`;

  const hookFileName = `${hookName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  await writeFile(join(hookPath, hookFileName), hookFileContent);
};

module.exports = { reactHookFactory };
