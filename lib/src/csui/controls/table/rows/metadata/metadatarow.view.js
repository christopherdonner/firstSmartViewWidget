/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/table/rows/metadata/impl/metadatarow',
  'css!csui/controls/table/rows/metadata/impl/metadatarow',
  'css!csui/controls/form/impl/form'
], function ($, _, Marionette, template) {
  'use strict';

  var MetadataRowView = Marionette.ItemView.extend({
    className: "csui-table-metadata-view binf-container-fluid",

    template: template,

    templateHelpers: function () {
      var self = this;
      var meta = [];
      var cellView;

      _.each(this.options.columns, function (column) {
        cellView = new column.CellView({
          context: this.options.context,
          column: column,
          model: this.options.model,
          nameEdit: false
        });

        meta = meta.concat(this._getColumnAttributes(column, cellView));
      }, this);
      this._contentViews = [];
      _.each(meta, function (attribute) {
        attribute.id = _.uniqueId(attribute.name);
        if (attribute.contentView) {
          attribute.id = _.uniqueId(attribute.name);
          attribute.isRegion = true;
          attribute.regionLabelId = _.uniqueId("rl_" + attribute.id);
          self._contentViews.push({
            view: attribute.contentView,
            regionElementId: attribute.id
          });
        }
      });

      return {meta: meta};
    },

    _getColumnAttributes: function (column, cellView) {
      var attributes = [];

      if (_.isFunction(cellView.getAttributes)) {
        attributes = cellView.getAttributes();
      } else {
        var textValue        = cellView.getValueText(),
            tooltipTextValue = _.isFunction(cellView.getTooltipValueText) ?
                               cellView.getTooltipValueText() : textValue;
        attributes.push({
          label: column.title,
          value: textValue,
          tooltip: tooltipTextValue,
          name: column.name,
          contentView: _.isFunction(cellView.getContentView) ? cellView.getContentView() : undefined
        });
      }

      return attributes;
    },

    constructor: function MetadataRowView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onRender: function () {
      _.each(this._contentViews, function (contentView) {
        var $el = this.$el.find('#' + contentView.regionElementId);
        var contentRegion = new Marionette.Region({el: $el});
        contentRegion.show(contentView.view);
      }, this);
    },

    currentlyFocusedElement: function () {
      return $();
    }
  });

  return MetadataRowView;
});
