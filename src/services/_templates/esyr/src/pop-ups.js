const { kebabCase } = require('../../../../utils/common.util');
const { renderScaffold } = require('../../../../utils/template.util');

/**
 * Builds a React pop up file
 */
const reactPopUpFactory = ({ popupName }) => {
  const kebabName = kebabCase(popupName);
  return renderScaffold('pop-up.eta', { kebabName });
};

module.exports = { reactPopUpFactory };
