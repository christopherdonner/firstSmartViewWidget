/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/base',
  'csui/controls/table/cells/size/size.view',
  'csui/widgets/metadata/general.panels/node/node.general.form.model',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function (_, base, SizeView, NodeGeneralFormModel, lang) {
  'use strict';

  var DocumentGeneralFormModel = NodeGeneralFormModel.extend({

    constructor: function DocumentGeneralFormModel(attributes, options) {
      NodeGeneralFormModel.prototype.constructor.apply(this, arguments);
    },

    parse: function (response, options) {
      var form = NodeGeneralFormModel.prototype.parse.apply(this, arguments);

      this._addSizeInfo(form, options);

      return form;
    },

    _addSizeInfo: function (ret, options) {
      var type        = this.options.node.get('type'),
          val         = this.options.node.has('size'),
          column_name = (val ? '' : 'file_') + 'size';
      this.sizeView = new SizeView({
        model: this.options.node,
        column: {name: column_name}
      });

      var sizeVal = this.sizeView.getValueData().formattedValue,
          refNode =
              _.extend(ret.data, {
                size: !!sizeVal ? sizeVal :
                      base.getReadableFileSizeString(this.options.node.get('size'))

              });


      _.extend(ret.options.fields, {
        size: {
          hidden: false,
          readonly: true,
          label: lang.formFieldSizeLabel,
          placeholder: lang.alpacaPlaceholderNotAvailable,
          type: "text"
        }
      });

      _.extend(ret.schema.properties, {
        size: {
          hidden: false,
          readonly: true,
          title: lang.formFieldSizeLabel,
          type: "string",
          tooltip: this.sizeView.getValueData().value
        }
      });
    }

  });

  return DocumentGeneralFormModel;

});
