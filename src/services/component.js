const { prompt } = require('inquirer');
const { findNearestProject, projectHasSass, projectHasTypeScript } = require('../utils/project.util');
const { reactComponentFactory } = require('./_templates/esyr/src/components');
const { ensureDir, exists } = require('fs-extra');
const { PrefProvider } = require('../providers/pref.provider');
const { getCompletionMsg, getFailureMsg, getAbortMsg } = require('../providers/joke.provider');
const { tryAskLLM } = require('../providers/llm.provider');

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

  const resolvedPath = await PrefProvider.tryAskPath('component', 'src/components');
  const groupPath = findNearestProject(resolvedPath);
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
        const abortMsg = getAbortMsg(componentName);
        console.log(`\n\n\n${abortMsg}\n\n\n`);
        return;
      }
    }

    // Asks the user if they want to use Claude to generate the content
    const fileOverwrite = await tryAskLLM('component', componentName);

    // Create the directory if it doesn't exist
    await ensureDir(componentPath);
    
    // Create component file
    await reactComponentFactory({
      componentName,
      componentPath,
      useSass,
      useTypeScript,
      fileOverwrite,
    });
    const completedMessage = getCompletionMsg(componentName);
    console.log(`\n\n\n${completedMessage}\n\n\n`);
  } catch (err) {
    const errMessage = getFailureMsg();
    console.error(`\n\n\n${errMessage}\n`, err);
  }
}

module.exports = { addComponent, addComponentCmds };
