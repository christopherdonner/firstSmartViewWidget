/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';
if (typeof Promise !== 'undefined') {
  module.exports = Promise;
} else {
  module.exports = require('./prim');
}
