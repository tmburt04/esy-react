const styleScriptContent = `
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all CSS files recursively
function findCssFiles(dir, fileList = [], excludeFile = '') {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findCssFiles(filePath, fileList, excludeFile);
    } else if (path.extname(file) === '.css' && filePath !== excludeFile) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Main build function
function buildTheme() {
  try {
    const srcDir = path.join(process.cwd(), 'src');
    const baseThemePath = path.join(srcDir, 'theme.css');
    const distDir = path.join(process.cwd(), 'dist');

    // Ensure we're working with the src directory
    if (!fs.existsSync(srcDir)) {
      console.error('src directory not found!');
      process.exit(1);
    }

    // Check if base theme exists
    if (!fs.existsSync(baseThemePath)) {
      console.error('Base theme.css not found in src directory!');
      process.exit(1);
    }

    // Create dist directory if it doesn't exist
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir);
    }

    // Read base theme content
    const baseContent = fs.readFileSync(baseThemePath, 'utf8');

    // Find and combine all other CSS files (excluding base theme.css)
    const cssFiles = findCssFiles(srcDir, [], baseThemePath);
    const combinedStyles = cssFiles.reduce((acc, filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(srcDir, filePath);
      return acc + \`\\n/* \${relativePath} */\\n\${content}\n\`;
    }, baseContent);

    fs.writeFileSync(path.join(distDir, 'temp.css'), combinedStyles);

    // Run postcss via CLI
    execSync('npx postcss ./dist/temp.css -o ./dist/bundle.css --verbose');

    // Clean up temp file
    fs.unlinkSync(path.join(distDir, 'temp.css'));

    // Write to theme.css in dist
    console.log('Theme built successfully!');
    console.log('Base theme: src/bundle.css');
    console.log('Additional files processed:', cssFiles.length);
    console.log('Output: dist/bundle.css');
  } catch (error) {
    console.error('Build failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

buildTheme();
`;

module.exports = { styleScriptContent };
