/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/form/impl/fields/csformfield.states.behavior',
  'csui/controls/form/impl/fields/csformfield.view',
  'hbs!csui/controls/form/impl/fields/booleanfield/booleanfield',
  'csui/controls/form/impl/fields/csformfield.editable.behavior',
  'csui/controls/form/impl/array/csformarrayfield.editable.behavior',
  'csui/controls/form/impl/array/csformarrayfield.states.behavior',
  'csui/lib/binf/js/binf-switch',
  'css!csui/controls/form/impl/fields/booleanfield/booleanfield'
], function (_, $, Backbone, Marionette, base, FormFieldStatesBehavior, FormFieldView, itemTemplate,
    FormFieldEditable2Behavior, FormArrayFieldEditable2Behavior, FormArrayFieldStatesBehavior) {

  var BooleanFieldView = FormFieldView.extend({

    className: 'cs-formfield cs-booleanfield',

    template: itemTemplate,

    templateHelpers: function () {
      var data = {
        value: this.model.get('data'),
        applyFlag: this.model.get("options") && this.model.get("options").applyFlag ?
                   this.model.get("options").applyFlag : false,
        id: this.model && this.model.get('id') ? this.model.get('id') : _.uniqueId("input"),
        idBtnLabel: this.options.labelId
      };
      return data;
    },

    ui: {
      flagWriteField: '.cs-field-write input',
      readField: '.cs-field-write input',
      readArea: '.cs-field-write',
      subInputField: '.cs-field-write input'
    },

    events: {
      'click @ui.flagWriteField': 'onClickWriteField',
      'keydown @ui.flagWriteField': 'onWriteFieldKeyDown'
    },

    isBooleanField: true,

    silentRender: true,

    constructor: function BooleanFieldView(options) {
      if (!!options.model.attributes.options) {
        if (!!options.model.attributes.options.isMultiFieldItem) {
          this.behaviors = _.extend({
            FormFieldEditable: {
              behaviorClass: FormArrayFieldEditable2Behavior
            },
            FormFieldStates: {
              behaviorClass: FormArrayFieldStatesBehavior
            }
          }, this.behaviors);
        } else {
          this.behaviors = _.extend({
            FormFieldEditable: {
              behaviorClass: FormFieldEditable2Behavior
            },
            FormFieldStates: {
              behaviorClass: FormFieldStatesBehavior
            }
          }, this.behaviors);
        }
      }

      this.setMode(options.mode);
      FormFieldView.apply(this, arguments);
    },

    errorExists: false,

    checkErrorExists: function (event) {
      this.errorExists = false;
      var errEle = $('.cs-form .cs-formfield-invalid');
      if (errEle.length > 0) {
        if (this.$el.parents(".alpaca-container-item").last().find(".binf-has-error").length > 0) {
          this.errorExists = false;
        } else {
          if (this.mode !== "writeonly") {
            errEle.find(":input")[0].focus();
            this.errorExists = true;
          } else {
            this.errorExists = false;
          }
        }
      } else {
        this.errorExists = false;
      }
      return this.errorExists;
    },

    onRender: function () {
      var checked = !this.model.get('data');
      this.ui.flagWriteField[0].checked = !checked;
      this.ui.flagWriteField.binfSwitch({
        state: checked,
        size: 'mini',
        onText: '&nbsp;',
        offText: '&nbsp;',
        labelText: checked ? 'X' : '&check;',
        disabled: this.alpacaField && this.alpacaField.schema && this.alpacaField.schema.disabled ?
                  true : false,
        readonly: (this.mode === 'readonly'),
        onSwitchChange: _.bind(function (event, state) {
          if (state) {
            this.$el.find(".binf-switch .binf-switch-label").html("X");
          } else {
            this.$el.find(".binf-switch .binf-switch-label").html("&check;");
          }
          if (this.checkErrorExists()) {
            return false;
          }

          if (!!this.model.get("options") && !!this.model.get("options").isMultiFieldItem) {
            if (this.model.get("options").mode !== "create") {
              if (this.getEditValue() === this.getValue()) {
                this.$el.find('.cs-field-write').addClass('csui-unedited');
              } else {
                this.$el.find('.cs-field-write').removeClass('csui-unedited');
              }
              $(this.ui.readArea).trigger('click');
            } else {
              this.setValue(!state, true);
            }
            this.showApplyAll(event, true);
          } else {
            this.showApplyAll(event, false);
            this.setValue(!state, true);
          }
          this.ui.flagWriteField.focus();
          this.ui.flagWriteField.attr("aria-checked", !state);
          this.ui.flagWriteField[0].checked = !state;
        }, this)
      });
    },

    showApplyAll: function (event, isMultiValue) {
      var applyAllIcon = this.$el.find(".icon-container");
      if (applyAllIcon.hasClass('binf-hidden')) {
        applyAllIcon[0].classList.remove("binf-hidden");
        applyAllIcon.removeAttr("data-cstabindex");
        applyAllIcon.removeAttr("tabindex");
      }
      if (isMultiValue) {
        this.getEditableBehavior()._showApplyAll(event);
      } else {
        if (!!this.options.alpaca && this.options.alpaca.options.mode === "create" &&
            this.$el.closest('.csui-general-form').length === 0) {
          var iconEl = this.$(event.target).parents('.cs-field-write').parent().find(
              '.csui-icon.apply-all');
          var displayedApplyButton = this.$el.closest('.cs-metadata-properties').find(
              '.csui-icon.apply-all').not('.binf-hidden');
          displayedApplyButton = displayedApplyButton.filter(
              function (index, applybutton) {
                applybutton = (applybutton !== iconEl[0]) ? applybutton : undefined;
                return applybutton;
              });
          if (!!displayedApplyButton && displayedApplyButton.length > 0) {
            displayedApplyButton['addClass']('binf-hidden');
            displayedApplyButton.parent().addClass('binf-hidden');
            if (!!displayedApplyButton.parent().find('.cs-icon-applied')) {
              displayedApplyButton.parent().find('.cs-icon-applied').remove();
            }
          }
          if (iconEl.parent().hasClass('binf-hidden')) {
            iconEl.parent().removeClass('binf-hidden alpaca-container');
          }
          if (iconEl.hasClass('binf-hidden')) {
            iconEl.removeAttr('style');
            iconEl.removeClass('binf-hidden');
            iconEl.prop('tabindex', "0");
          }
        }
      }
    },
    onClickWriteField: function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (base.isFirefox()) {
        if (event.keyCode === 32) {
          return false;
        }
      }
      this.ui.flagWriteField.binfSwitch('toggleState');
    },

    onWriteFieldKeyDown: function (event) {
      if (event.keyCode === 27 && !!this.model.get("options") && this.model.get("options").mode ===
                                                                 "create") {
        var applyAllIcon = this.$el.find(".icon-container");
        if (applyAllIcon.length > 0) {
          applyAllIcon[0].classList.add("binf-hidden");
          applyAllIcon.attr("data-cstabindex", -1);
          applyAllIcon.attr("tabindex", -1);
        }
      }
      if (event.keyCode === 13 || event.keyCode === 32) {
        this.onClickWriteField(event);
        event.preventDefault();
        event.stopPropagation();
      }
    },

    getEditValue: function () {
      var val = this.errorExists ? this.getValue() :
                this.$el.find(".binf-switch").hasClass('binf-switch-off');
      return val;
    },

    setMode: function (mode) {
      var innerMode = mode;
      if (mode !== 'readonly') {
        innerMode = 'write';
      }

      this.mode = innerMode;
      if (this.getStatesBehavior()) {
        this.getStatesBehavior().state = undefined;
      }
      return;
    },

    setStateRead: function (focus) {
      this.ui.flagWriteField.binfSwitch({
        readonly: true
      });
      if (focus) {
        this.ui.flagWriteField.focus();
      }
      return true;
    },

    setStateWrite: function (validate, focus) {
      this.ui.flagWriteField.binfSwitch({
        readonly: false
      });
      this.ui.flagWriteField.focus().focus();
      return true;
    },

    getStatesBehavior: function () {
      var ret;
      if (this._behaviors) {
        ret = this._behaviors[0];
      }
      return ret;
    }

  });

  return BooleanFieldView;
});
