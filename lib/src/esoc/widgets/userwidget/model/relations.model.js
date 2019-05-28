/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "esoc/widgets/userwidget/model/miniprofilecard.model",
  "esoc/widgets/userwidget/util",
  'csui/utils/url',
  'csui/utils/contexts/factories/user',
  'esoc/widgets/userwidget/chat/chatfactory',
  'esoc/widgets/userwidget/chat/skype/skypeucwa.attribute.model',
  'i18n!esoc/widgets/userwidget/nls/lang'
], function ($, Backbone, MiniProfileCardModel, UserWidgetUtil, Url, UserModelFactory, ChatFactory,
    SkypeAttributeModel,
    lang) {
  var RelationsModel = Backbone.Collection.extend({
    getRelationsRESTUrl: "",
    util: UserWidgetUtil,
    defaults: {
      params: {
        cursor: -1
      },
      relationsRESTUrl: "",
      loggedUserId: "",
      relation: "",
      otherUserProfile: "",
      extendedmodel: ""
    },
    model: MiniProfileCardModel,
    constructor: function RelationsModel(options) {
      var relationsUrl = this.util.commonUtil.updateQueryStringValues(
          this.util.commonUtil.updateQueryStringValues(
              Url.combine(this.util.commonUtil.REST_URLS.pulseRestUrl,
                  options.userid),
              this.util.commonUtil.globalConstants.COUNT,
              this.util.commonUtil.globalConstants.PULSE_RESOURCE_COUNT),
          this.util.commonUtil.globalConstants.FIELDS, options.relation);
      var query = this.util.commonUtil.globalConstants.FIELDS + '=' +
                  this.util.commonUtil.globalConstants.CHAT_SEETING;
      relationsUrl = Url.appendQuery(relationsUrl, query);

      this.getRelationsRESTUrl = Url.combine(
          this.util.commonUtil.getV2Url(options.connector.connection.url),
          relationsUrl);
      this.relationsRESTUrl = this.getRelationsRESTUrl;
      this.defaults.loggedUserId = options.context.getModel(UserModelFactory) || options.loggedUserId;
      this.defaults.relation = options.relation;
      this.defaults.extendedmodel = options.userwidgetmodel;
      this.defaults.otherUserProfile = options.userwidgetmodel.attributes.otherUser;
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },
    url: function () {
      return this.getRelationsRESTUrl;
    },
    parse: function (responseData) {
      var response = responseData.results;
      this.defaults.extendedmodel.attributes.followers_count = response.followers_count;
      this.defaults.extendedmodel.attributes.friends_count = response.friends_count;
      this.defaults.extendedmodel.attributes.following = response.following;
      var relations = response[this.defaults.relation];
      this.defaults.params.cursor = relations.next_cursor;
      for (var index in relations.users) {
        var user = relations.users[index].user,
            selfUser = parseInt(user.id, 10) === parseInt(this.defaults.loggedUserId, 10);
        if (!!response.chatSettings) {
          user.chatSettings = response.chatSettings;
        }
        var modelAttrs = {
          relation: this.defaults.relation,
          selfUser: selfUser,
          otherUserProfile: this.defaults.otherUserProfile,
          following: user.following
        }
        this.util.setRelationModel(user, modelAttrs);
      }
      var returnData = JSON.parse(JSON.stringify(relations.users));
      return returnData;
    },
    fetch: function (options) {
      if (options && options.params) {
        options.params = $.extend(this.defaults.params, options.params);
        this.getRelationsRESTUrl = this.relationsRESTUrl + "&" + $.param(options.params);
      }
      Backbone.Collection.prototype.fetch.apply(this, arguments);
    },
    fetchSuccess: function (model, response, options) {
      if (response.results.chatSettings.chatEnabled &&
          response.results.chatSettings.presenceEnabled) {
        var users,
            emailIds = [],
            models   = [],
            presenceHolder = [],
            currentPage = Math.ceil(model.length / 10),
            count;
        if (model.defaults.relation === model.util.commonUtil.globalConstants.FRIENDS) {
          users = response.results.friends.users;
          count = response.results.friends_count;
        } else if (model.defaults.relation === model.util.commonUtil.globalConstants.FOLLOWERS) {
          users = response.results.followers.users
          count = response.results.followers_count;
        }
        if (users.length > 0) {
          for (var index in users) {
            emailIds[index] = users[index].user.screen_name + '@' +
                              response.results.chatSettings.chatDomain;
            presenceHolder[index] = "esoc-mini-profile-presence-indicator-" +
                                    users[index].user.id;
            models[index] = model.models[(currentPage - 1) * 10 + parseInt(index, 10)];
          }
          var presenceOptions = {
            presenceHolder: presenceHolder,
            email: emailIds,
            context: options.context,
            models: models
          };
          if (SkypeAttributeModel.isPluginEnabled()) {
            ChatFactory.getProvider().showUserPresence(presenceOptions);
          } else {
            ChatFactory.getProvider().updateEventPresence(presenceOptions);
          }
        }
      }
    }
  });
  return RelationsModel;
});
