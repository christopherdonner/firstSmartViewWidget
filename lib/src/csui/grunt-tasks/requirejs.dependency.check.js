/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

var fs = require('fs'),
    path = require('path'),
    util = require('util'),
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

  grunt.registerMultiTask('requirejsDependencyCheck',
      'Check if your modules depend only on public modules from other components',
      function () {
        var done = this.async(),
            options = this.options({
              appDir: '.',
              bundles: [],
              dependencies: [],
              config: {},
              allowIndexedPrivateModules: false,
              force: false
            }),
            linefeed = grunt.util.linefeed,
            config = options.config,
            force = options.force,
            prefix = options.prefix,
            dependencies = options.dependencies,
            sourceRoot = options.appDir,
            bundles = _
                .chain(options.bundles)
                .map(function (bundle) {
                  return (bundle.exclude || []).concat(bundle.name);
                })
                .flatten()
                .compact()
                .unique()
                .filter(function (module) {
                  return _.find(options.bundles, function (bundle) {
                    return bundle.name === module;
                  });
                })
                .map(function (module) {
                  return {module: module};
                })
                .value(),
            failed, warned;
        if (typeof config === 'string') {
          config = parseBuildConfig(config);
        }
        config.dir || (config.dir = sourceRoot);
        getBundleIndexes()
            .then(getBundleContent)
            .then(compactBundleContent)
            .then(checkModuleDependencies)
            .then(function () {
              if (failed) {
                throw new Error('At least one module depends on a private ' +
                                'module from other component.');
              }
              if (warned) {
                grunt.log.warn('Checking module dependencies ended with warnings.');
              } else {
                grunt.log.ok('Checking module dependencies succeeded.');
              }
              done();
            })
            .catch(function (error) {
              grunt.verbose.error(error.stack);
              grunt.log.error(error);

              var warn = force ? grunt.log.warn : grunt.fail.warn;
              warn('Checking module dependencies failed.');
              done();
            });
        function getBundleIndexes() {
          grunt.verbose.writeln('Getting bundle indexes...');
          return new Prom(function (resolve, reject) {
            bundles.forEach(function (bundle) {
              var bundleFileName = path.join(sourceRoot, bundle.module + '.js');
              bundle.index = getBundleIndex(bundleFileName);
              grunt.verbose.writeln('Bundle ' + bundle.module + ' exposes ' +
                                    bundle.index.length + ' modules.');
            });
            resolve();
          });
        }
        function getBundleContent() {
          return Prom.all(
              bundles.map(function (bundle) {
                grunt.verbose.writeln('Loading ' + bundle.module + '...');
                return trace({
                  rootDir: sourceRoot,
                  id: prefix + '/' + bundle.module
                }, config)
                    .then(function (result) {
                      bundle.content = result.traced;
                      bundle.content.forEach(function (module) {
                        module.exposed = _.contains(bundle.index, module.id);
                      });
                      grunt.verbose.writeln('Bundle ' + bundle.module +
                                            ' depends on ' +
                                            bundle.content.length +
                                            ' modules.');
                      return bundle;
                    });
              })
            )
            .then(function () {
              return bundles;
            });
        }
        function compactBundleContent() {
          bundles.forEach(function (currentBundle) {
            var bundleOption = _.find(options.bundles, function (bundle) {
              return bundle.module === currentBundle.name;
            });
            (bundleOption.exclude || []).forEach(function (excludedModule) {
              var excludedBundle = _.find(bundles, function (bundle) {
                return bundle.module === excludedModule;
              });
              if (excludedBundle) {
                grunt.verbose.writeln('Compacting ' + currentBundle.module +
                                      ' against ' + excludedBundle.module + '...');
                currentBundle.content = currentBundle.content.filter(
                    function (currentModule) {
                      return !excludedBundle.content.some(function (excludedModule) {
                        return currentModule.id === excludedModule.id;
                      });
                    });
              }
            });
          });
          bundles.forEach(function (bundle) {
            grunt.verbose.writeln('Bundle ' + bundle.module + ' contains ' +
                                  bundle.content.length + ' modules.');
          });
        }
        function checkModuleDependencies() {
          var currentPrefix = prefix + '/';
          bundles.forEach(function (bundle) {
            bundle.content
                .filter(function (module) {
                  var id = module.id;
                  return module.deps && id.indexOf('/') >= 0 &&
                         id.indexOf('!') < 0 && id.indexOf(currentPrefix) === 0;
                })
                .forEach(function (module) {
                  module.deps
                      .filter(function (dependency) {
                        return dependency.indexOf('/') >= 0 &&
                               dependency.indexOf('!') < 0 &&
                               dependency.indexOf(currentPrefix) !== 0;
                      })
                      .forEach(function (dependency) {
                        if (dependencies.indexOf(dependency) < 0) {
                          grunt.log.warn('Module ' + module.id +
                                         ' depends on ' + dependency +
                                         ', which is not public; it does not' +
                                         ' occur in any foreign bundle index.');
                          failed = true;
                        } else if (dependency.indexOf('/impl/') > 0) {
                          var logMethod = 'warn';
                          if (options.allowIndexedPrivateModules) {
                            logMethod = 'ok';
                            warned = true;
                          } else {
                            failed = true;
                          }
                          grunt.log[logMethod]('Module ' + module.id +
                                               ' depends on ' + dependency +
                                               ', which is private; it does occur in a' +
                                               ' foreign bundle index, but it is not' +
                                               ' guaranteed and can be removed anytime.');
                        }
                      });
                });
          });
        }
        function getBundleIndex(bundleFilePath) {

          var bundleFileContent = fs.readFileSync(bundleFilePath, 'utf-8'),
              bundleIndex;
          function require() {}
          function define(name, dependencies) {
            bundleIndex = Array.isArray(name) ? name : dependencies;
          }

          eval(bundleFileContent);
          if (!bundleIndex) {
            throw new Error('Missing bundle index.');
          }

          return bundleIndex;
        }

      });

};
