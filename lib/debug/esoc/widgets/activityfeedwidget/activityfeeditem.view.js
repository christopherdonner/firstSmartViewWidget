csui.define([
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/moment',
  'csui/lib/handlebars',
  'csui/utils/contexts/factories/connector',
  'hbs!esoc/widgets/activityfeedwidget/activityfeed',
  'hbs!esoc/widgets/activityfeedwidget/activityfeedstandard',
  'hbs!esoc/widgets/activityfeedwidget/impl/activityfeedheader',
  'esoc/widgets/socialactions/commentscollectionwidget',
  'esoc/widgets/userwidget/userwidget',
  'i18n!esoc/widgets/activityfeedwidget/impl/nls/lang',
  'esoc/widgets/common/util',
  'esoc/widgets/userwidget/util',
  'csui/utils/log',
  'csui/utils/url',
  'csui/utils/nodesprites',
  'csui/utils/namedsessionstorage',
  'csui/lib/handlebars.helpers.xif',
  'css!esoc/widgets/tablecell/impl/social.css'
], function (_require, _, $, Backbone, Marionette, Moment, Handlebars, ConnectorFactory, ActivityFeedTemplate,
    ActivityFeedStandardTemplate, ActivityFeedHeaderTemplate, CommentsCollectionWidget, UserWidget,
    lang, CommonUtil, UserWidgetUtil, Log, Url, NodeSpriteCollection, NamedSessionStorage) {
  var ActivityFeedItemView = Marionette.ItemView.extend({
    regions: {
      tableRegion: '#tableview'
    },
    momentJS: Moment,
    commonUtil: CommonUtil,
    log: Log,
    namedSessionStorage: new NamedSessionStorage(CommonUtil.globalConstants.ESOCIAL_USER_INFO),
    className: function () {
      if (!!!this.options.strdViewOptions) {
        return 'esoc-activityfeed-list-item binf-row object-group-item esoc-activityfeed-expanded-view';
      } else {
        return 'esoc-activityfeed-list-item binf-row object-group-item';
      }
    },
    template: ActivityFeedTemplate,
    templateHelpers: function () {

      var mimeTypeClass           = "csui-icon mime_document",
          attachmentMimeTypeClass = "",
          inactiveClass           = "",
          attachmentInactiveClass = "",
          objModel                = this.model, subType, isSGMShortCut,
          defaultActionController = this.options.defaultActionController ?
                                    this.options.defaultActionController :
                                    this.options.parentCollectionView.defaultActionController;

      try {
        if (this.model.attributes.extended_info.display_icon_id === "") {
          mimeTypeClass = "";
        } else {
          isSGMShortCut = this.model.attributes.extended_info.subtype === 1 ? true : false;
          objModel.attributes.type = isSGMShortCut ?
                                     this.model.attributes.extended_info.sgm_original_sub_type :
                                     this.model.attributes.extended_info.subtype;
          objModel.attributes.mime_type = isSGMShortCut ?
                                          this.model.attributes.extended_info.sgm_original_mime_type :
                                          this.model.attributes.extended_info.mime_type;
          objModel.attributes.container = isSGMShortCut ?
                                          this.model.attributes.extended_info.sgm_original_container :
                                          this.model.attributes.extended_info.sgm_container;
          mimeTypeClass = NodeSpriteCollection.findClassByNode(objModel);
          this.sgmModel = this.commonUtil.buildNodeModel(objModel, objModel.connector);
          if (defaultActionController) {
            if (!defaultActionController.hasAction(this.sgmModel)) {
              inactiveClass = "esoc-social-activityfeeditem-inactive";
            }
          }
        }

        if (this.model.attributes.extended_info.attachment_subtype !== "") {
          attachmentMimeTypeClass = "csui-icon mime_document";
          subType = this.model.attributes.extended_info.attachment_subtype;
          objModel.attributes.type = subType === 1 ?
                                     this.model.attributes.extended_info.attachment_original_sub_type :
                                     subType;
          objModel.attributes.mime_type = subType === 1 ?
                                          this.model.attributes.extended_info.attachment_original_mime_type :
                                          this.model.attributes.extended_info.attachment_mime_type;
          objModel.attributes.container = subType === 1 ?
                                          this.model.attributes.extended_info.attachment_original_container :
                                          this.model.attributes.extended_info.attachment_container;

          attachmentMimeTypeClass = NodeSpriteCollection.findClassByNode(objModel);

          this.attachmentModel = this.commonUtil.buildNodeModel(objModel, objModel.connector, true);
          if (defaultActionController) {
            if (!defaultActionController.hasAction(this.attachmentModel)) {
              attachmentInactiveClass = "esoc-social-activityfeeditem-inactive";
            }
          }

        }
      } catch (e) {
        this.log.error(e);
      }

      var messages = {
        commentLabel: lang.commentLabel,
        modifiedAt: lang.modifiedAt,
        shortcutAttachmentSubtype: this.commonUtil.globalConstants.SHORTCUT_ATTACHMENT_SUBTYPE,
        documentAttachmentSubtype: this.commonUtil.globalConstants.DOCUMENT_ATTACHMENT_SUBTYPE,
        mimeTypeClass: mimeTypeClass,
        attachmentMimeTypeClass: attachmentMimeTypeClass,
        inactiveClass: inactiveClass,
        attachmentInactiveClass: attachmentInactiveClass,
        more: lang.more,
        less: lang.less,
        comments: lang.comments,
        statusfeed: lang.statusfeed,
        userProfileLink: lang.userProfileLink
      }

      if (this.model.attributes.feed_event_type === 4) {
        messages.actionType = (this.model.attributes.extended_info.name !== "" &&
                               this.model.attributes.extended_info.conversation_id ===
                               this.model.attributes.id) ? lang.commentMsg : lang.replyMsg;
      }

      if (this.model.attributes.feed_event_type === 2) {
        messages.actionType = lang.commentMsg;
      }

      if (this.model.attributes.feed_event_type === 7) {
        messages.textmsg = lang.addMsg;
      }

      if (this.model.attributes.feed_event_type === 8) {
        messages.textmsg = lang.versionMsg;
      }
      messages.enableComments = this.model.collection.enableComments !== undefined ?
                                this.model.collection.enableComments : true;
      messages.status = lang.status;
      messages.version = lang.version;
      messages.isFirstItem = (this.model.collection.at(0).cid !== this.model.cid);

      return {
          uniqueId: _.uniqueId(),
          messages: messages
      };
    },
    events: {
      "click .esoc-socialactions-getcomments .esoc-social-comment-container": "getComments",
      "click .esoc-object-name, .esoc-social-mime-icon": "openItem",
      "click .esoc-social-attachment-name, .esoc-social-attachment-icon": "openAttachment",
      "click .esoc-see-more-activity": "showMoreContent",
      "click .esoc-see-less-activity": "showLessContent"
    },

    _elements: {},

    constructor: function ActivityFeedItemView(options) {
      options = options || {};
      this.options = options;
      this.isHeaderView = !!options.strdViewOptions && !!options.strdViewOptions.headerView;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.options.connector = this.options.connector ||
                               this.options.context.getObject(ConnectorFactory);
      if (this.isHeaderView) {
        options.model.attributes.showCommentIcon = options.strdViewOptions.showCommentIcon;
        this.template = ActivityFeedHeaderTemplate;
      } else if (!!options.strdViewOptions) {
        options.model.attributes.showCommentIcon = options.strdViewOptions.showCommentIcon;
        this.template = ActivityFeedStandardTemplate;
      } else {
        this.template = ActivityFeedTemplate;
      }
      this.listenTo(this.model, "change", this.render);
      this.on("commentdialog:action", function (e) {
        this.trigger("childview:comment:action");
      });
      this.on("start:notification", function (e) {
        this.trigger("childview:start:notification");
      });

    },

    openItem: function () {
      this.trigger("click:item", this);
    },

    openAttachment: function () {
      this.trigger("click:attachment", this);
    },

    onRender: function (e) {
      var userWidgetOptions,
          defaultOptions,
          userId = this.model.attributes.user.id;

      if (!UserWidget) {
        UserWidget = _require('esoc/widgets/userwidget/userwidget');
      }
      if (this.model.attributes.user !== undefined && this.model.attributes.user.id !== undefined) {
        defaultOptions = {
          userid: this.model.attributes.user.id,
          context: this.options.context,
          showUserProfileLink: true,
          showMiniProfile: true
        };
        userWidgetOptions = _.extend(
            {placeholder: this.$el.find('.esoc-user-widget')}, defaultOptions);
        UserWidget.getUser(userWidgetOptions);
        var userProfilePicOptions = _.extend({
          placeholder: this.$el.find('.esoc-profileimg-block'),
          userWidgetWrapperClass: "esoc-activityfeed-userprofile-pic",
          showUserWidgetFor: 'profilepic'
        }, defaultOptions);
        UserWidget.getUser(userProfilePicOptions);
      }
      if (this.model.attributes.feed_event_type === 2 &&
          this.model.attributes.in_reply_to_user_id !== "") {
        var replyWidgetOptions = _.extend({}, userWidgetOptions);
        replyWidgetOptions.userid = this.model.attributes.in_reply_to_user_id;
        replyWidgetOptions.placeholder = this.$el.find('.esoc-reply-user-widget');
        UserWidget.getUser(replyWidgetOptions);
      }
      var context = this.options.context;
      UserWidgetUtil.displayUserWidget(context, this.$el);
    },

    onShow: function (e) {

      if (this.options.index === 0) {
        this.$el.find("a").prop("tabindex", "-1").attr("data-cstabindex", "-1");
        this.$el.find(".esoc-profileimg-block a").prop("tabindex", "0").attr("data-cstabindex", "0");
      } else {
        this.$el.find("a").prop("tabindex", "-1").attr("data-cstabindex", "-1");
      }

      if (this.model.attributes.feed_event_type === 1) {
        this.$el.find(".esoc-commentinfo-block").addClass("esoc-commentinfo-status");
      }
      // Do not apply emoji for document creation and version added event types.
      if ($.inArray(this.model.attributes.feed_event_type, [7, 8, 9]) !== -1) {
        this.$el.find(".esoc-commentinfo-block").addClass("esoc-commentinfo-sgm");
        this.$el.find(".esoc-social-comment-data").css("white-space", "inherit");
        if (this.$el.find(".esoc-description").length > 0) {
          var objDesc = this.$el.find(".esoc-description").html();
          objDesc = this.commonUtil.onClickableUrl(objDesc, true);
          this.$el.find(".esoc-description").html(objDesc);
        }
      } else {
        this.commonUtil.addEmoji(this.$el.find(".esoc-social-comment-data"), true,
            this.options.connector);
      }
      if (this.model.attributes.feed_event_type === 9) {
        var sgmText = this.commonUtil.onClickableUrl(this.model.attributes.text, true);
        if (this.model.attributes.extended_info.subtype === 1) {
          sgmText = sgmText.replace('[MimeType]',
              "<span class='csui-icon-group esoc-social-mime-icon'>" +
              "<span class='" + this.templateHelpers().messages.mimeTypeClass +
              "'></span>" +
              "<span class='csui-icon csui-icon-shortcut-overlay'></span>" +
              "</span>" +
              "</span>");
        } else {
          sgmText = sgmText.replace('[MimeType]',
              "<span class='" + this.templateHelpers().messages.mimeTypeClass +
              " esoc-social-mime-icon'></span>");
        }
        this.$el.find(".esoc-social-comment-data").html(sgmText);
        this.$el.find(".esoc-social-comment-data").addClass("esoc-social-sgm-attr-change");
        this.$el.find(".esoc-object-name").attr("title", this.model.attributes.extended_info.name);
        this.$el.find(".esoc-social-mime-icon").attr("title",
            this.model.attributes.extended_info.name);
        this.$el.find(".esoc-object-name").addClass(this.templateHelpers().messages.inactiveClass);
        this.$el.find(".esoc-social-mime-icon").addClass(
            this.templateHelpers().messages.inactiveClass);
      }
      if (!UserWidget) {
        UserWidget = _require('esoc/widgets/userwidget/userwidget');
      }

      var that = this;
      this.$el.find(".esoc-old-user-display-name").each(function () {
        var userWidgetOptions = {
          userid: $(this).data("userid"),
          context: this.options.context,
          placeholder: this,
          showUserProfileLink: true,
          showMiniProfile: true
        };
        UserWidget.getUser(userWidgetOptions);

      });
      this.$el.find(".esoc-new-user-display-name").each(function () {
        var userWidgetOptions = {
          userid: $(this).data("userid"),
          context: this.options.context,
          placeholder: this,
          showUserProfileLink: true,
          showMiniProfile: true
        };
        UserWidget.getUser(userWidgetOptions);

      });
      var context = this.options.context;
      UserWidgetUtil.displayUserWidget(context, this.$el);
      this.showSeeMoreLink(this.$el.find(this.contentTypeElement));
      if (this.isHeaderView &&
          this.$el.find(".esoc-activityfeed-header").length > 0) {
        this.$el.find(".esoc-activityfeed-header").each(function (idx) {
          var tsWidth = $(that.$el.find(".esoc-activityfeed-actiontype")[idx]).width() +
                        (idx === 0 ? 10 : 7);

          tsWidth = 'calc(100% - ' + tsWidth + 'px)';
          if (idx === 0) {
            $(that.$el.find(".esoc-activityfeed-header" +
                            " .esoc-commentinfo-block .esoc-userwidget-wrapper")).css(
                "max-width", tsWidth);
          } else {
            $(that.$el.find(".esoc-activityfeed-header .esoc-comment-msg" +
                            " .esoc-userwidget-wrapper")).css(
                "max-width", tsWidth);
          }

        });
      }
      if (!this.isHeaderView &&
          this.$el.find(".esoc-reply-user-widget").length > 0) {
        var statusLabelWidth = this.$el.find(".esoc-activityfeed-status-action").width() + 10;
        statusLabelWidth = 'calc(100% - ' + statusLabelWidth + 'px)';
        $(this.$el.find(".esoc-reply-user-widget .esoc-userwidget-wrapper")).css("max-width",
            statusLabelWidth);
      }
    },

    showSeeMoreLink: function (_ele) {
      if ($(_ele).length > 0) {
        var _e = $(_ele)[0];
        $(_e).addClass("esoc-see-more-content");
        var that = this;
        setTimeout(function () {
          if (that.commonUtil.isTextOverflown(_e)) {
            that.$el.find(".esoc-see-more").show();
            $(_e).addClass("esoc-see-more-activity");
          }
        }, 2000);
      }
    },

    contentTypeElement: ".esoc-extended-view-mode",
    showMoreContent: function (e) {
      if (window.getSelection().toString() === "") {
        this.commonUtil.showMoreContent(e, this, this.$el.find(this.contentTypeElement));
        this.$el.find('.esoc-extended-view-mode').focus();
      }
    },

    showLessContent: function (e) {
      if (window.getSelection().toString() === "") {
        this.commonUtil.showLessContent(e, this, this.$el.find(this.contentTypeElement));
      }
    },

    addFocus: function (e) {
      $(".esoc-user-widget-dialog.cs-dialog.binf-modal.binf-fade.binf-in").removeAttr(
          'tabindex').attr("disabled", "true");
      $("[id^='esoc-social-comment-widget-mask_']").attr('tabindex', '-1');
    },

    getComments: function (e) {
      var commentConfig = {
        baseElement: e.target,
        currentTarget: e.currentTarget,
        socialActionsInstanse: this,
        placeholder: this.model.collection.placeholder,
        context: this.options.context,
        maxMessageLength: this.options.model.attributes.maxMessageLength,
        activityfeeditem: this
      };
      this.addFocus(e);

      var responseData,
          that = this;
      if (this.model.attributes.feed_event_type !== 1 &&
          this.model.attributes.feed_event_type !== 2) {
        var csId = this.model.attributes.data_id;
        var restUrl = Url.combine(this.options.connector.connection.url,
                this.commonUtil.REST_URLS.csGetROI) + "CSID=" + csId;

        $.ajax(this.options.connector.extendAjaxOptions({
          type: "GET",
          async: false,
          cache: false,
          url: restUrl,
          success: function (response) {
            responseData = JSON.parse(JSON.stringify(response.available_settings));
          },
          error: function () {
            that.log.error("TEMP.  ERROR Getting available settings");
          }
        }));
      } else {
        // for status and it's replies make everything available if pulse is enabled at global level.
        responseData = {
          "attachementsEnabled": true,
          "commentingOpen": true,
          "commentsEnabled": true,
          "CSID": 0,
          "likesEnabled": true,
          "shortcutsEnabled": true,
          "taggingEnabled": true,
          "threadingEnabled": true
        }
      }
      commentConfig.socialActionsInstanse.model.attributes.socialactions = responseData;
      commentConfig.statusInfo = {};
      if (this.model.attributes.feed_event_type &&
          (this.model.attributes.feed_event_type === 1 ||
           this.model.attributes.feed_event_type === 2)) {
        commentConfig.statusInfo = {
          "getStatusUrl": this.model.attributes.actions.filter(function (obj) {
            return obj.signature === "reply";
          })[0].href,
          "conversation_id": this.model.attributes.extended_info.conversation_id,
          "item_id": this.model.attributes.id
        }
      }
      //TODO: need to avoid this tile view calls once comment dialog is opened.
      //clearInterval(this.model.collection.widgetOptions.notificationInterval);
      clearInterval(this.model.collection.widgetOptions.expNotificationInterval);
      var CommentsCollectionWidget = _require('esoc/widgets/socialactions/commentscollectionwidget'),
          commentsDialog           = new CommentsCollectionWidget(commentConfig);

      commentsDialog.show();

      document.activeElement.blur();
      var _ele = $("#esoc-social-comment-title")[0];
      _ele.focus();
      document.activeElement = _ele;
      $(".esoc-acitivityfeed-collection").css("overflow", "hidden");
    }
  });
  return ActivityFeedItemView;
});
