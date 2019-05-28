/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin'
], function (module, Backbone, ConnectableMixin) {

  var AncestorModel = Backbone.Model.extend({

    constructor: function AncestorModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeConnectable(options);
    },

    idAttribute: null,

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    }

  });

  ConnectableMixin.mixin(AncestorModel.prototype);

  return AncestorModel;

});
