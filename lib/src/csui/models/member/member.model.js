/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/resource/resource.mixin'
], function (_, Backbone, Url, ResourceMixin) {
  'use strict';

  var MemberModel = Backbone.Model.extend({
    constructor: function MemberModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      this.groupId = attributes.groupId;
      this.makeResource(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },
    url: function () {
      var id  = this.get("id"),
          url = this.connector.connection.url;
      url = url.replace('/api/v1', '/api/v2');
      if (id) {
        url = Url.combine(url, "members/" + id + "/members");
      } else {
        url = Url.combine(url, "members");
      }
      return url;
    },
    parse: function (response) {
      var that = this;
      if (response.data !== undefined) {
        var memberId = this.get("id");
        _.each(response.data, function (member) {
          member.parentId = memberId;
        });

        return response;
      }
      return response;
    }
  });

  ResourceMixin.mixin(MemberModel.prototype);

  return MemberModel;
});
