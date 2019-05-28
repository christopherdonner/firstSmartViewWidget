/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone"
], function ($, Backbone) {

  var RealTimeModel = Backbone.Model.extend({
    constructor: function RealTimeModel(options) {
      this.submodel = {};
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    initialize: function () {
    },
    getUserPresence: function (email) {
    },
    getUsersPresence: function (emailList) {
    }
  });

  return new RealTimeModel;
});

