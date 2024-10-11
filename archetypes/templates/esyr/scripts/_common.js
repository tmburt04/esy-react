const commonScriptContent = ({useSass}) => `const esbuild = require('esbuild');
const subprocess = require('child_process');
${!useSass ? '' : `const { sassPlugin } = require('esbuild-sass-plugin');`}

// Function to clean the dist directory
const cleanDist = () => {
  try {
    subprocess.execSync('rm -rf dist/*');
  } catch (e) {
    console.log(e);
  }
};

// Function to copy public files
const copyPublicFiles = () => {
  try {
    subprocess.execSync('cp -r public/ dist');
  } catch (e) {
    console.log(e);
  }
};

// Function to build style files
const buildStyleFiles = () => {
  try {
    subprocess.execSync('npm run build:styles');
  } catch (e) {
    console.log(e);
  }
};

// Function to format the styles files
const formatFiles = () => {
  try {
    subprocess.execSync('npm run format');
  } catch (e) {
    console.log(e);
  }
};

const DEFAULT_OPTIONS = {
  delay: 100,
  events: ['add', 'change', 'unlink'],
  fireFirst: false,
  fireLast: true,
  chokidarOptions: {
    ignoreInitial: true,
    followSymlinks: false,
  },
}

function watch(paths = [], options = {}, callback = () => { }) {
  options = { ...DEFAULT_OPTIONS, ...options }

  const chokidar = require('chokidar')
  const watcher = chokidar.watch(paths, options.chokidarOptions)

  const debounceEvent =
    (callback, time = DEFAULT_OPTIONS.delay, interval) =>
      (...args) => {
        clearTimeout(interval)
        interval = setTimeout(() => (options.fireLast ? callback(...args) : () => { }), time)
      }

  function onChange(event, path, stats, error) {
    if (error && watcher.listenerCount('error')) {
      watcher.emit('error', error)
      return
    }

    if (options.fireFirst) {
      callback(event, path, stats)
    }

    debounceEvent(callback(event, path, stats), 250)
  }

  options.events.forEach(event => {
    if (['add', 'change', 'unlink', 'addDir', 'unlinkDir'].indexOf(event) !== -1) {
      watcher.on(event, path => onChange(event, path, null, null))
    } else if (event === 'change') {
      watcher.on(event, (path, stats) => onChange(event, path, stats, null))
    } else if (event === 'error') {
      watcher.on(event, error => onChange(event, '', null, error))
    } else if (event === 'ready') {
      watcher.on(event, () => onChange(event, '', null, null))
    } else if (event === 'raw') {
      watcher.on(event, (event, path, details) => onChange(event, path, details, null))
    }
  })

  return watcher
}

const buildConfig = {
  loader: { '.js': 'jsx', '.html': 'text', '.scss': 'text', '.node': 'text' },
  bundle: true,
  minify: true,
  allowOverwrite: true,
  platform: 'node',
  define: {
    'process.env.NODE_ENV': '"development"',
  },
  plugins: [${!useSass ? '' : `sassPlugin()`}],
}

// Function to build workers
const buildWorkers = () => {
  try {
  return esbuild.build({
    ...buildConfig,
    target: 'node18',
    entryPoints: ['./src/**/workers/*'],
    outdir: 'dist/workers/',
  });
} catch (e) {
  return;
}
};

// Function to build workers
const buildContentScripts = () => {
  try {
  return esbuild.build({
    ...buildConfig,
    entryPoints: ['./src/**/content-scripts/*'],
    outdir: 'dist/content-scripts/',
  });
} catch (e) {
  return;
}
};

// Function to build the main bundle
const buildMainBundle = () => {
  return esbuild.build({
    ...buildConfig,
    entryPoints: ['./src/index.tsx'],
    outfile: 'dist/bundle.js',
  });
};


module.exports = {
  formatFiles,
  watch,
  cleanDist,
  buildStyleFiles,
  buildWorkers,
  buildMainBundle,
  buildContentScripts,
  copyPublicFiles,
};`;

module.exports = { commonScriptContent };
