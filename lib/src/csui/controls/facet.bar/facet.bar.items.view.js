/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/marionette",
  'csui/controls/facet.bar/impl/facet.bar.item.view',
  'css!csui/controls/facet.bar/impl/facet.bar'
], function (_, $, Marionette,
    FacetBarItemView) {

  var FacetBarItemsView = Marionette.CollectionView.extend({

    childView: FacetBarItemView,
    tagName: "ol",
    className: 'csui-facet-list',

    constructor: function FacetBarItemsView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.collection, 'reset', this._checkOverflow);
      this.listenTo(this.collection, 'change', this._checkOverflow);
      this.listenTo(this.collection, 'add', this._checkOverflow);
      this.listenTo(this.collection, 'remove', this._checkOverflow);
      this.listenTo(this, 'dom:refresh', this._calcScrollSteps);
      this.listenTo(this, 'dom:refresh', this._checkOverflow);
    },

    _calcScrollSteps: function () {
      var el = this.$el[0];
      var ow = el.offsetWidth;
      var sw = el.scrollWidth;
      this.scrollStepPx = (ow / 3) * 2;
      if (sw > ow) {
        this.maxScrollLeft = sw - ow + 8; // add a few pixel to let it scroll enough to the left
      } else {
        this.maxScrollLeft = 0;
      }
    },

    _checkOverflow: function () {
      if (this.$el.length) {
        var el = this.$el[0];
        var ow = el.offsetWidth;
        var sw = el.scrollWidth;
        this.trigger('overflow', ow < sw);
        this.trigger('scrolled',
            {currentScrollLeft: this.$el.scrollLeft(), maxScrollLeft: this.maxScrollLeft});
      }
    },

    scrollLeft: function () {
      var el = this.$el;
      var currentScrollLeft = el.scrollLeft();
      var newScrollLeft = currentScrollLeft;
      if (currentScrollLeft < this.maxScrollLeft) {
        newScrollLeft = currentScrollLeft + this.scrollStepPx;
        if (newScrollLeft > this.maxScrollLeft) {
          newScrollLeft = this.maxScrollLeft;
        }
        el.animate({scrollLeft: newScrollLeft}, 500);
      }
      this.trigger('scrolled',
          {currentScrollLeft: newScrollLeft, maxScrollLeft: this.maxScrollLeft});
      return newScrollLeft;
    },

    scrollRight: function () {
      var el = this.$el;
      var currentScrollLeft = el.scrollLeft();
      var newScrollLeft = 0;
      if (currentScrollLeft > this.scrollStepPx) {
        newScrollLeft = currentScrollLeft - this.scrollStepPx;
      }
      el.animate({scrollLeft: newScrollLeft}, 500);
      this.trigger('scrolled',
          {currentScrollLeft: newScrollLeft, maxScrollLeft: this.maxScrollLeft});
      return el.scrollLeft();
    }
  });

  return FacetBarItemsView;
});
