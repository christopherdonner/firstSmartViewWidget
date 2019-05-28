/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.editable.behavior', 'csui/controls/form/pub.sub',
  "csui/utils/log"
], function (module, _, $, Handlebars, Marionette, FormFieldEditable2Behavior, PubSub, log) {
  "use strict";

  var FormArrayFieldEditable2Behavior = FormFieldEditable2Behavior.extend({

    jQuery: $,  //TODO: avoid this and it's occurrences.

    constructor: function FormArrayFieldEditable2Behavior(options, view) {
      FormFieldEditable2Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;

      this.tabContentSelectors += ', button.alpaca-array-actionbar-action:visible:not(:disabled),' +
                                  'button.csui-icon.apply-all:visible';
      if (options.tabContentSelectors) {
        if (options.overrideTabContentSelectors) {
          this.tabContentSelectors = options.tabContentSelectors;
        } else {
          this.tabContentSelectors += ', ' + options.tabContentSelectors;
        }
      }

      var propertyId = this.view.options.alpacaField.name.split('_')[0] + '_' +
                       this.view.options.alpacaField.name.split('_')[1];
      PubSub.off(propertyId + 'tkl:buildRelation');  //remove duplicate
      this.listenTo(PubSub, propertyId + 'tkl:buildRelation', this.buildRelation);

      this.view.getEditableBehavior = _.bind(function () {
        return this;
      }, this);
    },

    ui: function () {

      return _.extend({}, {
        editIcon: '.csui-icon-edit.icon-edit',
        cancelIcon: '.edit-cancel',
        icons: '.inline-edit-icon',

        readArea: '.cs-field-read',
        readAreaInner: '.cs-field-read-inner',
        writeArea: '.cs-field-write'
      }, this.view.ui);
    },

    events: function () {
      return _.extend({}, FormFieldEditable2Behavior.prototype.events, {
        'mouseenter @ui.writeArea': 'mouseInFieldArea',
        'mouseleave @ui.writeArea': 'mouseOutFieldArea',
        'focusin @ui.subInputField': 'actionOnFocusIn' // subInputFileds are like, images within
      });
    },

    buildRelation: function (childView) {
      if (!this.view.alpacaField.parent.childRelations) {
        this.view.alpacaField.parent.childRelations = [];
      }

      if (this.view.getEditableBehavior().isMultiFieldView(childView) &&
          !childView.alpacaField.parent.parentRelations) {
        childView.alpacaField.parent.parentRelations = [];
      }

      this.view.alpacaField.parent.children.forEach(function (view) {
        if (this.view.getEditableBehavior().isMultiFieldView(childView)) {
          if (this.view.alpacaField.parent.childRelations.indexOf(childView.alpacaField.parent) ===
              -1) {
            this.view.alpacaField.parent.childRelations.push(childView.alpacaField.parent);
          }
          if (!view.fieldView) {
            var interval = setInterval(function () {
              if (view.fieldView) {
                view.fieldView.childTKLViews.push(childView.alpacaField.parent);
                clearInterval(interval);
              }
            }, 10);
          } else {
            view.fieldView.childTKLViews.push(childView.alpacaField.parent);
          }

          if (childView.alpacaField.parent.parentRelations.indexOf(this.view.alpacaField.parent) ===
              -1) {
            childView.alpacaField.parent.parentRelations.push(this.view.alpacaField.parent);
          }
        } else {
          if (this.view.alpacaField.parent.childRelations.indexOf(childView) === -1) {
            this.view.alpacaField.parent.childRelations.push(childView);
          }
          view.fieldView.childTKLViews.push(childView);
          if (childView.parentViews.indexOf(this.view.alpacaField.parent) === -1) {
            childView.parentViews.push(this.view.alpacaField.parent);
          }
        }

      }, this);
      if (childView.parentViews.indexOf(this.view.alpacaField.parent) === -1) {
        childView.parentViews.push(this.view.alpacaField.parent);
      }

    },

    onMouseOverRead: function () {
      if (this.view.getStatesBehavior().isReadOnly()) {
        return;
      }
      if (this.options.mode !== 'create' && !this.mouseOverTimeout &&
          this.jQuery(".cs-form .cs-formfield-invalid").length === 0) {
        this.mouseOverTimeout = setTimeout(_.bind(this._showEditIcon, this), 300);
      }
    },

    onFocusInWrite: function (event) {
      this.checkAndScrollElemToViewport(event.currentTarget);
      this.$el.find("input").select();
      this.$el.find("textarea").select();
      if (this.$el.closest('.cs-form-set-container:not(.csui-multivalue-container)').length > 0) {
        var prevElementsInFocus = this.$el.closest(
            '.cs-form-set-container:not(.csui-multivalue-container)').find('.csui-current-focused');
        if (prevElementsInFocus.length > 0) {
          prevElementsInFocus.removeClass('csui-current-focused');
        }
        $(event.target).addClass('csui-current-focused');
      }
      if (((this.view.alpacaField && this.view.alpacaField.schema.type === "otcs_user_picker") ||
           (this.view.alpacaField && this.view.alpacaField.schema.type === "otcs_member_picker")) &&
          event.target !== event.relatedTarget) {
        var openedDropDown = this.$el.closest(
            '.cs-form-set-container:not(.csui-multivalue-container)').find(
            '.binf-open');
        if (openedDropDown.length > 0) {
          openedDropDown.find('.binf-dropdown-toggle').binf_dropdown('toggle');
        }
      }
      if (this.view.getStatesBehavior().state === "write") {
        this._showOrHideInlineActionButtons(event);
      }
      if (this.view.getStatesBehavior().isReadOnly()) {
        return;
      }
      if (this.view.options.path && this.view.options.path.split("/").length === 2) { //Multivalue
        this.$el.parents(".cs-form-set-container").find(".alpaca-array-actionbar").unbind(
            "mouseenter").bind('mouseenter', _.bind(this.mouseInActionArea, this));
        this.$el.parents(".cs-form-set-container").find(".alpaca-array-actionbar").unbind(
            "mouseleave").bind('mouseleave', _.bind(this.mouseOutActionArea, this));
      } else { //Set
        var currBlock = this.jQuery(event.target).closest(
            ".cs-form-set-container").parent().closest(".cs-pull-left");
        if (currBlock.length === 0) {
          currBlock = this.jQuery(event.target).closest(".cs-pull-left");
        }
        currBlock.parent().siblings().unbind("mouseenter").bind(
            'mouseenter', _.bind(this.mouseInArrayActionArea, this));
        currBlock.parent().siblings().unbind("mouseleave").bind(
            'mouseleave', _.bind(this.mouseOutArrayActionArea, this));
        currBlock.parent().unbind("mouseenter").bind(
            'mouseenter', _.bind(this.mouseInArrayActionArea, this));
        currBlock.parent().unbind("mouseleave").bind(
            'mouseleave', _.bind(this.mouseOutArrayActionArea, this));
        if (currBlock.find(".alpaca-array-actionbar").length === 0) {
          currBlock.parent().find(".alpaca-array-actionbar").unbind("mouseenter").bind('mouseenter',
              _.bind(this.mouseInActionArea, this));
          currBlock.parent().find(".alpaca-array-actionbar").unbind("mouseleave").bind('mouseleave',
              _.bind(this.mouseOutActionArea, this));
        } else {
          currBlock.find(".alpaca-array-actionbar").unbind("mouseenter").bind('mouseenter',
              _.bind(this.mouseInActionArea, this));
          currBlock.find(".alpaca-array-actionbar").unbind("mouseleave").bind('mouseleave',
              _.bind(this.mouseOutActionArea, this));
        }
        currBlock.parent().siblings().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseenter").bind('mouseenter', _.bind(this.mouseInActionArea, this));
        currBlock.parent().siblings().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseleave").bind('mouseleave', _.bind(this.mouseOutActionArea, this));
        currBlock.parent().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseenter").bind('mouseenter', _.bind(this.mouseInActionArea, this));
        currBlock.parent().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseleave").bind('mouseleave', _.bind(this.mouseOutActionArea, this));
        if (currBlock.siblings(".cs-pull-right").length > 0) {
          if (currBlock.siblings(".cs-pull-right").find(".circle_add_grey").parent().hasClass(
                  "alpaca-button-disabled") &&
              currBlock.siblings(".cs-pull-right").find(".circle_delete_grey").parent().hasClass(
                  "alpaca-button-disabled")) {
            currBlock.siblings(".cs-pull-right").removeClass("csui-set-action-bar");
          } else if (!currBlock.siblings(".cs-pull-right").find(
                  ".circle_add_grey").parent().hasClass("alpaca-button-disabled") ||
                     !currBlock.siblings(".cs-pull-right").find(
                         ".circle_delete_grey").parent().hasClass("alpaca-button-disabled")) {
            currBlock.siblings(".cs-pull-right").addClass("csui-set-action-bar");
          }
        }
      }
      return false;
    },
    actionOnFocusIn: function (event) {
      this.checkAndScrollElemToViewport(event.currentTarget);
      if (this.view.getStatesBehavior().state === "write") {
        this._showOrHideInlineActionButtons(event);
      }
      if (this.view.getStatesBehavior().isReadOnly() ||
          this.view.getStatesBehavior().state === "read") {
        return;
      }
      if (this.view.options.path && this.view.options.path.split("/").length === 2) { //Multivalue
        this.$el.parents(".cs-form-set-container").find(".alpaca-array-actionbar").unbind(
            "mouseenter").bind('mouseenter', _.bind(this.mouseInActionArea, this));
        this.$el.parents(".cs-form-set-container").find(".alpaca-array-actionbar").unbind(
            "mouseleave").bind('mouseleave', _.bind(this.mouseOutActionArea, this));
      } else { //Set
        var currBlock = this.jQuery(event.target).closest(
            ".cs-form-set-container").parent().closest(".cs-pull-left");
        if (currBlock.length === 0) {
          currBlock = this.jQuery(event.target).closest(".cs-pull-left");
        }
        if (currBlock.find(".alpaca-array-actionbar").length === 0) {
          currBlock.parent().find(".alpaca-array-actionbar").unbind("mouseenter").bind('mouseenter',
              _.bind(this.mouseInActionArea, this));
          currBlock.parent().find(".alpaca-array-actionbar").unbind("mouseleave").bind('mouseleave',
              _.bind(this.mouseOutActionArea, this));
        } else {
          currBlock.find(".alpaca-array-actionbar").unbind("mouseenter").bind('mouseenter',
              _.bind(this.mouseInActionArea, this));
          currBlock.find(".alpaca-array-actionbar").unbind("mouseleave").bind('mouseleave',
              _.bind(this.mouseOutActionArea, this));
        }
        currBlock.parent().siblings().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseenter").bind('mouseenter', _.bind(this.mouseInActionArea, this));
        currBlock.parent().siblings().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseleave").bind('mouseleave', _.bind(this.mouseOutActionArea, this));
        currBlock.parent().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseenter").bind('mouseenter', _.bind(this.mouseInActionArea, this));
        currBlock.parent().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseleave").bind('mouseleave', _.bind(this.mouseOutActionArea, this));
        if (currBlock.siblings(".cs-pull-right").length > 0) {
          if (currBlock.siblings(".cs-pull-right").find(".circle_add_grey").parent().hasClass(
                  "alpaca-button-disabled") &&
              currBlock.siblings(".cs-pull-right").find(".circle_delete_grey").parent().hasClass(
                  "alpaca-button-disabled")) {
            currBlock.siblings(".cs-pull-right").removeClass("csui-set-action-bar");
          } else if (!currBlock.siblings(".cs-pull-right").find(
                  ".circle_add_grey").parent().hasClass("alpaca-button-disabled") ||
                     !currBlock.siblings(".cs-pull-right").find(
                         ".circle_delete_grey").parent().hasClass("alpaca-button-disabled")) {
            currBlock.siblings(".cs-pull-right").addClass("csui-set-action-bar");
          }
        }
      }
      return;
    },

    _showOrHideInlineActionButtons: function (event) {
      var setContainerParents = this.$el.parents(".cs-form-set-container"),
          setContainerEle     = setContainerParents[setContainerParents.length - 1],
          containerEle        = this.jQuery(setContainerEle),
          focusedContainerEle = this.jQuery(event.target).closest(".cs-form-set-container");

      if (!this.isDropDownOpen()) {
        containerEle.find(".cs-array .cs-pull-right").find(".circle_delete_grey").parent().addClass(
            "binf-hidden");
        containerEle.find(".cs-array .cs-pull-right").find(".circle_add_grey").parent().addClass(
            "binf-hidden");
        focusedContainerEle.find(".circle_add_grey").parent().addClass("binf-hidden");
        this.$el.parent().closest(".cs-form-set-container").find(
            ".circle_delete_grey").parent().addClass("binf-hidden");
      }

      var inputElement = null;
      if (this.view.options.path && this.view.options.path.split("/").length === 2) {
        if (containerEle.length > 0) {
          inputElement = $(
              containerEle.find(".cs-array .cs-pull-left").find(".cs-field-write-inner").first());
        } else if (focusedContainerEle.length > 0) {
          inputElement = $(focusedContainerEle.find(".cs-array .cs-pull-left").find(
              ".cs-field-write-inner").first());
        }
      } else {
        if (containerEle.length > 0) {
          inputElement = $(
              containerEle.find(".cs-array .cs-pull-left").find(".cs-field-write-inner").first());
        } else if (focusedContainerEle.length > 0) {
          inputElement = $(focusedContainerEle.find(".cs-array .cs-pull-left").find(
              ".cs-field-write-inner").first());
        }
        var setParentHeight = focusedContainerEle.parents(".cs-array").height();
        if (focusedContainerEle.parent().hasClass("cs-form-multi-action-container")) {
          focusedContainerEle.parents(".cs-array").find(">.cs-pull-right").find(
              "button[data-alpaca-array-actionbar-action*='add']").css("top",
              parseInt(setParentHeight) / 2);
          focusedContainerEle.parents(".cs-form-set-container").not(
              ".csui-multivalue-block").find(">.cs-array:first-child").find(">.cs-pull-right").find(
              "button[data-alpaca-array-actionbar-action*='remove']").css("top", 14);
        }
        focusedContainerEle.parents(".cs-array").find(">.cs-pull-right").find(
            "button[data-alpaca-array-actionbar-action*='remove']").addClass(
            "cs-array-set-remove-align");
      }

      var textFieldHeight = parseInt(this.$el.outerHeight());
      var currBlock = this.$el.parent().closest(".alpaca-container-item");
      if (!this.isDropDownOpen()) {
        currBlock.find(".circle_delete_grey").parent().removeClass("binf-hidden");
        currBlock.find(".circle_add_grey").removeClass(
            "alpaca-button-disabled").parent().removeClass(
            "binf-hidden");
      }
      if (currBlock.hasClass("cs-form-multi-action-container") ||
          currBlock.parent().hasClass("cs-form-multi-action-container")) {
        currBlock.find(".circle_delete_grey").parent().css("top", ((textFieldHeight / 2) - 7));
        currBlock.find(".circle_add_grey").parent().css("top", (textFieldHeight - 7));
      }
      currBlock = this.$el.closest(".cs-pull-left").siblings(".cs-pull-right");
      if (!this.isDropDownOpen()) {
        currBlock.find(".circle_delete_grey").parent().removeClass("binf-hidden");
        currBlock.find(".circle_add_grey").removeClass(
            "alpaca-button-disabled").parent().removeClass(
            "binf-hidden");
      }
      if (focusedContainerEle.parent().closest(".cs-pull-left")) {
        currBlock = focusedContainerEle.parent().closest(".cs-pull-left").siblings(
            ".cs-pull-right");
        if (!this.isDropDownOpen()) {
          currBlock.find(".circle_delete_grey").parent().removeClass("binf-hidden");
          currBlock.find(".circle_add_grey").removeClass(
              "alpaca-button-disabled").parent().removeClass("binf-hidden");
        }
        if (currBlock.find(".circle_add_grey").parent().hasClass("alpaca-button-disabled") ||
            currBlock.find(".circle_delete_grey").parent().hasClass("alpaca-button-disabled")) {
        }
      }
    },

    onFocusOutWrite: function (event) {
      $(event.target).parents(".csui-normal-scrolling").css("overflow", "auto");

      if (this.view.isFocusedOut !== undefined && this.view.isFocusedOut(event)) {
        return false;
      }
      if (this.view.options.path && this.view.options.path.split("/").length === 2) { //Multivalue
        this.$el.parents(".cs-form-set-container").find(".alpaca-array-actionbar").unbind(
            "mouseenter");
        this.$el.parents(".cs-form-set-container").find(".alpaca-array-actionbar").unbind(
            "mouseleave");
      } else { //Set
        currBlock = this.jQuery(event.target).closest(
            ".cs-form-set-container").parent().closest(".cs-pull-left");
        if (currBlock.length === 0) {
          currBlock = this.jQuery(event.target).closest(".cs-pull-left");
        }
        currBlock.parent().siblings().unbind("mouseenter");
        currBlock.parent().siblings().unbind("mouseleave");
        currBlock.parent().unbind("mouseenter");
        currBlock.parent().unbind("mouseleave");
        if (currBlock.find(".alpaca-array-actionbar").length === 0) {
          currBlock.parent().find(".alpaca-array-actionbar").unbind("mouseenter");
          currBlock.parent().find(".alpaca-array-actionbar").unbind("mouseleave");
        } else {
          currBlock.find(".alpaca-array-actionbar").unbind("mouseenter");
          currBlock.find(".alpaca-array-actionbar").unbind("mouseleave");
        }
        currBlock.parent().siblings().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseenter");
        currBlock.parent().siblings().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseleave");
        currBlock.parent().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseenter");
        currBlock.parent().find(".cs-pull-left").find(".alpaca-array-actionbar").unbind(
            "mouseleave");
        if (currBlock.siblings(".cs-pull-right").length > 0) {
          if (currBlock.siblings(".cs-pull-right").find(".circle_add_grey").parent().hasClass(
                  "alpaca-button-disabled") &&
              currBlock.siblings(".cs-pull-right").find(".circle_delete_grey").parent().hasClass(
                  "alpaca-button-disabled")) {
            currBlock.siblings(".cs-pull-right").removeClass("csui-set-action-bar");
          } else if (!currBlock.siblings(".cs-pull-right").find(
                  ".circle_add_grey").parent().hasClass("alpaca-button-disabled") ||
                     !currBlock.siblings(".cs-pull-right").find(
                         ".circle_delete_grey").parent().hasClass("alpaca-button-disabled")) {
            currBlock.siblings(".cs-pull-right").addClass("csui-set-action-bar");
          }
        }
      }
      var focusedContainerEle = this.jQuery(event.target).closest(".cs-form-set-container"),
          currBlock           = focusedContainerEle.parent().closest(".cs-pull-left").siblings(
              ".cs-pull-right"),
          currElementBlock    = this.$el.closest(".cs-pull-left").siblings(".cs-pull-right");
      if (this.view.userPicked !== undefined) {
        this.view.options.isDropDownOpen = false;
        if (event.target.value !== '') {
          if (!this.view.userPicked) {
            this.view.alpacaField && this.view.alpacaField.refreshValidationState(false);
            this.$el.addClass('cs-formfield-invalid');
            this.$el.trigger($.Event('field:invalid'));
            return;
          } else {
            this.$el.removeClass('cs-formfield-invalid');
          }
        }
      }

      if ((!this.view.isReadyToSave() || this.escapePressed || this.mouseDownCancel ||
           this.jQuery(event.relatedTarget).hasClass("csui-icon-edit")) &&
          (this.view.alpacaField.type !== "select" && this.view.alpacaField.type !== 'tkl')) {
        this.mouseDownCancel = false;
        if (this.view.alpacaField && this.view.alpacaField.options.mode === 'create') {
          currBlock.find(".circle_delete_grey").parent().addClass("binf-hidden");
          currBlock.find(".circle_add_grey").parent().addClass("binf-hidden");
        }
      } else {
        var editVal          = this.view.getEditValue(), // new value
            curVal           = this.view.getValue(),  // old value
            bIsValid         = editVal !== curVal,
            focusInsideBlock = $.contains(this.view.alpacaField.parent.getFieldEl()[0],
                event.relatedTarget);

        if (this.view.alpacaField && this.view.alpacaField.type === "select") {
          this.view.oldVal = this.view.curVal;
          bIsValid = this.trySetValue();
        } else if (this.view.alpacaField && this.view.alpacaField.type === "tkl") {
          bIsValid = this.trySetValue();
        }
        else {
          var defaultValidate = this.view.alpacaField.options.validate;
          if (!!this.view.alpacaField.options.inContainer) {
            if (editVal != null && editVal.trim && editVal.trim()) {
              this.view.alpacaField.options.validate = true;
            } else {
              var arrayValidations = this.view.alpacaField.validation;
              for (var validation in arrayValidations) {
                if (arrayValidations[validation] !== undefined) {
                  arrayValidations[validation]["status"] = true;
                  arrayValidations[validation]["message"] = "";
                }
              }
            }
          }
          bIsValid = this.view.alpacaField.setValueAndValidate(editVal, true);

          this.view.alpacaField.options.validate = defaultValidate;
        }

        var currentValue = this.view.alpacaField.type === 'integer' && this.view.curVal !== null ?
                           this.view.curVal.toString() :
                           this.view.curVal,
            editValue    = this.view.getEditValue();

        if (this.view.alpacaField.type === "select") {
          currentValue = this.view.curVal.get('id');
          editValue = this.view.getEditValue().get('id');
        }

        var restrictReadTransition =
                this.view.getEditableBehavior().isRelatedFieldInFocus(event.relatedTarget);
        if (currentValue !== editValue) {
          this.view.getEditableBehavior().changeChildrenValues(
              this.view.alpacaField.parent.childRelations);
        }

        if ((!this.options.isSetType && restrictReadTransition) ||
            $(event.relatedTarget).closest('.cs-tkl-options').length > 0) {
          this.view.alpacaField.parent.turnToReadMode = false;
          return;
        }
        this.view.alpacaField.parent.turnToReadMode = true;

        if (this.view.alpacaField.options.mode === 'create' &&
            !this.jQuery(event.relatedTarget).parent().hasClass("alpaca-array-actionbar") &&
            (!!event.relatedTarget &&
            !event.relatedTarget.classList.contains('icon-date_picker'))) {
          currBlock = this.jQuery(event.target).closest(".cs-form-set-container").find(
              ".cs-pull-left");
          currElementBlock = this.jQuery(event.target).closest(".cs-form-set-container").find(
              ".cs-pull-left").find(".cs-pull-right");
          currBlock.find(".circle_delete_grey").parent().addClass("binf-hidden");
          currBlock.find(".circle_add_grey").parent().addClass("binf-hidden");
          currElementBlock.find(".circle_delete_grey").parent().addClass("binf-hidden");
          currElementBlock.find(".circle_add_grey").parent().addClass("binf-hidden");
        }
        if (bIsValid) {
          this.$el.removeClass('cs-formfield-invalid');
          bIsValid = this.view.alpacaField.setValueAndValidate(editValue, true);
          if (editVal && !editVal.toString().length && bIsValid && this.view.isTKLField) {
            this.view.changeChildrenValues(this.view.children);
          }
        } else {
          this.$el.addClass('cs-formfield-invalid');
          this.$el.trigger($.Event('field:invalid'));
        }
        return;
      }

      var scrollableCols = $(event.target).closest('.csui-scrollable-writemode');
      if (!!scrollableCols && scrollableCols.hasClass('csui-dropdown-open')) {
        scrollableCols.removeClass('csui-dropdown-open');
      }

      return;
    },

    _showApplyAll: function (event) {
      if (!!this.view.options.alpaca && this.view.options.alpaca.options.mode === "create") {
        var iconEl = this.$(event.target).closest('.alpaca-field-array').find(
            '.csui-icon.apply-all.block:first').length > 0 ?
                     this.$(event.target).closest('.alpaca-field-array').find(
                         '.csui-icon.apply-all.block:first') :
                     this.$(event.target).closest('.alpaca-field-array').children(
                         '.cs-form-set-container').length > 0 ?
                     this.$(event.target).closest('.alpaca-field-array').parents(
                         '.alpaca-field-array').find('.csui-icon.apply-all.block:first') :
                     this.$(event.target).closest('.alpaca-field-array').closest(
                         '.csui-form-set-array-wrapper').find('.csui-icon.apply-all.block:first');
        var displayedApplyButton = this.$el.closest('.cs-metadata-properties').find(
            '.csui-icon.apply-all').not('.binf-hidden');
        displayedApplyButton = displayedApplyButton.filter(
            function (index, applybutton) {
              applybutton = applybutton !== iconEl[0] ? applybutton : undefined;
              return applybutton;
            });
        if (!!displayedApplyButton && displayedApplyButton.length > 0) {
          displayedApplyButton['addClass']('binf-hidden');
          displayedApplyButton.parent().addClass('binf-hidden');
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
    },

    onReadAreaClicked: function (e) {
      if (this.options.mode !== 'create' &&
          $(".cs-form .cs-formfield-invalid").length === 0) {
        if (this.view.getStatesBehavior().isReadOnly()) {
          return;
        }
        var editIconClicked = e.target.classList.contains("icon-edit");
        if (this.view.mode !== "writeonly") {
          if (editIconClicked || this.view.allowEditOnClickReadArea(e)) {
            e.stopImmediatePropagation();
            e.preventDefault();
            var e_ = e;
            var respBulkEditEle = $(".csui-bulk-edit-" + this.view.options.dataId.slice(0,
                    this.view.options.dataId.indexOf("_",
                                    this.view.options.dataId.indexOf("_") + 1)));
            if (!!respBulkEditEle && respBulkEditEle.length === 0) {
              respBulkEditEle = this.jQuery(e_.target).closest(
                  ".cs-form-set-container").parent().find(".csui-bulk-edit");
            }
            $(respBulkEditEle).closest(".csui-array-bulk-edit").removeClass("binf-hidden");
            $(respBulkEditEle).click().click();
            this.setViewStateWriteAndEnterEditMode();
          }
        }
      } else {
        $($(".cs-form .cs-formfield-invalid")[0]).find(":input").focus().focus();
        return;
      }
    },

    setViewStateWriteAndEnterEditMode: function () {
      if (this.view.getStatesBehavior().isReadOnly()) {
        return;
      }
      var focus    = true,
          validate = false; //Don't validate on turning field to edit mode
      if (this.view.alpacaField && !this.view.alpacaField.options.isMultiFieldItem &&
          this.view.alpacaField.type === "select") {
        this.view.$el.find(".binf-dropdown-toggle").trigger("click");
      }
      this.view.getStatesBehavior().setStateWrite(validate, focus);
      this.adjustSetRows();
      return;
    },

    setViewReadOnlyAndLeaveEditMode: function (validate, focus) {
      if (this.view.getStatesBehavior().isWriteOnly()) {
        return;
      }
      this.view.getStatesBehavior().setStateRead(focus);
      return;
    },

    onKeyDown: function (event) {
      this.escapePressed = false;
      this.tabPressed = false;

      if (event.keyCode === 27) { //escape: cancel the block.

        var respBulkCancelEle = $(".csui-bulk-edit-cancel-" + this.view.options.dataId.slice(0,
                this.view.options.dataId.indexOf("_",
                                  this.view.options.dataId.indexOf("_") + 1)));
        if (!!respBulkCancelEle && respBulkCancelEle.length === 0) {
          respBulkCancelEle = this.jQuery(event.target).closest(
              ".cs-form-set-container").parent().find(".csui-bulk-edit-cancel");
        }
        if (this.view.mode !== 'writeonly') {
          if (!this.isDropDownOpen()) {
            $(respBulkCancelEle).click();
          }
        }

      } else if (event.keyCode === 9) { // tab
        this.tabPressed = true;
        !!this.view.handleTabKey && this.view.handleTabKey(event);
        if ((this.view.options.mode ||
             (this.view.alpacaField && this.view.alpacaField.options.mode)) !== 'create'
            && this.view.getStatesBehavior().isStateWrite()) {
          this.moveTab(event);
        }
      }

      return;
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

    mouseInFieldArea: function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (this.view.getStatesBehavior().state === "write") {
        this.$el.closest(".cs-array").find(".csui-shadowright-container").unbind(
            "mouseenter").bind('mouseenter', _.bind(this.mouseInFieldArea, this));
      }

      if (this.view.getStatesBehavior().isStateRead()) {
        return;
      }
      var currBlock = this.$el.closest(".cs-pull-left"), currSetBlock;
      if (this.$el.parents(".cs-form-set-container").find(document.activeElement).length <= 1 ||
          this.$el.find(document.activeElement).length <= 1) {
        currBlock.siblings(".cs-pull-right").find(
            ".circle_add_grey").parent().removeClass("binf-hidden");
        currBlock.siblings(".cs-pull-right").find(
            ".circle_delete_grey").parent().removeClass("binf-hidden");
      }
      if (this.view.options.path && this.view.options.path.split("/").length > 2 &&
          this.$el.find(document.activeElement).length > 0) {
        currBlock.siblings(".cs-pull-right").find(
            ".circle_add_grey").parent().removeClass("binf-hidden");
        currBlock.siblings(".cs-pull-right").find(
            ".circle_delete_grey").parent().removeClass("binf-hidden");
        currBlock.parents(".cs-pull-left").siblings(".cs-pull-right").find(
            ".circle_add_grey").parent().removeClass("binf-hidden");
        currBlock.parents(".cs-pull-left").siblings(".cs-pull-right").find(
            ".circle_delete_grey").parent().removeClass("binf-hidden");

        currSetBlock = currBlock.parents(".cs-pull-left").length > 0 ?
                       currBlock.parents(".cs-pull-left") : currBlock;
        this._alignSetContainerActionButtons(currSetBlock);
      }
      if (this.view.options.path && this.view.options.path.split("/").length === 2) {
        this._alignMultiFieldContainerActionButtons(currBlock);
      } else {
        this._alignMultiFieldContainerActionButtons(currBlock);
        currSetBlock = currBlock.parents(".cs-pull-left").length > 0 ?
                       currBlock.parents(".cs-pull-left") : currBlock;
        currSetBlock.siblings(".cs-pull-right").find(
            ".circle_delete_grey").parent().addClass("cs-array-set-remove-align");
        this._alignSetContainerActionButtons(currSetBlock);
      }

      if (this.view.alpacaField.type !== "select" && this.view.options.isDropDownOpen) {
        this.hideActions(event);
      } else if (this.view.alpacaField.type === "select" &&
                 (!!this.view.isDropdownOpen && this.view.isDropdownOpen())) {
        this.hideActions(event);
      } else {
        this.showActions(event);
      }
      return true;
    },

    _alignMultiFieldContainerActionButtons: function (currBlock) {
      var fieldHeight      = this.$el.height(),
          currBlockActions = currBlock.siblings(".cs-pull-right");
      if (currBlock.parent().hasClass("cs-form-multi-action-container")) {
        currBlockActions.find(".circle_add_grey").parent().css("top", fieldHeight - 7);
        currBlockActions.find(".circle_delete_grey").parent().css("top", ((fieldHeight / 2) - 7));
      }
    },

    _alignSetContainerActionButtons: function (currSetBlock) {
      var currBlockActionContainer = currSetBlock.siblings(".cs-pull-right");
      currBlockActionContainer.find(".circle_add_grey").parent().removeClass("binf-hidden");
      currBlockActionContainer.find(".circle_delete_grey").parent().removeClass("binf-hidden");
      if (!(currBlockActionContainer.find(".circle_add_grey").parent().hasClass(
              "alpaca-button-disabled") &&
            currBlockActionContainer.find(".circle_delete_grey").parent().hasClass(
                "alpaca-button-disabled"))) {
        currBlockActionContainer.addClass("csui-set-action-bar");
      }
      if (currBlockActionContainer.find(".circle_add_grey").parent().hasClass(
              "alpaca-button-disabled") ||
          currBlockActionContainer.find(".circle_delete_grey").parent().hasClass(
              "alpaca-button-disabled")) {
      }
    },

    mouseOutFieldArea: function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.view.getStatesBehavior().isStateRead()) {
        return;
      }
      var currBlock                   = this.$el.closest(".cs-pull-left"),
          currBlockActionContainer    = currBlock.siblings(".cs-pull-right"),
          currSetBlock                = currBlock.parents(".cs-pull-left").length > 0 ?
                                        currBlock.parents(".cs-pull-left") : currBlock,
          currSetBlockActionContainer = currSetBlock.siblings(".cs-pull-right");
      if ((this.$el.parents(".cs-form-set-container").find(document.activeElement).length === 0 ||
           this.$el.find(document.activeElement).length === 0) &&
          currBlockActionContainer.find(document.activeElement).length === 0) {
        if (this.view.alpacaField.schema.type !== "boolean") {
          currBlockActionContainer.find(".circle_add_grey").parent().addClass("binf-hidden");
          currBlockActionContainer.find(".circle_delete_grey").parent().addClass("binf-hidden");
        }
      }
      if (!currSetBlockActionContainer.is(":visible")) {
        currSetBlockActionContainer.removeClass("csui-set-action-bar");
      }
      return true;
    },

    mouseInActionArea: function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.view.getStatesBehavior().isStateRead()) {
        return;
      }
      this.jQuery(event.target).closest(".cs-pull-right").find(
          ".circle_add_grey").parent().removeClass("binf-hidden");
      this.jQuery(event.target).closest(".cs-pull-right").find(
          ".circle_delete_grey").parent().removeClass("binf-hidden");
    },

    mouseOutActionArea: function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.view.getStatesBehavior().isStateRead()) {
        return;
      }
      if (this.jQuery(document.activeElement).parents(".cs-pull-right").length === 0) {
        if (this.jQuery(document.activeElement).parent().closest(".cs-pull-left").siblings(
                ".cs-pull-right").find(event.target).length === 0) {
          this.jQuery(event.target).closest(".cs-pull-right").find(
              ".circle_add_grey").parent().addClass("binf-hidden");
          this.jQuery(event.target).closest(".cs-pull-right").find(
              ".circle_delete_grey").parent().addClass("binf-hidden");
        }
      } else if (this.jQuery(document.activeElement).parents(".cs-pull-right").length === 1) {
        if (this.jQuery(document.activeElement).parent().closest(".cs-pull-right").find(
                event.target).length === 0) {
          this.jQuery(event.target).closest(".cs-pull-right").find(
              ".circle_add_grey").parent().addClass("binf-hidden");
          this.jQuery(event.target).closest(".cs-pull-right").find(
              ".circle_delete_grey").parent().addClass("binf-hidden");
        }
      }
    },

    mouseInArrayActionArea: function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.view.getStatesBehavior().isStateRead()) {
        return;
      }
      var focusedBlock = this.jQuery(event.target).closest(".cs-array");
      if (focusedBlock.find(document.activeElement).length === 0) {
        focusedBlock.children(".cs-pull-right").find(".circle_delete_grey").parent().removeClass(
            "binf-hidden");
        focusedBlock.children(".cs-pull-right").find(".circle_add_grey").removeClass(
            "alpaca-button-disabled").parent().removeClass("binf-hidden");
      }
      if (focusedBlock.children(".cs-pull-right").is(":visible")) {
        var currBlock = focusedBlock.children(".cs-pull-right");
        if (!currBlock.find(".circle_add_grey").parent().hasClass("alpaca-button-disabled") ||
            !currBlock.find(".circle_delete_grey").parent().hasClass("alpaca-button-disabled")) {
          currBlock.addClass("csui-set-action-bar");
        }
      }
    },

    mouseOutArrayActionArea: function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.view.getStatesBehavior().isStateRead()) {
        return;
      }
      var focusedBlock = this.jQuery(event.target).closest(".cs-array");
      if (focusedBlock.find(document.activeElement).length === 0) {
        focusedBlock.children(".cs-pull-right").find(".circle_delete_grey").parent().addClass(
            "binf-hidden");
        focusedBlock.children(".cs-pull-right").find(".circle_add_grey").removeClass(
            "alpaca-button-disabled").parent().addClass("binf-hidden");
      } else {
        focusedBlock.children(".cs-pull-right").find(".circle_delete_grey").parent().removeClass(
            "binf-hidden");
        focusedBlock.children(".cs-pull-right").find(".circle_add_grey").removeClass(
            "alpaca-button-disabled").parent().removeClass("binf-hidden");
      }
      focusedBlock.children(".cs-pull-right").removeClass("csui-set-action-bar");
    },

    showActions: function (event) {
      if (this.$el.closest(".cs-pull-left") &&
          this.$el.closest(".cs-pull-left").siblings(".cs-pull-right") &&
          this.$el.closest(".cs-pull-left").siblings(".cs-pull-right").find(
              ".circle_add_grey").parent().hasClass("binf-hidden")) {
        this.$el.closest(".cs-pull-left").siblings(".cs-pull-right").find(
            ".circle_add_grey").parent().removeClass("binf-hidden");
      }
      if (this.$el.closest(".cs-pull-left") &&
          this.$el.closest(".cs-pull-left").siblings(".cs-pull-right") &&
          this.$el.closest(".cs-pull-left").siblings(".cs-pull-right").find(
              ".circle_delete_grey").parent().hasClass("binf-hidden")) {
        this.$el.closest(".cs-pull-left").siblings(".cs-pull-right").find(
            ".circle_delete_grey").parent().removeClass("binf-hidden");
      }
    },

    hideActions: function (event) {
      if (this.$el.closest(".cs-form-set-container").hasClass("csui-multivalue-container")) {
        if (this.$el.closest(".cs-pull-left") &&
            this.$el.closest(".cs-pull-left").siblings(".cs-pull-right") &&
            !this.$el.closest(".cs-pull-left").siblings(".cs-pull-right").find(
                ".circle_add_grey").parent().hasClass("binf-hidden")) {
          this.$el.closest(".cs-pull-left").siblings(".cs-pull-right").find(
              ".circle_add_grey").parent().addClass("binf-hidden");
        }
        if (this.$el.closest(".cs-pull-left") &&
            this.$el.closest(".cs-pull-left").siblings(".cs-pull-right") &&
            !this.$el.closest(".cs-pull-left").siblings(".cs-pull-right").find(
                ".circle_delete_grey").parent().hasClass("binf-hidden")) {
          this.$el.closest(".cs-pull-left").siblings(".cs-pull-right").find(
              ".circle_delete_grey").parent().addClass("binf-hidden");
        }
      }
    }
  });

  return FormArrayFieldEditable2Behavior;
});