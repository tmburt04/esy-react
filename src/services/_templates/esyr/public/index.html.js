const { kebabCase, upperFirst } = require('../../../../utils/common.util');
const { renderScaffold } = require('../../../../utils/template.util');

const indexHtmlContent = ({ projectName }) => {
  const kebabName = kebabCase(projectName);
  const normalName = upperFirst(projectName);
  return renderScaffold('index.html.eta', { kebabName, normalName });
};

module.exports = { indexHtmlContent };
