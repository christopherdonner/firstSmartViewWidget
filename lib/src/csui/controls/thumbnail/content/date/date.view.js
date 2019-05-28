/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/thumbnail/content/content.registry',
  'i18n!csui/controls/thumbnail/content/date/impl/nls/localized.strings',
  'hbs!csui/controls/thumbnail/content/date/impl/date',
  'css!csui/controls/thumbnail/content/date/impl/date'
], function (module, $, _, Backbone, Marionette, base, ContentRegistry, lang, template) {
  'use strict';

  var config = _.extend({
    multiValueSeparator: ', '
  }, module.config());

  var DateView = Marionette.ItemView.extend({
    template: template,
    className: 'csui-thumbnail-date-container',

    templateHelpers: function () {
      var propertyValue = this.model.get(this.options.column.name);

      function format(singleValue) {
        return base.formatExactDateTime(singleValue);
      }

      var displayContent = this.getSingleOrMultipleValueData(propertyValue, format, format);
      if (this.options.displayLabel) {
        displayContent.label = this.options.contentModel.get("name") ?
                               this.options.contentModel.get("name") : lang.dateLabel;
      }
      displayContent.displayLabel = this.options.displayLabel;
      displayContent.cid = this.model.cid;
      return displayContent;
    },

    getSingleOrMultipleValueData: function (propertyValue, valueFormatter,
        formattedValueFormatter) {
      var value, formattedValue;
      if (Array.isArray(propertyValue)) {
        value = this.concatenateTextValues(propertyValue, valueFormatter);
        formattedValue = this.concatenateTextValues(propertyValue,
            formattedValueFormatter);
      } else {
        value = valueFormatter(propertyValue);
        formattedValue = formattedValueFormatter(propertyValue);
      }
      return {
        value: value,
        formattedValue: formattedValue
      };
    },

    concatenateTextValues: function (array, formatter) {
      formatter = this._validateFormater(formatter);
      return array.map(formatter).join(config.multiValueSeparator);
    },

    _validateFormater: function (formatter) {
      return formatter || function (value) { return value };
    },

    constructor: function DateView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  ContentRegistry.registerByDataType(-7, DateView);
  return DateView;
});