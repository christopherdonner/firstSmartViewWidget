/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module",
  "csui/lib/underscore",
  "csui/lib/jquery",
  "csui/lib/marionette",
  "csui/models/facettopics",
  'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet/facet.key.navigation',
  "csui/utils/log",
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  "webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet/facet.item.view",
  "hbs!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet/facet",
  "i18n!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/nls/lang",
  "css!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet/facet"
], function (module, _, $, Marionette, FacetTopicCollection, KeyEventNavigation, log, TabableRegionBehavior,
             FacetItemView, template, lang) {

  var FacetView = Marionette.CompositeView.extend({

    childView: FacetItemView,
    template: template,
    className: 'csui-facet',

    childViewContainer: '.cs-filter-group',

    ui: {
      facetContent: '.csui-facet-content',
      facetHeader: '.csui-facet-header',
      facetHeaderIcon: '.csui-facet-header > .cs-icon',
      facetSubmitControls: '.csui-facet-controls',
      facetCollapseControls: '.csui-facet-collapse-controls',
      facetMoreText: '.csui-more-text',
      facetMoreIcon: '.csui-filter-more .cs-icon',
      facetMore: '.csui-filter-more',
      apply: '.csui-facet-controls .csui-apply',
      cancel: '.csui-facet-controls .csui-clear',
      selectCount: '.header-count'
    },

    childEvents: {
      'single:filter:select': 'onSingleFilterSelect',
      'multi:filter:select': 'onMultiFilterSelect',
      'keyupdown': 'cursorNextFilter',
      'keyleftright': 'cursorInsideFilter'
    },

    events: {
      'click .csui-filter-more:not(.binf-disabled)': 'onShowMore',
      'click .csui-facet-header': 'onShowFacet',
      'mouseleave': 'onMouseLeave',
      'keydown':  'onKeyInView'
    },

    triggers: {
      'click .csui-clear': 'clear:all',
      'click .csui-apply': 'apply:all'
    },


    templateHelpers: function () {
      var moreLabel = this.showAll ? lang.showLess : lang.showMore;
      return {
        'more': this.collection.length > this.itemsToShow ? moreLabel : undefined,
        'more-icon': this.showAll ? 'icon-expandArrowUp' : 'icon-expandArrowDown',
        'apply': lang.apply,
        'clear': lang.clear,
        'show-controls': this.selectItems.length > 0 ? 'csui-multi-select' : '',
        'show-content': this.showFacet ? '' : 'binf-hidden'
      };
    },

    childViewOptions: function () {
      return {enableCheckBoxes: this.options.enableCheckBoxes};
    },

    constructor: function FacetView(options) {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.$el.attr('tabindex', 0);
      this.options = options || {};
      this.collection = this.model.topics;
      this.itemsToShow = this.model.get('items_to_show');
      this.showAll = false;
      this.showFacet = true;
      this.selectItems = [];
    },

    onClearAll: function () {
      var checkboxes = this.$el.find('input:checkbox');

      this.selectItems = [];
      this.ui.facetCollapseControls.removeClass('multi-select');
      this.ui.selectCount.text('(0)');
      checkboxes.prop('checked', false).trigger('change');
      this._setDisabledFilters(0);
      this.$el.removeClass('multi-select');
      this._updateFacetSubmitControls();
      this.ui.facetHeader.removeClass('binf-disabled');
      this.trigger('activate:facet', this);
    },

    onApplyAll: function () {
      var facet = this.model,
        filters = this._getFilterArray();

      this.newFilter = {
        id: facet.get('id'),
        facetName: facet.get('name'),
        values: filters
      };
      this.trigger('apply:filter');
    },

    onAddChild: function (childView) {
      if (childView.getIndex() >= this.itemsToShow) {
        var className = this.showAll ? 'more' : 'more binf-hidden';
        childView.$el.addClass(className);
      }
    },

    onRender: function () {
      if (this.collection.length === 0) {
        this.$el.hide();
      }
    },

    onSingleFilterSelect: function (filter) {
      if (!filter.$el.hasClass('binf-disabled')) {
        if (this.$el.hasClass('multi-select')) {
          filter.$el.find('input:checkbox').click();
        }
        else {
          var facet = this.model;
          this.newFilter = {
            id: facet.get('id'),
            facetName: facet.get('name'),
            values: [{
              id: filter.model.get('value'),
              topicName: filter.model.get('name')
            }]
          };
          this.trigger('apply:filter');
        }
      }
    },

    onShowMore: function (event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.showAll = !this.showAll;
      this._setMoreLabel(this.showAll);
      this.trigger('facet:size:change');
    },

    onShowFacet: function (event) {
      if (event) {
      event.preventDefault();
      event.stopPropagation();
      }
      this.showFacet = !this.showFacet;
      if (this.showFacet) {
        this.ui.facetContent.removeClass('binf-hidden');
        this.ui.facetCollapseControls.removeClass('multi-select');
        this.ui.facetHeaderIcon[0].className = 'cs-icon csui-button-icon icon-expandArrowUp';
      }
      else {
        var checkItems = this.$el.find("input:checked").length;
        this.ui.facetContent.addClass('binf-hidden');
        this.ui.facetHeaderIcon[0].className = 'cs-icon csui-button-icon icon-expandArrowDown';
        if (checkItems) {
          this.ui.facetCollapseControls.addClass('multi-select');
        }
      }
      this.trigger('facet:size:change');
    },

    onMouseLeave: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    getIndex: function () {
      return this._index;
    },

    onMultiFilterSelect: function (childView) {
      var checkItems = this.$el.find("input:checked").length;
      this._updateSelectList(childView);
      this._updateFacetSubmitControls(checkItems);
      this._setDisabledFilters(checkItems);
      this.selectItems = (checkItems === 0) ? [] : this.selectItems;
      this.trigger('activate:facet', this);
    },

    _updateFacetSubmitControls: function () {
      var checkItems = this.$el.find("input:checked").length;

      if (checkItems > 0) {
        this.ui.facetSubmitControls.addClass('csui-multi-select');
        this.$el.addClass('multi-select');
        this.ui.facetHeader.addClass('binf-disabled');
      }
      else {
        this.ui.facetSubmitControls.removeClass('csui-multi-select');
        this.$el.removeClass('multi-select');
        this.ui.facetHeader.removeClass('binf-disabled');
      }
    },

    _updateSelectList: function (childView) {
      var childIndex = childView.getIndex();
      if (this.selectItems[childIndex]) {
        delete this.selectItems[childIndex];
      }
      else {
        this.selectItems[childIndex] = childView;
      }
    },

    _setDisabledFilters: function (checkItems) {
      var unselectedItems = this.$el.find("input:not(:checked)"),
        headerCount = checkItems;

      if (checkItems < 5) {
        unselectedItems.prop('disabled', false).trigger('change');
        unselectedItems.parent().parent().removeClass('binf-disabled');
      }
      else {
        unselectedItems.prop('disabled', true).trigger('change');
        unselectedItems.parent().parent().addClass('binf-disabled');
      }

      this.ui.selectCount.text(headerCount);
    },

    _setMoreLabel: function (showAll) {
      var moreItems = this.$el.find('.csui-facet-item.more');
      if ( this.ui.facetMoreIcon[0]){
      if (showAll) {
        moreItems.removeClass('binf-hidden');
        this.ui.facetMoreIcon[0].className = 'cs-icon icon-expandArrowUp';
        this.ui.facetMoreText.text(lang.showLess);
      }
      else {
        moreItems.addClass('binf-hidden');
        this.ui.facetMoreIcon[0].className = 'cs-icon icon-expandArrowDown';
        this.ui.facetMoreText.text(lang.showMore);
      }
      }
      this.trigger('facet:size:change');
    },

    _getFilterArray: function () {
      var filters = [];
      _.each(this.selectItems, function (item) {
        if (item) {
          filters.push({
            id: item.model.get('value'),
            topicName: item.model.get('name')
          });
        }
      });
      return filters;
    }

  });
  FacetView.version = '1.0';


  _.extend(FacetView.prototype, KeyEventNavigation);
  return FacetView;

});
