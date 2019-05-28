/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone'
], function (Backbone) {
  'use strict';

  var SavedQueryModel = Backbone.Model.extend({

    constructor: function SavedQueryModel() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    idAttribute: null

  });

  return SavedQueryModel;

});
