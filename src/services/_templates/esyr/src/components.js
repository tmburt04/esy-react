const { join } = require('path');
const { writeFile, ensureDir } = require('fs-extra');
const { kebabCase } = require('../../../../utils/common.util');

/**
 * @name reactComponentFactory
 * @description Builds a React component file (depending on the user's choice of TypeScript and SASS)
 */
const reactComponentFactory = async ({ useTypeScript, useSass, componentName, componentPath, fileOverwrite, contentOverwrite }) => {
  // Validate required arguments
  const requiredArgs = [useTypeScript, useSass, componentName, componentPath];
  if (requiredArgs.some((arg) => arg == undefined || arg == null)) {
    throw new Error('Missing required arguments');
  }
  await ensureDir(componentPath);

  const kebabCaseName = kebabCase(componentName);
  const styleFileName = `${componentName}.${useSass ? 'scss' : 'css'}`;
  const componentFileName = `${componentName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  if (fileOverwrite) {
    await writeFile(join(componentPath, componentFileName), fileOverwrite); // Create component file
  } else {
  let reactPropTypeDef = '',
    reactPropTypeUse = '';

  if (useTypeScript) {
    reactPropTypeDef = `
    export type ${componentName}Props = {
            id?: string;
          }`;
    reactPropTypeUse = `: ${componentName}Props`;
  }

  const componentFileContent = `
import React from 'react';
import './${styleFileName}';${reactPropTypeDef}
export const ${componentName} = (props${reactPropTypeUse}) => {
      ${contentOverwrite?.length > 0 ? contentOverwrite : `return (
    <div className="${kebabCaseName}-container">
    <p>${componentName} Component body</p>
    </div>
  )`}
}          
export default ${componentName};
`;

  const componentStyleFileContent = `.${kebabCaseName}-container {
    @apply h-10 w-10 bg-black text-white flex items-center justify-center;
}`;

  await Promise.all([
    writeFile(join(componentPath, componentFileName), componentFileContent), // Create component file
    writeFile(join(componentPath, styleFileName), componentStyleFileContent), // Create style file
  ]);
};
};

module.exports = { reactComponentFactory };
