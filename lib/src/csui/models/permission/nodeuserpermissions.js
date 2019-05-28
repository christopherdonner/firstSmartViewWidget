/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/permission/nodepermission.model',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/browsable/v2.response.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/permission/permission.response.mixin'
], function (module, $, _, Backbone, Url, NodePermissionModel,
    ConnectableMixin, FetchableMixin, BrowsableMixin,
    BrowsableV2ResponseMixin, ExpandableV2Mixin, PermissionResponseMixin) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30
  });

  var NodeUserPermissionCollection = Backbone.Collection.extend({

    model: NodePermissionModel,

    constructor: function NodeUserPermissionCollection(models, options) {
      options = _.defaults({}, options, {
        top: config.defaultPageSize
      }, options);

      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeFetchable(options);

      this.options = options;
      this.includeActions = options.includeActions;
      this.query = this.options.query;

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeBrowsable(options)
          .makeBrowsableV2Response(options)
          .makePermissionResponse(options);
    },

    isFetchable: function () {
      return true;
    },

    url: function () {
      var url = Url.combine(this.connector.connection.url, 'nodes',
          this.options.node.get('id')), query;
      url = url.replace("/v1", "/v2");
      if (!!this.options.memberId) {
        url += '/permissions/effective/' + this.options.memberId;
        query = Url.combineQueryString(
            {
              expand: 'permissions{right_id}'
            }, query);
      } else {
        query = Url.combineQueryString(
            {
              fields: ['properties{container, name, type, versions_control_advanced,' +
                       ' permissions_model}',
                'permissions{right_id, permissions, type}', 'versions{version_id}'],
              expand: ['permissions{right_id}']
            }, query);
      }
      if (query) {
        url += '?' + query;
      }

      return url;
    },

    parse: function (response, options) {
      if (!!response.results && !!response.results.data) {
        this.parsePermissionResponse(response, options, this.options.clearEmptyPermissionModel);
        if (!this.options.node.get("isNotFound")) {
          this.nodeName = response.results.data.properties ? response.results.data.properties.name :
                          "";
          if (this.isContainer === undefined || response.results.data.properties) {
            this.isContainer = response.results.data.properties ?
                               response.results.data.properties.container : true;
          }
          return response.results.data.permissions;
        }
      }
    },

    setOrder: function (attributes, fetch) {
      if (this.orderBy != attributes) {
        this.orderBy = attributes;
        if (fetch !== false) {
          this.fetch({skipSort: false});
        }
        return true;
      }
    },

    processForEmptyOwner: function () {
      if (!this.findWhere({type: 'owner'}) && !this.findWhere({type: 'group'})) {
        this.add({permissions: null, right_id: null, type: 'owner'}, {at: 0});
      }
    },

    addPublicAccess: function (publicAccessModel) {
      if (this.findWhere({type: 'owner'}) && this.findWhere({type: 'group'})) {
        this.add(publicAccessModel, {at: 2});
      } else {
        this.add(publicAccessModel, {at: 1});
      }
    },

    addOwnerOrGroup: function (nodePermissionModel) {
      var owner = this.findWhere({type: 'owner'});
      if (owner && owner.get('permissions') === null) { //No owner or group
        var currentModel = this.at(0);
        this.remove(currentModel, {silent: true});
        this.add(nodePermissionModel, {at: 0});
      }
      else {
        this.add(nodePermissionModel, {at: (nodePermissionModel.get('type') === 'owner') ? 0 : 1});
      }
    }
  });

  FetchableMixin.mixin(NodeUserPermissionCollection.prototype);
  BrowsableMixin.mixin(NodeUserPermissionCollection.prototype);
  BrowsableV2ResponseMixin.mixin(NodeUserPermissionCollection.prototype);
  ConnectableMixin.mixin(NodeUserPermissionCollection.prototype);
  ExpandableV2Mixin.mixin(NodeUserPermissionCollection.prototype);
  PermissionResponseMixin.mixin(NodeUserPermissionCollection.prototype);

  return NodeUserPermissionCollection;

});

