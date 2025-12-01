const { kebabCase, upperFirst } = require('../../../../utils/common.util');
const { renderScaffold } = require('../../../../utils/template.util');

const extIndexHtmlContent = ({ projectDesc, projectName }) => {
  const kebabName = kebabCase(projectName);
  const normalName = upperFirst(projectName);
  return renderScaffold('ext-index.html.eta', { kebabName, normalName, projectDesc });
};

module.exports = { extIndexHtmlContent };
