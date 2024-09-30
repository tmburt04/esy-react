const { prompt } = require('inquirer');
const { findNearestProject, projectHasSass, projectHasTypeScript } = require('./_common');
const { reactComponentFactory } = require('./templates/esyr/src/components');
const { ensureDir, exists } = require('fs-extra');

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
      console.error(`\n\n\n'${componentName}' already exists!\n\n\n`);
      return;
    }
    await ensureDir(componentPath);

    await reactComponentFactory({
      componentName,
      componentPath,
      useSass,
      useTypeScript,
    });
    console.log(`\n\n\n'${componentName}' created successfully!\n\n\n`);
  } catch (err) {
    console.error('\n\n\nSomething went wrong!\n', err);
  }
}

module.exports = { addComponent, addComponentCmds };
