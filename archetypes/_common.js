const { existsSync } = require('fs-extra');
const { parse, join, dirname } = require('path');
const { cwd } = require('process');

/**
 * Locates the nearest project directory by searching for a package.json file.
 * @param {string} suffix - The path suffix to append to the project directory path.
 * @param {boolean} errIfNotFound - Whether to throw an error if no project is found. (default: true)
 */
function findNearestProject(suffix = '', errIfNotFound = true) {
  let currentDir = cwd();
  while (currentDir !== parse(currentDir).root) {
    const packageJsonPath = join(currentDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      const _path = currentDir;
      if (suffix?.startsWith('/')) {
        return _path + suffix;
      } else if (suffix?.length > 0) {
        return _path + '/' + suffix;
      }
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  if (errIfNotFound) throw new Error('No project found');
}

/**
 * Determine if the nearest project has a browser extension by checking for a manifest.json file.
 * @param {boolean} errIfNotFound - Whether to throw an error if no browser extension is found. (default: true)
 */
function projectHasBrowserExt(errIfNotFound = true) {
  const nearestPublicPath = findNearestProject('public');
  const manifestPath = join(nearestPublicPath, 'manifest.json');
  if (existsSync(manifestPath)) return true;
  if (errIfNotFound) throw new Error('No browser extension found');
  return false;
}

/**
 * Determine if the nearest project uses TypeScript by checking for a tsconfig.json file.
 */
function projectHasTypeScript() {
  const nearestProjPath = findNearestProject();
  const tsconfigPath = join(nearestProjPath, 'tsconfig.json');
  if (existsSync(tsconfigPath)) return true;
  return false;
}

/**
 * Determine if the nearest project uses SASS styling by checking for relevant dependencies in package.json.
 */
function projectHasSass() {
  const nearestProjPath = findNearestProject();
  const packageJsonPath = join(nearestProjPath, 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = require(packageJsonPath);
    const dependencyBlackList = ['sass', 'node-sass', 'sass-loader'];

    for (const dep of dependencyBlackList) {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        return true;
      }
    }
  }
  return false;
}

const validateFilePath = (path) => {
  if (!existsSync(path)) {
    console.error(`Error: '${path}' does not exist.`);
    process.exit(1);
  }
};

module.exports = {
  projectHasBrowserExt,
  validateFilePath,
  projectHasSass,
  projectHasTypeScript,
  findNearestProject,
};
