/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.model', 'csui/lib/underscore.deepExtend'
], function (module, _, Backbone, ModelFactory, NodeModelFactory, NodeModel) {

  var ContainingWorkspaceModelFactory = ModelFactory.extend({

    propertyPrefix: 'containingWorkspace',

    constructor: function ContainingWorkspaceModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var containingWorkspace = this.options.containingWorkspace || {};
      if (!(containingWorkspace instanceof Backbone.Model)) {
        var node = context.getModel(NodeModelFactory, options),
            config = module.config(),
            workspaceOptions = _.deepExtend({
              connector: node.connector
            }, containingWorkspace.options, config.options);
        var workspaceTypes = workspaceOptions.containingWorkspaceTypes =
                _.chain(workspaceOptions.containingWorkspaceTypes)
                 .values()
                 .flatten()
                 .unique()
                . value(),
            workspaceAttributes = _.extend(
              {}, this._getContainingWorkspaceAttributes(node, workspaceTypes),
                containingWorkspace.attributes, config.attributes
            );
        node.setExpand('properties', 'volume_id');
        containingWorkspace = new NodeModel(workspaceAttributes,
            workspaceOptions);

        this.listenTo(node, 'change:volume_id', function () {
          var attributes = this._getContainingWorkspaceAttributes(node, workspaceTypes);
          containingWorkspace.set(attributes);
        });
      }
      this.property = containingWorkspace;
    },

    _getContainingWorkspaceAttributes: function (node, containingWorkspaceTypes) {
      var nodeType = node.get('type'),
          attributes = _.contains(containingWorkspaceTypes, nodeType) ?
                       node.attributes : node.get('volume_id');
      return attributes;
    }

  });

  return ContainingWorkspaceModelFactory;

});
