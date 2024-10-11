const startScriptContent = `const liveServer = require('live-server');
const { cleanDist, buildContentScripts, buildWorkers, buildMainBundle, copyPublicFiles, buildStyleFiles, watch, formatFiles } = require('./common');

// Initial build
cleanDist();
formatFiles();
buildMainBundle();
buildWorkers();
buildContentScripts();
buildStyleFiles();
copyPublicFiles();

// Watch for file changes
watch('src/**/*', {}, (event, path) => {
  console.log('Files have changed! Rebuilding...');
  formatFiles();
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
