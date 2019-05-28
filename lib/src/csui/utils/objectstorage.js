/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/lib/backbone", "csui/utils/log", "csui/lib/jquery"
], function (module, _, Backbone, log, $) {
  'use strict';
  function ObjectStorage() {
    this.items = {};
  }

  _.extend(ObjectStorage.prototype,{
    constructor: ObjectStorage,
    setItem: function (k, v) {
      this.items[k] = v;
    },

    getItem: function (k) {
      return this.items[k];
    },

    removeItem: function (k) {
      delete this.items[k];
    }
  });

  return ObjectStorage;
});