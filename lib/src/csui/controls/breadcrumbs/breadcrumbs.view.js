/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
 'csui/lib/underscore',
 'csui/lib/jquery',
 'csui/lib/backbone',
 'csui/lib/marionette',
 'csui/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view',
 'csui/utils/contexts/factories/next.node',
 'csui/behaviors/keyboard.navigation/tabable.region.behavior'
], function (
  _,
  $,
  Backbone,
  Marionette,
  BreadCrumbItemView,
  NextNodeModelFactory,
  TabableRegionBehavior) {

  var BreadCrumbCollectionView = Marionette.CollectionView.extend({

    tagName: 'ol',

    className: 'binf-breadcrumb',

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    childView: BreadCrumbItemView,

    childViewOptions: function(model, index) {
      return {
        childIndex: index,
        isLastChild: index == (model.get("showAsLink") ? this.collection.size() :
                               this.collection.size() - 1)
      };
    },

    constructor: function BreadcrumbCollectionView(options) {
      options || (options = {});
      this.completeCollection = options.collection;
      options.collection = new Backbone.Collection();

      Marionette.CollectionView.call(this, options);
    },

    initialize: function(options) {
      this.listenTo(this.completeCollection, 'sync', this.synchronizeCollections);

      var context = this.options.context;
      this._nextNode = options.node || context.getModel(NextNodeModelFactory);
      this.stop = this.options.stop || {};
      this.options.noOfItemsToShow = parseInt(this.options.noOfItemsToShow, 10);
      this._startSubCrumbs = 1;
      this._subCrumbsLength = 0;

      this.accLastBreadcrumbElementFocused = true;
      this.accNthBreadcrumbElementFocused = 0;

      this.resizeTimer = undefined;
      $(window).bind('resize', {view: this}, this._onWindowResize);
    },

    _onWindowResize: function(event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        if (self.resizeTimer) {
          clearTimeout(self.resizeTimer);
        }
        self.resizeTimer = setTimeout(function() {
          self._adjustToFit();
        }, 200);
      }
    },

    events: {'keydown': 'onKeyInView'},

    _breadcrumbSelector: 'a.csui-acc-focusable:visible',

    isTabable: function() {
      if (this.collection.models.length > 1) {
        return true;
      }
      return false;
    },

    currentlyFocusedElement: function() {
      if (this.isTabable()) {
        if (this.accLastBreadcrumbElementFocused) {
          return this.$(this._breadcrumbSelector + ':last');
        } else {
          var breadcrumbElements = this.$(this._breadcrumbSelector);
          return $(breadcrumbElements[this.accNthBreadcrumbElementFocused]);
        }
      } else {
        return $();
      }
    },

    onKeyInView: function(event) {
      var allBreadcrumbElements;

      switch (event.keyCode) {
      case 37:
      case 38:

        allBreadcrumbElements = this.$(this._breadcrumbSelector);
        if (this.accLastBreadcrumbElementFocused) {
          if (allBreadcrumbElements.length > 1) {
            this.accLastBreadcrumbElementFocused = false;
            this.accNthBreadcrumbElementFocused = allBreadcrumbElements.length - 2;
          }
        } else {
          if (this.accNthBreadcrumbElementFocused > 0) {
            this.accNthBreadcrumbElementFocused--;
          }
        }
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement().focus();

        break;
      case 39:
      case 40:

        if (!this.accLastBreadcrumbElementFocused) {
          allBreadcrumbElements = this.$(this._breadcrumbSelector);
          if (this.accNthBreadcrumbElementFocused < allBreadcrumbElements.length - 1) {
            this.accNthBreadcrumbElementFocused++;
            this.trigger('changed:focus', this);
            this.currentlyFocusedElement().focus();
          }
        }
        break;
      }
    },

    updateCompleteCollection: function(collection) {
      this.stopListening(this.completeCollection, 'sync');
      this.completeCollection = collection;
      this.listenTo(this.completeCollection, 'sync', this.synchronizeCollections);
      if (this.options.fetchOnCollectionUpdate !== false) {
        if (this.completeCollection.isFetchable()) {
          this.completeCollection.fetch();
        } else {
          this.collection.reset([]);
        }
      }
    },

    synchronizeCollections: function() {
      var excerpt = this.completeCollection.last(this.completeCollection.size()) || [];
      this._removeAcestorsFromStopPoint(excerpt, this.stop.id);
      this._removeAcestorsToNumItemsToShow(excerpt);
      this._subCrumbsLength = 0;
      this._refreshBreadCrumbsDisplay();
      this._adjustToFit();
      this.trigger('after:synchronized');
    },

    _refreshBreadCrumbsDisplay: function() {
      var subCrumbs,
          subCrumbsMenu,
          displayArr = this.completeCollection.last(this.completeCollection.size()) || [];
      this._removeAcestorsFromStopPoint(displayArr, this.stop.id);
      this._removeAcestorsToNumItemsToShow(displayArr);
      if (this._subCrumbsLength > 0) {
        subCrumbs = _.range(this._startSubCrumbs, this._startSubCrumbs + this._subCrumbsLength).map(
          function(rangeVal) {
            return displayArr[rangeVal];
          }
        );
        subCrumbsMenu = {
          id: -1,
          name: '...',
          subcrumbs: subCrumbs
        };
        displayArr.splice(this._startSubCrumbs, this._subCrumbsLength, subCrumbsMenu);
      }
      this.collection.reset(displayArr);
    },

    refresh: function() {
      this._adjustToFit();
    },

    _adjustToFit: function() {
      var maxDisplayWidth = this._getMaxDisplayWidth();
      if (this._getDisplayWidth() > maxDisplayWidth) {
        this._shrinkToFit(maxDisplayWidth);
      }
      else if (this._getDisplayWidth() < maxDisplayWidth) {
        this._expandToFit(maxDisplayWidth);
      }
      var tabEvent = $.Event('tab:content:field:changed');
      this.trigger(tabEvent);
    },

    _shrinkToFit: function(maxDisplayWidth) {
      var shrinkableItems = this.collection.size() - this._startSubCrumbs - 1;
      if (maxDisplayWidth > 0) {
        if (shrinkableItems > 0 && this._getDisplayWidth() > maxDisplayWidth) {
          this._adjustSubCrumbsLengthBy(1);
          this._shrinkToFit(maxDisplayWidth);
        }
      }
    },

    _expandToFit: function(maxDisplayWidth) {
      var shrinkableItems = this.collection.size() - this._startSubCrumbs - 1;
      if (maxDisplayWidth > 0) {
        if (this._subCrumbsLength > 0 && this._getDisplayWidth() < maxDisplayWidth) {
          this._adjustSubCrumbsLengthBy(-1);
          this._expandToFit(maxDisplayWidth);
        }
        else if (shrinkableItems > 0 && this._getDisplayWidth() > maxDisplayWidth) {
          this._adjustSubCrumbsLengthBy(1);
        }
      }
    },

    _adjustSubCrumbsLengthBy: function(amt) {
      this._subCrumbsLength += amt;
      this._subCrumbsLength = Math.min(this._subCrumbsLength,
          this.completeCollection.size() - this._startSubCrumbs);
      this._refreshBreadCrumbsDisplay();
    },

    _getMaxDisplayWidth: function() {
      return (this.$el.outerWidth() * 0.9);
    },

    _getDisplayWidth: function() {
      return _.reduce(this.$el.find(">li"), function(width, elem) {
        return (width + $(elem).outerWidth());
      }, 0);
    },

    childEvents: {
      'click:ancestor': 'onClickAncestor'
    },

    onClickAncestor: function (model, node) {
      var args = {node: node};
      this.trigger('before:defaultAction', args);
      if (!args.cancel) {
        var nodeId = node.get('id');
        if (this._nextNode.get('id') === nodeId) {
          this._nextNode.unset('id', {silent: true});
        }
        this._nextNode.set('id', nodeId);
      }

      this.$el.trigger('setCurrentTabFocus');
    },

    hide: function(hideBreadcrumb) {
      if (hideBreadcrumb) {
        this.$el.hide();
      }
      else {
        this.$el.show();
      }
      return true;
    },

    hideSubCrumbs: function() {
      var $subCrumb = this.$el.find('li.binf-dropdown');
      if ($subCrumb && $subCrumb.hasClass('binf-open')) {
        this.$el.find('.csui-subcrumb').click();
      }
    },

    updateStopId: function(newId) {
      this.stop.id = newId;
    },

    _removeAcestorsFromStopPoint: function(collection, stopId) {
      for (var i = 0; i < collection.length; i++) {
        if (collection[i].get('id') === stopId) {
          collection.splice(0, i);
          break;
        }
      }
    },

    _removeAcestorsToNumItemsToShow: function(collection) {
      if (this.options.noOfItemsToShow && this.options.noOfItemsToShow >= 0) {
        var limit = (this.options.noOfItemsToShow >= collection.length) ? 0 :
                    collection.length - this.options.noOfItemsToShow;
        collection.splice(0, limit);
      }
    },

    onBeforeDestroy: function() {
      $(window).unbind('resize', this._onWindowResize);
    }

  });

  return BreadCrumbCollectionView;

});
