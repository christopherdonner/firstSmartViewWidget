/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/list/list.view',
  'csui/controls/listitem/listitemstandard.view', 'csui/behaviors/limiting/limiting.behavior',
  'csui/behaviors/expanding/expanding.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/list/behaviors/list.view.keyboard.behavior',
  'csui/behaviors/collection.state/collection.state.behavior',
  'csui/controls/list/list.state.view',
  'csui/utils/contexts/factories/recentlyaccessed',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/progressblocker/blocker',
  'csui/utils/defaultactionitems', 'csui/utils/commands',
  'i18n!csui/widgets/recentlyaccessed/impl/nls/lang',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/base',
  'css!csui/widgets/recentlyaccessed/impl/recentlyaccessed'
], function (_, Marionette, ListView, ListItemStandard,
    LimitingBehavior, ExpandingBehavior, DefaultActionBehavior, TabableRegionBehavior,
    ListViewKeyboardBehavior, CollectionStateBehavior, ListStateView,
    RecentlyAccessedCollectionFactory, NodeTypeIconView, BlockingView,
    defaultActionItems, commands, lang, GlobalMessage, base) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';
  var RecentlyAccessedView = ListView.extend({

    constructor: function RecentlyAccessedView(options) {
      options || (options = {});
      _.defaults(options, {orderBy: 'access_date_last desc'});
      options.data || (options.data = {});
      options.data.titleBarIcon = options.data.showTitleIcon === false ?
                                  undefined : 'title-icon title-recentlyaccessed';

      options.tileViewToolbarItems = 'csui/widgets/recentlyaccessed/tileview.toolbaritems';
      this.context = options.context;
      this.showInlineActionBar = !accessibleTable;
      ListView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': 'onRenderItem',
      'before:destroy': 'onBeforeDestroyItem'
    },

    templateHelpers: function () {
      return {
        title: this.options.data.title || lang.dialogTitle,
        icon: this.options.data.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        searchAria: lang.searchAria,
        expandAria: lang.expandAria
      };
    },

    childView: ListItemStandard,

    childViewOptions: function () {
      return {
        templateHelpers: function () {
          return {
            name: this.model.get('short_name'),
            enableIcon: true,
            showInlineActionBar: !accessibleTable
          };
        },
        context: this.context,
        checkDefaultAction: true,
        toolbarData: {
          toolbaritems: this.options.tileViewToolbarItems,
          collection: this.completeCollection
        }
      };
    },

    behaviors: {
      LimitedList: {
        behaviorClass: LimitingBehavior,
        completeCollection: function () {
          var collection = this.options.collection ||
                           this.options.context.getCollection(RecentlyAccessedCollectionFactory);
          var limitedRS = RecentlyAccessedCollectionFactory.getLimitedResourceScope();
          collection.setResourceScope(limitedRS);
          collection.setEnabledDelayRestCommands(true);
          collection.setEnabledLazyActionCommands(false); //dont fetch lazy actions for recently
          return collection;
        },
        limit: 0
      },
      ExpandableList: {
        behaviorClass: ExpandingBehavior,
        expandedView: 'csui/widgets/recentlyaccessed/impl/recentlyaccessedtable.view',
        orderBy: function () { return this.options.orderBy; },
        titleBarIcon: function () { return this.options.data.titleBarIcon; },
        dialogTitle: lang.dialogTitle,
        dialogTitleIconRight: "icon-tileCollapse",
        dialogClassName: 'recentlyaccessed'
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

    onRender: function () {
      ListView.prototype.onRender.apply(this, arguments);
      this.$el.addClass('cs-recentlyaccessed');

      if (this.completeCollection.delayedActions) {
        this.listenTo(this.completeCollection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }
    },

    onRenderItem: function (childView) {
      childView._nodeIconView = new NodeTypeIconView({
        el: childView.$('.csui-type-icon').get(0),
        node: childView.model
      });
      childView._nodeIconView.render();

      childView.$el.attr('role', 'option');
    },

    onBeforeDestroyItem: function (childView) {
      if (childView._nodeIconView) {
        childView._nodeIconView.destroy();
      }
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onClickHeader: function (target) {
      this.triggerMethod('expand');
    }

  });

  return RecentlyAccessedView;

});
