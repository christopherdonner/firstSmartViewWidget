/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/url',
  'csui/utils/user.avatar.color',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'hbs!esoc/widgets/userwidget/impl/miniprofile',
  'esoc/widgets/common/util',
  'esoc/widgets/userwidget/util',
  'esoc/widgets/utils/chat/impl/util',
  'esoc/widgets/userwidget/chat/view/presence.view',
  'css!esoc/widgets/userwidget/impl/userwidget.css'
], function (module, $, _, Handlebars, Marionette, Url, UserAvatarColor, lang, MiniProfileTemplate,
    CommonUtil, Util,
    ChatUtil, PresenceView) {
  var config = module.config();
  _.defaults(config, {
    hideFollow: false
  });

  var MiniProfileView = Marionette.ItemView.extend({
    commonUtil: CommonUtil,
    util: Util,
    className: 'esoc-miniprofile-view',
    template: MiniProfileTemplate,
    ui: {
      initialsPlaceholder: '.image_user_placeholder'
    },
    templateHelpers: function () {
      var showPresenceIndicator = this.options.showPresenceIndicator !== undefined &&
                                  this.options.showPresenceIndicator;

      return {
        messages: {
          enableSimpleSettingsModel: !!this.options.enableSimpleSettingsModel ? true : false,
          showPresenceIndicator: showPresenceIndicator,
          viewprofile: lang.viewprofile,
          unfollow: lang.unfollow,
          follow: lang.follow,
          chat: lang.chat,
          following: this.options.model.attributes.following ? "esoc-mini-profile-unfollow-icon" :
                     "esoc-mini-profile-follow-icon"
        }
      };
    },
    initialize: function (options) {
      this.options = options;
      this.followUnfollowActionUrl = Url.combine(
          Util.commonUtil.getV2Url(this.options.connector.connection.url),
          Util.commonUtil.REST_URLS.pulseRestUrl,
          this.model.id);
    },
    constructor: function MiniProfileView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
      var config = module.config();
      if (!!config) {
        this.options.enableSimpleSettingsModel = config.enableSimpleUserProfile;
      }
    },
    getParentView: function () {
      return this.options.userWidgetView;
    },
    onRender: function (e) {
      var targetEle     = this.options.targetEle,
          attributes    = this.options.model.attributes,
          following     = attributes.following ? this.templateHelpers().messages.unfollow :
                          this.templateHelpers().messages.follow,
          userId        = $(targetEle).attr("id"),
          contentparams = {
            "id": attributes.id,
            "display_name": attributes.display_name,
            "office_location": attributes.office_location,
            "business_email": attributes.business_email,
            "business_phone": attributes.business_phone,
            "business_phone_label": lang.simpleUserProfilePhoneLabel,
            "cell_phone_label": lang.simpleUserProfileMobile,
            "cell_phone": attributes.cell_phone,
            "title": attributes.title,
            "showPresenceIndicator": this.templateHelpers().messages.showPresenceIndicator,
            "otherUser": attributes.otherUser,
            "hideFollow": config.hideFollow, // ESOC-7098: Disable follow action
            "deleted": attributes.deleted,
            "initials": attributes.initials,
            "actions": {
              "viewprofile": this.templateHelpers().messages.viewprofile,
              "following": following,
              "chat": this.templateHelpers().messages.chat
            },
            enableSimpleSettingsModel: this.templateHelpers().messages.enableSimpleSettingsModel
          },
          content       = this.template(contentparams),
          that          = this;
      this.options.userbackgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
      $(targetEle).binf_popover({
        content: content,
        placement: function (context) {
          $(context).addClass("esoc-mini-profile-popover esoc");
          if (!!contentparams.enableSimpleSettingsModel) {
            $(context).addClass("esoc-simple-mini-profile-popover");
          }
          var _tempElement = $('<div/>')
              .attr("style", "display:none")
              .addClass("esoc-mini-profile-popover binf-popover esoc-mini-profile-temp-div")
              .append(MiniProfileTemplate);
          $(targetEle).append(_tempElement);
          var popOverMaxHeight = $(".esoc-mini-profile-temp-div").height() + 40,
              popOverMaxWidth  = $(".esoc-mini-profile-temp-div").width() + 40;
          _tempElement.remove();
          var popOverSource = $(targetEle),
              offset        = popOverSource.offset(),
              window_left   = offset.left,
              window_top    = offset.top,
              window_right  = (($(window).width()) - (window_left + popOverSource.outerWidth())),
              window_bottom = (($(window).height()) -
                               (window_top + popOverSource.outerHeight(true)));
          if (window_bottom > popOverMaxHeight) {
            return "bottom";
          } else if (window_right > popOverMaxWidth) {
            return "right";
          } else if (window_left > popOverMaxWidth) {
            return "left";
          } else if (window_top > popOverMaxHeight) {
            return "top";
          } else {
            return "auto";
          }
        },
        html: true,
        trigger: "manual",
        container: $.fn.binf_modal.getDefaultContainer()
      });
      $(targetEle).off("mouseenter").on("mouseenter", function (e) {
        var userWidgetView = that.getParentView();
        clearTimeout(userWidgetView.profileTimer);
        that.options.originatingView &&
        that.options.originatingView.disengageModalKeyboardFocusOnClose &&
        that.options.originatingView.disengageModalKeyboardFocusOnClose();
        var profileTimer = setTimeout(function () {
          $(targetEle).binf_popover('show');
        }, 1000);
        userWidgetView.profileTimer = profileTimer;
      });
      $(targetEle).off("mouseleave").on("mouseleave", function (e) {
        var userWidgetView = that.getParentView();
        clearTimeout(userWidgetView.profileTimer);
      });

      $(targetEle).off('shown.binf.popover').on('shown.binf.popover', function (e) {

        var presenceOptions = {
          id: that.model.attributes.id,
          username: that.model.attributes.name,
          context: that.options.context
        }
        var presenceRegion = new Marionette.Region({
          el: $(".esoc-mini-profile-popover #esoc-mini-profile-presence-indicator")
        });

        var presenceView = new PresenceView(presenceOptions);
        presenceRegion.show(presenceView);
        $(".esoc-mini-profile-popover .esoc-mini-profile-following-action").off('click').on('click',
            function (e) {
              var formData = new FormData();
              var followUnfollowAction = !that.model.attributes.following ?
                                         Util.commonUtil.globalConstants.FOLLOW :
                                         Util.commonUtil.globalConstants.UNFOLLOW;
              formData.append(Util.commonUtil.globalConstants.ACTION, followUnfollowAction);
              var args = {
                "itemview": that,
                "url": that.followUnfollowActionUrl,
                "type": "POST",
                "data": formData,
                "requestType": "miniProfilePopup",
                "targetElement": $(this),
                "popOverTarget": targetEle
              };
              that.util.updateAjaxCall(args);
            });
        $(".esoc-mini-profile-popover .esoc-viewminiprofile-action,.esoc-mini-profile-popover .esoc-mini-profile-user-name,.esoc-mini-profile-popover .esoc-mini-profile-pic").off(
            'click').on('click',
            function (e) {
              e.stopPropagation();
              that.options.userWidgetView.showUserProfileDialog(e);
            });
        if (that.model.attributes.otherUser) {
          var miniprofileActionUrl = Url.combine(
              Util.commonUtil.getV2Url(that.options.connector.connection.url),
              Util.commonUtil.REST_URLS.pulseRestUrl,
              that.model.id);

          miniprofileActionUrl = Util.commonUtil.updateQueryStringValues(miniprofileActionUrl,
              Util.commonUtil.globalConstants.FIELDS,
              Util.commonUtil.globalConstants.CHAT_SEETING);

          var displayParams = {
            "itemview": that,
            "url": miniprofileActionUrl,
            "type": "GET",
            "requestType": "miniProfileActionsDisplay"
          };
          that.util.updateAjaxCall(displayParams);
        } else {
          $(".esoc-mini-profile-popover .esoc-mini-profile-loading-img").hide();
          $(".esoc-mini-profile-popover .esoc-mini-profile-actions").show();
        }
        $("*").one('scroll', function () {
          $(targetEle).binf_popover('hide');
        });
        $(targetEle).one("remove", function () {
          $(targetEle).binf_popover('hide');
        });
        $('[aria-describedby]').each(function () {
          if (!$(this).is(e.target) && $(this).has(e.target).length === 0 &&
              $('.popover').has(e.target).length === 0 &&
              !$('#' + $(this)[0].getAttribute("aria-describedby")).find(e.target).is(e.target)) {
            $(this).binf_popover('hide');
          }
        });
        $(".esoc-mini-profile-popover").on("mouseleave", function (e) {
          if ($("#" + e.target.id).attr("aria-describedby") !==
              $(targetEle).attr("aria-describedby")) {
            $(targetEle).binf_popover('hide');
          }
        });
        $(targetEle).off("mouseleave").on("mouseleave", function (e) {
          setTimeout(function () {
            if ($(".esoc-mini-profile-popover:hover").length === 0) {
              $(targetEle).binf_popover('hide');
            }
          }, 1000);
        });
        $(targetEle).one("destroyed.binf.popover hidden.binf.popover", function (e) {
          if (that.options.originatingView && !that.options.originatingView.isDestroyed) {
            that.options.originatingView.engageModalKeyboardFocusOnOpen &&
            that.options.originatingView.engageModalKeyboardFocusOnOpen();
          }
        });
        that.listenTo(that.options.originatingView, "destroy", function (e) {
          $(targetEle).binf_popover('destroy');
        });
        if (that.model.id !== undefined) {
          var userProfilePicOptions = {
            context: that.options.context,
            userid: that.model.attributes.id,
            photoElement: $(
                ".esoc-mini-profile-popover .esoc-userprofile-img-" + Util.escapeSelector(that.model.attributes.id)),
            defaultPhotElement: $(".esoc-mini-profile-popover .esoc-user-default-avatar-" +
                                  Util.escapeSelector(that.model.attributes.id)),
            userbackgroundcolor: that.options.userbackgroundcolor
          };
          that.util.commonUtil.setProfilePic(userProfilePicOptions);
          that.util.commonUtil.setUserColor(userProfilePicOptions);
        }
      });
    },
    launchChatWindow: function (that) {
      ChatUtil.launchChatWindow(that.options);
    },
    _assignUserColor: function () {
      var userbackgroundcolor = Util.commonUtil.getUserAvatarColor(this.model.attributes);
      this.ui.initialsPlaceholder.css("background", userbackgroundcolor);
    }
  });
  return MiniProfileView;
});
