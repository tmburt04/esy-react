const { kebabCase } = require('lodash');

/**
 * Builds a React component file
 */
const reactComponentFactory = ({ useTypeScript, useSass, componentName }) => {
  const kebabCaseName = kebabCase(componentName);

  return `import React from 'react';
    import './NewComponent.css';
      
      export const NewComponent = (props) => {

        return (
          <div className="${kebabCaseName}-container">
            <p>Component body</p>
          </div>
        )
      }`;
};
module.exports = { reactComponentFactory };
