'use strict';

// Karma browser launcher "ChromeCanary" looks for the binary
// "google-chrome-unstable" by default; if the "unstable" binary
// is not is found, try the "beta" binary
const which = require('which'),
      environment = process.env;
if (process.platform === 'linux') {
  try {
    which.sync('google-chrome-unstable');
  } catch (error) {
    try {
      environment.CHROME_CANARY_BIN = which.sync('google-chrome-beta');
    } catch (error) {}
  }
}

// some browser launchers should be installed before using karma start
// for example:
//   npm install karma-firefox-launcher
//   karma start --browsers=Firefox
module.exports = function (config) {
  var browsers = environment.KARMA_BROWSERS || 'ChromeHeadless';
  if (browsers === 'ALL') {
    switch (process.platform) {
      case 'darwin':
        browsers = ['Chrome', 'Firefox', 'Safari'];
        break;
      case 'linux':
        browsers = ['Chrome', 'Firefox'];
        break;
      case 'win32':
        browsers = ['Chrome', 'Edge', 'Firefox', 'IE'];
        break;
    }
  } else {
    browsers = browsers.split(',');
  }

  var singleRun = environment.KARMA_SINGLERUN !== 'false';

  var colors = environment.KARMA_COLORS !== 'false';

  var symbols = environment.KARMA_SYMBOLS !== 'false' ? undefined : {
    success: '+',
    info: '#',
    warning: '?',
    error: '!'
  };

  var logLevel = config['LOG_' + (environment.KARMA_LOGLEVEL || 'INFO')];

  return {
    // base path, that will be used to resolve files and exclude
    basePath: '..',

    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],

    // configure the reporters
    mochaReporter: {
      symbols: symbols
    },

    // Most tests use 10000 to wait for asynchronous operations,
    // but if multiple browsers start, it can take longer
    browserNoActivityTimeout: 60000,

    // web server port
    port: 9876,

    // level of logging
    logLevel: logLevel,

    // enable / disable colors in the output (reporters and logs)
    colors: colors,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: browsers,

    // Continuous Integration mode; if true, it capture browsers, run tests and exit
    singleRun: singleRun
  };
};
