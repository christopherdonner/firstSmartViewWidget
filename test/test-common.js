(function () {
  'use strict';

  // Increase the default Jasmine timeout interval
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

  // Gather all test specs
  var specs = [];
  for (var file in window.__karma__.files) {
    if (/\.spec\.js$/.test(file)) {
      specs.push(file);
    }
  }

  window.csui.require.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    // increase the seconds to timeout
    waitSeconds: 60,

    config: {
      // Do not pollute the console by mocked call logging;
      // let test speck status come clear out
      'csui/lib/jquery.mockjax': {
        settings: {
          logging: false,
          logSettings: false,
          responseTime: 0,
          throwUnmocked: true
        }
      },
      // Force English as the initial testing language and override
      // the current user language, which Chrome prefers otherwise
      i18n: {
        locale: 'en-us',
        loadableLocales: {
          root: true
        },
        preferredLocales: 'en-us'
      },
      // Specify the default mocked server connection,
      // so that it needs not be repeated in every spec
      'csui/utils/contexts/factories/connector': {
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: window.csui.supportPath,
          session: {
            ticket: 'dummy'
          }
        }
      }
    },

    // Ask Require.js to load the configuration and test preparation modules
    deps: [
      'require',
      'csui/lib/require.config!csui/csui-extensions.json',
      'csui/lib/require.config!donner/donner-extensions.json',
      'prepare-test-page'
    ],

    // Ask Require.js to load all test specs and start the test run, once
    // Require.js is done
    callback: function (require) {
      require(specs, window.__karma__.start);
    }
  });
}());
