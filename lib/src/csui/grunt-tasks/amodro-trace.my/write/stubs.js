/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';
var lang = require('../lib/lang');
module.exports = function stubs(options) {
  options = options || {};

  return function(context, moduleName, filePath, contents) {
    if (options.stubModules && options.stubModules.indexOf(moduleName) !== -1) {
      if (lang.hasProp(context.plugins, moduleName)) {
        return 'define({load: function(id){' +
               'throw new Error("Dynamic load not allowed: " + id);}});';
      } else {
        return 'define({});';
      }
    } else {
      return contents;
    }
  };

};
