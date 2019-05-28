// Placeholder for the build target file; the name must be the same,
// include public modules from this component

define([
  // add public files for this module here
], {});

require([
  'require',
  'css'
], function (require, css) {
  // Load the bundle-specific stylesheet
  css.styleLoad(require, 'donner/bundles/donner-all');
});