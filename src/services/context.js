const { prompt } = require('inquirer');
const { findNearestProject, projectHasTypeScript } = require('../utils/project.util');
const { exists, ensureDir } = require('fs-extra');
const { reactContextFactory } = require('./_templates/esyr/src/contexts');
const { getCompletionMsg } = require('../providers/joke.provider');
const {PrefProvider} = require('../providers/pref.provider');

const addContextCmds = ['ctx', 'context'];

async function addContext() {
  const { contextName } = await prompt([
    {
      type: 'input',
      name: 'contextName',
      message: 'What is the name of the new context?',
      default: 'NewContext',
    },
  ]);

  const useTypeScript = projectHasTypeScript();
  const resolvedPath = await PrefProvider.tryAskPath('context', 'src/contexts');
  const contextPath = findNearestProject(resolvedPath);

  try {
    const _exists = await exists(`${resolvedPath}/${contextName}.${useTypeScript ? 'tsx' : 'jsx'}`);
    if (_exists) {
      const { overwriteExisting } = await prompt([
        {
          type: 'confirm',
          name: 'overwriteExisting',
          message: `\n\n\n'${contextName}' already exists! Do you want to overwrite it?\n`, 
          default: false,
        }
      ]);
      if (!overwriteExisting) {
        const abortMsg = getAbortMsg(contextName);
        console.log(`\n\n\n${abortMsg}\n\n\n`);
        return;
      }
    } else {
      // Only create the directory if it doesn't exist
      await ensureDir(resolvedPath);
    }

    await reactContextFactory({
      contextName,
      contextPath,
      useTypeScript,
    });
    const completedMessage = getCompletionMsg(contextName);
    console.log(`\n\n\n${completedMessage}\n\n\n`);
  } catch (err) {
    console.error('\n\n\nSomething went wrong!\n', err);
  }
}

module.exports = { addContext, addContextCmds };
