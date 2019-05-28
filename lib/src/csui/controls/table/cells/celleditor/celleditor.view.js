/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/utils/base',
  'csui/controls/table/cells/templated/templated.view',
  'i18n!csui/controls/table/cells/celleditor/impl/nls/lang',
  'hbs!csui/controls/table/cells/celleditor/impl/celleditor',
  'css!csui/controls/table/cells/celleditor/impl/celleditor'
], function ($, _, Marionette, log, base, TemplatedCellView, lang, template) {

  var CellEditiorView = TemplatedCellView.extend({

    template: template,

    ui: {
      editCancel: '.csui-td-content-edit .csui-undo',
      cancelButton: '.csui-td-content-edit .csui-btn-cancel',
      inputField: '.csui-td-content-edit > input'
    },

    events: {
      'click @ui.editCancel': 'iconUndoClicked',
      'keyup @ui.inputField': 'keyReleased',
      'blur @ui.inputField': 'leftInputField',
      'click @ui.inputField': 'inputFieldClicked'
    },

    onRender: function () {
      this.ui.inputField.addClass('csui-input-full');
      this.ui.inputField.select();
    },
    endEdit: function () {
      this.editStarted = false;
      this.saving = false;
      delete this.model.csuiValueEdited;
      var elEditor = this.$el.find('.csui-td-content-edit');
      if (elEditor.length > 0) {
        $(elEditor[0]).remove();
      }
      this.model.unset('csuiErrorMessage'); // remove any error message -> renders row in table
      this.trigger('closed', this);
    },

    _cancelEdit: function () {
      if (this.leftInputFieldTimer) {
        clearTimeout(this.leftInputFieldTimer);
      }
      this.trigger('cancelEdit', this);
      this.endEdit();
    },

    _save: function () {
      if (this.editStarted) {

        var elInput = this.ui.inputField;
        var newName = elInput.val();
        newName = newName.trim();
        if (newName.length > 0) {
          this.saving = true;
          this.trigger('cellEditorWantsSave', {newName: newName});
        } else {
          this._cancelEdit(); // cancel if no value entered
        }
      }
    },

    inputFieldClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    iconUndoClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this._cancelEdit();
    },

    keyReleased: function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.leftInputFieldTimer) {
        clearTimeout(this.leftInputFieldTimer);
      }
      if (event.keyCode === 27) {
        this._cancelEdit();
      } else {
        if (event.keyCode === 13) {
          this._save();
        }
      }
    },

    leftInputField: function (event) {
      if (this.saving) {
        return;
      }

      var self = this;
      if (this.leftInputFieldTimer) {
        clearTimeout(this.leftInputFieldTimer);
      }
      this.leftInputFieldTimer = setTimeout(function () {
        self.leftInputFieldTimer = undefined;
        self._save();
      }, 100);

    },

    renderValue: function () {
      var data;
      if (this.model.csuiValueEdited) {
        data = {value: this.model.csuiValueEdited, formattedValue: this.model.csuiValueEdited};
      } else {
        data = this.getValueData();
      }
      data.useEditCancelIcon = this.model.get('id') !== undefined;
      data.CancelButtonLabel = lang.CancelButtonLabel;
      data.inputPlaceholder = lang.NewNamePlaceholder;

      var hasError = this.model.get('csuiErrorMessage') !== undefined;
      var html = data ? this.template(data) : '';
      var elEditor = this.$el.find('.csui-td-content-edit');
      if (elEditor.length > 0) {
        if (hasError) {
          $(elEditor[0]).addClass('binf-has-error');  // bootstrap validation error
        }
        $(elEditor[0]).replaceWith(html);
      } else {
        var newEditorEl = $(html);
        if (hasError) {
          newEditorEl.addClass('binf-has-error');  // bootstrap validation error
        }
        newEditorEl.appendTo(this.$el.find('.csui-td-container'));
      }
      this.editStarted = true;
      this.saving = false;
    }

  });

  return CellEditiorView;

});
