/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/member', 'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin', 'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin'
], function (_, Backbone, Url, MemberModel, ConnectableMixin, FetchableMixin,
    ExpandableMixin, IncludingAdditionalResourcesMixin) {
  'use strict';

  var AuthenticationModel = Backbone.Model.extend({

    constructor: function AuthenticationModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeConnectable(options)
          .makeIncludingAdditionalResources(options)
          .makeFetchable(options)
          .makeExpandable(options);

      this.user = new MemberModel(this.get("user"), options);
    },

    idAttribute: null,

    url: function () {
      var url = Url.combine(this.connector.connection.url, "auth"),
          query = Url.combineQueryString(
              this.getExpandableResourcesUrlQuery(),
              this.getAdditionalResourcesUrlQuery()
          );
      return query ? url + '?' + query : url;
    },

    parse: function (response) {
      var user = response.user || (response.user = response.data);
      _.defaults(user, {
        perspective: response.perspective
      });
      if (this.user) {
        this.user.set(user);
      }

      return response;
    }

  });

  IncludingAdditionalResourcesMixin.mixin(AuthenticationModel.prototype);
  ExpandableMixin.mixin(AuthenticationModel.prototype);
  ConnectableMixin.mixin(AuthenticationModel.prototype);
  FetchableMixin.mixin(AuthenticationModel.prototype);

  return AuthenticationModel;

});
