/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/url', 'csui/utils/log', 'csui/models/ancestor',
  'csui/models/ancestors', 'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/node.ancestors/server.adaptor.mixin'
], function (module, _, $, Backbone, Url, log, AncestorModel,
    AncestorCollection, NodeResourceMixin, ServerAdaptorMixin) {
  'use strict';

  var NodeAncestorCollection = AncestorCollection.extend({

    constructor: function NodeAncestorCollection(models, options) {
      AncestorCollection.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options)
        .makeServerAdaptor(options);

    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },

    isFetchable: function () {
      return this.node.isFetchable();
    }

  });

  NodeResourceMixin.mixin(NodeAncestorCollection.prototype);
  ServerAdaptorMixin.mixin(NodeAncestorCollection.prototype);

  return NodeAncestorCollection;

});
