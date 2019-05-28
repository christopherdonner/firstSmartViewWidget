/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette'], function (Marionette) {
  'use strict';

  var ScriptExecutingRegion = Marionette.Region.extend({

    constructor: function ScriptExecutingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function(view) {
      this.$el
          .html('')
          .append(view.el);
    }

  });

  return ScriptExecutingRegion;

});
