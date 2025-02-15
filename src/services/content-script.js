const { prompt } = require('inquirer');
const { findNearestProject, projectHasTypeScript, projectHasBrowserExt } = require('../utils/project.util');
const { ensureDir } = require('fs-extra');
const { reactContentScriptFactory } = require('./_templates/esyr/src/content-scripts');
const { getCompletionMsg } = require('../providers/joke.provider');
const { PrefProvider } = require('../providers/pref.provider');

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

  const resolvedPath = await PrefProvider.tryAskPath('content script', 'src/content-scripts');
  const contentScriptPath = findNearestProject(resolvedPath);

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
        const abortMsg = getAbortMsg(contentScriptName);
        console.log(`\n\n\n${abortMsg}\n\n\n`);
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
    const completedMessage = getCompletionMsg(contentScriptName);
    console.log(`\n\n\n${completedMessage}\n\n\n`);
  } catch (err) {
    console.error('\n\n\nSomething went wrong!\n', err);
  }
}

module.exports = { addContentScript, addContentScriptCmds };
