/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/log',
  'csui/controls/form/impl/fields/csformfield.editable.behavior',
  'csui/controls/form/impl/fields/csformfield.states.behavior',
  'csui/controls/form/impl/array/csformarrayfield.editable.behavior',
  'csui/controls/form/impl/array/csformarrayfield.states.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/controls/form/pub.sub',
  'i18n!csui/controls/form/impl/nls/lang',
  'css!csui/controls/form/impl/fields/csformfield',
  'csui/lib/binf/js/binf'
], function (_, $, Backbone, Marionette, log, FormFieldEditable2Behavior, FormFieldStatesBehavior,
    FormArrayFieldEditable2Behavior, FormArrayFieldStatesBehavior, DefaultActionBehavior, PubSub,
    lang) {
  "use strict";

  var FormFieldView = Marionette.ItemView.extend({

    constructor: function FormFieldView(options) {
      this.options = options || {};
      if (!!options.model.attributes.options &&
          !!options.model.attributes.options.isMultiFieldItem) {
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

      Marionette.ItemView.apply(this, arguments);

      if (this.options.alpacaField !== undefined) {
        this.alpacaField = this.options.alpacaField;
      }
      if (!this.options.dataId) {
        this.options.dataId = this.options.id;
      }

      this.listenTo(this.model, 'change', this._render);
      this.listenTo(this.model, 'change', this._raiseValueChanged);

      var alpschema = this.model.attributes.schema;
      var alpoptions = this.model.attributes.options;
      if (alpschema) {
        if (alpschema.readonly) {
          this.mode = 'readonly';
          this.$el.addClass("cs-formfield-readonly");
        } else {
          if (alpoptions.setRequiredFieldsEditable) {
            this.mode = 'writeonly';
          } else {
            this.mode = 'read';
          }
        }
      } else {
        this.mode = this.options.mode || 'read';
        this.model.set('schema', {readonly: (this.options.mode === 'readonly')}, {silent: true});
      }

      this.curVal = this.oldVal = this.model.get('data');
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    ui: {
      writeArea: '.cs-field-write',
      writeField: '.cs-field-write input',
      writeDateField: '.cs-field-write .csui-datefield-input',

      readArea: '.cs-field-read',
      readField: '.cs-field-read button'
    },

    templateHelpers: function () {
      var data        = this.curVal,
          placeHolder = this._getPlaceHolder(),
          tooltip     = (!!this.options.alpaca && !!this.options.alpaca.schema &&
                         !!this.options.alpaca.schema.tooltip ? this.options.alpaca.schema.tooltip :
                         undefined) || data;

      return {
        emptyLabel: (this.mode == 'readonly' ) ? lang.noValueSet : placeHolder,
        hasData: data !== "" && data !== null,
        noValue: '',
        edit: lang.edit,
        cancel: lang.cancel,
        mode: this.mode,
        tooltip: tooltip,
        titleApplyAll: lang.titleApplyAll,
        datePickerIcon: lang.datePickerIcon
      };
    },

    className: 'cs-formfield',

    _render: function () {
      if (!!this.alpacaField && this.alpacaField.options.mode !== "create" && !this.silentRender) {
        this.render();
        this.isValidField = false;
      }
      setTimeout(_.bind(function () {
        var event = $.Event('tab:content:field:changed');
        this.$el.trigger(event);
      }, this), 100);
    },

    setMode: function (mode) {
      this.mode = mode;
      this.getStatesBehavior().state = undefined;
      return;
    },

    getOldValue: function () {
      return this.oldVal;
    },

    isMultiFieldView: function (view) {
      return (!view.isTKLField && !view.isNonTKLField) ||
             (view.alpacaField.options.isMultiFieldItem && !!view.alpacaField.parent &&
              !!view.alpacaField.parent.schema.maxItems &&
              view.alpacaField.parent.schema.maxItems > 1);
    },

    isReadyToSave: function () {
      return true;
    },

    getEditValue: function () {
      var val = this.ui.writeField.val();
      return val;
    },

    getValue: function () {
      var ret = this.model.get('data');
      return ret;
    },

    normalizeViews: function (view) {
      var normalized = [];
      if (!!view.isTKLField || view.isNonTKLField) { //view == non mv
        normalized.push(view);
      } else {
        if (this.isMultiFieldView(view)) {
          view.children.map(function (child) {
            normalized.push(child.fieldView);
          });
        } else {
          normalized.push(view.children[0].fieldView);
        }
      }
      return normalized;
    },

    getFieldIndex: function (view) {    //can't depend on dataId as it changes in mv
      if (view.alpacaField.options.isMultiFieldItem && !!view.alpacaField.parent.schema.maxItems &&
          view.alpacaField.parent.schema.maxItems !== 1) {
        return view.alpacaField.parent.children.indexOf(view.alpacaField);
      }
    },

    changeChildrenValues: function (children, parent, noReset) {

      var index, childViews,
          view        = !!this.options.dataId ? this : this.view,
          resetToNone = false,
          isInsideSet = view.options.dataId.indexOf('x') !== -1 &&
                        view.options.dataId.match(/x/g).length === 1;
      _.each(children, function (child) {
        if (this.isMultiFieldView(this)) { //mv parent
          index = this.getFieldIndex(this);
          childViews = this.normalizeViews(child);
          if (isInsideSet && (parseInt(this.options.dataId.split('_')[2]) !==
                              parseInt(childViews[0].options.dataId.split('_')[2]))) {
            return;
          }
          if (childViews[0].alpacaField.options.isMultiFieldItem) { //mv child
            childViews.forEach(function (child) {
              child.changeChildrenValues(child.children, child, false);
              child.valuesPulled = false;
            });

            if (!!childViews[index]) {
              child = childViews[index];
              resetToNone = noReset === undefined || noReset;
              this.changeChildrenValues(child.children, child);
            }
          } else {  //non mv child
            if (index === 0) {
              child = childViews[index];
              resetToNone = true;
              this.changeChildrenValues(child.children, child);
            }
          }
          if (resetToNone) {
            child.valuesPulled = false;
            child.setValue('');
            child.options.alpaca.schema.enum.length = 0;
            child.trigger('tkl:refresh');
          }
        } else {  //non mv parent
          childViews = this.normalizeViews(child);
          if (isInsideSet && (parseInt(this.options.dataId.split('_')[2]) !==
                              parseInt(childViews[0].options.dataId.split('_')[2]))) {
            return;
          }
          var that = this;
          childViews.forEach(function (child) {
            resetToNone = true;
            that.changeChildrenValues(child.children, child);
            if (resetToNone) {
              child.valuesPulled = false;
              child.isValidTKLState = true;
              if (!child.options.alpacaField.isRequired()) {
                child.$el.parents('.binf-form-group.alpaca-field').removeClass(
                    'binf-has-error alpaca-invalid');
                child.$el.removeClass('cs-formfield-invalid');
              }
              else {
                child.isValidTKLState = false;
              }
              child.$el.parents('.binf-form-group.alpaca-field').find(
                  '.binf-help-block.alpaca-message.alpaca-message-custom').hide();
              child.setValue('');
              child.options.alpaca.schema.enum.length = 0;
              child.trigger('tkl:refresh');
            }
          });
        }
      }, parent || view);
    },

    setValue: function (value, validate, silent) {
      var bIsValid = true;

      if (validate) {
        if (this.alpacaField) {
          this.oldVal = this.curVal;
          var defaultValidate = this.alpacaField.options.validate;
          if (!!this.alpacaField.options.inContainer) {
            var editVal = this.getEditValue();
            if (editVal != null && editVal.trim && editVal.trim()) {
              this.alpacaField.options.validate = true;
            } else {
              var arrayValidations = this.alpacaField.validation;
              for (var validation in arrayValidations) {
                if (arrayValidations[validation] !== undefined) {
                  arrayValidations[validation]["status"] = true;
                  arrayValidations[validation]["message"] = "";
                }
              }
            }
          }
          bIsValid = this.alpacaField.setValueAndValidate(value, validate);
          this.alpacaField.options.validate = defaultValidate;
        }
      }

      if (bIsValid) {
        this.$el.removeClass('cs-formfield-invalid');
        if (value !== this.curVal) {
          this.curVal = value;
        }
        this.model.set('data', value, {silent: !!silent} );
      } else {
        this.$el.addClass('cs-formfield-invalid');
        var event = $.Event('field:invalid');
        this.$el.trigger(event);
      }

      return bIsValid;
    },

    validate: function (callback) {
      callback();
      return;
    },

    allowEditOnClickReadArea: function () {
      return true;
    },

    allowSaveOnEnter: function () {
      return true;
    },

    allowEditOnEnter: function () {
      return true;
    },

    setFocus: function () {
      if (this.ui.readField.is(':visible')) {
        this.ui.readField.focus();
      } else if (this.ui.writeField.is(':visible')) {
        this.ui.writeField.focus();
      }
      return;
    },

    setStateWrite: function (validate, focus) {
      if (!(this.childTKLViews.length || this.parentViews.length)) {
        this.setValue(this.curVal, validate);
      }

      var bRet = false;
      return bRet;
    },

    setStateRead: function (validate, focus) {

      var bRet = false;
      return bRet;
    },

    getEditableBehavior: function () {
      return this._behaviors[0];
    },

    getStatesBehavior: function () {
      return this._behaviors[1];
    },

    _raiseValueChanged: function () {
      var val = this._getChangeEventValue();
      var data = {
        fieldvalue: val,
        fieldid: this.options.dataId,
        fieldpath: this.options.path,
        targetfieldpath: this.options.path,
        fieldView: this
      };
      this.trigger('field:changed', data);
      PubSub.trigger(this.options.dataId + 'dependentattrchanged', this);
      var event = $.Event('field:changed');
      _.extend(event, data);
      this.$el.trigger(event);

      return;
    },

    _getChangeEventValue: function () {
      return this.getValue();
    },

    onKeyPress: function (event) {
      return false;
    },

    resetOldValueAfterCancel: function () {
      return false;
    },

    _getPlaceHolder: function () {
      var options = this.model.get('options');
      var label;
      if (options && options.placeholder) {
        label = options.placeholder;
      } else if (options) {
        switch (options.type) {
        case 'number':
        case 'integer':
          label = lang.alpacaPlaceholderNumber;
          break;
        case 'text':
        case 'textarea':
          label = lang.alpacaPlaceholderText;
          break;
        case 'time':
          label = lang.alpacaPlaceholderTime;
          break;
        case 'date':
          label = lang.alpacaPlaceholderDate;
          break;
        case 'datetime':
          label = lang.alpacaPlaceholderDateTime;
          break;
        case 'email':
          label = lang.alpacaPlaceholderEmail;
          break;
        case 'file':
          label = lang.alpacaPlaceholderFile;
          break;
        case 'password':
          label = lang.alpacaPlaceholderPassword;
          break;
        case 'phone':
          label = lang.alpacaPlaceholderPhone;
          break;
        case 'search':
          label = lang.alpacaPlaceholderSearch;
          break;
        case 'url':
          label = lang.alpacaPlaceholderUrl;
          break;
        case 'ipv4':
          label = lang.alpacaPlaceholderIPv4;
          break;
        case 'otcs_user_picker':
          label = lang.alpacaPlaceholderOTUserPicker;
          break;
        case 'otcs_member_picker':
          label = lang.alpacaPlaceholderOTUserGroupPicker;
          break;
        case 'otcs_user':
          label = this.model.get("schema").type === "otcs_user_picker" ?
                  lang.alpacaPlaceholderOTUserPicker : lang.alpacaPlaceholderOTUserGroupPicker;
          break;
        case 'otcs_node_picker':
          label = lang.alpacaPlaceholderOTNodePicker;
          break;
        default:
          label = lang.alpacaPlaceholderGeneric;
          break;
        }
        options.placeholder = label;
      }
      return label;
    }

  });

  return FormFieldView;

});
