const { join } = require('path');
const { kebabCase } = require('lodash');
const { writeFile } = require('fs-extra');

/**
 * @name reactComponentFactory
 * @description Builds a React component file (depending on the user's choice of TypeScript and SASS)
 */
const reactComponentFactory = async ({ useTypeScript, useSass, componentName, componentPath, contentOverride }) => {
  // Validate required arguments
  const requiredArgs = [useTypeScript, useSass, componentName, componentPath];
  if (requiredArgs.some((arg) => arg == undefined || arg == null)) {
    throw new Error('Missing required arguments');
  }

  const kebabCaseName = kebabCase(componentName);
  const styleFileName = `${componentName}.${useSass ? 'scss' : 'css'}`;
  const componentFileName = `${componentName}.${useTypeScript ? 'tsx' : 'jsx'}`;

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
  return (
    <div className="${kebabCaseName}-container">
      ${contentOverride?.length > 0 ? contentOverride : `<p>${componentName} Component body</p>`}
    </div>
  )
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

module.exports = { reactComponentFactory };
