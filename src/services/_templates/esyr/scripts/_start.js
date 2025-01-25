const startScriptContent = `
const liveServer = require('live-server');
const {
  cleanDist,
  buildContentScripts,
  buildWorkers,
  buildMainBundle,
  copyPublicFiles,
  buildStyleFiles,
  watch,
  formatFiles,
} = require('./common');

let hasError = false;

const buildSteps = {
  initial: [
    [cleanDist, 'cleanDist'],
    [formatFiles, 'formatFiles'],
    [buildMainBundle, 'buildMainBundle'],
    [buildWorkers, 'buildWorkers'],
    [buildContentScripts, 'buildContentScripts'],
    [buildStyleFiles, 'buildStyleFiles'],
    [copyPublicFiles, 'copyPublicFiles'],
  ],
  rebuild: [
    [formatFiles, 'formatFiles'],
    [buildMainBundle, 'buildMainBundle'],
    [buildWorkers, 'buildWorkers'],
    [buildContentScripts, 'buildContentScripts'],
    [buildStyleFiles, 'buildStyleFiles'],
  ],
};
const runBuildSteps = (steps, type = 'rebuild') => {
  if (hasError) {
    console.log('⚠️ Fix errors to resume building');
    return;
  }

  console.log(type === 'initial' ? 'Building...' : '🔄 Rebuilding...');

  for (const [fn, name] of steps) {
    try {
      fn();
    } catch (err) {
      hasError = true;
      console.error('❌ ' + name + ' failed:', err.message);
      console.log('⚠️ Watching for fixes...');
      continue; // Skip to next step instead of returning
    }
  }

  if (!hasError) {
    console.log('✨ Build complete');
  }
};

runBuildSteps(buildSteps.initial, 'initial');

watch('src/**/*', {}, () => {
  try {
    runBuildSteps(buildSteps.rebuild);
  } catch (err) {
    console.error('❌ Build failed:', err.message);
    console.log('⚠️ Watching for fixes...');
  }
});

try {
  liveServer.start({
    port: 8080,
    host: '0.0.0.0',
    root: 'dist',
    open: false,
    wait: 500,
    file: 'index.html',
    logLevel: 2,
  });
} catch (err) {
  console.error('Failed to start dev server:', err.message);
}

// Notify user of error
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught error:', err.message);
  console.log('\n🚧 Watching for fixes...\n');
});

process.on('SIGINT', () => {
  console.log('\n\nUser initiated shutdown...\n\n');
  process.exit(0);
});

`;

module.exports = { startScriptContent };
