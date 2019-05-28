/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/moment',
  'csui/lib/handlebars',
  'csui/utils/contexts/factories/connector',
  'i18n!esoc/widgets/socialactions/nls/lang',
  'hbs!esoc/widgets/socialactions/reply',
  'esoc/widgets/userwidget/userwidget',
  'esoc/widgets/socialactions/util',
  'csui/utils/url',
  'csui/utils/nodesprites',
  'csui/utils/namedsessionstorage',
  'esoc/widgets/userwidget/util',
  'csui/lib/handlebars.helpers.xif'
], function (require, $, Backbone, _, Marionette, Moment, Handlebars, ConnectorFactory, lang,
    ReplyTemplate, UserWidget, Util, Url, NodeSpriteCollection, NamedSessionStorage,
    UserWidgetUtil) {

  var ReplyListItem = Marionette.ItemView.extend({
    tagName: "li",
    className: 'esoc-social-reply-list-item binf-col-lg-12 col-md-12 binf-col-sm-12 binf-col-xs-12',
    momentJS: Moment,
    util: Util,
    namedSessionStorage: new NamedSessionStorage(Util.commonUtil.globalConstants.ESOCIAL_USER_INFO),
    template: ReplyTemplate,
    templateHelpers: function () {
      var mimeTypeClass = "", objReplyModel, subType;
      if (this.model.attributes && this.model.attributes.extended_info &&
          this.model.attributes.extended_info.attachment_subtype) {
        objReplyModel = this.model;
        mimeTypeClass = "csui-icon mime_document";
        subType = this.model.attributes.extended_info.attachment_subtype;
        objReplyModel.attributes.type = subType === 1 ?
                                        this.model.attributes.extended_info.attachment_original_sub_type :
                                        subType;
        objReplyModel.attributes.mime_type = subType === 1 ?
                                             this.model.attributes.extended_info.attachment_original_mime_type :
                                             this.model.attributes.extended_info.attachment_mime_type;
        objReplyModel.attributes.container = subType === 1 ?
                                             this.model.attributes.extended_info.attachment_original_container :
                                             this.model.attributes.extended_info.attachment_container;
        mimeTypeClass = NodeSpriteCollection.findClassByNode(objReplyModel);
      }
      var messages = {
        seeMoreRepiles: lang.seeMoreReplies,
        attachFile: lang.attachFile,
        modifiedAt: lang.modifiedAt,
        update: lang.update,
        cancel: lang.cancel,
        writeAComment: lang.writeAComment,
        deleteReply: lang.deleteComment,
        edit: lang.edit,
        hide: lang.hide,
        attachmentDeleteDescription: lang.attachmentDeleteDescription,
        attachmentDeleteTitle: lang.attachmentDeleteTitle,
        uploadAttachment: lang.uploadAttachment,
        deleteReplyheader: lang.deleteReplyheader,
        confirmationTextforReplyDelete: lang.confirmationTextforReplyDelete,
        shortcutAttachmentSubtype: this.util.commonUtil.globalConstants.SHORTCUT_ATTACHMENT_SUBTYPE,
        documentAttachmentSubtype: this.util.commonUtil.globalConstants.DOCUMENT_ATTACHMENT_SUBTYPE,
        emoticon: lang.emoticon,
        more: lang.more,
        less: lang.less,
        mimeTypeClass: mimeTypeClass
      }
      this.uniqueId = _.uniqueId();
      return {
        messages: messages
      };
    },
    initialize: function (options) {
      var containHttp = options.model.collection.options.csBaseUrl.indexOf('http') === 0;
      if (containHttp) {
        if (options.model.collection.options.csBaseUrl !== undefined) {
          var baseUrlTokens = options.model.collection.options.csBaseUrl.split(/[\/]+/);
          if (this.model.attributes.extended_info !== undefined &&
              this.model.attributes.extended_info.attachment_icon_id !== undefined) {
            this.model.attributes.extended_info.attachment_icon_id = baseUrlTokens[0] + "//" +
                                                                     baseUrlTokens[1] +
                                                                     this.model.attributes.extended_info.attachment_icon_id;
          }
        }
      }
    },
    events: {
      "click .esoc-social-comment-icon-edit": "onEditReply",
      "click .esoc-social-comment-icon-hide": "onHideReply",
      "click .esoc-social-comment-icon-delete.esoc-social-reply-delete-confirm": "onRemoveModel",
      "keydown .esoc-social-comment-icon-delete.esoc-social-reply-delete-confirm": "onClickWithSpaceKey",
      "click .esoc-social-reply-update": "onUpdateReply",
      "click .esoc-social-reply-cancel": "onUpdateCancelReply",
      "input .esoc-social-editable": "onEditTextChanged",
      "input .esoc-social-reply-data-textarea": "onEditTextKeyPress",
      "input .esoc-reply-emoji-comment": "onEditTextKeyPress",
      "keyup .esoc-reply-emoji-comment": "onEditTextKeyPress",
      "change .esoc-social-reply-data-textarea": "onEditTextKeyPress",
      "focus .esoc-social-reply-data-textarea": "onFocusEditTextKey",
      "click .esoc-social-reply-seemore": "fetchMoreReplies",
      "click .reply.esoc-social-reply-attachment-icon-delete": "onReplyAttachmentDelete",
      "click .reply.esoc-social-attachment-file": "selectAttachment",
      "keydown .reply.esoc-social-attachment-file": "onClickWithSpaceKey",
      "focus .esoc-reply-emoji-comment": "onFocusEditTextKey",
      "click .esoc-social-reply-emoticon": "onEmojiPress",
      "click .esoc-social-comment-attachment": "onAttachementPress",
      "click .esoc-social-attachment-icon, .esoc-social-attachment-download": "openAttachment",
      "click .esoc-see-more-activity": "showMoreContent",
      "click .esoc-see-less-activity": "showLessContent",
      "mousedown .esoc-reply-emoji-comment .esoc-user-mention": "onReplyEditEmojiMentionMouseClick"
    },

    constructor: function ReplyListItem(options) {
      this.options = options || {};
      this.options.connector = this.options.connector ||
                               this.options.context.getObject(ConnectorFactory);
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    onClickWithSpaceKey: function (e) {
      Util.applySpaceKeyEvent(e);
    },
    remove: function () {
      var self = this;
      this.$el.fadeOut(function () {
        Marionette.ItemView.prototype.remove.call(self);
        self.util.setCommentDialogPointer();
      });
    },
    onFocusEditTextKey: function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    openAttachment: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.trigger("click:attachment");
    },
    onEditReply: function (e) {
      e.preventDefault();
      e.stopPropagation();
      if ($(".esoc-social-comment-cancel:visible").length > 0) {
        $(".esoc-social-comment-cancel:visible").trigger("click");
      }
      if ($(".esoc-social-reply-cancel:visible").length > 0) {
        var prevParent          = $(".esoc-social-reply-cancel:visible").closest(
            "li.esoc-social-reply-list-item"),
            prevExpandedHeight  = $(prevParent).find(".esoc-social-reply-data").height(),
            prevcollapsedHeight = $(prevParent).find("#esoc-social-comment-reply-list-" + this.model.attributes.id).height(),
            previousId          = parseInt(
                $(prevParent.children()).find("div[data-id]")[0].getAttribute("data-id"),
                10);
        $(".esoc-social-reply-cancel:visible").trigger("click");
      }
      this.$el.find(".esoc-social-comment-icon-holder, .esoc-social-reply-list-actions").hide();
      this.$el.find(".esoc-social-reply-list-update").show();
      this.$el.find(".esoc-social-edit-icons").show();
      this.$el.find(".esoc-social-edit-icons").animate({opacity: 1.0}, 0);
      this.$el.find(".esoc-social-edit-icons").addClass("esoc-social-editable-attachment-icons");
      this.applyReplyEmoji(e);
      this.$el.find('[class*="esoc-social-reply-comment-data"]').hide();
      var _emojiArea = this.$el.find(".emoji-wysiwyg-editor");
      this.util.createChickletForMentions(_emojiArea);
      _emojiArea.show().focus();
      this.$el.find("#esoc-social-reply-attachment-icon-delete-" +
                    this.model.attributes.id).addClass("esoc-social-reply-edit");
      if ((!this.model.collection.socialActions.attachementsEnabled &&
           !this.model.collection.socialActions.shortcutsEnabled) ||
          this.model.attributes.extended_info.attachment_id !== "") {
        this.$el.find("#esoc-social-reply-edit-attachment-" + this.model.attributes.id).hide();
        this.$el.find(".esoc-social-reply-data").hide().addClass("esoc-social-editable-icons");
        this.$el.find(".esoc-social-edit-icons").addClass("esoc-social-icon-when-no-attachment");
        this.$el.find(".esoc-reply-emoji-comment").addClass("esoc-social-input-when-no-attachment");
      }

      var _eleCommentContainer = $("#esoc-social-comment-container")[0],
          currentId            = this.model.id;
      if (currentId < previousId) {
        _eleCommentContainer.scrollTop = _eleCommentContainer.scrollTop +
                                         ( prevExpandedHeight - prevcollapsedHeight );
      }

      var attachmentPopOverArgs = {
        socialActions: this.model.collection.socialActions,
        id: this.model.attributes.id,
        uniqueId: this.uniqueId,
        desktopAttachmentInputId: "esoc-social-replyedit-desktop-attachment-" +
                                  this.model.attributes.id,
        shortcutIdHolder: this.$el.find("#esoc-social-reply-cs-shortcut-edit-" +
                                        this.model.attributes.id),
        connector: this.options.connector
      };
      this.util.showAttachmentPopOver(this.$el.find('#esoc-social-reply-edit-attachment-' +
                                                    this.model.attributes.id),
          attachmentPopOverArgs);
      this.$el.find("#esoc-social-reply-edit-attachment-" + this.model.attributes.id).attr("title",
          lang.attachFile);
      this.util.commonUtil.preventDrop(this.$el.find(".esoc-reply-emoji-comment"));
      var that = this;
      this.$el.find("#esoc-social-comment-reply-list-" + this.model.attributes.id).on("paste", function (e) {
        var maxCharters         = that.util.commonUtil.globalConstants.MAX_CHAR_LIMIT,
            existingReplyLength = $(
                ".esoc-social-reply-data-textarea-" + that.model.id).val().length;
        that.util.commonUtil.onCommentFormPaste(e, existingReplyLength, maxCharters);
        $(".esoc-social-reply-data-textarea-" +
          that.model.id).innerHTML = ($("#esoc-social-comment-reply-list-" + this.model.attributes.id).html());
        that.onEditTextKeyPress(e);
      });
      this.$el.find(".esoc-see-more").hide();
      this.$el.find(".esoc-see-less").hide();
      this.options.parentCollectionView.triggerMethod("update:scrollbar");
    },
    onEditTextKeyPress: function (event) {
      this.util.onMentionNameEdit(event);
      var _eleTextArea = this.$el.find('[class*="esoc-social-reply-data-textarea-"]'),
          _eleTextVal  = _eleTextArea.val(),
          _eleDataDiv  = this.$el.find(".esoc-social-reply-data"),
          _eleEmojiDiv = this.$el.find("#esoc-social-comment-reply-list-" + this.model.attributes.id),
          maxCharLimit = this.util.commonUtil.globalConstants.MAX_CHAR_LIMIT;

      _eleDataDiv.text(_eleTextVal);
      var _e = event || window.event;
      if (_eleTextVal.length > maxCharLimit) {
        var replyTxt = _eleTextVal.substr(0, maxCharLimit);
        _eleTextArea.val(replyTxt);
        _eleDataDiv.text(replyTxt);
        _eleEmojiDiv.html("")[0].textContent = replyTxt;
        this.util.commonUtil.addEmoji(_eleEmojiDiv, false, this.options.connector);
        this.util.commonUtil.placeCaretAtEnd(_eleEmojiDiv);
        _e.preventDefault();
      }
    },
    onRender: function (e) {
      var objModel = this.model, that = this;
      this.inactivateUnsupportedSubType(objModel);
      this.listenTo(this.options.model.collection, 'sync', function () {
        var objModel = that.model, inactiveClass = 'esoc-social-comment-inactive';
        that.$el.find("#esoc-social-reply-attachment-" + objModel.attributes.id +
                      " .esoc-social-attachment-name").removeClass(inactiveClass);
        that.$el.find("#esoc-social-reply-attachment-" + objModel.attributes.id +
                      " .esoc-social-attachment-icon").removeClass(inactiveClass);
        that.inactivateUnsupportedSubType(objModel);
      });
      if (this.model.collection.socialActions.attachementsEnabled &&
          this.model.collection.socialActions.shortcutsEnabled) {
        var attachmentPopOverArgs = {
          id: "attachfile-" + this.model.attributes.id,
          uniqueId: this.uniqueId,
          socialActions: this.model.collection.socialActions,
          desktopAttachmentInputId: "esoc-social-replylist-desktop-attachment-" +
                                    this.model.attributes.id,
          shortcutIdHolder: this.$el.find("#esoc-social-reply-cs-shortcut-" +
                                          this.model.attributes.id + "-attachfiles"),
          attachFiles: true,
          itemview: this,
          connector: this.options.connector
        };
        this.util.showAttachmentPopOver(this.$el.find('.esoc-social-attachment-file'),
            attachmentPopOverArgs);
      }
      if (this.model.attributes.user !== undefined && this.model.attributes.user.id !== undefined) {
        if (!UserWidget) {
          UserWidget = require('esoc/widgets/userwidget/userwidget');
        }
        var defaultOptions = {
          userid: this.model.attributes.user.id,
          context: this.options.context,
          showUserProfileLink: true,
          showMiniProfile: true,
          UserWidget: UserWidget
        };
        var userWidgetOptions = _.extend({
          placeholder: this.$el.find('.esoc-user-widget')
        }, defaultOptions);
        UserWidget.getUser(userWidgetOptions);
        var userProfilePicOptions = _.extend({
          placeholder: this.$el.find('.esoc-profileimg-block'),
          showUserWidgetFor: 'profilepic',
          userWidgetWrapperClass: "esoc-social-comment-userprofile-pic"
        }, defaultOptions);
        UserWidget.getUser(userProfilePicOptions);
      }
      this.applyReplyEmoji(e);
      var context = this.options.context;
      UserWidgetUtil.displayUserWidget(context, this.$el);
    },
    onShow: function (e) {
      if ($.inArray(this.model.attributes.feed_event_type, [7, 8]) !== -1) {
        this.$el.find(".esoc-social-reply-data").css("white-space", "inherit");
      }
      this.util.setCommentDialogPointer();
      var context = this.options.context;
      UserWidgetUtil.displayUserWidget(context, this.$el);

      if ($.inArray(this.model.attributes.feed_event_type, [7, 8, 9]) === -1) {
        this.showSeeMoreLink(this.$el.find(this.contentTypeElement));
      }
      this.options.parentCollectionView.triggerMethod("update:scrollbar");
    },

    showSeeMoreLink: function (_ele) {
      var _e = $(_ele)[0];
      $(_e).addClass("esoc-see-more-content");
      $(_e).addClass("esoc-see-min-height");
      this.util.setCommentDialogPointer(_ele);
      var that = this;
      setTimeout(function () {
        if (that.util.commonUtil.isTextOverflown(_e)) {
          that.$el.find(".esoc-see-more").show();
          $(_e).addClass("esoc-see-more-activity");
        }
        $(_e).removeClass("esoc-see-min-height");
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

    onUpdateCancelReply: function (e) {
      this.$el.removeClass("esoc-social-editable-parent").find(".esoc-social-reply-data-textarea-" +
                                                               this.model.attributes.id).removeClass(
          "esoc-social-editable").val(
          this.$el.find(".esoc-social-reply-hidden-text").text()).hide();
      var that = this;
      that.applyReplyEmoji(e);
      this.$el.find(".esoc-social-comment-icon-holder, .esoc-social-reply-list-actions").show();
      this.$el.find("#esoc-social-reply-attachment-" + this.model.attributes.id).show();
      this.$el.find(".esoc-social-reply-list-update").hide();
      this.$el.find(".esoc-social-warning").hide();
      this.$el.find(".esoc-social-edit-icons").hide();
      this.$el.removeClass("esoc-social-editable-parent").find(
          ".esoc-social-reply-data").removeClass("esoc-social-editable");
      this.$el.find(".esoc-social-reply-data").attr("class",
          "binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12 esoc-social-reply-data esoc-social-reply-comment-data");
      this.$el.find("#esoc-social-reply-attachment-icon-delete-" +
                    this.model.attributes.id).removeClass("esoc-social-reply-edit");
      if ((!this.model.collection.socialActions.attachementsEnabled &&
           !this.model.collection.socialActions.shortcutsEnabled) ||
          this.model.attributes.extended_info.attachment_id !== "") {
        this.$el.find(".esoc-social-reply-data").removeClass("esoc-social-editable-icons");
        this.$el.find(".esoc-social-edit-icons").removeClass("esoc-social-icon-when-no-attachment");
        this.$el.find(".esoc-reply-emoji-comment").removeClass(
            "esoc-social-input-when-no-attachment");
      }
      var editAttachmentIcon = this.$el.find('#esoc-social-reply-edit-attachment-' +
                                             this.model.attributes.id);
      var inputFileAttachment = this.$el.find('#esoc-social-replyedit-desktop-attachment-' +
                                              this.model.attributes.id);
      if (editAttachmentIcon.attr("data-binf-original-title") &&
          editAttachmentIcon.attr("data-binf-original-title").length > 0) {
        this.util.hideAttachmentPopup(editAttachmentIcon, inputFileAttachment,
            this.model.collection.socialActions);
      }
      this.$el.find(".esoc-comment-emoji").hide();
      var _emojiArea = this.$el.find(".esoc-reply-emoji-comment");
      _emojiArea.hide();
      this.$el.find('[class*="esoc-social-reply-comment-data"]').show();
      this.$el.find("#esoc-social-reply-cs-shortcut-edit-" + this.model.attributes.id).val("");
      this.util.setFocusOnDefaultElement(e);
      var context = this.options.context;
      UserWidgetUtil.displayUserWidget(context, this.$el);
      this.showSeeMoreLink(this.$el.find(this.contentTypeElement));
      this.options.parentCollectionView.triggerMethod("update:scrollbar");
      this.$el.find(".esoc-social-comment-icon-edit:first-child").focus();
    },
    onUpdateReply: function (e) {
      var editElement        = this.$el.find('[class*="esoc-social-reply-data-textarea-"]'),
          editValue          = editElement !== undefined ? editElement.val().trim() : "",
          commentId          = this.model.attributes.id,
          updateReplyRESTUrl = this.model.attributes.actions.edit.href,
          shortcutId         = $("#esoc-social-reply-cs-shortcut-edit-" + commentId),
          formData           = new FormData(),
          desktopDoc         = $("#esoc-social-replyedit-desktop-attachment-" + commentId),
          replace;
      editValue = this.util.commonUtil.revHtmlEntities(editValue);
      formData.append("commands", "default");
      if (shortcutId.val() !== "") {
        formData.append("ATT_ID", parseInt(shortcutId.val(), 10));
        replace = true;
      }
      else if (desktopDoc.length > 0) {
        var file = desktopDoc[0].files[0];
        if (file) {
          formData.append("AddDesktopDoc", file);
          replace = true;
        } else {
          replace = false;
        }
      } else {
        replace = this.$el.find(".esoc-social-reply-edit").is(":hidden");
      }
      this.util.showMask(this.$el);
      formData.append("status", editValue);
      formData.append("id", commentId);
      formData.append("replace", replace);
      var that = this;
      if (editValue !== "") {
        var ajaxParams = {
          "url": that.options.connector.connection.url + updateReplyRESTUrl,
          "type": that.model.attributes.actions.edit.method,
          "dataType": "text",
          "data": formData,
          "itemview": this,
          "baseURL": this.model.collection.options.csBaseUrl
        };
        this.util.updateWithAttachmentAjaxCall(ajaxParams).done(function() { 
          that.$el.find(".esoc-social-comment-icon-edit:first-child").focus();
        });
      } else {
        this.$el.find("#esoc-social-comment-reply-list-" + this.model.attributes.id).focus();
        this.util.hideMask(this.$el);
      }
      this.$el.find("#esoc-social-reply-attachment-icon-delete-" +
                    this.model.attributes.id).removeClass("esoc-social-reply-edit");
    },
    onHideReply: function (e) {
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
            "requestType": "ReplyDelete"
          };
      var args = {
        dialogtitle: this.templateHelpers().messages.deleteReplyheader, //TODO: code re-factor on "this.templateHelpers().messages"
        dialogmessage: this.templateHelpers().messages.confirmationTextforReplyDelete,
        ajaxParams: ajaxParams
      }
      this.util.openConfirmationDialog(args);
    },
    destroy: function (e) {
      this.undelegateEvents();
      this.unbind();
      this.remove();
    },
    fetchMoreReplies: function (e) {
      var collection = this.model.collection;
      delete collection.defaults.params[this.util.commonUtil.globalConstants.SINCE_ID];
      collection.fetch({
        remove: false,
        selEle: this.$el.find(".esoc-social-reply-seemore"),
        params: {max_id: this.model.attributes.id},
        success: collection.fetchSuccess,
        error: collection.fetchError
      });
    },
    onReplyAttachmentDelete: function (e) {
      if (e.target.classList.contains("esoc-social-reply-edit")) {
        e.preventDefault();
        e.stopPropagation();
        this.$el.find("#esoc-social-reply-attachment-" + this.model.attributes.id).hide();
        this.$el.find("#esoc-social-reply-edit-attachment-" + this.model.attributes.id).show();
        this.$el.find(".esoc-social-edit-icons").removeClass("esoc-social-icon-when-no-attachment");
        this.$el.find(".esoc-reply-emoji-comment").removeClass(
            "esoc-social-input-when-no-attachment");
        this.$el.find(".esoc-social-reply-data").removeClass("esoc-social-editable-icons");
        this.$el.find(".esoc-social-reply-data-textarea").removeClass("esoc-social-editable-icons");
        $("#esoc-social-comment-reply-list-" + this.model.attributes.id).focus();
      } else {
        var that = this;
        var replyId = this.model.attributes.id;
        var updateReplyRESTUrl = this.model.attributes.actions.edit.href;
        var _eleDiv = $("<div />").html(this.model.attributes.text);
        var eleTextVal = _eleDiv.text();
        var ajaxParams = {
          "url": that.options.connector.connection.url + updateReplyRESTUrl,
          "type": that.model.attributes.actions.edit.method,
          "dataType": "text",
          "data": {
            id: replyId,
            status: eleTextVal,
            replace: true
          },
          "model": that,
          "requestType": "AttachmentDelete"
        };
        var args = {
          dialogtitle: this.templateHelpers().messages.attachmentDeleteTitle,
          dialogmessage: this.templateHelpers().messages.attachmentDeleteDescription,
          ajaxParams: ajaxParams
        };
        this.util.openConfirmationDialog(args);
      }
    },
    uploadAttachment: function (e) {
      var replyId              = this.model.attributes.id,
          updateCommentRESTUrl = this.model.attributes.actions.edit.href,
          desktopDoc           = this.$el.find("#esoc-social-replylist-desktop-attachment-" +
                                               replyId),
          shortcutId           = $("#esoc-social-reply-cs-shortcut-" + replyId + "-attachfiles"),
          formData             = new FormData();
      formData.append("commands", "default");
      if (shortcutId.val() !== "") {
        formData.append("ATT_ID", parseInt(shortcutId.val(), 10));
      } else if (desktopDoc.length > 0) {
        var file = desktopDoc[0].files[0];
        formData.append("AddDesktopDoc", file);
      }
      var _eleDiv = $("<div />").html(this.model.attributes.text);
      var eleTextVal = _eleDiv.text();
      formData.append("id", replyId);
      formData.append("status", eleTextVal);
      this.$el.find(".esoc-reply-attachment").hide()
      this.util.showMask(this.$el);
      var ajaxParams = {
        "url": this.options.connector.connection.url + updateCommentRESTUrl,
        "type": this.model.attributes.actions.edit.method,
        "data": formData,
        "itemview": this,
        "baseURL": this.model.collection.options.csBaseUrl,
        "commentId": replyId,
        "feedType": "reply"
      };
      this.util.updateWithAttachmentAjaxCall(ajaxParams);
      shortcutId.val('');
      this.util.resetAttachmentInput(desktopDoc, this.model.collection.socialActions);
    },
    selectAttachment: function (e) {
      if (this.model.collection.socialActions.attachementsEnabled &&
          !this.model.collection.socialActions.shortcutsEnabled) {
        var that         = this,
            desktopInput = this.$el.find("#esoc-social-replylist-desktop-attachment-" +
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
          shortcutIdHolder: $("#esoc-social-reply-cs-shortcut-" + this.model.attributes.id +
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
    applyReplyEmoji: function (e) {
      if (this.model.attributes.id !== undefined) {
        this.$el.find(".emoji-wysiwyg-editor").remove();
        var _textArea = this.$el.find(".esoc-social-reply-data-textarea-" +
                                      this.model.attributes.id);
        _textArea.val(_textArea.val().replace(/&quot;/gi, "\""));
        var $wysiwyg   = _textArea.emojiarea({
              path: this.util.commonUtil.getEmojiPath(this.options.connector),
              wysiwyg: true,
              button: '.esoc-social-comment-emoticon-' + this.model.attributes.id,
              id: 'esoc-social-comment-reply-textarea-' + this.model.attributes.conversation_id,
              parent: this.$el.find("#esoc-social-edit-reply-icons-" + this.model.attributes.id),
              container: $("#esoc-social-comment-container"),
              util: this.util,
              widget: $(".esoc-social-comment-widget")
            }),
            _emojiArea = this.$el.find(".emoji-wysiwyg-editor");
        _textArea.hide();
        _emojiArea.hide();
        _emojiArea.addClass("esoc-reply-emoji-comment").attr({
          "id": "esoc-social-comment-reply-list-" + this.model.attributes.id,
          "data-text": this.templateHelpers().messages.writeAComment
        });
        var replyData = _emojiArea.html();
        replyData = this.util.commonUtil.onClickableUrl(replyData);
        this.$el.find('.esoc-social-reply-data').html(replyData);
        this.$el.find('[class*="esoc-social-reply-comment-data"]').html(replyData);
        _emojiArea.html(_emojiArea.html().replace(/\n/gi, "<br>"));
      }
      var suggestionOptions = {
        context: this.options.context,
        connector: this.options.connector,
        element: this.$el.find("#esoc-social-comment-reply-list-" + this.model.attributes.id),
        appendToElement: this.$el.find("[id^='esoc-suggestion-reply-item_']")
      };
      this.util.triggerAutoCompleteSuggestion(suggestionOptions);
    },
    onEmojiPress: function (e) {
      if (this.model.attributes.id !== undefined) {
        this.util.hidePopover(this.$el.find('.esoc-social-comment-emoticon-' +
                                            this.model.attributes.id));
      }
      e.stopPropagation();
    },
    onAttachementPress: function (e) {
      this.$el.find(".emoji-menu").hide();
    },
    onReplyEditEmojiMentionMouseClick: function (event) {
      this.util.setCursorPositionAtStartOFMention(event);
    },
    inactivateUnsupportedSubType: function (objModel) {
      if (!!objModel.collection) {
        this.attachmentModel = this.util.commonUtil.buildNodeModel(objModel,
            this.options.connector, true);

        if (this.options.parentCollectionView.defaultActionController) {
          if (!this.options.parentCollectionView.defaultActionController.hasAction(
                  this.attachmentModel)) {
            var inactiveClass = 'esoc-social-comment-inactive';
            this.$el.find("#esoc-social-reply-attachment-" + this.model.attributes.id +
                          " .esoc-social-attachment-name").addClass(inactiveClass);
            this.$el.find("#esoc-social-reply-attachment-" + this.model.attributes.id +
                          " .esoc-social-attachment-icon").addClass(inactiveClass);
          }
        }
      }
    }

  });
  return ReplyListItem;
});
