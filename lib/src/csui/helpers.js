/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


(function () {
  'use strict';
  var csui = window.csui || (window.csui = {});
  if (!csui.requirejs && window.requirejs) {
    csui.requirejs = window.requirejs;
    csui.require = window.require;
    csui.define = window.define;
  }

  csui.setLanguage = function (language, country) {
    if (country) {
      language = language + '-' + country;
    }
    if (typeof language === 'string') {
      language = {locale: language};
    }
    language.locale = language.locale.toLowerCase().replace('_', '-');
    if (language.rtl === undefined) {
      language.rtl = csui.needsRTL(language.locale);
    }
    csui.require.config({
      config: {i18n: language}
    });
  };

  csui.needsRTL = function (language) {
    return /^(?:ar|fa|he|ur|yi)/.test(language);
  };

  csui.setLastLanguage = function () {
    console.warn('The csui.setLanguage method has become obsolete and has no effect. ' +
                 'If you need to remember the last chosen csui language, do it your ' +
                 'application, please.');
  };

  csui.setLogging = function (settings) {
    csui.require.config({
      config: {'csui/utils/log': settings}
    });
  };

  var moduleLoggingEnabled;

  function enableModuleLogging() {
    if (moduleLoggingEnabled) {
      return;
    }
    moduleLoggingEnabled = true;
    function logModule(log, map, earlier) {
      if (map.id.indexOf('!') > 0) {
        log.debug('A plugin processed {0}{1}.',
            map.id, earlier ? ' earlier' : '')
        && console.log(log.last);
      } else {
        log.debug('The module {0} was loaded{2} from {1}.',
            map.id, map.url, earlier ? ' earlier' : '')
        && console.log(log.last);
      }
    }

    function logModuleToConsole(map, earlier) {
      if (map.id.indexOf('!') > 0) {
        console.log('A plugin processed {0}.'
            .replace('{0}', map.id));
      } else {
        console.log('The module {0} was loaded from {1}.'
            .replace('{0}', map.id).replace('{1}', map.url));
      }
    }
    function getErrorInfo(error) {
      if (error.requireModules) {
        return {
          message: error.message.replace(/\r?\n.+$/, ''),
          requireModules: error.requireModules
        };
      }
      return {message: error.message + '\r\n' + error.stack};
    }

    function reportModule(log, error, earlier) {
      error = getErrorInfo(error);
      if (error.requireModules) {
        log.error('Loading modules [{0}] failed{2}: {1}',
            error.requireModules.join(','), error.message,
            earlier ? ' earlier' : '')
        && console.error(log.last);
      } else {
        log.error('Executing a module failed{1}: {0}',
            error.message, earlier ? ' earlier' : '')
        && console.error(log.last);
      }
    }

    function reportModuleToConsole(error) {
      error = getErrorInfo(error);
      if (error.requireModules) {
        console.log('Loading modules [{0}] failed: {1}'
            .replace('{0}', error.requireModules.join(','))
            .replace('{1}', error.message));
      } else {
        console.log('Executing a module failed: {0}'
            .replace('{1}', error.message));
      }
    }
    var beforeLoggingInitialization = [];

    function relogEntries(log) {
      if (beforeLoggingInitialization.length) {
        beforeLoggingInitialization.forEach(function (item) {
          (item.id ? logModule : reportModule)(log, item, true);
        });
        beforeLoggingInitialization = [];
      }
    }
    var originalResourceLoad = csui.require.onResourceLoad;
    csui.require.onResourceLoad = function (context, map, depMaps) {
      if (originalResourceLoad) {
        originalResourceLoad.apply(this, arguments);
      }
      var log = csui.require.defined('csui/utils/log') &&
                csui.require('csui/utils/log');
      if (log) {
        relogEntries(log);
        logModule(log, map);
      } else {
        logModuleToConsole(map);
        beforeLoggingInitialization.push(map);
      }
    };
    var originalError = csui.require.onError;
    csui.require.onError = function (error) {
      var log = csui.require.defined('csui/utils/log') &&
                csui.require('csui/utils/log');
      if (log) {
        relogEntries(log);
        reportModule(log, error);
      } else {
        reportModuleToConsole(error);
        beforeLoggingInitialization.push(error);
      }
      if (originalError) {
        originalError.apply(this, arguments);
      }
    };
  }

  function pushStartingModules(modules) {
    ['csui/utils/log', 'csui/utils/base', 'csui/lib/domReady!']
        .forEach(function (module) {
          if (modules.indexOf(module) < 0) {
            modules.push(module);
          }
        });
  }

  csui.onReady = function (modules, success, failure) {
    var parameters = Array.prototype.slice.call(arguments);

    if (modules instanceof Array) {
      if (modules.indexOf('csui/integration/v1.widgets.wrapper') < 0) {
        modules.push('csui/integration/v1.widgets.wrapper');
      }
    } else {
      modules = ['csui/integration/v1.widgets.wrapper'];
      parameters.unshift(modules);
    }

    csui.onReady2.apply(this, parameters);
  };

  csui.onReady2 = function (modules, success, failure) {
    if (!failure) {
      if (typeof modules === 'function') {
        failure = success;
        success = modules;
        modules = undefined;
      }
    }
    if (!success) {
      if (typeof modules === 'function') {
        success = modules;
        modules = undefined;
      }
    }
    if (!modules) {
      modules = [];
    }
    function loadModules() {
      pushStartingModules(modules);
      csui.require(modules, function () {
        csui.ready || (csui.ready = true);
        success && success.apply(this, arguments);
      }, failure);
    }
    function loadLanguages() {
      var languageBundleIndexes = Object
          .keys(csui.bundleIndexes || {})
          .map(function (codeBundle) {
            return codeBundle.replace('/bundles/', '/bundles/nls/' +
                   locale + '/') + '.js';
          }),
          languageCount = languageBundleIndexes.length + 1;

      function waitForLanguage() {
        if (!--languageCount) {
          loadModules();
        }
      }

      function loadLanguage(bundleIndexName) {
        var script = document.createElement('script');
        script.src = csui.require.toUrl(bundleIndexName);
        script.setAttribute('data-csui-required', 'true');
        script.addEventListener('load', waitForLanguage);
        script.addEventListener('error', waitForLanguage);
        document.head.appendChild(script, document.currentScript);
      }

      languageBundleIndexes.forEach(loadLanguage);
      waitForLanguage();
    }
    var i18n = csui.require.s.contexts._.config.config.i18n,
        locale = i18n && i18n.locale ||
                 navigator.languages && navigator.languages[0] ||
                 navigator.language || '';
    locale = locale.toLowerCase();
    if (locale && locale !== 'en' && locale !== 'en-us') {
      var loadableLocales = i18n && i18n.loadableLocales || [];
      if (!(loadableLocales instanceof Array)) {
        loadableLocales = Object
            .keys(loadableLocales)
            .map(function (locale) {
              return locale.toLowerCase();
            });
      }
      if (loadableLocales.indexOf(locale) < 0) {
        locale = locale.split('-')[0];
      }
      if (loadableLocales.indexOf(locale) < 0) {
        var alternativeLocales = loadableLocales.filter(function (alternativeLocale) {
          return alternativeLocale.indexOf(locale + '-') === 0;
        });
        if (alternativeLocales.length) {
          locale = alternativeLocales[0];
        }
      }
      if (loadableLocales.indexOf(locale) >= 0) {
        return loadLanguages();
      }
    }

    loadModules();
  };

  csui.getVersion = function () {
    return '1.0.0.0';
  };

  csui.getExtensionModules = csui.printExtensionModules = function (success, failure) {
    csui.require(['csui/models/server.module/server.module.collection'
    ], function (ServerModuleCollection) {

      var serverModules = new ServerModuleCollection();
      serverModules
          .fetch()
          .done(function () {
            serverModules = serverModules.toJSON();
            if (success) {
              success(serverModules);
            } else {
              console.log(JSON.stringify(serverModules, undefined, 2));
            }
          })
          .fail(function (error) {
            if (failure) {
              failure(error);
            } else {
              console.error('Loading extension modules failed:', error);
            }
          });

    });
  };

})();
