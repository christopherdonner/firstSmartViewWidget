/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  "csui/lib/marionette",
  'i18n!csui/controls/table/inlineforms/favorite/impl/nls/lang',
  'csui/controls/table/inlineforms/inlineform.registry',
  'csui/controls/table/inlineforms/inlineform/impl/inlineform.view',
  "hbs!csui/controls/table/inlineforms/favorite/impl/favorite",
  "css!csui/controls/table/inlineforms/favorite/impl/favorite"
], function ($, _, Marionette, lang, inlineFormViewRegistry, InlineFormView, template) {

  var InlineFormFavoriteView = InlineFormView.extend({

        className: function () {
          var className = "csui-inlineform-favorite";
          if (InlineFormView.prototype.className) {
            className += ' ' + _.result(InlineFormView.prototype, 'className');
          }
          return className;
        },

        template: template,

        templateHelpers: function () {
          var dataFromInlineFormView = this._templateHelpers();
          var disableSavebtn = !(!!this.model.get("favorite_name"));
          var data = _.extend(dataFromInlineFormView, {
            name: this.model.get('favorite_name'),
            namePlaceholder: lang.NewNamePlaceholder,
            disableSavebtn: disableSavebtn
          });
          return data;
        },

        ui: {},

        constructor: function InlineFormFavoriteView(options) {
          this.options = options || {};
          this.ui = _.extend({}, this.ui, InlineFormView.prototype.ui);
          this.events = _.extend({}, this.events, InlineFormView.prototype.events);

          InlineFormFavoriteView.__super__.constructor.apply(this, arguments);
        },

        _saveIfOk: function () {
          var inputName = this._getInputName();
          var name = this.model.get('favorite_name');
          if (inputName.length > 0 && inputName === name) {
            this.cancel();
          } else {
            if (inputName.length > 0) {
              this._save({favorite_name: inputName});
            }
          }
        }

      },
      {
        CSSubType: undefined  // favorites don't have a subtype in content server
      }
  );

  return InlineFormFavoriteView;
});
