/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone',
  'csui/dialogs/node.picker/impl/node.list/list.item.view',
  "csui/controls/progressblocker/blocker",
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  "csui/models/node/node.model",
  'hbs!csui/dialogs/node.picker/impl/node.list/node.list',
  'hbs!csui/dialogs/node.picker/impl/node.list/empty.node.list',
  'csui/dialogs/node.picker/impl/search.list/search.location.view',
  'i18n!csui/dialogs/node.picker/impl/nls/lang',
  'css!csui/dialogs/node.picker/impl/node.list/node.list'
], function (_, $, Marionette, Backbone, ListItem, BlockingView, TabableRegion,
    PerfectScrollingBehavior, NodeModel, listTemplate, empty, SearchLocationView, npLang) {
  'use strict';

  var NoChildrenView = Marionette.ItemView.extend({
    template: empty,

    constructor: function NoSearchResultView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    }
  });

  var NodeListView = Marionette.CompositeView.extend({

    className: 'cs-list',

    template: listTemplate,

    emptyView: NoChildrenView,

    emptyViewOptions: function () {
      return {
        model: this.emptyModel
      };
    },

    templateHelpers: function () {
      return {
        searchView: this.options.searchView,
      };
    },

    childViewContainer: '.binf-list-group',
    childView: ListItem,

    childViewOptions: function () {
      return {
        searchView: this.options.searchView,
        locationEle: this.ui.location,
        resolveShortcuts: this.options.resolveShortcuts
      };
    },

    childEvents: {
      'click:item': 'onItemClick',
      'before:add:child': 'onBeforeAddChild',
      'change:child': 'onChangeChild'
    },

    ui: {
      listParent: '.list-content',
      list: '.binf-list-group',
      location: '.binf-search-location-group'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    onBeforeAddChild: function (child) {
      var childModel  = child.model,
          validTarget = this.commandType.validateTarget(childModel),
          childId     = childModel.get('id');
      validTarget = validTarget && _.every(this.commandType.unselectableNodes,
          function (unselectableId) {
            return childId !== unselectableId;
          });
      child.setValidity(validTarget);
    },

    onChangeChild: function (childModel) {
      if (childModel === this.collection) {
        return;
      }
      var child = this.children.findByModel(childModel);
      child.render();
      this.validateAndUpdateChild(child);
    },
    onAddChild: function (child) {
      var id = child.model.get('id');

      if (this.selectItems[id]) {
        this.selectItems[id] = child;
        this.toggleSelectedChild(child);
      }
      this.validateAndUpdateChild(child);
      if (this.browsedChild && (this.browsedChild.model.get('id') === id)) {
        this.browsedChild = child;
        this.toggleBrowsedChild(child);
      }
      return true;
    },

    shouldDisable: function (node) {
      if (node === undefined) {
        return true;
      }
      if (this.commandType.isActionNode(node)) {
        return true;
      }
      if (this.options.resolveShortcuts && node.get('type') === 1 && node.original !== undefined) {
        return this.shouldDisable(node.original);
      }
      return (!this.commandType.isSelectable(node) && !this._isBrowsable(node));
    },

    validateAndUpdateChild: function (child) {
      if (!this.options.searchView && !this.commandType.validateNode(child.getResolvedModel())) {
        child.$el.hide();
      } else {
        child.$el.addClass('csui-acc-focusable');
      }

      var disable = this.shouldDisable(child.model);
      child.setEnable(!disable);

      if (this._isBrowsable(child.model)) {
        child.ui.link.attr('aria-haspopup', 'true');
        child.ui.link.attr('aria-expanded', 'false');
      } else {
        child.ui.link.removeAttr('aria-haspopup');
        child.ui.link.removeAttr('aria-expanded');
      }
    },

    collectionEvents: {'sync': 'syncUpdate', 'change': 'onChangeChild'},

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '> .list-content',
        suppressScrollX: true
      },

      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    isTabable: function () {
      return this.children.find(function (view) {
        var $el = view.$el;
        return ($el.is(':visible') && !$el.is(':disabled'));
      });
    },

    currentlyFocusedElement: function () {
      var focusables = this.$el.find('.binf-list-group-item.csui-acc-focusable');
      if (focusables.length) {
        return $(focusables[this.focusIndex]);
      }
    },

    setFocus: function () {
      var focusables = this.$el.find('.binf-list-group-item.csui-acc-focusable');
      $(focusables[this.focusIndex]).focus();
    },

    onKeyInView: function (event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('.binf-list-group-item.csui-acc-focusable');

      switch (keyCode) {

      case 9:
        if (!document.activeElement.classList.contains("search-location-name")) {
          this.locationView.focusIndex = this.focusIndex;
        }
        break;
      case 38:
      case 40:
        if (keyCode === 38) {
          this.focusIndex > 0 && --this.focusIndex;
        }
        else {
          this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
        }
        if (document.activeElement.classList.contains("search-location-name")) {
          focusables = this.$el.find('.search-location-name.csui-acc-focusable');
        }
        this.trigger('changed:focus');
        $(focusables[this.focusIndex]).focus();
        break;
      case 35: //end
        this.focusIndex = this.collection.length - 1;
        this.trigger('changed:focus');
        $(focusables[this.focusIndex]).focus();
        break;
      case 36: //home
        this.focusIndex = 0;
        this.trigger('changed:focus');
        $(focusables[this.focusIndex]).focus();
        break;
      }
    },

    constructor: function NodeListView(options) {
      options || (options = {});
      _.defaults(options, {pageSize: 30});

      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.jQuery = $;
      BlockingView.imbue(this);

      this.selectItems = _.extend({}, options.selection);
      this.blockScroll = true;
      this.notFetching = true;
      this.init = true;         //makes sure only one blocker is activated at a given time due to an end-of-scroll.
      this.nextCollectionPage = _.bind(this.addNextCollectionPage, this);
      this.commandType = options.commandType;
      this.focusIndex = 0;         //used for accessiblity

      this.emptyModel = new Backbone.Model({
        noSearchResultMessage: ''
      });
      this.listenTo(this.collection, 'sync', function () {
        if (this.collection.totalCount === 0) {
          $(".binf-list-group").removeClass("search-left-item");
          this.$el.find(".binf-list-group").addClass("csui-no-results");
        } else {
          this.$el.find(".binf-list-group").removeClass("csui-no-results");
        }
        this.emptyModel.set('noSearchResultMessage', npLang.noSearchResultMessage);
      });
      this.locationView = new SearchLocationView({
        collection: this.collection
      });
      this.listenTo(this.locationView, "click:location", this.onClickLocation);
      this.listenTo(this.collection, "request", this.setBlocker);
      this.listenTo(this.collection, "reset", this.setBlocker);
      this.listenTo(this, "browse:complete", function () {
        this.notFetching = true;
      });

    },

    onRender: function (e) {
      var locationRegion = new Marionette.Region({
        el: this.ui.location
      });
      if (this.options.searchView) {
        locationRegion.show(this.locationView);
      }
    },

    onClickLocation: function (node) {
      this.trigger("click:location", node);
    },

    syncUpdate: function () {
      this.nextTriggerSetting = this.options.pageSize / 2;
      this.blockScroll = true;
      this.notFetching = true;
      this.init = true;

      this.unblockActions();
      this.confirmSelectionList();
      this.trigger('dom:refresh');
    },
    reset: function () {
      this.init = true;

      if (this.scrollBar) {
        this.scrollBar.scrollTop(0);
      }
    },

    stopBlocker: function () {
      this.unblockActions();
      return true;
    },
    setBlocker: function () {
      if (this.blockScroll) {
        this.blockScroll = false;
        this.blockActions();
      }
      return true;
    },

    addNextCollectionPage: function (event, args) {
      var collectionLength  = this.collection.length,
          scrollableHeight  = this.ui.list.height() - this.ui.listParent.height(),
          scrollRelativePos = this.ui.listParent.scrollTop() / scrollableHeight,
          nextJump          = (collectionLength - this.nextTriggerSetting) / collectionLength;

      if (collectionLength < this.collection.totalCount &&
          (scrollRelativePos >= nextJump)) {
        var self = this;
        if (this.notFetching) {
          this.notFetching = false;
          this.collection.setSkip(collectionLength, false);
          this.collection.fetch({
            reset: false,
            remove: false,
            merge: false
          }).done(function () {
            if (self.options.resolveShortcuts) {
              var nodesToResolve = self.collection.filter(function (node, index) {
                return (index >= collectionLength) && self.commandType.shouldResolveShortcut(node);
              });
              self.resolveShortcuts(nodesToResolve);
            }
          });
        }
        if (scrollRelativePos > 0.98 && this.init) {
          this.setBlocker();
          this.init = false;
        }
      }
    },
    resolveShortcuts: function (collection) {
      var self              = this,
          shortcutDeferreds = [];
      if (!self.options.resolveShortcuts) {
        return $.Deferred().resolve();
      }

      collection.filter(self.commandType.shouldResolveShortcut)
          .forEach(function (node) {
            var originalId = node.original !== undefined ? node.original.get('id') :
                             node.original_id;
            var original = new NodeModel({id: originalId}, {
              connector: node.connector
            });
            shortcutDeferreds.push(original.fetch().done(function () {
              node.original = original;
              node.trigger('change', node);
            }));
          });
      return $.whenAll.apply($, shortcutDeferreds);
    },

    onDomRefresh: function () {
      if (!this.scrollBar) {
        this.scrollBar = this.ui.listParent;
        this.scrollBar.on('scroll', this.nextCollectionPage);
      }
    },

    onItemClick: function (child) {
      Backbone.trigger('closeToggleAction');
      if (child.$el.hasClass('csui-disabled')) {
        return;
      }
      if (this.options.searchView) {
        this.childView = ListItem;
        this._processClickedItem(child);
        if (child.getResolvedModel().get("container")) {
          this.jQuery(".csui-node-picker .binf-search-location-group").addClass('binf-hidden');
          this.jQuery(".csui-node-picker .csui-search-item-right-panel").addClass('binf-hidden');
        }
      } else {
        this._processClickedItem(child);
        this.options.searchView = false;
        child.options.searchView = false;
      }
      var clickedFocusables = this.$el.find('.binf-list-group-item.csui-acc-focusable');
      this.focusIndex = $(clickedFocusables).index(child.el);
      this.trigger('changed:focus');
      $(clickedFocusables[this.focusIndex]).focus();
    },

    _processClickedItem: function (child) {
      var browseable = this._isBrowsable(child.getResolvedModel());
      if (this.notFetching) {
        this.notFetching = false;

        if (!browseable) {
          this._targetSelection(child);
        } else {
          this._browseSelection(child);
        }
        child.$el.blur();
      }
      this.$el.trigger('setCurrentTabFocus');
      return true;
    },

    clearSelect: function () {
      var self = this;

      _.each(this.selectItems, function (item) {
        self.toggleSelectedChild(item);
      });
      this.selectItems = {};
      return true;
    },

    toggleSelectedChild: function (child) {
      if (this.commandType.isSelectable(child.getResolvedModel())) {
        child.toggleSelect();
      }
    },

    toggleBrowsedChild: function (child) {
      child && child.toggleBrowse();
    },

    confirmSelectionList: function () {
      _.each(this.selectItems, function (node, id) {
        var itemModel = _.find(this.collection.models, function (model) {
          return model.get('id').toString() === id;
        });
        if (!itemModel && !this.commandType.multiSelect) {
          delete this.selectItems[id];
          this.trigger('selection:change', {node: this._getNodeForSelection(node), add: false});
        }
      }, this);
    },

    _isBrowsable: function (node) {
      if (this.options.resolveShortcuts &&
          node.get('type') === 1 && node.original !== undefined) {
        return this.commandType.browseAllowed(node.original);
      }
      return this.commandType.browseAllowed(node);
    },
    _targetSelection: function (child) {
      var model        = this._getNodeForSelection(child),
          childId      = model.get('id'),
          prevSelected = child.isSelected();
      if (prevSelected) {
        this.toggleSelectedChild(child);
        delete this.selectItems[childId];

      } else {
        if (!this.commandType.multiSelect) {
          this.clearSelect();
        }
        this.selectItems[childId] = child;
        this.toggleSelectedChild(child);
      }

      this.trigger('selection:change', {node: model, add: !prevSelected});
      this.notFetching = true;
    },

    _browseSelection: function (child) {
      var node            = child.getResolvedModel(),
          selectableType  = this.commandType.isSelectableType(node),
          browsable       = this.commandType.browseAllowed(node),
          selectable      = this.commandType.isSelectable(node),
          alreadyBrowsed  = child.isBrowsed(),
          alreadySelected = child.isSelected(),
          addToSelection  = false;

      if (alreadyBrowsed || alreadySelected) {
        selectable && this._targetSelection(child);
        this.notFetching = true;
      }
      else {
        if (selectable) {
          this._browseNSelect(child);
          addToSelection = true;
        } else {
          if (browsable || selectableType) {
            this.clearSelect();
            addToSelection = true;
          }
          this.toggleBrowsedChild(child);
        }

        this.options.searchView = false;
        child.options.searchView = false;
        this._browse(child, addToSelection);
        if (addToSelection) {
          this.trigger('selection:change',
              {node: this._getNodeForSelection(child), silent: true, add: addToSelection});
        }
      }
    },

    _browse: function (child, addToSelection) {
      var self = this;
      this.browsedChild && this.browsedChild.toggleBrowse();
      this.browsedChild = child;
      child.ui.link.attr('aria-expanded', 'true');

      this.trigger('browse:select', {node: child.getResolvedModel(), add: addToSelection});
    },

    _browseNSelect: function (child) {
      var childId = this._getNodeForSelection(child).get('id');
      if (!this.commandType.multiSelect) {
        this.clearSelect();
      }
      this.selectItems[childId] = child;
      child.assignedBrowseNSelect();
    },

    _getNodeForSelection: function (child) {
      var node = child.model;
      if (this.options.resultOriginalNode && child.model.original != null) {
        node = child.model.original;
      }
      return node;
    }

  });

  return NodeListView;

});
