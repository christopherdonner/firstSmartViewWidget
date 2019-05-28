/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';
var parse = require('./lib/parse'),
    transform = require('./lib/transform');
var config = {
  find: function (contents) {
    return parse.findConfig(contents).config;
  },
  modify: function(contents, onConfig) {
    return transform.modifyConfig(contents, onConfig);
  }
};

module.exports = config;
