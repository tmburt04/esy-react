const { kebabCase, upperFirst } = require('lodash');

const indexHtmlContent = ({ projectName }) => {
  const kebabName = kebabCase(projectName);
  const normalName = upperFirst(projectName)
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${normalName || 'React App'}</title>
    <link crossorigin="anonymous" media="all" rel="stylesheet" href="bundle.css" />
    <link crossorigin="anonymous" media="all" rel="stylesheet" href="theme.css" />
    <style>
        html {
            min-width: 300px;
            min-height: 500px;
            margin: 0;
            inset: 0;
            padding: 0;
            font-family: sans-serif;
            border: 0;
        }
        body {
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
    <div id="${kebabName}-root"></div>
    <script src="bundle.js"></script>
</body>
</html>`;
};

module.exports = { indexHtmlContent };