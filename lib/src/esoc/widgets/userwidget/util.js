/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require',
      'module',
      'csui/lib/jquery',
      'csui/lib/marionette',
      'csui/lib/underscore',
      'csui/utils/contexts/factories/connector',
      'i18n!esoc/widgets/userwidget/nls/lang',
      'esoc/widgets/common/util',
      'esoc/widgets/utils/chat/chat.view',
      'esoc/widgets/userwidget/chat/view/presence.view',
      'esoc/widgets/userwidget/chat/skype/skypeucwa.attribute.model',
      'csui/controls/dialog/dialog.view',
      'csui/utils/non-emptying.region/non-emptying.region',
      'esoc/controls/dialog/multiple.dialogs.view',
      'esoc/lib/slick/slick',
      'csui/utils/url',
      'esoc/widgets/userwidget/userwidget',
      'esoc/widgets/userwidget/chat/chatfactory',
      'esoc/factory/pulsesettingsfactory'
    ],
    function (require, module, $, Marionette, _, ConnectorFactory, Lang, CommonUtil, ChatView,
        PresenceView,
        SkypeAttributeModel, DialogView, NonEmptyingRegion, MultipleDialogsView, slick, Url,
        UserWidget, ChatFactory, PulseSettingsFactory) {
      var Utils = {
        lang: Lang,
        commonUtil: CommonUtil,
        userDialog: null,
        userStack: [],
        updateAjaxCall: function (args) {
          var self             = this,
              that             = args.itemview,
              context          = args.context,
              url              = args.url,
              requestType      = args.requestType,
              relation         = args.relation,
              otherUserProfile = args.otherUserProfile,
              targetElement    = args.targetElement,
              data             = args.data,
              popOverTarget    = args.popOverTarget,
              type             = args.type,
              connector        = !!args.connector ? args.connector :
                                 !!that.options.context ?
                                 that.options.context.getObject(ConnectorFactory) :
                                 that.model.connector,
              userProfileview  = args.userProfileview,
              newValue         = args.newValue;
          connector.authenticator.syncStorage();
          $.ajax(connector.extendAjaxOptions({
            url: url,
            type: type,
            data: data,
            contentType: false,
            crossDomain: true,
            processData: false,
            success: function (response, status, jXHR) {
              switch (requestType) {
              case "membersAPI" :
                var resp = response.data;
                if (!otherUserProfile) {
                  if (relation === CommonUtil.globalConstants.FRIENDS) {
                    var modelAttrs = {
                      following: true,
                      selfUser: false,
                      relation: relation,
                      otherUserProfile: otherUserProfile
                    }
                    self.setRelationModel(response.data, modelAttrs);
                  }
                } else {
                  resp.otherUser = false;
                  resp.actions = {
                    viewprofile: self.lang.viewprofile
                  };
                }
                context.getModel(PulseSettingsFactory, {
                  attributes: {id: "chat"},
                  options: {chat: true},
                  permanent: true
                }).ensureFetched().done(function (response) {
                  resp.chatSettings = response.attributes.chatSettings;
                  that.collection.add(resp);
                });

                var presenceOptions = {
                  id: resp.id,
                  username: resp.name,
                  context: context
                }, presenceRegion   = new Marionette.Region({
                  el: that.$el.find("#esoc-mini-profile-presence-indicator")
                }), presenceView    = new PresenceView(presenceOptions);

                presenceRegion.show(presenceView);
                that.collection.trigger("add.follower");
                break;

              case "pulseInfo" :
                var pulseInfoResponse = response.results;
                that.util.changeRelationsCounts(pulseInfoResponse);
                var followerEvents = that.util.commonUtil.globalConstants.event_bus._events;
                if (!!followerEvents && !!followerEvents.updatefollowerstab &&
                    followerEvents.updatefollowerstab.length > 0) {
                  followerEvents.updatefollowerstab = followerEvents.updatefollowerstab.slice(-1);
                }
                that.util.commonUtil.globalConstants.event_bus.trigger("updatefollowerstab",
                    that, pulseInfoResponse);
                break;
              case "miniProfilePopup":
                var miniProfileResponse         = response.results,
                    followUnfollowActionElement = targetElement.find(
                        ".esoc-miniprofile-followingaction")
                $(popOverTarget).binf_popover('hide');
                that.model.attributes.following = !that.model.attributes.following;
                that.model.attributes.following ?
                followUnfollowActionElement.attr("title", self.lang.unfollow) :
                followUnfollowActionElement.attr("title", self.lang.follow);
                that.model.attributes.following ?
                targetElement.find(".esoc-miniprofile-followingaction").removeClass(
                    "esoc-mini-profile-follow-icon").addClass("esoc-mini-profile-unfollow-icon") :
                targetElement.find(".esoc-miniprofile-followingaction").removeClass(
                    "esoc-mini-profile-unfollow-icon").addClass("esoc-mini-profile-follow-icon");
                var followEvents = that.util.commonUtil.globalConstants.event_bus._events;
                if (!!followEvents && !!followEvents.changefollowingstatus &&
                    followEvents.changefollowingstatus.length > 0) {
                  followEvents.changefollowingstatus = followEvents.changefollowingstatus.slice(-1);
                }
                if (!!followEvents && !!followEvents.updateuserfollowingstatus &&
                    followEvents.updateuserfollowingstatus.length > 0) {
                  followEvents.updateuserfollowingstatus = followEvents.updateuserfollowingstatus.slice(
                      -1);
                }
                that.util.commonUtil.globalConstants.event_bus.trigger("changefollowingstatus",
                    that, miniProfileResponse);
                that.util.commonUtil.globalConstants.event_bus.trigger("updateuserfollowingstatus",
                    that, miniProfileResponse);
                break;
              case "userProfileFollowingAction":
                var followResponse = response.results;
                that.model.attributes.following = !that.model.attributes.following;
                that.model.attributes.following ? targetElement.html(self.lang.unfollow) :
                targetElement.html(self.lang.follow);
                that.$el.find(".esoc-userprofile-following-action").attr('title',
                    that.model.attributes.following ? self.lang.unfollow : self.lang.follow);
                that.model.attributes.followers_count = followResponse.data.user.followers_count;
                that.model.attributes.following_count = followResponse.data.user.following_count;
                var userProfileFollowingActionUrl = Url.combine(
                    CommonUtil.getV2Url(that.options.connector.connection.url),
                    self.commonUtil.REST_URLS.pulseRestUrl,
                    that.model.attributes.id);
                var ajaxParams = {
                  "itemview": that,
                  "url": userProfileFollowingActionUrl,
                  "type": "GET",
                  "requestType": "pulseInfo"
                };
                self.updateAjaxCall(ajaxParams);
                break;
              case "relation":
                var relationResponse = response.results;
                that.model.attributes.following = !that.model.attributes.following;
                if (that.model.attributes.following) {
                  that.model.attributes.actions.following = self.lang.unfollow;
                  that.model.attributes.actions.followingClass = "esoc-mini-profile-unfollow-icon"
                } else {
                  that.model.attributes.actions.following = self.lang.follow;
                  that.model.attributes.actions.followingClass = "esoc-mini-profile-follow-icon"
                }
                if (!that.model.attributes.otherUserProfile) {
                  that.util.changeRelationsCounts(relationResponse.data.user);
                }
                var tabindex = false;
                if (that.$el.find(".esoc-mini-profile-actions").hasClass(
                    "esoc-miniprofile-has-tabindex")) {
                  tabindex = true;
                }
                that.render();
                that.showActions();
                that.setProfilePic();
                that.$el.find(".esoc-mini-profile-following-action").focus();
                if (tabindex) {
                  that.$el.find(".esoc-mini-profile-actions").addClass(
                      'esoc-miniprofile-has-tabindex');
                }
                if (that.options.model.attributes.relation ===
                    CommonUtil.globalConstants.FRIENDS) {
                  if (!that.options.model.attributes.otherUserProfile) {
                    var collection = that.options.model.collection;
                    collection.remove(that.model.attributes.id);
                    collection.trigger("remove.relation", that, relationResponse);
                  }
                }
                break;
              case "miniProfileActionsDisplay":
                var responseData = JSON.parse(JSON.stringify(response.results));
                that.model.attributes.following = responseData.following;
                that.model.attributes.chatSettings = responseData.chatSettings;
                $(".esoc-mini-profile-popover .esoc-mini-profile-loading-img").hide();
                that.model.attributes.following ?
                $(".esoc-mini-profile-popover .esoc-mini-profile-following-action").find(
                    ".esoc-miniprofile-followingaction").removeClass(
                    "esoc-mini-profile-follow-icon").addClass(
                    "esoc-mini-profile-unfollow-icon").attr("title",
                    self.lang.unfollow) :
                $(".esoc-mini-profile-popover .esoc-mini-profile-following-action").find(
                    ".esoc-miniprofile-followingaction").removeClass(
                    "esoc-mini-profile-unfollow-icon").addClass(
                    "esoc-mini-profile-follow-icon").attr("title",
                    self.lang.follow);
                if (that.options.model.attributes.otherUser &&
                    !that.options.model.attributes.deleted && !!responseData.chatSettings &&
                    !!responseData.chatSettings.chatEnabled) {
                  $(".esoc-mini-profile-popover .esoc-mini-profile-actions").show();
                  $(".esoc-mini-profile-popover .esoc-chat-action-enabled-" +
                    that.model.attributes.id).show();
                  var contentRegion = new Marionette.Region({
                        el: $(
                            ".esoc-mini-profile-popover .esoc-miniprofile-chat-action-" +
                            that.model.attributes.id)
                      }),
                      chatOptions   = {
                        context: that.options.context,
                        tguser: that.options.model.attributes.name,
                        domain: responseData.chatSettings.chatDomain
                      },
                      chatView      = new ChatView(chatOptions);
                  contentRegion.show(chatView);
                  $('.esoc-simple-mini-profile-user-img .esoc-mini-profile-chat-comment').css(
                      'display', 'inline-block');
                  $('.esoc-mini-profile-chat-comment').bind('click', function (e) {
                    that.options.tguser = that.options.model.get('name');
                    that.options.domain = that.options.model.get('chatSettings') &&
                                          that.options.model.get('chatSettings').chatDomain;
                    that.launchChatWindow(that);
                  });

                } else {
                  $(".esoc-mini-profile-popover .esoc-mini-profile-actions").show();
                  $(".esoc-mini-profile-popover .esoc-chat-action-disabled-" +
                    that.model.attributes.id).show();
                }
                break;
              case "updateSettings":
                targetElement.prop('disabled', false);
                targetElement.focus();
                break;
              case "updateExtendedTextField":
                if (!!that.model.attributes.userInputField) {
                  that.model.attributes.content = that.managerID !== undefined ? that.managerID :
                                                  that.model.attributes.content;
                  that.model.attributes.reportsTo = !!that.$el.find(
                      ".esoc-user-extended-edit-input").val().trim() ? that.$el.find(
                      ".esoc-user-extended-edit-input").val() : "";
                } else {
                  that.model.attributes.content = !!that.$el.find(
                      ".esoc-user-extended-edit-input").val().trim() ? that.$el.find(
                      ".esoc-user-extended-edit-input").val() : "";
                }
                that.render();
                if (that.model.attributes.userInputField) {
                  that.on("view:shown", function () {
                    that.trigger("change:content", "userInputChanged");
                  });
                  if (that.isUserModelLoaded) {
                    that.trigger("change:content", "userInputChanged");
                  }
                } else {
                  that.trigger("change:content");
                }
                that.showSeeMoreLink();
                if (that.model.attributes.content) {
                  that.$el.find('.esoc-user-messages').focus();
                } else {
                  that.$el.find('.esoc-user-default-content').focus();
                }
                that.options.parentView.triggerMethod('update:scrollbar');
                break;
              case "postStatus":
                that.$el.find(".esoc-user-extended-edit-input")[0].innerHTML = that.$el.find(
                    ".esoc-user-extended-edit-input").val();
                that.model.attributes.content = !!that.$el.find(
                    ".esoc-user-extended-edit-input").val().trim() ? that.$el.find(
                    ".esoc-user-extended-edit-input").html() : that.model.attributes.content;
                that.render();
                that.trigger("change:content");
                that.showSeeMoreLink();
                if (that.model.attributes.content) {
                  that.$el.find('.esoc-user-messages').focus();
                } else {
                  that.$el.find('.esoc-user-default-content').focus();
                }
                break;
              case "updateExtendedLink":
                var inputVal = that.$el.find(".esoc-user-extended-edit-input").val();
                that.model.attributes.content = self.getValidLink(inputVal);
                that.render();
                that.trigger("change:content");
                that.addEllipsisOnFocus();
                if (that.model.attributes.content) {
                  that.$el.find('.esoc-user-messages a').focus();
                } else {
                  that.$el.find('.esoc-user-default-content').focus();
                }
                break;
              default :
                break;
              }
            },
            error: function (xhr, status, text) {
              switch (requestType) {
              case "miniProfilePopup":
                $(popOverTarget).binf_popover('hide');
                var args = {
                  parent: targetElement,
                  errorContent: xhr.responseJSON ?
                                (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                 xhr.responseJSON.error) :
                                self.lang.defaultErrorMessageForMiniProfilePopup

                };
                self.commonUtil.openErrorDialog(args);
                break;
              case "relation":
                var errorArgs = {
                  parent: targetElement,
                  errorContent: xhr.responseJSON ?
                                (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                 xhr.responseJSON.error) : self.lang.defaultErrorMessageForRelation

                };
                self.commonUtil.openErrorDialog(errorArgs);
                break;
              case "miniProfileActionsDisplay":
                var errorContent = xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                   xhr.responseJSON.error;
                $(".esoc-mini-profile-popover .esoc-mini-profile-loading-img").hide();
                $(".esoc-mini-profile-popover .esoc-mini-profile-following-error").html(
                    errorContent);
                $(".esoc-mini-profile-popover .esoc-mini-profile-following-error").attr("title",
                    errorContent);
                $(".esoc-mini-profile-popover .esoc-mini-profile-following-error").show();
                $(".esoc-mini-profile-popover .esoc-mini-profile-actions").hide();
                break;
              case "updateSettings":
                var settingserrorArgs = {
                  parent: targetElement,
                  errorContent: xhr.responseJSON ?
                                (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                 xhr.responseJSON.error) :
                                self.lang.defaultErrorMessageForUpdateSettings
                };
                self.commonUtil.openErrorDialog(settingserrorArgs);
                var setting      = targetElement.val(),
                    settingsType = targetElement.attr("name");
                if (settingsType === "privacySettings") {
                  var newRadioSpanElement = that.$el.find(
                      "#" + targetElement.attr("id") + "_radio"),
                      oldRadioSpanElement = that.$el.find(
                          "#esoc_privacySettings_" + that.model.attributes.settings.contentPrivacy +
                          "_radio");
                  newRadioSpanElement.addClass('icon-radiobutton').removeClass(
                      'icon-radiobutton-selected');
                  oldRadioSpanElement.addClass('icon-radiobutton-selected').removeClass(
                      'icon-radiobutton');
                  targetElement.removeAttr("checked");
                  that.$el.find("#esoc_privacySettings_" +
                                that.model.attributes.settings.contentPrivacy).attr('checked',
                      true);
                } else {
                  var checkboxSpanElement = that.$el.find(
                      "#" + targetElement.attr("id") + "_checkbox");
                  if (!!that.model.attributes.settings &&
                      that.model.attributes.settings.hasOwnProperty(setting)) {
                    checkboxSpanElement.addClass('icon-checkbox-selected').removeClass(
                        'icon-checkbox');
                  } else {
                    checkboxSpanElement.addClass('icon-checkbox').removeClass(
                        'icon-checkbox-selected');
                  }
                  targetElement.prop('checked',
                      that.model.attributes.settings.hasOwnProperty(setting));
                }
                targetElement.prop('disabled', false);
                targetElement.focus();
                break;
              case "updateExtendedTextField":
              case "postStatus":
                var extendedInfoErrorArgs = {
                  parent: targetElement,
                  errorContent: xhr.responseJSON ?
                                (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                 xhr.responseJSON.error) :
                                (requestType === "postStatus" ?
                                 self.lang.defaultErrorMessageForStatusPost :
                                 self.lang.defaultErrorMessageForUpdateExtentedField)
                };
                self.commonUtil.openErrorDialog(extendedInfoErrorArgs);
                that.$el.find(".esoc-user-extended-edit-mode").removeClass(
                    "esoc-extendedinfo-update-mask");
                that.$el.find(".esoc-user-extended-edit-input").prop('disabled', false);
                if (that.model.attributes.content) {
                  that.$el.find('.esoc-user-messages').focus();
                } else {
                  that.$el.find('.esoc-user-default-content').focus();
                }
                break;
              case "updateExtendedLink":
                var extendedLinkErrorArgs = {
                  parent: targetElement,
                  errorContent: xhr.responseJSON ?
                                (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                 xhr.responseJSON.error) :
                                self.lang.defaultErrorMessageForUpdateExtentedLink
                };
                self.commonUtil.openErrorDialog(extendedLinkErrorArgs);
                that.$el.find(".esoc-user-extended-edit-mode").removeClass(
                    "esoc-extendedinfo-update-mask");
                that.$el.find(".esoc-user-extended-edit-input").prop('disabled', false);
                if (that.model.attributes.content) {
                  that.$el.find('.esoc-user-messages a').focus();
                } else {
                  that.$el.find('.esoc-user-default-content').focus();
                }
                break;
              case "userProfileFollowingAction":
                var userProfileActionErrorArgs = {
                  parent: targetElement,
                  errorContent: xhr.responseJSON ?
                                (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                 xhr.responseJSON.error) :
                                self.lang.defaultErrorMessageForUserProfileActionLink
                };
                self.commonUtil.openErrorDialog(userProfileActionErrorArgs);
                break;
              default :
                break;
              }
            }
          }));

        },
        closeUserWidgetDialog: function () {
          if ($(".esoc-user-widget-dialog").is(':visible')) {
            $(".esoc-user-widget-dialog .cs-close").trigger('click');
          }
        },
        showUserProfileDialog: function (userwidgetview, UserProfileView, SimpleUserWidgetView) {
          if (userwidgetview.templateHelpers().messages.showUserProfileLink) {
            var userProfileView, title;
            userwidgetview.$el.find('.esoc-user-mini-profile').binf_popover('hide');
            if (!!userwidgetview.$el.find('.esoc-user-display-name').attr('aria-describedby')) {
              $('.esoc-mini-profile-popover.popover').remove();
            }
            clearTimeout(userwidgetview.profileTimer);
            this.commonUtil.unbindWidget();
            var targetElement = userwidgetview.$el.context.offsetParent;
            var targetPopover = $(targetElement).closest('.binf-popover');
            if (!!targetElement && !!targetElement.offsetParent &&
                targetPopover.length === 1) {
              targetPopover.hide();
            }
            if ($(".activityfeed-expand").is(':visible')) {
              $(".activityfeed-expand .cs-close").trigger('click');
            }
            if (this.userDialog && !userwidgetview.options.enableSimpleSettingsModel) {
              this.userDialog.destroy();
            }
            if (this.userStack.length > 0 &&
                this.userStack[this.userStack.length - 1].model.id === userwidgetview.model.id) {
              this.userStack.pop();
            }
            title = userwidgetview.options.model.attributes.otherUser ?
                    _.str.sformat(userwidgetview.templateHelpers().messages.othersProfile,
                        !!userwidgetview.model.attributes.display_name ?
                        userwidgetview.model.attributes.display_name :
                        userwidgetview.options.display_name) :
                    userwidgetview.templateHelpers().messages.myProfile;
            userwidgetview.options.userWidgetView = userwidgetview;
            var that = this;
            if (!userwidgetview.options.enableSimpleSettingsModel) {
              userProfileView = new UserProfileView(userwidgetview.options);
              this.userDialog = new DialogView({
                title: title,
                iconLeft: this.userStack.length > 0 ? "arrow_back esoc-user-widget-dialog-back" :
                          "",
                largeSize: true,
                view: userProfileView,
                className: "esoc-user-widget-dialog esoc",
                iconRight: "binf-close esoc-user-widget-dialog-close"
              });
              this.userDialog.show();
            }
            else {
              if (!!this.userDialog) {
                if ($('.binf-modal-dialog.user' + userwidgetview.options.userid).length !== 0) {
                  if ($('.slick-slide').length > 0) {
                    $($('.slick-slide')[$(
                        '.binf-modal-dialog.user' + userwidgetview.options.userid).parents(
                        '.slick-slide')[0].dataset.slickIndex]).click();
                  }

                  return;
                }
                else {
                  this.removeSlick();
                  this.simpleUserWidgetViews.push(new SimpleUserWidgetView(userwidgetview.options));
                  this.userDialog.appendData(this.simpleUserWidgetViews);
                }
              }
              else {
                this.simpleUserWidgetViews = [];
                this.simpleUserWidgetViews.push(new SimpleUserWidgetView(userwidgetview.options));
                this.userDialog = new MultipleDialogsView({
                  largeSize: true,
                  views: this.simpleUserWidgetViews,
                  util: this,
                  className: "esoc-simple-user-widget-dialog esoc",
                  targetEle: userwidgetview.options.targetEle,
                  focusCallBack: userwidgetview.options.focusCallBack
                });

                var container     = $.fn.binf_modal.getDefaultContainer(),
                    contentRegion = new NonEmptyingRegion({
                      el: container
                    });
                contentRegion.show(this.userDialog);
                this.userDialog.$el.css('display', 'block');
              }
              this.userDialog.$el.find('.binf-modal-header').remove();

              this.userDialog.listenTo(this.userDialog, 'destroy', function () {
                that.userDialog = null;
                that.simpleUserWidgetViews = null;
              });
              if (this.simpleUserWidgetViews.length >= 2) {
                this.userDialog.options.views[this.simpleUserWidgetViews.length - 2].$el.find(
                    ".cs-field-read-content").focusout();
              }
              this.applySlick();
            }
            if (this.userStack.length > 0) {
              title = this.userStack[this.userStack.length - 1].model.attributes.otherUser ?
                      _.str.sformat(Lang.othersProfileTooltip,
                          !!this.userStack[this.userStack.length -
                                           1].model.attributes.display_name ?
                          this.userStack[this.userStack.length - 1].model.attributes.display_name :
                          userwidgetview.options.display_name) :
                      this.userStack[this.userStack.length -
                                     1].templateHelpers().messages.myProfile;
              $("span.tile-type-icon.cs-icon-left.arrow_back.esoc-user-widget-dialog-back").attr(
                  "title", Lang.goBackTo + " " + title);
            }
            $(".esoc-user-widget-dialog-back").on("click", function () {
              var prevUserview = that.userStack.pop();
              if (prevUserview.model.id === userwidgetview.model.id) {
                prevUserview = that.userStack.pop();
              }
              that.showUserProfileDialog(prevUserview, UserProfileView, SimpleUserWidgetView);
            });
            $(".esoc-user-widget-dialog .cs-close").on("click", function () {
              that.userStack = [];
            });
            if (this.userStack.length === 0) {
              this.userStack.push(userwidgetview);
            }
            userwidgetview.on('userwidgetview.show.user.dialog', function (event) {
              var UserWidgetView = require("esoc/controls/userwidget/userwidget.view"),
                  widgetOptions  = _.extend({}, this.options);
              event.options.userid = event.options.model.id;

              var updatedOptions = _.extend(widgetOptions, event.options);
              delete updatedOptions["model"];
              updatedOptions.display_name = event.options.model.attributes.display_name;
              var newUserWidgetView = new UserWidgetView(updatedOptions);
              newUserWidgetView.showUserProfileDialog(newUserWidgetView, UserProfileView,
                  SimpleUserWidgetView);
            });
            if (SkypeAttributeModel.getChatEnabled() && SkypeAttributeModel.getPresenceEnabled() &&
                !SkypeAttributeModel.isPluginEnabled()) {
              $(".cs-close").on("click", function (event) {
                if ($.inArray("esoc-user-widget-dialog-close", event.target.classList) !== -1 &&
                    !!SkypeAttributeModel.getCurrentSubscriptionURL()) {
                  ChatFactory.getProvider().deleteSubscription(
                      SkypeAttributeModel.getCurrentSubscriptionURL());
                }
              });
            }
          }
        },
        applySlick: function (initialSlideIndex) {
          if ($('.binf-modal-dialog').length > 1) {
            $('.binf-modal-dialog').find('.cs-close').addClass('slick-close');
            $('.modal-dialogs-inner').slick({
              centerMode: true,
              easing: 'easeOutElastic',
              focusOnSelect: true,
              focusOnChange: true,
              initialSlide: initialSlideIndex !== undefined ? initialSlideIndex :
                            this.simpleUserWidgetViews.length - 1,
              variableWidth: true,
              speed: 500,
              swipe: false,
              infinite: false,
              prevArrow: '<div class="slick-prev" title=' + Lang.previous + ' aria-label=' +
                         Lang.previous + '/>',
              nextArrow: '<div class="slick-next" title=' + Lang.next + ' aria-label=' + Lang.next +
                         '/>'
            });
          } else {
            $('.binf-modal-dialog').find("[data-cstabindex=-1]").attr("tabindex", "0").attr(
                "data-cstabindex", "0");
            $('.binf-modal-dialog').find('.cs-close').removeClass('slick-close');
          }
        },
        removeSlick: function () {
          if ($('.slick-list').length > 0) {
            $('.modal-dialogs-inner').slick("unslick");
          }
        },
        getValidLink: function (linkContent) {
          var regExp  = /((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,
              matches = (!!linkContent && linkContent.match(regExp) !== null) ? linkContent : '';
          return matches;
        },
        displayUserWidget: function (context, el) {
          var that = this;
          el.find(".esoc-widget-user-display-name").each(function () {
            var userWidgetOptions = {
              userid: $(this).data("userid"),
              context: context,
              placeholder: this,
              showUserProfileLink: true,
              showMiniProfile: true
            };
            UserWidget = !!UserWidget ? UserWidget :
                         require("esoc/widgets/userwidget/userwidget");
            UserWidget.getUser(userWidgetOptions);
          })
        },
        changeRelationsCounts: function (results) {
          var followingCount = results.friends_count > 999 ? "999+" : results.friends_count,
              followersCount = results.followers_count > 999 ? "999+" : results.followers_count;
          $(".esoc-user-following-count").html(followingCount);
          $(".esoc-user-following-tab-label").attr('title',
              _.str.sformat(this.lang.followingTooltip, results.friends_count));
          $(".esoc-user-followers-count").html(followersCount);
          $(".esoc-user-followers-tab-label").attr('title',
              _.str.sformat(this.lang.followersTooltip, results.followers_count));
        },
        setRelationModel: function (relationModel, attrs) {
          relationModel.relation = attrs.relation;
          relationModel.following = attrs.following;
          relationModel.otherUserProfile = attrs.otherUserProfile;
          if (attrs.selfUser) {
            relationModel.actions = {
              viewprofile: this.lang.viewprofile
            };
            relationModel.otherUser = false;
          } else {
            relationModel.otherUser = true;
            if (attrs.following) {
              relationModel.actions = {
                following: this.lang.unfollow,
                viewprofile: this.lang.viewprofile,
                chat: this.lang.chat,
                followingClass: 'esoc-mini-profile-unfollow-icon'
              };
            } else {
              relationModel.actions = {
                following: this.lang.follow,
                viewprofile: this.lang.viewprofile,
                chat: this.lang.chat,
                followingClass: "esoc-mini-profile-follow-icon"
              };
            }
          }
        },
        escapeSelector: function (userid) {
          var regExp = /^([a-zA-Z0-9_-]+)$/;
          if (!_.isNumber(userid) && !userid.match(regExp)) {
            return (userid.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1'));
          }
          return (userid);
        }
      }
      return Utils;
    });
