const { prompt } = require('inquirer');
const { projectHasTypeScript, projectHasSass, findNearestProject } = require('./_common');
const { reactPageFactory } = require('./_templates/esyr/src/pages');
const { ensureDir, exists } = require('fs-extra');
const { PrefProvider } = require('../providers/pref.provider');
const { tryAskLLM } = require('../utils/llm.util');
const { getCompletionMsg, getFailureMsg } = require('../providers/joke.provider');

/**
 * @description Commands that will trigger the addPage function.
 */
const addPageCmds = ['page'];

/**
 * @description Creates a new boilerplate react page to the nearest project.
 * Will not overwrite existing pages. unless the user confirms.
 */
async function addPage() {

  const { pageName } = await prompt([
    {
      type: 'input',
      name: 'pageName',
      message: 'What is the name of the new page?',
      default: 'NewPage',
    },
  ]);

  const groupPath = findNearestProject(`./src/pages`);
  // const resolvedPath = await PrefProvider.tryAskPath('page', groupPath);
  const pagePath = `${groupPath}/${pageName}`;

  const useTypeScript = projectHasTypeScript();
  const useSass = projectHasSass();

  try {
    const _exists = await exists(pagePath);
    if (_exists) {
      const { overwriteExisting } = await prompt([
        {
          type: 'confirm',
          name: 'overwriteExisting',
          message: `\n\n\n'${pageName}' already exists! Do you want to overwrite it?\n`, 
          default: false,
        }
      ]);
      if (!overwriteExisting) {
        console.log(`\n\n\n'${pageName}' ignored.\n\n\n`);
        return;
      }
    } else {
      // Only create the directory if it doesn't exist
      await ensureDir(pagePath);
    }

    // Asks the user if they want to use Claude to generate the page content
    const codeOverride = await tryAskLLM();

    await reactPageFactory({
      pageName,
      pagePath,
      useSass,
      useTypeScript,
      contentOverride: codeOverride
    });
    const completedMessage = getCompletionMsg(pageName);
    console.log(`\n\n\n${completedMessage}\n\n\n`);
  } catch (err) {
    const errMessage = getFailureMsg();
    console.error(`\n\n\n${errMessage}\n`, err);
  }
}

module.exports = { addPage, addPageCmds };
