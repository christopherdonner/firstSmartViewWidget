/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



var fs = require('fs'),
    lang = require('../lang'),
    parse = require('../parse'),
    path = require('path'),
    exists = fs.existsSync || path.existsSync,
    nodeRequire = require;

eval(fs.readFileSync(path.join(__dirname, 'require.js'), 'utf8'));
function __exec(contents, r, d, c) {
  var exports, module,
      requirejs = r,
      require = r,
      define = d;
  r.nodeRequire = nodeRequire;

  r._readFile = function(path) {
    return c.fileRead(undefined, path);
  };
  r._fileExists = function(path) {
    return c.fileExists(undefined, path);
  };

  eval(contents);
}
(function() {
  var hasProp = lang.hasProp,
    falseProp = lang.falseProp,
    getOwn = lang.getOwn,
    useStrictRegExp = /['"]use strict['"];/g;

  var layer,
    pluginBuilderRegExp =
                    /(["']?)pluginBuilder(["']?)\s*[=\:]\s*["']([^'"\s]+)["']/,
    oldNewContext = requirejs.s.newContext,
    oldDef = define;

  function frontSlash(filePath) {
      return filePath.replace(/\\/g, '/');
  }

  function defaultExists(id, filePath) {
    return exists(filePath) && fs.statSync(filePath).isFile();
  }

  function defaultRead(context, id, filePath, encoding) {
    if (lang.hasProp(context._cachedRawText, filePath)) {
      return context._cachedRawText[filePath];
    } else {
      var text = fs.readFileSync(filePath, encoding || 'utf8');
      context._cachedRawText[filePath] = text;
      return text;
    }
  }

  function makeDefine(context) {
    var define = function (name) {
      var layer = context._layer;
      if (typeof name === 'string' && falseProp(layer.needsDefine, name)) {
        layer.modulesWithNames[name] = true;
      }
      return oldDef.apply(null, arguments);
    };

    define.amd = oldDef.amd;

    return define;
  }
  requirejs.s.newContext = function (name) {
    var context = oldNewContext(name),
      oldEnable = context.enable,
      moduleProto = context.Module.prototype,
      oldInit = moduleProto.init,
      oldCallPlugin = moduleProto.callPlugin;

    layer = context._layer = {
      buildPathMap: {},
      buildFileToModule: {},
      buildFilePaths: [],
      pathAdded: {},
      modulesWithNames: {},
      needsDefine: {},
      existingRequireUrl: '',
      ignoredUrls: {},
      context: context
    };

    context.needFullExec = {};
    context.fullExec = {};
    context.plugins = {};
    context.buildShimExports = {};
    context._cachedRawText = {};
    context._cachedFileContents = {};
    context._cachedDefinesRequireUrls = {};
    context._readTransformedContents = {};
    context._registryBackup = {};
    context.nextTick = function (fn) {
      fn();
    };

    context.normalizePath = function(filePath) {
      var rootDir = context.config._options && context.config._options.rootDir;
      if (rootDir &&
          filePath.indexOf('/') !== 0 &&
          filePath.indexOf(':') === -1) {
        filePath = path.join(rootDir, filePath);
      }
      filePath = frontSlash(path.normalize(filePath));
      return filePath;
    };

    var oldNameToUrl = context.nameToUrl;
    context.nameToUrl = function (moduleName, ext, skipExt) {
      var url = oldNameToUrl.call(context, moduleName, ext, skipExt);
      return context.normalizePath(url);
    };

    context._setToolOptions = function(options) {
      context.config._options = options;
      var contextRead = defaultRead.bind(null, context);
      if (context.config._options.fileRead) {
        var optionRead = context.config._options.fileRead;
        context.fileRead = function(id, filePath, encoding) {
          return optionRead(contextRead, id, filePath, encoding);
        };

        var optionExists = context.config._options.fileExists;
        context.fileExists = function(id, filePath) {
          return optionExists(defaultExists, id, filePath);
        };
      } else {
        context.fileRead = contextRead;
        context.fileExists = defaultExists;
      }
    };
    context.require.needsDefine = function (moduleName) {
      context._layer.needsDefine[moduleName] = true;
    };

    context._isSupportedBuildUrl = function (url) {
      var layer = context._layer;
      if (url.indexOf('://') === -1 && url.indexOf('?') === -1 &&
          url.indexOf('empty:') !== 0 && url.indexOf('//') !== 0) {
        return true;
      } else {
        if (!layer.ignoredUrls[url]) {
          if (url.indexOf('empty:') === -1) {
            var logger = context.config._options.logger;
            if (logger && logger.warn) {
              logger.warn('Cannot optimize network URL, skipping: ' + url);
            }
          }
          layer.ignoredUrls[url] = true;
        }
        return false;
      }
    };
    context.makeShimExports = function (value) {
      var fn;
      if (context.config._options.wrapShim) {
        fn = function () {
          var str = 'return ';
          if (value.exports && value.exports.indexOf('.') === -1) {
            str += 'root.' + value.exports + ' = ';
          }

          if (value.init) {
            str += '(' + value.init.toString()
                 .replace(useStrictRegExp, '') + '.apply(this, arguments))';
          }
          if (value.init && value.exports) {
            str += ' || ';
          }
          if (value.exports) {
            str += value.exports;
          }
          str += ';';
          return str;
        };
      } else {
        fn = function () {
          return '(function (global) {\n' +
            '  return function () {\n' +
            '    var ret, fn;\n' +
            (value.init ?
                ('     fn = ' + value.init.toString()
                .replace(useStrictRegExp, '') + ';\n' +
                '    ret = fn.apply(global, arguments);\n') : '') +
            (value.exports ?
                '    return ret || global.' + value.exports + ';\n' :
                '    return ret;\n') +
            '  };\n' +
            '}(this))';
        };
      }

      return fn;
    };

    context.enable = function (depMap, parent) {
      var id = depMap.id,
        parentId = parent && parent.map.id,
        needFullExec = context.needFullExec,
        fullExec = context.fullExec,
        mod = getOwn(context.registry, id);

      if (mod && !mod.defined) {
        if (parentId && getOwn(needFullExec, parentId)) {
          needFullExec[id] = depMap;
        }

      } else if ((getOwn(needFullExec, id) && falseProp(fullExec, id)) ||
             (parentId && getOwn(needFullExec, parentId) &&
            falseProp(fullExec, id))) {
        context.require.undef(id);
      }

      return oldEnable.apply(context, arguments);
    };
    context.load = function (moduleName, url) {
      var contents, pluginBuilderMatch, builderName,
        shim, shimExports;
      if (falseProp(context.registry, moduleName)) {
        return;
      }
      var loadStatus = {
        canceled: false
      };
      context.registry[moduleName]._loadStatus = loadStatus;

      var layer = context._layer;
      if (url.indexOf('empty:') === 0) {
        delete context.urlFetched[url];
      }
      if (context._isSupportedBuildUrl(url)) {
        layer.buildPathMap[moduleName] = url;
        layer.buildFileToModule[url] = moduleName;

        if (hasProp(context.plugins, moduleName)) {
          context.needFullExec[moduleName] = true;
        }

        if (hasProp(context._cachedFileContents, url) &&
            (falseProp(context.needFullExec, moduleName) ||
            getOwn(context.fullExec, moduleName))) {
          contents = context._cachedFileContents[url];
          if (!layer.existingRequireUrl &&
              context._cachedDefinesRequireUrls[url]) {
            layer.existingRequireUrl = url;
          }
        } else {
          contents = context.fileRead(moduleName, url);

          if (context.config._options.readTransform) {
            contents = context.config._options
                       .readTransform(moduleName, url, contents);
          }

          if (context.config._options.includeContents) {
            context._readTransformedContents[url] = contents;
          }
          try {
            if (!layer.existingRequireUrl &&
                parse.definesRequire(url, contents)) {
              layer.existingRequireUrl = url;
              context._cachedDefinesRequireUrls[url] = true;
            }
          } catch (e1) {
            throw new Error('Parse error using esprima ' +
                    'for file: ' + url + '\n' + e1);
          }

          if (hasProp(context.plugins, moduleName)) {
            pluginBuilderMatch = pluginBuilderRegExp.exec(contents);
            if (pluginBuilderMatch) {
              builderName = context.makeModuleMap(pluginBuilderMatch[3],
                                context.makeModuleMap(moduleName),
                                null,
                                true).id;
              contents = context.fileRead(builderName,
                                          context.nameToUrl(builderName));
            }
          }
          try {
            if (falseProp(context.needFullExec, moduleName)) {
              contents = parse(moduleName, url, contents, {
                insertNeedsDefine: true,
                has: context.config.has,
                findNestedDependencies:
                              context.config._options.findNestedDependencies
              });
            }
          } catch (e2) {
            throw new Error('Parse error using esprima ' +
                    'for file: ' + url + '\n' + e2);
          }

          context._cachedFileContents[url] = contents;
        }

        if (contents) {
          __exec(contents, context.require, makeDefine(context), context);
        }

        try {
          if (getOwn(context.needFullExec, moduleName)) {
            shim = getOwn(context.config.shim, moduleName);
            if (shim && shim.exports) {
              shimExports = __exec(shim.exports,
                                   context.require,
                                   makeDefine(context),
                                   context);
              if (typeof shimExports !== 'undefined') {
                context.buildShimExports[moduleName] = shimExports;
              }
            }
          }

          if (loadStatus.canceled) {
            return;
          }
          context.completeLoad(moduleName);
        } catch (e) {
          if (!e.moduleTree) {
            e.moduleTree = [];
          }
          e.moduleTree.push(moduleName);

          if (!e.fileName) {
            e.fileName = url;
          }

          var mod = context.registry[moduleName];
          if (mod) {
            mod.emit('error', e);
          } else {
            var logger = context.config._options.logger;
            if (logger && logger.error) {
              logger.error('Error loading: ' + url + ': ' + e);
            }
          }
        }
      } else {
        context.completeLoad(moduleName);
      }
    };
    context.execCb = function (name, cb, args, exports) {
      var layer = context._layer;
      var buildShimExports = getOwn(layer.context.buildShimExports, name);

      if (buildShimExports) {
        return buildShimExports;
      } else if (cb.__requireJsBuild ||
                 getOwn(layer.context.needFullExec, name)) {
        return cb.apply(exports, args);
      }
      return undefined;
    };
    var oldUndef = context.require.undef;
    context.require.undef = function(id) {
      var mod = context.registry[id];
      if (mod && mod._loadStatus) {
        mod._loadStatus.canceled = true;
      }
      return oldUndef.call(context.require, id);
    };

    moduleProto.init = function (depMaps) {
      if (context.needFullExec[this.map.id]) {
        lang.each(depMaps, lang.bind(this, function (depMap) {
          if (typeof depMap === 'string') {
            depMap = context.makeModuleMap(depMap,
                     (this.map.isDefine ? this.map : this.map.parentMap));
          }

          if (!context.fullExec[depMap.id]) {
            context.require.undef(depMap.id);
          }
        }));
      }

      return oldInit.apply(this, arguments);
    };

    moduleProto.callPlugin = function () {
      var map = this.map,
        pluginMap = context.makeModuleMap(map.prefix),
        pluginId = pluginMap.id,
        pluginMod = getOwn(context.registry, pluginId);

      context.plugins[pluginId] = true;
      context.needFullExec[pluginId] = map;
      if (falseProp(context.fullExec, pluginId) &&
          (!pluginMod || pluginMod.defined)) {
        context.require.undef(pluginMap.id);
      }

      return oldCallPlugin.apply(this, arguments);
    };

    return context;
  };

  if (!requirejs.onResourceLoad) {
    requirejs.onResourceLoad = function (context, map) {
      var id = map.id,
          layer = context._layer,
          module = context.registry[id],
          url;
      context._registryBackup[id] = {
        map: module.map,
        depMaps: module.depMaps
      };
      if (context.plugins && lang.hasProp(context.plugins, id)) {
        lang.eachProp(context.needFullExec, function(value, prop) {
          if (value !== true && value.prefix === id && value.unnormalized) {
            var map = context.makeModuleMap(value.originalName,
                                            value.parentMap);
            context.needFullExec[map.id] = map;
          }
        });
      }
      if (context.needFullExec && getOwn(context.needFullExec, id)) {
        context.fullExec[id] = map;
      }
      if (map.prefix) {
        if (falseProp(layer.pathAdded, id)) {
          layer.buildFilePaths.push(id);
          layer.buildPathMap[id] = id;
          layer.buildFileToModule[id] = id;
          layer.modulesWithNames[id] = true;
          layer.pathAdded[id] = true;
        }
      } else if (map.url && context._isSupportedBuildUrl(map.url)) {
        url = map.url;
        if (!layer.pathAdded[url] && getOwn(layer.buildPathMap, id)) {
          layer.buildFilePaths.push(url);
          layer.pathAdded[url] = true;
        }
      }
    };
  }

  var idCounter = 0;

  function Loader(options) {
    var id;
    while (!id) {
      id = 'context' + (idCounter++);
      if (hasProp(requirejs.s.contexts, id)) {
        id = null;
      }
    }

    this.id = id;
    this.require = requirejs.config({
      context: id,
      isBuild: true,
      inlineText: true
    });


    this.getContext()._setToolOptions(options || {});
  }

  Loader.prototype = {
    getContext: function() {
      return requirejs.s.contexts[this.id];
    },
    discard: function() {
      delete requirejs.s.contexts[this.id];
    }
  };

  module.exports = Loader;
}());
