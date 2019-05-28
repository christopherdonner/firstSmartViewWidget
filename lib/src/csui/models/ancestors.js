/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/backbone", "csui/utils/log", "csui/models/ancestor"
], function (module, Backbone, log, AncestorModel) {

  var AncestorCollection = Backbone.Collection.extend({

    model: AncestorModel,

    constructor: function AncestorCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.options = options || {};
    }

  });
  AncestorCollection.version = '1.0';

  return AncestorCollection;

});
