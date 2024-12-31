const { prompt } = require('inquirer');
const { findNearestProject, projectHasTypeScript } = require('../utils/project.util');
const { exists, ensureDir } = require('fs-extra');
const { reactHookFactory } = require('./_templates/esyr/src/hooks');
const {PrefProvider} = require('../providers/pref.provider');
const { getCompletionMsg } = require('../providers/joke.provider');
const { tryAskLLM } = require('../providers/llm.provider');

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


  const resolvedPath = await PrefProvider.tryAskPath('hook', 'src/hooks');
  const hookPath = findNearestProject(resolvedPath);

  const useTypeScript = projectHasTypeScript();

    // Asks the user if they want to use Claude to generate the hook content
    const codeOverride = await tryAskLLM();
  try {
    await ensureDir(hookPath);

    await reactHookFactory({
      hookName,
      hookPath,
      contentOverride: codeOverride,
      useTypeScript,
    });
    const completedMessage = getCompletionMsg(hookName);
    console.log(`\n\n\n${completedMessage}\n\n\n`);
  } catch (err) {
    console.error('\n\n\nSomething went wrong!\n', err);
  }
}

module.exports = { addHook, addHookCmds };
