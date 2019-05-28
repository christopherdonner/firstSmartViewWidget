/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/url',
  'csui/utils/user.avatar.color',
  'esoc/widgets/userwidget/view/miniprofile.view',
  'esoc/widgets/utils/chat/chat.view',
  'esoc/widgets/userwidget/util',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'hbs!esoc/widgets/userwidget/impl/userpickercard',
  'esoc/factory/pulsesettingsfactory',
  'esoc/controls/userwidget/userwidget.view',
  'css!esoc/widgets/userwidget/impl/userwidget.css'
], function (_require, $, _, Handlebars, Marionette, Url, UserAvatarColor, MiniProfileView, ChatView, Util, lang,
    UserPickerCardTemplate, PulseSettingsFactory, UserWidgetView) {
  var UserPickerCardView = Marionette.ItemView.extend({
    util: Util,
    className: 'esoc-userpickercard-container',
    template: UserPickerCardTemplate,
    initialize: function (options) {
      this.options = options;
      var connector = this.options.connector || this.model.collection.connector;
      this.chatSettings = options.context.getModel(PulseSettingsFactory,
          {attributes: {id: "chat"}, options: {chat: true}, permanent: true}).ensureFetched();
      this.followUnfollowActionUrl = Url.combine(
          this.util.commonUtil.getV2Url(connector.connection.url),
          this.util.commonUtil.REST_URLS.pulseRestUrl,
          this.model.attributes.id);
      this.model.on('show:Actions', this.showActions, this);
      this.model.on('hide:Actions', this.hideActions, this);
    },
    constructor: function UserPickerCardView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
    },
    ui: {
      'viewProfileAction': '.esoc-picker-view .esoc-viewminiprofile-action',
      'followUnFollowAction': '.esoc-picker-view .esoc-mini-profile-following-action',
      'chatAction': '.esoc-picker-view .esoc-social-chat-icon',
      'actionSpacing': '.esoc-picker-view .esoc-mini-profile-otheruser-actions-spacing'
    },
    templateHelpers: function () {
      var messages = {
        chat: lang.chatLabel,
        image: lang.image
      }
      return {
        messages: messages
      };
    },
    events: {
      'click @ui.viewProfileAction': 'showUserProfileDialog',
      'click @ui.followUnFollowAction': 'followUnfollowAction',
      'mousedown @ui.followUnFollowAction': 'preventDefaultAction',
      'mousedown @ui.chatAction': 'preventDefaultAction',
      'mousedown @ui.actionSpacing': 'preventDefaultAction',
      'click @ui.actionSpacing': 'preventDefaultAction',
      'click @ui.chatAction': 'preventDefaultAction'
    },
    preventDefaultAction: function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
    },
    showActions: function () {
      this.$el.find(".esoc-mini-profile-userinfo").addClass(
          "esoc-mini-profile-userinfo-with-actions");
      this.$el.find(".member-info").addClass("member-info-with-actions");
      this.$el.find(".esoc-mini-profile-actions").show();
    },
    hideActions: function () {
      this.$el.find(".esoc-mini-profile-actions").hide();
      this.$el.find(".member-info").removeClass("member-info-with-actions");
    },
    onRender: function (e) {
      var that = this;
      that.options.userbackgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
      if (that.model.attributes.otherUser) {
        that.chatSettings.done(function (response) {
          if (response.attributes.chatSettings.chatEnabled) {
            that.$el.find(".esoc-chat-action-enabled-" + that.model.attributes.id).show();
            var contentRegion = new Marionette.Region({
                  el: that.$el.find(".esoc-miniprofile-chat-action")
                }),
                chatOptions   = {
                  context: that.options.context,
                  tguser: that.model.attributes.name,
                  domain: response.attributes.chatSettings.chatDomain
                },
                chatView      = new ChatView(chatOptions);
            contentRegion.show(chatView);
          } else {
            that.$el.find(".esoc-chat-action-disabled-" + that.model.attributes.id).show();
          }
        });
      }
      this.setProfilePic();
    },
    setProfilePic: function () {
      var userId                = this.options.model.attributes.id,
          userProfilePicOptions = {
            context: this.options.context,
            userid: userId,
            photoElement: this.$el.find(".esoc-user-picker-img-" + Util.escapeSelector(userId)),
            defaultPhotElement: this.$el.find(".esoc-user-picker-default-img-" + Util.escapeSelector(userId)),
            userbackgroundcolor: this.options.userbackgroundcolor
          };
      this.util.commonUtil.setProfilePic(userProfilePicOptions);
      this.util.commonUtil.setUserColor(userProfilePicOptions); 
    },
    showUserProfileDialog: function (e) {
      this.model.attributes.userid = this.model.attributes.id;
      var userwidgetOptions = _.extend({}, this.options.widgetOptions);
      delete userwidgetOptions["model"];
      userwidgetOptions.model = this.model;
      UserWidgetView = !!UserWidgetView ? UserWidgetView :
                       _require("esoc/controls/userwidget/userwidget.view");
      var newUserWidgetView = new UserWidgetView(userwidgetOptions);
      newUserWidgetView.showUserProfileDialog(e);
    },
    followUnfollowAction: function (e) {
      e.stopPropagation(e);
      var formData = new FormData(),
          _evnt    = e || window.event;
      var followUnfollowAction = !this.model.attributes.following ?
                                 Util.commonUtil.globalConstants.FOLLOW :
                                 Util.commonUtil.globalConstants.UNFOLLOW;
      formData.append(Util.commonUtil.globalConstants.ACTION, followUnfollowAction);
      var args = {
        "itemview": this,
        "url": this.followUnfollowActionUrl,
        "type": "POST",
        "data": formData,
        "requestType": "miniProfilePopup",
        "targetElement": $(e.target.parentElement),
        "connector": this.options.connector
      };
      this.util.updateAjaxCall(args);
    }
  });
  return UserPickerCardView;
});