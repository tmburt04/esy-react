const { writeFile } = require('fs-extra');
const { join } = require('path');

/**
 * Builds a React hook file
 */
const reactHookFactory = async ({ hookName, hookPath, useTypeScript, contentOverride }) => {
  let hookFileContent = `import React, { useEffect } from 'react';

export const ${hookName} = () => {

  ${contentOverride?.length > 0 ? contentOverride : `
  useEffect(() => {
    console.log('${hookName} mounted!');
  }, []);

  return {}`}
}
  
export default ${hookName}`;

// Override the file content if provided (b/c we want claude to handle function parameters)
if (contentOverride?.length > 0) {
  hookFileContent = contentOverride;
}

  const hookFileName = `${hookName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  await writeFile(join(hookPath, hookFileName), hookFileContent);
};

module.exports = { reactHookFactory };
