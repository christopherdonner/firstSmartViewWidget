csui.define([
  'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/url',
  'esoc/widgets/userwidget/view/userprofile.view',
  'esoc/widgets/userwidget/util',
  'i18n!esoc/widgets/userwidget/nls/lang'
], function (Backbone, $, _, Url, UserProfileView, Util, Lang) {
  var ExtendedModel = Backbone.Model.extend({
    connector: "",
    restUrl: "",
    userWidgetView: "",
    constructor: function ExtendedModel(options) {
      this.options = options;
      this.userWidgetView = options.userWidgetView;
      this.restUrl = Util.commonUtil.updateQueryStringValues(
          Url.combine(Util.commonUtil.getV2Url(options.connector.connection.url),
              Util.commonUtil.REST_URLS.pulseRestUrl,
              this.userWidgetView.model.attributes.userid),
          Util.commonUtil.globalConstants.FIELDS, Util.commonUtil.globalConstants.EXTENDEDINFO);
      var query = Util.commonUtil.globalConstants.FIELDS + '=' +
                  Util.commonUtil.globalConstants.CHAT_SEETING;
      query = query + '&' + Util.commonUtil.globalConstants.FIELDS + '=' +
              Util.commonUtil.globalConstants.FIELD_MAX_CHAR_LIMIT;
      this.restUrl = Url.appendQuery(this.restUrl, query);

      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },
    url: function () {
      return this.restUrl;
    },
    fetch: function () {
      this.connector.authenticator.syncStorage();
      Backbone.Model.prototype.fetch.apply(this, arguments);
    },
    fetchSuccess: function (model, response) {
      $('.esoc-user-profile-tabcontainer li.esoc-user-pulse-enabled-tabs').show();
      $('.esoc-userprofile-action-names a.esoc-userprofile-following-action').show().html(
          response.results.following ? Lang.unfollow : Lang.follow);
      $('.esoc-userprofile-action-names a.esoc-userprofile-following-action').attr('title',
          response.results.following ? Lang.unfollow : Lang.follow);
      Util.changeRelationsCounts(response.results);
      if (model.attributes.otherUser && !!model.attributes.chatSettings &&
          !!model.attributes.chatSettings.chatEnabled) {
        $('.esoc-userprofile-action-names .esoc-user-profile-chat-action').show();
      }
    },
    fetchError: function (model, response) {
      $('.esoc-user-profile-tabcontainer li.esoc-user-pulse-enabled-tabs').remove();
      model.attributes.isError = true;
      model.attributes = _.extend(model.attributes, model.userWidgetView.model.attributes);
    },
    parse: function (data, options) {
      Util.commonUtil.globalConstants.MAX_CHAR_LIMIT = data.results.maxCharLimit;
      var modelAttributes = this.userWidgetView.model.attributes,
          targetFields    = ["followers_count", "friends_count", "following", "chatSettings"];
      _.each(targetFields, function (prop, id) {
        modelAttributes[prop] = data.results[prop];
      });
      data = _.extend(data.results, this.userWidgetView.model.attributes);
      return data;
    }
  });
  return ExtendedModel;
});
