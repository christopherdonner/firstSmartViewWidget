/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/thumbnail/content/content.registry',
  'i18n!csui/controls/thumbnail/content/size/impl/nls/localized.strings',
  'hbs!csui/controls/thumbnail/content/size/impl/size',
  'css!csui/controls/thumbnail/content/size/impl/size'
], function ($, _, Backbone, Marionette, base, ContentRegistry, lang, template) {
  'use strict';

  var SizeView = Marionette.ItemView.extend({
    template: template,
    className: 'csui-thumbnail-size-container',

    templateHelpers: function () {
      var model = this.model,
          column = this.options.column,
          columnName = column.name,
          value = model.get(columnName),
          type = model.get('type'),
          formattedValue;

      if (value == null) {
        return "";
      }
      if (model.get('container')) {
        value = formattedValue = type !== 202 && type !== 899 ?
                                 base.formatMessage(value, lang) : '';
      } else if (type === 144 || type === 749 || type === 736 || type === 30309) {
        formattedValue = base.formatFriendlyFileSize(value);
        value = base.formatExactFileSize(value);
      } else {
        return "";
      }

      return {
        value: value,
        formattedValue: formattedValue,
        displayLabel: this.options.displayLabel,
        label: this.options.displayLabel ? lang.sizeLabel : "",
        cid: this.model.cid
      };
    },

    constructor: function SizeView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  ContentRegistry.registerByKey('size', SizeView);
  return SizeView;
});