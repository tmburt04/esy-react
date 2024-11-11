const { join } = require('path');
const { prompt } = require('inquirer');
const subprocess = require('child_process');
const { packageJsonData } = require('./_templates/esyr/package.json');
const { buildScriptContent } = require('./_templates/esyr/scripts/_build');
const { commonScriptContent } = require('./_templates/esyr/scripts/_common');
const { startScriptContent } = require('./_templates/esyr/scripts/_start');
const { ensureDir, writeJson, writeFile } = require('fs-extra');
const { tsConfigJsonData } = require('./_templates/esyr/tsconfig.json');
const { indexHtmlContent } = require('./_templates/esyr/public/index.html');
const { indexComponentContent } = require('./_templates/esyr/src');
const { appComponentContent } = require('./_templates/esyr/src/app');
const { tailwindFactory } = require('./_templates/esyr/tailwind');
const { reactPageFactory } = require('./_templates/esyr/src/pages');
const { reactComponentFactory } = require('./_templates/esyr/src/components');
const { prettierFactory } = require('./_templates/esyr/prettier');
const { postcssFactory } = require('./_templates/esyr/postcss');

const addProjectCmds = ['proj', 'project'];

async function addProject() {
  const { projectName, useTypeScript, useSass, useFontAwesome } = await prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      default: 'esy-react-app',
    },
    {
      type: 'confirm',
      name: 'useTypeScript',
      message: 'Use Typescript?',
    },
    {
      type: 'confirm',
      name: 'useSass',
      message: 'Use SASS (.scss files)?',
    },
    {
      type: 'confirm',
      name: 'useFontAwesome',
      message: 'Use Font Awesome?',
    },
  ]);

  // Create project directory
  const projectPath = join(process.cwd(), projectName);
  await ensureDir(projectPath);

  console.log(`\n\nCreating a new React project '${projectName}'`);

  packageJsonData.name = projectName;

  if (useTypeScript) {
    packageJsonData.devDependencies['@types/react'] = '^18.3.4';
    packageJsonData.devDependencies['@types/react-dom'] = '^18.3.0';
    packageJsonData.dependencies['typescript'] = '^5.5.4';

    // Create tsconfig.json
    await writeJson(join(projectPath, 'tsconfig.json'), tsConfigJsonData, { spaces: 2 });
  }

  // Add SASS dependencies
  if (useSass) {
    packageJsonData.devDependencies['sass'] = '^1.78.0';
    packageJsonData.dependencies['esbuild-sass-plugin'] = '^3.3.1';
  }

  // Add Font Awesome dependencies
  if (useFontAwesome) {
    packageJsonData.dependencies['@fortawesome/fontawesome-svg-core'] = '^6.6.0';
    packageJsonData.dependencies['@fortawesome/free-brands-svg-icons'] = '^6.6.0';
    packageJsonData.dependencies['@fortawesome/free-regular-svg-icons'] = '^6.6.0';
    packageJsonData.dependencies['@fortawesome/free-solid-svg-icons'] = '^6.6.0';
    packageJsonData.dependencies['@fortawesome/react-fontawesome'] = '^0.2.2';
  }

  // Create src directory
  const srcPath = join(projectPath, 'src');
  await ensureDir(srcPath);

  // Create public directory
  const publicPath = join(projectPath, 'public');
  await ensureDir(publicPath);

  // Create scripts directory
  const scriptsPath = join(projectPath, 'scripts');
  await ensureDir(scriptsPath);

  // Create pages directory
  const pagesPath = join(srcPath, 'pages');
  await ensureDir(pagesPath);

  // Create components directory
  const componentsPath = join(srcPath, 'components');
  await ensureDir(componentsPath);

  const initialPageName = 'MainPage';
  await ensureDir(`${pagesPath}/${initialPageName}`);

  // Write all the files
  await Promise.all([
    writeJson(join(projectPath, 'package.json'), packageJsonData, { spaces: 2 }),

    // Create scripts/common.js
    writeFile(join(scriptsPath, 'common.js'), commonScriptContent({useSass}).trim()),

    // Create scripts/_start.js
    writeFile(join(scriptsPath, '_start.js'), startScriptContent.trim()),

    // Create scripts/_build.js
    writeFile(join(scriptsPath, '_build.js'), buildScriptContent.trim()),

    // Create index.tsx
    writeFile(join(srcPath, 'index.tsx'), indexComponentContent({ projectName }).trim()),

    // Create App.tsx
    writeFile(join(srcPath, 'App.tsx'), appComponentContent({ projectName, useTypeScript, pageName: initialPageName }).trim()),

    // Create public/index.html
    writeFile(join(publicPath, 'index.html'), indexHtmlContent({ projectName }).trim()),

    // Create src/pages/MainPage.tsx (Sample Page)
    reactPageFactory({
      useTypeScript,
      useSass,
      pageName: initialPageName,
      pagePath: `${pagesPath}/${initialPageName}`,
      contentOverride: `<div className='py-5 grid gap-5'>
          <div className='px-5'>
            <h1 className='text-2xl font-black'>Welcome to ${projectName}</h1>
            <p>Scaffold out some web components using the esy-react cli!</p>
          </div>
          <div className='px-10 py-5 bg-black/10 grid gap-2.5'>
            <h2 className='text-lg font-bold'>Commands:</h2>
            <ul className='pl-5'>
              <li>Create a Page...............<span className='bg-black px-2 rounded text-white select-all'>esyr page</span></li>
              <li>Create a Component...............<span className='bg-black px-2 rounded text-white select-all'>esyr component</span></li>
              <li>Create a Hook...............<span className='bg-black px-2 rounded text-white select-all'>esyr hook</span></li>
              <li>Create a Context...............<span className='bg-black px-2 rounded text-white select-all'>esyr context</span></li>
              <li>Create a ServiceWorker...............<span className='bg-black px-2 rounded text-white select-all'>esyr worker</span></li>
            </ul>
            <h2 className='text-lg font-bold'>Browser Extension:</h2>
            <ul className='pl-5'>
              <li>Initialize the project as a Browser Ext...............<span className='bg-black px-2 rounded text-white select-all'>esyr browser-ext</span></li>
              <li>Create a Content Script...............<span className='bg-black px-2 rounded text-white select-all'>esyr content-script</span></li>
            </ul>
          </div>
        </div>`,
    }),

    // Create src/components/HelloComponent.tsx (Sample Page)
    reactComponentFactory({
      useTypeScript,
      useSass,
      componentName: 'HelloComponent',
      componentPath: `${componentsPath}/HelloComponent`,
      contentOverride: `<div className='px-5 font-black'>
            <p>Hello Component!</p>
          </div>`,
    }),
    // Add Tailwind CSS
    tailwindFactory({ projectPath, projectName }),
    
    // Add PostCSS
    postcssFactory({ projectPath }),

    // Add Prettier
    prettierFactory({projectPath}),

    // Add .gitignore
    writeFile(join(projectPath, '.gitignore'), `dist
node_modules/**/*
dist/*.(js|css|json|map|html)
.DS_STORE`),
  ]);

  console.log('\n\nProject created successfully!\n');
  console.log('Installing dependencies...\n\n');
  subprocess.execSync(`cd ${projectName} && npm install && npm run format`);
}

module.exports = { addProject, addProjectCmds };
