/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/lib/marionette", "csui/utils/log", 'csui/utils/base',
  'csui/utils/contexts/factories/recentlyaccessedcolumns',
  'csui/utils/contexts/factories/recentlyaccessed',
  'csui/widgets/recentlyaccessed/recentlyaccessed.columns',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/nodestable/nodestable.view',
  'csui/utils/commands',
  'csui/controls/globalmessage/globalmessage',
  'csui/widgets/recentlyaccessed/toolbaritems',
  'csui/widgets/recentlyaccessed/toolbaritems.masks',
  'hbs!csui/widgets/recentlyaccessed/impl/recentlyaccessedtable',
  'i18n!csui/widgets/recentlyaccessed/impl/nls/lang',
  'csui/behaviors/table.rowselection.toolbar/table.rowselection.toolbar.behavior',
  'css!csui/widgets/recentlyaccessed/impl/recentlyaccessedtable'
], function (module, $, _, Backbone, Marionette, log, base,
  RecentlyAccessedColumnsCollectionFactory,
  RecentlyAccessedCollectionFactory,
  RecentlyAccessedTableColumns,
  LayoutViewEventsPropagationMixin,
  NodesTable,
  commands,
  GlobalMessage,
  toolbarItems,
  ToolbarItemsMasks,
  template,
  lang,
  TableRowSelectionToolbarBehavior) {
  'use strict';

  var RecentlyAccessedTableView = NodesTable.extend({

    template: template,

    className: '',

    regions: {
      toolbarRegion: '.csui-rowselection-toolbar',
      tableRegion: '#tableviewRA',
      paginationRegion: '#paginationviewRA'
    },

    constructor: function RecentlyAccessedTableView(options) {
      NodesTable.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    behaviors: _.extend({
      TableRowSelectionToolbar: {
        behaviorClass: TableRowSelectionToolbarBehavior
      }
    }, NodesTable.prototype.behaviors),

    initialize: function () {
      this.collection = this.options.collection ||
        this.context.getCollection(RecentlyAccessedCollectionFactory);

      this._allCommands = this.defaultActionController.actionItems.getAllCommandSignatures(
        commands);
      this.collection.setResourceScope(RecentlyAccessedCollectionFactory.getDefaultResourceScope());
      this.collection.setDefaultActionCommands(this._allCommands);
      this.collection.setEnabledDelayRestCommands(true);

      if (this.collection.delayedActions) {
        this.listenTo(this.collection.delayedActions, 'error',
          function (collection, request, options) {
            var error = new base.Error(request);
            GlobalMessage.showMessage('error', error.message);
          });
      }

      this.columns = this.collection.columns ||
        this.context.getCollection(RecentlyAccessedColumnsCollectionFactory);

      _.defaults(this.options, {
        orderBy: 'access_date_last desc',
        tableColumns: RecentlyAccessedTableColumns,
        toolbarItems: toolbarItems
      });

      if (!this.options.toolbarItemsMasks) {
        this.options.toolbarItemsMasks = new ToolbarItemsMasks();
      }

      this.setTableView({
        orderBy: this.options.orderBy,
        filterBy: this.options.filterBy,
        nameEdit: false,
        haveDetailsRowExpandCollapseColumn: false,
        tableColumns: this.options.tableColumns,
        tableTexts: {
          zeroRecords: lang.emptyListText
        }
      });

      this.setPagination();

      if (this.options.collection) {
        this.collection.fetched = false;
      }
    },

    onRender: function () {
      if (this.options.collection && !this.options.collection.fetched) {
        this._originalScope = this.collection.getResourceScope();
        this.collection.setResourceScope(
          RecentlyAccessedCollectionFactory.getDefaultResourceScope());
        this.collection.setExpand('properties', ['parent_id', 'reserved_user_id']);

        this.collection.setDefaultActionCommands(this._allCommands);
        this.collection.setEnabledDelayRestCommands(true);

        this.collection.fetch({
          reload: true
        });
      }

      this.tableRegion.show(this.tableView);
      this.paginationRegion.show(this.paginationView);
    },

    onDestroy: function () {
      if (this.options.collection) {
        this.collection.setResourceScope(this._originalScope);
      }

      NodesTable.prototype.onDestroy.call(this);
    }
  });

  _.extend(RecentlyAccessedTableView.prototype, LayoutViewEventsPropagationMixin);

  return RecentlyAccessedTableView;
});