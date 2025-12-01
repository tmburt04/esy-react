const { renderScaffold } = require('../../../../utils/template.util');

const manifestJsonContent = ({ name, version }) => {
  return renderScaffold('manifest.json.eta', { name, version });
};

// Keep for backwards compatibility
const manifestJsonData = ({ name, version }) => ({
  'version': version,
  'short_name': name,
  'name': name,
  'manifest_version': 3,
  'action': {
    default_popup: 'browser-ext.html',
    default_title: name,
  },
  'externally_connectable': {
    matches: ['https://*/*'],
  },
  'permissions': ['activeTab', 'storage'],
  'content_scripts': [],
  'web_accessible_resources': [
    {
      resources: ['*.*'],
      matches: ['https://*/*', 'http://*/*'],
    },
  ],
});

module.exports = { manifestJsonContent, manifestJsonData };
