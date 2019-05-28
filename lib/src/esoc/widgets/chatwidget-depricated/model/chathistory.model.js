/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone"
], function ($, Backbone) {
  var HistoryModel = Backbone.Model.extend({
    defaults: {
      id: 0
    },
    constructor: function Comment() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });
  return HistoryModel;
});