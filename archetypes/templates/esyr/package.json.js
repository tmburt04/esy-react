const packageJsonData = {
  name: '',
  version: '0.1.0',
  private: true,
  description: '',
  main: 'index.js',
  scripts: {
    build: 'node ./scripts/_build.js',
    start: 'node ./scripts/_start.js',
    "build:styles": "postcss ./src/theme.css -o ./dist/theme.css",
    format: "prettier --write \"**/*.{js,jsx,ts,tsx,css,scss,json,py,rs}\""
  },
  keywords: [],
  author: '',
  license: 'ISC',
  dependencies: {
    'react': '^18.3.1',
    "react-router-dom": "^6.26.2",
    'concurrently': '^8.2.2',
    'esbuild': '^0.23.1',
    'moment': '^2.30.1',
    'react-dom': '^18.3.1',
    'tailwindcss': '^3.4.10',
    '@tailwindcss/forms': '^0.5.7',
  },
  devDependencies: {
    'chokidar': '^3.6.0',
    'live-server': '^1.2.2',
    "prettier": "^3.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "postcss-cli": "^11.0.0",
    "postcss-import": "^16.1.0",
    "postcss-nesting": "^13.0.0"
  },
};

module.exports = { packageJsonData };
