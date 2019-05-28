/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/handlebars',
  'csui/lib/marionette', "csui/utils/log", 'csui/controls/form/pub.sub'
], function (_, $, Handlebars, Marionette, log, PubSub) {

  var FormFieldStatesBehavior = Marionette.Behavior.extend({

    constructor: function FormFieldStatesBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.view = view;

      this.view.getStatesBehavior = _.bind(function () {
        return this;
      }, this);

    },

    ui: function () {

      return _.extend({
        readArea: '.cs-field-read',
        readAreaInner: '.cs-field-read-inner > .btn-container',
        writeArea: '.cs-field-write'
      }, this.view.ui);
    },

    onRender: function () {
      var currentOptions = this.view.model.get("options");
      if (!!currentOptions && !!currentOptions.readonly) {
        this.view.mode = "readonly";
      }
      if (!this.state) {
        this.setStateFromMode(this.view.mode, false, false);
      } else {
        this.setStateFromMode(this.state, false, false);
      }
    },

    isMultiFieldView: function (view) {
      return (!view.isTKLField && !view.isNonTKLField) ||
             (view.alpacaField.options.isMultiFieldItem && !!view.alpacaField.parent &&
              !!view.alpacaField.parent.schema.maxItems &&
              view.alpacaField.parent.schema.maxItems > 1);
    },

    setViewStateWriteAndEnterEditMode: function () {
      var MN = '--{0}:setViewStateWriteAndEnterEditMode {1} {2}';
      log.debug(MN, this.constructor.name, 'enter') && console.log(log.last);

      if (this.isReadOnly()) {
        return;
      }
      var focus    = true,
          validate = true;
      this.setStateWrite(validate, focus);

      if (this.mode !== 'writeonly') {

        this.view.childTKLViews.map(function (view) {
          this.buildHelpers();
          if (!this.isMultiFieldView(view)) {
            if (view.getStatesBehavior().state !== 'write') {
              if (view.isMultiFieldView(view)) {
                view.alpacaField.parent._showItemsInWriteMode();
              } else {
                view.valuesPulled = true;
                view.getStatesBehavior().setViewStateWriteAndEnterEditMode(false, false);
              }
            }
          } else {
            view._showItemsInWriteMode();

          }
        }, this);
      }

      log.debug(MN, this.constructor.name, 'return') && console.log(log.last);
      return;
    },

    trySetValueAndLeaveEditMode: function (validate) {
      var bValueValid = this.trySetValue();
      if (bValueValid) {
        this.setViewReadOnlyAndLeaveEditMode(validate, true);
      }
    },

    setViewReadOnlyAndLeaveEditMode: function (validate, focus) {
      var MN = '{0}:setViewReadOnlyAndLeaveEditMode {1} {2}';
      log.debug(MN, this.constructor.name, 'enter') && console.log(log.last);

      if (this.isWriteOnly()) {
        return;
      }
      this.setStateRead(validate, focus);

      log.debug(MN, this.constructor.name, 'return') && console.log(log.last);
      return;
    },

    setStateFromMode: function (mode, validate, focus) {
      switch (mode) {
      case 'read':
      case 'readonly':
        this.setStateRead(validate, focus);
        break;
      case 'write':
      case 'writeonly':
        this.setStateWrite(validate, focus);
        break;
      default:
        this.setStateRead(validate, focus);
        break;
      }
    },


    buildHelpers: function () {  //helpers will be destroyed in read mode
      if (!PubSub.tklHelpers) {
        PubSub.tklHelpers = {};
        PubSub.tklHelpers.viewsInWriteMode = [];
      }
      this.isMultiFieldView(this.view) ? this.view.alpacaField.parent._updateViewsInWriteMode(this.view) :
      		this.view.getEditableBehavior()._updateViewsInWriteMode(this.view);
      if (!PubSub.tklHelpers.tabInView) {
        PubSub.tklHelpers.tabInView = this.view;
      }
    },


    setStateWrite: function (validate, focus) {
      var MN = '---{0}:setStateWrite {1} {2} {3}';
      log.debug(MN, this.constructor.name, 'enter', validate, focus) && console.log(log.last);

      this.state = 'write';
      this.view.setStateWrite(validate, focus) || this._setStateWrite(validate, focus);

      if((!!this.view.childTKLViews && this.view.childTKLViews.length) ||
          (!!this.view.alpacaField && (!!this.view.alpacaField.parent.childRelations &&
          this.view.alpacaField.parent.childRelations.length || !!this.view.alpacaField.parent.parentRelations
          && this.view.alpacaField.parent.parentRelations.length))) {

        this.buildHelpers();

      }
      log.debug(MN, this.constructor.name, 'return') && console.log(log.last);
      return;
    },

    _setStateWrite: function (validate, focus) {
      var MN = '----{0}:_setStateWrite {1} {2} {3}';
      log.debug(MN, this.constructor.name, 'enter', validate, focus) && console.log(log.last);

      this.ui.readArea.addClass('binf-hidden');

      this.ui.writeArea.removeClass('binf-hidden');
      if (focus && !this.hasWriteFocus()) {
        this.view.ui.writeField.focus().focus();
      }
      focus && this.view.ui.writeField.select();

      log.debug(MN, this.constructor.name, 'return') && console.log(log.last);
      return;
    },

    setStateRead: function (focus) {
      if (!!this.view.options.model.attributes.options &&
          !!this.view.options.model.attributes.options.isMultiFieldItem) {
        this.view.$el.closest(".cs-form-set-container.csui-multivalue-block").addClass(
            "csui-multivalue-read-block");
        var setContainer = this.view.$el.closest(".cs-form-set-container").is("visible");
        if (setContainer.length > 0) {
          setContainer.removeClass("csui-multivalue-set-write-mode");
        }
      }
      var MN = '---{0}:setStateRead {1} {2}';
      log.debug(MN, this.constructor.name, 'enter') && console.log(log.last);

      this.state = 'read';
      this.view.setStateRead(focus) || this._setStateRead(focus);
      if(!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length > 0) {
        if(PubSub.tklHelpers.viewsInWriteMode.indexOf(this.view) !== -1) {
          PubSub.tklHelpers.viewsInWriteMode.splice(
              PubSub.tklHelpers.viewsInWriteMode.indexOf(this.view), 1);
        }
        if(PubSub.tklHelpers.viewsInWriteMode.length === 0) {
          delete PubSub.tklHelpers;
        }
      }
      log.debug(MN, this.constructor.name, 'return') && console.log(log.last);
      return;
    },

    _setStateRead: function (focus) {
      var MN = '----{0}:_setStateRead {1} {2}';
      log.debug(MN, this.constructor.name, 'enter') && console.log(log.last);

      this.ui.writeArea.addClass('binf-hidden');
      this.ui.readArea.removeClass('binf-hidden');
      if (focus) {
        this.view.ui.readField.focus();
      }

      log.debug(MN, this.constructor.name, 'return') && console.log(log.last);
      return;
    },

    isReadOnly: function () {
      return this.view.$el.hasClass("cs-booleanfield") ? this.view.mode === "readonly" :
             (this.view.options.alpacaField ? this.view.options.alpacaField.schema.readonly :
              this.view.mode === "readonly"); /*If alpacaField is not defined, use view.mode*/
    },

    isWriteOnly: function () {
      return this.view.mode === 'writeonly';
    },

    isStateRead: function () {
      return this.state === 'read';
    },

    isStateWrite: function () {
      return this.state === 'write';
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
    }

  });

  return FormFieldStatesBehavior;

});
