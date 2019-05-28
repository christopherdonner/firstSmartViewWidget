/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone"
], function ($, Backbone) {
  var ContactModel = Backbone.Model.extend({
    defaults: {},
    constructor: function ContactModel() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });
  return ContactModel;
});