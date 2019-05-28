/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  "csui/lib/marionette",
  'i18n!csui/controls/table/inlineforms/folder/impl/nls/lang',
  'csui/controls/table/inlineforms/inlineform.registry',
  'csui/controls/table/inlineforms/inlineform/impl/inlineform.view',
  "hbs!csui/controls/table/inlineforms/folder/impl/folder",
  "css!csui/controls/table/inlineforms/folder/impl/folder"
], function ($, _, Marionette, lang, inlineFormViewRegistry, InlineFormView, template) {

  var InlineFormFolderView = InlineFormView.extend({

        className: function () {
          var className = "csui-inlineform-folder";
          if (InlineFormView.prototype.className) {
            className += ' ' + _.result(InlineFormView.prototype, 'className');
          }
          return className;
        },

        template: template,

        templateHelpers: function () {
          var dataFromInlineFormView = this._templateHelpers();
          var data = _.extend(dataFromInlineFormView, {
            namePlaceholder: lang.NewNamePlaceholder
          });
          return data;
        },

        ui: {},

        constructor: function InlineFormFolderView(options) {
          this.options = options || {};
          this.ui = _.extend({}, this.ui, InlineFormView.prototype.ui);
          this.events = _.extend({}, this.events, InlineFormView.prototype.events);

          Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },

        _saveIfOk: function () {
          var inputName = this._getInputName();
          var name = this.model.get('name');
          if (inputName.length > 0 && inputName === name) {
            this.cancel();
          } else {
            if (inputName.length > 0) {
              this._save({name: inputName}).fail(function (resp) {
                this.model.set({name: name}, {silent: true});
              }.bind(this));
            }
          }
        }

      },
      {
        CSSubType: 0  // Content Server Subtype of Folder is 0
      }
  );

  inlineFormViewRegistry.registerByAddableType(
      InlineFormFolderView.CSSubType,
      InlineFormFolderView);

  return InlineFormFolderView;
});
