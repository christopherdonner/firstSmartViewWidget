/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/table/cells/cell.registry','csui/utils/node.links/node.links',
  'hbs!csui/controls/table/cells/type.icon/impl/type.icon',
  'i18n!csui/controls/table/impl/nls/lang',
  'css!csui/controls/table/cells/type.icon/impl/type.icon'
], function (_, Marionette, TemplatedCellView, NodeTypeIconView,
    cellViewRegistry, nodeLinks, template, lang) {
  'use strict';

  var TypeIconCellView = TemplatedCellView.extend({
    events: {
      'keydown': 'onKeyInView'
    },

    template: template,

    constructor: function TypeIconCellView(options) {
      TemplatedCellView.prototype.constructor.apply(this, arguments);
      this.needsAriaLabel = !this.options.column.defaultAction;
      this.listenTo(this, 'render', this._createNodeTypeIcon)
          .listenTo(this, 'before:render', this._destroyNodeTypeIcon)
          .listenTo(this, 'before:destroy', this._destroyNodeTypeIcon);
    },

    getValueData: function () {
      var node = this.model,
          defaultActionUrl = nodeLinks.getUrl(this.model),
          typeAndName = _.str.sformat(lang.typeAndNameAria, node.get('type_name'), node.get('name'));

      return {
        defaultAction: this.options.column.defaultAction,
        defaultActionUrl: defaultActionUrl,
        typeAndNameAria: typeAndName,
        inactive: node.get('inactive')
      };
    },

    _createNodeTypeIcon: function () {
      var iconView = new NodeTypeIconView({node: this.model});
      this.cellRegion = new Marionette.Region({el: this.$('> *')});
      this.cellRegion.show(iconView);
    },

    _destroyNodeTypeIcon: function () {
      if (this.cellRegion) {
        this.cellRegion.empty();
        this.cellRegion = null;
      }
    },

    getValueText: function () {
      return this.model.get('type_name') || '';
    }
  }, {
    hasFixedWidth: true,
    columnClassName: 'csui-table-cell-type',

    getModelExpand: function (options) {
      return {'versions.element(0)': ['mime_type']};
    }
  });

  cellViewRegistry.registerByColumnKey('type', TypeIconCellView);

  return TypeIconCellView;
});
