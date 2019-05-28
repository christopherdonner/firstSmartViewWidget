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

  grunt.registerMultiTask('requirejsBundleCheck',
      'Check if bundle indexes refer to distinct collection of modules',
      function () {
        var done = this.async(),
            options = this.options({
              appDir: '.',
              dependencies: [],
              config: {},
              force: false
            }),
            linefeed = grunt.util.linefeed,
            config = options.config,
            force = options.force,
            prefix = options.prefix,
            dependencies = options.dependencies,
            sourceRoot = options.appDir,
            bundles = _
                .chain(dependencies)
                .map(function (dependency) {
                  return (dependency.exclude || []).concat(dependency.name);
                })
                .flatten()
                .compact()
                .unique()
                .filter(function (module) {
                  return _.find(dependencies, function (dependency) {
                    return dependency.name === module;
                  });
                })
                .map(function (module) {
                  return {module: module};
                })
                .value(),
            result = {};
        if (typeof config === 'string') {
          config = parseBuildConfig(config);
        }
        config.dir || (config.dir = sourceRoot);
        getBundleIndexes()
            .then(getBundleContent)
            .then(compactBundleContent)
            .then(checkBundleIndexes)
            .then(checkBundleModulesOutOfIndex)
            .then(function () {
              var message;
              if (result.index || result.outOfIndex) {
                message = result.index ? 'At least one module was ' +
                          'found in more than one bundle. Check content ' +
                          'of bundle index modules and if bundles are ' +
                          'distinct by exclusions.' : '';
                if (result.outOfIndex) {
                  message && (message += linefeed);
                  message += 'At least one module depends on a private ' +
                             'module from other bundle. Check if your foreign ' +
                             'dependencies come from foreign bundle indexes.';
                }
                throw new Error(message);
              }
              bundles.forEach(function (bundle) {
                grunt.log.ok('Bundle ' + bundle.module + ' exposes ' +
                             bundle.index.length + ' modules from ' +
                             bundle.content.length + ' total.');
              });
              grunt.log.ok('Checking the bundle indexes succeeded.');
              done();
            })
            .catch(function (error) {
              grunt.verbose.error(error.stack);
              grunt.log.error(error);

              var warn = force ? grunt.log.warn : grunt.fail.warn;
              warn('Checking the bundle indexes failed.');
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
          dependencies.forEach(function (currentDependency) {
            var currentBundle = _.find(bundles, function (bundle) {
              return bundle.module === currentDependency.name;
            });
            (currentDependency.exclude || []).forEach(function (otherDependency) {
              var otherBundle = _.find(bundles, function (bundle) {
                return bundle.module === otherDependency;
              });
              if (otherBundle) {
                grunt.verbose.writeln('Compacting ' + currentBundle.module +
                                      ' against ' + otherBundle.module + '...');
                currentBundle.content = currentBundle.content.filter(
                    function (currentModule) {
                      return !otherBundle.content.some(function (otherModule) {
                        return currentModule.id === otherModule.id;
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
        function checkBundleIndexes() {
          dependencies.forEach(function (currentDependency) {
            var currentBundle = _.find(bundles, function (bundle) {
              return bundle.module === currentDependency.name;
            });
            (currentDependency.exclude || []).forEach(function (otherDependency) {
              var otherBundle = _.find(bundles, function (bundle) {
                return bundle.module === otherDependency;
              });
              if (otherBundle) {
                grunt.verbose.writeln('Checking index of ' + currentBundle.module +
                                      ' against ' + otherBundle.module + '...');
                currentBundle.index.forEach(function (currentModule) {
                  _
                      .chain(otherBundle.content)
                      .filter(function (otherModule) {
                        return currentModule === otherModule.id;
                      })
                      .each(function (otherModule) {
                        grunt.log.warn('Bundle ' + currentBundle.module +
                                       ' includes ' + currentModule +
                                       ' in index, but ' + otherBundle.module +
                                       ' contains this module too.');
                        traceModuleInBundle(currentModule, otherBundle);
                        result.index = true;
                      });
                });
              }
            });
          });
        }
        function checkBundleModulesOutOfIndex() {
          dependencies.forEach(function (currentDependency) {
            var currentBundle = _.find(bundles, function (bundle) {
              return bundle.module === currentDependency.name;
            });
            (currentDependency.exclude || []).forEach(function (otherDependency) {
              var otherBundle = _.find(bundles, function (bundle) {
                return bundle.module === otherDependency;
              });
              if (otherBundle) {
                checkOutOfIndexModulesForTwoBundles(currentBundle, otherBundle);
                checkOutOfIndexModulesForTwoBundles(otherBundle, currentBundle);
              }
            });
          });
        }
        function checkOutOfIndexModulesForTwoBundles(currentBundle, otherBundle) {
          grunt.verbose.writeln('Checking out-of-index modules of ' +
                                currentBundle.module + ' against ' +
                                otherBundle.module + '...');
          currentBundle.content.forEach(function (currentModule) {
            if (!currentModule.exposed) {
              _
                  .chain(otherBundle.content)
                  .filter(function (otherModule) {
                    return _.contains(otherModule.deps || [], currentModule.id);
                  })
                  .each(function (otherModule) {
                    grunt.log.warn('Module ' + otherModule.id +
                                   ' from bundle ' + otherBundle.module +
                                   ' includes ' + currentModule.id +
                                   ' from ' + currentBundle.module +
                                   ' which is not in bundle index.');
                    traceModuleInBundle(currentModule, otherBundle);
                    result.outOfIndex = true;
                  });
            }
          });
        }
        function traceModuleInBundle(tracedModule, otherBundle) {
          if (otherBundle) {
            tracedModule = _.find(otherBundle.content, function (module) {
              return tracedModule === module.id;
            });
          } else {
            tracedModule = findModule(tracedModule);
          }
          if (tracedModule) {
            otherBundle.content.forEach(function (module) {
              if (_.find(module.deps || [], function (dependency) {
                    return dependency === tracedModule.id;
                  })) {
                grunt.log.warn('Module ' + module.id +
                               ' depends on ' + tracedModule.id + '.');
                (module.dependencies || []).forEach(function (parent) {
                  traceModuleInBundle(module.id, otherBundle);
                });
              }
            });
          }
        }
        function findModule(moduleId) {
          var module;
          _.find(bundles, function (bundle) {
            module = _.find(bundle.content, function (module) {
              return moduleId === module.id;
            });
            return !!module;
          });
          return module;
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
