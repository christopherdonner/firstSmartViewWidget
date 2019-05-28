/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view',
  'hbs!csui/controls/form/impl/fields/tklfield/tklfield',
  'csui/controls/form/impl/array/csformarrayfield.editable.behavior',
  'csui/controls/form/impl/array/csformarrayfield.states.behavior',
  'csui/controls/form/impl/tkl/cstklfield.editable.behavior',
  'csui/controls/form/impl/fields/csformfield.states.behavior',
  'csui/controls/form/pub.sub',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!csui/controls/form/impl/nls/lang',
  'css!csui/controls/form/impl/fields/tklfield/tklfield'
], function (_, $, Backbone, Marionette, FormFieldView, itemTemplate,
    FormArrayFieldEditable2Behavior, FormArrayFieldStatesBehavior, TKLFieldEditableBehavior,
    FormFieldStatesBehavior, PubSub, base, PerfectScrollingBehavior, Lang) {
  'use strict';
  var TKLFieldView = FormFieldView.extend({
    constructor: function TKLFieldView(options) {
      this.dropdownMenuVisible = false;
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
            behaviorClass: TKLFieldEditableBehavior
          },
          FormFieldStates: {
            behaviorClass: FormFieldStatesBehavior
          }
        }, this.behaviors);

      }

      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.mode = this.options.mode;
      this.mode = (this.options.alpaca && this.options.alpaca.schema.readonly) ? 'readonly' :
                  'read';
      if (this.options.alpaca) {
        if (options.alpaca.options.setRequiredFieldsEditable && this.mode !== "readonly") {
          this.mode = 'writeonly';
        }
      }
      this.alpacaField = this.options.alpacaField;
      this.curVal = this.options.alpaca.data || '';
      this.options.hasValue = this.curVal === 0 || !!this.curVal;
      this.oldVal = this.curVal;
      this.valuesPulled = false;
      this.options.enum = [];
      if (!!this.options.alpacaField.connector.config.formView.options &&
          !!this.options.alpacaField.connector.config.formView.options.node) {
        this.node = this.options.alpacaField.connector.config.formView.options.node;
      } else {
        this.node = this.options.alpacaField.connector.config.formView.node;
      }
      this.formView = this.alpacaField.connector.config.formView;
      this.isCustomView = !!this.formView.options.customView; //part of custom view search
      if (this.isCustomView) {
        this.templateId = this.alpacaField.connector.config.formView.options.templateId;
      }
      this.connector = this.isCustomView ? this.formView.model.connector :
                       (this.node ? this.node.connector : this.options.alpacaField.connector);
      this.catId = this.isCustomView ? this.options.alpaca.schema.fieldID.split('_')[0] :
                   this.options.dataId.split('_')[0];

      this.parentViews = [];
      this.children = [];
      var idToListen;
      if (this.alpacaField.options.isMultiFieldItem &&
          this.alpacaField.parent.schema.maxItems > 1) {
        PubSub.off(this.alpacaField.parent.propertyId + 'tkl:buildRelation');  //remove duplicate
        this.listenTo(PubSub, this.alpacaField.parent.propertyId + 'tkl:buildRelation',
            this.buildRelation);
        PubSub.trigger(this.alpacaField.parent.propertyId + 'tkl:rebuildRelation', this);
      } else {
        idToListen = this.isCustomView ? this.alpacaField.schema.fieldID :
                     this.alpacaField.propertyId;
        PubSub.off(idToListen + 'tkl:buildRelation');
        this.listenTo(PubSub, idToListen + 'tkl:buildRelation',
            this.buildRelation);
      }
      var propertyId;
      _.each(this.options.alpaca.schema.parents, function (parent) {
        if (!this.isCustomView) {
          propertyId = this.alpacaField.propertyId || this.alpacaField.parent.propertyId;
          parent = propertyId.substring(0, propertyId.lastIndexOf('_')) + '_' + parent;
        }
        PubSub.trigger(parent + 'tkl:buildRelation', this);
        this.listenTo(PubSub, parent + 'tkl:rebuildRelation', this.rebuildRelation);
        this.listenTo(PubSub, parent + 'tkl:asyncBuildRelation', this.asyncBuildRelation);
      }, this);
      this.listenTo(this, 'tkl:refresh', this.refresh);
      this.listenTo(this.model, 'change', this.render);
      this.relationsFiltered = false; //multiple view objects are created so filter them
      $.expr.pseudos.ibegins = function (obj, index, meta) {
        var $obj     = $(obj),
            haystack = $obj.text().toString().toUpperCase();
        return !!haystack.startsWith ? haystack.startsWith(meta[3].toUpperCase()) :
               (haystack.indexOf(meta[3].toUpperCase()) === 0);
      };

      this.jQuery = $;
      var self = this;
      $(document).on('mouseup.tkl.options', function () {
        self.hideOptions();
        self.options.isDropDownOpen = false;
      });
      this.isValidTKLState = true;
    },

    className: 'cs-formfield cs-tklfield',

    template: itemTemplate,

    templateHelpers: function () {
      var multiFieldLabel = "",
          data            = Lang.noValue,
          isRequired      = this.options.alpacaField && this.options.alpacaField.isRequired(),
          isReadOnly      = this.mode === "readonly",
          requiredTxt     = "";

      requiredTxt = isRequired ? Lang.requiredField : "";
      if (!!this.model.get('data')) {
        data = this.model.get('data');
      } else {
        data = Lang.noValue;
      }
      if (this.alpacaField && this.alpacaField.options &&
          this.alpacaField.options.isMultiFieldItem) {
        multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                          this.alpacaField.parent.options.label : "";
      }
      var noneOptionId = _.uniqueId('tklitem');
      var enums = this.options.enum.map(
          function (opt) { return {name: opt, id: _.uniqueId('tklitem')};});
      return {
        options: enums,
        noneOptionId: noneOptionId,
        isNotWriteOnly: this.mode !== 'writeonly',
        hasData: this.options.hasValue,
        notRequired: !this.options.alpaca.schema.required,
        data: this.curVal,
        emptyLabel: Lang.tklFieldNone,
        applyFlag: !!this.options.model.get('options') ?
                   this.options.model.get('options').applyFlag : undefined,
        writeonlyMode: this.mode === 'writeonly',
        idBtnLabel: this.options.labelId,
        multiFieldLabel: multiFieldLabel,
        readModeAria: isReadOnly ?
                      _.str.sformat(Lang.fieldReadOnlyAria, this.model.get('options').label, data) +
                      requiredTxt :
                      _.str.sformat(Lang.fieldEditAria, this.model.get('options').label, data) +
                      requiredTxt,
        readModeMultiFieldAria: _.str.sformat(Lang.fieldEditAria, multiFieldLabel, data) +
                                requiredTxt,
        ariaRequired: isRequired
      };
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.cs-tkl-options-container > div',
        suppressScrollX: true
      }
    },

    ui: {
      writeField: '.cs-field-write input',
      readField: '.cs-field-read button',
      tklOptionsContainer: '.cs-tkl-options-container',
      tklOptions: '.cs-tkl-options'
    },

    events: function () {
      return (this.alpacaField && this.alpacaField.schema.disabled) ? {} : {
        'click @ui.readField': 'pullValidValues',
        'click @ui.tklOptions a': 'onClick',
        'keyup @ui.writeField': 'search',
        'mouseup @ui.writeField': '_onMouseUpWriteField',
        'keydown .cs-tklfield-select': 'accessibility',
        'change .cs-tklfield-select ': 'inputValidations'
      };
    },

    setFocus: function () {
      return true;
    },

    onRender: function () {
      this.searchBase = this.ui.tklOptions.find('li');
      var self = this;
      this.$el.bind('csui.document.active.tkl', function (event, ele) {
        ele.documentActiveTKL = self;
      });
      var optionsContainerId = _.uniqueId('tklOptionsContainer');
      this.ui.tklOptions.attr('id', optionsContainerId);
      this.ui.writeField.attr('aria-owns', optionsContainerId);
    },

    onDestroy: function () {
      this.$el.unbind('csui.document.active.tkl');
    },

    _onMouseUpWriteField: function (event) {
      if (!this.ui.tklOptionsContainer.hasClass('binf-show')) {
        this.ui.tklOptions.find('.active').removeClass('active');
        this.searchBase.first().addClass('active');
        this.showOptions(event);
        this.ui.writeField.attr('aria-activedescendant', this.searchBase.first().attr('id'));
      } else {
        if (!!this.getEditableBehavior().showActions) {
          this.getEditableBehavior().showActions(event);
        }
      }
    },

    search: function (event) {

      var keyword     = $(event.target).val(),
          searchMatches,
          invalidKeys = [9, 13, 16, 32, 38, 40, 113, 27];  //[tab, enter, shift, space, arrow up,
      if (keyword && invalidKeys.indexOf(event.keyCode) === -1) {
        this.ui.tklOptions.find('.cs-tkl-no-result').remove();
        this.showOptions();
        var unmatched = this.searchBase.not(':ibegins("' + keyword.toLowerCase() + '")');
        unmatched.addClass('binf-hidden');
        this.searchBase.not(unmatched).removeClass('binf-hidden');
        this.triggerMethod('update:scrollbar');
        searchMatches = this.searchBase.filter(':visible');
        if (searchMatches.length === 0) {
          this.ui.tklOptions.append(
              $('<li class="cs-tkl-no-result"><a tabindex="-1">' + Lang.noResultFound +
                '</a></li>'));
        } else {
          this.ui.tklOptions.find('.active').removeClass('active');
          var activeItem = searchMatches.first();
          activeItem.addClass('active');
          this.ui.writeField.attr('aria-activedescendant', activeItem.attr('id'));
        }
      } else {
        if (!event.target.value) {
          this.ui.tklOptions.find('.cs-tkl-no-result').remove();
          this.searchBase.removeClass('binf-hidden');
          if ([38, 40].indexOf(event.keyCode) === -1) {
            this.ui.tklOptions.find('.active').removeClass('active');
            var activeOpt = this.searchBase.first();
            activeOpt.addClass('active');
            this.ui.writeField.attr('aria-activedescendant', activeOpt.attr('id'));
          }
        } else {
          if (!this.isMultiFieldView(this)) {
            if ($.inArray(event.keyCode, [13, 113]) !== -1) {
              this.trySetValue();
            }
          }
        }
      }
      if (event.keyCode === 27 && this.options.mode === "create") {
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

    showOptions: function (event) {
      var scrollableCols = this.$el.closest('.csui-scrollable-writemode');
      if (!!scrollableCols && !scrollableCols.hasClass('csui-dropdown-open')) {
        scrollableCols.addClass('csui-dropdown-open');
      }
      this.hideOptions(event);
      this.pullValidValues();
      this.adjustPosition();
      this.ui.tklOptionsContainer.addClass('binf-show');
      if (this.searchBase.filter(':visible').length > 0 &&
          !!this.getEditableBehavior().hideActions) {
        this.options.isDropDownOpen = true;
        this.getEditableBehavior().hideActions(event);
      } else {
        this.options.isDropDownOpen = false;
      }
      !!event && event.stopPropagation();
      this.ui.writeField.attr("aria-expanded", true);
    },

    adjustPosition: function () {
      var inputEle = this.$el.find("input");
      base.adjustDropDownField(inputEle, this.ui.tklOptionsContainer, true, this,
          this.hideDropdown, this.ui.tklOptions.parent());
    },

    hideDropdown: function (view) {
      view.hideOptions();
      if (!!view.getEditableBehavior().showActions) {
        view.getEditableBehavior().showActions();
      }
      view.options.isDropDownOpen = false;
      var scrollableCols = view.$el.closest('.csui-scrollable-writemode');
      if (!!scrollableCols && scrollableCols.hasClass('csui-dropdown-open')) {
        scrollableCols.removeClass('csui-dropdown-open');
      }
    },

    hideOptions: function (event) {
      $('.cs-tkl-options-container.binf-show').removeClass('binf-show');
      this.ui.writeField.attr("aria-expanded", false);
    },

    accessibility: function (event) {
      var validKeys = [38, 40, 113, 13];  //arrow up, arrow down, f2, enter
      if (validKeys.indexOf(event.keyCode) !== -1) {
        if ((event.keyCode === 13 || event.keyCode === 113) &&
            !this.$el.find('.cs-tkl-options').is(':visible')) {
              if (!event.target.value.length) {
                this.setValue('');
                this.changeChildrenValues(this.children);
              }
          return;
        }
        this.showOptions();
        var searchBase    = this.searchBase.filter(':visible'),
            index         = searchBase.index(searchBase.filter('.active')),
            selected      = false,
            alpacaFieldEl = this.$el.parents('.binf-form-group.alpaca-field');
        searchBase.filter('.active').removeClass('active');
        if (event.keyCode === 38) { //up arrow
          index = (index === -1 || index === 0) ? searchBase.length - 1 : index - 1;
        } else if (event.keyCode === 40) {  //down arrow
          index = (index === -1 || index === searchBase.length - 1) ? 0 : index + 1;
        } else if (event.keyCode === 13 || event.keyCode === 113) {
          if (!!searchBase[index] && searchBase[index].children[0]) {
            $(searchBase[index].children[0]).trigger('click');
            selected = true;
          }
          if (this.options.alpacaField.isRequired()) {
            var value = this.curVal;
            if (value !== '') {
              this.isValidTKLState = true;
              alpacaFieldEl.removeClass('binf-has-error alpaca-invalid');
              this.$el.removeClass('cs-formfield-invalid');
              alpacaFieldEl.find(
                  '.binf-help-block.alpaca-message.alpaca-message-notOptional').hide();
            }
            else {
              this.isValidTKLState = false;
            }
          }
          else {
            this.isValidTKLState = true;
            alpacaFieldEl.removeClass('binf-has-error alpaca-invalid');
            this.$el.removeClass('cs-formfield-invalid');

          }
          this.inputValidations(event);
        }

        if (!!searchBase[index] && (event.keyCode === 38 || event.keyCode === 40)) {
          $(searchBase[index].children[0]).focus();  //focus to scroll to the overflowing
          this.ui.writeField.focus(); //as live search is on, let the user start search without
        }
        this.ui.writeField.attr('aria-activedescendant', $(searchBase[index]).attr('id'));

        $(searchBase[index]).addClass('active');
        if (event.keyCode === 38 || event.keyCode === 40 || selected) {
          event.stopPropagation();
          event.preventDefault();
        }
      } else {
        if (event.keyCode === 27) { //escape
          if (this.ui.tklOptionsContainer.is(':visible')) {
            event.preventDefault();
            event.stopPropagation();
            this.dropdownMenuVisible = this.ui.tklOptionsContainer.is(':visible');
            this.hideOptions();
            if (!!this.getEditableBehavior().showActions) {
              this.getEditableBehavior().showActions(event);
            }
            this.options.isDropDownOpen = false;
          }
        }
        if (event.keyCode === 9) { //tab
          if (this.$el.find('.cs-tkl-options').is(':visible')) {
            event.preventDefault();
            event.stopPropagation();
            this.dropdownMenuVisible = this.ui.tklOptionsContainer.is(':visible');
            this.hideOptions();
            this.options.isDropDownOpen = false;
          }
        }
      }
    },

    inputValidations: function (event) {
      var val      = this.ui.writeField.val(),
          tklValue = this.options.enum;
      if (val === '') {
        this.setValue(val, true);
        this.setSelection($(event.target).closest('li'), false, true);
        this.isValidTKLState = true;
        this.needRerender = true;
      } else {
        if (typeof tklValue[0] === 'number') {
          val = Number(val);
        }
        if (!(_.contains(tklValue, val))) {
          this.isValidTKLState = false;
        }
        delete this.needRerender;
      }
    },

    buildRelation: function (child, parentView) {
      if (this.isMultiFieldView(this)) {
        if (child.parentViews.indexOf(this.alpacaField.parent) === -1) {
          this.pushView(child.parentViews, this.alpacaField.parent);
          if (!child.alpacaField.parent.parentRelations) { //make easier for mv handling
            child.alpacaField.parent.parentRelations = [];
          }
          if (child.alpacaField.parent.parentRelations.indexOf(this.alpacaField.parent) === -1) {
            this.pushView(child.alpacaField.parent.parentRelations, this.alpacaField.parent);
          }
        }
        this.alpacaField.parent.children.map(function (sibling) {
          sibling.fieldView.children = this.children;
        }, this);

      } else {
        this.pushView(child.parentViews, !!parentView ? parentView : this);
      }

      if (this.isMultiFieldView(child)) {
        if (this.children.indexOf(child.alpacaField.parent) === -1) {
          this.pushView(this.children, child.alpacaField.parent);
          if (!this.alpacaField.parent.childRelations) { //make easier for mv handling
            this.alpacaField.parent.childRelations = [];
          }
          if (this.alpacaField.parent.childRelations.indexOf(child.alpacaField.parent) === -1) {
            this.pushView(this.alpacaField.parent.childRelations, child.alpacaField.parent);
          }
        }
      } else {
        this.pushView(this.children, child);
      }
    },

    pushView: function (containerArray, view) {
      if (containerArray.indexOf(view) === -1) {
        containerArray.push(view);
      }
    },

    rebuildRelation: function (parent) {
      if (this.isMultiFieldView(this)) {
        this.pushView(parent.children, this.alpacaField.parent);
      } else {
        this.pushView(parent.children, this);
      }
    },

    asyncBuildRelation: function (parent) {
      this.parentViews = this.parentViews ? this.parentViews : [];
      this.pushView(this.parentViews, parent);
      this.pushView(parent.childTKLViews, this);
    },

    filterRelations: function () {
      if (!this.relationsFiltered && this.mode !== 'writeonly') {
        var views, validParticipant, index,
            validParent   = [],
            validChildren = [];
        _.each(this.children, function (child) {
          validParticipant = false;
          views = this.normalizeViews(child);
          for (index = 0; index < views.length && !validParticipant; index++) {
            if (!!views[index] && views[index].$el.is(':visible')) {
              validParticipant = true;
            }
          }
          if (validParticipant) {
            this.pushView(validChildren, child);
          }
        }, this);
        this.children = validChildren;

        _.each(this.parentViews, function (parent) {
          validParticipant = false;
          views = this.normalizeViews(parent);
          for (index = 0; index < views.length && !validParticipant; index++) {
            if (views[index].$el.is(':visible')) {
              validParticipant = true;
            }
          }
          if (validParticipant) {
            this.pushView(validParent, parent);
          }
        }, this);
        this.parentViews = validParent;
        this.relationsFiltered = true;
      }
    },

    isTKLField: true,

    setValue: function (value, silent) {
      if (this.getStatesBehavior().state === 'write') {
        this.ui.writeField.val(value);
      }
      this.options.alpacaField.setValue(value);
      this.curVal = value;
      this.options.alpaca.data = value;
      this.options.hasValue = value === 0 || !!value;
      this.model.set('data', value, {silent: !!silent});
    },

    getOldValue: function () {
      return this.oldVal;
    },

    getEditValue: function () {
      return this.curVal;
    },

    getValue: function () {
      return this.curVal;
    },

    setMode: function (mode) {
      this.mode = mode;
      this.getStatesBehavior().state = undefined;
      return;
    },

    getEditableBehavior: function () {
      return this._behaviors[0];
    },

    getStatesBehavior: function () {
      return this._behaviors[1];
    },

    getDocumentActiveTKL: function () {
      var documentActiveTKL = {documentActiveTKL: undefined},
          activeElement     = document.activeElement.tagName === 'BODY' ? undefined :
                              $(document.activeElement);
      if (!!activeElement && !activeElement.hasClass('cs-tklfield')) {
        var closest = activeElement.closest('.cs-formfield.cs-tklfield');
        if (closest.length > 0) {
          activeElement = closest;
        } else {
          closest = activeElement.closest('.cs-pull-right').siblings('.cs-pull-left').find(
              '.cs-formfield.cs-tklfield');
          if (closest.length === 0) {
            closest = activeElement.find('.cs-pull-left .cs-formfield.cs-tklfield');
          }
          activeElement = closest;
        }
      }
      !!activeElement && activeElement.hasClass('cs-tklfield') && activeElement.trigger(
          'csui.document.active.tkl',
          [documentActiveTKL]);
      return documentActiveTKL.documentActiveTKL;
    },

    shouldValidate: function () {
      return !$.contains(this.$el[0], document.activeElement);
    },

    isReadyToSave: function () {
      var ret = $.contains(this.$el[0], document.activeElement),
          i   = 0;
      for (; !ret && !!PubSub.tklHelpers && i < PubSub.tklHelpers.viewsInWriteMode.length; i++) {
        if (this.isMultiFieldView(PubSub.tklHelpers.viewsInWriteMode[i])) {
          ret = $.contains(
              PubSub.tklHelpers.viewsInWriteMode[i].alpacaField.parent.getFieldEl()[0],
              document.activeElement);
        } else {
          ret = $.contains(PubSub.tklHelpers.viewsInWriteMode[i].$el[0], document.activeElement);
        }
      }
      return ret;
    },

    trySetValue: function (silentFlag) {
      var bValid;
      bValid = !this.$el.is(':visible') ? true :
               this.options.alpacaField.setValueAndValidate(this.curVal, true);
      if (bValid) {
        if (this.curVal !== this.oldVal || (this.curVal === "")) {
          this.setValue(this.curVal, silentFlag);
          if (this.isMultiFieldView(this)) {
            this._raiseValueChanged();
          }
        }
        this.$el.removeClass('cs-formfield-invalid');
      } else {
        this.$el.addClass('cs-formfield-invalid');
        this.$el.trigger($.Event('field:invalid'));
      }
      return bValid;
    },

    setStateRead: function (validate) {
      if (PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode) {
        var viewIndex = PubSub.tklHelpers.viewsInWriteMode.indexOf(this);
        if (viewIndex !== -1) {
          PubSub.tklHelpers.viewsInWriteMode.splice(viewIndex, 1);
        }
      }
      if (this.curVal !== this.getValue()) {
        this.options.alpacaField.setValue(this.curVal);
        if (this.options.alpacaField.validate()) {
          this.options.alpacaField.refreshValidationState(false);
        }
      }
      this.valuesPulled = false;
      return false;
    },

    setStateWrite: function () {
      this.filterRelations();
      this.buildHelpers();
      if (this.mode !== 'writeonly' && !this.getEditableBehavior().escapePressed) {
        this.children.map(function (view) {
          if (this.isMultiFieldView(view)) {
            if (!view.isWriteMode) {
              view.children.map(function (child) {
                if (!!child.fieldView) {
                }  //prevent server call
              });
              view._showItemsInWriteMode();
            }
          } else {
            if (view.getStatesBehavior().state !== 'write' &&
                !view.alpacaField.parent.cancelClicked) {
              view.getStatesBehavior().setStateWrite(false, false);
            }
          }
        }, this);
      }
      return false;
    },

    buildHelpers: function () {  //helpers will be destroyed in read mode
      if (!PubSub.tklHelpers) {
        PubSub.tklHelpers = {};
        PubSub.tklHelpers.viewsInWriteMode = [];
      }
      this.isMultiFieldView(this) ? this.alpacaField.parent._updateViewsInWriteMode(this) :
      this.getEditableBehavior()._updateViewsInWriteMode(this);
      if (!PubSub.tklHelpers.tabInView) {
        PubSub.tklHelpers.tabInView = this;
      }
    },

    resetHelpers: function (filter) { //remove existing views which are not current participatns
      if (!!PubSub.tklHelpers) {
        if (!!filter) {
          var newViewList = [];
          _.each(PubSub.tklHelpers.viewsInWriteMode, function (view) {
            if (view && view.$el.is(':visible')) {
              this.pushView(newViewList, view);
            }
          }, this);
          PubSub.tklHelpers.viewsInWriteMode = newViewList;
        } else {
          PubSub.tklHelpers.viewsInWriteMode.length = 0;
        }
      }
    },

    allowEditOnClickReadArea: function () {
      return true;
    },

    _raiseValueChanged: function () {
      if (!!PubSub.tklHelpers && !this.isMultiFieldView(this)) {
        _.each(PubSub.tklHelpers.viewsInWriteMode, function (view) {
          if (!this.isMultiFieldView(view)) {
            view.oldVal = view.curVal;
          }
        }, this);
      } else {
        if (!this.isMultiFieldView(this)) {
          this.oldVal = this.curVal;
        }
      }
      var data = {
        fieldvalue: this.getValue(),
        fieldid: this.options.dataId,
        fieldpath: this.options.path,
        targetfieldpath: this.options.path,
        fieldView: this
      };
      PubSub.trigger(this.options.dataId + 'dependentattrchanged', this);
      var event = $.Event('field:changed');
      _.extend(event, data);
      this.$el.trigger(event);
    },

    pullValidValues: function () {
      if (!this.alpacaField.schema.readonly) {
        if (!this.relationsFiltered) {
          this.filterRelations();
        }
        if (!this.valuesPulled) {
          this.options.enum = [];
          this.trigger('tkl:refresh');
          if (!this.isCustomView && this.node.attributes && this.node.attributes.fileObject &&
              this.node.attributes.fileObject.attributes &&
              this.node.attributes.fileObject.attributes.collection.node) {
            this.parentId = this.node.attributes.fileObject.attributes.collection.node.get('id');
          }

          var fullUrl,
              connector      = this.connector,
              nodeId         = this.isCustomView ? this.catId : (this.node.get('id') === undefined ?
                                                                 this.parentId ||
                                                                 this.node.get('parent_id') :
                                                                 this.node.get('id')),
              formData       = {
                'id': nodeId,
                'attribute_key': this.isCustomView ? this.options.alpaca.schema.fieldID :
                                 this.options.dataId
              },
              index          = 0,
              isValidRequest = true,
              parentPropertyId,
              parentViews,
              multiFieldParents,
              that           = this;
          var firstCatData = this.formView.alpaca.data[this.catId + "_1"];
          formData.version_number = (!!firstCatData && !!firstCatData.version_number) ?
                                    firstCatData.version_number : undefined;

          if (this.parentViews.length > 0) {
            var attribute_values = {};
            var isInsideSet = this.options.dataId.indexOf('x') !== -1 &&
                              this.options.dataId.match(/x/g).length === 1,
                lockedSet   = false;
            if (!isInsideSet) {
              lockedSet = isInsideSet = this.options.dataId.match(
                  new RegExp(this.options.dataId.substring(0,
                      this.options.dataId.indexOf("_")), 'g')).length > 1;
            }
            if (this.alpacaField.options.isMultiFieldItem) {
              if (!isInsideSet) {
                formData['attribute_key'] = (this.alpacaField.propertyId ||
                                             this.alpacaField.parent.propertyId) + '_' +
                                            this.getFieldIndex(this);
              }

              multiFieldParents = _.filter(this.parentViews,
                  function (parentView) { return !!that.isMultiFieldView(parentView) });

              if (this.alpacaField.options) {
                if (!!this.alpacaField.parent.schema.maxItems &&
                    this.alpacaField.parent.schema.maxItems !== 1 &&
                    multiFieldParents.length !== 0) {
                  index = this.getFieldIndex(this);
                } else {
                  index = 0;
                }

                this.parentViews.map(function (parent) {
                  parentViews = this.normalizeViews(parent);
                  if (!!parentViews[index]) {
                    if (isInsideSet) {
                      parentPropertyId = parentViews[index].options.dataId.split('_').slice(0,
                          lockedSet ? 2 : 3).join('_') + '_';
                    } else {
                      parentPropertyId = '';
                    }
                    parentPropertyId += (parentViews[index].alpacaField.propertyId ||
                                         parentViews[index].alpacaField.parent.propertyId);
                    attribute_values[parentPropertyId + '_' +
                                     index] = !parentViews[index].isNonTKLField ?
                                              parentViews[index].getValue() :
                                              parentViews[index].getDisplayValue();
                  } else {
                    if (!this.isMultiFieldView(parent)) {
                      parentPropertyId = (parent.alpacaField.propertyId ||
                                          parent.alpacaField.parent.propertyId);
                      attribute_values[parentPropertyId] = !parentViews[0].isNonTKLField ?
                                                           parentViews[0].getValue() :
                                                           parentViews[0].getDisplayValue();
                    } else {
                      isValidRequest = false;
                    }
                  }
                }, this);
              }
            } else {
              formData['attribute_key'] = this.isCustomView ? this.alpacaField.schema.fieldID :
                                          this.options.dataId;
              for (index = 0; index < this.parentViews.length; index++) {
                parentViews = this.normalizeViews(this.parentViews[index]);
                if (lockedSet) {
                  parentPropertyId = parentViews[index].options.dataId.split('_').slice(0, 2).join(
                      '_') + '_';
                  parentPropertyId += parentViews[0].alpacaField.propertyId ||
                                      parentViews[0].alpacaField.parent.propertyId;
                } else {
                  parentPropertyId = this.isCustomView ? parentViews[0].alpacaField.schema.fieldID :
                                     ((parentViews[0].alpacaField.propertyId ||
                                       parentViews[0].alpacaField.parent.propertyId));
                }

                attribute_values[parentPropertyId] = !parentViews[0].isNonTKLField ?
                                                     parentViews[0].getValue() :
                                                     parentViews[0].getDisplayValue();
              }
            }
            attribute_values = JSON.stringify(attribute_values);
            formData['attribute_values'] = attribute_values;
          }

          if (!this.isCustomView && this.node && this.node.get('subprocess_id')) {
            formData["subwork_id"] = this.node.get('subprocess_id');
          }

          if (isValidRequest) {
            if (this.isCustomView) {
              formData['version_number'] =
                  this.formView.alpaca.schema.properties.Category.properties['Category_' +
                                                                             this.catId]['OTCatVerNum'];
              formData["is_search"] = true;
            }
            fullUrl = connector.connection.url + '/tklattribute/validvalues';
            var ajaxOptions = {
              type: 'POST',
              url: fullUrl,
              data: formData
            };
            connector.extendAjaxOptions(ajaxOptions);
            $.ajax(ajaxOptions).done(_.bind(function ($, attributeKey, resp) {
              this.options.enum = resp[attributeKey];
              if (this.curVal && typeof this.options.enum[0] === 'number') {
                this.curVal = Number(this.curVal);
                this.oldVal = Number(this.oldVal);
              }
              this.trigger('tkl:refresh');
            }, this, $, formData['attribute_key'])).fail(function (resp) {
              that.valuesPulled = false;  // donot restrict rest call if error occurs
              if (!that.modalAlert) {
                require(['csui/dialogs/modal.alert/modal.alert'], function(ModalAlert) {
                  that.modalAlert = ModalAlert;
                  that.modalAlert.showError(resp.responseJSON.error);
                }); 
              } else {
                that.modalAlert.showError(resp.responseJSON.error);
              }       
            });
            this.valuesPulled = true;
          } else {
            this.options.enum.length = 0;
            this.trigger('tkl:refresh');
          }
        }
      }
    },

    refresh: function () {
      var el = this.ui.tklOptions;
      el.empty();
      var noneId = _.uniqueId('tklitem');
      el.append(
          $('<li id="' + noneId + '" role="option" class="active"><a title="' + Lang.tklFieldNone +
            '" tabindex="-1">' +
            Lang.tklFieldNone +
            '</a></li>'));
      this.options.enum.map(function (option) {
        var optId = _.uniqueId('tklitem');
        el.append($('<li id="' + optId + '" role="option"><a title="' + _.escape(option) +
                    '" tabindex="-1">' + _.escape(option) +
                    '</a></li>'));
      });
      this.searchBase = el.find('li');
      this.$el.is(':visible') && this.adjustPosition();
      this._behaviors[2]._destroyScrollbar();
      this.trigger('dom:refresh');
      this.trigger('update:scrollbar');
    },

    onClick: function (event) {
      var index         = $(event.target).closest('li').index(),
          value         = '',
          el            = $(event.target).closest('li'),
          curVal        = this.curVal,
          tklValue      = this.options.enum,
          alpacaFieldEl = this.$el.parents('.binf-form-group.alpaca-field');

      value = index === 0 ? '' : this.options.enum[index - 1];

      if (el.hasClass('cs-tkl-no-result')) {
        this.ui.writeField.focus();
      } else {
        if (this.options.alpacaField.isRequired()) {
          if (value !== '') {
            this.isValidTKLState = true;
            alpacaFieldEl.removeClass('binf-has-error alpaca-invalid');
            this.$el.removeClass('cs-formfield-invalid');
            alpacaFieldEl.find('.binf-help-block.alpaca-message').hide();
          }
          else {
            this.isValidTKLState = false;
          }
        }
        else {
          this.isValidTKLState = true;
          alpacaFieldEl.removeClass('binf-has-error alpaca-invalid');
          this.$el.removeClass('cs-formfield-invalid');
          alpacaFieldEl.find('.binf-help-block.alpaca-message').hide();

        }
        this.setValue(value);
        this.setSelection(el, true);
      }
    },

    setSlectionRange: function (input, selectionStart, selectionEnd) {
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionStart);
      } else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true)
            .moveEnd('character', selectionEnd)
            .moveStart('character', selectionStart)
            .select();
      }
    },

    setSelection: function (el, showApplyAll, callFromInputValidation) {
      this.ui.writeField.val(this.getValue());
      if (base.isMSBrowser() && !this.ui.writeField[0].setSlectionRange) {
        this.setSlectionRange(this.ui.writeField[0], this.ui.writeField.val().length,
            this.ui.writeField.val().length);
      }

      this.ui.tklOptions.find('.cs-tkl-selected').removeClass('cs-tkl-selected');
      el.addClass('cs-tkl-selected');
      if (!callFromInputValidation) {
        this.ui.writeField.focus();
        this.ui.tklOptionsContainer.removeClass('binf-show');
      }
      var obj = {},
          index;
      if (this.isMultiFieldView(this)) {
        index = this.alpacaField.parent.children.indexOf(this.alpacaField);
      }
      if (this.isCustomView) {
        obj[this.alpacaField.schema.fieldID] = this.getValue().toString();
      }
      else {
        obj[this.alpacaField.name] = this.getValue().toString();
      }
      this.getAllParents(obj, this.parentViews, index);
      this.getAllChildren(obj, this.children, index);
      var fullUrl = this.connector.connection.url.replace('/v1', '/v2') +
                    '/tklattribute/defaultvalues';
      var ajaxOptions = {
        type: 'POST',
        url: fullUrl,
        data: {
          attribute_key: this.isCustomView ? this.options.alpaca.schema.fieldID :
                         this.alpacaField.name,
          is_search: this.isCustomView,
          id: this.isCustomView ? this.templateId :
              (this.node.get('id') || this.node.get('parent_id')),
          attribute_values: JSON.stringify(obj) // Fix Me: Custom View Search issues due to
        }
      };

      if (!this.isCustomView && this.node && this.node.get('subprocess_id')) {
        ajaxOptions["data"]["subwork_id"] = this.node.get('subprocess_id');
      }

      this.connector.extendAjaxOptions(ajaxOptions);
      $.ajax(ajaxOptions).done(_.bind(function (resp) {
        this.autoPopulateChildrenValues(resp.results.data, this.children, index);
      }, this));
      if (showApplyAll && this.options.mode === "create") {
        var that = this;
        setTimeout(function (e) {
          that.ui.writeField.trigger('change');
          if (!!that.getEditableBehavior().showActions) {
            that.getEditableBehavior().showActions(e);
          }
          that.options.isDropDownOpen = false;
        }, 110);
      } else {
        if (!!this.getEditableBehavior().showActions) {
          this.getEditableBehavior().showActions(this);
        }
        this.options.isDropDownOpen = false;
      }
      this.isValidTKLState = true;
      delete this.needRerender;
    },
    getAllParents: function (obj, parents, index) {
      var value;
      parents.map(function (parent) {
        if (this.isMultiFieldView(parent)) {
          if (parent.parentRelations && parent.parentRelations.length) {
            this.getAllParents(obj, parent.parentRelations, index);
          }
          if (index === undefined) {
            parent.children.map(function (parent) {
              value = parent.getValue();
              obj[parent.name] = (value !== null && value !== undefined) ? value.toString() : "";
            });
          } else {
            value = parent.getValue()[index];
            obj[parent.name + '_' + index] = (value !== null && value !== undefined) ?
                                             value.toString() : "";
          }
        } else {
          if (parent.parentViews.length) {
            parent.getAllParents(obj, parent.parentViews, index);
          }
          value = parent.getValue();
          if (this.isCustomView) {
            obj[parent.alpacaField.schema.fieldID] = (value !== null && value !== undefined) ?
                                                     value.toString() : "";
          }
          else {
            obj[parent.alpacaField.name] = (value !== null && value !== undefined) ?
                                           value.toString() : "";
          }
        }
      }, this);
    },
    getAllChildren: function (obj, children, index) {
      children.map(function (child) {
        if (this.isMultiFieldView(child)) {
          if (child.childRelations && child.childRelations.length) {
            this.getAllChildren(obj, child.childRelations, index);
          } else {
            if (child.children[index] && child.children[index].fieldView.children.length) {
              this.getAllChildren(obj, child.children[index].fieldView.children, index);
            }
          }
          if (index === undefined) {
            child.children.map(function (child) {
              obj[child.name] = "";
            });
          } else {
            obj[child.name + '_' + index] = "";
          }
        } else {
          if (child.children.length) {
            child.getAllChildren(obj, child.children, index);
          }
          if (this.isCustomView) {
            obj[child.alpacaField.schema.fieldID] = "";
          }
          else {
            obj[child.alpacaField.name] = "";
          }
        }
      }, this);
    },
    autoPopulateChildrenValues: function (values, children, index) {
      children.map(function (child) {
        if (this.isMultiFieldView(child)) {
          if (child.childRelations && child.childRelations.length) {
            this.autoPopulateChildrenValues(values, child.childRelations, index);
          } else {
            if (child.children[index] && child.children[index].fieldView.children.length) {
              this.autoPopulateChildrenValues(values, child.children[index].fieldView.children,
                  index);
            }
          }
          if (index === undefined) {
            child.children.map(function (child) {
              child.fieldView.setValue(values[child.name]);
              child.fieldView.valuesPulled = false;
              child.fieldView.alpacaField.refreshValidationState();
            });
          }
          if (child.children[index] && (child.children[index].name in values)) {
            child.children[index].fieldView.valuesPulled = false;
            child.children[index].fieldView.setValue(values[child.children[index].name]);
            child.children[index].fieldView.alpacaField.refreshValidationState();
          }
        } else {
          if (!index) { // if mv parent and index > 0 don't change any dependent fields
            if (child.children.length) {
              child.autoPopulateChildrenValues(values, child.children, index);
            }
            if (this.isCustomView) {
              child.setValue(values[child.alpacaField.schema.fieldID]);
            } else {
              child.setValue(values[child.alpacaField.name]);
            }
            child.valuesPulled = false;
            child.alpacaField.refreshValidationState();
          }
        }
      }, this);
    },

    changeChildrenValues: function (children, parent, noReset) {
      var index, childViews,
          resetToNone = false,
          isInsideSet = this.options.dataId.indexOf('x') !== -1 &&
                        this.options.dataId.match(/x/g).length === 1;
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
            child.options.enum.length = 0;
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
              child.options.enum.length = 0;
              child.trigger('tkl:refresh');
            }
          });
        }
      }, parent || this);
    },

    normalizeViews: function (view) {
      var normalized = [];
      if (!!view.isTKLField || view.isNonTKLField) { //view == non mv
        this.pushView(normalized, view);
      } else {  //view == mv
        if (this.isMultiFieldView(view)) {
          view.children.map(function (child) {
            this.pushView(normalized, child.fieldView);
          }, this);
        } else {
          this.pushView(normalized, view.children[0].fieldView);
        }
      }
      return normalized;
    },

    isMultiFieldView: function (view) {
      return (!view.isTKLField && !view.isNonTKLField) ||
             (view.alpacaField.options.isMultiFieldItem && !!view.alpacaField.parent &&
              !!view.alpacaField.parent.schema.maxItems &&
              view.alpacaField.parent.schema.maxItems > 1);
    },

    getFieldIndex: function (view) {    //can't depend on dataId as it changes in mv
      if (view.alpacaField.options.isMultiFieldItem && !!view.alpacaField.parent.schema.maxItems &&
          view.alpacaField.parent.schema.maxItems !== 1) {
        return view.alpacaField.parent.children.indexOf(view.alpacaField);
      }
    },

    resetOldValueAfterCancel: function () {
      if (!!PubSub.tklHelpers) {
        var fieldEl,
            fieldView,
            i = PubSub.tklHelpers.viewsInWriteMode.length - 1;
        for (; !!PubSub.tklHelpers && i >= 0; i--) {
          fieldView = PubSub.tklHelpers.viewsInWriteMode[i];
          if (fieldView) {
            fieldView.isValidTKLState = true;
            if (this.isMultiFieldView(fieldView)) {
              if (fieldView.getStatesBehavior().state === 'write') {
                fieldView = fieldView.alpacaField.parent;
                fieldEl = fieldView.getFieldEl();
                if (fieldEl.find('.csui-bulk-edit-cancel').is(':visible')) {
                  fieldEl.find(".csui-bulk-edit").removeClass("binf-hidden");
                  fieldEl.find(".csui-bulk-edit-cancel").addClass("binf-hidden");
                  fieldEl.find(".csui-bulk-edit-submit").addClass("binf-hidden");
                  fieldView._hideInlineDeleteIcon();
                  fieldView._hideInlineAddIcon();
                  if (!!fieldView.options.prevChildData) {
                    fieldView.children = {};
                    fieldView.children = fieldView.options.prevChildData;
                  }
                  var data = fieldView.getPreviousData();
                  fieldView.refreshContainer(data, function () {
                    fieldView.options.prevChildDom = undefined;
                    fieldView.options.prevData = undefined;
                    fieldView.isWriteMode = false;
                  });
                }
              }
            } else {
              fieldView.alpacaField.parent.cancelClicked = true;
              fieldView.alpacaField.type === 'tkl' ? fieldView.setValue(fieldView.getOldValue()) :
              fieldView.getEditableBehavior()._resetOldValue();
              fieldView.alpacaField.refreshValidationState();
              fieldView.$el.removeClass('cs-formfield-invalid');
              fieldView.getEditableBehavior().setViewReadOnlyAndLeaveEditMode(false, false);
              this.ui.readField.focus();
            }
          }
        }
      }
    }
  });

  return TKLFieldView;
});
