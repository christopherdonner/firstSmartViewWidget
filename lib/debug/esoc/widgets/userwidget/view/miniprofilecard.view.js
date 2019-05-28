csui.define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/url',
  'csui/utils/user.avatar.color',
  'esoc/widgets/userwidget/view/miniprofile.view',
  'esoc/widgets/utils/chat/chat.view',
  'esoc/widgets/userwidget/util',
  'esoc/widgets/userwidget/chat/chatutil',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'css!esoc/widgets/userwidget/impl/userwidget.css'
], function ($, _, Handlebars, Marionette, Url, UserAvatarColor, MiniProfileView, ChatView, Util, ChatUtil,
    lang) {
  var MiniProfileCardView = MiniProfileView.extend({
    util: Util,
    className: 'esoc-miniprofilecard-container binf-col-lg-5 binf-col-md-5 binf-col-sm-5 binf-col-xs-5',
    initialize: function (options) {
      this.options = options;
      this.followUnfollowActionUrl = Url.combine(
          this.util.commonUtil.getV2Url(this.model.collection.connector.connection.url),
          this.util.commonUtil.REST_URLS.pulseRestUrl,
          this.model.attributes.id);
    },
    constructor: function MiniProfileCardView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.model.on('presence:update', this.onPresenceUpdate, this);
    },
    events: {
      'click .esoc-viewminiprofile-action, .esoc-mini-profile-avatar, .esoc-mini-profile-user-name': 'showUserProfileDialog',
      'click .esoc-mini-profile-following-action': 'followUnfollowAction',
      'mouseenter .esoc-miniprofile-view': 'showActions',
      'mouseleave .esoc-miniprofile-view': 'hideActions'
    },
    showActions: function () {
      this.$el.find(".esoc-mini-profile-userinfo").addClass(
          "esoc-mini-profile-userinfo-with-actions");
      this.$el.find(".esoc-mini-profile-actions").show();
    },
    hideActions: function () {
      this.$el.find(".esoc-mini-profile-actions").hide();
      this.$el.find(".esoc-mini-profile-userinfo").removeClass(
          "esoc-mini-profile-userinfo-with-actions");
      if (this.$el.find(".esoc-mini-profile-actions").hasClass("esoc-miniprofile-has-tabindex")) {
        if (this.options.model.attributes.business_email) {
          this.$el.find(".esoc-mini-profile-userinfo").find(
              ".esoc-mini-profile-user-email").focus();
        } else {
          this.$el.find(".esoc-mini-profile-userinfo").find(".esoc-mini-profile-user-name").focus();
        }
        this.$el.find(".esoc-mini-profile-actions").removeClass('esoc-miniprofile-has-tabindex');
      }
    },
    onRender: function (e) {
      var that = this;
      that.options.userbackgroundcolor = UserAvatarColor.getUserAvatarColor(that.model.attributes);
      if (that.model.attributes.chatSettings && that.model.attributes.chatSettings.chatEnabled &&
          that.model.attributes.chatSettings.presenceEnabled) {
        that.$el.find("#esoc-mini-profile-presence-indicator").addClass(
            "esoc-user-profile-default-presence").attr("title", lang.presenceUnknownTooltipText);
      }
      if (that.model.attributes.otherUser && !!that.model.attributes.chatSettings &&
          !!that.model.attributes.chatSettings.chatEnabled) {
        that.$el.find(".esoc-chat-action-enabled-" + that.model.attributes.id).show();
        var contentRegion = new Marionette.Region({
              el: that.$el.find(".esoc-miniprofile-chat-action")
            }),
            chatOptions   = {
              context: that.options.parentViewOptions.context,
              tguser: that.model.get('name'),
              domain: that.options.model.get('chatSettings') &&
                      that.options.model.get('chatSettings').chatDomain
            },
            chatView      = new ChatView(chatOptions);
        contentRegion.show(chatView);
      } else {
        that.$el.find(".esoc-chat-action-disabled-" + that.model.attributes.id).show();
      }
      that.$el.find('.esoc-mini-profile-user').find('.esoc-mini-profile-pic').bind('keyup',
          function (e) {
            if ((e.keyCode || e.which) === 9 &&
                $(".esoc-mini-profile-actions").hasClass("esoc-miniprofile-has-tabindex")) {
              $(".esoc-mini-profile-actions").removeClass('esoc-miniprofile-has-tabindex');
            }
          });
      that.$el.find(".esoc-mini-profile-actions").find(
          '.esoc-mini-profile-following-action, .esoc-viewminiprofile-action').bind('keyup',
          function (e) {
            if ((e.keyCode || e.which) === 9) {
              that.$el.find(".esoc-mini-profile-actions").addClass('esoc-miniprofile-has-tabindex');
            }
          });
    },
    onShow: function () {
      this.setProfilePic();
    },
    setProfilePic: function () {
      var userId                = this.options.model.attributes.id,
          userProfilePicOptions = {
            context: this.options.parentViewOptions.context,
            userid: userId,
            photoElement: this.$el.find(".esoc-userprofile-img-" + Util.escapeSelector(userId)),
            defaultPhotElement: this.$el.find(".esoc-user-default-avatar-" + Util.escapeSelector(userId)),
            userbackgroundcolor: this.options.userbackgroundcolor
          };
      this.util.commonUtil.setProfilePic(userProfilePicOptions);
      this.util.commonUtil.setUserColor(userProfilePicOptions);  
    },
    showUserProfileDialog: function (e) {
      this.trigger("show.user.dialog");
    },
    followUnfollowAction: function (e) {
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
        "requestType": "relation",
        "targetElement": $(_evnt.target)
      };
      this.util.updateAjaxCall(args);
    },
    onPresenceUpdate: function (presence) {
      ChatUtil.setIconColor(presence,
          this.$el.find("#esoc-mini-profile-presence-indicator"));
    }
  });
  return MiniProfileCardView;
});

