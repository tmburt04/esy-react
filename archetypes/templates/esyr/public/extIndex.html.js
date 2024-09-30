const { kebabCase, upperFirst } = require('lodash');

const extIndexHtmlContent = ({ projectDesc, projectName }) => {
  const kebabName = kebabCase(projectName);
  const normalName = upperFirst(projectName)
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1" />
    <title>${normalName || 'React App'}</title>
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="${projectDesc || normalName}" />
  <link rel="manifest" href="manifest.json" />
    <link crossorigin="anonymous" media="all" rel="stylesheet" href="bundle.css" />
    <link crossorigin="anonymous" media="all" rel="stylesheet" href="theme.css" />
  <style>
    html {
      -webkit-text-size-adjust: 100%;
      -webkit-font-feature-settings: normal;
      font-feature-settings: normal;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
      font-variation-settings: normal;
      line-height: 1.5;
      tab-size: 4;
        min-width: 300px;
        min-height: 500px;
        margin: 0;
        inset: 0;
        padding: 0;
        border: 0;
  }
  body {
      line-height: inherit;
    display: block;
    position: fixed;
    margin: 0;
    inset: 0;
    padding: 0;
    border: 0;
  }
  </style>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="${kebabName}-ext-root"></div>
    <script src="bundle.js"></script>
</body>
</html>`;
};

module.exports = { extIndexHtmlContent };