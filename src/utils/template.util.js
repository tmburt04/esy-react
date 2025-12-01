const { Eta } = require('eta');
const { join, dirname } = require('path');
const { existsSync } = require('fs');

// Resolve templates path - works in both dev and bundled contexts
const resolveTemplatesPath = () => {
  // When bundled/installed globally, find templates relative to this module
  // require.resolve finds the actual package location, not symlinks
  try {
    const pkgPath = dirname(require.resolve('esy-react-cli/package.json'));
    const installedPath = join(pkgPath, 'templates');
    if (existsSync(installedPath)) {
      return installedPath;
    }
  } catch (_) {
    // Not installed as a package, fall through to dev path
  }
  
  // Development path (from src/utils/)
  const devPath = join(__dirname, '../../templates');
  if (existsSync(devPath)) {
    return devPath;
  }
  
  // Fallback: relative to current file in bundled context
  return join(__dirname, 'templates');
};

const eta = new Eta({
  views: resolveTemplatesPath(),
  autoEscape: false, // Disable HTML escaping - templates are for code, not HTML
});

const renderScaffold = (name, data) => eta.render(`scaffolds/${name}`, data);
const renderPrompt = (name, data) => eta.render(`prompts/${name}`, data);

module.exports = { renderScaffold, renderPrompt };

