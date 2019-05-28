/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

var path = require('path'),
    _ = require('underscore'),
    parseBuildConfig = require('./utils/parse.build.config'),
    trace, Prom;
try {
  trace = require('amodro-trace');
  Prom = require('amodro-trace/lib/prom');
} catch (error) {
  trace = require('./amodro-trace/trace');
  Prom = require('./amodro-trace/lib/prom');
}

module.exports = function (grunt) {

  grunt.registerMultiTask('languagepack', function () {
    var done = this.async(),
        options = this.options({
          locale: 'en',
          bundlesInfo: [],
          bundleIndexes: {},
          appDir: '.',
          outputDir: '.',
          config: {}
        }),
        linefeed = grunt.util.linefeed,
        config = options.config,
        prefix = options.prefix,
        force = options.force,
        sourceRoot = options.appDir,
        bundles = prepareBundles(options.bundlesInfo),
        bundleIndexes = prepareBundleIndexes(options.bundleIndexes);
    if (typeof config === 'string') {
      config = parseBuildConfig(config);
    }
    config.dir || (config.dir = options.outputDir);

    getBundleIndexes()
        .then(getBundleContent)
        .then(compactBundleContent)
        .then(filterBundleContent)
        .then(writeAllBundles)
        .then(writeAllBundleIndexes)
        .then(done, function (error) {
          grunt.verbose.error(error.stack);
          grunt.log.error(error);

          var warn = force ? grunt.log.warn : grunt.fail.warn;
          warn('Processing bundles failed.');
          done();
        });

    function prepareBundles(bundlesInfo) {
      var bundles = _.chain(bundlesInfo)
          .map(function (info) {
            return (info.exclude || []).concat(info.name);
          })
          .flatten()
          .compact()
          .unique()
          .filter(function (bundle) {
            return bundle.indexOf('bundles/' + prefix + '-') === 0;
          })
          .map(function (bundleFullName) {
            return {
              module: bundleFullName,
              dependencies: getBundleDependencies(bundleFullName, bundlesInfo)
            };
          })
          .value();
      return bundles;
    }

    function getBundleDependencies(bundleFullName, bundlesInfo) {
      var bundleInfo = _.find(bundlesInfo, function (info) {
        return info.name === bundleFullName;
      });
      return bundleInfo && bundleInfo.exclude || [];
    }

    function prepareBundleIndexes(bundleIndexes) {
      return Object.keys(bundleIndexes).map(function (name) {
        return {
          index: name,
          content: bundleIndexes[name]
        };
      });
    }

    function filterBundleContent() {
      bundles.forEach(function (bundle) {
        bundle.content = _.filter(bundle.content, function (c) {
          return c.id.indexOf('i18n!' + prefix + '/') === 0;
        });
        _.each(bundle.content, function (c) {
          c.id = c.id.substring(5);
        });
        grunt.log.writeln('Bundle ' + bundle.module + ' contains ' +
                          bundle.content.length + ' localization modules.');
      });
    }

    function writeAllBundles() {
      bundles.forEach(function (bundle) {
        if (bundle.content.length) {
          writeBundle(bundle);
        }
      });
    }

    function writeBundle(bundle) {
      var lines = _.map(bundle.content, function (c) {
        var moduleContent = getLanguageModuleContent(c);
        return 'csui.define("' + getLocalizedModuleName(c) + '", ' +
               JSON.stringify(moduleContent, undefined, 2) + ');' + linefeed;
      });

      var fileName = bundle.module.replace('bundles/',
          'bundles/nls/' + options.locale + '/');
      fileName = path.join(options.outputDir, fileName + '.js');
      grunt.file.write(fileName, lines.join(linefeed));
    }

    function getLanguageModuleContent(module) {

      var fileName = moduleID2FileName(module.id),
          fileContent = grunt.file.read(fileName),
          moduleContent;
      function define(name, content) {
        moduleContent = _.isObject(name) ? name : _.isObject(content) && content;
      }

      eval(fileContent);
      if (!moduleContent) {
        throw new Error('Unrecognized language module.');
      }

      return moduleContent;
    }

    function writeAllBundleIndexes() {
      bundleIndexes.forEach(function (bundleIndex) {
        writeBundleIndex(bundleIndex);
      });
    }

    function writeBundleIndex(bundleIndex) {
      var lines = [];
      bundleIndex.content.forEach(function (contentBundleName) {
        var contentBundle = _.find(bundles, function (bundleName) {
          return bundleName.module === contentBundleName;
        });
        if (lines.length) {
          lines[lines.length - 1] += ',';
        }
        lines = lines.concat(singleBundleAsIndex(contentBundle));
      });
      lines = ['{'].concat(lines).concat(['}']);

      var fileName = bundleIndex.index.replace('bundles/',
              'bundles/nls/' + options.locale + '/'),
          jsonFileName = path.join(options.outputDir, fileName + '.json'),
          jsonContent = lines.join(linefeed);
      grunt.file.write(jsonFileName, jsonContent);

      var jsFileName = path.join(options.outputDir, fileName + '.js'),
          jsContent = 'csui.require.config({' + linefeed + 'bundles: ' +
                      jsonContent + linefeed + '});';
      grunt.file.write(jsFileName, jsContent);
    }

    function singleBundleAsIndex(bundle) {
      var lines = [],
          fileName = bundle.module.replace('bundles/',
              'bundles/nls/' + options.locale + '/');

      lines.push('  "' + prefix + '/' + fileName + '": [');
      _.each(bundle.content, function (c, index) {
        if (index > 0) {
          lines[lines.length - 1] += ',';
        }
        lines.push('    "' + getLocalizedModuleName(c) + '"');
      });
      lines.push('  ]');

      return lines;
    }

    function moduleID2FileName(moduleId) {
      var nameParts;
      var fileName;

      nameParts = moduleId.split('/');
      nameParts.shift();
      fileName = nameParts.pop();
      if (nameParts[nameParts.length - 1] !== 'root') {
        nameParts.push('root');
      }
      nameParts.push(fileName + '.js');

      return nameParts.join('/');
    }

    function getLocalizedModuleName(module) {
      return module.id.replace('/nls/', '/nls/' + options.locale + '/');
    }
    function getBundleContent() {
      return Prom.all(
          bundles.map(function (bundle) {
            grunt.log.writeln('Loading ' + bundle.module + '...');
            return trace({
              rootDir: sourceRoot,
              id: prefix + '/' + bundle.module
            }, config)
                .then(function (result) {
                  bundle.content = result.traced;
                  grunt.log.writeln(
                      'Bundle ' + bundle.module + ' depends on ' + bundle.content.length +
                      ' modules.');
                  return bundle;
                });
          })
      ).then(function () {
        return bundles;
      });
    }
    function compactBundleContent() {
      bundles.forEach(function (currentBundle) {
        currentBundle.dependencies.forEach(function (dependentBundleName) {
          var dependentBundle = _.find(bundles, function (bundle) {
            return (bundle.module === dependentBundleName);
          });

          if (dependentBundle !== undefined) {
            grunt.log.writeln(
                'Compacting ' + currentBundle.module + ' against ' +
                dependentBundle.module +
                '...');

            currentBundle.content = currentBundle.content.filter(
                function (module) {
                  return !dependentBundle.content.some(function (dependentModule) {
                    return module.id === dependentModule.id;
                  });
                });
          }
        });
      });

      bundles.forEach(function (bundle) {
        grunt.log.writeln(
            'Bundle ' + bundle.module + ' contains ' + bundle.content.length +
            ' modules.');
      });
    }
    function getBundleIndex(bundleFilePath) {

      var bundleFileContent = grunt.file.read(bundleFilePath),
          bundleIndex;
      function require() {}
      function define(name, dependencies) {
        bundleIndex = Array.isArray(name) ? name :
                      Array.isArray(dependencies) && dependencies;
      }

      eval(bundleFileContent);
      if (!bundleIndex) {
        throw new Error('Unrecognized bundle index.');
      }

      return bundleIndex;
    }
    function getBundleIndexes() {
      grunt.log.writeln('Getting bundle indexes...');
      return new Prom(function (resolve, reject) {
        bundles.map(function (bundle) {
          var bundleFileName = bundle.module + '.js';
          bundle.index = getBundleIndex(bundleFileName);
          grunt.log.writeln(
              'Bundle ' + bundle.module + ' exposes ' + bundle.index.length +
              ' modules.');
        });
        resolve();
      });
    }
  });

};
