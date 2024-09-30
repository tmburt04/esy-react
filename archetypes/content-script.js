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
    const _exists = await exists(contextPath);
    if (_exists) {
      console.error(`\n\n\n'${contentScriptName}' already exists!\n\n\n`);
      return;
    }
    await ensureDir(contextPath);

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
