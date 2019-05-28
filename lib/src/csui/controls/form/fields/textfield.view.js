/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view',
  'csui/utils/url',
  'csui/utils/contexts/factories/connector',
  'i18n!csui/controls/form/impl/nls/lang',
  'hbs!csui/controls/form/impl/fields/textfield/textfield',
  'css!csui/controls/form/impl/fields/textfield/textfield',
  'csui/lib/binf/js/binf',
  'csui/lib/handlebars.helpers.xif'
], function (_, $, Backbone, Marionette, FormFieldView, Url, ConnectorFactory, lang, template) {
  "use strict";

  var TextFieldView = FormFieldView.extend({

    constructor: function TextFieldView(options) {
      FormFieldView.apply(this, arguments);

      var isUrlField = !!options.model.get("options") && !!options.model.get("options").type &&
                       options.model.get("options").type === 'url';
      if (isUrlField) {
        var dstr = this.model.get('data');

        if (this.mode === 'read' && !!this.getUpdatedUrlWithPatterns(this.model.get('data'))) {
          this.curVal = this.getUpdatedUrlWithPatterns(this.model.get('data'));
        }
      }
    },

    events: {
      'keypress @ui.readField': 'onKeyPressRead'
    },

    getDisplayValue: function () {
      return this.getEditValue();
    },

    getAbsoluteUrl: function(curVal) {
      var updatedData = curVal;
      if (TextFieldView.urlFuncProtocolPattern.test(curVal)) {
        this.connector = this.options.context.getObject(ConnectorFactory);
       updatedData = Url.combine(
            this.connector.connection.url.replace("/api/v1", "") + this.curVal);
      }
      return updatedData;
    },

    className: 'cs-formfield cs-textfield',

    template: template,

    templateHelpers: function () {
      var multiFieldLabel        = "",
          data                   = lang.noValue,
          readModeAria           = "", // better default value?
          readModeMultiFieldAria = "", // better default value?
          isRequired             = false,
          isReadOnly             = this.mode === "readonly",
          requiredTxt            = "",
          absUrl                 = '';

      isRequired = this.options.alpacaField && this.options.alpacaField.isRequired();
      requiredTxt = isRequired ? lang.requiredField : "";

      if (!!this.model.get('data')) {
        data = this.model.get('data');
      }
      absUrl = this.getAbsoluteUrl(data);
      if (this.alpacaField && this.alpacaField.options &&
          this.alpacaField.options.isMultiFieldItem) {
        multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                          this.alpacaField.parent.options.label : "";
      }
      if (this.model.get('options')) {
        readModeAria = isReadOnly ?
                       _.str.sformat(lang.fieldReadOnlyAria, this.model.get('options').label,
                           data) + requiredTxt :
                       _.str.sformat(lang.fieldEditAria, this.model.get('options').label, data) +
                       requiredTxt;
      }

      readModeMultiFieldAria = isReadOnly ?
                               _.str.sformat(lang.fieldReadOnlyAria, multiFieldLabel, data) +
                               requiredTxt :
                               _.str.sformat(lang.fieldEditAria, multiFieldLabel, data) +
                               requiredTxt;

      return _.extend(FormFieldView.prototype.templateHelpers.apply(this), {
        absUrl: absUrl,
        inputType: 'text',
        idBtnLabel: this.options.labelId,
        readModeAria: readModeAria,
        readModeMultiFieldAria: readModeMultiFieldAria,
        multiFieldLabel: multiFieldLabel,
        ariaRequired: isRequired
      });
    },

    onKeyPressRead: function (event) {
      if (event.keyCode === 13
          && this.model.attributes.options && this.model.attributes.options.type === 'url') {
        window.open(this.model.attributes.data, '_blank');
      }
    },

    allowEditOnEnter: function () {
      var bRet = true;
      if (this.model.attributes.options) {
        bRet = this.model.attributes.options.type !== 'url';
      }
      return bRet;
    },

    allowEditOnClickReadArea: function () {
      var bRet = true;
      if (this.model.attributes.options) {
        bRet = this.model.attributes.options.type !== 'url';
      }
      return bRet;
    },

    getEditValue: function () {
      var bIsUrl = this.model.attributes.options && (this.model.attributes.options.type === 'url');
      var val = this.ui.writeField.val();

      if (bIsUrl) {
        val = this.getUpdatedUrlWithPatterns(val);
      }

      return val;
    },

    getUpdatedUrlWithPatterns: function (urlValue) {
      if (!!urlValue && !TextFieldView.urlFuncProtocolPattern.test(urlValue) &&
          !TextFieldView.urlProtocolPattern.test(urlValue)) {
        urlValue = 'http://' + urlValue;
      }
      return urlValue;
    }

  }, {
    urlProtocolPattern: /^[a-z0-9]+:\/\//i,
    urlFuncProtocolPattern: /^\?func=[a-z0-9]/i
  });

  return TextFieldView;

});
