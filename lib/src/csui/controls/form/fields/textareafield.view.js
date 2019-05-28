/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view', 'csui/controls/form/pub.sub',
  'hbs!csui/controls/form/impl/fields/textareafield/textareafield',
  'i18n!csui/controls/form/impl/nls/lang',
  'css!csui/controls/form/impl/fields/textareafield/textareafield',
  'csui/lib/binf/js/binf'
], function (_, $, Backbone, Marionette, FormFieldView, PubSub, template, lang) {
  "use strict";

  var TextAreaFieldView = FormFieldView.extend({

    constructor: function TextAreaFieldView(options) {
      FormFieldView.apply(this, arguments);
    },

    ui: {
      writeField: '.cs-field-write textarea',
      readField: '.cs-field-read button',
      moreLink: '.icon-expandArrowDown',
      lessLink: '.icon-expandArrowUp',
      expColLink: '.cs-icon-exp-col',
      ellipsisField: '.csui-ellipsis-area'
    },

    events: {
      'keydown @ui.writeField': 'onKeyDown',
      'click @ui.moreLink': 'showMoreText',
      'click @ui.lessLink': 'showLessText'

    },

    className: 'cs-formfield cs-textareafield',

    template: template,

    templateHelpers: function () {
      var isReadOnly = this.mode === "readonly";
      var label = "", value = "", isRequired = false, requiredTxt = "", multiFieldLabel = "", readModeAria = "", readModeMultiFieldAria = "";

      isRequired = this.options.alpacaField && this.options.alpacaField.isRequired();
      requiredTxt = isRequired ? lang.requiredField : "";

      if (this.alpacaField && this.alpacaField.options &&
          this.alpacaField.options.isMultiFieldItem) {
        multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                          this.alpacaField.parent.options.label : "";
      }

      if (this.model.get('options')) {
        label = this.model.get('options').label;
      }
      if (this.model.get('data')) {
        value = this.model.get('data');
      } else {
        value = lang.noValue;
      }

      readModeAria = isReadOnly ?
                     _.str.sformat(lang.fieldReadOnlyAria, label, value) + requiredTxt :
                     _.str.sformat(lang.fieldEditAria, label, value) + requiredTxt;

      readModeMultiFieldAria = isReadOnly ?
                               _.str.sformat(lang.fieldReadOnlyAria, multiFieldLabel, value) +
                               requiredTxt :
                               _.str.sformat(lang.fieldEditAria, multiFieldLabel, value) +
                               requiredTxt;

      return _.extend(FormFieldView.prototype.templateHelpers.apply(this), {
        inputType: 'text',
        idBtnLabel: this.options.labelId,
        multiFieldLabel: multiFieldLabel,
        readModeAria: readModeAria,
        readModeMultiFieldAria: readModeMultiFieldAria,
        ariaRequired: isRequired,
        seeMore: lang.seeMore
      });
    },

    allowSaveOnEnter: function () {
      return false;
    },

    onRender: function () {
      this._ele = this.$el.find(".cs-field-textarea-data");
      if (this.model.attributes.data && this.model.attributes.data.trim().length !== 0) {
        this._applyEllipses();
      }

    },

    _applyEllipses: function () {
      if (this._ele && this._ele.height() > 0) {
        var isTextOverflown = this._isTextOverflown(this._ele);
        var txtareaValue = this.$el.find("textarea").val();
        var hasSpace = txtareaValue.indexOf(' ') >= 0;
        var numberOfLineBreaks = (txtareaValue.match(/\n/g) || []).length;
        if (numberOfLineBreaks === 0) {
          if (hasSpace) {
            this.$el.parent().removeClass("cs-field-text-nospace");
          } else {
            this.$el.parent().addClass("cs-field-text-nospace");
          }
        } else {
          this.$el.parent().removeClass("cs-field-text-nospace");
        }

        if (isTextOverflown) {
          this.ui.ellipsisField.addClass("ellipsis");
          this.ui.ellipsisField.parent().addClass("adjustWidth");
          if (this.options.dataId === "description") {

            this.$el.closest(".binf-col-sm-9").addClass("cs-text-area-field-width");
            this.ui.expColLink.removeClass("binf-hidden");
            this.ui.expColLink.attr("title", lang.seeMore).attr("aria-label", lang.seeMore).attr(
                "aria-expanded", "false");
          }
        } else {
          this.ui.ellipsisField.addClass("no-ellipsis");
          this.ui.ellipsisField.parent().removeClass("adjustWidth");
        }
      } else {
        var that = this;
        setTimeout(function () {
          that._applyEllipses();
        }, 50); //wait 50 ms, then try again until element is ready with content in DOM
      }
    },

    _isTextOverflown: function (el) {
      return el.height() > this.ui.readField.height();
    },

    showMoreText: function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.$el.closest(".cs-formfield.cs-textareafield").addClass("csui-textareafield-reset");
      this.ui.readField.addClass("csui-textareafield-reset-button");
      this.ui.ellipsisField.addClass("no-ellipsis").removeClass("ellipsis");

      this.ui.expColLink
          .removeClass("binf-hidden")
          .removeClass("icon-expandArrowDown")
          .addClass("icon-expandArrowUp");

      this.ui.expColLink.attr("title", lang.seeLess).attr("aria-label", lang.seeLess).attr(
          "aria-expanded", "true");
    },

    showLessText: function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.ui.expColLink.removeClass("icon-expandArrowUp").addClass("icon-expandArrowDown");

      this.$el.closest(".cs-formfield.cs-textareafield").removeClass("csui-textareafield-reset");
      this.ui.ellipsisField.addClass("ellipsis").removeClass("no-ellipsis");
      this.ui.readField.removeClass("csui-textareafield-reset-button");

      this.ui.expColLink.attr("title", lang.seeMore).attr("aria-label", lang.seeMore).attr(
          "aria-expanded", "false");
      PubSub.trigger('pubsub:tab:contents:panel:textarea:scrollupdate', this);
    },

    onKeyDown: function (event) {
      if (event.keyCode === 13) { // enter:13
        event.stopPropagation();
      }
    },

    getDisplayValue: function () {
      return this.getEditValue();
    },

    _beforeTurnsToWriteMode: function () {
      this.$el.closest(".binf-col-sm-9").removeClass("cs-text-area-field-width");

    },

    _beforeTurnsToReadMode: function () {
      this.$el.closest(".binf-col-sm-9").addClass("cs-text-area-field-width");

    }

  });

  return TextAreaFieldView;

});
