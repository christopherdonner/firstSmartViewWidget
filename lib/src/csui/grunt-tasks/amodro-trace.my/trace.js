/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';
var Prom = require('./lib/prom'),
    Loader = require('./lib/loader/Loader');
module.exports = function trace(options, loaderConfig) {
  return new Prom(function(resolve, reject) {
    if (!options.id) {
      reject(new Error('options must include "id" ' +
                       'to know what module ID to trace'));
      return;
    }

    if (options.writeTransform) {
      options.includeContents = true;
    }

    var logger = {
      warnings: [],
      errors: [],
      warn: function(msg) {
        logger.warnings.push(msg);
      },
      error: function(msg) {
        logger.errors.push(msg);
      }
    };
    options.logger = logger;

    var loader = new Loader(options);

    if (loaderConfig) {
      loader.getContext().configure(loaderConfig);
    }

    function onOk() {
      var context = loader.getContext();
      var paths = context._layer.buildFilePaths,
          idMap = context._layer.buildFileToModule,
          registry = context._registryBackup;

      var result = paths.map(function(filePath) {
        var id = idMap[filePath],
            module = registry[id];
        if (id.indexOf('!') !== -1) {
          var ext, modifiedName, resourcePath,
              map = context.makeModuleMap(id),
              name = map.name;

          var lastIndex = name.lastIndexOf('.');
          if (lastIndex !== -1) {
            ext = name.substring(lastIndex);
            modifiedName = name.substring(0, lastIndex);
            resourcePath = context.nameToUrl(modifiedName, ext, true);
            if (context.fileExists(id, resourcePath)) {
              filePath = resourcePath;
            } else {
              resourcePath = null;
            }
          }
          if (!resourcePath) {
            resourcePath = context.nameToUrl(name, '', true);
            if (context.fileExists(id, resourcePath)) {
              filePath = resourcePath;
            } else {
              resourcePath = context.nameToUrl(name, '.' + map.prefix, true);
              if (context.fileExists(id, resourcePath)) {
                filePath = resourcePath;
              } else {
                filePath = null;
              }
            }
          }
        }

        var item = {
          id: id
        };

        if (filePath) {
          item.path = filePath;
        }

        if (options.includeContents && filePath) {
          var contents = context._readTransformedContents[filePath];
          if (!contents && context.fileExists(id, filePath)) {
            contents = context.fileRead(id, filePath) || '';
            if (options.writeTransform) {
              contents = options
                         .writeTransform(context, id, filePath, contents);
            }
          }
          if (contents && options.writeTransform) {
            contents = options.writeTransform(context,
                                              id,
                                              filePath,
                                              contents);
          }

          item.contents = contents;
        }

        if (module) {
          if (module.map && module.map.parentMap) {
            item.parent = module.map.parentMap.id;
          }
          if (module.map && module.depMaps) {
            item.dependencies = module.depMaps.map(function (module) {
              return module.id;
            });
          }
        }

        return item;
      });
      if (!options.keepLoader) {
        loader.discard();
        loader = null;
      }

      var resolved = {
        traced: result
      };

      if (loader) {
        resolved.loader = loader;
      }
      if (logger.warnings.length) {
        resolved.warnings = logger.warnings;
      }
      if (logger.errors.length) {
        resolved.errors = logger.errors;
      }
      delete options.logger;

      resolve(resolved);
    }
    onOk.__requireJsBuild = true;

    loader.require([options.id], onOk, function(err) {
      loader.discard();
      reject(err);
    });
  });
};
