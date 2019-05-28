/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'i18n', 'csui/lib/underscore', 'csui/utils/base',
  'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/types/date',
  'csui/controls/form/impl/fields/csformfield.view',
  'i18n!csui/controls/form/impl/nls/lang',
  'hbs!csui/controls/form/impl/fields/datefield/datefield',
  'css!csui/controls/form/impl/fields/datefield/datefield',
  'csui/lib/binf/js/binf', 'csui/lib/binf/js/binf-datetimepicker'
], function (i18n, _, base, $, Marionette, date, FormFieldView, lang,
    template) {
  'use strict';

  var DateBaseFieldView = FormFieldView.extend({
    constructor: function DateBaseFieldView(options) {
      this.ui.subInputField = '.icon-date_picker';
      FormFieldView.apply(this, arguments);
      this.curVal = this.model.get('data');
    },

    inputType: null,
    inputStep: null,

    className: 'cs-formfield cs-datefield',

    template: template,

    events: {
      'change @ui.writeField': 'onChangeWriteField',
      'keydown .icon-date_picker': 'onDateIconKeyDown',
      'keydown @ui.writeField': 'onWriteFieldKeyDown'
    },
    onChangeWriteField: function (event) {
      return true;
    },

    onWriteFieldKeyDown: function (event) {
      if (event.keyCode === 27) {
        var applyAllIcon = this.$el.find(".icon-container");
        applyAllIcon[0].classList.add("binf-hidden");
      }
    },

    onDateIconKeyDown: function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.stopPropagation();
        event.preventDefault();
        event.target.click();
      }
    },

    templateHelpers: function () {
      var value           = this.getValue(),
          formattedValue  = this._convertFromModelToInput(value),
          multiFieldLabel = "",
          readModeAria    = "",
          isReadOnly = this.mode === "readonly",
          readModeMultiFieldAria = "",
          isRequired = false,
          disabled=false,
          requiredTxt = "";

      isRequired = this.options.alpacaField && this.options.alpacaField.isRequired();
      disabled = (this.options.alpacaField && this.options.alpacaField.schema.disabled) ? true :
                 false;
      requiredTxt = isRequired ? lang.requiredField : "";

      if (this.alpacaField && this.alpacaField.options &&
          this.alpacaField.options.isMultiFieldItem) {
        multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                          this.alpacaField.parent.options.label : "";
      }

      if (this.model.get('options') ) {
        var val2Use = formattedValue ? formattedValue : lang.noValue;
        readModeAria = isReadOnly ? _.str.sformat(lang.fieldReadOnlyAria, this.model.get('options').label, val2Use) + requiredTxt :
          _.str.sformat(lang.fieldEditAria, this.model.get('options').label, val2Use) + requiredTxt;
      }

      readModeMultiFieldAria = isReadOnly ?
        _.str.sformat(lang.fieldReadOnlyAria, multiFieldLabel, formattedValue) + requiredTxt :
        _.str.sformat(lang.fieldEditAria, multiFieldLabel, formattedValue) + requiredTxt;

      return _.extend(FormFieldView.prototype.templateHelpers.apply(this), {
        data: formattedValue,
        readData: formattedValue,
        placeholder: this.format.toLowerCase(),
        inputType: 'text',
        idBtnLabel: this.options.labelId,
        readModeAria: readModeAria,
        readModeMultiFieldAria: readModeMultiFieldAria,
        multiFieldLabel: multiFieldLabel,
        ariaRequired: isRequired,
        disabled: disabled
      });
    },

    setStateWrite: function () {
      this.initialValue = this.getValue();
      if ($.fn.datetimepicker) {
        var that = this;
        this.ui.writeDateField
            .datetimepicker({
              format: this.format,
              keepInvalid: true,
              useStrict: true,
              widgetParent: this.$el,
              showClear: base.isTouchBrowser(),
              widgetPositioning: {
                vertical: 'auto',
                horizontal: i18n.settings.rtl ? 'right' : 'left'
              }
            })
            .on('dp.change', function (event) {
              that.getEditableBehavior()._showApplyAll(event);
              event.stopImmediatePropagation();
              $(event.target).parents(".csui-normal-scrolling").css("overflow", "auto");
            })
            .on('dp.place', function (event) {
              if (base.isMSBrowser() ||
                  (base.isTouchBrowser() && i18n && i18n.settings.rtl)) {
                var inputEle          = $(event.target),
                    dropDownContainer = that.$el.find(".binf-datetimepicker-widget");
                base.adjustDropDownField(inputEle, dropDownContainer, false, that,
                    that.hideDateTimePicker);
                event.stopImmediatePropagation();
              }
            })
            .on('dp.show', function (event) {
              if (!!that.getEditableBehavior().hideActions) {
                that.options.isDropDownOpen = true;
                var scrollableCols = that.$el.closest('.csui-scrollable-writemode');
                if (!!scrollableCols && !scrollableCols.hasClass('csui-dropdown-open')) {
                  scrollableCols.addClass('csui-dropdown-open');
                }
                that.getEditableBehavior().hideActions(event);
              }
              if (!base.isMSBrowser() ||
                  !(base.isTouchBrowser() && i18n && i18n.settings.rtl)) {
                var inputEle          = $(event.target),
                    dropDownContainer = that.$el.find(".binf-datetimepicker-widget");
                base.adjustDropDownField(inputEle, dropDownContainer, false, that,
                    that.hideDateTimePicker);
              }
              event.stopImmediatePropagation();
            })
            .on('dp.hide', function (event) {
              if (!!that.getEditableBehavior().showActions) {
                that.options.isDropDownOpen = false;
                var scrollableCols = that.$el.closest('.csui-scrollable-writemode');
                if (!!scrollableCols && scrollableCols.hasClass('csui-dropdown-open')) {
                  scrollableCols.removeClass('csui-dropdown-open');
                }
                that.getEditableBehavior().showActions(event);
              }
              event.stopImmediatePropagation();
              $(event.target).parents(".csui-normal-scrolling").css("overflow", "auto");
            });
      }
    },

    hideDateTimePicker: function (view) {
      view.$el.find('.icon-date_picker').click();
      if (!!view.getEditableBehavior().showActions) {
        view.options.isDropDownOpen = false;
        var scrollableCols = view.$el.closest('.csui-scrollable-writemode');
        if (!!scrollableCols && scrollableCols.hasClass('csui-dropdown-open')) {
          scrollableCols.removeClass('csui-dropdown-open');
        }
        view.getEditableBehavior().showActions();
      }
    },

    getEditValue: function () {
      var value = this.ui.writeField.val();
      return this._convertFromInputToModel(value);
    },

    resetOldValueAfterCancel: function () {
      this.ui.writeField.val(this._convertFromModelToInput(this.getValue()));
      return true;
    },

    _convertFromInputToModel: function (value) {
      return value ? date.serializeDateTime(value, undefined, function () {return false;}) : null;
    },

    _convertFromModelToInput: function (value) {
      return value ? date.formatExactDateTime(date.deserializeDate(value)) : '';
    }
  });

  return DateBaseFieldView;
});
