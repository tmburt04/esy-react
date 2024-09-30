const { prompt } = require('inquirer');
const { findNearestProject, projectHasTypeScript } = require('./_common');
const { exists, ensureDir } = require('fs-extra');
const { reactContextFactory } = require('./templates/esyr/src/contexts');

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
  const contextPath = findNearestProject('src/contexts');

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
    console.log(`\n\n\n'${contextName}' created successfully!\n\n\n`);
  } catch (err) {
    console.error('\n\n\nSomething went wrong!\n', err);
  }
}

module.exports = { addContext, addContextCmds };
