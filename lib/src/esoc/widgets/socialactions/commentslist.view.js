/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/moment',
  'csui/lib/handlebars',
  'csui/utils/contexts/factories/connector',
  'i18n!esoc/widgets/socialactions/nls/lang',
  'esoc/widgets/socialactions/replycollectionbase',
  'esoc/widgets/userwidget/userwidget',
  'hbs!esoc/widgets/socialactions/comment',
  'esoc/widgets/socialactions/util',
  'csui/utils/url',
  'csui/utils/nodesprites',
  'csui/utils/namedsessionstorage',
  'esoc/widgets/userwidget/util',
  'csui/lib/handlebars.helpers.xif'
], function (_require, _, $, Backbone, Marionette, Moment, Handlebars,
    ConnectorFactory, lang, ReplyCollectionBase, UserWidget, CommentTemplate,
    Util, Url, NodeSpriteCollection, NamedSessionStorage, UserWidgetUtil) {
  var CommentListItem = Marionette.ItemView.extend({
    tagName: "li",
    momentJS: Moment,
    util: Util,
    namedSessionStorage: new NamedSessionStorage(Util.commonUtil.globalConstants.ESOCIAL_USER_INFO),
    className: 'esoc-social-comment-list-item binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12',
    template: CommentTemplate,
    templateHelpers: function () {
      var mimeTypeClass = "csui-icon mime_document",
          objModel      = this.model, subType, isSGMShortCut;

      if ($.inArray(this.model.attributes.feed_event_type, [7, 8, 9]) !== -1) {
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
      } else if (!!this.model.attributes.extended_info &&
                 !!this.model.attributes.extended_info.attachment_subtype) {
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
        mimeTypeClass = NodeSpriteCollection.findClassByNode(objModel);
      }

      var messages = {
        reply: lang.reply,
        replyCount: this.model.get(this.util.commonUtil.globalConstants.REPLY_COUNT) ?
                    _.str.sformat(lang.replyCount,
                        this.model.get(this.util.commonUtil.globalConstants.REPLY_COUNT)) : "",
        attachFile: lang.attachFile,
        modifiedAt: lang.modifiedAt,
        update: lang.update,
        cancel: lang.cancel,
        deleteComment: lang.deleteComment,
        edit: lang.edit,
        hide: lang.hide,
        post: lang.post,
        writeAComment: lang.writeAComment,
        attachmentDeleteDescription: lang.attachmentDeleteDescription,
        attachmentDeleteTitle: lang.attachmentDeleteTitle,
        deleteCommentheader: lang.deleteCommentheader,
        confirmationText1: lang.confirmationText1,
        confirmationText2: lang.confirmationText2,
        shortcutAttachmentSubtype: this.util.commonUtil.globalConstants.SHORTCUT_ATTACHMENT_SUBTYPE,
        documentAttachmentSubtype: this.util.commonUtil.globalConstants.DOCUMENT_ATTACHMENT_SUBTYPE,
        emoticon: lang.emoticon,
        feedEventType: parseInt(this.model.attributes.feed_event_type, 10),
        version: lang.version,
        more: lang.more,
        less: lang.less,
        mimeTypeClass: mimeTypeClass,
        editAttachment: lang.editAttachmentTitle
      }

      messages.attachmentPositionClass = (((parseInt(this.model.attributes.feed_event_type,10) === 1)) ||
                                          (!!this.model.attributes.actions &&
                                           !!this.model.attributes.actions.reply &&
                                           !(!!this.model.attributes.actions.reply.can_reply))) ?
                                         "esoc-social-attachment-file-alone" : "";

      if (this.model.attributes.feed_event_type === 7) {
        var subTypeName = this.model.attributes.extended_info.subtype_name === undefined ? "" :
                          this.model.attributes.extended_info.subtype_name;
        messages.textmsg = subTypeName !== "" ? (lang.addMsg + subTypeName + " ") :
                           this.model.attributes.text;
      }

      if (this.model.attributes.feed_event_type === 8) {
        messages.textmsg = lang.versionMsg;
      }

        this.uniqueId = _.uniqueId();
        return {
            uniqueId: this.uniqueId,
            messages: messages
        };
    },
    initialize: function (options) {
      options.connector = options.connector || options.context.getObject(ConnectorFactory);
      var containHttp = options.model.collection.baseURL.indexOf('http') === 0;
      if (containHttp) {
        if (options.model.collection.baseURL !== undefined) {
          var baseUrlTokens = options.model.collection.baseURL.split(/[\/]+/);
          if (this.model.attributes.extended_info !== undefined &&
              this.model.attributes.extended_info.attachment_icon_id !== undefined) {
            this.model.attributes.extended_info.attachment_icon_id = baseUrlTokens[0] + "//" +
                                                                     baseUrlTokens[1] +
                                                                     this.model.attributes.extended_info.attachment_icon_id;
          }
        }
      }
      this.listenTo(this.model, "change", this.render);
    },
    events: {
      "click .esoc-social-comment-icon-edit": "onEditComment",
      "keydown .esoc-social-comment-icon-edit": "onClickWithSpaceKey",
      "click .esoc-social-comment-icon-hide": "onHideComment",
      "click .esoc-social-comment-icon-delete.esoc-social-comment-delete-confirm": "onRemoveModel",
      "keydown .esoc-social-comment-icon-delete.esoc-social-comment-delete-confirm": "onClickWithSpaceKey",
      "click .esoc-social-comment-update": "onUpdateComment",
      "click .esoc-social-comment-cancel": "onUpdateCancelComment",
      "input .esoc-social-editable": "onEditTextChanged",
      "input .esoc-social-comment-data-textarea": "onEditTextKeyPress",
      "focus .esoc-social-comment-data-textarea": "onFocusCommentEdit",
      "click .esoc-reply_link": "onCommentReply",
      "keydown .esoc-reply_link": "onClickWithSpaceKey",
      "click .comment.esoc-social-attachment-icon-delete": "onAttachmentDelete",
      "keydown .comment.esoc-social-attachment-icon-delete": "onClickWithSpaceKey",
      "click .comment.esoc-social-attachment-file": "selectAttachment",
      "keydown .comment.esoc-social-attachment-file": "onClickWithSpaceKey",
      "input .esoc-comment-emoji": "onEditTextKeyPress",
      "keyup .esoc-comment-emoji": "onEditTextKeyPress",
      "change .esoc-social-comment-data-textarea": "onEditTextKeyPress",
      "focus .esoc-comment-emoji": "onFocusCommentEdit",
      "click .esoc-social-comment-emoticon": "onEmojiPress",
      "click .esoc-social-comment-attachment": "onAttachementPress",
      "click .esoc-object-name, .esoc-social-mime-icon": "openItem",
      "click .esoc-social-attachment-icon, .esoc-social-attachment-download": "openAttachment",
      "keydown .esoc-social-attachment-icon, .esoc-social-attachment-download": "onClickWithSpaceKey",
      "click .esoc-see-more-activity": "showMoreContent",
      "click .esoc-see-less-activity": "showLessContent",
      "mousedown .esoc-comment-emoji .esoc-user-mention": "onCommentEmojiMentionMouseClick"
    },
    _elements: {
      csuisocialcommentdatatextarea: null
    },
    constructor: function CommentListItem() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    onClickWithSpaceKey: function (e) {
      Util.applySpaceKeyEvent(e);
    },
    onRender: function (e) {
      var objModel = this.model, that = this;
      this.inactivateUnsupportedSubType(objModel);
      this.listenTo(this.options.model.collection, 'sync', function () {
        var objModel = this.model, inactiveClass = 'esoc-social-comment-inactive';
        that.$el.find(".esoc-social-comment-data .esoc-social-mime-icon").removeClass(
            inactiveClass);
        that.$el.find(".esoc-social-comment-data .esoc-object-name").removeClass(inactiveClass);
        that.$el.find("#esoc-social-comment-attachment-" + objModel.attributes.id +
                      " .esoc-social-attachment-name").removeClass(inactiveClass);
        that.$el.find("#esoc-social-comment-attachment-" + objModel.attributes.id +
                      " .esoc-social-attachment-icon").removeClass(inactiveClass);
        that.inactivateUnsupportedSubType(objModel);
      });
      if (this.options.model.collection.models.length > 0 &&
          $("#esoc-social-comment-container").find(".esoc-social-comment-body-divider").length ===
          0 && this.options.model.collection.models[0].id !== 0) {
        $("#esoc-social-comment-container").css("border-bottom",
            "2px solid #ffffff");
        $("#esoc-social-comment-form-buttons-container").removeClass("esoc-social-form-minheight");
      }
      if (this.model.attributes.feed_event_type === 2) {
        this.$el.addClass("esoc-social-status-reply");
        this.$el.find(".esoc-social-attachment").attr("class",
            "binf-col-lg-8 binf-col-md-8 binf-col-sm-10 binf-col-xs-10 esoc-social-attachment");
      }

      if (this.$el.find(".esoc-comment-reply").children().length === 0 &&
          this.$el.find(".esoc-comment-attachment").children().length === 0) {
        this.$el.find(".esoc-social-comment-list-actions").hide();
      }

      var commentData = this.$el.find(".esoc-social-comment-data").html(),
          imgNode     = {
            id: this.model.attributes.extended_info ?
                this.model.attributes.extended_info.user_photo_id : this.model.attributes.data_id
          };
      this._elements.csuisocialcommentdatatextarea = this.$el.find(
          ".esoc-social-comment-data-textarea");
      if (this.model.collection.socialActions !== undefined &&
          this.model.collection.socialActions.attachementsEnabled &&
          this.model.collection.socialActions.shortcutsEnabled) {
        var attachmentPopOverArgs = {
          socialActions: this.model.collection.socialActions,
          id: this.model.attributes.id,
          uniqueId: this.uniqueId,
          desktopAttachmentInputId: "esoc-social-commentlist-desktop-attachment-" +
                                    this.model.attributes.id,
          attachFiles: true,
          itemview: this,
          shortcutIdHolder: this.$el.find("#esoc-social-comment-cs-shortcut-" +
                                          this.model.attributes.id + "-attachfiles"),
          connector: this.options.connector
        };
        this.util.showAttachmentPopOver(this.$el.find('.esoc-social-attachment-file'),
            attachmentPopOverArgs);
      }
      if (this.model.attributes.feed_event_type !== 7 &&
          this.model.attributes.feed_event_type !== 8 &&
          this.model.attributes.feed_event_type !== 9) {
        this.applyemoji(e);
      }
      if (this.model.attributes.feed_event_type === 9) {
        var sgmText = this.util.commonUtil.onClickableUrl(this.model.attributes.text);
        if (this.model.attributes.extended_info.subtype === 1) {
          sgmText = sgmText.replace('[MimeType]',
              "<span class='csui-icon-group esoc-social-mime-icon esoc-comment-valign'>" +
              "<span class='" + this.templateHelpers().messages.mimeTypeClass +
              "'></span>" +
              "<span class='csui-icon csui-icon-shortcut-overlay'></span>" +
              "</span>" +
              "</span>");
        } else {
          sgmText = sgmText.replace('[MimeType]',
              "<span class='" + this.templateHelpers().messages.mimeTypeClass +
              " esoc-social-mime-icon esoc-comment-valign'></span>");
        }
        this.$el.find(".esoc-social-comment-data").html(sgmText);
        this.$el.find(".esoc-object-name").addClass("esoc-comment-valign");
        this.$el.find(".esoc-social-comment-data").addClass("esoc-social-sgm-attr-change");
        this.$el.find(".esoc-object-name").attr("title", this.model.attributes.extended_info.name);
        this.$el.find(".esoc-social-mime-icon").attr("title",
            this.model.attributes.extended_info.name);
      }
      if (this.model.attributes.user !== undefined && this.model.attributes.user.id !== undefined) {
        if (!UserWidget) {
          UserWidget = _require('esoc/widgets/userwidget/userwidget');
        }
        var defaultOptions = {
          userid: this.model.attributes.user.id,
          context: this.model.collection.context,
          showUserProfileLink: true,
          showMiniProfile: true,
          UserWidget: UserWidget
        };
        var userProfilePicOptions = _.extend({
          placeholder: this.$el.find('.esoc-profileimg-block'),
          showUserWidgetFor: 'profilepic',
          userWidgetWrapperClass: "esoc-social-comment-userprofile-pic",
          commentsHeaderView: this.options.commentConfigOptions &&
                              this.options.commentConfigOptions.commentsHeaderView

        }, defaultOptions);
        UserWidget.getUser(userProfilePicOptions);
        var userWidgetOptions = _.extend({
          placeholder: this.$el.find('.esoc-user-widget'),
          commentsHeaderView: this.options.commentConfigOptions &&
                              this.options.commentConfigOptions.commentsHeaderView
        }, defaultOptions);
        UserWidget.getUser(userWidgetOptions);
      }
      var context = !!this.options.context ? this.options.context :
                    this.model.attributes.widgetOptions.activityfeed.context;
      UserWidgetUtil.displayUserWidget(context, this.$el);
      if (this.model.attributes.feed_event_type === 1) {
        this.showSeeMoreLink(this.$el.find(this.contentTypeElement));
      }
    },
    onShow: function (e) {
      if ($.inArray(this.model.attributes.feed_event_type, [7, 8]) !== -1) {
        this.$el.find(".esoc-social-comment-data").css("white-space", "inherit");
        if (this.$el.find(".esoc-description").length > 0) {
          var objDesc = this.$el.find(".esoc-description").html();
          objDesc = this.util.commonUtil.onClickableUrl(objDesc);
          this.$el.find(".esoc-description").html(objDesc);
        }
      }
      this.util.setCommentDialogPointer();
      if (!UserWidget) {
        UserWidget = _require('esoc/widgets/userwidget/userwidget');
      }

      var that = this;
      this.$el.find(".esoc-old-user-display-name").each(function () {
        var userWidgetOptions = {
          userid: $(this).data("userid"),
          context: !!that.options.context ? that.options.context :
                   that.model.attributes.widgetOptions.activityfeed.context,
          placeholder: this,
          showUserProfileLink: true,
          showMiniProfile: true
        };
        UserWidget.getUser(userWidgetOptions);

      });
      this.$el.find(".esoc-new-user-display-name").each(function () {
        var userWidgetOptions = {
          userid: $(this).data("userid"),
          context: !!that.options.context ? that.options.context :
                   that.model.attributes.widgetOptions.activityfeed.context,
          placeholder: this,
          showUserProfileLink: true,
          showMiniProfile: true
        };
        UserWidget.getUser(userWidgetOptions);

      })
      var context = !!this.options.context ? this.options.context :
                    this.model.attributes.widgetOptions.activityfeed.context;
      UserWidgetUtil.displayUserWidget(context, this.$el);
      this.showSeeMoreLink(this.$el.find(this.contentTypeElement));
    },

    showSeeMoreLink: function (_ele) {
      var _e = $(_ele)[0];
      $(_e).addClass("esoc-see-more-content");
      this.util.setCommentDialogPointer(_ele);
      var that = this;
      setTimeout(function () {
        if (that.util.commonUtil.isTextOverflown(_e)) {
          that.$el.find(".esoc-see-more").show();
          $(_e).addClass("esoc-see-more-activity");
        }
        that.options.parentCollectionView.triggerMethod("update:scrollbar");
      }, 1000);
    },

    contentTypeElement: ".esoc-extended-view-mode",
    showMoreContent: function (e) {
      if (window.getSelection().toString() === "") {
        this.util.commonUtil.showMoreContent(e, this, this.$el.find(this.contentTypeElement));
        this.util.setCommentDialogPointer(e);
        this.util.setFocusOnDefaultElement(e);
        e.preventDefault();
        e.stopPropagation();
      }
    },

    showLessContent: function (e) {
      if (window.getSelection().toString() === "") {
        this.util.commonUtil.showLessContent(e, this, this.$el.find(this.contentTypeElement));
        this.util.setCommentDialogPointer(e);
        this.util.setFocusOnDefaultElement(e);
        e.preventDefault();
        e.stopPropagation();
      }
    },

    remove: function () {
      var self = this;
      this.$el.fadeOut(function () {
        Marionette.ItemView.prototype.remove.call(self);
        self.util.setCommentDialogPointer();
      });
    },
    openItem: function () {
      this.trigger("click:item");
    },
    openAttachment: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.trigger("click:attachment");
    },
    onFocusCommentEdit: function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    onEditComment: function (e) {
      e.stopPropagation();
      e.preventDefault();
      var beforeContainerScrollTop = $("#esoc-social-comment-container")[0].scrollTop,
          prevParent               = "",
          prevExpandedHeight       = 0,
          prevcollapsedHeight      = 0,
          previousId               = 0,
          previousDiffHeight       = 0;
      if ($(".esoc-social-comment-cancel:visible").length > 0) {
        prevParent = $(".esoc-social-comment-cancel:visible").closest(
            "li.esoc-social-comment-list-item"),
            prevExpandedHeight = $(prevParent).find(".esoc-social-comment-data").height(),
            prevcollapsedHeight = $(prevParent).find("#esoc-social-comment-edit-" + this.model.attributes.id).height(),
            previousId = parseInt($(prevParent).find(".esoc-social-comment-data").attr("data-id"),
                10),
            previousDiffHeight = parseInt(prevExpandedHeight - prevcollapsedHeight, 10);
        $(".esoc-social-comment-cancel:visible").trigger("click");
      }
      if ($(".esoc-social-reply-cancel:visible").length > 0) {
        prevParent = $(".esoc-social-reply-cancel:visible").closest(
            "li.esoc-social-reply-list-item"),
            prevExpandedHeight = $(prevParent).find(".esoc-social-reply-comment-data").height(),
            prevcollapsedHeight = $(prevParent).find("#esoc-social-comment-reply-list-" + this.model.attributes.id).height(),
            previousId = parseInt($(prevParent).closest(".reply-thread-list").attr("data-id"), 10),
            previousDiffHeight = parseInt(prevExpandedHeight - prevcollapsedHeight, 10);
        $(".esoc-social-reply-cancel:visible").trigger("click");
      }
      if (this.model.attributes.feed_event_type !== 7 &&
          this.model.attributes.feed_event_type !== 8 &&
          this.model.attributes.feed_event_type !== 9) {
        this.applyemoji(e);
      }
      this.$el.find('[id^="esoc-social-comment-edit-textarea-"]').hide();
      var _emojiArea = this.$el.find(".emoji-wysiwyg-editor");
      this.util.createChickletForMentions(_emojiArea);
      _emojiArea.show().focus();
      _emojiArea.get(0).focus(); // TODO: Need to verify and remove...
      this.$el.find(".esoc-social-comment-data").hide();
      this.$el.find(
          ".esoc-social-comment-icon-holder, .esoc-social-comment-list-actions, .reply-thread-list").hide();
      this.$el.find(".esoc-social-comment-list-update").show();
      this.$el.find(".esoc-social-edit-icons").show();
      this.$el.find(".esoc-social-edit-icons").animate({opacity: 1.0}, 0);

      var currentId = this.model.id;
      if (prevParent === null || prevParent === undefined ||
          (prevParent !== null && previousId < currentId)) {
        $("#esoc-social-comment-container")[0].scrollTop = beforeContainerScrollTop;
      } else {
        $("#esoc-social-comment-container")[0].scrollTop = parseInt((beforeContainerScrollTop +
                                                                     previousDiffHeight) - 36, 10);
      }

      if ((!this.model.collection.socialActions.attachementsEnabled &&
           !this.model.collection.socialActions.shortcutsEnabled ) ||
          this.model.attributes.extended_info.attachment_id !== "") {
        this.$el.find("#esoc-social-comment-edit-attachment-" + this.model.attributes.id).hide();
        this.$el.find(".esoc-social-comment-data").hide().addClass("esoc-social-editable-icons");
        this.$el.find(".esoc-social-edit-icons").addClass("esoc-social-icon-when-no-attachment");
        this.$el.find(".esoc-comment-emoji").addClass("esoc-social-input-when-no-attachment");
      }
      var attachmentPopOverArgs = {
        socialActions: this.model.collection.socialActions,
        id: this.model.attributes.id,
        uniqueId: this.uniqueId,
        desktopAttachmentInputId: "esoc-social-commentedit-desktop-attachment-" +
                                  this.model.attributes.id,
        shortcutIdHolder: this.$el.find("#esoc-social-comment-cs-shortcut-edit-" +
                                        this.model.attributes.id),
        connector: this.options.connector
      };

      this.util.showAttachmentPopOver(this.$el.find('#esoc-social-comment-edit-attachment-' +
                                                    this.model.attributes.id),
          attachmentPopOverArgs);
      this.$el.find("#esoc-social-comment-edit-attachment-" +
                    this.model.attributes.id).attr("title", lang.attachFile);
      this.$el.find("#esoc-social-attachment-icon-delete-" +
                    this.model.attributes.id).addClass("esoc-social-comment-edit");
      this.$el.find('[id^="esoc-suggestion-comment-list_"]').width(_emojiArea.outerWidth());
      this.util.commonUtil.preventDrop(this.$el.find(".esoc-comment-emoji"));
      var that = this;
      this.$el.find("#esoc-social-comment-edit-" + this.model.attributes.id).on("paste", function (e) {
        var maxCharters           = that.util.commonUtil.globalConstants.MAX_CHAR_LIMIT,
            existingCommentLength = $(
                ".esoc-social-comment-data-textarea-" + that.model.id).val().length;
        that.util.commonUtil.onCommentFormPaste(e, existingCommentLength, maxCharters);
        $(".esoc-social-comment-data-textarea-" +
          that.model.id).innerHTML = ($("#esoc-social-comment-edit-" + this.model.attributes.id).html());
        that.onEditTextKeyPress(e);
      });
      this.$el.find(".esoc-see-more").hide();
      this.$el.find(".esoc-see-less").hide();
      this.options.parentCollectionView.triggerMethod('update:scrollbar');
    },
    onEditTextKeyPress: function (event) {
      this.util.onMentionNameEdit(event);
      var _eleTextArea = this.$el.find(".esoc-social-comment-data-textarea-" +
                                       this.model.attributes.id),
          _eleTextVal  = _eleTextArea.val(),
          _eleDataDiv  = this.$el.find(".esoc-social-comment-data"),
          maxCharLimit = this.util.commonUtil.globalConstants.MAX_CHAR_LIMIT;
      _eleDataDiv.text(_eleTextVal);
      var _e = event || window.event;
      if (_eleTextVal.length > maxCharLimit) {
        var commentTxt = _eleTextVal.substr(0, maxCharLimit);
        _eleTextArea.val(commentTxt);
        _eleDataDiv.text(commentTxt);
        this.$el.find("#esoc-social-comment-edit-" + this.model.attributes.id).html("")[0].textContent = commentTxt;
        this.util.commonUtil.addEmoji(this.$el.find("#esoc-social-comment-edit-" + this.model.attributes.id), false,
            this.options.connector);
        this.util.commonUtil.placeCaretAtEnd(this.$el.find("#esoc-social-comment-edit-" + this.model.attributes.id));
        _e.preventDefault();
      }
    },
    onUpdateCancelComment: function (e) {
      var commentList = $("#esoc-social-comment-container").find(".esoc-social-comment-list-item");
      if (commentList.length <= 1) {
        $(commentList).removeClass("status-attachment-init-min-height" +
                                   " status-attachment-alone-init-min-height" +
                                   " esoc-edit-init-min-height");
      }

      this.$el.removeClass("esoc-social-editable-parent").find(
          ".esoc-social-comment-data-textarea-" +
          this.model.attributes.id).removeClass("esoc-social-editable").val(
          this.$el.find(".esoc-social-comment-hidden-text").text()).hide();
      var that = this;
      that.applyemoji(e);

      this.$el.find("#esoc-social-comment-data-textarea-" + this.model.attributes.id).css("display",
          "none");
      this.$el.find("#esoc-social-comment-reply-textarea").css("display", "none");
      this.$el.find(".esoc-social-comment-icon-holder, .esoc-social-comment-list-actions").show();
      this.$el.find("#esoc-social-comment-attachment-" + this.model.attributes.id).show();
      this.$el.find(".esoc-social-comment-list-update").hide();
      this.$el.find(".esoc-social-warning").hide();
      this.$el.find(".esoc-social-edit-icons").hide();
      this.$el.removeClass("esoc-social-editable-parent").find(
          ".esoc-social-comment-data").removeClass("esoc-social-editable");
      this.$el.find(".esoc-social-comment-data").css("display", "block");
      this.$el.find(".esoc-social-comment-data").attr("class",
          "binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12 esoc-social-comment-data");
      this.$el.find("#esoc-social-attachment-icon-delete-" +
                    this.model.attributes.id).removeClass("esoc-social-comment-edit");
      if ((!this.model.collection.socialActions.attachementsEnabled &&
           !this.model.collection.socialActions.shortcutsEnabled ) ||
          this.model.attributes.extended_info.attachment_id !== "") {
        this.$el.find(".esoc-social-comment-data").removeClass("esoc-social-editable-icons");
        this.$el.find(".esoc-social-comment-data-textarea").removeClass(
            "esoc-social-editable-icons");
        this.$el.find(".esoc-comment-emoji").removeClass("esoc-social-input-when-no-attachment");
      }
      var editAttachmentIcon = this.$el.find('#esoc-social-comment-edit-attachment-' +
                                             this.model.attributes.id);
      var inputFileAttachment = this.$el.find('#esoc-social-commentedit-desktop-attachment-' +
                                              this.model.attributes.id);
      if (editAttachmentIcon.attr("data-binf-original-title") &&
          editAttachmentIcon.attr("data-binf-original-title").length > 0) {
        this.util.hideAttachmentPopup(editAttachmentIcon, inputFileAttachment,
            this.model.collection.socialActions);
      }
      this.$el.find("#esoc-social-comment-cs-shortcut-edit-" + this.model.attributes.id).val("");
      this.util.setFocusOnDefaultElement(e);
      var context = !!this.options.context ? this.options.context :
                    this.model.attributes.widgetOptions.activityfeed.context;
      UserWidgetUtil.displayUserWidget(context, this.$el);
      this.showSeeMoreLink(this.$el.find(this.contentTypeElement));
      this.options.parentCollectionView.triggerMethod("update:scrollbar");
      this.$el.find(".esoc-social-comment-icon-edit:first-child").focus();
    },
    onUpdateComment: function (e) {
      var commentList = $("#esoc-social-comment-container").find(".esoc-social-comment-list-item");
      if (commentList.length <= 1) {
        $(commentList).removeClass("status-attachment-init-min-height" +
                                   " status-attachment-alone-init-min-height" +
                                   " esoc-edit-init-min-height");
      }
      var editElement          = this.$el.find(".esoc-social-comment-data-textarea-" +
                                               this.model.attributes.id),
          editValue            = editElement !== undefined ? editElement.val().trim() : "",
          commentId            = this.model.attributes.id,
          updateCommentRESTUrl = this.model.attributes.actions.edit.href,
          shortcutId           = $("#esoc-social-comment-cs-shortcut-edit-" + commentId),
          formData             = new FormData(),
          desktopDoc           = $("#esoc-social-commentedit-desktop-attachment-" + commentId),
          replace;
      formData.append("commands", "default");
      if (shortcutId.val().length > 0) {
        formData.append("ATT_ID", parseInt(shortcutId.val(), 10));
        replace = true;
      } else if (desktopDoc.length > 0) {
        var file = desktopDoc[0].files[0];
        if (file) {
          formData.append("AddDesktopDoc", file);
          replace = true;
        } else {
          replace = false;
        }
      } else {
        replace = this.$el.find(".esoc-social-comment-edit").is(":hidden");
      }
      this.util.showMask(this.$el);
      formData.append("status", editValue);
      formData.append("id", commentId);
      formData.append("replace", replace);
      var that = this;
      if (editValue !== "") {
        var ajaxParams = {
          "url": that.options.connector.connection.url + updateCommentRESTUrl,
          "type": that.model.attributes.actions.edit.method,
          "data": formData,
          "itemview": this,
          "baseURL": this.model.collection.baseURL
        };
        this.util.updateWithAttachmentAjaxCall(ajaxParams).done(function () {
          that.$el.find(".esoc-social-comment-icon-edit:first-child").focus();
        });
      } else {
        this.$el.find("#esoc-social-comment-edit-" + this.model.attributes.id).focus();
        this.util.hideMask(this.$el);
      }
      this.$el.find("#esoc-social-attachment-icon-delete-" +
                    this.model.attributes.id).removeClass("esoc-social-comment-edit");
    },
    onHideComment: function (e) {
    },
    onRemoveModel: function (e) {
      this.util.showMask(this.$el);
      var commentId     = this.model.attributes.id,
          deleteRESTUrl = this.model.attributes.actions.deleteAction.href,
          that          = this,
          ajaxParams    = {
            "url": that.options.connector.connection.url + deleteRESTUrl + "?id=" +
                   commentId,
            "type": that.model.attributes.actions.deleteAction.method,
            "model": this,
            "async": false,
            "requestType": "CommentDelete"
          };
      var args = {
        dialogtitle: this.templateHelpers().messages.deleteCommentheader,//TODO: code re-factor on "this.templateHelpers().messages"
        dialogmessage: this.templateHelpers().messages.confirmationText1 + " " +
                       this.templateHelpers().messages.confirmationText2,
        ajaxParams: ajaxParams
      }
      this.util.openConfirmationDialog(args);
    },
    destroy: function (e) {
      this.undelegateEvents();
      this.unbind();
      this.remove();
    },
    onCommentReply: function (e) {
      var parentNodeId = "#reply_" + this.model.id;
      var isVisible = $(parentNodeId).is(':visible');
      if (isVisible) {
        $(parentNodeId).children('div').remove();
        $(parentNodeId).hide();
        this.$el.find(".esoc-social-comment-icon-holder").show();
        this.options.parentCollectionView.triggerMethod("update:scrollbar");
        this.util.setCommentDialogPointer();
      } else {
        var previousId            = parseInt($('div[id^="reply_"]:visible').attr('data-id'), 10),
            currentId             = this.model.id,
            containerHeight       = $("#esoc-social-comment-container").height(),
            containerScrollHeight = $("#esoc-social-comment-container")[0].scrollHeight,
            containerScrollTop    = $("#esoc-social-comment-container")[0].scrollTop,
            divHeight             = $('div[id^="reply_"]:visible').height(),
            _eleContainer         = $("#esoc-social-comment-container")[0];

        if ((currentId < previousId) && ( (divHeight < containerScrollTop) ||
                                          ((divHeight - containerScrollTop) < containerHeight) )) {
          _eleContainer.scrollHeight = containerScrollHeight - divHeight;
          _eleContainer.scrollTop = containerScrollTop - divHeight;
        }
        $('div[id^="reply_"]').children('div').remove();// removes already opened replies DOM elements.
        $('div[id^="reply_"]').hide();
        var getRepliesOptions = {
              parentNode: parentNodeId,
              csBaseUrl: this.options.model.collection.baseURL,
              context: this.options.context,
              getRepliesUrl: Url.appendQuery(this.model.attributes.actions.reply.href, ''),
              conversation_id: this.model.attributes.extended_info.conversation_id,
              item_id: this.model.id,
              parentCommentModel: this.model,
              parentCollectionView: this.options.parentCollectionView,
              canReply: this.model.attributes.actions.reply.can_reply,
              socialActions: this.model.collection.socialActions
            },
            replyColl         = new ReplyCollectionBase(getRepliesOptions);
        this.$el.find(".esoc-reply-emoji").focus();
      }
    },
    onAttachmentDelete: function (e) {
      if (e.target.classList.contains("esoc-social-comment-edit")) {
        e.preventDefault();
        e.stopPropagation();
        this.$el.find("#esoc-social-comment-attachment-" + this.model.attributes.id).hide();
        this.$el.find("#esoc-social-comment-edit-attachment-" + this.model.attributes.id).show();
        this.$el.find(".esoc-social-edit-icons").removeClass(
            "esoc-social-icon-when-no-attachment ");
        this.$el.find(".esoc-comment-emoji").removeClass("esoc-social-input-when-no-attachment");
        this.$el.find(".esoc-social-comment-data").removeClass("esoc-social-editable-icons");
        this.$el.find(".esoc-social-comment-data-textarea").removeClass(
            "esoc-social-editable-icons");
        $("#esoc-social-comment-edit-" + this.model.attributes.id).focus();
      } else {
        var that = this;
        var commentId = this.model.attributes.id;
        var updateCommentRESTUrl = this.model.attributes.actions.edit.href;
        var _eleDiv = $("<div />").html(this.model.attributes.text);
        var eleTextVal = _eleDiv.text();
        var ajaxParams = {
          "url": that.options.connector.connection.url + updateCommentRESTUrl,
          "type": that.model.attributes.actions.edit.method,
          "dataType": "text",
          "data": {
            id: commentId,
            status: eleTextVal,
            ATT_ID: 0,
            replace: true
          },
          "model": that,
          "requestType": "AttachmentDelete"
        };
        var args = {
          dialogtitle: this.templateHelpers().messages.attachmentDeleteTitle,
          dialogmessage: this.templateHelpers().messages.attachmentDeleteDescription,
          ajaxParams: ajaxParams
        }
        this.util.openConfirmationDialog(args);
      }
    },
    uploadAttachment: function (e) {
      var commentId            = this.model.attributes.id,
          updateCommentRESTUrl = this.model.attributes.actions.edit.href,
          shortcutIdHolder     = $("#esoc-social-comment-cs-shortcut-" + this.model.attributes.id +
                                   "-attachfiles"),
          formData             = new FormData(),
          desktopDoc           = this.$el.find("#esoc-social-commentlist-desktop-attachment-" +
                                               commentId);
      formData.append("commands", "default");
      if (shortcutIdHolder.val() !== "") {
        formData.append("ATT_ID", parseInt(shortcutIdHolder.val(), 10));
      } else if (desktopDoc.length > 0) {
        var file = desktopDoc[0].files[0];
        if (file) {
          formData.append("AddDesktopDoc", file);
        }
      }
      this.$el.find(".esoc-comment-attachment").hide()
      this.$el.find(".item-separator").hide();
      this.util.showMask(this.$el);
      var _eleDiv = $("<div />").html(this.model.attributes.text);
      var eleTextVal = _eleDiv.text();
      formData.append("status", eleTextVal);
      formData.append("id", commentId);
      var ajaxParams = {
        "url": this.options.connector.connection.url + updateCommentRESTUrl,
        "type": this.model.attributes.actions.edit.method,
        "data": formData,
        "itemview": this,
        "baseURL": this.model.collection.baseURL,
        "commentId": commentId,
        "feedType": "comment"
      };
      this.util.updateWithAttachmentAjaxCall(ajaxParams);
      shortcutIdHolder.val('');
      this.util.resetAttachmentInput(desktopDoc, this.model.collection.socialActions);
    },
    selectAttachment: function (e) {
      if (this.model.collection.socialActions.attachementsEnabled &&
          !this.model.collection.socialActions.shortcutsEnabled) {
        var that         = this,
            desktopInput = this.$el.find("#esoc-social-commentlist-desktop-attachment-" +
                                         this.model.attributes.id);
        desktopInput.off("change").on("change", function (e) {
          if (desktopInput.val().length > 0) {
            that.uploadAttachment(e);
          }
        });
        this.openBrowseWindow(e, desktopInput);
      } else if (!this.model.collection.socialActions.attachementsEnabled &&
                 this.model.collection.socialActions.shortcutsEnabled) {
        var args = {
          shortcutIdHolder: $("#esoc-social-comment-cs-shortcut-" + this.model.attributes.id +
                              "-attachfiles"),
          "itemview": this,
          "attachFiles": true
        };
        this.util.openTargetPicker(this.$el.find('.esoc-social-attachment-file'), args);
      }
    },
    openBrowseWindow: function (e, desktopInput) {
      desktopInput.val("");
      desktopInput.trigger("click");
    },
    applyemoji: function (e) {
      if (this.model.attributes !== undefined && this.model.attributes.id !== undefined) {
        this.$el.find(".emoji-wysiwyg-editor").remove();
        var _textArea = this.$el.find(".esoc-social-comment-data-textarea-" +
                                      this.model.attributes.id);
        _textArea.val(_textArea.val().replace(/&quot;/gi, "\""));
        var $wysiwyg = _textArea.emojiarea({
          path: this.util.commonUtil.getEmojiPath(this.options.connector),
          wysiwyg: true,
          button: '.esoc-social-comment-emotion-' + this.model.attributes.id,
          id: 'esoc-social-comment-edit-textarea-' + this.model.attributes.id,
          parent: this.$el.find("#esoc-social-edit-comment-icons-" + this.model.attributes.id),
          container: $("#esoc-social-comment-container"),
          util: this.util,
          widget: $(".esoc-social-comment-widget")
        });
        var _emojiArea = this.$el.find(".emoji-wysiwyg-editor");
        _emojiArea.addClass("esoc-comment-emoji").attr({
          "id": "esoc-social-comment-edit-" + this.model.attributes.id,
          "data-text": this.templateHelpers().messages.writeAComment
        });
        _textArea.hide();
        _emojiArea.hide();
        var commentData = _emojiArea.html();
        commentData = this.util.commonUtil.onClickableUrl(commentData);
        this.$el.find(".esoc-social-comment-data").html(commentData);
        _emojiArea.html(_emojiArea.html().replace(/\n/gi, "<br>"));
      }
      var suggestionOptions = {
        context: this.options.context,
        connector: this.options.connector,
        element: this.$el.find("#esoc-social-comment-edit-" + this.model.attributes.id),
        appendToElement: this.$el.find("[id^='esoc-suggestion-comment-list_']")
      }
      this.util.triggerAutoCompleteSuggestion(suggestionOptions);
      this.$el.find(".emoji-wysiwyg-editor").removeAttr("autocomplete");
    },
    onEmojiPress: function (e) {
      if (e.target.parentNode.id === "esoc-social-edit-comment-icons-" + this.model.attributes.id) {
        if ($("#esoc-social-comment-container").find(".esoc-social-comment-list-item").length <=
            1) {
          $("#esoc-social-comment-container").find(".esoc-social-comment-list-item").addClass(
              "esoc-edit-init-min-height");
        }
      }

      if (this.model.attributes !== undefined && this.model.attributes.id !== undefined) {
        this.util.hidePopover(this.$el.find(".esoc-social-comment-emotion-" +
                                            this.model.attributes.id));
      }
      e.stopPropagation();
    },
    onAttachementPress: function (e) {
      this.$el.find(".emoji-menu").hide();
    },
    onCommentEmojiMentionMouseClick: function (event) {
      this.util.setCursorPositionAtStartOFMention(event);
    },
    inactivateUnsupportedSubType: function (objModel) {
      var inactiveClass           = 'esoc-social-comment-inactive',
          defaultActionController = this.options.parentCollectionView.defaultActionController;
      if ($.inArray(this.model.attributes.feed_event_type, [7, 8, 9]) !== -1) {
        this.sgmModel = this.util.commonUtil.buildNodeModel(objModel,
           this.options.connector);
        if (defaultActionController && !defaultActionController.hasAction(this.sgmModel)) {
          this.$el.find(".esoc-social-comment-data .esoc-social-mime-icon").addClass(
              inactiveClass);
          this.$el.find(".esoc-social-comment-data .esoc-object-name").addClass(inactiveClass);
        }
      } else if (!!this.model.attributes.extended_info &&
                 !!this.model.attributes.extended_info.attachment_subtype) {
        this.attachmentModel = this.util.commonUtil.buildNodeModel(objModel,
            this.options.connector, true);
        if (defaultActionController && !defaultActionController.hasAction(this.attachmentModel)) {
          this.$el.find("#esoc-social-comment-attachment-" + this.model.attributes.id +
                        " .esoc-social-attachment-name").addClass(inactiveClass);
          this.$el.find("#esoc-social-comment-attachment-" + this.model.attributes.id +
                        " .esoc-social-attachment-icon").addClass(inactiveClass);
        }

      }
    }
  });
  return CommentListItem;
});
