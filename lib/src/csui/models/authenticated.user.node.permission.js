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

  var AuthenticatedUserNodePermissionModel = Backbone.Model.extend({
    constructor: function AuthenticatedUserNodePermissionModel(attributes, options) {
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
      var selectedNodeId = this.node ? this.node.get('id') : this.options.node.get('id'),
          userId         = this.options.user.get('id');
      var apiBase = new Url(this.connector.connection.url).getApiBase('v2'),
          url     = Url.combine(apiBase, '/nodes/', selectedNodeId, '/permissions/effective/',
              userId);

      return url;
    },

    parse: function (response) {
      var permissions = response.results && response.results.data && response.results.data.permissions;
      if (permissions) {
        if (!this.node.get('container') && permissions.permissions.indexOf('add_items') !== -1) {
          permissions.permissions.splice(permissions.permissions.indexOf('add_items'), 1);
        }
      } else {
        permissions = {};
      }
      return permissions;
    },

    hasEditPermissionRights:function () {
      var permissons=this.get("permissions");
      return permissons && _.isArray(permissons) && _.contains(permissons,'edit_permissions');
    }
  });

  IncludingAdditionalResourcesMixin.mixin(AuthenticatedUserNodePermissionModel.prototype);
  ExpandableMixin.mixin(AuthenticatedUserNodePermissionModel.prototype);
  ResourceMixin.mixin(AuthenticatedUserNodePermissionModel.prototype);

  return AuthenticatedUserNodePermissionModel;
});
