/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette'], function (Marionette) {
  var Factory = Marionette.Controller.extend({

    constructor: function Factory(context, options) {
      this.context = context;
      this.options = options || {};
    },
    propertyPrefix: null

  });

  return Factory;

});
