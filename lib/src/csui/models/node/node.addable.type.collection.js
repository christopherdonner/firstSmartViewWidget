/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/node/node.model',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/node.addable.type/server.adaptor.mixin'
], function (_,
    Backbone,
    Url,
    NodeModel,
    NodeResourceMixin,
    ServerAdaptorMixin) {
  'use strict';

  var AddableTypeModel = Backbone.Model.extend({

    defaults: {
      type: null,
      type_name: null
    },

    idAttribute: 'type',

    constructor: function AddableTypeModel() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var NodeAddableTypeCollection = Backbone.Collection.extend({

    model: AddableTypeModel,

    constructor: function NodeAddableTypeCollection(models, options) {
      NodeAddableTypeCollection.__super__.constructor.apply(this, arguments);

      this.makeNodeResource(options)
        .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.models, {node: this.node});
    },

    isFetchable: function () {
      return this.node.isFetchable();
    }

  });

  NodeResourceMixin.mixin(NodeAddableTypeCollection.prototype);
  ServerAdaptorMixin.mixin(NodeAddableTypeCollection.prototype);

  return NodeAddableTypeCollection;

});
