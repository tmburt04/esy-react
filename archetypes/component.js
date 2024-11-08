const { prompt } = require('inquirer');
const { findNearestProject, projectHasSass, projectHasTypeScript } = require('./_common');
const { reactComponentFactory } = require('./templates/esyr/src/components');
const { ensureDir, exists } = require('fs-extra');
const { tryAskClaude } = require('../utils/claude/claude.provider');

const addComponentCmds = ['c', 'component'];

/**
 * @description Creates a new boilerplate react component in the nearest project.
 * Will not overwrite existing components.
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

  const componentPath = findNearestProject(`./src/components/${componentName}`);
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
    const codeOverride = await tryAskClaude();

    await reactComponentFactory({
      componentName,
      componentPath,
      useSass,
      useTypeScript,
      contentOverride: codeOverride,
    });
    console.log(`\n\n\n'${componentName}' created successfully!\n\n\n`);
  } catch (err) {
    console.error('\n\n\nSomething went wrong!\n', err);
  }
}

module.exports = { addComponent, addComponentCmds };
