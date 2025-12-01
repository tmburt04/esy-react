const { renderPrompt } = require('../utils/template.util');

const reactSysPromptFactory = ({ typescript = false, dependencies = [] }) => {
  return renderPrompt('react-fc.eta', { typescript, dependencies });
};

module.exports = { reactSysPromptFactory };
