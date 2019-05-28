/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/models/savedquery'
], function (Backbone, SavedQueryModel) {
  'use strict';

  var SavedQueryCollection = Backbone.Collection.extend({

    model: SavedQueryModel,

    constructor: function SavedQueryCollection() {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  return SavedQueryCollection;

});
