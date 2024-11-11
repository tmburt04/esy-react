const { prompt } = require('inquirer');
const { findNearestProject, projectHasTypeScript } = require('./_common');
const { exists, ensureDir } = require('fs-extra');
const { reactHookFactory } = require('./_templates/esyr/src/hooks');
const {PrefProvider} = require('../providers/pref.provider');

const addHookCmds = ['h', 'hook'];

/**
 * @description Creates a new boilerplate react hook in the nearest project.
 * Will not overwrite existing hooks. unless the user confirms.
 */
async function addHook() {
  const { hookName } = await prompt([
    {
      type: 'input',
      name: 'hookName',
      message: 'What is the name of the new hook?',
      default: 'useNewHook',
    },
  ]);


  const groupPath = findNearestProject(`./src/hooks`);
  const hookPath = await PrefProvider.tryAskPath('hook', groupPath);

  const useTypeScript = projectHasTypeScript();

  try {
    await ensureDir(hookPath);

    await reactHookFactory({
      hookName,
      hookPath,
      useTypeScript,
    });
    console.log(`\n\n\n'${hookName}' created successfully!\n\n\n`);
  } catch (err) {
    console.error('\n\n\nSomething went wrong!\n', err);
  }
}

module.exports = { addHook, addHookCmds };
