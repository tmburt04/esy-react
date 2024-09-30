const { join } = require('path');
const { kebabCase } = require('lodash');
const { writeFile } = require('fs-extra');

/**
 * @name reactPageFactory
 * @description Builds a React page file (depending on the user's choice of TypeScript and SASS)
 */
const reactPageFactory = async ({ useTypeScript, useSass, pageName, pagePath, contentOverride }) => {
  // Validate required arguments
  const requiredArgs = [useTypeScript, useSass, pageName, pagePath];
  if (requiredArgs.some((arg) => arg == undefined || arg == null)) {
    throw new Error('Missing required arguments');
  }

  const kebabCaseName = kebabCase(pageName);
  const styleFileName = `${pageName}.${useSass ? 'scss' : 'css'}`;
  const pageFileName = `${pageName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  let reactPropTypeDef = '',
    reactPropTypeUse = '';

  if (useTypeScript) {
    reactPropTypeDef = `
    export type ${pageName}Props = {
            id?: string;
            children?: any;
          }`;
    reactPropTypeUse = `: ${pageName}Props`;
  }

  const pageFileContent = `
import React from 'react';
import './${styleFileName}';${reactPropTypeDef}
export const ${pageName} = (props${reactPropTypeUse}) => {
  return (
    <div className="${kebabCaseName}-page-container">
      <h1>Page body</h1>
        <section className="${kebabCaseName}-section">
          ${contentOverride?.length > 0 ? contentOverride : `{props?.children ? props?.children : <p>${pageName} Page body</p>}`}
        </section>
    </div>
  )
}          
export default {${pageName}};
`;

  const pageStyleFileContent = `.${kebabCaseName}-page-container .${kebabCaseName}-section {
    @apply h-10 w-10 bg-black text-white flex items-center justify-center;
}`;

  await Promise.all([
    writeFile(join(pagePath, pageFileName), pageFileContent), // Create page file
    writeFile(join(pagePath, styleFileName), pageStyleFileContent), // Create style file
  ]);
};

module.exports = { reactPageFactory };
