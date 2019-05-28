/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/models/facets', 'csui/models/facettopics',
  'csui/controls/list/simplelist.view',
  'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet/facet.view',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet.panel.key.navigation',
  'csui/controls/progressblocker/blocker',
  'hbs!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet.panel',
  'i18n!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/nls/lang',
  'css!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet.panel'
], function (_, $, Backbone, FacetCollection, FacetTopicCollection,
    SimpleListView, FacetView, CollectionStateBehavior,
    TabableRegionBehavior, KeyEventNavigation, BlockingView, template, lang) {
  'use strict';

  var FacetPanelView = SimpleListView.extend({

    template: template,

    className: 'cs-simplelist csui-facet-panel',

    behaviors: {

      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        stateMessages: function () {
          return {
            empty: _.isEmpty(this.collection.filters) ?
                   lang.emptyFacetMessage :
                   lang.emptyFilteredFacetMessage,
            loading: lang.loadingFacetMessage,
            failed: lang.failedFacetMessage
          };
        }
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }

    },

    childView: FacetView,

    childViewOptions: function () {
      return {enableCheckBoxes: this.options.enableCheckBoxes};
    },

    childEvents: {
      'apply:filter': 'applyFilter',
      'activate:facet': 'setActiveFacet',
      'facet:size:change': '_updateScrollbar',
      'escape:focus': 'resetFacetFocus'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    onAddChild: function (childView) {
      var $child = childView.$el,
          self = this;
      if (childView.getIndex() === (this.collection.length - 1)) {
        $child.css('border-bottom', '0px');
      }
      $child.on('focus', function () {
        self.onSetNextChildFocus(childView);
      });
    },

    constructor: function FacetPanelView(options) {
      SimpleListView.prototype.constructor.apply(this, arguments);

      this.options.data.title = lang.facetTitle;
      this._onRemoveKeyboardFocus = _.bind(this._removeKeyboardFocus, this);
      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue({
          parent: this,
          local: this.options.blockingLocal
        });
      }
    },

    isTabable: function () {
      return !this.$el.parent().hasClass('binf-hidden');
    },

    onRenderCollection: function () {
      this.trigger('refresh:tabindexes');
    },

    onBeforeDestroy: function () {
      $(document).unbind('mousedown', this._onRemoveKeyboardFocus);
    },

    applyFilter: function (facet) {
      this.trigger('apply:filter', facet.newFilter);
    },
    setActiveFacet: function (facet) {
      if (facet.selectItems.length > 0) {
        this.children.each(function (view) {
          if (view.getIndex() !== facet.getIndex()) {
            view.$el.find('.csui-facet-content').addClass('facet-disabled');
          }
        });
      }
      else {
        this.$el.find('.csui-facet-content').removeClass('facet-disabled');
      }
    },

    _updateScrollbar: function () {
      this.triggerMethod('update:scrollbar', this);
    }

  });

  _.extend(FacetPanelView.prototype, KeyEventNavigation);
  return FacetPanelView;

});
