const buildScriptContent = `const { cleanDist, buildWorkers, buildContentScripts, buildMainBundle, copyPublicFiles } = require('./common');

// Initial build
cleanDist();
buildWorkers();
buildContentScripts();
buildMainBundle();
buildStyleFiles();
copyPublicFiles();`;

module.exports = { buildScriptContent };
