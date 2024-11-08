const { prompt } = require('inquirer');
const { findNearestProject, projectHasTypeScript, projectHasBrowserExt } = require('./_common');
const { ensureDir } = require('fs-extra');
const { reactContentScriptFactory } = require('./templates/esyr/src/content-scripts');

const addContentScriptCmds = ['cs', 'content-script'];

/**
 * @description Adds a new content script to the projects manifest.json
 */
async function addContentScript() {
  const { contentScriptName } = await prompt([
    {
      type: 'input',
      name: 'contentScriptName',
      message: 'What is the name of the new content script?',
      default: 'cs-example',
    },
  ]);

  const useTypeScript = projectHasTypeScript();

  projectHasBrowserExt(); // ENSURE the project has a browser extension configured

  const contentScriptPath = findNearestProject('src/content-scripts');

  try {
    const _exists = await exists(contentScriptPath);
    if (_exists) {
      const { overwriteExisting } = await prompt([
        {
          type: 'confirm',
          name: 'overwriteExisting',
          message: `\n\n\n'${contentScriptName}' already exists! Do you want to overwrite it?\n`, 
          default: false,
        }
      ]);
      if (!overwriteExisting) {
        console.log(`\n\n\n'${contentScriptName}' ignored.\n\n\n`);
        return;
      }
    } else {
      // Only create the directory if it doesn't exist
      await ensureDir(contentScriptPath);
    }

    await reactContentScriptFactory({
      contentScriptName,
      contentScriptPath,
      useTypeScript,
    });
    console.log(`\n\n\n'${contentScriptName}' created successfully!\n\n\n`);
  } catch (err) {
    console.error('\n\n\nSomething went wrong!\n', err);
  }
}

module.exports = { addContentScript, addContentScriptCmds };
