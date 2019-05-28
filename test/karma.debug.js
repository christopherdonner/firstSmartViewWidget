'use strict';

const getCommonSettings = require('./karma.common');

module.exports = function (config) {
  var environment = process.env,
      settings = getCommonSettings(config);

  var reporters = environment.KARMA_REPORTERS || 'mocha,html,coverage';
  reporters = reporters.split(',');

  var preprocessors = reporters.indexOf('coverage') < 0 ? undefined : {
    // source files, that you wanna generate coverage for
    // do not include tests or libraries
    // (these files will be instrumented by Istanbul)
    'src/**/!(test)/*.js': ['coverage']
  };

  Object.assign(settings, {
    // list of files / patterns to load in the browser
    files: [
      'lib/src/csui/lib/require.js',
      'lib/src/csui/config.js',
      'lib/src/csui/helpers.js',
      // The RequireJS configuration for the tests
      'test/test-debug.js',
      'test/test-common.js',
      // Karma's internal web server needs to know every file which
      // will be loaded by the tests or by AJAX; including the CS UI
      // dependencies
      {pattern: 'src/**/*.js', included: false, nocache: true},
      {pattern: 'src/**/*.json', included: false, nocache: true},
      {pattern: 'src/**/*.hbs', included: false, nocache: true},
      {pattern: 'src/**/*.css', included: false, nocache: true},
      {pattern: 'lib/src/csui/**/!(test)/*.js', included: false, nocache: true},
      {pattern: 'lib/src/csui/**/*.hbs', included: false, nocache: true},
      {pattern: 'lib/src/csui/**/*.css', included: false, nocache: true},
      {pattern: 'lib/src/csui/**/*.svg', included: false, nocache: true},
      {pattern: 'lib/src/csui/**/*.woff', included: false, nocache: true},
      {pattern: 'lib/src/csui/**/*.woff2', included: false, nocache: true},
      {pattern: 'lib/src/csui/**/*.json', included: false, nocache: true}
    ],

    // let non-testing sources be pre-processed for the code coverage check
    preprocessors: preprocessors,

    // test results reporter to use
    // possible values: 'dots', 'progress', 'spec', 'junit', 'growl', 'coverage'
    reporters: reporters,

    // configure the reporters
    coverageReporter: {
      type: 'html',
      dir : 'test/debug/coverage'
    },
    htmlReporter: {
      outputDir : 'debug/results'
    }
  });

  config.set(settings);
};
