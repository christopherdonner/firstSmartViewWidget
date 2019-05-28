/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/lib/handlebars",
  'csui/utils/url',
  'csui/utils/contexts/factories/user',
  'csui/utils/user.avatar.color',
  'csui/utils/contexts/factories/connector',
  "csui/controls/mixins/keyboard.navigation/modal.keyboard.navigation.mixin",
  "i18n!esoc/widgets/socialactions/nls/lang",
  "hbs!esoc/widgets/socialactions/commentsheadertemplate",
  "esoc/widgets/socialactions/util",
  "esoc/widgets/socialactions/comment.model",
  "esoc/widgets/socialactions/mentions",
  "esoc/lib/jquery.emojiarea/jquery.emojiarea.custom",
  "esoc/lib/jquery.emojiarea/packs/custom/emojis",
  'css!esoc/lib/jquery.emojiarea/jquery.emojiarea.css',
  'css!esoc/lib/jquery.emojiarea/jquery.emojiarea.custom.css',
  "csui/lib/binf/js/binf"
], function ($, _, Backbone, Marionette, Handlebars, Url, UserModelFactory, UserAvatarColor, ConnectorFactory,
    ModalKeyboardNavigationMixin, lang, CommentsHeaderTemplate, Util, Comment, Mentions,
    EmojisArea, Emojis) {
  var self = null;
  var CommentsHeaderView = Marionette.ItemView.extend({
    initialize: function (options) {
      this.options = options;
      this.options.connector = this.options.connector ||
                               this.options.context.getObject(ConnectorFactory);
      self = this;
    },
    options: {},
    _elements: {
      csuiSocialCommentInput: null,
      csuiSocialSubmitButton: null,
      csuiSocialButtonsContainer: null,
      csuiSocialAvatarIcon: null,
      csuiSocialFormContainer: null,
      csuiSocialCommentInputHolder: null,
      csuiSocialCommentInputHiddenData: null,
      csuiSocialFormWarning: null,
      csuiSocialCommentShortcut: null,
      csuiSocialCommentAttachmentName: null,
      csuiSocialCommentAttachmentSize: null,
      csuiSocialCommentAttachmentIcon: null,
      csuiSocialCommentAttachmentPopupTitle: null,
      csuiSocialCommentAttachmentPopupContent: null,
      csuiSocialCommentDiv: null
    },
    textareaScrollThresh: 45,
    tagName: "div",
    util: Util,
    emojis: Emojis,
    emojiarea: new EmojisArea(),
    mentions: Mentions,
    template: CommentsHeaderTemplate,
    templateHelpers: function () {
      var messages = {
        comments: lang.comments,
        commentBlank: lang.commentBlank,
        post: lang.post,
        posting: lang.posting,
        writeAComment: lang.writeAComment,
        loadingComments: lang.loadingComments,
        confirmationText1: lang.confirmationText1,
        confirmationText2: lang.confirmationText2,
        cancel: lang.cancel,
        deleteComment: lang.deleteComment,
        deleteCommentheader: lang.deleteCommentheader,
        close: lang.close,
        emoticon: lang.emoticon,
        attachFile: lang.attachFile
      }
      this.uniqueId = _.uniqueId();
      messages = $.extend(this.options.socialActions, messages); // TODO: Need to handle with comment widget header model... decision pending whether we need to refresh the complete comments list or append on top the list.
      return {
        messages: messages
      };
    },
    events: {
      "keydown .esoc-social-attachment-file": "_refreshtabs",
      "click #esoc-social-comment-create-container": "onCommentDialogClick",
      "touchstart #esoc-social-comment-create-container": "onCommentDialogClick",
      "focus .esoc-header-emoji": "onCommentFormFocus",
      "click .esoc-header-emoji": "onCommentInputFocus",
      "click #esoc-social-comment-submit": "onCommentFormSubmit",
      "input .esoc-header-emoji": "onCommentFormKeypress",
      "click #esoc-social-comment-close-button": "onCloseButton",
      "keydown #esoc-social-comment-close-button": "onClickWithSpaceKey",
      "click #esoc-social-comment-emoticon": "onEmojiPress",
      "keydown #esoc-social-comment-emoticon": "onClickWithSpaceKey",
      "click .esoc-social-comment-attachment": "onAttachementPress",
      "keydown .esoc-social-comment-attachment": "onClickWithSpaceKey",
      "change #esoc-social-comment-input": "onCommentChange",
      "keyup .esoc-header-emoji": "onCommentEmojiKeypress",
      "mousedown .esoc-header-emoji .esoc-user-mention": "onCommentEmojiMentionMouseDown",
      "keydown .esoc-social-attachment-cs": "onCSAttachmentKeyDown",
      "keydown .esoc-social-attachment-desktop": "onDesktopAttachmentKeyDown"
    },
    onClickWithSpaceKey: function (e) {
      Util.applySpaceKeyEvent(e);
    },
    onCSAttachmentKeyDown: function (e) {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 9 && e.shiftKey) {
        $(e.target.closest(".binf-popover")).binf_popover('hide');
      }
    },
    onDesktopAttachmentKeyDown: function (e) {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 9 && !e.shiftKey) {
        $(e.target.closest(".binf-popover")).binf_popover('hide');
      }
    },
    onRender: function (e) {
      this._elements.csuiSocialCommentInput = this.$el.find("#esoc-social-comment-input");
      this._elements.csuiSocialCommentInputHiddenData = this.$el.find(
          ".esoc-social-add-comment-data");
      this._elements.csuiSocialSubmitButton = this.$el.find("#esoc-social-comment-submit");
      this._elements.csuiSocialButtonsContainer = this.$el.find(
          "#esoc-social-textinput-button-holder");
      this._elements.csuiSocialAvatarIcon = this.$el.find("#esoc-social-comment-avatar");
      this._elements.csuiSocialFormContainer = this.$el.find("#esoc-social-comment-form-container");
      this._elements.csuiSocialFormWarning = this.$el.find(".esoc-social-warning");
      this._elements.csuiSocialCommentShortcut = this.$el.find("#esoc-social-comment-cs-shortcut");
      this._elements.csuiSocialCommentAttachmentName = this.$el.find(
          "#esoc-social-comment-header-attachment-name");
      this._elements.csuiSocialCommentAttachmentSize = this.$el.find(
          "#esoc-social-comment-header-attachment-size");
      this._elements.csuiSocialCommentAttachmentIcon = this.$el.find(
          "#esoc-social-comment-attachment");
      this._elements.csuiSocialCommentAttachmentPopupTitle = this.$el.find(
          "#esoc-social-selected-attachment-dialog-title");
      this._elements.csuiSocialCommentAttachmentPopupContent = this.$el.find(
          "#esoc-social-selected-attachment-dialog");
      this._elements.csuiSocialSubmitButton.hide();
      this._elements.csuiSocialButtonsContainer.hide();
      var attachmentPopOverArgs = {
        socialActions: this.options.socialActions,
        id: "comment",
        uniqueId: this.uniqueId,
        desktopAttachmentInputId: "esoc-social-comment-desktop-attachment",
        shortcutIdHolder: this._elements.csuiSocialCommentShortcut,
        connector: this.options.connector
      };
      this.util.showAttachmentPopOver(this._elements.csuiSocialCommentAttachmentIcon,
          attachmentPopOverArgs);
      this._elements.csuiSocialCommentAttachmentIcon.attr("title", lang.attachFile);
      this.onCommentFormBlur();
      var that = this;
      $(window).on("resize", function (e) {
        that.adjustCommentAreaWidth(e, true);
      });
    },

    _refreshtabs: function () {
      this.triggerMethod('dom:refresh');
    },
    onCommentDialogClick: function (e) {
      if (!(e.target.id === 'esoc-social-comment-header' ||
            e.target.id === 'esoc-social-comment-emoticon' ||
            e.target.id === 'esoc-social-comment-attachment' ||
            e.target.id === 'esoc-social-comment-desktop-attachment' ||
            $(e.target).parents('#esoc-social-comment-header').length > 0 ||
            $(e.target).closest('.binf-popover').length > 0 ||
            e.target.id === 'esoc-social-comment-submit')) {
        this.onCommentFormBlur(e);
      }
      var commentContainer = $("#esoc-social-comment-container").find(
          ".esoc-social-comment-list-item");
      if (!($(e.target.parentNode).hasClass("esoc-social-attachment-cs")) &&
          !($(e.target.parentNode).hasClass("esoc-social-attachment-desktop")) &&
          !($(e.target).hasClass("esoc-social-attachment-file-alone")) &&
          !($(e.target).hasClass("esoc-social-comment-attachment")) &&
          !($(e.target).hasClass("esoc-social-comment-emoticon")) &&
          !$((e.target.parentNode.parentNode)).hasClass("myemoji") &&
          !$(e.target).hasClass("esoc-social-attachment-file")) {
        setTimeout(function () {
          $(commentContainer).removeClass("status-attachment-alone-init-min-height");
          $(commentContainer).removeClass("esoc-attachment-init-min-height").removeClass(
              "esoc-emoji-init-min-height");
          $("#esoc-social-comment-container").find(".esoc-social-comment-list-item").removeClass(
              "esoc-edit-init-min-height").removeClass("status-attachment-init-min-height");
        }, 100);
      }
    },
    onShow: function (e) {
      this.addFocus(e);
      this.applyReplyEmoji();
      $("[id^='esoc-social-comment-widget-pointer']").on("click", function (e) {
        self.onCommentDialogClick(e);
      });
      this._elements.csuiSocialCommentDiv = this.$el.find(".esoc-header-emoji");
      var that = this;
      $("#esoc-social-comment-header").on("paste", function (e) {
        var maxCharters           = that.util.commonUtil.globalConstants.MAX_CHAR_LIMIT,
            existingCommentLength = $("#esoc-social-comment-input").val().length;
        that.util.commonUtil.onCommentFormPaste(e, existingCommentLength, maxCharters);
        $("#esoc-social-comment-input").innerHTML = ($("#esoc-social-comment-header").html());
        that.onCommentChange(e);
      });

      $("#esoc-social-comment-header").off("mouseleave").on("mouseleave", function (e) {
        self.onCommentFormMouseLeave(e);
      });
      this.util.commonUtil.preventDrop($(".esoc-header-emoji"));
      setTimeout(function () {
        $("#esoc-social-comment-header").focus();
        that.engageModalKeyboardFocusOnOpen(that.el);
      }, 1000);
      this.user = this.options.context.getModel(UserModelFactory);
      this.listenTo(this.model, 'sync', function () {
        if (!!this.user && !!this.user.get('id')) {
          this.updateUserProfilePicture(this.user.get('id'), this.user);
        }
      });
    },
    addFocus: function (e) {
      $(".cs-expanded.activityfeed-expand.esoc.cs-dialog.binf-modal.binf-fade.binf-in").removeAttr(
          'tabindex').attr("disabled", "true");
      $("[id^='esoc-social-comment-widget-mask_']").attr('tabindex', '-1');
      $(".cs-expanded.activityfeed-expand.esoc.cs-dialog.binf-modal.binf-fade.binf-in").removeAttr(
          'tabindex').removeAttr("disabled");
    },
    onCommentFormMouseLeave: function (e) {
      this._elements.csuiSocialCommentInput[0].innerHTML = this._elements.csuiSocialCommentInput.val();
    },
    updateUserProfilePicture: function (userId, user) {
      var initials = user.get('initials');
      var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(user.attributes);
      if (userId !== undefined && userId !== "") {
        var commentAvatar = this.$el.find("#esoc-social-comment-avatar"),
            defaultAvatar = this.$el.find("#esoc-social-default-avatar");
        defaultAvatar[0].innerText = initials;
        commentAvatar.addClass("esoc-userprofile-img-" + userId);
        defaultAvatar.addClass("esoc-user-default-avatar-" + userId);
        defaultAvatar.css('background', userbackgroundcolor);
        var userProfilePicOptions = {
          userid: userId,
          context: this.options.context,
          photoElement: commentAvatar,
          defaultPhotElement: defaultAvatar
        };
      }
      this.util.commonUtil.setProfilePic(userProfilePicOptions);
    },
    onCommentInputFocus: function (e) {
      this.$el.find(".esoc-header-emoji").focus();
    },
    onCommentFormFocus: function (e) {
      var commentValue = this._elements.csuiSocialCommentInput.val().trim();
      if (commentValue !== undefined && commentValue !== '') {
        this.$el.find('#esoc-social-comment-submit').removeAttr('disabled');
      } else {
        this.$el.find('#esoc-social-comment-submit').attr('disabled', true);
      }
      e.stopPropagation();
      this.$el.find(".esoc-header-emoji").addClass("emoji-wysiwyg-editor-focus");
      this._elements.csuiSocialButtonsContainer.css({display: "block"});
      if (this.util.commonUtil.isIE() && this.$el.find(".esoc-header-emoji").length > 0 &&
          this.$el.find(".esoc-header-emoji")[0].textContent.length === 0) {
        this.$el.find(".esoc-header-emoji").attr("data-text", "");
      }
      if (!this.options.socialActions.attachementsEnabled &&
          !this.options.socialActions.shortcutsEnabled) {
        this._elements.csuiSocialButtonsContainer.addClass(
            "esoc-social-textinput-without-attachment");
        this.$el.find(".esoc-header-emoji").addClass("esoc-social-input-when-no-attachment");
        this._elements.csuiSocialCommentInputHiddenData.addClass(
            "esoc-social-input-when-no-attachment");
      }
      this._elements.csuiSocialButtonsContainer.animate({opacity: 1.0}, 0);
      this._elements.csuiSocialAvatarIcon.animate({opacity: 1.0}, 0);
      this._elements.csuiSocialButtonsContainer.show();
      this._elements.csuiSocialSubmitButton.show();
      var adjustWidth = (this.$el.find(".esoc-header-emoji").html() === "" ||
                         this.$el.find(".esoc-header-emoji").html() === "<br>") ? true : false;
      this.adjustCommentAreaWidth(e, adjustWidth);
      if (this.$el.find(".esoc-social-attachment-popover").is(':visible')) {
        this._elements.csuiSocialCommentAttachmentIcon.binf_popover('hide');
        $(".esoc-social-comment-dialog-att-minheight").removeClass(
            "esoc-social-comment-dialog-att-minheight");
        $(".esoc-social-comment-dialog-minheight").removeClass(
            "esoc-social-comment-dialog-minheight");
        this.util.setCommentDialogPointer();
      }
    },
    adjustCommentAreaWidth: function (e, adjustWidth) {
      var commentElement = this.$el.find(".esoc-header-emoji");
      if (adjustWidth) {
        commentElement.css("width", "");
        commentElement.width(this.$el.find(".esoc-header-emoji").width() -
                             parseInt(
                                 this.$el.find("#esoc-social-comment-submit").outerWidth() + 14,
                                 10));
        this.$el.find("#esoc-suggestion-comment-header").width(commentElement.outerWidth());
      }
    },
    onCommentFormBlur: function (e) {
      if (!this.$el.find(".esoc-social-comment-form-mask").is(':visible')) {
        var commentString    = this._elements.csuiSocialCommentInput.val(),
            contentDivString = this.$el.find(".esoc-header-emoji").html(),
            desktopDoc       = this.$el.find("#esoc-social-comment-desktop-attachment"),
            attachedFile,
            shortcutVal;
        if (desktopDoc.length > 0 && desktopDoc[0].files && desktopDoc[0].files.length > 0) {
          attachedFile = desktopDoc[0].files[0];
        }
        if (this.util.isValidInput(this._elements.csuiSocialCommentShortcut)) {
          shortcutVal = parseInt(this._elements.csuiSocialCommentShortcut.val(), 10);
        }
        if ((commentString === undefined || commentString === '') &&
            (attachedFile === undefined || attachedFile === '') && shortcutVal === undefined &&
            (contentDivString === undefined || contentDivString === '' ||
             contentDivString === "<br>")) {
          this._elements.csuiSocialAvatarIcon.animate({opacity: 0.3}, 0);
          if (this.options.socialActions !== undefined &&
              !this.options.socialActions.attachementsEnabled &&
              !this.options.socialActions.shortcutsEnabled) {
            this._elements.csuiSocialButtonsContainer.removeClass(
                "esoc-social-textinput-without-attachment");
            this.$el.find(".esoc-header-emoji").removeClass("esoc-social-input-when-no-attachment");
            this._elements.csuiSocialCommentInputHiddenData.removeClass(
                "esoc-social-input-when-no-attachment");
          }
          this.$el.find(".esoc-header-emoji").removeClass("emoji-wysiwyg-editor-focus");
          this._elements.csuiSocialButtonsContainer.hide();
          this._elements.csuiSocialSubmitButton.hide();
          this._elements.csuiSocialButtonsContainer.animate({opacity: 0.0}, 0, function () {
            $(this).css({display: "none"});
          });
          this.$el.find(".esoc-header-emoji").css("width", "95%");
          $("#esoc-social-comment-header").removeClass("emoji-wysiwyg-editor-focus").blur();
          if (this.util.commonUtil.isIE() && this.$el.find(".esoc-header-emoji").length > 0 &&
              this.$el.find(".esoc-header-emoji")[0].textContent.length === 0) {
            $(".esoc-header-emoji").attr("data-text",
                this.templateHelpers().messages.writeAComment);
          }
          if (this._elements.csuiSocialCommentAttachmentIcon.attr("data-binf-original-title") &&
              this._elements.csuiSocialCommentAttachmentIcon.attr(
                  "data-binf-original-title").length >
              0) {
            this.util.hideAttachmentPopup(this._elements.csuiSocialCommentAttachmentIcon,
                this.$el.find("#esoc-social-comment-desktop-attachment"),
                this.options.socialActions);
          }
        }
      }
    },
    onCommentChange: function (event) {
      var commentValue = this._elements.csuiSocialCommentInput.val().trim();
      if (commentValue !== undefined && commentValue !== '') {
        this.$el.find('#esoc-social-comment-submit').removeAttr('disabled');
      } else {
        this.$el.find('#esoc-social-comment-submit').attr('disabled', true);
      }
      this.triggerMethod('dom:refresh');
      var commentString = this._elements.csuiSocialCommentInput.val(),
          _e            = event || window.event,
          maxCharLimit  = this.util.commonUtil.globalConstants.MAX_CHAR_LIMIT;
      if (commentString.length > maxCharLimit) {
        var commentStr = commentString.substr(0, maxCharLimit);
        this._elements.csuiSocialCommentInput[0].innerHTML = commentStr;
        this._elements.csuiSocialCommentInputHiddenData.val(commentStr);
        this.$el.find("#esoc-social-comment-header").html("")[0].textContent = commentStr;
        this.util.commonUtil.addEmoji(this.$el.find("#esoc-social-comment-header"), false,
            this.options.connector);
        this.$el.find("#esoc-social-comment-header").focus();
        this.util.commonUtil.placeCaretAtEnd(this.$el.find("#esoc-social-comment-header"));
        _e.preventDefault();
        this.util.setCommentDialogPointer();
      }
    },
    onCommentFormSubmit: function (e) {
      e.stopPropagation();
      e.preventDefault();
      this._elements.csuiSocialCommentAttachmentIcon.binf_popover('hide');
      var commentValue = this._elements.csuiSocialCommentInput.val().trim(),
          that         = this,
          formData     = new FormData(),
          desktopDoc   = this.$el.find("#esoc-social-comment-desktop-attachment"),
          attachedFile,
          shortcutVal;
      if (desktopDoc.length > 0) {
        attachedFile = desktopDoc[0].files[0];
      }
      if (this._elements.csuiSocialCommentShortcut.val().length > 0) {
        shortcutVal = parseInt(this._elements.csuiSocialCommentShortcut.val(), 10);
      }
      if (commentValue.length) {
        this.$el.find('.esoc-social-comment-form-mask').show();
        this.$el.find('#esoc-social-comment-submit').html(lang.posting);
        this.adjustCommentAreaWidth(e, true);
        this.util.showMask(this.$el.find('.esoc-social-comment-form-mask'));
        this._elements.csuiSocialCommentInput.val("");
        if (shortcutVal) {
          formData.append("ATT_ID", shortcutVal);
        }
        else if (attachedFile) {
          formData.append("AddDesktopDoc", attachedFile);
        }
        formData.append("status", commentValue);
        formData.append("eventtype", 1);
        if (this.options.statusInfo && this.options.statusInfo.getStatusUrl) {
          formData.append("in_reply_to_status_id", this.options.statusInfo.conversation_id);
        } else {
          formData.append("in_comment_on_obj_id", this.options.nodeID);
        }
        new Comment({}, {
          connector: this.model.connector
        }).save({}, {
          wait: true,
          data: formData,
          currentNodeModel: this.model.currentNodeModel,
          success: this.onCommentSubmitSuccess.bind(this),
          error: this.onCommentSubmitFailure.bind(this, desktopDoc)
        });
      }

      if (commentValue === undefined || commentValue === '') {
        this.$el.find("#esoc-social-comment-header").focus();
      } else {
        this.util.resetAttachmentInput(desktopDoc, this.options.socialActions);
        this._elements.csuiSocialCommentShortcut.val("");
      }
    },
    removeMask: function (e) {
      self.$el.find('#esoc-social-comment-submit').html(lang.post);
      self.adjustCommentAreaWidth(e, true);
      self.util.hideMask(self.$el.find('.esoc-social-comment-form-mask'));
      self.$el.find('.esoc-social-comment-form-mask').hide();
    },
    onCommentSubmitFailure: function (desktopDoc, model, response/*, options*/) {
      this._elements.csuiSocialCommentShortcut.val("");
      this.$el.find(".esoc-header-emoji").html("");
      this.removeMask();
      this.util.hideAttachmentPopup(this._elements.csuiSocialCommentAttachmentIcon,
          desktopDoc, this.options.socialActions);
      var args = {
        parent: ".esoc-social-comment-widget",
        errorContent: response.responseJSON ?
                      (response.responseJSON.errorDetail ? response.responseJSON.errorDetail :
                       response.responseJSON.error) : lang.defaultErrorMessageCommentSubmit
      }
    },
    onCommentSubmitSuccess: function (model, response/*, options*/) {
      self.options.commentAction = true;
      var totalComments = response.commentCount;
      if (totalComments === undefined) {
        totalComments = self.model.length + 1;
      }
      if (self.options.tablecellwidget) {
        self.util.commonUtil.updateCommentCount({
          currentNodeModel: self.options.currentNodeModel,
          commentCount: totalComments
        });
      }
      self.$el.find(".esoc-header-emoji")[0].textContent = "";
      self.removeMask();
      self.onCommentFormBlur();
      var collectionModelPosition = 0;
      if (self.options.statusInfo && self.options.statusInfo.getStatusUrl) {
        collectionModelPosition = 1;
      }
      self.util.resetAttachmentInput(self.$el.find("#esoc-social-comment-desktop-attachment"),
          self.options.socialActions);
      self._elements.csuiSocialCommentShortcut.val("");
      self._elements.csuiSocialCommentAttachmentIcon.binf_popover('hide');
      self.$el.find("#esoc-social-comment-input").text("").height("").blur();
      self.$el.find("#esoc-social-comment-form-container").height("");
      self.$el.find("#esoc-social-comment-warning").hide();
      self.$el.find("#esoc-social-comment-container").scrollTop(0);
      self.$el.find(".esoc-header-emoji").html("").blur();
      var collection = self.model;
      if (collection.length > collectionModelPosition) {
        var lastRenderedModelId = collection.at(collectionModelPosition).id;
        delete collection.defaults.params[self.util.commonUtil.globalConstants.MAX_ID];
        collection.defaults.params[self.util.commonUtil.globalConstants.SINCE_ID] = lastRenderedModelId;
        collection.fetch({remove: false, at: collectionModelPosition});
      } else {
        if (collection.length === 0) {
          delete collection.defaults.params[self.util.commonUtil.globalConstants.MAX_ID];
        }
        collection.fetch({});
      }
      self.$el.find(".comments-list").scrollTop(0);
      setTimeout(function () {
        self.$el.find("#esoc-social-comment-header").focus();
      }, 200);
      self.$el.find('#esoc-social-comment-submit').attr('disabled', true);
      this.trigger('dom:refresh');
    },
    onCloseButton: function (e) {
      $("[id^='esoc-social-comment-widget-mask_']").removeAttr('tabindex');
      $(".cs-expanded.activityfeed-expand.esoc.cs-dialog.binf-modal.binf-fade.binf-in").attr(
          'tabindex', '-1');
      $(".esoc-user-widget-dialog.cs-dialog.binf-modal.binf-fade.binf-in").attr('tabindex',
          '-1').removeAttr("disabled");
      var element = this.options.currentTarget;
      if (element) {
        element.focus();
        setTimeout(function () {
          element.focus();
        }, 1);
      }
      $(document).unbind("keyup");
      this.util.commonUtil.unbindWidget(this.options);
      this.disengageModalKeyboardFocusOnClose();
      $(".esoc-acitivityfeed-collection").css("overflow", "");
    },
    onEmojiPress: function (e) {
      var _editor = this._elements.csuiSocialCommentDiv;
      this.util.hidePopover(_editor);
      var baseElementPosition = $(this.options.baseElement).offset(),
          editorPosition      = _editor.offset();
      if (parseInt(baseElementPosition.top - editorPosition.top, 10) < 150) {
        $(".esoc-social-comment-dialog-att-minheight").removeClass(
            "esoc-social-comment-dialog-att-minheight");
        $(".esoc-social-comment-widget").addClass("esoc-social-comment-dialog-minheight");
        this.util.setCommentDialogPointer();
      }
      e.stopPropagation();
    },
    onAttachementPress: function (e) {
      this.$el.find(".emoji-menu").hide();
      $(".esoc-social-comment-widget").removeClass("esoc-social-comment-dialog-minheight");
      this.util.setCommentDialogPointer();
    },
    applyReplyEmoji: function (e) {
      this.$el.find(".emoji-wysiwyg-editor").remove();
      this.$el.find('#esoc-social-comment-input').emojiarea({
        path: this.util.commonUtil.getEmojiPath(this.options.connector),
        wysiwyg: true,
        button: '.esoc-social-comment-header-emotion',
        id: 'esoc-social-comment-header',
        parent: this.$el.find("#esoc-social-textinput-button-holder"),
        util: this.util,
        widget: $(".esoc-social-comment-widget")
      });
      this.$el.find(".emoji-wysiwyg-editor").addClass("esoc-header-emoji").attr({
        "id": "esoc-social-comment-header",
        "data-text": this.templateHelpers().messages.writeAComment
      });
      this.listenToOnce(this.model, 'sync', function () {
        var suggestionOptions = {
          context: this.options.context,
          connector: this.options.connector,
          element: this.$el.find("#esoc-social-comment-header"),
          appendToElement: this.$el.find("#esoc-suggestion-comment-header")
        };
        this.util.triggerAutoCompleteSuggestion(suggestionOptions);
        this.$el.find(".emoji-wysiwyg-editor").removeAttr("autocomplete");
      });
    },
    onCommentEmojiKeypress: function (event) {
      this.util.onMentionNameEdit(event);
    },
    onCommentEmojiMentionMouseDown: function (event) {
      this.util.setCursorPositionAtStartOFMention(event);
    }
  });
  ModalKeyboardNavigationMixin.mixin(CommentsHeaderView.prototype);
  return CommentsHeaderView;
});
