/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/permission/nodeuserpermissions',
  'csui/utils/commands',
  'csui/utils/base'
], function (require, module, _, Backbone, CollectionFactory, ConnectorFactory,
    NodeUserPermissionCollection, commands, base) {

  var PermissionCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'nodeUserPermissions',

    constructor: function PermissionCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var nodeUserPermissions = this.options.nodeUserPermissions || {};
      if (!(nodeUserPermissions instanceof Backbone.Collection)) {
        var connector    = context.getObject(ConnectorFactory, options),
            query        = options.nodeUserPermissions.memberFilter,
            config       = module.config();
        nodeUserPermissions = new NodeUserPermissionCollection(nodeUserPermissions.models, _.extend({
          connector: connector,
          query: query,
          nodeId: this.options.model.get("id")
        }, nodeUserPermissions.options, config.options, {
          autofetch: true,
          autoreset: true
        }));
      }
      this.property = nodeUserPermissions;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      this.property.fetch({
        success: _.bind(this._onNodeUserPermissionsFetched, this, options),
        error: _.bind(this._onNodeUserPermissionsFailed, this, options)
      });
    },

    _onNodeUserPermissionsFetched: function (options) {
      return true;
    },

    _onNodeUserPermissionsFailed: function (model, request, message) {
      var error = new base.RequestErrorMessage(message);
      require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlert) {
        ModalAlert.showError(error.toString());
      });
    }
  });

  return PermissionCollectionFactory;
});