const { prompt } = require('inquirer');
const { findNearestProject, projectHasSass, projectHasTypeScript } = require('./_common');
const { reactComponentFactory } = require('./_templates/esyr/src/components');
const { ensureDir, exists } = require('fs-extra');
const { tryAskLLM } = require('../utils/llm.util');
const { PrefProvider } = require('../providers/pref.provider');
const { getCompletionMsg, getFailureMsg } = require('../providers/joke.provider');

const addComponentCmds = ['c', 'component'];

/**
 * @description Creates a new boilerplate react component in the nearest project.
 * Will not overwrite existing components. unless the user confirms.
 */
async function addComponent() {
  const { componentName } = await prompt([
    {
      type: 'input',
      name: 'componentName',
      message: 'What is the name of the new component?',
      default: 'NewComponent',
    },
  ]);

  const groupPath = findNearestProject(`./src/components`);
  // const resolvedPath = await PrefProvider.tryAskPath('component', groupPath);
  const componentPath = `${groupPath}/${componentName}`;

  const useTypeScript = projectHasTypeScript();
  const useSass = projectHasSass();

  try {
    const _exists = await exists(componentPath);
    if (_exists) {
      const { overwriteExisting } = await prompt([
        {
          type: 'confirm',
          name: 'overwriteExisting',
          message: `\n\n\n'${componentName}' already exists! Do you want to overwrite it?\n`, 
          default: false,
        }
      ]);
      if (!overwriteExisting) {
        console.log(`\n\n\n'${componentName}' ignored.\n\n\n`);
        return;
      }
    } else {
      // Only create the directory if it doesn't exist
      await ensureDir(componentPath);
    }

    // Asks the user if they want to use Claude to generate the content
    const codeOverride = await tryAskLLM();

    await reactComponentFactory({
      componentName,
      componentPath,
      useSass,
      useTypeScript,
      contentOverride: codeOverride,
    });
    const completedMessage = getCompletionMsg(componentName);
    console.log(`\n\n\n${completedMessage}\n\n\n`);
  } catch (err) {
    const errMessage = getFailureMsg();
    console.error(`\n\n\n${errMessage}\n`, err);
  }
}

module.exports = { addComponent, addComponentCmds };
