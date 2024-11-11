const { join } = require('path');
const { prompt } = require('inquirer');
const { findNearestProject, projectHasTypeScript } = require('./_common');
const { ensureDir, writeFile } = require('fs-extra');

const addPopUpCmds = ['popup', 'pop-up'];

async function addPopUp() {
  const { popUpName } = await prompt([
    {
      type: 'input',
      name: 'popUpName',
      message: 'What is the name of the new content script?',
      default: 'pu-example',
    },
  ]);

  const useTypeScript = projectHasTypeScript();
  const popUpPath = findNearestProject('src/pop-ups');

  if (!popUpPath) {
    console.error(
      'Could not find a valid project directory. Please run this command in a project directory.'
    );
    return;
  }

  // Create custom directory
  await ensureDir(popUpPath);

  console.log(`Creating a new Pop up (for a browser ext) in ${popUpPath}`);

  const popUpFileContent = `
    import React from 'react';

    ${
      !useTypeScript
        ? ''
        : `export type ${componentName}Props = {
        id: string;
      }`
    }
      
      export const ${componentName} = (props${!useTypeScript ? '' : `:${componentName}Props`}) => {

        return (
          <div className="${styleClassName}-container">
            <p>Throw a page or a component in here!</p>
          </div>
        )
      }
    `;

  if (useTypeScript) {
    await writeFile(join(popUpPath, popUpName + '.ts'), popUpFileContent);
  } else {
    await writeFile(join(popUpPath, popUpName + '.js'), popUpFileContent);
  }

  console.log(
    `Service Worker created successfully! \n\n Please remember to register the service worker in your app. \n`
  );
}

module.exports = { addPopUp, addPopUpCmds };
