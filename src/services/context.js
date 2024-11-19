const { prompt } = require('inquirer');
const { findNearestProject, projectHasTypeScript } = require('./_common');
const { exists, ensureDir } = require('fs-extra');
const { reactContextFactory } = require('./_templates/esyr/src/contexts');
const { getCompletionMsg } = require('../providers/joke.provider');

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
    const _exists = await exists(contextPath);
    if (_exists) {
      console.error(`\n\n\n'${contextName}' already exists!\n\n\n`);
      return;
    }
    await ensureDir(contextPath);

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
