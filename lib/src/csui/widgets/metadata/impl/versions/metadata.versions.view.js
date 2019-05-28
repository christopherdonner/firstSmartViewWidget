/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore",
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/controls/table/table.view',
  'csui/controls/pagination/nodespagination.view',
  'csui/utils/versions.default.action.items',
  'csui/utils/commands/versions',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/models/nodes',
  'csui/models/columns',
  'csui/models/nodeversions',
  'csui/models/version',
  'csui/widgets/metadata/impl/versions/metadata.versions.columns',
  'csui/widgets/metadata/versions.toolbaritems',
  'csui/widgets/metadata/versions.toolbaritems.mask',
  'hbs!csui/widgets/metadata/impl/versions/metadata.versions',
  'css!csui/widgets/metadata/impl/versions/metadata.versions'
], function (module, $, _, Backbone, Marionette, base,
    GlobalMessage,
    LayoutViewEventsPropagationMixin,
    FilteredToolItemsCollection,
    ToolbarView,
    DelayedToolbarView,
    TableView,
    PaginationView,
    defaultActionItems,
    commands,
    TableRowSelectionToolbarView,
    ToolbarCommandController,
    NodeCollection,
    NodeColumnCollection,
    NodeVersionCollection,
    VersionModel,
    metadataVersionsColumns,
    toolbarItems,
    VersionsToolbarItemsMask,
    template) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30,
    defaultPageSizes: [30, 50, 100],
    enabled: true
  });

  var MetadataVersionsTableView = Marionette.LayoutView.extend({

    className: function () {
      var className = 'metadata-inner-wrapper';
      if (accessibleTable) {
        className += ' csui-no-animation';
      }
      return className;
    },
    template: template,

    ui: {
      tableRowSelectionToolbarView: '.csui-metadata-versions-rowselection-toolbar-view',
      tableView: '.csui-table-view',
      childContainer: '.csui-table-view',
      paginationView: '.csui-pagination-view'
    },

    regions: {
      tableRowSelectionToolbarRegion: '@ui.tableRowSelectionToolbarView',
      tableRegion: '@ui.tableView',
      paginationRegion: '@ui.paginationView'
    },

    constructor: function MetadataVersionsTableView(options) {
      this.commands = options.commands || commands;
      _.defaults(options, {
        pageSize: config.defaultPageSize,
        ddItemsList: config.defaultPageSizes,
        toolbarItems: toolbarItems,
        originatingView: options.originatingView || options.metadataView
      });

      MetadataVersionsTableView.__super__.constructor.call(this, options);

      this.selectedNodes = new NodeCollection();

      this.collection = new NodeVersionCollection(undefined, {
        node: this.options.model,
        autoreset: true,
        expand: "user",
        commands: commands.getAllSignatures(),
        onlyClientSideDefinedColumns: true  // ignore columns sent by server
      });

      this.options.model.versions = this.collection;  // connect version collection with node

      this.commandController = new ToolbarCommandController({commands: this.commands});

      if (this.collection.delayedActions) {
        this.listenTo(this.collection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }
      this.defaultActionItems = defaultActionItems;

      if (!this.options.toolbarItemsMasks) {
        this.options.toolbarItemsMasks = new VersionsToolbarItemsMask(this.options);
      }

      this._setTableView();
      this._setTableRowSelectionToolbar({
        toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
        toolbarItemsMask: this.options.toolbarItemsMasks,
        commands: this.options.commands || commands,
      });

      this._setTableRowSelectionToolbarEventListeners();

      this._setPagination();

      this.collection.fetch();
      this.propagateEventsToRegions();
      this.listenTo(this.collection, "add", this._updateCollection)
          .listenTo(this.collection, "remove", this._updateCollection);
    },

    onRender: function () {
      this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
      this.tableRegion.show(this.tableView);
      this.paginationRegion.show(this.paginationView);
    },

    _updateCollection: function () {
      this.collection.fetch();
    },

    _setTableView: function () {
      this.options || (this.options = {});

      var args = _.extend({
        tableColumns: metadataVersionsColumns,
        connector: this.model.connector,
        collection: this.collection,
        columns: this.collection.columns,
        columnsWithSearch: [],
        orderBy: "version_number_name desc",
        actionItems: defaultActionItems,
        commands: commands,
        originatingView: this.options.originatingView
      }, this.options);
      delete args.blockingParentView;

      if (!_.contains(this.options.ddItemsList, this.options.pageSize)) {
        this.options.ddItemsList.push(this.options.pageSize);
        this.options.ddItemsList.sort();
      }

      this.tableView = new TableView(args);
      var cmdOption = {context: this.options.context, originatingView: this};

      this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
        var action = this.defaultActionItems.find(function (actionItem) {
          if (actionItem.get('type') === node.get('type')) {
            return true;
          }
        }, this);
        var cmd = commands.get(action.get('signature'));
        var status = {nodes: new NodeVersionCollection([node])};
        cmd.execute(status, cmdOption);
      });
    },

    _setTableRowSelectionToolbar: function (options) {
      this._tableRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.commandController,
        commands: commands,
        selectedChildren: this.tableView.selectedChildren,
        container: this.collection.node,
        context: this.options.context,
        originatingView: this.options.originatingView,
        collection: this.collection
      });
    },

    _setTableRowSelectionToolbarEventListeners: function () {
      this.listenTo(this.tableView.selectedChildren, 'reset', function () {
        if (this.tableView.selectedChildren.length > 0) {
          this.tableRowSelectionToolbarRegion.$el.addClass(
              'csui-metadata-versions-rowselection-toolbar-visible');
        } else {
          this.tableRowSelectionToolbarRegion.$el.removeClass(
              'csui-metadata-versions-rowselection-toolbar-visible');
        }
      });
    },

    _setPagination: function () {
      this.paginationView = new PaginationView({
        collection: this.collection,
        pageSize: this.options.pageSize,
        defaultDDList: this.options.ddItemsList,
        skipPaginationUpdateRequest: true
      });
    }

  }, {

    enabled: function (options) {
      if (config.enabled === false) {
        return false;
      }
      if (options.node instanceof VersionModel) {
        return false;
      }
      return _.contains([144, 736, 5574], options.node.get('type'));
    }

  });
  _.extend(MetadataVersionsTableView.prototype, LayoutViewEventsPropagationMixin);

  return MetadataVersionsTableView;

});
