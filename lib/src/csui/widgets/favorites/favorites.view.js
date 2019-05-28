/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/factories/favorites2', 'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstandard.view',
  'csui/controls/listitem/simpletreelistitem.view',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view', 'csui/utils/contexts/factories/favorite2groups',
  'csui/models/favorites2', 'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'i18n!csui/widgets/favorites/impl/nls/lang',
  'css!csui/widgets/favorites/impl/favorites.view'
], function ($, _, Backbone, Marionette,
    Favorite2CollectionFactory, ListView, StandardListItem, SimpleTreeListView,
    ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    Favorite2GroupsCollectionFactory, Favorite2Collection,
    NodeTypeIconView, BlockingView, lang) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';
  var FavoritesView = ListView.extend({

    templateHelpers: function () {
      return {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        searchAria: lang.searchAria,
        expandAria: lang.expandAria
      };
    },

    events: {
      'click .tile-expand': 'onMoreLinkClick'
    },

    behaviors: {
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/favorites/impl/favorites2.table.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: 'icon-tileCollapse',
        dialogClassName: 'favorites'
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListViewKeyboardBehavior: {
        behaviorClass: ListViewKeyboardBehavior
      },
      CollectionState: {
        behaviorClass: CollectionStateBehavior,
        collection: function () {
          return this.completeCollection;
        },
        stateView: ListStateView,
        stateMessages: {
          empty: lang.emptyListText,
          loading: lang.loadingListText,
          failed: lang.failedListText
        }
      }
    },

    getChildView: function (item) {
      if (this.showFlatList) {
        return StandardListItem;
      } else {
        return SimpleTreeListView;
      }
    },

    childViewOptions: function () {
      return {
        templateHelpers: function () {
          if (this instanceof StandardListItem) {
            return {
              name: this.model.get('favorite_name'),
              enableIcon: true,
              showInlineActionBar: this.showInlineActionBar
            };
          } else {
            var ariaName;
            var name = this.model.get('name');
            if (this.model.childrenCollection && this.model.childrenCollection.length === 0) {
              ariaName = _.str.sformat(lang.favoritesEmptyGroupAria, name);
            } else {
              ariaName = _.str.sformat(lang.favoritesGroupAria, name);
            }
            return {
              icon: 'mime_fav_group32',
              name: name,
              ariaName: ariaName,
              expand: this.model.searchMode
            };
          }
        },

        childViewTemplateHelpers: function () {
          return {
            icon: this.model.get('icon'),
            name: this.model.get('favorite_name'),
            text: lang.emptyGroupDefaultText,
            showInlineActionBar: this.showInlineActionBar
          };
        },
        checkDefaultAction: true,
        context: this.context,
        toolbarData: this.toolbarData

      };
    },

    childEvents: {
      'click:item': '_onClickItem',  // event for flat list
      'click:tree:item': '_onClickTreeItem',
      'click:tree:header': '_onClickTreeHeader',
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    constructor: function FavoritesView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'favorite_name asc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-favourites';

      this.completeCollection = options.collection ||
                                options.context.getCollection(
                                    Favorite2GroupsCollectionFactory,
                                    {detached: true, permanent: true}
                                );
      var limitedRS = Favorite2CollectionFactory.getLimitedResourceScope();
      this.completeCollection.favorites.setResourceScope(limitedRS);

      var ViewCollection = Backbone.Collection.extend({
        model: this.completeCollection.model
      });
      options.collection = new ViewCollection();
      this.showInlineActionBar = !accessibleTable &&
        (options.showInlineActionBar === false ? options.showInlineActionBar : true);

      ListView.prototype.constructor.apply(this, arguments);

      BlockingView.imbue(this);
      this.listenTo(this.completeCollection, 'update sync',
          _.bind(this._synchronizeCollections, this));

      this._synchronizeCollections();

      this.listenTo(this, 'render', this._onRender);
      this.listenTo(this, 'change:filterValue', this._synchronizeCollections);

      if (this.showInlineActionBar) {
        options.tileViewToolbarItems = 'csui/widgets/favorites/tileview.toolbaritems';
        this.context = options.context;
        this.toolbarData = {
          toolbaritems: options.tileViewToolbarItems,
          collection: this.completeCollection.favorites
        };
      }
    },

    _onRender: function () {
      this.$el.addClass('cs-favorites');
      this.completeCollection.ensureFetched();
      this.$el.on('keydown', _.bind(this.onKeyDown, this));
      this._updateAccAttributes();
    },

    _updateAccAttributes: function () {
      this.$el.find('.tile-content').removeAttr('role aria-expanded');
      this.$el.find('.tile-content > .binf-list-group').removeAttr('role');
      this.$el.find('.tile-content')
          .attr('aria-label', this.options.data.title || lang.dialogTitle);
      if (this.showFlatList) {  // flat list
        this.$el.find('.tile-content > .binf-list-group').attr('role', 'listbox');
      } else {  // tree list
        this.$el.find('.tile-content')
            .attr('role', 'tree')
            .attr('aria-expanded', 'true');
        this.$el.find('.tile-content > .binf-list-group').attr('role', 'group');
      }
    },

    onRenderCollection: function () {
      this._updateAccAttributes();
    },

    onRenderItem: function (childView) {
      if (this.showFlatList) {
        childView._nodeIconView = new NodeTypeIconView({
          el: childView.$('.csui-type-icon').get(0),
          node: childView.model
        });
        childView._nodeIconView.render();
      }
      if (this.showFlatList) {
        childView.$el.attr('role', 'option');
      } // for tree view the role is set in the simpletreelistitem
    },

    onBeforeDestroyItem: function (childView) {
      if (this.showFlatList && childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    },

    _onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    _onClickTreeItem: function (target, src) {
      this.triggerMethod('execute:defaultAction', src.model);
    },

    _onClickTreeHeader: function (target) {
      this.trigger('update:scrollbar');
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    },

    onMoreLinkClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.triggerMethod('expand');
    },

    _synchronizeCollections: function () {
      var self = this;
      var connector = this.completeCollection.connector;
      var firstGroup = this.completeCollection.at(0);
      var favoritesCollection;
      var filterObj = {};
      filterObj['favorite_name'] = this.options.filterValue;

      if (this.completeCollection.length === 1 && firstGroup.get('tab_id') === -1) {
        this.showFlatList = true;
        favoritesCollection = new Favorite2Collection(undefined, {connector: connector});
        favoritesCollection.reset(firstGroup.favorites && firstGroup.favorites.models || []);
        favoritesCollection.setFilter(filterObj);
        if (!self.options.filterValue || self.options.filterValue.length === 0) {
          self.collection.reset(favoritesCollection.models);
        } else {
          self.listenTo(favoritesCollection, 'sync', function () {
            self.collection.reset(favoritesCollection.models);
          });
        }

      } else {
        self.showFlatList = false;
        var searchMode = this.isSearchOpen();
        var groups = new Backbone.Collection();
        var promises = [];

        _.each(this.completeCollection.models, function (group) {
          favoritesCollection = new Favorite2Collection(undefined, {connector: connector});
          favoritesCollection.reset(group.favorites.models);
          favoritesCollection.setFilter(filterObj);

          var groupModel = new Backbone.Model(group.attributes);
          groupModel.childrenCollection = favoritesCollection;
          groupModel.searchMode = searchMode;
          (groupModel.get('tab_id') === -1) && groupModel.set('flatten', true);
          groups.add(groupModel);
          if (self.options.filterValue && self.options.filterValue.length > 0) {
            var deferred = $.Deferred();
            promises.push(deferred.promise());
            self.listenTo(favoritesCollection, 'sync', function () {
              if (groupModel.childrenCollection.length === 0) {
                groups.remove(groupModel);
              }
              deferred.resolve();
            });
          }

        });
        if (self.options.filterValue && self.options.filterValue.length > 0) {
          $.when.apply($, promises).then(function () {
            self.collection.reset(groups.models);
          });
        } else {
          self.collection.reset(groups.models);
        }

      }
    },
    getElementByIndex: function (index, event) {
      if (this.showFlatList) {
        return ListView.prototype.getElementByIndex.call(this, index);
      }

      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var childView = this.children.findByIndex(index);
      if (childView && childView.currentlyFocusedElement) {
        return childView.currentlyFocusedElement(event);
      } else {
        return null;
      }
    }

  });

  return FavoritesView;

});
