const { renderScaffold } = require('../../../../utils/template.util');

const appComponentContent = ({ useTypeScript, pageName }) => {
  return renderScaffold('app.eta', { useTypeScript, pageName });
};

module.exports = { appComponentContent };
