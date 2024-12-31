const { join } = require('path');
const { existsSync, readJsonSync, readdir, ensureDir, writeJson, writeFile } = require('fs-extra');
const { manifestJsonData } = require('./_templates/esyr/public/manifest.json');
const { extIndexHtmlContent } = require('./_templates/esyr/public/extIndex.html');
const { findNearestProject, projectHasBrowserExt } = require('../utils/project.util');

const initBrowserExtCmds = ['ext', 'browser-ext'];

/**
 * * Fetch the content scripts in the nearest project's src/content-scripts directory.
 */
async function fetchContentScripts() {
  const nearestProjPath = findNearestProject();
  if (!nearestProjPath) {
    console.error(
      'Could not find a valid project directory. Please run this command in a project directory.'
    );
    return;
  }
  const contentScriptsPath = join(nearestProjPath, 'src', 'content-scripts');
  if (!existsSync(contentScriptsPath)) {
    console.error(
      'Could not find a valid content scripts directory. Please run this command in a project directory.'
    );
    return;
  }
  const contentScripts = await readdir(contentScriptsPath);
  return contentScripts;
}

/**
 * Initialize a browser extension in the nearest project directory.
 */
async function initBrowserExt() {
  const hasExistingExt = projectHasBrowserExt(false);
  if (hasExistingExt) {
    console.error('A browser extension already exists in this project.');
    return;
  }
  const nearestProjPath = findNearestProject();
  const manifestPath = join(nearestProjPath, 'public', 'manifest.json');
  const packagePath = join(nearestProjPath, 'package.json');
  const extIndexPath = join(nearestProjPath, 'public', 'ext', 'index.html');

  // Read package.json and manifest.json to determine if browser extension already exists
  const [packageJsonData, existingManifestData] = await Promise.all([
    readJsonSync(packagePath, { throws: false }),
    readJsonSync(manifestPath, { throws: false }),
  ]);

  if (!existingManifestData) {
    await ensureDir(join(nearestProjPath, 'public', 'ext'));

    // Create manifest.json with default values
    await writeJson(manifestPath, {
      ...manifestJsonData({name: packageJsonData.name, version: packageJsonData.version}),
      version: packageJsonData.version,
      short_name: packageJsonData.name,
      name: packageJsonData.name,
      action: {
        default_popup: '/ext/index.html',
        default_title: packageJsonData.name,
      },
    }, { spaces: 2 });

    await writeFile(extIndexPath, extIndexHtmlContent({ projectName: packageJsonData.name }).trim());
  }

  return false;
}

module.exports = { initBrowserExt, initBrowserExtCmds, fetchContentScripts };
