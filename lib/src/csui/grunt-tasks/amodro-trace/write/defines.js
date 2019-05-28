/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';
var lang = require('../lib/lang'),
    transform = require('../lib/transform'),
    falseProp = lang.falseProp,
    getOwn = lang.getOwn,
    makeJsArrayString = lang.makeJsArrayString;
function defines(options) {
  options = options || {};

  return function(context, moduleName, filePath, contents) {
    var config = context.config,
        packageName = require('./packages').getPackageName(context, moduleName);

    contents = defines.toTransport(context, moduleName,
                                   filePath, contents, options);
    if (moduleName && falseProp(context._layer.modulesWithNames, moduleName)) {
      var shim = config.shim && (getOwn(config.shim, moduleName) ||
                 (packageName && getOwn(config.shim, packageName)));
      if (shim) {
        if (options.wrapShim) {
          contents = '(function(root) {\n' +
                         'define("' + moduleName + '", ' +
                         (shim.deps && shim.deps.length ?
                                makeJsArrayString(shim.deps) + ', ' : '[], ') +
                        'function() {\n' +
                        '  return (function() {\n' +
                             contents +
                             '\n' + (shim.exportsFn ? shim.exportsFn() : '') +
                             '\n' +
                        '  }).apply(root, arguments);\n' +
                        '});\n' +
                        '}(this));\n';
        } else {
          contents += '\n' + 'define("' + moduleName + '", ' +
                         (shim.deps && shim.deps.length ?
                                makeJsArrayString(shim.deps) + ', ' : '') +
                         (shim.exportsFn ? shim.exportsFn() : 'function(){}') +
                         ');\n';
        }
      } else {
        contents += '\n' + 'define("' + moduleName + '", function(){});\n';
      }
    }

    return contents;
  };
}
defines.toTransport = function(context, moduleName,
                               filePath, contents, options) {
  options = options || {};
  if (!options.logger) {
    options.logger = context.config._options.logger;
  }

  function onFound(info) {
    if (context && (info.needsId || info.foundId === moduleName)) {
      context._layer.modulesWithNames[moduleName] = true;
    }
  }

  return transform.toTransport('', moduleName, filePath,
                               contents, onFound, options);
};

module.exports = defines;
