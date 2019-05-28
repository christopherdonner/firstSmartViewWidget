/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (_, $, Backbone) {
  'use strict';

  var SearchMetadataMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeSearchMetadataResponse: function (options) {
          return this;
        },

        parseSearchMetadataResponse: function (resp, options) {
          return resp;
        }
      });
    }
  };

  return SearchMetadataMixin;
});
