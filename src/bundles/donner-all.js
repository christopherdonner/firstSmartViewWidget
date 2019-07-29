// Placeholder for the build target file; the name must be the same,
// include public modules from this component

define([
  'donner/widgets/.donner/.donner.view',
  'json!donner/widgets/.donner/.donner.manifest.json'
], {});

require([
  'require',
  'css'
], function (require, css) {

  // Load the bundle-specific stylesheet
  css.styleLoad(require, 'donner/bundles/donner-all');
});