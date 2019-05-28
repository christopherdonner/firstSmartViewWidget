csui.define(['module',
      'csui/lib/jquery',
      'csui/lib/underscore',
      'csui/lib/backbone',
      'esoc/lib/jquery.emojiarea/packs/custom/emojis',
      'csui/models/node/node.model',
      'csui/models/nodechildren',
      'csui/utils/log',
      'csui/utils/commands',
      'csui/utils/contexts/factories/connector',
      'csui/utils/contexts/factories/user',
      'csui/utils/contexts/factories/member',
      'i18n!esoc/widgets/socialactions/nls/lang',
      'csui/dialogs/modal.alert/modal.alert',
      'esoc/widgets/socialactions/socialemoticons', 'csui/utils/namedsessionstorage',
      'csui/utils/url',
      'csui/behaviors/keyboard.navigation/tabable.region.behavior',
      'i18n!esoc/widgets/activityfeedwidget/impl/nls/lang',
      'hbs!esoc/widgets/activityfeedwidget/impl/newupdates',
      'csui/lib/jquery.binary.ajax'

    ],
    function (module, $, _, Backbone, Emojis, NodeModel, NodeChildrenCollection, Log,
        Commands, ConnectorFactory, UserModelFactory, MemberModelFactory, Lang, ModalAlert,
        SocialEmoji,
        NamedSessionStorage, Url, TabableRegionBehavior, afLang, NewUpdatesButtonTemplate) {

      var Utils = {

        globalConstants: {
          MAX_ID: "max_id",
          SINCE_ID: "since_id",
          MAX_CHAR_LIMIT: 1000,
          REPLY_COUNT: 'reply_count',
          REQUEST_TYPE_ATTACHMENT_DELETE: 'AttachmentDelete',
          FETCH_NEXT_PAGE_MODELS_LENGTH: 5,
          SHOW_SEE_MORE_MODELS_LENGTH: 4,
          DOCUMENT_ATTACHMENT_SUBTYPE: 144,
          SHORTCUT_ATTACHMENT_SUBTYPE: 1,
          ROI_OBJECT_TYPE: 952,
          MEMBERS: "/members/",
          PHOTO: "/photo",
          USERID: "userid",
          USERDETAILS: "userdetails",
          ESOCIAL_USER_INFO: "esoc-user-info",
          EMOJI_URL: "/socialfeed/app/lib/jquery.emojiarea/packs/custom",
          PULSE_RESOURCE_COUNT: 10,
          FRIENDS: "friends",
          FOLLOWERS: "followers",
          INCLUDES: "includes",
          EXTENDEDINFO: "extendedInfo",
          CHAT_SEETING: "chatSetting",
          CHAT_SEETINGS: "chatSettings",
          FIELD_MAX_CHAR_LIMIT: "maxCharLimit",
          UPDATE_EXTENDED_INFO: "updateExtendedInfo",
          FIELDS: "fields",
          COUNT: "count",
          SETTINGS: "settings",
          USER_PRIVACY_SETTINGS: ["everyone", "follow", "nobody"],
          FOLLOW: "follow",
          UNFOLLOW: "unfollow",
          ACTION: "action",
          UPDATE_SETTINGS_ACTION: "updateSettings",
          CONTENT_PRIVACY: "contentPrivacy",
          STATUS_PRIVACY: "statusPrivacy",
          EXPAND: "expand",
          MEMBER: "member",
          HTTP_LINK: "http://",
          event_bus: _.extend({}, Backbone.Events),
          URI_DELIMITER: ":",
          AT_SIGN_SYMBOL: "@",
          URI_PREFIX: "sip"

        },

        REST_URLS: {
          csGetCommentRESTUrl: '/pulse/statuses/public_timeline?includes=actions,reply_count,user_info&excludes=replies&count=5&',
          csPostCommentRESTUrl: '/pulse/statuses/update',
          csGetROI: '/objectsocialinfo?',
          csCreateROI: '/remote_objects',
          csGetAFSinceId: '/pulse/statuses/socialactivity?where_feedtype=',
          membersRESTUrl: '/members?where_type=0',
          chatHistoryUrl: '/members/',
          pulseRestUrl: '/pulse/members/',
          pulseInfoRestUrl: "/pulse_info",
          updatePhotoUrl: "/pulse/upload_profile_photo",
          pulseSettingsUrl: "/pulse/settings",
          searchUsersUrl: '/pulse/searchUsers',
          deletePhotoUrl: '/pulse/members/photo'
        },

        config_settings: {
          'feedsAutoRefreshWait': 60000,
          'maxMessageLength': 1000,
          'maxNumOfEntries': 20,
          'visibility': "on"
        },
        lang: Lang,
        log: Log,

        /**
         * This method will change the http link in the message into clickable URL
         * @param args = {message}
         */
        onClickableUrl: function (message, showLink) {
          message = message.replace(/<img/gi, ' <img');
          message = message.replace(/&nbsp;/gi, ' ');
          var regexp      = /(https?:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,
              imgUrlRegEx = /https?:\/\/\S+\.(svg)/gi,
              imgMatch    = message.match(imgUrlRegEx);

          if (!!imgMatch && imgMatch.length > 0) {
            message = message.replace(/.svg"/gi, '.svg" ');
          }
          var matches    = message.match(regexp),
              tmp        = message,
              newMessage = '',
              ids        = 0, replaceIds = 1, matchIndex = 0;

          if (matches !== null && matches.length > 0) {
            for (ids = 0; ids < matches.length; ids++) {
              matchIndex = tmp.indexOf(matches[ids]);

              if (matchIndex > 0) {
                newMessage += tmp.substring(0, matchIndex);
              }
              var urlMessageContent = matches[ids].split("&lt;");
              if (urlMessageContent[0].indexOf($.emojiarea.path) !== 0 || !!showLink) {
                if (urlMessageContent[0].length > 30) {
                  urlMessageContent[0] = this.revHtmlEntities(urlMessageContent[0]);
                  newMessage += '<a href=\"' + urlMessageContent[0] +
                                '\" onclick=\"window.open(this.href,\'_blank\');return false;\" >' +
                                this.decodeHtmlEntities(urlMessageContent[0].substring(0, 30)) +
                                '...</a>';
                }
                else {
                  newMessage += '<a href=\"' + urlMessageContent[0] +
                                '\" onclick=\"window.open(this.href,\'_blank\');return false;\" >' +
                                urlMessageContent[0] + '</a>'
                }

                for (replaceIds = 1; replaceIds < urlMessageContent.length; replaceIds++) {
                  newMessage += '&lt;' + urlMessageContent[replaceIds];
                }

              } else {
                newMessage += urlMessageContent[0];
              }

              tmp = tmp.substring(matchIndex + matches[ids].length);
            }

            newMessage += tmp;
          }
          else {
            newMessage = message;
          }

          return newMessage;
        },

        getEmojiPath: function (connector) {
          var self          = this,
              connObj       = connector.connection,
              connectionUrl = new Url(connObj.url),
              prefixUrl     = connectionUrl.getOrigin(),
              emojiUrl      = prefixUrl + connObj.supportPath +
                              self.globalConstants.EMOJI_URL;
          return emojiUrl;
        },

        //Our own emoji's
        createEmojiIcons: function () {
          var iconObj  = new Object({}),
              that     = this,
              titleObj = new Object({});
          $.each($.socialEmoticons.icons, function (key, value) {
            iconObj[value.shortcut] = value.image;
            if (that.lang[value.key]) {
              titleObj[value.shortcut] = that.lang[value.key] + "  " + value.shortcut;
            } else {
              titleObj[value.shortcut] = value.defaulttitle;
            }
          });
          $.emojiarea.icons = iconObj;
          $.emojiarea.iconsTitle = titleObj;
        },
        addEmoji: function (_element, isUrlElipse, connector) {
          var commentContent = _element.html();
          var emojis = $.emojiarea.icons;
          for (var key in emojis) {
            if (emojis.hasOwnProperty(key)) {
              commentContent = commentContent.replace(
                  new RegExp((key + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'), 'g'),
                  this.createIcon(key, connector));
            }
          }
          if (isUrlElipse) {
            _element[0].innerHTML = this.onClickableUrl(commentContent);
          } else {
            _element[0].innerHTML = commentContent;
          }
        },
        preventDrop: function (_element) {
          _element.bind('drop', function (event) {
            event.preventDefault();
            return false;
          });
        },
        createIcon: function (emoji, connector) {
          $.emojiarea.path = this.getEmojiPath(connector);
          var filename = $.emojiarea.icons[emoji];
          var path = $.emojiarea.path || '';
          if (path.length && path.charAt(path.length - 1) !== '/') {
            path += '/';
          }
          var emojiTitle = $.emojiarea.iconsTitle;
          var displayIconTitle = emojiTitle[emoji];
          return "<img src='" + path + filename + "' title='" +
                 this.htmlEntities(displayIconTitle) + "' alt='" + this.htmlEntities(emoji) + "'>";
        },
        htmlEntities: function (str) {
          var txt = document.createElement("textarea");
          txt.innerHTML = str;
          return String(txt.value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
              '&gt;').replace(/"/g, '&quot;');
        },
        /**
         * Opens the warning dialog based on the arguments.
         * on clicking ok button, hides the dialog
         * @param args = {parent, errorContent}
         */
        openWarningDialog: function (args) {
          $(args.parent).append($("#mdAlert"));
          ModalAlert.showWarning(this.replaceBreakTagWithNewLine(args.errorContent));
          $("#mdAlert .btn-close, #mdAlert .binf-close").on("click", function () {
            $("body").append($("#mdAlert"));
          });
        },

        /**
         * Opens the error dialog based on the arguments.
         * on clicking ok button, hides the dialog
         * @param args = {parent, errorContent}
         */
        openErrorDialog: function (args) {
          $(args.parent).append($("#mdAlert"));
          ModalAlert.showError(this.replaceBreakTagWithNewLine(args.errorContent));
          $("#mdAlert .btn-close, #mdAlert .binf-close").on("click", function () {
            $("body").append($("#mdAlert"));
          });
        },

        /**
         * This method replaces break tags with new line for the given string.
         * @param args = {content}
         */
        replaceBreakTagWithNewLine: function (content) {
          if (content) {
            var breakTagRegEx = /<br\s*[\/]?>/gi;
            return content.replace(breakTagRegEx, '\n');
          } else {
            return "";
          }
        },
        /**
         * Checks if the current browser is Chrome or not
         * @return: boolean
         */
        isChrome: function () {
          var isChrome = false,
              ua       = window.navigator.appVersion;
          isChrome = ua.indexOf('Chrome') > 0;
          return isChrome;
        },
        /**
         * Checks if the current browser is IE or not
         * @return: boolean
         */
        isIE: function () {
          var isIE = false,
              ua   = window.navigator.userAgent;
          isIE = ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0;
          return isIE;
        },
        onCommentFormPaste: function (e, existingLength, maxChars) {
          var content;
          e.preventDefault();
          if (e.originalEvent.clipboardData) {
            content = (e.originalEvent || e).clipboardData.getData('text/plain');
            if (content.length + existingLength > maxChars) {
              content = content.substr(0, (maxChars - existingLength));
            }
            document.execCommand('insertText', false, content);
          } else if (window.clipboardData) { // for IE
            content = window.clipboardData.getData('Text');
            if (content.length + existingLength > maxChars) {
              content = content.substr(0, (maxChars - existingLength));
            }
            document.execCommand("AutoUrlDetect", false, false);
            if (window.getSelection) {
              window.getSelection().getRangeAt(0).insertNode(document.createTextNode(content));
              window.getSelection().removeAllRanges();
            }
          }
        },
        /**
         * Used to fill default options for activityfeed widgets
         * Keep update this function when new default options adds
         * @param options
         */
        fillDefaultActivityOptions: function (options) {
          var defalutOpt = options.data ? options.data : options;
          if (defalutOpt) {
            if (defalutOpt.feedtype === undefined) {
              defalutOpt.feedtype = "all";
            }
            if (defalutOpt.feedsource === undefined) {
              defalutOpt.feedsource = {"source": "all"};
            }
            if (defalutOpt.feedSettings === undefined) {
              defalutOpt.feedSettings = {"enableComments": true};
            }
            if (defalutOpt.updatesfrom === undefined) {
              defalutOpt.updatesfrom = {"from": "all"};
            }

          }
          options = defalutOpt;
        },
        /**
         * Used to build unique id to differentiate between activityfeeds
         * @param options
         */
        getActivityWidgetId: function (options) {
          var activityFeedUID = "";
          var activityOptions = options.data ? options.data : options;
          if (activityOptions) {
            if (activityOptions.feedtype !== undefined) {
              activityFeedUID = "ft";
              if (activityOptions.feedtype.indexOf("all") > -1) {
                activityFeedUID += "_a";
              }
              if (activityOptions.feedtype.indexOf("content") > -1) {
                activityFeedUID += "_c";
              }
              if (activityOptions.feedtype.indexOf("status") > -1) {
                activityFeedUID += "_s";
              }
              if (activityOptions.feedtype.indexOf("attributes") > -1) {
                activityFeedUID += "_at";
              }
            }
            if (activityOptions.feedsource !== undefined) {
              activityFeedUID += "_fs_";
              if (activityOptions.feedsource.source !== undefined) {
                activityFeedUID += activityOptions.feedsource.source;
              }
              if (activityOptions.feedsource.id !== undefined) {
                activityFeedUID += activityOptions.feedsource.id;
              }
            }
            activityFeedUID += "_fst_";
            if (activityOptions.feedSettings !== undefined &&
                activityOptions.feedSettings.enableComments) {
              activityFeedUID += "ec";
            }
            if (activityOptions.feedSettings !== undefined &&
                activityOptions.feedSettings.enableFilters) {
              activityFeedUID += "ef";
            }
            if (activityOptions.enableComments !== undefined && activityOptions.enableComments) {
              activityFeedUID += "ec";
            }
            if (activityOptions.enableFilters !== undefined && activityOptions.enableFilters) {
              activityFeedUID += "ef";
            }
            if (activityOptions.updatesfrom !== undefined) {
              activityFeedUID += "_uf_";
              if (activityOptions.updatesfrom.from !== undefined) {
                activityFeedUID += activityOptions.updatesfrom.from;
              }
              if (activityOptions.updatesfrom.id !== undefined) {
                activityFeedUID += activityOptions.updatesfrom.id;
              }
            }
            if (activityOptions.wrapperClass !== undefined) {
              activityFeedUID += "_hr_";
            }
            if (activityOptions.origin !== undefined) {
              activityFeedUID += "_org_" + activityOptions.origin;
            }
            if (activityOptions.honorfeedsource !== undefined) {
              activityFeedUID += "_hfs_" + activityOptions.honorfeedsource;
            }
          }
          return activityFeedUID;
        },

        navigationWithArrowKeys: function (view, className) {
          var allAnchorElems, firstAnchorElement, focusables, activeElement, self = this;

          allAnchorElems = view.$el.find(".esoc-activityfeed-list-item a").filter(
              ":visible");
          allAnchorElems.prop("tabindex", "-1").attr("data-cstabindex", "-1");
          firstAnchorElement = view.$el.find(".esoc-activityfeed-list-item:first div a:first");
          if (firstAnchorElement && firstAnchorElement.length) {
            firstAnchorElement.prop("tabindex", "0").attr("data-cstabindex", "0");
            activeElement = firstAnchorElement
          }

          focusables = view.$el.find('*[data-cstabindex=0]');
          if (focusables.length) {
            focusables.prop('tabindex', 0);
          }

          view.$el.find(className).on("keydown", ".esoc-activityfeed-list-item",
              function (event) {
                var parentElement   = event.currentTarget,
                    sourceElement   = event.target,
                    childrens       = $(parentElement).find("div a:not(.esoc-hide-element)"),
                    childrensLength = childrens.length,
                    requiredEle, i, nextElement;

                if (event.keyCode === 9) {
                  var userProfileView = view.options.userProfileView
                  if (userProfileView) {
                    nextElement = userProfileView.$el.find(
                        "ul.esoc-user-profile-tabcontainer li").eq(
                        userProfileView.options.tabIndex + 1);
                    if (nextElement.children() && nextElement.children()[0]) {
                      event.preventDefault();
                      event.stopPropagation();
                      nextElement.children()[0].focus();
                    }
                    view.$el.find("[tabindex=" + (userProfileView.options.tabIndex) + "]").filter(
                        ":visible").prop("tabindex", "-1");
                  }
                }

                if (event.keyCode === $.ui.keyCode.DOWN) {
                  for (i = 0; i < childrensLength; i++) {
                    if (childrens[i] === sourceElement) {
                      requiredEle = childrens[i + 1];
                      break;
                    }
                  }
                  if (i === childrensLength - 1 && !requiredEle) {
                    nextElement = $(parentElement).next()
                    requiredEle = $(nextElement).find("div a:first");
                  }
                  /* Below if statement is required for activityfeed expanded view.  There will be one new div tag
                   (<div class="activityfeed-expand-invisiblebutton-ft_a_fs_all_fst_ecef_uf_all"></div>)
                   added before new ".esoc-activityfeed-list-item" class div's
                   which loaded dynamically , So skipped that one div here using again next or prev.
                   */
                  if (requiredEle && !$(requiredEle).length) {
                    nextElement = $(nextElement).next()
                    requiredEle = $(nextElement).find("div a:first");
                  }
                } else if (event.keyCode === $.ui.keyCode.UP) {
                  for (i = 0; i < childrensLength; i++) {
                    if (childrens[i] === sourceElement) {
                      requiredEle = childrens[i - 1];
                      break;
                    }
                  }
                  if (i === 0 && !requiredEle) {
                    nextElement = $(parentElement).prev()
                    requiredEle = $(nextElement).find("div a:not(.esoc-hide-element):last");
                  }
                  if (requiredEle && !$(requiredEle).length) {
                    nextElement = $(nextElement).prev()
                    requiredEle = $(nextElement).find("div a:not(.esoc-hide-element):last");
                  }
                }
                if ($(requiredEle).length) {
                  self.moveFocusFromSrcToDest(view, $(sourceElement), $(requiredEle));
                  activeElement = $(requiredEle);
                  event.preventDefault();
                }
              }
          );

          var firstFilterClass = '.csui-facet:first [data-cstabindex="0"],.csui-facet:first [data-cstabindex="-1"]';
          var lastFilterClass = '.csui-facet:last [data-cstabindex="0"],.csui-facet:last [data-cstabindex="-1"]';
          var filterArr = [];
          if (view.options.origin !== "userwidget") {
            filterArr.push(firstFilterClass);
            filterArr.push(lastFilterClass);
          } else {
            filterArr.push(firstFilterClass);
          }

          filterArr.forEach(function (filterClass) {
            view.$el.find(filterClass).on('focus',
                function (event) {
                  var target = $(event.target), sourceElement;
                  if (target.is(":visible")) {
                    if (event.hasOwnProperty('originalEvent') &&
                        target.attr("data-cstabindex") === "-1") {
                      sourceElement = view.$el.find('.csui-facet:first input[data-cstabindex="0"]')
                      self.moveFocusFromSrcToDest(view, sourceElement, target, true);
                    } else {
                      self.addTabableClass(view, $(event.target));
                    }
                  }
                }
            );
          });

          view.$el.find(className).on("focus", ".esoc-activityfeed-list-item",
              function (event) {
                var target = $(event.target)
                if (target.is(":visible")) {
                  if (!activeElement) {
                    activeElement = view.$el.find('.esoc-activityfeed-list-item [data-cstabindex="0"]')
                  }
                  if (event.hasOwnProperty('originalEvent') &&
                      target.attr("data-cstabindex") === "-1") {
                    self.moveFocusFromSrcToDest(view, activeElement, target, true);
                  } else {
                    self.addTabableClass(view, target);
                  }
                  activeElement = target;
                }
              }
          );
        },

        moveFocusFromSrcToDest: function (view, sourceEle, destEle, isFocus) {
          if (sourceEle[0] === destEle[0]) {
            this.addTabableClass(view, destEle);
            return;
          }
          if (sourceEle.prop("tabindex") === -1) {
            destEle.prop("tabindex", "0").attr("data-cstabindex", "0");
          } else {
            destEle.prop("tabindex", sourceEle.prop("tabindex")).attr("data-cstabindex", "0");
          }
          sourceEle.prop("tabindex", "-1").attr("data-cstabindex", "-1");

          this.addTabableClass(view, destEle);
          if (!isFocus) {
            destEle.focus();
          }
        },
        addTabableClass: function (view, destEle) {
          var tempView;
          var userProfileView = view.options.userProfileView
          if (userProfileView) {
            tempView = userProfileView.options;
          } else {
            tempView = view;
          }
          tempView.focusedElement &&
          tempView.focusedElement.removeClass(
              TabableRegionBehavior.accessibilityActiveElementClass);
          destEle.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
          tempView.focusedElement = destEle;
        },

        getUserProfileRestApiURL: function (connectionURL, userId) {
          var url = connectionURL + this.globalConstants.MEMBERS + userId +
                    this.globalConstants.PHOTO;
          return url;
        },
        getUserPhotoURL: function (options) {
          var dfd = $.Deferred();
          var userWidgetModel = this.getUserWidgetModel(options);
          if (options.noCache) {
            userWidgetModel.fetch().done(function () {
              var url = Url.combine(new Url(options.connectionURL).getCgiScript(),
                  userWidgetModel.attributes.photo_url);
              dfd.resolve(url);
            });
          } else {
            userWidgetModel.ensureFetched().done(function () {
              var url = Url.combine(new Url(options.connectionURL).getCgiScript(),
                  userWidgetModel.attributes.photo_url);
              dfd.resolve(url);
            });
          }
          return dfd;
        },
        updateQueryStringValues: function (uri, key, value) {
          var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"); // Alternate RegEx Patter/([?&]z)=([^#&]*)/g
          var separator = uri.indexOf('?') !== -1 ? "&" : "?";
          if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
          }
          else {
            return uri + separator + key + "=" + value;
          }
        },
        decodeHtmlEntities: function (str) {
          return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
              '&gt;').replace(/"/g, '&quot;');
        },
        revHtmlEntities: function (str) {
          return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g,
              '>').replace(/&quot;/g, '"');
        },
        updateAjaxCall: function (args) {
          var self                = this,
              that                = args.itemview,
              url                 = args.url,
              currentNodeModel    = args.currentNodeModel,
              requestType         = args.requestType,
              photoUserId         = args.userId,
              targetElement       = args.targetElement,
              photoElement        = args.photoElement,
              defaultPhotoElement = args.defaultPhotoElement,
              data                = args.data,
              type                = args.type,
              imageElement        = args.imageElement,
              connector           = args.connector;
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
              case "updatePhoto":
                that.$el.find(
                    ".esoc-userprofile-actions .esoc-profile-img-load-container").removeClass(
                    "esoc-progress-display");
                that.$el.find(".esoc-userprofile-actions .esoc-full-profile-avatar").removeClass(
                    "esoc-profile-opacity");
                that.$el.find($("#esoc-profilepic-desktop-attachment")).val("");
                var userProfilePicOptions = {
                  noCache: true,
                  connector: connector,
                  userid: that.options.userid,
                  context: that.options.context
                }
                self.setProfilePic(userProfilePicOptions);
                var user = that.options.context.getModel(UserModelFactory);
                var dfd = self.getUserPhotoURL({
                  "context": userProfilePicOptions.context,
                  "noCache": userProfilePicOptions.noCache,
                  "connectionURL": connector.connection.url,
                  "userid": userProfilePicOptions.userid
                });
                dfd.promise().done(function (url) {
                  user.attributes.photo_url = url.replace(
                      new Url(connector.connection.url).getCgiScript(), "");
                  if (that.$el.find('.esoc-simple-user-widget').length > 0 && !!that.model) {
                    that.model.attributes.photo_url = url.replace(
                        new Url(connector.connection.url).getCgiScript(), "");
                  }
                    user.trigger("change");
                    $(".esoc-simple-profile-img-load-container").removeClass("esoc-simple-profile-img-load-icon");
                });
                that.$el.find($("#esoc-profilepic-desktop-attachment")).val("");
                break;
              case "deletePhoto":
                userProfilePicOptions = {
                  noCache: true,
                  connector: connector,
                  userid: that.options.userid,
                  context: that.options.context
                }
                self.setProfilePic(userProfilePicOptions);
                user = that.options.context.getModel(UserModelFactory);
                dfd = self.getUserPhotoURL({
                  "context": userProfilePicOptions.context,
                  "noCache": userProfilePicOptions.noCache,
                  "connectionURL": connector.connection.url,
                  "userid": userProfilePicOptions.userid
                });
                dfd.promise().done(function (url) {
                  user.attributes.photo_url = url.replace(
                      new Url(connector.connection.url).getCgiScript(), "");
                  that.$el.find(".esoc-userprofile-default-avatar").css("display", "inline-flex");
                  if (that.$el.find('.esoc-simple-user-widget').length > 0 && !!that.model) {
                    that.model.attributes.photo_url = url.replace(
                        new Url(connector.connection.url).getCgiScript(), "");
                  }
                  user.trigger("change");
                });
                break;
              case "updateCommentCount":
                var nodeProperties = response.results && response.results.data &&
                                     response.results.data.properties;
                if (!!nodeProperties) {
                  self.updateCommentCount({
                    currentNodeModel: currentNodeModel,
                    commentCount: nodeProperties.wnd_comments
                  });
                }
                break;
              case "getCommentCount":
                var properties = response.results && response.results[0] &&
                                 response.results[0].data && response.results[0].data.properties;
                if (!!properties) {
                  self.updateCommentCount({
                    currentNodeModel: currentNodeModel,
                    commentCount: properties.wnd_comments
                  });
                }
                break;
              default :
                break;
              }
            },
            error: function (xhr, status, text) {
              switch (requestType) {
              case "updatePhoto":
                that.$el.find(
                    ".esoc-userprofile-actions .esoc-profile-img-load-container").removeClass(
                    "esoc-progress-display");
                that.$el.find(".esoc-userprofile-actions .esoc-full-profile-avatar").removeClass(
                    "esoc-profile-opacity");
                that.$el.find("#esoc-profilepic-desktop-attachment").val("");
                var photoErrorArgs = {
                  parent: targetElement,
                  errorContent: xhr.responseJSON ?
                                ( xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                                  xhr.responseJSON.error) : self.lang.defaultErrorMessageUpdatePhoto
                };
                self.openErrorDialog(photoErrorArgs);
                break;
              default :
                break;
              }
            }
          }));
        },
        /**
         * Updates the comment count in table cell widget
         *
         * @param args - currentNodeModel table cell model
         *             - commentCount count to be updated
         *
         */
        updateCommentCount: function (args) {
          var currentNodeModel = args.currentNodeModel,
              commentCount     = args.commentCount;
          currentNodeModel.attributes.wnd_comments = commentCount;
          if (commentCount !== undefined) {
            var commentNumberSpan = $(".wnd_comments_validated[data-csid='" + currentNodeModel.attributes.id +"']");
            var commentSpan = $(".esoc-socialactions-comment[data-value='" + currentNodeModel.attributes.id +"']");
            if (commentCount > 1) {
              commentNumberSpan.attr("title", commentCount + " " + Lang.commentCount);
              commentSpan.attr("aria-label", commentCount + " " + Lang.commentCount);
            } else {
              if (commentCount === 1) {
                commentNumberSpan.attr("title", commentCount + " " + Lang.oneComment);
                commentSpan.attr("aria-label", commentCount + " " + Lang.oneComment);
              } else {
                commentNumberSpan.attr("title", "");
                commentSpan.attr("aria-label", Lang.comments);
              }
            }
            if (commentCount > 0) {
              commentCount = commentCount > 99 ? '99' + '+' : commentCount;
              commentNumberSpan.html(commentCount);
            } else {
              commentNumberSpan.html("");
            }
          }
        },
        /**
         * Sets the profile picture for the given photoElement if it is passed otherwise sets the
         * profile picture for all the elements whose classname is $(".esoc-userprofile-img-"+userId)
         * @param options *userId
         *                *context
         *                defaultPhotElement
         *                photoElement
         *                photoUrl
         */
        setProfilePic: function (options) {
          var connector = options.context.getObject(ConnectorFactory),
              connObj = connector.connection,
              connectionUrl = new Url(connObj.url),
              dfd = this.getUserPhotoURL({
                "context": options.context,
                "noCache": options.noCache,
                "connectionURL": connObj.url,
                "userid": options.userid
              });
          dfd.promise().done(function (url) {
            var photoElement       = !!options.photoElement ? options.photoElement :
                                     $(".esoc-userprofile-img-" + options.userid),
                defaultPhotElement = !!options.defaultPhotElement ? options.defaultPhotElement :
                                     $(".esoc-user-default-avatar-" + options.userid);
            if (url && url.match(/v=/)) {

              var _resolvePhoto = function (photoUrl) {
                var dfdPhoto          = $.Deferred(),
                    getPhotoConnector = connector.extendAjaxOptions({
                      url: photoUrl,
                      dataType: 'binary',
                      connection: connObj
                    });

                $.ajax(getPhotoConnector).done(function (response) {
                  dfdPhoto.resolve(response);
                }).fail(dfdPhoto.reject);

                return dfdPhoto.promise();
              };

              _resolvePhoto(url).done(function (photoBlob) {
                defaultPhotElement.hide();
                photoElement.show();
                photoElement.removeClass("binf-hidden");
                photoElement.attr("src", URL.createObjectURL(photoBlob));
                if (options.viewShownEvent) {
                  options.parentView && options.parentView.trigger("view:shown");
                }
              }).fail(function () {
                photoElement.hide();
                photoElement.removeClass("binf-hidden");
                defaultPhotElement.addClass("esoc-user-show-profilepic");
                defaultPhotElement.css("display", "inline-flex");
                defaultPhotElement.removeClass("binf-hidden");
                if (options.viewShownEvent) {
                  options.parentView && options.parentView.trigger("view:shown");
                }
              });

            } else {
              photoElement.hide();
              photoElement.removeClass("binf-hidden");
              defaultPhotElement.addClass("esoc-user-show-profilepic");
              defaultPhotElement.css("display", "inline-flex");
              defaultPhotElement.removeClass("binf-hidden");
              if (options.viewShownEvent) {
                options.parentView && options.parentView.trigger("view:shown");
              }
            }
          });
        },
        setUserColor: function(options) {        
           var defaultPhotElement = !!options.defaultPhotElement ? options.defaultPhotElement :
                                     $(".esoc-user-default-avatar-" + options.userid);
           (options.userbackgroundcolor && defaultPhotElement)?
           defaultPhotElement.css("background",options.userbackgroundcolor):"";	
        },
        /**
         * Triggers the default action on the given object
         *  if type document it will open/download
         *  if type is container opens the container in nodes table view
         * @param objectArgs
         *        node   node model object
         *        callingViewInstance  reference from where openItem is called
         */
        openItem: function (objectArgs) {
          var that       = this,
              node       = objectArgs.node,
              currentObj = objectArgs.callingViewInstance;
          var isShortcut = !!node.original && node.original.get("id") > 0;
          if (node.get("container") || (node.get("type") === 5574) ||
              isShortcut && (node.original.get("container") ||
                             node.original.get("type") === 258)) {
            // close the user widget if in open state
            $(".esoc-user-widget-dialog .cs-close").trigger("click");
            // close the commenting widget if in open state
            that.unbindWidget();
            // close the  activity feed maximised view if in open state
            $(".activityfeed-expand .cs-close").trigger('click');
          }
          currentObj.triggerMethod('execute:defaultAction', node);
        },
        getV2Url: function (url) {
          return url.replace('/v1', '/v2');
        },
        /**
         * this method removes the comment dialog from dom.
         * @param args = {input, pos}
         */
        unbindWidget: function (commentDialogOptions) {
          if (commentDialogOptions && commentDialogOptions.activityfeeditem) {
            if (commentDialogOptions.commentAction) {
              delete commentDialogOptions["commentAction"];
              commentDialogOptions.activityfeeditem.trigger("commentdialog:action");
            } else {
              commentDialogOptions.activityfeeditem.trigger("start:notification");
            }
          }
          $("[id*=esoc-social-comment-widget]").remove();
          $("[id*=esoc-social-comment-widget-pointer]").remove();
          $("[id*=esoc-social-comment-widget-mask]").remove();
          $(".cs-expanded.activityfeed-expand.esoc").removeAttr("disabled");
        },
        isTextOverflown: function (el) {
          var curOverflow = el.style.overflow;
          if (!curOverflow || curOverflow === "visible") {
            el.style.overflow = "hidden";
          }
          var isOverflowing = (el.clientWidth + 5) < el.scrollWidth
                              || (el.clientHeight + 5) < el.scrollHeight;
          el.style.overflow = curOverflow;
          return isOverflowing;
        },

        showMoreContent: function (e, moreView, _textEle) {
          var _lessEle     = $(moreView.$el.find(".esoc-see-less")[0]),
              _moreEle     = $(moreView.$el.find(".esoc-see-more")[0]),
              _textElement = $(_textEle)[0];
          /* Generally .show() method appends the default style
          of the element's DISPLAY property as a inline css. If the element is set to DISPLAY:NONE
          it will append DISPLAY:BLOCK as a inline css, which will make the element
          wraps to next line, so removing style attribute which has DISPLAY: NONE property
          and allowing external css take charge with DISPLAY : INLINE. */
          $(_lessEle).removeAttr("style");
          $(_lessEle).show();
          $(_moreEle).hide();

          $(_textElement).removeClass("esoc-see-more-content");
          moreView.options.parentCollectionView.triggerMethod('update:scrollbar');
          $(_textElement).removeClass("esoc-see-more-activity");
          $(_textElement).addClass("esoc-see-less-activity");
        },

        showLessContent: function (e, lessView, _textEle) {
          var _lessEle     = $(lessView.$el.find(".esoc-see-less")[0]),
              _moreEle     = $(lessView.$el.find(".esoc-see-more")[0]),
              _textElement = $(_textEle)[0];
          $(_lessEle).hide();
          /* Generally .show() method appends the default style
          of the element's DISPLAY property as a inline css. If the element is set to DISPLAY:NONE
          it will append DISPLAY:BLOCK as a inline css, which will make the element
          wraps to next line, so removing style attribute which has DISPLAY: NONE property
          and allowing external css take charge with DISPLAY : INLINE. */
          $(_moreEle).removeAttr("style");
          $(_moreEle).show();

          lessView.$el.focus();
          $(_textElement).addClass("esoc-see-more-content");
          lessView.options.parentCollectionView.triggerMethod('update:scrollbar');
          $(_textElement).addClass("esoc-see-more-activity");
          $(_textElement).removeClass("esoc-see-less-activity");
        },
        alignUpdateButton: function (afwId, create) {
          var afwListEle = $(".esoc-activityfeed-list.esoc-activityfeed-list-" + afwId),
              autoReloadEle, hiddenEle;
          if (create) {
            autoReloadEle = $('<div />', {
              'class': 'esoc-activityfeed-new-updates-wrapper',
              'html': NewUpdatesButtonTemplate({
                'messages': afLang,
                'newUpdatesWrapperClass': 'esoc-activityfeed-getnewupdates' +
                                          ' esoc-activityfeed-getnewupdates-' + afwId
              })
            });
            if (afwListEle.closest(".esoc-afw-newupdates").parent().find(
                    '.esoc-activityfeed-getnewupdates-' + afwId).length === 0) {
              afwListEle.closest(".esoc-afw-newupdates").parent().append(autoReloadEle);
              hiddenEle = $('<div />', {
                'class': 'esoc-activityfeed-invisiblebutton'
              });
              afwListEle.append(hiddenEle);
            }
          } else {
            autoReloadEle = $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
                              afwId);
          }
          if (afwListEle.length > 0) {
            autoReloadEle.css({
              'position': 'absolute',
              'top': '15px',
              'left': '50%',
              'transform': 'translate(-50%, -50%)'
            });
          }
        },
        /**
         * Adds and removes checkbox/radio button classes based on selection
         * @param event   event
         * @param view    view where the input elements are present
         * @param radioBtnGroupName  name of the input radio buttons group
         **/
        updateSelection: function (event, view, radioBtnGroupName) {
          if (event.target.type === "checkbox") {
            var checkboxSpanElement = view.$el.find("#" + event.target.id + "_checkbox");
            if (event.target.checked) {
              checkboxSpanElement.addClass('icon-checkbox-selected').removeClass('icon-checkbox');
            } else {
              checkboxSpanElement.addClass('icon-checkbox').removeClass('icon-checkbox-selected');
            }
          } else if (event.target.type === "radio") {
            var oldRadioInputEle    = view.$el.find(
                    "input[name='" + radioBtnGroupName + "'][checked]"),
                oldRadioSpanElement = view.$el.find("#" + oldRadioInputEle.attr("id") + "_radio"),
                newRadioSpanElement = view.$el.find("#" + event.target.id + "_radio");
            oldRadioSpanElement.addClass('icon-radiobutton').removeClass(
                'icon-radiobutton-selected');
            oldRadioInputEle.removeAttr("checked");
            event.target.setAttribute("checked", "");
            newRadioSpanElement.addClass('icon-radiobutton-selected').removeClass(
                'icon-radiobutton');
          }
        },
        getUserWidgetModel: function (widgetOptions) {
          var userwidgetModel = widgetOptions.context.getModel(MemberModelFactory, {
                attributes: {id: widgetOptions.userid},
                options: {
                  id: widgetOptions.userid,
                  connector: widgetOptions.connector
                },
                temporary: true
              }
          );
          userwidgetModel.setExpand("member");
          return userwidgetModel;
        },

        /**
         * Returns Nodel Model based on the options
         *
         * @param objModel  the attributes of this are used to construct node model
         * @param connector  connector
         * @param isAttachment  differentiates attachement model from sgm model
         * @returns {*}
         */
        buildNodeModel: function (objModel, connector, isAttachment) {
          var objModelAttributes = _.extend({}, objModel.attributes),
              objNodeModel;
          delete objModelAttributes.actions;
          if (isAttachment) {
            objModelAttributes = _.extend(
                {commands: objModel.attributes.attachmentCommands}, objModelAttributes);
            objModelAttributes.id = objModel.attributes.extended_info &&
                                    objModel.attributes.extended_info.attachment_original_data_id ?
                                    parseInt(
                                        objModel.attributes.extended_info.attachment_original_data_id,
                                        10) :
                                    parseInt(objModel.attributes.extended_info.attachment_id, 10);
          } else {
            objModelAttributes = _.extend(
                {commands: objModel.attributes.sgmCommands}, objModelAttributes);
            objModelAttributes.id = objModel.attributes.extended_info.subtype === 1 ?
                                    objModel.attributes.extended_info.sgm_original_data_id :
                                    objModel.attributes.data_id;
          }
          objNodeModel = new NodeModel(objModelAttributes, {
            connector: connector,
            parse: true
          });
          return objNodeModel;
        },
        /**
         * The below function is used to place the cursor position at the end of content editable DIV
         * @param args = {el}
         */
        placeCaretAtEnd: function (el) {
          if (typeof window.getSelection !== "undefined"
              && typeof document.createRange !== "undefined") {
            el.focus();
            var textVal = window.getSelection().focusNode.textContent;
            var selectedItem = window.getSelection();
            if (selectedItem.rangeCount) {
              var range = selectedItem.getRangeAt(0);
              range = range.cloneRange();
              range.selectNodeContents(el[0]);
              range.collapse(false);
              selectedItem.removeAllRanges();
              selectedItem.addRange(range);
            }
            el.focus();
          } else if (typeof document.body.createTextRange !== "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
          }
        }
      };
      return Utils;
    });
