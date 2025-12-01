const { renderPrompt } = require('../utils/template.util');

const SW_SYSTEM_PROMPT = renderPrompt('service-worker.eta', {});

module.exports = { SW_SYSTEM_PROMPT };
