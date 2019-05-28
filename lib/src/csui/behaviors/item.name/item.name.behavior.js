/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/models/version', 'csui/models/namequery',
  'csui/utils/commands',
  'i18n!csui/behaviors/item.name/impl/nls/lang'
], function ($, _, Backbone, Marionette, base, VersionModel, NameQuery, commands, lang) {

  var ItemNameBehavior = Marionette.Behavior.extend({

    ui: {
      inputName: '.title-input',
      saveButton: '.cs-add-button'
    },

    events: {
      'click @ui.name': 'onClickName',
      'click @ui.nameInput': 'cancelEvent',
      'keyup @ui.nameInput': 'onKeyReleased',
      'paste @ui.inputName': 'mouseRightCicked',
      'cut @ui.inputName': 'mouseRightCicked',
      'blur @ui.nameInput': 'onBlurNameInput',
      'mousedown @ui.nameEditCancelIcon': 'cancelNameEdit',
      'click @ui.nameEditCancelIcon': 'cancelEvent',
      'click @ui.nameEditDiv': 'cancelEvent'
    },

    constructor: function ItemNameBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this._nameSchema = _.extend({
        required: true,
        readonly: false
      }, this.options.nameSchema);
      this.view = view;
      this.view.ItemNameBehavior = this;
      this.listenTo(this.view.model || this.view.options.model, "change:name", this.toggleButton);
    },

    updateNameSchema: function (nameSchema) {
      this._nameSchema = _.extend({
        required: true,
        readonly: false
      }, nameSchema);
      this.toggleButton();
    },

    toggleButton: function (event) {
      if (!this.ui || !this.ui.inputName || !this.ui.inputName.val) {
        return;
      }
      var currentInputElementVal = this.ui.inputName.val().trim(),
          disableButton          = true;
      if (!this._isEditMode() || this._isCopyMoveAction()) { // only in create mode or while Copying/Moving operation
        disableButton = this._nameSchema.required && currentInputElementVal.length == 0;
        this.view.trigger("update:button", {disabled: disableButton});
      }
    },

    _isEditMode: function () {
      return this.view.model.get('id') !== undefined;
    },

    _isCopyMoveAction: function () {
      return this.view.model.get('action') === "copy" || "move";
    },

    mouseRightCicked: function (event) {
      var that = this;
      setTimeout(function () {
        that.toggleButton(event);
      }, 100);
    },

    onBeforeDestroy: function () {
      if (this.view._nodeIconView) {
        this.view._nodeIconView.destroy();
      }
      if (this.view.dropdownMenuView) {
        this.view.cancelEventsToViewsPropagation(this.view.dropdownMenuView);
        this.view.dropdownMenuView.destroy();
      }
    },

    onKeyInView: function (e) {
      if (this.view.readonly) {
        return;
      }
      var event = e || window.event;

      if (event.keyCode === 9 && this.getInputBoxValue() === "") {
        event.preventDefault();
        event.stopPropagation();
        this.validate('');  // show error
        setTimeout(_.bind(function () {
          this.view.ui.nameInput.focus();
        }, this), 100);
        return;
      }

      if (event.keyCode === 27) {
        this.cancelNameEdit(event);
        return;
      }

      if (event.keyCode === 32 || event.keyCode === 13) {
        var menuItemClick = this.view.dropdownMenuView &&
                            this.view.dropdownMenuView.$el.find(event.target).length > 0 ?
                            true : false;
        var timeOut = event.keyCode === 13 ? 200 : 0;
        var target = event.target || event.srcElement;
        if (menuItemClick) {
          event.preventDefault();
          event.stopPropagation();
          if (base.isMozilla() || base.isEdge()) {
            $(target).click();
          } else {
            setTimeout(function () {
              $(target).click();
            }, timeOut);
          }
        } else if (this.view.editing !== true) {
          event.preventDefault();
          event.stopPropagation();
          setTimeout(_.bind(function () {
            this._toggleEditMode(true);
          }, this), timeOut);
        }
      }
    },

    setEditModeFocus: function () {
      if (this.view.readonly) {
        return;
      }
      setTimeout(_.bind(function () {
        if (this.view.ui.nameInput instanceof Object) {
          this._toggleEditMode(true);
          this.view.ui.nameInput.focus();
          this.view.ui.nameInput[0].select();
        }
      }, this), 500);
    },

    showInlineError: function (error) {
      this.view.ui.titleError.attr('title', error);
      this.view.ui.titleError.text(error);
      this.view.ui.titleError.attr('role', 'alert');
    },

    clearInlineError: function () {
      this.view.ui.titleError.attr('title', '');
      this.view.ui.titleError.text('');
      this.view.ui.titleError.removeAttr('role');
    },

    validateInputName: function (iName) {
      var deferred = $.Deferred(),
          success  = true;
      if (this.view.readonly) {
        this.clearInlineError();
        return true;
      }
      var name = iName === undefined ? this.getValue() : iName;
      name = name.trim();
      var self = this;
      this._isValidName(name)
          .done(function (exists) {
            if (exists) {
              self._displayInlineError(name, exists);
              success = false;
              deferred.resolve(success);
            } else {
              self.clearInlineError();
              deferred.resolve(success);
            }

          }).fail(function () {
        deferred.reject();
      });
      return deferred.promise();

    },
    validate: function (iName) {
      if (this.view.readonly) {
        this.clearInlineError();
        return true;
      }
      var name = iName === undefined ? this.getValue() : iName;
      name = name.trim();
      if (name.length < 1) {
        this.showInlineError(lang.nameErrorEmptyValue);
        return false;
      } else if (name.length > 248) {
        this.showInlineError(lang.nameErrorMaxLegthExceed);
        return false;
      } else if (name.indexOf(':') >= 0) {
        this.showInlineError(lang.nameErrorContainSemiColon);
        return false;
      }
      this.clearInlineError();
      return true;
    },
    _isValidName: function (newName) {
      var exists = true; //a flag variable used when checking for existing item names
      var deferred = $.Deferred();

      if (newName && newName.length <= 248 && newName.indexOf(":") === -1) {
        var model = this.view.model;
        var container = model.parent || this.view.options.container;
        if (!!container && (!container.get('id') || container.get('id') === -1)) {
          deferred.resolve(false);
        } else {
          this.checkNameExists(newName)
              .done(function (data, result, request) {
                if (null === data.results[0].id) {
                  exists = false;
                }
                deferred.resolve(exists);
              })
              .fail(deferred.reject);
        }

        return deferred.promise();
      }

      deferred.resolve(exists);
      return deferred.promise();

    },
    checkNameExists: function (name) {
      var model     = this.view.model,
          container = model.parent || this.view.options.container,
          connector = container.connector,
          deferred  = $.Deferred(),

          nameQuery = new NameQuery(null, {container: container, connector: connector});
      nameQuery.runQuery(container.get('id'), [name])
          .done(deferred.resolve)
          .fail(deferred.reject);

      return deferred.promise();
    },
    _displayInlineError: function (newName, exists) {
      var message;
      if (newName.length < 1) {
        message = lang.nameErrorEmptyValue;
      } else if (newName.length > 248) {
        message = lang.nameErrorMaxLegthExceed;
      } else if (newName.indexOf(":") !== -1) {
        message = lang.nameErrorContainSemiColon;
      } else if (exists) {
        message = lang.nameExists.replace('{name}', newName);
      }
      this.showInlineError(message);
    },

    getValue: function () {
      return this.view.ui.name.text();
    },

    getInputBoxValue: function () {
      if (this.view.modelHasEmptyName && this.view.inputBoxNameChange !== true) {
        return '';
      } else {
        return this.view.ui.nameInput.val();
      }
    },

    setValue: function (value) {
      this.view.ui.name.text(value);
      this.view.ui.name.attr('title', value);
    },

    setInputBoxValue: function (value) {
      if (!value) {
        value = '';
      }
      this.view.ui.nameInput.val(value);
    },

    _toggleEditMode: function (edit, setFocus) {
      setFocus === undefined && (setFocus = true);
      if (this.view.readonly) {
        edit = false;
      }
      if (edit) {
        if (this._isEditingEnabled()) {
          this.view.editing = true;
          this.view.ui.name.addClass('binf-hidden');
          this.view.ui.nameEditIconDiv && this.view.ui.nameEditIconDiv.addClass('binf-hidden');
          this.view.ui.nameEditIcon && this.view.ui.nameEditIcon.addClass('binf-hidden');
          this.view.ui.nameDropdownMenuDiv &&
          this.view.ui.nameDropdownMenuDiv.addClass('binf-hidden');
          this.view.ui.nameEditDiv.removeClass('binf-hidden');
          setFocus && this.view.ui.nameInput.focus();
          var currentInputElement    = this.view.ui.nameInput[0],
              currentInputElementVal = currentInputElement.value,
              selEnd                 = !!currentInputElementVal ? currentInputElementVal.length : 0;
          currentInputElement.selectionEnd = 0;
          if (this.view.model.get("type") === 144 && currentInputElementVal.lastIndexOf('.') > 0 &&
              currentInputElementVal.lastIndexOf('.') < currentInputElementVal.length - 1) {
            selEnd = currentInputElementVal.lastIndexOf('.');
          }
          currentInputElement.selectionEnd = selEnd;
          if (currentInputElementVal.length === 0) {
            this.view.ui.nameInput[0].placeholder = this.view.placeHolderName;
          }
          this.view.trigger('changed:editmode', this.view.editing);
        }
      } else {  // switch back to readonly mode
        if (this.view.$el.is(":visible")) {
          this.view.editing = false;
          this.view.ui.nameEditDiv.addClass('binf-hidden');
          this.view.ui.name.removeClass('binf-hidden');
          setFocus && this.view.ui.name.focus();
          this.view.ui.nameDropdownMenuDiv &&
          this.view.ui.nameDropdownMenuDiv.removeClass('binf-hidden');
          this.view.ui.nameEditIconDiv && this.view.ui.nameEditIconDiv.removeClass('binf-hidden');
          this.view.ui.nameEditIcon && this.view.ui.nameEditIcon.removeClass('binf-hidden');
          this.view.trigger('changed:editmode', this.view.editing);
        }
      }
    },

    _isEditing: function () {
      return this.view.editing;
    },

    _isEditingEnabled: function () {
      if (this.view.readonly) {
        return false;
      }
      if (this.view.model.get('id') === undefined) {
        return true;
      }

      var renameCommand = commands.get('Rename');
      return renameCommand && renameCommand.enabled({
            nodes: new Backbone.Collection([this.view.model]),
            context: this.view.options.context
          });
    },

    onClickName: function (event) {
      if (this.view.readonly) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (this.view.options.model instanceof VersionModel) {
        return;
      }

      this._toggleEditMode(true);
    },

    cancelEvent: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    onKeyReleased: function (event) {
      if (this.view.readonly) {
        return;
      }
      if (!(!!this.view.options && this.view.options.mode === 'create')) {
        event.preventDefault();
        event.stopPropagation();

        if (event.keyCode === 27) {
          this.cancelNameEdit(event);
        } else if (event.keyCode === 13) {
          if (!!this.view.options.originatingView &&
              _.isFunction(this.view.options.originatingView._validateAndSave)) {
            this.view.options.originatingView._validateAndSave();
          } else {
            this.view._validateAndSave();
          }
        } else if (this.getInputBoxValue() === "") {
          this.view.ui.nameInput[0].placeholder = this.view.placeHolderName ?
                                                  this.view.placeHolderName : '';
          this.view.inputBoxNameChange = false;
        }
      }
      this.toggleButton(event);
    },

    onBlurNameInput: function (event) {
      if (this.view.readonly) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (this.view.cancelEdit === true) {
        this.view.cancelEdit = false;
        return;
      }

      if (this.view.modelHasEmptyName && this.view.inputBoxNameChange !== true) {
        this.setInputBoxValue(this.placeHolderName);
        this.validate('');
      } else {
        if (!!this.view.options.originatingView &&
            _.isFunction(this.view.options.originatingView._validateAndSave)) {
          this.view.options.originatingView._validateAndSave();
        } else {
          this.view._validateAndSave();
        }
      }
    },

    cancelNameEdit: function (event) {
      if (this.view.readonly) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();

      this.cancelEdit = true;
      this.clearInlineError();

      this.view.inputBoxNameChange = this.view.modelHasEmptyName ? false : true;
      if (this.view.modelHasEmptyName && this.view.inputBoxNameChange !== true) {
        this.setInputBoxValue('');
        this.validate('');
        this.toggleButton(event);
      } else {
        this.setInputBoxValue(this.getValue());
        this._toggleEditMode(false);
        this.toggleButton();
      }
    },

    _getErrorMessageFromResponse: function (err) {
      var errorMessage;
      if (err && err.responseJSON && err.responseJSON.error) {
        errorMessage = err.responseJSON.error;
        base.MessageHelper.hasMessages() && (base.MessageHelper.reset());
      } else if (base.MessageHelper.hasMessages()) {
        var errorHtml = base.MessageHelper.toHtml();
        base.MessageHelper.reset();
        errorMessage = $(errorHtml).text();
      }
      return errorMessage;
    }

  });

  return ItemNameBehavior;

});
