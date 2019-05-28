/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

var fs = require('fs');

module.exports = function (path) {
  var content = fs.readFileSync(path, 'utf-8'),
      require = {
        config: function () {
          config = arguments[0];
        }
      },
      config;
  eval(content);
  if (!config) {
    throw new Error('Invalid RequireJS main config file content.');
  }
  return config;
};
