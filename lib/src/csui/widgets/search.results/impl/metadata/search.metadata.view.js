/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/metadata/search.metadata',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, $, Backbone, Marionette, base, lang, itemTemplate) {
  "use strict";

  var SearchMetadataItemView = Marionette.ItemView.extend({
    className: "csui-search-item-details binf-col-lg-12",
    template: itemTemplate,
    templateHelpers: function () {
      var displayCount = 0;
      if (this.options.searchItemModel.get("description").length > 0 ||
          this.options.searchItemModel.get("summary").length > 0) {
        displayCount = 3;
      } else {
        displayCount = 2;
      }
      if (this._index < displayCount) {
        if (this._index < 2) {
          this.$el.addClass("csui-search-result-item-tobe-hide");
        }
      } else {
        this.$el.addClass(
            "csui-search-hidden-items truncated-" + this.options.rowId);
      }
      this.$el.attr('role', 'listitem');
      var data = this.getValueData();
      return {
        label: this.model.get("column_name"),
        value: data.formattedValue,
        tooltipText: data.value
      };
    },
    getValueData: function () {
      var model          = this.options.searchItemModel,
          column         = this.model.get("key"),
          columnType     = this.model.get("column_type"),
          value          = model.get(column),
          formattedValue = value;
      if (column === 'size') {
        var type = model.get('type');
        formattedValue = model.get(column + "_formatted");
        if (value === null) {
          return '';
        }
        if (model.get('container') && type !== 202 && type !== 899) {
          value = formattedValue = base.formatMessage(value, lang);
        } else if (type === 144 || type === 749 || type === 736 || type === 30309) {
          formattedValue = base.formatFriendlyFileSize(value);
          value = base.formatExactFileSize(value);
        }
      }
      if (columnType === 'date') {
        value = formattedValue = base.formatExactDateTime(value);
      }
      return {
        value: value,
        formattedValue: formattedValue
      };
    }
  });

  var SearchMetadataCollectionView = Marionette.CollectionView.extend({
    className: "csui-search-items-metadata",
    childView: SearchMetadataItemView,
    ui: {
      fieldsToBeHiddenOnHover: '.csui-search-result-item-tobe-hide'
    },
    childViewOptions: function () {
      return {
        rowId: this.options.rowId,
        searchItemModel: this.model
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

  return SearchMetadataCollectionView;
});