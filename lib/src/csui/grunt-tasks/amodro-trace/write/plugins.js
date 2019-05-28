/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';
var lang = require('../lib/lang'),
    defines = require('./defines');
module.exports = function plugins(options) {
  options = options || {};

  return function(context, moduleName, filePath, contents) {
    var parts = context.makeModuleMap(moduleName),
        builder = parts.prefix && lang.getOwn(context.defined, parts.prefix);

    if (builder) {
      if (builder.write) {
        var writeApi = function (input) {
          contents = input;
        };
        writeApi.asModule = function (moduleName, input) {
          contents = defines.toTransport(context, moduleName,
                                         filePath, input, options);
        };

        builder.write(parts.prefix, parts.name, writeApi);
      }
    }

    return contents;
  };
};

