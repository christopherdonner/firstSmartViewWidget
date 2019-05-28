/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/controls/tile/tile.view',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/widgets/search.custom/impl/search.object.view',
  'i18n!csui/widgets/search.custom/impl/nls/lang'
], function (_, Handlebars, Marionette, $, TileView, DefaultActionBehavior,
    SearchCustomObjectView, lang) {

  var CustomSearchWidgetView = TileView.extend({
    constructor: function CustomSearchWidgetView(options) {
      options || (options = {});
      options.title = options.title || lang.title;
      options.icon = options.titleBarIcon || 'title-customviewsearch';
      this.context = options.context;

      TileView.prototype.constructor.call(this, options);

      options = options.data ? _.extend(options, options.data) : options;
      this.options = options;
      this.options.parentView = this;
      this.contentViewOptions = this.options;
    },
    contentView: SearchCustomObjectView,
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },
    onShow: function () {
      this.$el.find('.tile-title .csui-heading').html('');
      this.listenTo(this.contentView, "change:title", this.updateTitle);
    },
    updateTitle: function () {
      this.$el.find('.tile-title .csui-heading').html(this.options.title);
      this.$el.find('.tile-title').attr("title", this.options.title);
      this.$el.find('.tile-controls').attr("title", this.options.title);
    }
  });
  return CustomSearchWidgetView;
});
