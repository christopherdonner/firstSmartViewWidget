/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';
var defines = require('./defines'),
    lang = require('../lib/lang'),
    parse = require('../lib/parse');
function packages(options) {
  options = options || {};

  return function(context, moduleName, filePath, contents) {
    var hasPackageName;
    var packageName = packages.getPackageName(context, moduleName);

    if (packageName) {
      hasPackageName = (packageName === parse.getNamedDefine(contents));
    }

    contents = defines.toTransport(context, moduleName,
                                   filePath, contents, options);

    if (packageName && !hasPackageName) {
      contents += ';define(\'' + packageName + '\', [\'' + moduleName +
                  '\'], function (main) { return main; });\n';
    }

    return contents;
  };

}
packages.getPackageName = function(context, moduleName) {
  var config = context.config,
      pkgsMainMap = config.pkgsMainMap;

  if (!pkgsMainMap) {
    config.pkgsMainMap = pkgsMainMap = {};
    lang.eachProp(context.config.pkgs, function(value, prop) {
        pkgsMainMap[value] = prop;
    });
  }

  return lang.getOwn(pkgsMainMap, moduleName) || null;
};

module.exports = packages;
