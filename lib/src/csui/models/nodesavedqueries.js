/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/log', 'csui/models/savedqueries',
  'csui/models/mixins/node.resource/node.resource.mixin'
], function (_, $, Url, log, SavedQueryCollection, NodeResourceMixin) {
  'use strict';

  var NodeSavedQueryCollection = SavedQueryCollection.extend({

    constructor: function NodeSavedQueryCollection(attributes, options) {
      SavedQueryCollection.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options);
    },

    clone: function () {
      return new this.constructor(this.models, {
        node: this.node
      });
    },

    parse: function (response) {
      _.each(response.data, function (item) {
        _.isObject(item.id) && _.extend(item, item.id);
      });
      return response.data;
    },

    url: function () {
      return Url.combine(this.node.urlBase(),
          '/customviewsearchforms?expand_fields=id');
    }

  });

  NodeResourceMixin.mixin(NodeSavedQueryCollection.prototype);

  return NodeSavedQueryCollection;

});
