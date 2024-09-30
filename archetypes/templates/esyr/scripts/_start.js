const startScriptContent = `const liveServer = require('live-server');
const { cleanDist, buildContentScripts, buildWorkers, buildMainBundle, copyPublicFiles, buildStyleFiles, watch } = require('./common');

// Initial build
cleanDist();
buildWorkers();
buildContentScripts();
buildMainBundle();
buildStyleFiles();
copyPublicFiles();

// Watch for file changes
watch('src/**/*', {}, (event, path) => {
  console.log('Files have changed! Rebuilding...');
  buildMainBundle();
  buildWorkers();
  buildContentScripts();
  buildStyleFiles();
  copyPublicFiles();
})

// Start live server
liveServer.start({
  port: 8080,
  host: "0.0.0.0",
  root: "dist",
  open: false,
  file: "index.html",
  logLevel: 2,
});

console.log('Watching for file changes...');`;

module.exports = { startScriptContent };
