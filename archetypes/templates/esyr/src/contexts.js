const { join } = require('path');
const { writeFile } = require('fs-extra');

/**
 * Builds a React component file
 */
const reactContextFactory = async ({ useTypeScript, contextPath, contextName }) => {
  let contextType = '',
    dftContextValue = '',
    contextProps = '',
    initialContextType = '',
    contextPropTypeDef = '';

  if (useTypeScript) {
    contextType = `\n\nexport type ${contextName}Type = {}\n`;
    dftContextValue = ` as ${contextName}Type`;
    contextProps = `: ${contextName}PropsType`;
    initialContextType = `<${contextName}Type>`;
    contextPropTypeDef = `export type ${contextName}PropsType = {
  children?: any;
}`;
  }

  const contextFileContent = `
import React, { useContext, useEffect } from 'react'${contextType}

export const defaultContext = {}${dftContextValue};
export const ${contextName} = React.createContext${initialContextType}(defaultContext)${contextPropTypeDef}

export const ${contextName}Provider = ({ children }${contextProps}) => {

useEffect(() => {
    console.log('${contextName} mounted!')
}, [])

  return (
    <${contextName}.Provider value={{}${dftContextValue}}>
      {children}
    </${contextName}.Provider>
  )
}
`;

  const contextFileName = `${contextName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  await writeFile(join(contextPath, contextFileName), contextFileContent);
};
module.exports = { reactContextFactory };
