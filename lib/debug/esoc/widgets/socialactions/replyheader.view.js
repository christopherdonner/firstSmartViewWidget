csui.define([
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/lib/handlebars",
  "csui/utils/base",
  "csui/utils/contexts/factories/connector",
  "esoc/widgets/socialactions/reply.model",
  "esoc/widgets/socialactions/util",
  "hbs!esoc/widgets/socialactions/replytemplate",
  "i18n!esoc/widgets/socialactions/nls/lang"
], function ($, _, Backbone, Marionette, Handlebars, Base, ConnectorFactory, Reply, Util, ReplyTemplate, lang) {
  var self = null;
  var ReplyHeaderView = Marionette.ItemView.extend({
    initialize: function (options) {
      this.options = options;
      this.options.connector = this.options.connector ||
                               this.options.context.getObject(ConnectorFactory);
      self = this;
    },
    options: {},
    base: Base,
    util: Util,
    _elements: {
      csuiSocialReplyInput: null,
      csuiSocialReplyInputHolder: null,
      csuiSocialReplySubmitButton: null,
      csuiSocialButtonsContainer: null,
      csuiSocialFormContainer: null,
      csuiSocialFormWarning: null,
      csuiSocialReplyHiddenData: null,
      csuiSocialReplyAttachmentPopupContent: null,
      csuiSocialReplyAttachmentPopupTitle: null,
      csuiSocialReplyShortcut: null
    },
    tagName: "div",
    template: ReplyTemplate,
    templateHelpers: function () {
      var messages = {
        post: lang.post,
        posting: lang.posting,
        writeAComment: lang.writeAComment,
        attachFile: lang.attachFile,
        replyId: this.options.item_id,
        emoticon: lang.emoticon
      }

      this.uniqueId = _.uniqueId();
      messages = $.extend(this.options.socialActions, messages);
      return {
        messages: messages
      };
    },
    events: {
      "click #esoc-social-reply-submit": "onReplyFormSubmit",
      "focus .esoc-reply-emoji": "onReplyFormFocus",
      "click .esoc-reply-emoji": "onReplyInputFocus",
      "input .esoc-reply-emoji": "onReplyFormKeypress",
      "click #esoc-social-reply-comment-emoticon": "onEmojiPress",
      "click .esoc-social-comment-attachment": "onAttachementPress",
      "keyup .esoc-reply-emoji": "onReplyFormKeypress",
      "change .esoc-social-reply-input": "onReplyFormKeypress",
      "mousedown .esoc-reply-emoji .esoc-user-mention": "onReplyEmojiMentionMouseClick"
    },
    onRender: function (e) {
      this._elements.csuiSocialReplyInput = this.$el.find("#esoc-social-reply-input-" +
                                                          this.options.item_id);
      this._elements.csuiSocialEmojiInput = this.$el.find(".esoc-reply-emoji");
      this._elements.csuiSocialReplyInputHolder = this.$el.find("#esoc-social-reply-input-holder");
      this._elements.csuiSocialReplySubmitButton = this.$el.find("#esoc-social-reply-submit");
      this._elements.csuiSocialButtonsContainer = this.$el.find(
          "#esoc-social-textinput-button-holder-reply");
      this._elements.csuiSocialFormContainer = this.$el.find("#esoc-social-reply-form-container");
      this._elements.csuiSocialFormWarning = this.$el.find(".esoc-social-warning");
      this._elements.csuiSocialReplyHiddenData = this.$el.find(".esoc-social-reply-data");
      this._elements.csuiSocialReplyShortcut = this.$el.find("#esoc-social-reply-cs-shortcut");
      this._elements.csuiSocialReplyAttachmentName = this.$el.find(
          "#esoc-social-reply-attachment-name");
      this._elements.csuiSocialReplyAttachmentSize = this.$el.find(
          "#esoc-social-reply-attachment-size");
      this._elements.csuiSocialReplyAttachmentIcon = this.$el.find("#esoc-social-reply-attachment");
      this._elements.csuiSocialReplyAttachmentPopupTitle = this.$el.find(
          "#esoc-social-reply-selected-attachment-dialog-title");
      this._elements.csuiSocialReplyAttachmentPopupContent = this.$el.find(
          "#esoc-social-reply-selected-attachment-dialog");

      if (this.options.canReply) {
        this._elements.csuiSocialFormContainer.show();
      } else {
        this._elements.csuiSocialFormContainer.hide();
      }
      this._elements.csuiSocialReplySubmitButton.hide();
      var attachmentPopOverArgs = {
        socialActions: this.options.socialActions,
        id: "reply",
        uniqueId: this.uniqueId,
        desktopAttachmentInputId: "esoc-social-reply-desktop-attachment",
        shortcutIdHolder: this._elements.csuiSocialReplyShortcut,
        connector: this.options.connector
      };
      this.util.showAttachmentPopOver(this._elements.csuiSocialReplyAttachmentIcon,
          attachmentPopOverArgs);
      this._elements.csuiSocialReplyAttachmentIcon.attr("title", lang.attachFile);
      $(".esoc-social-comment-widget").off("mousedown touchstart").on("mousedown touchstart",
          function (e) {
            self.onCommentDialogClick(e);
          });
      this.onReplyFormBlur();
    },
    onShow: function (e) {
      this.applyemoji(e);
      $("[id^='esoc-social-comment-widget-pointer']").on("click", function (e) {
        self.onCommentDialogClick(e);
      });
      var that = this;
      $("#esoc-social-comment-reply-header").on("paste", function (e) {
        var maxCharters         = that.util.commonUtil.globalConstants.MAX_CHAR_LIMIT,
            existingReplyLength = $("#esoc-social-reply-input-" +
                                    that.options.conversation_id).val().length;
        that.util.commonUtil.onCommentFormPaste(e, existingReplyLength, maxCharters);
        $("#esoc-social-reply-input-" +
          that.options.conversation_id).innerHTML = ($("#esoc-social-comment-reply-header").html());
        that.onReplyFormKeypress(e);
      });

      $("#esoc-social-comment-reply-header").on("mouseleave", function (e) {
        self.onCommentFormMouseLeave(e);
      });
      this.util.commonUtil.preventDrop($(".esoc-reply-emoji"));
    },
    onCommentDialogClick: function (e) {
      if (!(e.target.id === 'esoc-social-comment-reply-header' ||
            e.target.id === 'esoc-social-reply-comment-emoticon' ||
            e.target.id === 'esoc-social-reply-attachment' ||
            e.target.id === 'esoc-social-reply-desktop-attachment' ||
            $(e.target).parents('#esoc-social-comment-reply-header').length > 0 ||
            $(e.target).closest('.binf-popover').length > 0 ||
            e.target.id === 'esoc-social-reply-submit')) {
        this.onReplyFormBlur();
      }
    },
    onCommentFormMouseLeave: function (e) {
      this.$el.find("#esoc-social-reply-input-" +
                    this.options.item_id)[0].innerHTML = this.$el.find("#esoc-social-reply-input-" +
                                                                       this.options.item_id).val();
    },
    onReplyInputFocus: function (e) {
      this.$el.find(".esoc-reply-emoji").focus();
    },
    onReplyFormFocus: function (e) {
      var replyValue = this._elements.csuiSocialReplyInput.val().trim();
      if (replyValue !== undefined && replyValue !== '') {
        this.$el.find('#esoc-social-reply-submit').removeAttr('disabled');
      } else {
        this.$el.find('#esoc-social-reply-submit').attr('disabled', true);
      }
      e.stopPropagation();
      e.preventDefault();
      this.$el.find(".esoc-reply-emoji").addClass("emoji-wysiwyg-editor-focus");
      this._elements.csuiSocialButtonsContainer.css({display: "block"});
      if (this.util.commonUtil.isIE() && this.$el.find(".esoc-reply-emoji").length > 0 &&
          this.$el.find(".esoc-reply-emoji")[0].textContent.length === 0) {
        this.$el.find(".esoc-reply-emoji").attr("data-text", "");
      }
      this._elements.csuiSocialButtonsContainer.animate({opacity: 1.0}, 0);
      this._elements.csuiSocialReplySubmitButton.show();
      if (!this.options.socialActions.attachementsEnabled &&
          !this.options.socialActions.shortcutsEnabled) {
        this._elements.csuiSocialButtonsContainer.addClass("esoc-social-icon-when-no-attachment");
        this._elements.csuiSocialReplyHiddenData.addClass("esoc-social-input-when-no-attachment");
        this.$el.find(".esoc-reply-emoji").addClass("esoc-social-input-when-no-attachment");
      }
      var adjustWidth = (this.$el.find(".esoc-reply-emoji").html() === "" ||
                         this.$el.find(".esoc-reply-emoji").html() === "<br>") ? true : false;
      this.adjustCommentAreaWidth(e, adjustWidth);
      if (this.$el.find(".esoc-social-attachment-popover").is(':visible')) {
        this._elements.csuiSocialReplyAttachmentIcon.binf_popover('hide');
      }
    },
    adjustCommentAreaWidth: function (e, adjustWidth) {
      var commentElement = this.$el.find(".esoc-reply-emoji");
      if (adjustWidth) {
        commentElement.css("width", "");
        commentElement.width(this.$el.find(".esoc-reply-emoji").width() -
                             parseInt(this.$el.find("#esoc-social-reply-submit").outerWidth() - 57,
                                 10));
        this.$el.find(".esoc-suggestion-reply-header").width(commentElement.outerWidth());
      }
    },
    onReplyFormBlur: function (e) {
      if (!this.$el.find(".esoc-social-comment-form-mask").is(':visible')) {
        var that = this;
        var replyString      = this.$el.find(
                "#esoc-social-reply-input-" + this.options.item_id).val(),
            contentDivString = this.$el.find(".esoc-reply-emoji").html(),
            desktopDoc       = this.$el.find("#esoc-social-reply-desktop-attachment"),
            attachedFile,
            shortcutVal;
        if (desktopDoc.length > 0 && desktopDoc[0].files && desktopDoc[0].files.length > 0) {
          attachedFile = desktopDoc[0].files[0];
        }
        if (this._elements.csuiSocialReplyShortcut.val().length > 0) {
          shortcutVal = parseInt(this._elements.csuiSocialReplyShortcut.val(), 10);
        }
        if ((replyString === undefined || replyString === '') &&
            (attachedFile === undefined || attachedFile === '') && shortcutVal === undefined &&
            (contentDivString === undefined || contentDivString === '' ||
             contentDivString === "<br>")) {
          this._elements.csuiSocialReplySubmitButton.hide();
          this._elements.csuiSocialButtonsContainer.hide();
          this._elements.csuiSocialButtonsContainer.animate({opacity: 0.0}, 0, function () {
            $(this).css({display: "none"});

          });
          $("#esoc-social-comment-reply-header").removeClass("emoji-wysiwyg-editor-focus").blur();
          if (this.util.commonUtil.isIE() && this.$el.find(".esoc-reply-emoji").length > 0 &&
              this.$el.find(".esoc-reply-emoji")[0].textContent.length === 0) {
            $(".esoc-reply-emoji").attr("data-text", this.templateHelpers().messages.writeAComment);
          }
          if (this._elements.csuiSocialReplyAttachmentIcon.attr("data-binf-original-title") &&
              this._elements.csuiSocialReplyAttachmentIcon.attr("data-binf-original-title").length > 0) {
            this.util.hideAttachmentPopup(this._elements.csuiSocialReplyAttachmentIcon,
                this.$el.find("#esoc-social-reply-desktop-attachment"), this.options.socialActions);
          }
          if (!this.options.socialActions.attachementsEnabled &&
              !this.options.socialActions.shortcutsEnabled) {
            this._elements.csuiSocialButtonsContainer.removeClass(
                "esoc-social-icon-when-no-attachment");
            this._elements.csuiSocialReplyHiddenData.removeClass(
                "esoc-social-input-when-no-attachment");
            this.$el.find(".esoc-reply-emoji").removeClass("esoc-social-input-when-no-attachment");
          }
        }
        var commentContainer = $("#esoc-social-comment-container").find(
            ".esoc-social-comment-list-item");
        if (commentContainer.length <= 1) {
          $(commentContainer).removeClass("").removeClass(
              "esoc-attachment-init-min-height esoc-emoji-init-min-height");
        }
      }

    },
    onReplyFormKeypress: function (event) {
      var replyValue = this._elements.csuiSocialReplyInput.val().trim();
      if (replyValue !== undefined && replyValue !== '') {
        this.$el.find('#esoc-social-reply-submit').removeAttr('disabled');
      } else {
        this.$el.find('#esoc-social-reply-submit').attr('disabled', true);
      }
      this.util.onMentionNameEdit(event);
      var replyTextAreaEle = this.$el.find("#esoc-social-reply-input-" + this.options.item_id);
      var replyString = replyTextAreaEle.val();
      var maxCharLimit = this.util.commonUtil.globalConstants.MAX_CHAR_LIMIT;
      var _e = event || window.event;
      if (replyString.length > maxCharLimit) {
        var replyStr = replyString.substr(0, maxCharLimit);
        replyTextAreaEle.val(replyStr);
        this.$el.find("#esoc-social-comment-reply-header").html("")[0].textContent = replyStr;
        this.util.commonUtil.addEmoji(this.$el.find("#esoc-social-comment-reply-header"), false,
            this.options.model.connector);
        this.util.commonUtil.placeCaretAtEnd(this.$el.find("#esoc-social-comment-reply-header"));
        _e.preventDefault();
      }
    },
    onReplyFormSubmit: function (e) {
      e.stopPropagation();
      e.preventDefault();
      this._elements.csuiSocialReplyAttachmentIcon.binf_popover('hide');
      var replyValue = this._elements.csuiSocialReplyInput.val().trim(),
          that       = this,
          formData   = new FormData(),
          desktopDoc = this.$el.find("#esoc-social-reply-desktop-attachment"),
          attachedFile,
          shortcutVal;
      if (desktopDoc.length > 0) {
        attachedFile = desktopDoc[0].files[0];
      }
      if (this._elements.csuiSocialReplyShortcut.val().length > 0) {
        shortcutVal = parseInt(this._elements.csuiSocialReplyShortcut.val(), 10);
      }
      if (replyValue.length) {
        this.$el.find('.esoc-social-reply-form-mask').show();
        this.$el.find('#esoc-social-reply-submit').html(lang.posting);
        this.adjustCommentAreaWidth(e, true);
        this.util.showMask(this.$el.find('.esoc-social-reply-form-mask'));
        this._elements.csuiSocialReplyInput.val("");
        if (shortcutVal) {
          formData.append("ATT_ID", shortcutVal);
        }
        else if (attachedFile) {
          formData.append("AddDesktopDoc", attachedFile);
        }
        formData.append("status", replyValue);
        formData.append("eventtype", 1);
        formData.append("in_reply_to_status_id", this.options.item_id);

        // create a new reply
        new Reply({}, {
          connector: this.model.connector
        }).save({},{
          wait: true,
          dataType: "text",
          data: formData,
          parentCommentModel:this.model.options.parentCommentModel,
          success: this.onReplySubmitSuccess,
          error: this.onReplySubmitFailure.bind(this, desktopDoc)
        })
      }
      if (replyValue === undefined || replyValue === '') {
        this.$el.find("#esoc-social-comment-reply-header").focus();
      } else {
        this.util.resetAttachmentInput(desktopDoc, this.options.socialActions);
        this._elements.csuiSocialReplyShortcut.val("");
      }
    },
    removeMask: function (e) {
      self.$el.find('#esoc-social-reply-submit').html(lang.post);
      self.adjustCommentAreaWidth(e, true);
      self.util.hideMask(self.$el.find('.esoc-social-reply-form-mask'));
      self.$el.find('.esoc-social-reply-form-mask').hide();
    },
    onReplySubmitFailure:  function (desktopDoc, model, response, options) {
      this.util.resetAttachmentInput(desktopDoc, this.options.socialActions);
      this._elements.csuiSocialReplyShortcut.val("");
      this._elements.csuiSocialEmojiInput.html("");
      this.removeMask();
      $('textarea[id^="esoc-social-reply-input-"]').val("");
      var args = {
        parent: ".esoc-social-comment-widget",
        errorContent: response.responseJSON ?
                      ( response.responseJSON.errorDetail ? response.responseJSON.errorDetail :
                        response.responseJSON.error) : lang.defaultErrorMessageForReply
      };
      this.util.commonUtil.openErrorDialog(args);
    },
    onReplySubmitSuccess: function (model, response, options) {
      self.options.commentAction = true;
      self.$el.find(".esoc-reply-emoji")[0].textContent = "";
      self.removeMask();
      self.util.resetAttachmentInput(self.$el.find("#esoc-social-reply-desktop-attachment"),
          self.options.socialActions);
      self._elements.csuiSocialReplyShortcut.val("");
      self._elements.csuiSocialReplyAttachmentIcon.binf_popover('hide');
      self.$el.find('textarea[id^="esoc-social-reply-input-"]').text("").height("").blur();
      self.$el.find("#esoc-social-reply-form-container").height("");
      self.$el.find("#esoc-social-reply-warning").hide();
      self.$el.find(".esoc-reply-emoji").html("").blur();
      setTimeout(function () {
        self.onReplyFormBlur();
      }, 0);
      var collection = self.model;
      delete collection.defaults.params[self.util.commonUtil.globalConstants.MAX_ID];
      if (collection.length > 0) {
        var lastRenderedModelId = collection.at(0).id;
        collection.fetch({remove: false, params: {since_id: lastRenderedModelId}, at: 0});
      } else {
        collection.fetch({});
      }
      setTimeout(function () {
        self.$el.find("#esoc-social-comment-reply-header").focus();
      }, 200);
      self.$el.find('#esoc-social-reply-submit').attr('disabled', true);
    },
    applyemoji: function (e) {
      if (this.options.item_id !== undefined) {
        this.$el.find(".emoji-wysiwyg-editor").remove();
        var _textArea = this.$el.find("#esoc-social-reply-input-" + this.options.item_id);
        _textArea.val(_textArea.val().replace(/&quot;/gi, "\""));
        var $wysiwyg = _textArea.emojiarea({
          path: this.util.commonUtil.getEmojiPath(this.options.model.connector),
          wysiwyg: true,
          button: '.esoc-social-reply-emoticon-' + this.options.item_id,
          id: 'esoc-social-comment-reply-textarea-' + this.options.item_id,
          parent: this.$el.find("#esoc-social-textinput-button-holder-reply"),
          container: $("#esoc-social-comment-container"),
          util: this.util,
          widget: $(".esoc-social-comment-widget")
        });
        var _emojiArea = this.$el.find(".emoji-wysiwyg-editor");
        _emojiArea.addClass("esoc-reply-emoji").attr({
          "id": "esoc-social-comment-reply-header",
          "data-text": this.templateHelpers().messages.writeAComment
        });
        _textArea.hide();
        _emojiArea.show();
      }
      this.listenToOnce(this.model, 'sync', function () {
        var suggestionOptions = {
          context: this.options.context,
          connector: this.options.connector,
          element: this.$el.find("#esoc-social-comment-reply-header"),
          appendToElement: this.$el.find("[id^='esoc-suggestion-reply-header_']")
        };
        this.util.triggerAutoCompleteSuggestion(suggestionOptions);
        this.$el.find(".emoji-wysiwyg-editor").removeAttr("autocomplete");
      });
    },
    onEmojiPress: function (e) {
      var commentContainer = $("#esoc-social-comment-container").find(
          ".esoc-social-comment-list-item");
      if (commentContainer.length <= 1) {
        $(commentContainer).removeClass('esoc-attachment-init-min-height').addClass(
            'esoc-emoji-init-min-height');
      }
      if (this.options.item_id !== undefined) {
        this.util.hidePopover(this.$el.find(".esoc-social-reply-emoticon-" + this.options.item_id));
      }
      e.stopPropagation();
    },
    onAttachementPress: function (e) {
      var commentContainer = $("#esoc-social-comment-container").find(
          ".esoc-social-comment-list-item");
      if (commentContainer.length <= 1) {
        $(commentContainer).removeClass('esoc-emoji-init-min-height').addClass(
            'esoc-attachment-init-min-height');
      }

      this.$el.find(".emoji-menu").hide();
    },
    onReplyEmojiMentionMouseClick: function (event) {
      this.util.setCursorPositionAtStartOFMention(event);
    }
  });
  return ReplyHeaderView;
});
