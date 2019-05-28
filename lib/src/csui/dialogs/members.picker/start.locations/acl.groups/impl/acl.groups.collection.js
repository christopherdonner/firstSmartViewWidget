/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/member/member.model', 'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin', 'csui/models/browsable/client-side.mixin',
  'csui/models/browsable/v2.response.mixin'
], function (module, _, $, Backbone, Url, MemberModel, ConnectableMixin, FetchableMixin,
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin) {
  "use strict";

  var AclContainerCollection = Backbone.Collection.extend({

    model: MemberModel,

    constructor: function AclContainerCollection(models, options) {
      this.options = options || {};
      Backbone.Collection.prototype.constructor.call(this, models, options);

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options);
    },

    url: function () {
      var url = Url.combine(this.connector.connection.url, 'nodes',
          this.options.nodeId), query;
      url = url.replace("/v1", "/v2");
      query = Url.combineQueryString(
          {
            fields: ['permissions{right_id, permissions, type}'],
            expand: 'permissions{right_id}'
          }, query);
      if (query) {
        url += '?' + query;
      }
      return url;
    },

    parse: function (response, options) {
      this.filterGroups(response);
      return response.aclGroups;
    },

    filterGroups: function (response) {
      var selectableMembers = response.results.data && response.results.data.permissions,
          selectableGroups  = [];
      _.each(selectableMembers, function (member) {
        if (member.right_id_expand &&
            member.right_id_expand.type === 1) {
          var group = {};
          group = member.right_id_expand;
          group.data = {};
          group.data.properties = member.right_id_expand;
          selectableGroups.push(group);
        }
      });
      response.aclGroups = selectableGroups;
      return response;
    }

  });

  ClientSideBrowsableMixin.mixin(AclContainerCollection.prototype);
  BrowsableV2ResponseMixin.mixin(AclContainerCollection.prototype);
  ConnectableMixin.mixin(AclContainerCollection.prototype);
  FetchableMixin.mixin(AclContainerCollection.prototype);

  return AclContainerCollection;
});