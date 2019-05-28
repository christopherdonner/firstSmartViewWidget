/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/handlebars',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.editable.behavior', 'csui/controls/form/pub.sub',
  "csui/utils/log"
], function (module, _, $, Handlebars, Backbone, Marionette, FormFieldEditable2Behavior, PubSub,
    log) {
  "use strict";
  var TKLFieldEditableBehavior = FormFieldEditable2Behavior.extend({
    constructor: function TKLFieldEditableBehavior(options, view) {
      FormFieldEditable2Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;

      this.view.getEditableBehavior = _.bind(function () {
        return this;
      }, this);

      this.isValidTKLState = true;
    },

    updateNonTKLSilently: function () {
      PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.map(function (view) {
        if (!!view.isNonTKLField) {
          view.setValue(view.getEditValue(), true, true);
          view.render();
        }
      });
    },

    isRelatedFieldInFocus: function (relTarget) {
      relTarget = relTarget || document.activeElement;
      return PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.some(function (fieldView) {
        return fieldView.ui.writeField[0] === relTarget;
      });
    },

    onFocusOutWrite: function (event) {
      $(event.target).parents(".csui-normal-scrolling").css("overflow", "auto");

      this.view.resetHelpers(true);
      var self         = this,
          cancelSubmit = false;
      if (!!PubSub.tklHelpers) {
        for (var index = 0; !cancelSubmit && index < PubSub.tklHelpers.viewsInWriteMode.length;
             index++) {
          cancelSubmit = PubSub.tklHelpers.viewsInWriteMode[index].getEditableBehavior().mouseDownCancel ||
                         PubSub.tklHelpers.viewsInWriteMode[index].getEditableBehavior().escapePressed;
        }
      }

      var relatedFieldInFocus = this.isRelatedFieldInFocus(event.relatedTarget);
      setTimeout(function () {
        if (!self.view.shouldValidate() || cancelSubmit ||
            self.isRelatedFieldInFocus(event.relatedTarget)) {
          return;
        }
        var bIsValid      = true,
            valuesChanged = false,
            viewState, view;
        if (!!PubSub.tklHelpers) {
          var editValue;
          for (var index = 0;
               PubSub.tklHelpers && index < PubSub.tklHelpers.viewsInWriteMode.length;
               index++) {
            view = PubSub.tklHelpers.viewsInWriteMode[index];
            viewState = PubSub.tklHelpers.viewsInWriteMode[index].isNonTKLField ?
                        PubSub.tklHelpers.viewsInWriteMode[index].getEditableBehavior() :
                        PubSub.tklHelpers.viewsInWriteMode[index];
            editValue = view.alpacaField.type === 'select' ? view.getEditValue().get('id') :
                        view.getEditValue();

            if (bIsValid) {
              bIsValid = view.alpacaField.setValueAndValidate(editValue, true);
            }
            if (!valuesChanged) {
              valuesChanged = !!PubSub.tklHelpers &&
                              PubSub.tklHelpers.viewsInWriteMode[index].getEditValue() !==
                              PubSub.tklHelpers.viewsInWriteMode[index].getOldValue();
            }
          }
        }
        if (self.view.isReadyToSave() || cancelSubmit || relatedFieldInFocus) {
          self.mouseDownCancel = false;
          return;
        }

        if (bIsValid) {
          if (self.view.mode === "writeonly") {
            if (document.querySelectorAll('.binf-has-error').length === 0) {
              $(".metadata-validation-error").hide();
              $("div").removeClass("show-validation-error");
            }
          }
          if (valuesChanged) {
            if (self.view.mode === 'writeonly' && !!PubSub.tklHelpers) {
              for (var indx = 0; indx < PubSub.tklHelpers.viewsInWriteMode.length;
                   indx++) {
                PubSub.tklHelpers.viewsInWriteMode[indx]._raiseValueChanged();
                self.updateNonTKLSilently();
              }
            } else {
              self.view._raiseValueChanged();
              self.updateNonTKLSilently();
            }
            self.view && self.view.formView && self.view.formView.trigger('disable:active:item');
          }

          self.$el.removeClass('cs-formfield-invalid');
          if (self.view.mode !== 'writeonly') {
            var focus = false;

            if (!!PubSub.tklHelpers) {
              for (var i = PubSub.tklHelpers.viewsInWriteMode.length - 1;
                   !!PubSub.tklHelpers && i >= 0; i--) {
                var fieldView = PubSub.tklHelpers.viewsInWriteMode[i];
                if (!!fieldView) {
                  focus = fieldView === self.view;
                  if (fieldView.getEditableBehavior().isMultiFieldView(fieldView)) {
                    if (fieldView.getStatesBehavior().state === 'write') {
                      fieldView = fieldView.alpacaField.parent;
                      fieldView.options.submittedData = fieldView.getValue().slice();
                      fieldView._showItemsInReadMode();
                      fieldView._hideInlineDeleteIcon();
                      fieldView._hideInlineAddIcon();
                      fieldView._showBulkEditAction();
                    }
                  } else {
                    fieldView.oldVal = fieldView.curVal;
                    fieldView.getStatesBehavior().setStateRead();
                  }
                }
              }
              delete PubSub.tklHelpers; //no longer needed helpers as all fields are in read mode now
            }

            if (document.activeElement === document.body) {
              self.view.ui.readField.focus().focus();
            }
          }
          self.view.alpacaField.domEl.find('.cs-formfield-invalid').removeClass(
              'cs-formfield-invalid');
          if (self.view.mode === "writeonly") {
            if (document.querySelectorAll('.binf-has-error').length === 0) {
              $(".metadata-validation-error").hide();
              $("div").removeClass("show-validation-error");
            }
          }
          if (!!self.view.needRerender) {
            self.view.render();
          }
        } else {
          if (self.view.getStatesBehavior().state === 'write') {
            self.isValidTKLState = false;
            self.$el.addClass('cs-formfield-invalid');
          }
        }
      }, 0);
    },

    onReadAreaClicked: function (e) {
      var self                     = this,
          allowEditOnClickReadArea = this.view.allowEditOnClickReadArea(e);

      self.view.alpacaField.parent.cancelClicked = false;
      if ($(e.target).hasClass('icon-edit') || allowEditOnClickReadArea) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
      setTimeout(function () { //should always be after mv block focus out
        if (self.options.mode !== 'create' &&
            document.querySelectorAll('.cs-form .cs-formfield-invalid').length === 0) {
          if (self.view.getStatesBehavior().isReadOnly()) {
            return false;
          }
          if ($(e.target).hasClass('icon-edit') || allowEditOnClickReadArea) {
            self.setViewStateWriteAndEnterEditMode();
          }
        } else {
          document.querySelector('.cs-form .cs-formfield-invalid input, .cs-form' +
                                 ' .cs-formfield-invalid .cs-field-write button').focus();
          return false;
        }
      }, 100);
    },

    trySetValueAndLeaveEditMode: function (validate, focus) {
      var bValueValid = this.areAllFieldsValid(),
          index       = 0;

      if (bValueValid) {
        this.isValidTKLState = true;
        if (this.view.mode !== 'writeonly') {
          this.updateNonTKLSilently();
          var fieldView;
          for (var i = PubSub.tklHelpers.viewsInWriteMode.length - 1; !!PubSub.tklHelpers && i >= 0;
               i--) {
            fieldView = PubSub.tklHelpers.viewsInWriteMode[i];
            if (fieldView) {
              if (!!fieldView && fieldView.getEditableBehavior().isMultiFieldView(fieldView)) {
                if (fieldView.getStatesBehavior().state === 'write') {
                  fieldView = fieldView.alpacaField.parent;
                  fieldView.options.submittedData = fieldView.getValue().slice();
                  fieldView._showItemsInReadMode();
                  fieldView._hideInlineDeleteIcon();
                  fieldView._hideInlineAddIcon();
                  fieldView._showBulkEditAction();
                }
              } else {
                fieldView.oldVal = fieldView.curVal;
                fieldView.getEditableBehavior().setViewReadOnlyAndLeaveEditMode(validate, false);
              }
            }
          }
        }
        !!focus && this.view.ui.readField.focus();
      } else {
        this.isValidTKLState = false;
      }
    },

    onCancelClicked: function () {
      this.view.resetOldValueAfterCancel();
      if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length === 0) {
        delete PubSub.tklHelpers;
      }
    },

    onMouseDown: function () {
      if (!!PubSub.tklHelpers) {
        _.each(PubSub.tklHelpers.viewsInWriteMode, function (fieldView) {
          fieldView.cancelClicked = false;
          fieldView.alpacaField.parent.cancelClicked = false;
          fieldView.getEditableBehavior().escapePressed = false;
          fieldView.getEditableBehavior().mouseDownCancel = false;
        });
      }
    },

    onKeyDown: function (event) {
      if (!!PubSub.tklHelpers) {
        _.each(PubSub.tklHelpers.viewsInWriteMode, function (fieldView) {
          fieldView.getEditableBehavior().escapePressed = false;
          fieldView.getEditableBehavior().tabPressed = false;
        });
      }

      if (event.keyCode == 27) { //escape
        if (this.view.getStatesBehavior().isStateWrite()) { // catch only in write state
          event.preventDefault();
          event.stopPropagation();
          this.escapePressed = true;
          this.view.$el.find('.csui-icon-edit.edit-cancel').trigger('click');
        }

      } else if (event.keyCode === 113) {
        if (this.view.getStatesBehavior().isStateRead()) {
          this.setViewStateWriteAndEnterEditMode();
        } else if (this.view.getStatesBehavior().isStateWrite()) {
          this.trySetValueAndLeaveEditMode(true, true); // validate and focus
          if (this.isValidTKLState && this.areAllFieldsValid()) {
            this.view._raiseValueChanged();
          }
        }
      } else if (event.keyCode === 9) { // tab
        if (this.view.alpacaField.options.mode !== 'create' &&
            this.view.getStatesBehavior().isStateWrite()) {
          this.moveTab(event);
        }
        this.tabPressed = true;
        if (!!PubSub.tklHelpers) {
          _.each(PubSub.tklHelpers.viewsInWriteMode, function (fieldView) {
            fieldView.getEditableBehavior().tabPressed = true;
          });
        }
      }
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
          if (this.isValidTKLState) {
            this.view._raiseValueChanged();
          }
        }
      }

      return true;
    },

    areAllFieldsValid: function () {
      var areValidFields = true,
          editValue;
      PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.map(function (field) {
        editValue = field.alpacaField.type === 'select' ? field.getEditValue().get('id') :
                    field.getEditValue();
        areValidFields = field.alpacaField.setValueAndValidate(editValue, true) &&
                         areValidFields;
      });
      return areValidFields;
    }
  });

  return TKLFieldEditableBehavior;
});
