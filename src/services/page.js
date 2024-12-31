const { prompt } = require('inquirer');
const { projectHasTypeScript, projectHasSass, findNearestProject } = require('../utils/project.util');
const { reactPageFactory } = require('./_templates/esyr/src/pages');
const { ensureDir, exists } = require('fs-extra');
const { PrefProvider } = require('../providers/pref.provider');
const { getCompletionMsg, getFailureMsg, getAbortMsg } = require('../providers/joke.provider');
const { tryAskLLM } = require('../providers/llm.provider');

/**
 * @description Commands that will trigger the addPage function.
 */
const addPageCmds = ['page', 'p'];

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

  const resolvedPath = await PrefProvider.tryAskPath('page', 'src/pages');
  const groupPath = findNearestProject(resolvedPath);
  const pagePath = `${groupPath}/${pageName}`;

  const useTypeScript = projectHasTypeScript();
  const useSass = projectHasSass();

  try {
    const _exists = await exists(pagePath);
    if (_exists) {
      console.log('\n');
      const { overwriteExisting } = await prompt([
        {
          type: 'confirm',
          name: 'overwriteExisting',
          message: `'${pageName}' already exists! Do you want to overwrite it?`, 
          default: false,
        }
      ]);
      if (!overwriteExisting) {
        const abortMsg = getAbortMsg(pageName);
        console.log(`\n\n\n${abortMsg}\n\n\n`);
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
