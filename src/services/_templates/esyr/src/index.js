const { kebabCase } = require('../../../../utils/common.util');
const { renderScaffold } = require('../../../../utils/template.util');

const indexComponentContent = ({ projectName }) => {
  const kebabName = kebabCase(projectName);
  return renderScaffold('index.eta', { kebabName });
};

module.exports = { indexComponentContent };
