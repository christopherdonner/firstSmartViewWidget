/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  "csui/lib/backbone",
  'csui/lib/marionette',
  'csui/controls/checkbox/checkbox.view',
  'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry',
  'i18n!csui/controls/table/impl/nls/lang',
  'css!csui/controls/table/cells/select/impl/select.view'
], function (_, $, Backbone, Marionette, CheckboxView, CellView, cellViewRegistry, lang) {

  var SelectCellView = CellView.extend({

        constructor: function (options) {
          SelectCellView.__super__.constructor.apply(this, arguments);
        },

        renderValue: function () {
          var self = this;
          this.$el.empty();

          var checked = this.model.get(SelectCellView.isSelectedModelAttributeName) === true;
          var checkboxTitle = _.str.sformat(lang.selectItem, this.model.get('name'));
          var checkboxAriaLabel = _.str.sformat(lang.selectItemAria, this.model.get('name'));

          var selectable = this.model.get('selectable') !== false;
          this.checkboxView = new CheckboxView({
            checked: checked ? 'true' : 'false',
            disabled: !selectable,
            ariaLabel: checkboxAriaLabel,
            title: checkboxTitle
          });
          var checkboxRegion = new Marionette.Region({el: this.el});
          checkboxRegion.show(this.checkboxView);

          var viewModel = this.checkboxView.model;

          this.listenTo(this.model, 'change:' + SelectCellView.isSelectedModelAttributeName,
              function (model, changedValue, options) {
                this.checkboxView.setChecked(changedValue);
              });

          this.checkboxView.listenTo(this.checkboxView, 'clicked', function (e) {
            e.cancel = true;
            var state = viewModel.get('checked');
            self.triggerMethod('clicked:checkbox', {checked: state});
          });

        }

      },
      {
        columnKey: '_select',
        hasFixedWidth: true,
        columnClassName: 'csui-table-cell-_select',
        isSelectedModelAttributeName: 'csuiIsSelected'
      }
  );
  cellViewRegistry.registerByColumnKey(SelectCellView.columnKey, SelectCellView);

  return SelectCellView;

});
