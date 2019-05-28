/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/connector', 'csui/models/authenticated.user.node.permission'
], function (module, _, $, Backbone, ModelFactory, UserModelFactory, ConnectorFactory,
    AuthenticatedUserNodePermissionModel) {
  'use strict';

  var UserNodePermissionModelFactory = ModelFactory.extend({
    propertyPrefix: 'userNodePermission',

    constructor: function UserNodePermissionModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var userNodePermission = this.options.userNodePermission || {},
          config = module.config();
      if (!(userNodePermission instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            user      = context.getModel(UserModelFactory);
        userNodePermission = new AuthenticatedUserNodePermissionModel(
            userNodePermission.attributes,
            _.defaults({
                  connector: connector,
                  user: user,
                  node: this.options.node
                }, userNodePermission.options, config.options
            )
        );
      }
      this.property = userNodePermission;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return UserNodePermissionModelFactory;
});
