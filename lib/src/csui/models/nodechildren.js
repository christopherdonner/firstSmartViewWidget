/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/url', 'csui/models/node/node.model', 'csui/models/nodes',
  'csui/models/nodechildrencolumns',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/mixins/delayed.commandable/delayed.commandable.mixin',
  'csui/models/node.children/server.adaptor.mixin',
  'csui/utils/log', 'csui/utils/deepClone/deepClone'
], function (module, $, _, Backbone, Url, NodeModel, NodeCollection,
    NodeChildrenColumnCollection, NodeResourceMixin, ExpandableMixin,
    BrowsableMixin, DelayedCommandableMixin, ServerAdaptorMixin, log) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30
  });

  log = log(module.id);

  var NodeChildrenCollection = NodeCollection.extend({

    constructor: function NodeChildrenCollection(models, options) {
      options = _.defaults({}, options, {
        top: config.defaultPageSize,
        columnsFromDefinitionsOrder: false
      }, options);

      NodeCollection.prototype.constructor.call(this, models, options);

      this.makeNodeResource(options)
          .makeExpandable(options)
          .makeDelayedCommandable(options)
          .makeBrowsable(options)
          .makeServerAdaptor(options);

      this.options = options;
      this.includeActions = options.includeActions;
      this.columns = new NodeChildrenColumnCollection();
    },

    clone: function () {
      return new this.constructor(this.models, {
        node: this.node,
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: this.orderBy,
        expand: _.clone(this.expand),
        includeActions: this.includeActions,
        commands: _.clone(this.includeCommands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands
      });
    },

    isFetchable: function () {
      return this.node.isFetchable();
    }
  });

  BrowsableMixin.mixin(NodeChildrenCollection.prototype);
  ExpandableMixin.mixin(NodeChildrenCollection.prototype);
  DelayedCommandableMixin.mixin(NodeChildrenCollection.prototype);
  ServerAdaptorMixin.mixin(NodeChildrenCollection.prototype);
  NodeResourceMixin.mixin(NodeChildrenCollection.prototype);
  var originalFetch = NodeChildrenCollection.prototype.fetch;
  NodeChildrenCollection.prototype.Fetchable = {
    fetch: function (options) {
      return originalFetch.call(this, options);
    }
  };

  return NodeChildrenCollection;
});
