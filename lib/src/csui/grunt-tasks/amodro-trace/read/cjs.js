/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


'use strict';

var parse = require('../lib/parse');

module.exports = function cjs(fileName, fileContents) {
  try {
    var preamble = '',
    commonJsProps = parse.usesCommonJs(fileName, fileContents);
    if (parse.usesAmdOrRequireJs(fileName, fileContents) || !commonJsProps) {
    return fileContents;
    }

    if (commonJsProps.dirname || commonJsProps.filename) {
    preamble = 'var __filename = module.uri || \'\', ' +
      '__dirname = ' +
      '__filename.substring(0, __filename.lastIndexOf(\'/\') + 1); ';
    }
    fileContents = 'define(function (require, exports, module) {' +
    preamble +
    fileContents +
    '\n});\n';

  } catch (e) {
    console.log('commonJs.convert: COULD NOT CONVERT: ' + fileName +
          ', so skipping it. Error was: ' + e);
    return fileContents;
  }

  return fileContents;
};
