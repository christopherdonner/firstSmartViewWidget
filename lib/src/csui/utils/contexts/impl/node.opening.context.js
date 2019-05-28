/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/contexts/context',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/node.links/node.links',
  'csui/utils/contexts/factories/user'
], function (Context, ConnectorFactory, NextNodeModelFactory,
    nodeLinks, UserModelFactory) {
  'use strict';
  var nodeOptions = {
    fields: {
      properties: [],
      columns: [],
      'versions.element(0)': ['mime_type']
    },
    includeResources: ['metadata', 'perspective']
  };

  var NodeOpeningContext = Context.extend({
    constructor: function NodeOpeningContext(options) {
      Context.prototype.constructor.apply(this, arguments);

      this.connector = this.getObject(ConnectorFactory, {
        permanent: true,
        detached: true
      });
      this.user = this.getModel(UserModelFactory, {
        permanent: true
      });
      this.nextNode = this.getModel(
          NextNodeModelFactory, {
            options: nodeOptions,
            permanent: true,
            detached: true
          })
          .on('change:id', this.onNextNodeChanged, this);
    },

    _isFetchable: function (factory) {
      return Context.prototype._isFetchable.apply(this, arguments) &&
             (factory.property !== this.user || !this.user.get('id'));
    },

    openNodePage: function (node) {
      this.triggerMethod('before:open:page', this, this.nextNode);
      window.open(nodeLinks.getUrl(node));
    }
  });

  return NodeOpeningContext;
});
