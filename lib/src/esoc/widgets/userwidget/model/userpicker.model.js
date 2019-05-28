/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/underscore",
  "esoc/widgets/userwidget/model/userpickercard.model",
  "esoc/widgets/userwidget/util",
  'csui/utils/url',
  'csui/utils/contexts/factories/user',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'csui/models/resource'
], function ($, Backbone, _, UserPickerCardModel, UserWidgetUtil, Url, UserModelFactory, lang,
    ResourceModel) {
  var UserPickerCollection = Backbone.Collection.extend(
      _.extend({},
          ResourceModel(Backbone.Collection), {
            util: UserWidgetUtil,
            model: UserPickerCardModel,
            constructor: function UserPickerCollection(options) {
              this.user = options.context ?
                          options.context.getModel(UserModelFactory) : undefined;
              this.limit = options.limit || 10;
              this.query = options.query || "";
              if (options.memberFilter && options.memberFilter.type) {
                this.memberType = options.memberFilter.type;
              }
              this.memberType || (this.memberType = [0, 1]);

              if (options && options.connector) {
                options.connector.assignTo(this);
              }
              Backbone.Collection.prototype.constructor.apply(this, arguments);
            },

            urlRoot: function () {
              return Url.combine(this.util.commonUtil.getV2Url(this.connector.connection.url),
                  this.util.commonUtil.REST_URLS.searchUsersUrl);
            },
            url: function () {
              var limitClause = "?limit=" + this.limit;
              var memberClause = this.memberType.length &&
                                 "&where_type=" + this.memberType.join("&where_type=") || "";
              var expandClause = encodeURIComponent("&expand=properties{group_id}");
              var queryClause = "&query=" + encodeURIComponent(this.query);
              return _.result(this, "urlRoot") + limitClause + memberClause + expandClause +
                     queryClause;
            },
            parse: function (response) {
              for (var index in response.results) {
                var user = response.results[index];
                if (user.data.properties.id === this.user.get("id")) {
                  user.data.properties.self = true;
                }
              }
              return response.results;
            },
            fetch: function () {
              return this.Fetchable.fetch.apply(this, arguments);
            }
          }));

  return UserPickerCollection;
});
