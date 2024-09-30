const {prompt} = require('inquirer');
const { projectHasTypeScript, projectHasSass, findNearestProject } = require('./_common');
const { reactPageFactory } = require('./templates/esyr/src/pages');
const {ensureDir, exists} = require('fs-extra');

const addPageCmds = ['page'];

/**
 * @description Creates a new boilerplate react page to the nearest project.
 * Will not overwrite existing pages.
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

  const pagePath = findNearestProject(`./src/pages/${pageName}`);
  const useTypeScript = projectHasTypeScript();
  const useSass = projectHasSass();

  try {
    const _exists = await exists(pagePath);
    if (_exists) {
      console.error(`\n\n\n'${pageName}' already exists!\n\n\n`);
      return;
    }
    await ensureDir(pagePath);

    await reactPageFactory({
      pageName,
      pagePath,
      useSass,
      useTypeScript,
    });
    console.log(`\n\n\n'${pageName}' created successfully!\n\n\n`);
  } catch (err) {
    console.error('\n\n\nSomething went wrong!\n', err);
  }
}

module.exports = { addPage, addPageCmds };
