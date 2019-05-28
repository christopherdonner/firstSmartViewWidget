/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view',
  'hbs!csui/controls/form/impl/fields/passwordfield/passwordfield',
  'i18n!csui/controls/form/impl/fields/passwordfield/nls/lang',
  'css!csui/controls/form/impl/fields/passwordfield/passwordfield',
], function (_, $, Backbone, Marionette, FormFieldView, template, lang) {
  "use strict";

  var PasswordFieldView = FormFieldView.extend({

    constructor: function PasswordFieldView(options) {
      FormFieldView.apply(this, arguments);
    },

    className: 'cs-formfield cs-passwordfield',

    template: template,

    templateHelpers: function () {
      return _.extend(FormFieldView.prototype.templateHelpers.apply(this), {
        inputType: 'password',
        title: lang.title,
        placeholder: lang.title

      });
    }
  });

  return PasswordFieldView;
});
