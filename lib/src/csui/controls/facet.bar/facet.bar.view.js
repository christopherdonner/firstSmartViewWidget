/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/models/facets",
  "csui/models/facettopics",
  "csui/controls/facet.bar/facet.bar.items.view",
  "csui/behaviors/keyboard.navigation/tabable.region.behavior",
  "hbs!csui/controls/facet.bar/impl/facet.bar",
  "i18n!csui/controls/facet.bar/impl/nls/lang",
  "csui/utils/commands",
  "css!csui/controls/facet.bar/impl/facet.bar"
], function ($, _, Backbone, Marionette, FacetCollection,
    FacetTopicCollection, FacetBarItemsView, TabableRegionBehavior,
    template, lang, commands) {
  'use strict';

  var FacetBarView = Marionette.LayoutView.extend({
    className: 'csui-facet-bar csui-facet-bar-hidden',

    template: template,

    ui: {
      facetListArea: '> .csui-facet-list-bar > .csui-facet-list-area',
      facetList: '> .csui-facet-list-bar > .div.csui-facet-list-area > .csui-facet-list',
      clearAll: '.csui-clear-all',
      moveLeft: '.csui-overflow-left',
      moveRight: '.csui-overflow-right',
      movers: '.csui-mover',
      leftFader: '.csui-mover.csui-overflow-left > .csui-facet-list-fade',
      rightFader: '.csui-mover.csui-overflow-right > .csui-facet-list-fade',
      saveFilter: '.csui-filter-save'
    },

    regions: {
      facetBarItemsRegion: '.csui-facet-list-area',
      clearAllRegion: '.csui-clear-all'
    },

    triggers: {
      'click .csui-clear-all': 'clear:all'
    },

    events: {
      'click @ui.moveLeft': 'onMoveLeft',
      'click @ui.moveRight': 'onMoveRight',
      'click .csui-facet-item .binf-close': 'onRemoveFilter',
      'click @ui.saveFilter': 'onClickSaveFilter',
      'keydown': 'onKeyInView'
    },

    constructor: function FacetBarView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this.allTopicsCollection = new Backbone.Collection(this._getAllTopics(
          this.collection.filters));
      this.listenTo(this.collection, 'reset', this._filtersUpdated, this);
      this.onWinResize = _.bind(function () {
        this.render();
        this._filtersUpdated();
      }, this);
      $(window).bind("resize.facetview", this.onWinResize);
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode,
          retVal  = true,
          $target = $(event.target);

      switch (keyCode) {
      case 46:
        if ($target.parent().hasClass('csui-facet-item')) {
          this._triggerRemoveFilter($target.find('.binf-close'));
          retVal = false;
        }
        break;
      case 13:
        if ($target.parent().hasClass('csui-facet-item')) {
          this._triggerRemoveFilter($target.find('.binf-close'));
          retVal = false;
        }
        if ($target.hasClass('csui-clear-all')) {
          if (this.ui.saveFilter && this.ui.saveFilter.length > 0) {
            this.ui.saveFilter.addClass('binf-hidden');
          }
          this.trigger('remove:all');
          retVal = false;
        }
        break;
      case 32:
        retVal = false;
        break;
      }
      return retVal;
    },

    onDestroy: function () {
      $(window).unbind("resize.facetview", this.onWinResize);
    },

    onRender: function () {
      this.visibleItemIndex = 0;
      this.facetBarItemsView = new FacetBarItemsView({collection: this.allTopicsCollection});
      this.listenTo(this.facetBarItemsView, 'overflow', this._makeSlideable);
      this.listenTo(this.facetBarItemsView, 'scrolled', this._updateFading);
      this.facetBarItemsRegion.show(this.facetBarItemsView);
    },

    onMoveLeft: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.facetBarItemsView.scrollRight();
    },

    onMoveRight: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.facetBarItemsView.scrollLeft();
    },

    _makeSlideable: function (hasOverflow) {
      if (hasOverflow) {
        this.ui.facetListArea.addClass('csui-facet-list-overflowed');
        this.ui.movers.removeClass('binf-hidden');
      } else {
        this.ui.facetListArea.removeClass('csui-facet-list-overflowed');
        this.ui.movers.addClass('binf-hidden');
      }
    },

    _updateFading: function (options) {
      if (options.currentScrollLeft === 0) {
        this.ui.leftFader.addClass('binf-hidden');
        this.ui.rightFader.removeClass('binf-hidden');
      } else {
        if (options.currentScrollLeft === options.maxScrollLeft) {
          this.ui.leftFader.removeClass('binf-hidden');
          this.ui.rightFader.addClass('binf-hidden');
        } else {
          this.ui.leftFader.removeClass('binf-hidden');
          this.ui.rightFader.removeClass('binf-hidden');
        }
      }

    },

    _getAllTopics: function () {
      var allTopics = [];
      var filters = this.collection.filters;
      for (var i = 0; i < filters.length; i++) {
        var filter = filters[i],
            values = filter.values,
            facetId = filter.id,
            facet = this.collection.get(facetId),
            facetName = facet.get('name');
        for (var j = 0; j < values.length; j++) {
          var value = values[j],
              topicId = value.id,
              topic = facet.topics.get(topicId),
              topicName = topic.get('name');
          allTopics.push({
            facetName: facetName,
            topicName: topicName,
            facetId: facetId,
            topicId: topicId,
            facetItemAria: _.str.sformat(lang.facetItemAria, facetName, topicName)
          });
        }
      }
      return allTopics;
    },

    _filtersUpdated: function () {
      this.allTopicsCollection.reset(this._getAllTopics(this.collection.filters));
      if (this.allTopicsCollection.length > 0) {
        this.$el.removeClass('csui-facet-bar-hidden');
        this.$el.find('.csui-clear-all').removeClass('binf-hidden');
        this.trigger('facet:bar:visible');
      }
      else {
        this.$el.addClass('csui-facet-bar-hidden');
        this.$el.find('.csui-clear-all').addClass('binf-hidden');
        this.$el.find('.csui-filter-save').addClass('binf-hidden');
        this.trigger('facet:bar:hidden');
      }
      if (this.options.showSaveFilter && this.allTopicsCollection.length > 0) {
        if (this.ui.saveFilter && this.ui.saveFilter.length > 0) {
          this.ui.saveFilter.removeClass('binf-hidden');
        }
      }
    },

    templateHelpers: function () {
      return {
        clearAll: lang.clearAll,
        saveas: lang.saveAs,
        saveAsAria: lang.saveAsAria,
        showSaveFilter: this.options.showSaveFilter,
        previous: lang.previous,
        next: lang.next,
        clearAllAria: lang.clearAllAria
      };
    },

    onClearAll: function () {
      if (this.ui.saveFilter && this.ui.saveFilter.length > 0) {
        this.ui.saveFilter.addClass('binf-hidden');
      }
      this.trigger('remove:all');
    },

    onRemoveFilter: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this._triggerRemoveFilter($(e.target));
    },

    applyFilter: function (facet) {
      this.trigger('apply:filter', facet.newFilter);
    },

    onClickSaveFilter: function (event) {
      var context         = this.options.context,
          connector       = this.collection.connector,
          node            = this.collection.node,
          facetCollection = this.collection,
          saveFilter      = commands.get('SaveFilter'),
          promise         = saveFilter.execute({
            context: context,
            nodes: new Backbone.Collection(node),
            facets: facetCollection,
            container: node,
            connector: connector
          });
      promise.always(function () {
        var succeeded = promise.state() === 'resolved';
      });
    },

    _triggerRemoveFilter: function ($target) {
      this.trigger('remove:filter', {
        id: $target.attr('data-csui-facet'),
        values: [
          {id: $target.attr('data-csui-topic')}
        ]
      });
    }
  });

  return FacetBarView;
});
