/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';
var transforms = [
  require('./plugins'),
  require('./stubs'),
  require('./defines'),
  require('./packages')
];
module.exports = function all(options) {
  options = options || {};

  var transformFns = transforms.map(function(transform) {
    return transform(options);
  });

  return function(context, moduleName, filePath, contents) {
    contents = transformFns.reduce(function(contents, transformFn) {
      return transformFn(context, moduleName, filePath, contents);
    }, contents);

    return contents;
  };

};
