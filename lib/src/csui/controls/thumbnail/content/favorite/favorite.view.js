/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/widgets/favorites/favorite.star.view',
  'csui/controls/thumbnail/content/content.registry',
  'i18n!csui/controls/thumbnail/content/favorite/impl/nls/localized.strings',
  'hbs!csui/controls/thumbnail/content/favorite/impl/favorite',
  'css!csui/controls/thumbnail/content/favorite/impl/favorite'
], function ($, _, Backbone, Marionette, FavoriteStarView, ContentRegistry, lang, template) {
  'use strict';

  var FavoriteView = Marionette.LayoutView.extend({
    template: template,
    className: 'csui-thumbnail-favorite-container',

    regions: {
      favRegion: '.csui-thumbnail-favorite'
    },

    constructor: function FavoriteView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },
    onRender: function () {
      if (!this.favStarView) {
        this.favStarView = new FavoriteStarView(_.extend({
          checkVisible: true,
          popoverAtBodyElement: true,
          focusable: true
        }, this.options));
        this.favRegion.show(this.favStarView);
      }
      this.listenTo(this.favStarView, 'show:add:favorite:form', function () {
        this.triggerMethod('show:add:favorite:form');
      });
      this.listenTo(this.favStarView, 'close:add:favorite:form', function () {
        this.triggerMethod('close:add:favorite:form');
      });
      this.favStarView.render();
      this.$el.append(this.favStarView.el);

      this.listenTo(this.options.originatingView.thumbnail, 'scroll', function () {
        this.favStarView && this.favStarView.closePopover();
      });
    }
  });
  ContentRegistry.registerByKey('favorite', FavoriteView);
  return FavoriteView;
});
