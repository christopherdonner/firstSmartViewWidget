/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/handlebars',
  'csui/lib/marionette', 'csui/controls/form/pub.sub', "csui/utils/log",
  'i18n!csui/controls/form/impl/nls/lang',
  'csui/utils/base'
], function (_, $, Handlebars, Marionette, PubSub, log, lang, base) {

  var FormFieldEditable2Behavior = Marionette.Behavior.extend({

    constructor: function FormFieldEditable2Behavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;
      this.isIE11 = base.isIE11();
      this.view.childTKLViews = [];
      this.view.parentViews = [];
      this.view.cancelClicked = false;
      if (!this.view.isTKLField) {
        this.view.isNonTKLField = true;
      }
      this.tabableElements = [];
      this.tabContentSelectors = 'input:visible, .cs-field-write button:visible:not(:disabled),' +
                                 'textarea:visible, .icon-date_picker:visible';
      if (options.tabContentSelectors) {
        if (options.overrideTabContentSelectors) {
          this.tabContentSelectors = options.tabContentSelectors;
        } else {
          this.tabContentSelectors += ', ' + options.tabContentSelectors;
        }
      }

      if (!this.view.isBooleanField && !!this.view.options.alpacaField) {
        PubSub.off(this.view.options.alpacaField.propertyId + 'tkl:buildRelation');  //remove duplicate
        this.listenTo(PubSub, this.view.options.alpacaField.propertyId + 'tkl:buildRelation',
            this.buildRelation);

        this.listenTo(this.view, 'selection:changed', function () {
          this.view.trigger('parenttkl:changed', this.view.childTKLViews);
        });
        this.listenTo(this.view, 'parenttkl:changed', this.changeChildrenValues);
      }

      this.view.getEditableBehavior = _.bind(function () {
        return this;
      }, this);
      this.listenTo(this.view, 'field:changed', function () {
        this.view.isValidField = false;
      });

      this.view.listenTo(this.view, 'render disable:field',_.bind(function () {
        this.disableField();
      }, this));
    },

    ui: function () {

      return _.extend({
        editIcon: '.csui-icon-edit.icon-edit',
        cancelIcon: '.edit-cancel',
        icons: '.inline-edit-icon',

        readArea: '.cs-field-read',
        readAreaInner: '.cs-field-read-inner',
        writeArea: '.cs-field-write',
        applyAll: '.apply-all'

      }, this.view.ui);
    },

    events: {
      'click @ui.editIcon': 'onEditIconClicked',
      'mouseleave @ui.editIcon': 'onMouseOutRead',
      'mousedown @ui.applyAll': 'onApplyAllClicked',
      'keydown @ui.applyAll': 'onApplyAllClicked',
      'click @ui.cancelIcon': 'onCancelClicked',
      'mousedown @ui.cancelIcon': 'onMouseDownCancel',
      'touchend @ui.cancelIcon': 'onMouseDownCancel',

      'mouseup @ui.readField': 'onMouseupRead',

      'click @ui.readArea': 'onReadAreaClicked',
      'mouseleave @ui.readArea': 'onMouseOutRead',
      'mouseover @ui.readArea': 'onMouseOverRead',

      'focusout @ui.writeField': 'onFocusOutWrite',
      'focusout @ui.writeArea': 'onFocusOutWriteArea',
      'focusin @ui.writeField': 'onFocusInWrite',
      'focusin @ui.subInputField': 'actionOnFocusIn',

      'focusout @ui.readField': 'onFocusOutRead',
      'focusin @ui.readField': 'onFocusInRead',

      "keypress @ui.writeField": "onChangeWriteField",
      "input @ui.writeField": "onChangeWriteField",
      "change @ui.writeField": "onChangeWriteField",

      'paste': 'onKeyPress',
      'keypress': 'onKeyPress',
      'keydown': 'onKeyDown',
      'mousedown': 'onMouseDown',
      'touchend': 'onMouseDown'
    },

    onRender: function () {
      this.hasReadFocus() ? this._showEditIcon() : this._hideEditIcon();
      (this.view.mode === 'writeonly') && this._hideCancelIcon();
      this.mouseDownCancel = false;
    },

    disableField: function () {
      if (this.view.ui.writeField && this.view && this.view.alpacaField &&
          this.view.alpacaField.schema && this.view.alpacaField.schema.disabled) {
        this.view.ui.writeField.removeAttr('disabled');
        this.view.ui.writeField.attr('readonly', true);
        this.view.ui.writeField.attr('aria-disabled', true);
        this.view.ui.writeField.addClass('csui-formfield-disabled');
      }
    },

    onDestroy: function () {
      this.unsetCheckShowEditIcon();
    },

    buildRelation: function (childView) {
      if (this.isMultiFieldView(childView)) {
        if (this.view.childTKLViews.indexOf(childView.alpacaField.parent) === -1) {
          this.view.childTKLViews.push(childView.alpacaField.parent);
        }
        childView.alpacaField.parent.parentRelations = childView.alpacaField.parent.parentRelations ?
                                                       childView.alpacaField.parent.parentRelations :
            [];
        if (childView.alpacaField.parent.parentRelations.indexOf(this.view) === -1) {
          childView.alpacaField.parent.parentRelations.push(this.view);
        }
      } else {
        if (this.view.childTKLViews.push(childView) === -1) {
          this.view.childTKLViews.push(childView);
        }
      }
      childView.parentViews = childView.parentViews ? childView.parentViews : [];
      if (childView.parentViews.indexOf(this.view) === -1) {
        childView.parentViews.push(this.view);
      }
    },

    isMultiFieldView: function (view) {
      return (!view.isTKLField && !view.isNonTKLField) ||
             (view.alpacaField.options.isMultiFieldItem && !!view.alpacaField.parent &&
              !!view.alpacaField.parent.schema.maxItems &&
              view.alpacaField.parent.schema.maxItems > 1);
    },

    isDropDownOpen: function () {
      if (this.view.alpacaField !== undefined) {
        return (this.view.alpacaField.type !== "select" && this.view.options.isDropDownOpen) ||
               (this.view.alpacaField.type === "select" &&
                (!!this.view.isDropdownOpen && this.view.isDropdownOpen()));
      } else {return false;}
    },

    onMouseDown: function () {
      this.escapePressed = false;
      this.mouseDownCancel = false;
      this.view.cancelClicked = false;
      if (this.view.alpacaField) {
        this.view.alpacaField.parent.cancelClicked = false;
      }
      if (this.isIE11) {
        if (!!this.ui.writeField && !this.ui.writeField.val()) {
          this.tabPressed = undefined;
        } else {
          this.tabPressed = false;
        }
      }
    },

    cancelViewInEditMode: function (childEditableBehavior) {
      childEditableBehavior._resetOldValue();
      var childAlpacaField       = childEditableBehavior.view.alpacaField,
          skipRequiredValidation = childAlpacaField.schema.required &&
                                   !childAlpacaField.options.validate ? true :
                                   false;
      if (skipRequiredValidation) {
        childAlpacaField.schema.required = false;
        childAlpacaField.options.validate = true;
      }
      childAlpacaField.setValueAndValidate(childEditableBehavior.view.oldVal,
          true);
      if (skipRequiredValidation) {
        childAlpacaField.schema.required = true;
        childAlpacaField.options.validate = false;
      }
      if (!this.escapePressed) {
        childEditableBehavior.setViewReadOnlyAndLeaveEditMode(true, true);
      }
      this.escapePressed = false;
      childEditableBehavior.$el.removeClass('cs-formfield-invalid');
    },

    onCancelClicked: function () {
      var that = this;
      if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length > 0) {
        var targetView;
        for (var i = PubSub.tklHelpers.viewsInWriteMode.length - 1; i >= 0 && !!PubSub.tklHelpers;
             i--) {
          targetView = PubSub.tklHelpers.viewsInWriteMode[i];
          if (!!targetView) {
            targetView.alpacaField.parent.cancelClicked = true;
            that.isMultiFieldView(targetView) ?
            targetView.alpacaField.parent.getFieldEl().find('.csui-bulk-edit-cancel').click() :
            targetView.getEditableBehavior().cancelViewInEditMode(targetView.getEditableBehavior());
            targetView.cancelClicked = false;
          }
        }
      } else {
        this.view.cancelClicked = true;
        this.cancelViewInEditMode(this);
        this.view.cancelClicked = false;
      }
      if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length === 0) {
        delete PubSub.tklHelpers;
      }

    },

    onMouseDownCancel: function (event) {
      this.mouseDownCancel = true;
      event.stopPropagation();
    },

    onKeyPress: function (event) {

      if (this.view.onKeyPress && this.view.onKeyPress(event)) {
        return;
      }

      if (event.keyCode === 13) { // enter
        if (this.view.getStatesBehavior().isStateRead() && this.view.allowEditOnEnter()) {
          this.setViewStateWriteAndEnterEditMode();
        } else if (this.view.getStatesBehavior().isStateWrite() && this.view.allowSaveOnEnter()) {
          event.preventDefault();
          event.stopPropagation();
          this.trySetValueAndLeaveEditMode(true, true); // validate and focus
        }
      }

      return true;
    },

    onKeyDown: function (event) {
      this.escapePressed = false;
      this.tabPressed = false;
      if (event.keyCode === 27) { //escape
        if (this.view.getStatesBehavior().isStateWrite()) { // catch only in write state
          event.preventDefault();
          event.stopPropagation();
          this.escapePressed = true;
          if (this.view.mode !== 'writeonly') {
            this.cancelViewInEditMode(this);
          } else if (this.view.mode === 'writeonly') {
            this.trySetValue();
          }
          if (!this.isDropDownOpen()) {
            this.setViewReadOnlyAndLeaveEditMode(true, true);
          }
        }

      } else if (event.keyCode === 113) {
        if (this.view.getStatesBehavior().isStateRead()) {
          this.setViewStateWriteAndEnterEditMode();
        } else if (this.view.getStatesBehavior().isStateWrite()) {
          if ((this.view.getOldValue() !== null ?
               this.view.getOldValue().toString() : '') !==
              this.view.getEditValue()) {
            this.changeChildrenValues(this.view.childTKLViews);
          }
          this.validateRelatedFields();
          this.trySetValueAndLeaveEditMode(true, true); // validate and focus
        }
      } else if (event.keyCode === 9) { // tab    
        if (this.view.alpacaField && this.view.alpacaField.options.mode === "create") {
          var e = $.Event('tab:content:field:changed');
          this.view.$el.trigger(e);
        }
        var currentViewMode = this.view.options.mode ||
                              (this.view.alpacaField && this.view.alpacaField.options.mode);
        if (currentViewMode !== 'create' &&
            this.view.getStatesBehavior().isStateWrite()) {

          this.moveTab(event);
        }
        this.tabPressed = true;
      }

      return;
    },

    _updateTabableElements: function (event) {
      this.tabableElements.length = 0;
      var form = this.view.alpacaField ? this.view.alpacaField.containerItemEl.closest('.cs-form') :
                 this.view.$el.closest('.cs-form');
      this.tabableElements = form.find(this.tabContentSelectors).filter(function (index, el) {
        var retVal = true;
        if (!!$(event.target).closest('.cs-form-set')[0]) {
          retVal = ($(event.target).closest('.cs-form-set')[0] ===
                    $(el).closest('.cs-form-set')[0]);
        } else if ($(el).is(':checkbox')) {
          retVal = false;
        }
        return retVal;
      });
    },
    moveTab: function (event) {
      this._updateTabableElements(event);
      var currentTabPosition = $(this.tabableElements).index(event.target),
          skip               = ((currentTabPosition === this.tabableElements.length - 1) ||
                                (event.shiftKey && currentTabPosition === 0)) && this.view.mode ===
                                                                                 'writeonly';
      if (event.shiftKey) {
        if (currentTabPosition > 0) {
          currentTabPosition -= 1;
        } else {
          currentTabPosition = (this.tabableElements.length - 1);
        }
      } else {
        if (currentTabPosition >= (this.tabableElements.length - 1)) { //last element of array
          currentTabPosition = 0;
        } else {
          currentTabPosition += 1;
        }
      }

      if (!skip) {  //skip if it is add category mode
        this.tabableElements[currentTabPosition].focus();
        event.preventDefault();
        event.stopPropagation();
      }
      return this.tabableElements[currentTabPosition];
    },

    _showApplyAll: function (event) {
      var applyAllIcon = this.$el.find(".icon-container");
      if (applyAllIcon.hasClass('binf-hidden')) {
        applyAllIcon[0].classList.remove("binf-hidden");
        applyAllIcon.removeAttr("data-cstabindex");
        applyAllIcon.removeAttr("tabindex");
      }
      if (!!this.view.options.alpaca && this.view.options.alpaca.options.mode === "create" &&
          this.view.$el.closest('.csui-general-form').length === 0) {
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
        }
        if (iconEl.hasClass('binf-hidden')) {
          iconEl.removeAttr('style');
          iconEl.removeClass('binf-hidden');
          iconEl.prop('tabindex', "0");
          if (iconEl.parent().hasClass('binf-hidden')) {
            iconEl.parent().removeClass('binf-hidden');
          }
          var tabEvent = $.Event('tab:content:field:changed');
          this.view.$el.trigger(tabEvent);
        }
      }
    },

    _hideApplyAll: function (e) {
      if (this.$el && this.$el.find(".apply-all").not(".binf-hidden").length === 0) {
        var applyAllElem = document.querySelectorAll(".cs-form .apply-all:not(.binf-hidden)");
        if (applyAllElem.length > 0) {
          applyAllElem[0].classList.add("binf-hidden");
        }
      } else if (this.escapePressed) {
        var applyAllIcon = this.$el.find(".icon-container");
        applyAllIcon[0].classList.add("binf-hidden");
        applyAllIcon.attr("data-cstabindex", -1);
        applyAllIcon.attr("tabindex", -1);
      }
    },

    _updateTabPositionFocus: function (e) {
      var elems, arrElm, elm, elemLength, focusPosition;
      elems = $(document.querySelectorAll('.binf-tab-content')).children();
      arrElm = elems.find('input, textarea, button.binf-dropdown-toggle');
      elemLength = arrElm.length;
      focusPosition = 0;
      while (focusPosition < elemLength) {
        elm = arrElm[focusPosition];
        if (elm &&
            $(elm).is($(e.currentTarget).find('input,textarea,button:not(:disabled)').first())) {
          break;
        }
        focusPosition++;
      }
      if (focusPosition <= elemLength) {
        $(arrElm[focusPosition + 1]).focus();
      }
    },

    showAppliedTick: function (e, callback) {
      var toggleIcon = e.target;
      toggleIcon.callback = callback;
      toggleIcon.eve = e;
      $(toggleIcon).fadeOut(100, function () {
        $(this).removeClass();
        $(this).addClass("csui-icon applied_done");
        $(this).fadeIn(100, function () {
          setTimeout(function (self) {
            $(self).fadeOut(800, function () {
              $(this).removeClass();
              $(this).addClass("csui-icon apply-all binf-hidden");
              this.callback(this.eve);
            });
          }, 1000, this);
        });
      });
      $(".metadata-sidebar .metadata-sidebar-fadeout").fadeOut(2000, function () {
        $(".metadata-sidebar .cs-list-group .arrow-overlay").removeClass(
            "metadata-sidebar-arrow-overlay");
        $(".metadata-sidebar .cs-list-group").removeClass("metadata-sidebar-cs-list-group");
        $(this).remove();
      });
    },

    onApplyAllClicked: function (e) {

      if ((e.type === 'keydown' && e.keyCode === 13) || (e.type === 'mousedown')) {
        if (!!this.view.selectField) {
          if (this.view.trySetValue()) {
            this.$el.removeClass('cs-formfield-invalid');
          } else {
            this.$el.addClass('cs-formfield-invalid');
          }
        }
        setTimeout(function (self) {
          if ($(e.currentTarget).parents(".alpaca-container-item") &&
              $(e.currentTarget).parents(".alpaca-container-item").find(
                  ".cs-formfield-invalid").length === 0) {
            var value = self.view.getValue();
            if (value instanceof Object) {
              value = value.id;
            }
            var data = {
              fieldvalue: value === null ? "" : value.toString(),
              fieldpath: self.view.alpacaField && self.view.alpacaField.name,
              action: self.showAppliedTick,
              fieldevent: e,
              callback: self._updateTabPositionFocus
            };
            $(".metadata-sidebar .cs-list-group").addClass("metadata-sidebar-cs-list-group");
            $(".metadata-sidebar .cs-list-group .arrow-overlay").addClass(
                "metadata-sidebar-arrow-overlay");
            $("<div/>", {class: 'metadata-sidebar-fadeout'}).appendTo(
                $(".metadata-sidebar .cs-list-group"));
            var event = $.Event('click:applyAll');
            _.extend(event, data);
            self.$el.trigger(event);
            if (!!self.view && self.view.alpacaField && self.view.alpacaField.type === "tkl") {
              var checkParents = function (view) {

                if (view.parentViews.length > 0) {
                  _.each(view.parentViews, function (parent) {
                    if (!!self.view.isMultiFieldView(parent)) {
                      data.fieldpath = parent.propertyId;
                      data.fieldvalue = parent.getValue();
                      _.extend(event, data);
                      self.$el.trigger(event);
                      checkParents(parent.children[0].fieldView);
                    }
                    else {
                      data.fieldpath = !!parent.alpacaField ? parent.alpacaField.name :
                                       parent.view.field.name;
                      data.fieldvalue = parent.getValue() instanceof Object ? parent.getValue().id :
                                        parent.getValue().toString();
                      _.extend(event, data);
                      self.$el.trigger(event);
                      checkParents(parent);
                    }
                  });
                }
                return;
              };
              checkParents(self.view);

              var checkChildren = function (view) {
                if (view.children.length > 0) {
                  _.each(view.children, function (child) {
                    if (!!self.view.isMultiFieldView(child)) {
                      data.fieldpath = child.propertyId;
                      data.fieldvalue = child.getValue();
                      _.extend(event, data);
                      self.$el.trigger(event);
                      checkParents(child.children[0].fieldView);
                    }
                    else {
                      data.fieldpath = !!child.alpacaField ? child.alpacaField.name :
                                       child.view.field.name;
                      data.fieldvalue = child.getValue() instanceof Object ? child.getValue().id :
                                        child.getValue().toString();
                      _.extend(event, data);
                      self.$el.trigger(event);
                      checkChildren(child);
                    }

                  });
                }
                return;
              };
              checkChildren(self.view);
            }
          }
        }, 100, this);
      }

    },

    onChangeWriteField: function (event) {
      if ((!this.isIE11 && event.type === "keypress")) {
        return;
      }
      if (this.isIE11 && event.type === "input" &&
          (this.tabPressed === undefined || this.tabPressed)) {
        return;

      }
      if (this.view.getStatesBehavior().state === "write") {
        this._showApplyAll(event);
        setTimeout(_.bind(this.adjustSetRows, this), 100);
      }
      if (this.escapePressed && this.view.getStatesBehavior().state === "write") {
        this._hideApplyAll(event);
      }
      return;
    },

    onFocusInWrite: function (event) {
      this.checkAndScrollElemToViewport(event.currentTarget);
      if (this.isIE11) {
        if (this.ui.writeField.val() === "") {
          this.tabPressed = undefined;
        } else if (this.ui.writeField.val() === undefined) {
          this.tabPressed = undefined;
        } else {
          this.tabPressed = false;
        }
      }
      this._hideApplyAll(event);
      return false; //prevent IE scroll on focus of partial DOM el      
    },

    onFocusOutWrite: function (event) {
      var bIsValid;
      $(event.target).parents(".csui-normal-scrolling").css("overflow", "auto");

      if (!!this.view.selectField) {
        var that = this;
        setTimeout(function () {
          if (that.view.isReadyToSave() || that.escapePressed || that.mouseDownCancel) {
            that.mouseDownCancel = false;
            return;
          }
          if (!that.isRelatedFieldInFocus(event.relatedTarget)) {
            bIsValid = that.validateRelatedFields() && that.trySetValue();
          }
          if (bIsValid) {
            that.$el.removeClass('cs-formfield-invalid');

            if (that.isRelatedFieldInFocus(event.relatedTarget)) {
              if (!!that.view.getOldValue() &&
                  that.view.getOldValue() !== that.view.getEditValue()) {
                that.changeChildrenValues(that.view.childTKLViews,
                    undefined, false);
              }
              return;
            }

            that.setViewReadOnlyAndLeaveEditMode(true, false);
            if (that.view.mode === "writeonly") {
              if (document.querySelectorAll('.binf-has-error').length === 0) {
                $(".metadata-validation-error").hide();
                $("div").removeClass("show-validation-error");
              }
            }
          } else {
            if (!that.isRelatedFieldInFocus(event.relatedTarget)) {
              that.$el.addClass('cs-formfield-invalid');
            }
          }
          if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length === 0) {
            delete PubSub.tklHelpers;
          }
          return;
        }, 0);

      } else {
        if (event.target.value !== '') {
          if (this.view.userPicked !== undefined) {
            if (!this.view.userPicked) {
              this.view.alpacaField && this.view.alpacaField.refreshValidationState(false);
              this.$el.addClass('cs-formfield-invalid');
              this.$el.trigger($.Event('field:invalid'));
              return;
            } else {
              this.$el.removeClass('cs-formfield-invalid');
            }
          }
        } else {
          if (this.isIE11) {
            if (this.ui.writeField.val() === "") {
              this.tabPressed = undefined;
            } else if (this.ui.writeField.val() === undefined) {
              this.tabPressed = undefined;
            } else {
              this.tabPressed = false;
            }
          }
        }
        if (this.view.mode !== 'writeonly') {
          this.view.cancelClicked = this.isCancelClicked(this.view.alpacaField.parent);
          if (!this.view.isReadyToSave() || this.escapePressed || this.mouseDownCancel) {
            this.mouseDownCancel = false;
            return;
          }

          if (this.view.cancelClicked) {
            this.onCancelClicked();
            return;
          }

          this.view.isValidField = !this.view.$el.closest('.csui-custom-view-search').length &&
                                   (!!this.view.oldVal && this.view.curVal ===
                                                          this.view.getEditValue()) &&
                                   !this.view.$el.closest('.alpaca-field').find(
                                       '.binf-help-block').length;
          if (!this.view.isValidField) {
            if (this.isRelatedFieldInFocus(event.relatedTarget)) {
              this.view.oldVal = this.view.curVal;
            } else {
              this.changeChildrenValues(this.view.childTKLViews,
                  this.view, (this.view.getOldValue() !== null ?
                              this.view.getOldValue().toString() : '') !==
                             this.view.getEditValue());
              bIsValid = this.validateRelatedFields() && this.trySetValue();
            }
          } else {
            bIsValid = this.view.isValidField && this.validateRelatedFields() && this.trySetValue();
          }
          if (this.isRelatedFieldInFocus(event.relatedTarget) &&
              (this.view.alpacaField && this.view.alpacaField.type !== "select" ||
               this.view.alpacaField && this.view.alpacaField.type !== "otcs_user")) {
            if (!!this.view.getOldValue() &&
                this.view.getOldValue().toString() !== this.view.getEditValue().toString()) {
              this.changeChildrenValues(this.view.childTKLViews);
            } else {
              this.changeChildrenValues(this.view.childTKLViews, undefined, false);
            }
            return;
          }
        } else {
          bIsValid = this.trySetValue();
        }
        if (bIsValid) {
          this.$el.removeClass('cs-formfield-invalid');
          this.setViewReadOnlyAndLeaveEditMode(true, false);
          if (this.view.mode === "writeonly") {
            if (document.querySelectorAll('.binf-has-error').length === 0) {
              $(".metadata-validation-error").hide();
              $("div").removeClass("show-validation-error");
            }
          }
        }
        if (!!this.view.getOldValue() &&
            this.view.getOldValue().toString() !== this.view.getEditValue()) {
          this.view.getEditableBehavior().changeChildrenValues(this.view.childTKLViews);
        }
        if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length === 0) {
          delete PubSub.tklHelpers;
        }
        return;
      }
    },

    validateRelatedFields: function () {
      var view, isValid = true;
      if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length > 0
          && this.view.childTKLViews.length || this.view.parentViews.length) { //validateRelatedFields
        for (var index = 0; index < PubSub.tklHelpers.viewsInWriteMode.length;
             index++) {
          view = PubSub.tklHelpers.viewsInWriteMode[index];

          if (PubSub.tklHelpers.viewsInWriteMode[index] !== this.view) {
            if (isValid) {
              isValid = view.alpacaField.setValueAndValidate(view.getEditValue(), true);
            } else {
              view.alpacaField.setValueAndValidate(view.getEditValue(), true); //validate all
            }
          }
        }
      }
      return isValid;
    },

    isCancelClicked: function (currentView, event) {
      var isClicked   = false || (event && event.relatedTarget &&
                                  $(event.relatedTarget).hasClass('csui-icon-edit')),
          zombieViews = [];

      for (var i = 0; PubSub.tklHelpers && i < PubSub.tklHelpers.viewsInWriteMode.length; i++) {
        var view = PubSub.tklHelpers.viewsInWriteMode[i];
        if (view.$el.is(':visible')) {
          if (this.isMultiFieldView(view)) {
            if (view.alpacaField.parent.cancelClicked) {
              isClicked = true;
              break;
            }
          } else {
            if (view.getEditableBehavior().mouseDownCancel) {
              isClicked = true;
              break;
            }
          }
        } else {
          zombieViews.push(view);
        }
      }
      if (PubSub.tklHelpers && zombieViews.length) {
        PubSub.tklHelpers.viewsInWriteMode = PubSub.tklHelpers.viewsInWriteMode.filter(
            function (view) {
              return zombieViews.indexOf(view) === -1;
            });
      }
      return isClicked || (currentView && currentView.cancelClicked);
    },

    getFieldIndex: function (view) {    //can't depend on dataId as it changes in mv
      if (view.alpacaField && view.alpacaField.options.isMultiFieldItem &&
          !!view.alpacaField.parent.schema.maxItems &&
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
        if (this.getEditableBehavior().isMultiFieldView(this)) { //mv parent
          index = this.getEditableBehavior().getFieldIndex(this);
          childViews = this.getEditableBehavior().normalizeViews(child);
          if (isInsideSet && (parseInt(this.options.dataId.split('_')[2]) !==
                              parseInt(childViews[0].options.dataId.split('_')[2]))) {
            return;
          }
          if (childViews[0].alpacaField.options.isMultiFieldItem) { //mv child
            childViews.forEach(function (child) {
              child.getEditableBehavior().changeChildrenValues(child.children, child, false);
              child.valuesPulled = false;
            });

            if (!!childViews[index]) {
              child = childViews[index];
              resetToNone = noReset === undefined || noReset;
              this.getEditableBehavior().changeChildrenValues(child.children, child);
            }
          } else {  //non mv child
            if (index === 0) {
              child = childViews[index];
              resetToNone = true;
              this.getEditableBehavior().changeChildrenValues(child.children, child);
            }
          }
          if (resetToNone) {
            child.valuesPulled = false;
            child.ui.writeField.val('');
            child.setValue('', true);
            child.needRerender = true;
            child.options.enum.length = 0;
            child.trigger('tkl:refresh');
          }
        } else {  //non mv parent
          childViews = this.getEditableBehavior().normalizeViews(child);
          if (isInsideSet && (parseInt(this.options.dataId.split('_')[2]) !==
                              parseInt(childViews[0].options.dataId.split('_')[2]))) {
            return;
          }
          var that = this;
          resetToNone = noReset === undefined || noReset;
          childViews.forEach(function (child) {
            that.getEditableBehavior().changeChildrenValues(child.children, child, noReset);
            child.valuesPulled = false;
            if (resetToNone) {
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

    isRelatedFieldInFocus: function (relTarget) {
      relTarget = relTarget || document.activeElement;
      if (PubSub.tklHelpers) {
        return PubSub.tklHelpers.viewsInWriteMode.some(function (fieldView) {
          return fieldView.ui.writeField[0] === relTarget;
        });
      } else {
        return $.contains(this.view.$el[0], relTarget);
      }
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

    onFocusOutWriteArea: function (event) {
    },

    onFocusInRead: function (event) {
      this.checkAndScrollElemToViewport(event.currentTarget);
      this._showEditIcon();
    },

    actionOnFocusIn: function(event) {
      this.checkAndScrollElemToViewport(event.currentTarget);
    },

    checkAndScrollElemToViewport: function(elem) {
      base.checkAndScrollElemToViewport(elem);
    },

    onFocusOutRead: function (e) {
      if (!this.view.isBooleanField) {
        e.stopPropagation();
      }

      if (this.view.getStatesBehavior().isReadOnly() ||
          this.view.getStatesBehavior().isWriteOnly()) {
        return;
      }
      this._hideEditIcon();
      if (this.$el.closest('.alpaca-container-item-last').length > 0) {
        var bulkEditIconContainer = this.$el.closest('.alpaca-field-array').find(
            '.csui-array-bulk-edit-noset').not('.binf-hidden');
        bulkEditIconContainer.addClass('binf-hidden');
      }
      clearTimeout(this.mouseOverTimeout);
      this.mouseOverTimeout = null;
      return;
    },

    onMouseOverRead: function () {
      if (this.view.getStatesBehavior().isReadOnly()) {
        return;
      }

      if (this.options.mode !== 'create' && !this.mouseOverTimeout &&
          document.querySelectorAll('.cs-form .cs-formfield-invalid').length === 0) {
        this.mouseOverTimeout = setTimeout(_.bind(this._showEditIcon, this), 300);
      }
    },

    onMouseOutRead: function () {
      if (!this.hasReadFocus() && !this.view.getStatesBehavior().isWriteOnly()) {
        this._hideEditIcon();
        clearTimeout(this.mouseOverTimeout);
        this.mouseOverTimeout = null;
      }
      return;
    },

    onEditIconClicked: function (e) {
      e.stopImmediatePropagation();
      this.setViewStateWriteAndEnterEditMode();

    },

    onReadAreaClicked: function (e) {
      if (this.options.mode !== 'create' &&
          document.querySelectorAll('.cs-form .cs-formfield-invalid').length === 0) {
        if (this.view.getStatesBehavior().isReadOnly() &&
            !(this.view.alpacaField && this.view.alpacaField.options &&
            this.view.alpacaField.options.type === 'url'))  {
          return false;
        }

        var editIconClicked = e.target.classList.contains("icon-edit");
        if (editIconClicked || this.view.allowEditOnClickReadArea(e)) {
          e.stopImmediatePropagation();
          e.preventDefault();
          this.setViewStateWriteAndEnterEditMode();
        }
      } else {
        document.querySelector('.cs-form .cs-formfield-invalid input, .cs-form' +
                               ' .cs-formfield-invalid .cs-field-write button').focus();
        return false;
      }
    },

    onMouseupRead: function (e) {
      e.stopPropagation();
      e.preventDefault();
      this.view.ui.readField.focus();
    },

    setCheckShowEditIcon: function () {
      this.checkShowEditIcon = setInterval(_.bind(this.checkShowEditIcon, this), 10);
    },

    unsetCheckShowEditIcon: function () {
      clearInterval(this.checkShowEditIcon);
    },

    checkShowEditIcon: function () {
      if (this.view.getStatesBehavior().isStateRead()) {
        if (this.hasReadFocus()) {
        }
      }
    },

    buildHelpers: function () {  //helpers will be destroyed in read mode
      if (!PubSub.tklHelpers) {
        PubSub.tklHelpers = {};
        PubSub.tklHelpers.viewsInWriteMode = [];
      }
      this._updateViewsInWriteMode(this.view);

      if (!PubSub.tklHelpers.tabInView) {
        PubSub.tklHelpers.tabInView = this.view;
      }
    },

    setViewStateWriteAndEnterEditMode: function (childFocus) {
      this.view.cancelClicked = false;
      if (this.view.getStatesBehavior().isReadOnly()) {
        return;
      }
      var focus    = childFocus === false ? childFocus : true,
          validate = false; //Don't validate on turning field to edit mode
      this.view.getStatesBehavior().setStateWrite(validate, focus);
      this.view.handleToggle && this.view.handleToggle();
      if (this.mode !== 'writeonly') {

        var children = !!this.view.alpacaField && this.view.alpacaField.type === "tkl" ?
                       this.view.children :
                       this.view.childTKLViews;

        children.map(function (view) {
          this.buildHelpers();
          if (!this.isMultiFieldView(view)) {
            if (view.getStatesBehavior().state !== 'write') {
              if (view.isMultiFieldView(view)) {
                view.alpacaField.parent._showItemsInWriteMode();
              } else {
                view.getEditableBehavior().setViewStateWriteAndEnterEditMode(false);
              }
            }
          } else {
            view = view._showItemsInWriteMode ? view : view.alpacaField.parent;
            view._showItemsInWriteMode();
            view.getFieldEl().find('.csui-array-bulk-edit').removeClass('binf-hidden');
            view.getFieldEl().find(".csui-bulk-edit-cancel").removeClass("binf-hidden");
            view.getFieldEl().find(".csui-bulk-edit-submit").removeClass("binf-hidden");
            view.getFieldEl().find(".csui-bulk-edit").addClass("binf-hidden");
          }
        }, this);
      }
      this.view._beforeTurnsToWriteMode && this.view._beforeTurnsToWriteMode();

      return;
    },

    trySetValueAndLeaveEditMode: function (validate, focus) {
      var oldValue = this.view.getOldValue() !== null && this.view.getOldValue() !== undefined ?
                     this.view.getOldValue().toString() : '';
      this.changeChildrenValues(this.view.childTKLViews, this.view, oldValue !==
                                                                    this.view.getEditValue());
      var bValueValid = true,
          children    = PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length ?
                        PubSub.tklHelpers.viewsInWriteMode : this.view.childTKLViews,
          self        = this;
      children.map(function (view) {
        if (view !== self.view) {
          bValueValid = view.alpacaField &&
                        view.alpacaField.setValueAndValidate(view.getEditValue(), true) &&
                        bValueValid;
        }
      });
      if (bValueValid && this.trySetValue()) {
        this.setViewReadOnlyAndLeaveEditMode(validate, focus);
      }
    },

    setViewReadOnlyAndLeaveEditMode: function (validate, focus) {
      if (this.view.getStatesBehavior().isWriteOnly()) {
        return;
      }
      this.view._beforeTurnsToReadMode && this.view._beforeTurnsToReadMode();
      this.view.getStatesBehavior().setStateRead(focus);

      var children = PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length ?
                     PubSub.tklHelpers.viewsInWriteMode : this.view.childTKLViews,
          cancelClicked, childView;
      if (!!children && children.length > 0) {
        cancelClicked = this.isCancelClicked(this.view.alpacaField.parent) || this.escapePressed;
        for (var i = children.length - 1; i >= 0; i--) {
          childView = children[i];
          if (childView) {
            if (this.isMultiFieldView(childView)) {
              childView = !childView.alpacaField ? childView : childView.alpacaField.parent;
              if (cancelClicked) {
                childView.getFieldEl().find('.csui-bulk-edit-cancel').trigger('click');
                childView.cancelClicked = false;
                if (this.view.alpacaField.parent) {
                  this.view.alpacaField.parent.cancelClicked = false;
                }
              } else {
                (!!childView.children[0] && childView.children[0].type === "tkl") ?
                childView._doBulkSubmitActionTKL(true) : childView._doBulkSubmitAction();
              }
            } else {
              if ((childView.alpacaField.parent.cancelClicked || this.escapePressed) &&
                  childView.getStatesBehavior().state === "write") {
                childView.getEditableBehavior().escapePressed = false;
                childView.cancelClicked = false;
                childView.getEditableBehavior()._resetOldValue();
                if (childView.alpacaField.type === 'tkl') {
                  childView.isValidTKLState = true;
                }
                childView.alpacaField.refreshValidationState();
                childView.$el.removeClass('cs-formfield-invalid');
              }
              if (childView.isTKLField) {
                childView.oldVal = childView.curVal;
              }
              childView.getStatesBehavior().setStateRead(focus);
            }
          }
        }
      }
      this.view.cancelClicked = false;

      return;
    },

    trySetValue: function () {
      var bValueValid = this.view.trySetValue ? this.view.trySetValue() :
                        this._trySetValue();
      this.view.isValidField = bValueValid;
      return bValueValid;
    },

    _showCancelIcon: function () {
      this.ui.cancelIcon.show();
    },

    _hideCancelIcon: function () {
      this.ui.cancelIcon.hide();
    },

    _showEditIcon: function () {
      if (this.view.getStatesBehavior().isReadOnly()) {
        return;
      }
      if (!this._isEditIconVisible()) {
        this.ui.editIcon.removeClass('binf-hidden');
      }
    },

    _hideEditIcon: function () {
      this.ui.editIcon.addClass('binf-hidden');

      return;
    },

    _isEditIconVisible: function () {
      if (this.view.getStatesBehavior().isStateWrite()) {
        return false;
      }
      var bEditVisible = !this.ui.editIcon.hasClass('binf-hidden');
      return bEditVisible;
    },

    _isCancelIconVisible: function () {
      var bCancelVisible = this.ui.cancelIcon.is(':visible');
      return bCancelVisible;
    },

    hasReadFocus: function () {
      var bHasFocus = this.ui.readField.is(':focus');
      return bHasFocus;
    },

    hasReadHover: function () {
      var bHasFocus = this.ui.readField.is(':hover');
      return bHasFocus;
    },

    hasWriteFocus: function () {
      var bHasFocus = this.ui.writeField.is(':focus');
      return bHasFocus;
    },

    _updateViewsInWriteMode: function (view) {
      setTimeout(function () {
        if (!PubSub.tklHelpers) {
          PubSub.tklHelpers = {};
          PubSub.tklHelpers.viewsInWriteMode = [];
        }
        if (!view.isCustomView && PubSub.tklHelpers.viewsInWriteMode.indexOf(view) === -1) {
          view.cancelClicked = false; // fix for hybrid tkl switching between sa to mv
          if (view.alpacaField.parent) {
            view.alpacaField.parent.cancelClicked = false;
          }
          PubSub.tklHelpers.viewsInWriteMode.push(view);
        }
        if (!PubSub.tklHelpers.tabInView) {
          PubSub.tklHelpers.tabInView = view;
        }
      }, 151);
    },

    _trySetValue: function () {
      var editVal           = this.view.getEditValue() !== null &&
                              this.view.getEditValue() !== undefined ? this.view.getEditValue() :
                              "", // new value
          curVal            = this.view.getValue() !== null && this.view.getValue() !== undefined ?
                              this.view.getValue().toString() : "",  // old value
          bIsValid          = true,
          hasClassInvalid   = this.view.$el.hasClass('cs-formfield-invalid'),
          isReadyToSaveView = this.view.isReadyToSave(),
          isRequired        = this.view.alpacaField && this.view.alpacaField.schema.required,
          validate          = this.view.alpacaField && this.view.alpacaField.options.validate,
          writeonly         = this.view.mode === "writeonly",
          emptyField        = curVal === "";
      if (this.view.alpacaField && this.view.alpacaField.type === "otcs_user") {
        bIsValid = this.view.userPicked;
      }
      if (isReadyToSaveView && ((editVal !== curVal) || writeonly || hasClassInvalid ||
                                (!writeonly && isRequired && validate && emptyField))) {
        bIsValid = this.view.setValue(editVal, true);
        if (bIsValid) {
          PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.map(function (view) {
            if (view.isTKLField) {
              view.oldVal = view.curVal;
              view.valuesPulled = false;
            }
          });
        }
        if (!bIsValid && this.view.ui.writeField.select) {
        }
      }
      return bIsValid;
    },

    _resetOldValue: function () {
      if (!this.view.resetOldValueAfterCancel()) {
        var curVal = this.view.getValue();
        if(this.view.userPicked !== false) {
          curVal = curVal instanceof Object ? curVal.display_name : curVal;
          this.ui.writeField.val(curVal);
        }
        if (this.view.userPicked !== undefined) {
          this.view.userPicked = true;
        }
      }
      if (this.$el.hasClass('cs-formfield-invalid')) {
        this.$el.removeClass('cs-formfield-invalid');
      }
      return;
    },

    adjustSetRows: function () {
      var scrollBar = this.$el.parents('.cs-form-set-container.csui-hoveredScrollable').find(
          '.csui-set-scroll-container-child');
      var targetRowEl = this.$el.parents().closest(
          '.cs-form-set-container.csui-hoveredScrollable .csui-scrollablecols');
      if ((scrollBar !== undefined) && (targetRowEl !== undefined)) {
        scrollBar.scrollLeft(targetRowEl.scrollLeft());
      }
    }

  });

  return FormFieldEditable2Behavior;

});
