/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/utils/log',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/widgets/metadata/metadata.forms/server.adaptor.mixin'
], function (Backbone, log, NodeConnectableMixin,
    FetchableMixin,  ServerAdaptorMixin) {
  'use strict';

  var MetadataFormCollection = Backbone.Collection.extend({
    constructor: function MetadataFormCollection(models, options) {
      options || (options = {});
      this.action = options.action;
      this.inheritance = options.inheritance;
      this.container = options.container;
      this.formCollection = options.formCollection;

      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeNodeConnectable(options)
          .makeFetchable(options)
          .makeServerAdaptor(options);
    }
  });

  NodeConnectableMixin.mixin(MetadataFormCollection.prototype);
  FetchableMixin.mixin(MetadataFormCollection.prototype);
  ServerAdaptorMixin.mixin(MetadataFormCollection.prototype);

  return MetadataFormCollection;
});
