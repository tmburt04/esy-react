const { join } = require('path');
const { prompt } = require('inquirer');
const { findNearestProject, projectHasTypeScript } = require('../utils/project.util');
const { ensureDir, writeFile } = require('fs-extra');
const { PrefProvider } = require('../providers/pref.provider');
const { tryAskLLM } = require('../providers/llm.provider');

const addServiceWorkerCmds = ['sw', 'worker', 'service-worker'];

async function addServiceWorker() {
  const { serviceWorkerName } = await prompt([
    {
      type: 'input',
      name: 'serviceWorkerName',
      message: 'What is the name of the new Service Worker?',
      default: 'example-worker',
    },
  ]);

  const useTypeScript = projectHasTypeScript();
  const resolvedPath = await PrefProvider.tryAskPath('service worker', 'src/workers');
  const serviceWorkerPath = findNearestProject(resolvedPath);

  if (!serviceWorkerPath) {
    console.error(
      'Could not find a valid project directory. Please run this command in a project directory.'
    );
    return;
  }

  // Create custom directory
  await ensureDir(serviceWorkerPath);

  console.log(`Creating a new Service Worker in '${resolvedPath}'`);

    // Asks the user if they want to use Claude to generate the content
    const codeOverride = await tryAskLLM('service worker');

  const serviceWorkerFileContent = codeOverride || `
    // Service Worker content
    `;

  if (useTypeScript) {
    await writeFile(join(serviceWorkerPath, serviceWorkerName + '.ts'), serviceWorkerFileContent);
  } else {
    await writeFile(join(serviceWorkerPath, serviceWorkerName + '.js'), serviceWorkerFileContent);
  }

  console.log(
    `Service Worker created successfully! \n\n Please remember to register the service worker in your app. \n`
  );
}

module.exports = { addServiceWorker, addServiceWorkerCmds };
