/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/url', 'csui/models/member', 'csui/models/mixins/resource/resource.mixin'
], function (_, $, Backbone, Url, MemberModel, ResourceMixin) {
  'use strict';

  var MemberCollection = Backbone.Collection.extend({

    constructor: function MemberCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeResource(options);

      options || (options = {});

      this.limit = options.limit || 10;
      this.query = options.query || "";
      this.expandFields = options.expandFields || [];
      if (options.memberFilter && options.memberFilter.type) {
        this.memberType = options.memberFilter.type;
      }
      this.memberType || (this.memberType = [0, 1]);
    },

    model: MemberModel,

    clone: function () {
      return new this.constructor(this.models, {
        connector: this.connector,
        limit: this.limit,
        query: this.query,
        expandFields: _.clone(this.expandFields),
        memberFilter: {type: this.memberType}
      });
    },

    urlRoot: function () {
      var apiBase = new Url(this.connector.connection.url).getApiBase('v2');
      return Url.combine(apiBase, "/members");
    },

    url: function () {
      var limitClause  = "limit=" + this.limit,
          memberClause = this.memberType.length &&
                         "where_type=" + this.memberType.join("&where_type=") || "",
          expandClause = this.expandFields.length &&
                         "expand=properties{" + this.expandFields.join(",") + "}" ||
                         "",
          queryClause  = "query=" + encodeURIComponent(this.query),
          finalClauses = Url.combineQueryString(limitClause, memberClause,
              expandClause, queryClause);
      return Url.appendQuery(_.result(this, "urlRoot"), finalClauses);
    },

    parse: function (response) {
      if (!_.isEmpty(response.results)) {
        _.each(response.results, function (member) {
          member = _.extend(member, member.data.properties);
          delete member.data;
        });
        return response.results;
      }
      return null;
    }

  });

  ResourceMixin.mixin(MemberCollection.prototype);

  return MemberCollection;

});
