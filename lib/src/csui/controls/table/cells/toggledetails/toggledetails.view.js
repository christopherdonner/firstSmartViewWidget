/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'hbs!csui/controls/table/cells/toggledetails/impl/toggledetails',
  'i18n!csui/controls/table/cells/toggledetails/impl/nls/lang',
  'css!csui/controls/table/cells/toggledetails/impl/toggledetails',
  'csui/lib/binf/js/binf'
], function (TemplatedCellView, cellViewRegistry, template, lang) {
  'use strict';

  var ToggleDetailsCellView = TemplatedCellView.extend({
        template: template,

        triggers: {
          'click a': 'toggle' // this disables handling the click event through bootstrap collapse
        },

        events: {"keydown": "onKeyInView"},

        getValueData: function () {
          return {
            hasMetadataRow: this.model.get('hasMetadataRow'),
            id: this.model.cid,
            rowIsExpanded: this.options.rowIsExpanded,
            expandToggleTooltip: this.options.rowIsExpanded ? lang.showLessTooltip : lang.showMoreTooltip,
            expandToggleAria: this.options.rowIsExpanded ? lang.showLessAria : lang.showMoreAria,
          };
        },

        onToggle: function (event) {
          var href = this.$('a').attr('href');
          var toToggle = this.$el.parent().parent().find("[id=" + href.replace("#", '') + "]"),
              self     = this;

          if (toToggle.hasClass("binf-collapse")) {
            this.options.rowIsExpanded = false;
            if (toToggle.hasClass("binf-in")) {
              toToggle.binf_collapse('hide').on('hidden.binf.collapse', function () {
                self.trigger("toggle:detailsrow",
                    {model: self.model, detailsRowIsExpanded: self.options.rowIsExpanded});
              });
            } else {
              toToggle.binf_collapse('show');
              this.options.rowIsExpanded = true;
            }
            this.trigger("toggle:detailsrow",
                {model: this.model, detailsRowIsExpanded: this.options.rowIsExpanded});
            this.render();
          }
        }
      },
      {
        hasFixedWidth: true,
        columnClassName: 'csui-table-cell-_toggledetails',
        rowIsExpandedModelAttributeName: 'csui-toggledetails-rowIsExpanded',
        widthFactor: 1 / 3.0
      }
  );
  cellViewRegistry.registerByColumnKey('_toggledetails', ToggleDetailsCellView);

  return ToggleDetailsCellView;
});
