/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/node.resource/node.resource.mixin'
], function (_, Backbone, Url, NodeResourceMixin) {
  'use strict';

  var SpecificNodeModel = Backbone.Model.extend({

    constructor: function SpecificNodeModel(attributes, options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.call(this, arguments);
      this.makeNodeResource(options);
    },

    parse: function (response) {
      return response;
    },

    url: function () {

      var node   = this.options.node,
          nodeId = node.get('id'),
          url;
      url = _.str.sformat('forms/nodes/properties/specific?id={0}',
          nodeId);

      return Url.combine(this.options.connector.connection.url, url);

    }

  });

  NodeResourceMixin.mixin(SpecificNodeModel.prototype);

  return SpecificNodeModel;

});
