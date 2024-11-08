const { kebabCase } = require('lodash');

/**
 * Builds a React pop up file
 */
const reactPopUpFactory = ({ popupName }) => {
  const kebabCaseName = kebabCase(popupName);

  return `import React from 'react';
      
      export const NewPopUp = (props) => {

        return (
          <div className="${kebabCaseName}-container">
            <p>Pop Up body</p>
          </div>
        )
      }`;
};
module.exports = { reactPopUpFactory };
