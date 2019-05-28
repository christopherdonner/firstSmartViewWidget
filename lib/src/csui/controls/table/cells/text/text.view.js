/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/table/cells/templated/templated.view',
  'i18n!csui/controls/table/impl/nls/lang',
  'hbs!csui/controls/table/cells/text/impl/text',
  'css!csui/controls/table/cells/text/impl/text',
], function (TemplatedCellView, lang, template) {

  var TextCellView = TemplatedCellView.extend({

    className: 'csui-truncate',
    template: template,

    renderValue: function () {
      var text = this.getValueText();
      var isEmpty = text === undefined || text.length === 0;
      if (isEmpty) {
        text = lang.cellNoTexAria;
      }
      var html = this.template({value: text, isEmpty: isEmpty});
      this.$el.html(html);
    }

  });

  return TextCellView;

});
