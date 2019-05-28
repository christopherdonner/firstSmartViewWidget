/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/backbone",
  "csui/utils/log", "csui/models/column"
], function (module, Backbone, log, ColumnModel) {

  var ColumnCollection = Backbone.Collection.extend({

    model: ColumnModel,

    constructor: function ColumnCollection() {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });
  ColumnCollection.version = '1.0';

  return ColumnCollection;

});
