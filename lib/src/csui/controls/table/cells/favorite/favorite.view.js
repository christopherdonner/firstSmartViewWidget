/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore",
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/widgets/favorites/favorite.star.view',
  'css!csui/controls/table/cells/favorite/impl/favorite'
], function (_, TemplatedCellView, cellViewRegistry, FavoriteStarView) {

  var FavoriteStarCellView = TemplatedCellView.extend({

        getValueData: function () {
          return this.model.toJSON();
        },

        constructor: function FavoriteStarCellView(options) {
          TemplatedCellView.prototype.constructor.apply(this, arguments);
        },

        onBeforeDestroy: function () {
          this.triggerMethod('close:add:favorite:form');
          if (this.favStarView) {
            this.favStarView.destroy();
            this.favStarView = undefined;
          }
        },

        onRender: function () {
          if (!this.favStarView) {
            this.favStarView = new FavoriteStarView(_.extend({
              checkVisible: true,
              popoverAtBodyElement: true,
              focusable: false
            }, this.options));
          }
          this.listenTo(this.favStarView, 'show:add:favorite:form', function () {
            this.triggerMethod('show:add:favorite:form');
          });
          this.listenTo(this.favStarView, 'close:add:favorite:form', function () {
            this.triggerMethod('close:add:favorite:form');
          });
          this.favStarView.render();
          this.$el.append(this.favStarView.el);

          this.listenTo(this.options.tableView, 'scroll', function () {
            this.favStarView && this.favStarView.scrollCheckToClosePopover();
          });
        }

      },
      {
        hasFixedWidth: true,
        columnClassName: 'csui-table-cell-favorite'
      }
  );
  cellViewRegistry.registerByColumnKey('favorite', FavoriteStarCellView);

  return FavoriteStarCellView;

});
