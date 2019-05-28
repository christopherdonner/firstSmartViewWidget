/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/base', 'csui/utils/log', 'csui/utils/url',
  'csui/models/versions', 'csui/models/actions', 'csui/models/columns',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/browsable/client-side.mixin',
  'csui/models/server.adaptors/nodeversions.mixin',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, base, log, Url,
    VersionCollection, ActionCollection,
    NodeColumnCollection, NodeResourceMixin,
    ExpandableMixin, ClientSideBrowsableMixin, ServerAdaptorMixin) {
  'use strict';

  var NodeVersionCollection = VersionCollection.extend({
    constructor: function NodeVersionCollection(models, options) {
      VersionCollection.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options)
          .makeExpandable(options)
          .makeClientSideBrowsable(options)
          .makeServerAdaptor(options);

      this.columns = new NodeColumnCollection();
    },

    clone: function () {
      return new this.constructor(this.models, {
        node: this.node,
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: _.clone(this.orderBy),
        expand: _.clone(this.expand),
        commands: _.clone(this.options.commands)
      });
    }

  });

  ClientSideBrowsableMixin.mixin(NodeVersionCollection.prototype);
  ExpandableMixin.mixin(NodeVersionCollection.prototype);
  NodeResourceMixin.mixin(NodeVersionCollection.prototype);
  ServerAdaptorMixin.mixin(NodeVersionCollection.prototype);
  var originalSetOrder = NodeVersionCollection.prototype.setOrder;
  NodeVersionCollection.prototype.setOrder = function (attributes, fetch) {
    if (attributes) {
    }
    return originalSetOrder.call(this, attributes, fetch);
  };

  return NodeVersionCollection;

});
