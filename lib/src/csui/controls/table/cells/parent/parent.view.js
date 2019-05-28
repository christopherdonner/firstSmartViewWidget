/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/marionette',
  'csui/models/node/node.model',
  'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry',
  'csui/controls/table/cells/parent/impl/parent.with.icon.view',
  'csui/controls/table/cells/parent/impl/parent.with.text.view'
], function (_, Marionette, NodeModel, CellView, cellViewRegistry,
    ParentIconView, ParentTextView) {
  'use strict';

  var ParentCellView = CellView.extend({
    events: {
      keydown: 'onKeyInView'
    },

    constructor: function ParentCellView(options) {
      CellView.prototype.constructor.apply(this, arguments);

      var parent = this.model.get('parent_id_expand') || this.model.get('parent_id') ||
                   this.model.get('location_id_expand') || this.model.get('location_id');
      if (this.model.get("type") === 153) {
        parent = this.model.get('workflow_id_expand') || this.model.get('workflow_id');
      }
      this.parentModel = new NodeModel(parent, {connector: this.model.connector});
      this.parentIconView = new ParentIconView({
        model: this.parentModel,
        context: this.options.context
      });
      this.parentTextView = new ParentTextView({
        model: this.parentModel,
        context: this.options.context
      });

      this.contentRegion = new Marionette.Region({el: this.el});
    },

    renderValue: function () {
      this.contentRegion.show(this.parentIconView);
    },
    getValueText: function () {
      return this.parentModel.get('name');
    },

    getContentView: function() {
      return this.parentIconView;
    }
  }, {
    getModelExpand: function (options) {
      return {properties: ['parent_id']};
    }
  });

  cellViewRegistry.registerByColumnKey('parent_id', ParentCellView);
  cellViewRegistry.registerByColumnKey('location_id', ParentCellView);

  return ParentCellView;
});
