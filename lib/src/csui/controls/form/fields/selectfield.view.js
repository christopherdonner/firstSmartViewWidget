/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.editable.behavior',
  'csui/controls/form/impl/fields/csformfield.states.behavior',
  'csui/controls/form/impl/array/csformarrayfield.editable.behavior',
  'csui/controls/form/impl/array/csformarrayfield.states.behavior',
  'csui/controls/form/pub.sub', 'csui/utils/base',
  'hbs!csui/controls/form/impl/fields/selectfield/selectfielditem',
  'hbs!csui/controls/form/impl/fields/selectfield/selectfield',
  'i18n!csui/controls/form/impl/nls/lang',
  'css!csui/controls/form/impl/fields/selectfield/selectfield',
  'csui/lib/binf/js/binf'
], function (_, $, Backbone, Marionette, FormFieldEditable2Behavior, FormFieldStatesBehavior,
    FormArrayFieldEditable2Behavior, FormArrayFieldStatesBehavior, PubSub, base, itemTemplate,
    collectionTemplate, lang) {
  "use strict";

  var SelectFieldItemView = Marionette.ItemView.extend({

    tagName: 'li',

    template: itemTemplate,

    events: {
      'click >a': 'onClicked',
      'keydown >a': 'onKeyInView',
      'keyup >a': 'onKeyUp',
      'mouseenter >a': 'showTitle',
      'mouseover >a': 'showTitle'
    },

    constructor: function SelectFieldItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
      this.dropdownMenuVisible = false;
    },

    showTitle: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var anchorEleWidth = this.$(event.target).closest("a").width(),
          spanEle        = this.$(event.target).width();
      if (spanEle > anchorEleWidth) {
        this.$(event.target).attr("title", this.model.get("name"));
      }
    },

    activate: function (event) {
      var eventKeyCode = event.charCode || event.which;
      this.triggerMethod('click:link', eventKeyCode);
    },

    onClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.activate(event);
    },

    onKeyInView: function (event) {
      var eventKeyCode = event.charCode || event.which;
      if (eventKeyCode === 13) { // enter(13)
        event.preventDefault();
        event.stopPropagation();
        this.onClicked(event);
      } else if (eventKeyCode === 27) { // escape(27)
        event.preventDefault();
        event.stopPropagation();
      } else if (eventKeyCode === 32 || eventKeyCode === 9) { // space(32), tab(9)
        event.preventDefault();
        event.stopPropagation();
        setTimeout(_.bind(function () {  // need this for the desired effect
          this.onClicked(event);
        }, this), 200);
      } else {
        this.triggerMethod("dropdown:scroll", event);
      }
    },

    onKeyUp: function (event) {
      var eventKeyCode = event.charCode || event.which;
      if (eventKeyCode === 27) { // escape(27)
        this._parent.escapePressed = true;
        event.preventDefault();
        event.stopPropagation();
        this.triggerMethod('keypress:escape');
      }
    }
  });

  var SelectFieldView = Marionette.CompositeView.extend({

    constructor: function SelectFieldView(options) {

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

      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.model = new Backbone.Model();

      if (this.options.selected) {
        this._setSelection(this.options.selected);
      } else {
        this.resetSelection();
      }
      this.listenTo(this.collection, 'change', this._refreshSelection);
      this.listenTo(this.model, 'change', this._updateSelection);
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this, "dropdown:scroll", this._dropdownScroll);

      if (!this.options.dataId) {
        this.options.dataId = this.options.id;
      }

      this.mode = this.options.mode;
      this.mode = (this.options.alpaca && this.options.alpaca.schema.readonly) ? 'readonly' :
                  'read';
      this.$el.addClass(this.mode === 'readonly' ? 'cs-formfield-readonly' : '');

      this.curVal = this.model.clone();

      this.oldVal = this.model.clone();

      this.alpacaField = this.options.alpacaField;

      if (this.options.alpaca) {
        if (options.alpaca.options.setRequiredFieldsEditable && this.mode !== "readonly") {
          this.mode = 'writeonly';
        }
      }
      this.model.set('schema', {readonly: (this.mode === 'readonly')}, {silent: true});

    },

    onChildviewDropdownScroll: function (childView, event) {
      this._dropdownScroll(event);
    },

    _dropdownScroll: function (event) {
      var desiredElement   = [],
          typedChar        = '',
          shiftKeyPressed  = false,
          matchItemsValues = [],
          matchItemsIndex  = [];
      if (event.constructor.name == "SelectFieldItemView") {
        event = arguments[1];
      }
      typedChar = event.key;
      shiftKeyPressed = event.shiftKey;
      this.$el.find("li").each(function (idx, item) {
        var itemVal = '';
        if (shiftKeyPressed) {
          itemVal = item.textContent.trim().charAt(0).toUpperCase();
        } else {
          itemVal = item.textContent.trim().charAt(0).toLowerCase();
        }
        if (itemVal == typedChar) {
          matchItemsValues.push(item.textContent.trim());
          matchItemsIndex.push(idx);
        }
      });
      var previousActivElement = this.$el.find("li.binf-active").text().trim();
      this.$el.find("li.binf-active").removeClass();
      var position = $.inArray(previousActivElement, matchItemsValues);
      if (position != -1) {
        desiredElement = this.$el.find("li").eq(matchItemsIndex[position + 1]);
      } else {
        desiredElement = this.$el.find("li").eq(matchItemsIndex[0]);
      }
      if (desiredElement.length > 0) {
        this.ui.dropdown.scrollTop(0);
        this.ui.dropdown.scrollTop(desiredElement.position().top);
        desiredElement.find("a").trigger("focus");
        desiredElement.addClass("binf-active");
        this.ui.dropdown.perfectScrollbar("update");
      }
    },
    className: 'cs-formfield cs-selectfield binf-dropdown',

    template: collectionTemplate,

    templateHelpers: function () {
      var options, data,
          label           = lang.selectValueLabel,
          fieldName,
          multiFieldLabel = "",
          value           = lang.noValue,
          readModeAria    = "",
          writeModeAria   = "",
          isReadOnly      = this.mode === "readonly",
          isRequired      = false,
          requiredTxt     = "";

      isRequired = this.options.alpacaField && this.options.alpacaField.isRequired();
      requiredTxt = isRequired ? lang.requiredField : "";

      if (!!this.alpacaField) {
        fieldName = this.options.model.get('options') ?
                    this.options.model.get('options').label :
                    (this.alpacaField.parent && this.alpacaField.parent.options) ?
                    this.alpacaField.parent.options.label : "";
      }

      if (!!this.options.model.get('data')) {
        value = this.options.model.get('data');
      }
      if (this.options.model) {
        options = this.options.model.get('options');
        data = this.options.model.get('data');
      }

      if (options && options.label) {
        label = lang.selectValueLabel;
      }

      if (this.alpacaField && this.alpacaField.options &&
        this.alpacaField.options.isMultiFieldItem) {
        multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
          this.alpacaField.parent.options.label : "";
      }

      if (multiFieldLabel) {
        fieldName = multiFieldLabel;
      }
      readModeAria = isReadOnly ? _.str.sformat(lang.fieldReadOnlyAria, fieldName, value)
        : _.str.sformat(lang.fieldEditAria, fieldName, value) + requiredTxt;

      writeModeAria = _.str.sformat(lang.fieldReadOnlyAria, fieldName, value) + requiredTxt;

      var idBtn = this.options.alpacaField ? this.options.alpacaField.id : _.uniqueId("empty"),
          disabled = !!this.alpacaField.schema.disabled;
      return {
        hasData: data !== "" && data !== null && this.options.hasValue,
        isNotWriteOnly: this.mode !== 'writeonly',
        mode: this.mode,
        emptyLabel: (isReadOnly) ? lang.noValueSet : label,
        idBtn: idBtn,
        idBtnLabel: this.options.labelId,
        idValueDiv: idBtn + "ValueDiv",
        applyFlag: options.applyFlag,
        isReadOnly: isReadOnly,
        noValue: lang.noValue,
        readModeAria: readModeAria,
        writeModeAria: writeModeAria,
        isRequired: isRequired,
        disabled:disabled,
        titleApplyAll: lang.titleApplyAll
      };

    },

    childView: SelectFieldItemView,
    childViewContainer: 'ul',

    ui: {
      toggle: '.binf-dropdown-toggle',
      dropdown: '.binf-dropdown-menu',
      selectedLabel: '.binf-dropdown-toggle >.cs-label',
      caret: '.icon-caret-down',

      writeField: '.cs-field-write button',
      readField: '.cs-field-read button'
    },

    events: {
      'keydown @ui.writeField': 'onKeyInView',
      'keyup @ui.writeField': 'onKeyUp',
      'shown.binf.dropdown': 'onShowDropDown',
      'show.binf.dropdown': 'onBeforeShowDropDown',
      'hidden.binf.dropdown': 'onHideDropDown'
    },

    setMode: function (mode) {
      this.mode = mode;
      this.getStatesBehavior().state = undefined;
      return;
    },

    selectField: true,

    onRender: function () {
      this.ui.selectedLabel.text(this.model.get('title'));
      this.ui.toggle.off('click');
      setTimeout(_.bind(function () {
        var event = $.Event('tab:content:field:changed');
        this.$el.trigger(event);
      }, this), 100);
      this.alpacaField && this.alpacaField.setValue(this.model.id);
    },

    onBeforeShowDropDown: function () {
      if (base.isMSBrowser() || (base.isTouchBrowser() && base.i18n && base.i18n.settings.rtl)) {
        var inputEle = this.$el.find(".cs-drop-down");
        base.adjustDropDownField(inputEle, this.ui.dropdown, true, this, this.hideDropdown,
            this.ui.dropdown);
      }
    },

    handleToggle: function() {
      if (this.alpacaField && this.alpacaField.options && !this.alpacaField.options.isMultiFieldItem) {
        if(!this.isDropdownOpen()){
          this._handleToggleEvent = true;
          this.$el.find(".binf-dropdown-toggle").trigger("click");          
        }
      }
    },

    onShowDropDown: function () {
      var scrollableCols = this.$el.closest('.csui-scrollable-writemode');
      if (!!scrollableCols && !scrollableCols.hasClass('csui-dropdown-open')) {
        scrollableCols.addClass('csui-dropdown-open');
      }
      this.ui.dropdown.removeClass('dropup-menu');
      this.ui.dropdown.css({"overflow": "hidden", "max-height": "auto"});

      this.ui.dropdown.perfectScrollbar({suppressScrollX: true, scrollYMarginOffset: 15});
      if (!base.isMSBrowser() || !(base.isTouchBrowser() && base.i18n && base.i18n.settings.rtl)) {
        var inputEle = this.$el.find(".cs-drop-down");
        base.adjustDropDownField(inputEle, this.ui.dropdown, true, this, this.hideDropdown,
            this.ui.dropdown);
      }
      this.options.isDropDownOpen = true;
      
      if(!!this._handleToggleEvent) {
        var editableBehavior = this.getEditableBehavior();
        this.ui.dropdown.bind('focusout', _.bind(editableBehavior.onFocusOutWrite, editableBehavior));
      }
      if (!!this.getEditableBehavior().hideActions) {
        this.getEditableBehavior().hideActions();
      }
      var self = this;
      setTimeout(function () {
        self.ui.dropdown.perfectScrollbar("update");
      }, 1);
    },

    onHideDropDown: function () {
      this.ui.dropdown.unbind('focusout');
      this.options.isDropDownOpen = false;
      var scrollableCols = this.$el.closest('.csui-scrollable-writemode');
      if (!!scrollableCols && scrollableCols.hasClass('csui-dropdown-open')) {
        scrollableCols.removeClass('csui-dropdown-open');
      }
      if (this.getStatesBehavior().isStateWrite() && this.getStatesBehavior().hasWriteFocus() &&
          !!this.getEditableBehavior().showActions) {
        this.getEditableBehavior().showActions();
      }
      if ((this.$el.parents(".csui-multivalue-container").length === 0) &&
          (this.$el.find(".binf-dropdown-toggle")[0] != document.activeElement) &&
          !this.escapePressed) {
        this.getEditableBehavior().trySetValueAndLeaveEditMode(true, true);
      }
      this.escapePressed = false;
    },

    onKeyUp: function (event) {
      var eventKeyCode = event.charCode || event.which;
      if (event.keyCode == 27 && this.options.mode === "create") {
        if (this.dropdownMenuVisible) {
          event.preventDefault();
          event.stopPropagation();
        }
        var applyAllIcon = this.$el.find(".icon-container");
        applyAllIcon[0].classList.add("binf-hidden");
        applyAllIcon.attr("data-cstabindex", -1);
        applyAllIcon.attr("tabindex", -1);
      }
      this.dropdownMenuVisible = false;
    },

    onKeyInView: function (event) {
      var eventKeyCode = event.charCode || event.which;

      if (eventKeyCode === 27 || eventKeyCode === 9) { // escape(27)
        if (this.isDropdownOpen()) {
          this.dropdownMenuVisible = this.isDropdownOpen();
          event.preventDefault();
          event.stopPropagation();
          this.hideDropdown(this);
        }
      } else {
        this.trigger("dropdown:scroll", event);
      }
    },

    onChildviewKeypressEscape: function (childView) {
      if (this.isDropdownOpen()) {
        this.hideDropdown(this);
        this.ui.toggle.focus();
      }

    },

    onChildviewClickLink: function (childView, eventKeyCode) {
      if (this.getValue().id === childView.model.get('id')) {
        this.options.isDropDownOpen = false;
        this.hideDropdown(this);
        this.ui.toggle.focus();
      } else {
        this._setSelection(childView.model);
        this.ui.writeField.focus();
        this.alpacaField.setValue(this.model.id);
        this.ui.writeField.trigger("change");
        if (this.getValue().id === this.curVal.id && this.getEditableBehavior() &&
            !!this.getEditableBehavior().hideActions) {
          var event = event || arguments[0];
          this.getEditableBehavior().hideActions(event);
        }
        if (this.isDropdownOpen()) {
          this.options.isDropDownOpen = true;
        } else {
          this.options.isDropDownOpen = false;
          var scrollableCols = this.$el.closest('.csui-scrollable-writemode');
          if (!!scrollableCols && scrollableCols.hasClass('csui-dropdown-open')) {
            scrollableCols.removeClass('csui-dropdown-open');
          }
          this.$el.parents(".csui-normal-scrolling").css("overflow", "auto");

        }
      }
    },

    getDisplayValue: function () {
      return this.getValue().get('name');
    },

    onChildviewClearActiveTab: function (childView) {
      this.children.each(function (view) {
        if (view.$el.hasClass("binf-active")) {
          view.$el.removeClass("binf-active");
        }
      });
    },

    resetSelection: function () {
      this.model.set({
        id: null,
        name: '<' + lang.selectFieldDefaultLabel + '>', //lang.labelNoSelection,
        icon: ''
      });
    },

    _setSelection: function (model) {
      var value = model.pick('id', 'name');
      this.options.model.attributes.data = value.id;
      this.model.set(value);

      return;
    },

    _updateSelection: function () {
      this.ui.selectedLabel.text(this.model.get('name'));
      this.trigger('selection:changed');
      this.options.hasValue = true;
    },

    _refreshSelection: function (model) {
      if (model.get('id') === this.model.get('id')) {
        this._setSelection(model);
      }
    },

    serializeData: function () {
      return _.defaults({
        id: _.uniqueId()
      }, this.model.toJSON());
    },

    _raiseValueChanged: function () {

      var data = {
        fieldvalue: this.getValue().id,
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
    },

    isReadyToSave: function () {
      return $(document.activeElement).hasClass("csui-icon apply-all") ? false :
             $.contains($(this.$el)[0], document.activeElement);
    },

    isDropdownOpen: function () {
      return !this.ui.dropdown.is(":hidden");
    },

    hideDropdown: function (view) {
      view = view.originalEvent instanceof Event ? this : view;
      if (view.isDropdownOpen()) {
        view.ui.writeField.focus();
        view.ui.toggle.binf_dropdown('toggle');
        if (!!view.getEditableBehavior().showActions) {
          view.options.isDropDownOpen = false;
          var scrollableCols = view.$el.closest('.csui-scrollable-writemode');
          if (!!scrollableCols && scrollableCols.hasClass('csui-dropdown-open')) {
            scrollableCols.removeClass('csui-dropdown-open');
          }
          view.getEditableBehavior().showActions();
        }
      }

    },

    getEditValue: function () {
      return this.getValue();
    },

    getOldValue: function () {
      return this.oldVal;
    },

    getValue: function () {
      var val = this.model;
      return val;
    },

    setValue: function (value, silent) {
      this.oldVal = this.curVal;
      this.curVal = value;
      this._setSelection(value);
      !silent && this._raiseValueChanged();
    },

    allowEditOnClickReadArea: function () {
      return true;
    },

    allowEditOnEnter: function () {
      return true;
    },

    allowSaveOnEnter: function () {
      return true;
    },

    setStateRead: function (validate) {
      if (this.curVal.id !== this.getValue().id) {
        this._setSelection(this.curVal);
        this.alpacaField.setValue(this.curVal.id);
        if (this.alpacaField.validate()) {
          this.alpacaField.refreshValidationState(false);
        }
      }
      return false;
    },

    setStateWrite: function () {
      return false;
    },

    trySetValue: function () {
      if (!this.curVal.id && this.curVal.id !== 0) {
        this.curVal.id = "";
      }
      this._setSelection(this.getValue());
      var isEditedValue = (this.getValue().id !== this.curVal.id),
          bValid        = isEditedValue;
      if (this.alpacaField) {
        bValid = this.alpacaField.setValueAndValidate(this.model.id, bValid);
      }
      if (isEditedValue) {
        if (bValid) {
          this.curVal = this.getValue().clone();
          this._raiseValueChanged();
        } else if (this.alpacaField.schema.required && !bValid) {
          this.$el.trigger($.Event('field:invalid'));
        } else if (!this.alpacaField.schema.required) {
          this.curVal = this.getValue().clone();
          this._raiseValueChanged();
        }
      } else {
        if (this.alpacaField && this.alpacaField.schema && this.alpacaField.schema.required &&
            !isEditedValue) {
          this.$el.trigger($.Event('field:invalid'));
        }
        setTimeout(_.bind(function () {
          var event = $.Event('tab:content:field:changed');
          this.$el.trigger(event);
        }, this), 100);
      }
      return bValid;
    },

    setFocus: function () {
      return;
    },

    getEditableBehavior: function () {
      return this._behaviors[0];
    },

    getStatesBehavior: function () {
      return this._behaviors[1];
    },

    resetOldValueAfterCancel: function () {
      return false;
    }

  });

  return SelectFieldView;

});
