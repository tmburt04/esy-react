const { join } = require('path');
const { writeFile } = require('fs-extra');
const { renderScaffold } = require('../../../../utils/template.util');

/**
 * Builds a React context file
 */
const reactContextFactory = async ({ useTypeScript, contextPath, contextName }) => {
  const contextFileContent = renderScaffold('context.eta', {
    contextName,
    useTypeScript
  });

  const contextFileName = `${contextName}.${useTypeScript ? 'tsx' : 'jsx'}`;

  await writeFile(join(contextPath, contextFileName), contextFileContent);
};

module.exports = { reactContextFactory };
