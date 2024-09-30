const tsConfigJsonData = {
  compilerOptions: {
    target: 'esnext',
    lib: ['dom', 'dom.iterable', 'esnext'],
    allowJs: false,
    skipLibCheck: false,
    strict: false,
    forceConsistentCasingInFileNames: true,
    experimentalDecorators: true,
    noEmit: true,
    esModuleInterop: true,
    module: 'esnext',
    skipDefaultLibCheck: true,
    moduleResolution: 'node',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: 'react-jsx',
  },
  include: ['src'],
};

module.exports = { tsConfigJsonData };
