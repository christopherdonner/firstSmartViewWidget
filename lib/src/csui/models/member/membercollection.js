/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/browsable/v1.request.mixin', 'csui/models/member/member.model'
], function (_, Backbone, Url, ResourceMixin, BrowsableMixin, BrowsableV1RequestMixin,
    MemberModel) {
  'use strict';
  var MemberCollection = Backbone.Collection.extend({

    model: MemberModel,

    searchTerm: "",

    constructor: function MemberCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeResource(options);
      this.makeBrowsable(options);

      if (options !== undefined && options.member !== undefined && options.member !== null) {
        this.parentId = options.member.get("id");
        this.nodeId = options.member.get("nodeId");
        this.categoryId = options.member.get("categoryId");
        this.groupId = options.member.get("groupId");
      } else {
        this.nodeId = options.nodeId;
        this.categoryId = options.categoryId;
        this.groupId = options.groupId;
      }
      this.query = options.query || "";
      this.type = options.type;
    },

    clone: function () {
      var clone = new this.constructor(this.models, {
        connector: this.connector,
        parentId: this.parentId,
        nodeId: this.nodeId,
        categoryId: this.categoryId,
        groupId: this.groupId,
        query: this.query
      });
      clone.totalCount = this.totalCount;
      return clone;
    },

    url: function () {

      var url = this.connector.connection.url;
      var id = this.groupId;
      if (id === undefined || id === null) {
        id = this.parentId;
        this.topCount = 20;
      }

      if (!this.topCount) {
        this.topCount = 20;
      }

      var query = Url.combineQueryString(
          this.getBrowsableUrlQuery()
      );
      query = query.replace('where_name', 'query');

      url = url.replace('/api/v1', '/api/v2');

      if (this.type && this.type === 'GroupsOfCurrentUser') {
        url = Url.combine(url, "members/memberof?" + query);
      } else if (this.type === 1 && id) {
        url = Url.combine(url, "members/" + id + "/members?where_type=1&" + query);
      } else if (this.type === 1) {
        url = Url.combine(url, "members?where_type=1&" + query);
      } else if (id) {
        url = Url.combine(url, "members/" + id + "/members?" + query);
      } else {
        url = Url.combine(url, "members?" + query);
      }

      return url;
    },

    parse: function (response, options) {
      if (!_.isEmpty(response.results)) {
        var self = this;
        this.totalCount = (response.collection && response.collection.paging) ?
                          response.collection.paging.total_count :
                          response.results.length;
        _.each(response.results, function (member) {
          member.parentId = self.parentId;
          member = _.extend(member, member.data.properties);
        });

        return response.results;
      }
      this.totalCount = 0;
      return null;
    },

    search: function (term) {
      this.searchTerm = term;
      this.fetch();
    }

  });

  ResourceMixin.mixin(MemberCollection.prototype);
  BrowsableMixin.mixin(MemberCollection.prototype);
  BrowsableV1RequestMixin.mixin(MemberCollection.prototype);

  return MemberCollection;
});
