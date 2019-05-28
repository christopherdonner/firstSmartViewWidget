/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
  'csui/utils/contexts/factories/user'
], function (_, Backbone, Url, ExpandableMixin, ResourceMixin,
    IncludingAdditionalResourcesMixin, UserModelFactory) {
  'use strict';

  var NodesCountModel = Backbone.Model.extend({
    constructor: function NodesCountModel(attributes, options) {
      options || (options = {});

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options)
          .makeIncludingAdditionalResources(options)
          .makeExpandable(options);
      this.options= options;
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },

    url: function () {
      var selectedNodeId = this.nodeId || this.options.node.get('id');
      var apiBase = new Url(this.connector.connection.url).getApiBase('v2'),
          url     = Url.combine(apiBase, '/nodes/', selectedNodeId, '/nodescount');

      return url;
    },

    parse: function (response) {
      return (response.results && response.results.data && response.results.data.countData) || {};
    }
  });

  IncludingAdditionalResourcesMixin.mixin(NodesCountModel.prototype);
  ExpandableMixin.mixin(NodesCountModel.prototype);
  ResourceMixin.mixin(NodesCountModel.prototype);

  return NodesCountModel;
});
