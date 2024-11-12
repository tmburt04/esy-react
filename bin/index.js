#!/usr/bin/env node --no-warnings

const { addProjectCmds, addProject } = require('../src/services/project');
const { addComponent, addComponentCmds } = require('../src/services/component');
const { addHookCmds, addHook } = require('../src/services/hook');
const { addPageCmds, addPage } = require('../src/services/page');
const { addContextCmds, addContext } = require('../src/services/context');
const { addServiceWorkerCmds, addServiceWorker } = require('../src/services/service-worker');
const { addContentScriptCmds, addContentScript } = require('../src/services/content-script');
const { findNearestProject, projectHasBrowserExt } = require('../src/services/_common');
const { getRandomWelcome, getRandomActionPrompt } = require('../src/providers/joke.provider');
const { initBrowserExtCmds, initBrowserExt, fetchContentScripts } = require('../src/services/browser-ext');
const { resetEnv, getEnv } = require('../src/utils/env.util');

const nearestPublicPath = findNearestProject('public', false);

const spacer = Array(3).fill('.....').join('');

const resetCmds = ['reset','rs'];

const displayWelcome = () => {
  const welcome = getRandomWelcome()
  const actionPrompt = getRandomActionPrompt()
  const version = process.env.npm_package_version;
  const hasClaude = process.env.CLAUDE ? '🐶' : '';
  const llmList = [];
  const config = getEnv()
  console.warn(process.env);
  console.warn(`
    ESYR - Esy React CLI ${version && `(v${version})`}\n

    General Commands:\n
    \tProject${spacer}${menuStatus.project ? `[${addProjectCmds.join(', ')}]` : 'UNAVAILABLE'}
    \tPage${spacer}${menuStatus.page ? `[${addPageCmds.join(', ')}]` : 'UNAVAILABLE'}
    \tComponent${spacer}${menuStatus.component ? `[${addComponentCmds.join(', ')}]` : 'UNAVAILABLE'}
    \tHook${spacer}${menuStatus.hook ? `[${addHookCmds.join(', ')}]` : 'UNAVAILABLE'}
    \tContext${spacer}${menuStatus.context ? `[${addContextCmds.join(', ')}]\n` : 'UNAVAILABLE'}
    \tService Worker${spacer}${menuStatus.serviceWorker ? `[${addServiceWorkerCmds.join(', ')}]` : 'UNAVAILABLE'}
    
    Browser Ext Commands:\n
    \tInitialize Extension*${spacer}${menuStatus.browserExt ? `[${initBrowserExtCmds.join(', ')}]` : 'UNAVAILABLE'}
    \tContent Script*${spacer}${menuStatus.contentScript ? `[${addContentScriptCmds.join(', ')}]` : 'UNAVAILABLE'}

    Troubleshooting:\n\n${llmList?.length ? `LLM Support: ${llmList.join(', ')}\n` : ''}\tReset${spacer}[${resetCmds.join(', ')}]\n

    ${welcome}\n
    ${actionPrompt}\n
`);
  }

/**
 * Base CLI commands all disabled by default
 */
let menuStatus = {
  project: false,
  page: false,
  component: false,
  hook: false,
  context: false,
  serviceWorker: false,
  browserExt: false,
  contentScript: false,
};

return (async () => {

  if (process.argv.find((_arg) => ['--help', '-h'].includes(_arg?.toLowerCase()))) {
    return displayWelcome();
  }
  
  if (process.argv.find((_arg) => resetCmds.includes(_arg?.toLowerCase()))) {
    return resetEnv().catch(console.error);
  }

  /**
   * if no project exists, only allow project creation
   */
  if (!nearestPublicPath) {
    // Only ALLOW project creation if NO project exists
    menuStatus.project = true;
    if (process.argv.find((_arg) => addProjectCmds.includes(_arg?.toLowerCase()))) {
      return addProject().catch(console.error);
    }
  } else {
    const existingExt = projectHasBrowserExt(false);

    // Creates a Service Worker that can be used in a webapp or a browser extension
    menuStatus.serviceWorker = true;
    if (process.argv.find((_arg) => addServiceWorkerCmds.includes(_arg?.toLowerCase()))) {
      return addServiceWorker().catch(console.error);
    }

    // Creates REACT Page
    menuStatus.page = true;
    if (process.argv.find((_arg) => addPageCmds.includes(_arg?.toLowerCase()))) {
      return addPage().catch(console.error);
    }
    // Creates REACT Component
    menuStatus.component = true;
    if (process.argv.find((_arg) => addComponentCmds.includes(_arg?.toLowerCase()))) {
      return addComponent().catch(console.error);
    }
    // Creates REACT Hook
    menuStatus.hook = true;
    if (process.argv.find((_arg) => addHookCmds.includes(_arg?.toLowerCase()))) {
      return addHook().catch(console.error);
    }
    // Creates REACT context
    menuStatus.context = true;
    if (process.argv.find((_arg) => addContextCmds.includes(_arg?.toLowerCase()))) {
      return addContext().catch(console.error);
    }

    // Initializes the project as a Browser Extension
    if (!existingExt) {
      menuStatus.browserExt = true;
      if (process.argv.find((_arg) => initBrowserExtCmds.includes(_arg?.toLowerCase()))) {
        return initBrowserExt().catch(console.error);
      }
    } else {
      // Creates a content script (for a browser extension to overlay on a page)
      menuStatus.contentScript = true;
      if (process.argv.find((_arg) => addContentScriptCmds.includes(_arg?.toLowerCase()))) {
        return addContentScript().catch(console.error);
      }
    }
  }
  return displayWelcome();
})();