const { join } = require('path');
const { writeFile, ensureDir } = require('fs-extra');

/**
 * @description Creates a new content script in the nearest project (IF a browser extension is configured). the manifest.json file will be updated to include the new content script.
 * Will not overwrite existing content scripts.
 */
const reactContentScriptFactory = async ({
  useTypeScript,
  contentScriptName,
  contentScriptPath,
}) => {
  // Validate required arguments
  const requiredArgs = [useTypeScript, contentScriptName, contentScriptPath];
  if (requiredArgs.some((arg) => arg == undefined || arg == null)) {
    throw new Error('Missing required arguments');
  }

  const contentScriptFileName = `${contentScriptName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  const contentScriptContent = `
    // content script content
    `;

  await writeFile(join(contentScriptPath, contentScriptFileName), contentScriptContent);

  const nearestProjPath = findNearestProject();
  const manifestPath = join(nearestProjPath, 'public', 'manifest.json');

  const manifestJsonData = await readJsonSync(manifestPath, { throws: false });

  if (manifestJsonData) {
    await ensureDir(join(nearestProjPath, 'public'));
    // Create manifest.json
    const manifestJson = {
      ...manifestJsonData,
      content_scripts: [
        ...manifestJsonData.content_scripts,
        {
          matches: ['https://*/*', 'http://*/*'],
          css: [`content-scripts/${contentScriptName}.css`],
          js: [`content-scripts/${contentScriptFileName}`],
        },
      ],
    };
    await writeJson(manifestPath, manifestJson, { spaces: 2 });
  }
};
module.exports = { reactContentScriptFactory };
