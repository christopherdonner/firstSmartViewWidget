/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/metadata/impl/metadata.navigation.list.behavior',
  'csui/widgets/metadata/impl/metadata.navigation.list.view',
  'csui/widgets/metadata/metadata.view',
  'hbs!csui/widgets/metadata/impl/metadatanavigation/impl/metadatanavigation',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/browsing.states', 'csui/utils/contexts/factories/next.node',
  'i18n!csui/widgets/metadata/impl/metadatanavigation/impl/nls/lang',
  'css!csui/widgets/metadata/impl/metadatanavigation/impl/metadatanavigation'
], function (_, Backbone, Marionette, TabableRegionBehavior, MetadataNavigationListBehavior,
    MetadataNavigationListView, MetadataView, template, LayoutViewEventsPropagationMixin,
    BrowsingStateCollectionFactory, NextNodeModelFactory, lang) {
  'use strict';
  var MetadataNavigationView = Marionette.LayoutView.extend({

    className: 'cs-metadata',
    template: template,

    regions: {
      navigationRegion: ".metadata-sidebar",
      contentRegion: ".metadata-content"
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      },
      MetadataNavigationListBehavior: {
        behaviorClass: MetadataNavigationListBehavior
      }
    },

    constructor: function MetadataNavigationView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this.collection = options.collection;
      this.container = options.container;
      this.containerCollection = options.containerCollection;
      this.context = options.context;
      this.originatingView = options.originatingView;
      this.showCloseIcon = options.showCloseIcon;
      this.initiallySelected = this.options.selected;
      this.selectedTab = options.selectedTab;
      this.selectedProperty = options.selectedProperty;
      this.showPermissionView = options.showPermissionView;
      var title = options.container ? options.container.get('name') : '';
      if (!title && options.collection.length > 0 &&
          !!options.collection.models[0].collection.title) {
        title = options.collection.models[0].collection.title;
      }
      if (Object.getPrototypeOf(options.collection).constructor.name === 'NodeVersionCollection') {
        title = lang.versionsTitle;
      }
      if (!this.options.toolbarItems && this.originatingView && this.originatingView.options &&
          this.originatingView.options.toolbarItems) {
        this.options.toolbarItems = this.originatingView.options.toolbarItems;
      }

      var initiallySelectedModel = this._getInitiallySelectedModel();
      this.mdv = (this.options.data && this.options.data.contentView) ?
                 this.options.data.contentView :
                 new MetadataView({
                   model: initiallySelectedModel,
                   container: this.container,
                   containerCollection: this.containerCollection,
                   collection: this.collection,
                   context: this.context,
                   originatingView: this,
                   metadataNavigationView: this,
                   isExpandedView: !!this.options.isExpandedView,
                   showCloseIcon: this.showCloseIcon === undefined ? false : this.showCloseIcon,
                   selectedTab: this.selectedTab,
                   selectedProperty: this.selectedProperty,
                   showPermissionView: this.showPermissionView
                 });
      if (!this.options.data || !this.options.data.contentView) {
        this.mdv.internal = true;
      }

      this._subscribeToMetadataViewEvents();

      this.mdn = new MetadataNavigationListView({
        collection: options.collection,
        containerCollection: this.containerCollection,
        data: {
          back_button: (this.originatingView || this.containerCollection) ? true : false,
          title: title,
          nameAttribute: options.nameAttribute
        },
        originatingView: options.originatingView
      });
      this.listenTo(this.mdn, 'click:item', this.onClickItem);
      this.listenTo(this.mdn, 'click:back', this.onClickBack);
      this.listenTo(this.mdn, 'show:node', function (args) {
        this._showNode(args.model);
      });
      this.listenTo(this.mdv, 'disable:active:item', function (args) {
        this.mdn.$el.find('.binf-active').addClass('active-item-disable');
      }).listenTo(this.mdv, 'enable:active:item', function () {
        this.mdn.$el.find('.active-item-disable').removeClass('active-item-disable');
      });

      if (this.options.originatingView) {
        this.listenTo(this.options.originatingView, 'before:destroy', function () {
          this._closeMetadata();
        });
      }

      this.propagateEventsToRegions();
    },

    _getInitiallySelectedModel: function () {
      if (this.initiallySelected instanceof Backbone.Model) {
        var index = this.collection.findIndex({id: this.initiallySelected.get('id')});
        if (index < 0 || index > this.collection.length - 1) { return null; }
        return this.collection.at(index);
      } else if (this.initiallySelected && this.initiallySelected.length > 0) {
        return this.initiallySelected.models[0];
      } else if (this.collection && this.collection.length > 0) {
        return this.collection.models[0];
      } else {
        return null;
      }
    },

    onClickItem: function (item) {
      this._showNode(item.model);
    },

    onClickBack: function () {
      this._closeMetadata();
    },

    onItemNameChanged: function (newName) {
      var selectedItem  = this.mdn.getSelectedItem(),
          selectedIndex = this.mdn.getSelectedIndex();

      selectedItem.render(); // name has been set silently
      this.mdn.setSelectedIndex(selectedIndex);
    },

    _moveToNextItemAfterDeleteOrMove: function () {
      if (this.mdn.collection.length === 0) {
        this._closeMetadata();
      } else {
        var nextIndex = this.indexOfItemDeleteOrMove;
        nextIndex === this.mdn.collection.length && (nextIndex--);
        this.mdn.selectAt(nextIndex);
      }
    },

    onItemBeforeDelete: function (args) {
      this.indexOfItemDeleteOrMove = this.mdn.getSelectedIndex();
    },

    onItemDeleted: function (args) {
      this._moveToNextItemAfterDeleteOrMove();
    },

    onItemBeforeMove: function (args) {
      this.indexOfItemDeleteOrMove = this.mdn.getSelectedIndex();
      this.listenToOnce(this.containerCollection, 'remove', _.bind(this.onItemMoved, this));
    },

    onItemMoved: function (removedNode) {
      this.mdn.collection.remove(removedNode);
      this._moveToNextItemAfterDeleteOrMove();
    },

    _showNode: function (model) {
      var selectedTab = this.mdv.metadataTabView.tabLinks ?
                        this.mdv.metadataTabView.tabLinks.selected :
                        this.mdv.options.selectedTab ? this.mdv.options.selectedTab : "",
          activeTab   = this.mdv.metadataTabView.options.activeTab ?
                        this.mdv.metadataTabView.options.activeTab :
                        this.mdv.options.activeTab ? this.mdv.options.activeTab : "";
      if (this.mdv && this.mdv.internal) {
        this.mdv.destroy();
      }
      var browsingStates = this.context.getCollection(BrowsingStateCollectionFactory);
      var browsingState = browsingStates && browsingStates.at(browsingStates.length - 1);
      if (browsingState && _.has(browsingState.attributes.path, 'version_num')) {
        delete browsingState.attributes.path.version_num;
      }

      this.mdv = new MetadataView({
        model: model,
        container: this.container,
        containerCollection: this.containerCollection,
        collection: this.collection,
        context: this.context,
        originatingView: this,
        metadataNavigationView: this,
        showCloseIcon: this.showCloseIcon === undefined ? false : this.showCloseIcon,
        activeTab: activeTab,
        selectedTab: selectedTab,
        showPermissionView: this.showPermissionView
      });
      this.mdv.internal = true;

      this._subscribeToMetadataViewEvents();
      this.contentRegion.show(this.mdv);
    },

    onMetadataClose: function () {
      this._closeMetadata();
    },

    _closeMetadata: function () {
      var browsingStates = this.context.getCollection(BrowsingStateCollectionFactory);
      browsingStates && (browsingStates.triggerStateChangeOnStateRemoval = true);
      this.trigger('metadata:close', {sender: this});

      if (!this.originatingView && this.containerCollection && this.containerCollection.node) {
        var id = this.containerCollection.node.get('id');
        if (this.context && id !== undefined) {
          var nextNode = this.context.getModel(NextNodeModelFactory);
          if (nextNode) {
            if (nextNode.get('id') === id) {
              nextNode.unset('id', {silent: true});
            }
            nextNode.set('id', id);
          }
        }
      }
    },

    _subscribeToMetadataViewEvents: function () {
      this.listenTo(this.mdv, 'metadata:close', _.bind(function () {
        this._closeMetadata();
      }, this));
      this.listenTo(this.mdv, 'metadata:close:without:animation', _.bind(function () {
        this.trigger('metadata:close:without:animation', {sender: this});
      }, this));
      this.listenTo(this.mdv, 'item:name:changed', _.bind(this.onItemNameChanged, this));
      this.listenTo(this.mdv, 'metadata:item:before:delete', _.bind(function (args) {
        this.onItemBeforeDelete(args);
      }, this));
      this.listenTo(this.mdv, 'metadata:item:deleted', _.bind(function (args) {
        this.onItemDeleted(args);
      }, this));
      this.listenTo(this.mdv, 'metadata:item:before:move', _.bind(function (args) {
        this.onItemBeforeMove(args);
      }, this));
    }

  });

  _.extend(MetadataNavigationView.prototype, LayoutViewEventsPropagationMixin);

  return MetadataNavigationView;

});
