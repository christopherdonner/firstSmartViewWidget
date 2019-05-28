'use strict';

const getCommonSettings = require('./karma.common');

module.exports = function (config) {
  var environment = process.env,
      settings = getCommonSettings(config);

  var reporters = process.env.KARMA_REPORTERS || 'mocha,html';
  reporters = reporters.split(',');

  Object.assign(settings, {
    // list of files / patterns to load in the browser
    files: [
      'lib/release/csui/bundles/csui-loader.js',
      'lib/release/csui/bundles/csui-app-index.js',
      'out-release/bundles/donner-index.js',
      // The RequireJS configuration for the tests
      'test/test-release.js',
      'test/test-common.js',
      // Karma's internal web server needs to know every file which
      // will be loaded by the tests or by AJAX; including the CS UI
      // dependencies
      {pattern: 'out-release/**/*.js', included: false, nocache: true},
      {pattern: 'out-release/**/*.map', included: false, nocache: true},
      {pattern: 'out-release/**/*.json', included: false, nocache: true},
      {pattern: 'out-release/**/*.css', included: false, nocache: true},
      {pattern: 'src/**/test/*.js', included: false, nocache: true},
      //{pattern: 'src/**/test/*.json', included: false, nocache: true},
      {pattern: 'lib/release/csui/**/*.js', included: false, nocache: true},
      {pattern: 'lib/release/csui/**/*.map', included: false, nocache: true},
      {pattern: 'lib/release/csui/**/*.css', included: false, nocache: true},
      {pattern: 'lib/release/csui/**/*.json', included: false, nocache: true},
      {pattern: 'lib/release/csui/**/*.svg', included: false, nocache: true},
      {pattern: 'lib/release/csui/**/*.woff', included: false, nocache: true},
      {pattern: 'lib/release/csui/**/*.woff2', included: false, nocache: true}
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'spec', 'junit', 'growl', 'coverage'
    reporters: reporters,

    // configure the reporters
    htmlReporter: {
      outputDir : 'release/results'
    }
  });

  config.set(settings);
};
