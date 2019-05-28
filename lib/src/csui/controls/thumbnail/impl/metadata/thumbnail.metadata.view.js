/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'hbs!csui/controls/thumbnail/impl/metadata/thumbnail.metadata'
], function (_, $, Backbone, Marionette, base, itemTemplate) {
  "use strict";

  var ThumbnailMetadataItemView = Marionette.ItemView.extend({
    className: "csui-thumbnail-item-details binf-col-lg-12",
    template: itemTemplate,
    templateHelpers: function () {
      this.$el.attr('role', 'listitem');
      var value = this.getValueData();
      return {
        displayHeader: this.model.get("noTitleHeader"),
        label: this.model.get("key"),
        value: value
      };
    },
    getValueData: function () {
      var model      = this.options.thumbnailItemModel,
          column     = this.model.get("key"),
          columnType = this.model.get("column_type"),
          value      = model.get(column);
      if (columnType === 'date') {
        value = base.formatExactDateTime(value);
      }
      return value;
    }
  });

  var ThumbnailMetadataCollectionView = Marionette.CollectionView.extend({
    className: "csui-thumbnail-metadata",
    childView: ThumbnailMetadataItemView,
    childViewOptions: function () {
      return {
        rowId: this.options.rowId,
        thumbnailItemModel: this.model
      };
    },
    filter: function (child, index, collection) {
      if (child.get('key') === 'size') {
        return (this.model.get(child.get('key')) &&
                this.model.get(child.get('key') + "_formatted") !== "");
      } else {
        return (this.model.get(child.get('key')) && this.model.get(child.get('key')) !== "");
      }
    },
    onRender: function () {
      var collection = this.collection;
      this.bindUIElements();
    }
  });

  return ThumbnailMetadataCollectionView;
});