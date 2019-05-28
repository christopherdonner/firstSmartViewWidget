/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette'], function (Marionette) {
  'use strict';

  var NonAttachingRegion = Marionette.Region.extend({

    constructor: function NonAttachingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
    },

    attachHtml: function (view) {}

  });

  return NonAttachingRegion;

});
