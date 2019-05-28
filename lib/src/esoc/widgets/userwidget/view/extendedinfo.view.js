/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'esoc/widgets/userwidget/util',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'esoc/lib/jquery.emojiarea/jquery.emojiarea.custom',
  'css!esoc/lib/jquery.emojiarea/jquery.emojiarea.css',
  'css!esoc/lib/jquery.emojiarea/jquery.emojiarea.custom.css'
], function ($, _, Handlebars, Marionette, Util, Lang, EmojisArea) {
  var self = null;
  var ExtendedInfoView = Marionette.ItemView.extend({
    tagName: "div",
    className: 'binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12',
    util: Util,
    emojiarea: new EmojisArea(),
    templateHelpers: function () {
      return {
        messages: {
          edit: Lang.edit,
          update: Lang.update,
          cancel: Lang.cancel,
          facebookLink: Lang.facebookLink,
          linkedinLink: Lang.linkedinLink,
          twitterLink: Lang.twitterLink,
          manager: Lang.manager,
          defaultManagerMessage: Lang.defaultManagerMessage,
          languagesSpoken: Lang.languagesSpoken,
          aboutMe: Lang.aboutMe,
          jobDescription: Lang.jobDescription,
          expertiseAreas: Lang.expertiseAreas,
          pastPositions: Lang.pastPositions,
          degrees: Lang.degrees,
          awards: Lang.awards,
          defaultLanguagesMessage: Lang.defaultLanguagesMessage,
          defaultAboutMeMessage: Lang.defaultAboutMeMessage,
          defaultfacebookMessage: Lang.defaultfacebookMessage,
          defaultLinkedInMessage: Lang.defaultLinkedInMessage,
          defaulttwitterLinkMessage: Lang.defaulttwitterLinkMessage,
          defaultJobDesc: Lang.defaultJobDesc,
          defaultExpertise: Lang.defaultExpertise,
          defaultPastPositions: Lang.defaultPastPositions,
          defaultDegreeMessage: Lang.defaultDegreeMessage,
          defaultAwardMessage: Lang.defaultAwardMessage,
          more: Lang.more,
          less: Lang.less,
          emoticon: Lang.emoticon
        }
      };
    },
    initialize: function (options) {
      this.extendedInfo = options;
      self = this;
    },
    constructor: function ExtendedInfoView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
    },
    onEditClick: function (e) {
      if (this.model.attributes.isEditable) {
        this.$el.find(".esoc-user-see-more").hide();
        this.$el.find(".esoc-user-see-less").hide();
        this.$el.find(".esoc-user-extended-view-mode").hide();
        this.$el.find(".esoc-user-extended-edit-mode").show();
        this.options.parentView.triggerMethod('update:scrollbar');
        if (!!this.model.attributes.userInputField) {
          if (!!this.model.attributes.content) {
            var model = {
              id: this.model.attributes.content,
              name: this.$el.find(".esoc-user-display-name").text().trim()
            };
            if (this.model.attributes.formField === 'status') {
              this.$el.find('.esoc-user-extended-edit-input').focus();
              this.applyEmoji(e);
              this.$el.find('.emoji-wysiwyg-editor').focus();
            }
            this.pickerView.model.set(model);
            this.pickerView.render();
          }
          this.$el.find('.esoc-user-manager-picker-holder input').focus();
        } else {
          this.$el.find('.esoc-user-extended-edit-input').focus();
          if (this.model.attributes.formField === 'status') {
            this.applyEmoji(e);
            this.$el.find('.emoji-wysiwyg-editor').focus();
          }
        }
        var that = this;
        $("#esoc-social-status-header").on("paste", function (e) {
          var maxCharters          = that.util.commonUtil.globalConstants.MAX_CHAR_LIMIT,
              existingStatusLength = $("#esoc-social-status-input").val().length;
          that.util.commonUtil.onCommentFormPaste(e, existingStatusLength, maxCharters);
          $("#esoc-social-status-input").innerHTML = ($("#esoc-social-status-header").html());
          that.onStatusChange(e);
        });
        this.util.commonUtil.preventDrop($("#esoc-social-status-header"));
        setTimeout(function () {
          $("#esoc-social-status-header").focus();
        }, 1000);

        this.$el.find(".esoc-user-label").removeClass("esoc-cursor-pointer");
        this.$el.find(".esoc-user-extended-edit").removeClass('esoc-edit-icon');
      }
    },
    showEditLinkForText: function (e) {
      var isvisible = this.$el.find(".esoc-user-extended-edit-input").is(':visible');
      if (!isvisible) {
        this.$el.find(".esoc-user-extended-edit").addClass('esoc-edit-icon');
        this.$el.find(".esoc-user-extended-edit").attr('href', 'javascript:void(0);').attr(
            "tabindex", "0");
      }
    },
    hideEditLinkForText: function (e) {
      this.$el.find(".esoc-user-extended-edit").removeClass('esoc-edit-icon');
      this.$el.find(".esoc-user-extended-edit").removeAttr('href');
      this.$el.find(".esoc-user-extended-edit").attr("tabindex", "-1");
    },
    submitOnEnter: function (ev) {
      var keycode = (ev.keyCode ? ev.keyCode : ev.which);
      if (keycode === 13) {
        this.updateExtendedInfoField(ev);
      }
    },
    applyEmoji: function (e) {
      this.$el.find(".emoji-wysiwyg-editor").remove();
      this.$el.find('#esoc-social-status-input').emojiarea({
        path: this.util.commonUtil.getEmojiPath(this.model.attributes.connector),
        wysiwyg: true,
        button: '.esoc-social-status-header-emotion',
        id: 'esoc-social-status-header',
        parent: this.$el.find(".esoc-status-textinput-button-holder"),
        util: this.util,
        isStatus: true,
        container: $(".esoc-general-tab"),
        widget: $(".esoc-user-widget-dialog .binf-modal-content")
      });
      this.$el.find(".emoji-wysiwyg-editor").addClass("esoc-status-header-emoji").attr({
        "id": "esoc-social-status-header",
        "style": "min-height: 100%",
        "data-text": this.templateHelpers().messages.defaultMessage
      });
    }
  });
  return ExtendedInfoView;
});
