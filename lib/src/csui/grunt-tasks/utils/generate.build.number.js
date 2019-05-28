/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

const printf = require('printf');
module.exports = function (version) {
  var now = new Date(),
      minutes = (now.getHours() * 60 + now.getMinutes()) / 2;
  return printf('%s.%02d%02d%02d%03d', version || '1.0.0',
                now.getFullYear() % 100, now.getMonth() + 1,
                now.getDate(), minutes);
};
