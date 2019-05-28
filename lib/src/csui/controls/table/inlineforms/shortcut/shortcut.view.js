/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!csui/controls/table/inlineforms/shortcut/impl/nls/lang',
  'csui/controls/table/inlineforms/inlineform.registry',
  'csui/controls/table/inlineforms/inlineform/impl/inlineform.view',
  'hbs!csui/controls/table/inlineforms/shortcut/impl/shortcut',
  'css!csui/controls/table/inlineforms/shortcut/impl/shortcut'
], function (_, Marionette, lang, inlineFormViewRegistry, InlineFormView, template) {

  var InlineFormShortcutView = InlineFormView.extend({

        className: function () {
          var className = "csui-inlineform-shortcut";
          if (InlineFormView.prototype.className) {
            className += ' ' + _.result(InlineFormView.prototype, 'className');
          }
          return className;
        },

        template: template,

        templateHelpers: function () {
          var dataFromInlineFormView = this._templateHelpers();
          var data = _.extend(dataFromInlineFormView, {
            namePlaceholder: lang.ShortcutNamePlaceholder
          });
          return data;
        },

        ui: {
          inputFieldName: '.csui-inlineform-input-name'
        },

        events: {},

        constructor: function InlineFormShortcutView(options) {
          this.options = options || {};
          this.ui = _.extend({}, this.ui, InlineFormView.prototype.ui);
          this.events = _.extend({}, this.events, InlineFormView.prototype.events);

          Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },

        _saveIfOk: function () {
          var inputName = this._getInputName();
          if (inputName && inputName.length > 0) {
            if (this.model.get('original_id') === undefined) {
              this.model.set('csuiInlineFormErrorMessage', lang.NoShortcutSelected);
            } else {
              var attributes;
              if (this.model.get('id') === undefined) {
                attributes = {name: inputName, original_id: this.model.get('original_id')};
              } else {
                attributes = {name: inputName};
              }
              this._save(attributes);
            }
          } else {
            this.model.set('csuiInlineFormErrorMessage', lang.NameMustNotBeEmpty);
          }
        }

      },
      {
        CSSubType: 1  // Content Server Subtype of Shortcut is 1
      }
  );

  inlineFormViewRegistry.registerByAddableType(
      InlineFormShortcutView.CSSubType,
      InlineFormShortcutView);

  return InlineFormShortcutView;
});
