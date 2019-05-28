/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'csui/models/utils/v1tov2',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/columns',
  'csui/utils/contexts/factories/children',
  'csui/utils/contexts/factories/columns2',
  'csui/utils/contexts/factories/children2',
  'csui/utils/contexts/factories/node',
  'csui/models/node/node.addable.type.factory',
  'csui/models/node/node.facet.factory',
  'csui/models/node/node.model',
  'csui/models/nodes',
  'csui/controls/progressblocker/blocker',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/controls/table/inlineforms/inlineform.factory',
  'csui/controls/facet.panel/facet.panel.view',
  'csui/controls/facet.bar/facet.bar.view',
  'csui/controls/table/table.view',
  'csui/controls/table/table.columns',
  'csui/controls/table/rows/description/description.view',
  'i18n!csui/widgets/nodestable/impl/nls/lang',
  'i18n!csui/utils/commands/nls/localized.strings',
  'i18n!csui/controls/table/impl/nls/lang',
  'csui/controls/pagination/nodespagination.view',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/toolitem.masks/children.toolitems.mask',
  'csui/utils/toolitem.masks/creation.toolitems.mask',
  'csui/widgets/nodestable/toolbaritems',
  'csui/widgets/nodestable/toolbaritems.masks',
  'csui/widgets/nodestable/headermenuitems',
  'csui/widgets/nodestable/headermenuitems.mask',
  'csui/utils/commands',
  'csui/controls/table.rowselection.toolbar/table.rowselection.toolbar.view',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/controls/draganddrop/draganddrop.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/thumbnail/thumbnail.view',
  'csui/controls/thumbnail/thumbnail.content',
  'hbs!csui/widgets/nodestable/impl/nodestable',
  'csui/lib/jquery.redraw', 'css!csui/widgets/nodestable/impl/nodestable'
], function (module, $, _, Backbone, Marionette, log, base, v1tov2,
    ConnectorFactory,
    ColumnCollectionFactory,
    ChildrenCollectionFactory,
    Column2CollectionFactory,
    Children2CollectionFactory,
    NodeModelFactory,
    AddableTypeCollectionFactory,
    FacetFilterCollectionFactory,
    NodeModel,
    NodeCollection,
    BlockingView,
    TableToolbarView,
    inlineFormViewFactory,
    FacetPanelView,
    FacetBarView,
    TableView,
    tableColumns,
    DescriptionRowView,
    lang,
    cmdLang,
    controlLang,
    PaginationView,
    DefaultActionBehavior,
    ChildrenToolItemsMask,
    CreationToolItemsMask,
    toolbarItems,
    ToolbarItemsMasks,
    headermenuItems,
    HeaderMenuItemsMask,
    commands,
    TableRowSelectionToolbarView,
    TableActionBarView,
    ToolbarCommandController,
    DragAndDrop,
    LayoutViewEventsPropagationMixin,
    GlobalMessage,
    ThumbnailView,
    thumbnailColumns,
    template) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30,
    defaultPageSizes: [30, 50, 100],
    showInlineActionBarOnHover: !accessibleTable,
    forceInlineActionBarOnClick: false,
    inlineActionBarStyle: "csui-table-actionbar-bubble",
    clearFilterOnChange: true,
    resetOrderOnChange: false,
    resetLimitOnChange: true,
    fixedFilterOnChange: false,
    useV2RestApi: false
  });

  var NodesTableView = Marionette.LayoutView.extend({

    className: function () {
      var className = 'csui-nodestable';
      if (accessibleTable) {
        className += ' csui-no-animation';
      }
      return className;
    },
    template: template,

    ui: {
      facetTableContainer: '.csui-facet-table-container',
      outerTableContainer: '.csui-outertablecontainer',
      innerTableContainer: '.csui-innertablecontainer',
      tableView: '.csui-table-tableview',
      thumbnail: '.csui-thumbnail-wrapper',
      toolbarContainer: '.csui-alternating-toolbars',
      facetView: '.csui-table-facetview',
      paginationView: '.csui-table-paginationview'
    },

    regions: {
      facetBarRegion: '.csui-table-facetbarview',
      tableToolbarRegion: '.csui-table-tabletoolbar',
      tableRowSelectionToolbarRegion: '.csui-table-rowselection-toolbar',
      facetRegion: '.csui-table-facetview',
      tableRegion: '.csui-table-tableview',
      thumbnailRegion: '.cs-thumbnail-wrapper',
      paginationRegion: '.csui-table-paginationview'
    },

    behaviors: {

      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }

    },

    constructor: function NodesTableView(options) {
      options || (options = {});

      _.defaults(options, {
        data: {},
        pageSize: config.defaultPageSize,
        ddItemsList: config.defaultPageSizes,
        toolbarItems: toolbarItems,
        headermenuItems: headermenuItems,
        clearFilterOnChange: config.clearFilterOnChange,
        resetOrderOnChange: config.resetOrderOnChange,
        resetLimitOnChange: config.resetLimitOnChange,
        fixedFilterOnChange: config.fixedFilterOnChange,
        showDescriptions: false // do not show descriptions initially
      });

      var pageSize  = options.data.pageSize || options.pageSize,
          pageSizes = options.data.pageSizes || options.ddItemsList;
      if (!_.contains(pageSizes, pageSize)) {
        pageSizes.push(pageSize);
        options.data.pageSizes = pageSizes.sort();
      }

      this.context = options.context;

      this.tableColumns = tableColumns.deepClone();

      this.commands = options.commands || commands;
      this.commandController = new ToolbarCommandController({commands: this.commands});
      this.listenTo(this.commandController, 'before:execute:command', this._beforeExecuteCommand);
      this.listenTo(this.commandController, 'after:execute:command', this._toolbarActionTriggered);

      if (!options.connector) {
        options.connector = this.context.getObject(ConnectorFactory);
      }
      this.connector = options.connector;

      if (!options.toolbarItemsMasks) {
        options.toolbarItemsMasks = new ToolbarItemsMasks();
      }
      if (!options.headermenuItemsMask) {
        options.headermenuItemsMask = new HeaderMenuItemsMask();
      }
      BlockingView.imbue({
        parent: this,
        focus: true
      });

      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).bind("resize.app", this.onWinRefresh);

      this.propagateEventsToRegions();

      this.listenTo(this, 'before:regions:reinitialize', this.initialize.bind(this, this.options))
          .listenTo(this, 'dom:refresh', this._refreshTableToolbar)
          .listenTo(this, 'enable:blocking', this._rememberFocusInTable)
          .listenTo(this, 'disable:blocking', this._restoreFocusInTable);
    },

    initialize: function (options) {
      function updateToolbarItemsMasks() {
        _.each(this.options.toolbarItemsMasks.toolbars, function (mask, key) {
          mask.restoreAndResetMask(this.options.childrenToolItemsMask);
        }, this);
      }
      var defaultActionCommands = this.defaultActionController.commands,
          defaultActionItems    = this.defaultActionController.actionItems;

      if (this.options.container) {
        this.container = this.options.container;
      } else if (this.options.data.containerId) {
        this.container = this.context.getModel(NodeModelFactory, {
          node: {
            attributes: {id: this.options.data.containerId}
          }
        });
      }

      if (!this.collection) {
        this.collection = this.context.getCollection(
            ChildrenCollectionFactory, {
              options: {
                commands: this.defaultActionController.commands,
                defaultActionCommands: defaultActionItems.getAllCommandSignatures(
                    defaultActionCommands),
                delayRestCommands: true,
                node: this.container
              },
              attributes: this.options.data.containerId ? {id: this.options.data.containerId} :
                          undefined
            });
      }
      if (this.options.data.containerId && !this.collection.node.get('id')) {
        this.collection.node.set('id', this.options.data.containerId);
      }

      if (!this.container) { // if not created before when this.collection was undefined
        this.container = options.container || this.collection.node;
      }
      if (this.collection.delayedActions) {
        this.listenTo(this.collection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }
      this.columns = options.columns ||
                     this.context.getCollection(ColumnCollectionFactory, {
                       options: {
                         node: this.container
                       },
                       attributes: this.options.data.containerId ?
                           {id: this.options.data.containerId} :
                                   undefined
                     });
      this.addableTypes = options.addableTypes ||
                          this.context.getCollection(AddableTypeCollectionFactory, {
                            options: {
                              node: this.container
                            },
                            attributes: this.options.data.containerId ?
                                {id: this.options.data.containerId} :
                                        undefined
                          });
      this.facetFilters = options.facetFilters ||
                          this.context.getCollection(
                              FacetFilterCollectionFactory, {
                                options: {
                                  node: this.container
                                },
                                attributes: this.options.data.containerId ?
                                    {id: this.options.data.containerId} :
                                            undefined,
                                detached: true
                              });
      this.listenToOnce(this.context, 'request', function () {
        this.facetFilters.fetch();
      });

      if (this.container) {
        if (!this.options.childrenToolItemsMask) {
          this.options.childrenToolItemsMask = new ChildrenToolItemsMask({
            context: this.context,
            node: this.container
          });
        }
        updateToolbarItemsMasks.call(this);
        this.listenTo(this.options.childrenToolItemsMask, 'update', updateToolbarItemsMasks);
        if (!this.options.creationToolItemsMask) {
          this.options.creationToolItemsMask = new CreationToolItemsMask({
            context: this.context,
            node: this.container
          });
        }
        this.listenTo(this.container, 'change:id', function () {
          var status = {container: this.container};
          if (this.commands.get('Filter').enabled(status)) {
            if (!this.facetFilters.clearFilter()) {
              this.facetFilters.fetch();
            }
          } else if (this.showFilter) {
            this._completeFilterCommand();
          }
          this._showOrHideLocationColumn(false);
        });
        this._showOrHideLocationColumn();
      }
      this._setFacetBarView();
      this._setToolBar();
      this.setTableView();
      this.setTableRowSelectionToolbar({
        toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
        toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
        showCondensedHeaderToggle: true
      });
      this._setTableRowSelectionToolbarEventListeners();
      this.setPagination();
      this.setDragNDrop();
    },

    _setThumbnailView: function () {
      var thumbnail = new ThumbnailView({
        originatingView: this,
        context: this.context,
        collection: this.collection,
        columns: this.columns,
        thumbnailColumns: this.tableView.columns,
        columnsWithSearch: ["name"],
        orderBy: this.options.data.orderBy || this.options.orderBy,
        filterBy: this.options.filterBy,
        selectedChildren: new NodeCollection(),
        actionItems: this.defaultActionController.actionItems,
        commands: this.defaultActionController.commands,
        tableColumns: thumbnailColumns,
        inlineBar: this.tableView.options.inlineBar,
        displayedColumns: this.tableView.displayedColumns
      });
      this.thumbnail = thumbnail;
      this.setThumbnailRowSelectionToolbar({
        toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
        toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
        selectedChildren: this.thumbnail.options.selectedChildren,
        showCondensedHeaderToggle: true
      });
      this.listenTo(this.thumbnail, 'execute:defaultAction', function (node) {
        var args = {node: node};
        this.trigger('before:defaultAction', args);
        if (!args.cancel) {
          var self = this;
          this.defaultActionController
              .executeAction(node, {
                context: this.options.context,
                originatingView: this
              })
              .done(function () {
                self.trigger('executed:defaultAction', args);
              });
        }
      });
      return true;
    },

    setThumbnailRowSelectionToolbar: function (options) {
      this._thumbnailRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.commandController,
        showCondensedHeaderToggle: options.showCondensedHeaderToggle,
        commands: this.defaultActionController.commands,
        selectedChildren: this.thumbnail.options.selectedChildren,
        container: this.collection.node,
        context: this.context,
        originatingView: this,
        collection: this.collection
      });

    },

    enableThumbnailView: function () {
      var tableView       = this.tableView,
          self            = this,
          deferred        = $.Deferred(),
          container       = this.container,
          context         = this.context,
          originatingView = this.originatingView;
      if (this.dragNDrop) {
        this.dragNDrop.destroy();
      }
      if (this.thumbnailViewState) {
        if (this.tableView.selectedChildren && this.tableView.selectedChildren.models.length > 0) {
          this.tableView.selectedChildren.models = [];
        }
        this._onSelectionUpdateCssClasses(this.tableView.selectedChildren.length, true);
        this._setThumbnailView();
        this._setThumbnailRowSelectionToolbarEventListeners();
      } else {
        this._onSelectionUpdateCssClasses(this.thumbnail.options.selectedChildren.length, true);
        this._setTableRowSelectionToolbarEventListeners();
      }
      this.setTableRowSelectionToolbar({
        toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
        toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
        showCondensedHeaderToggle: true
      });

      if (this.tableView.options.inlineBar.options.maxItemsShown !== 1) {
        this.collection.defaultInlineMaxItemsShown = this &&
                                                     this.tableView.options.inlineBar.options.maxItemsShown;
      }
      if (this.thumbnailViewState) {
        this.tableView.options.inlineBar.options.maxItemsShown = 1;
        this.$el.find('table.dataTable').addClass("csui-thumbnail-view");
        this.thumbnailView = true;
      } else {
        this.thumbnailView = false;
        this.tableView.options.inlineBar.options.maxItemsShown = this.collection.defaultInlineMaxItemsShown;
        this.$el.find('table.dataTable').removeClass("csui-thumbnail-view");
      }

      var _showOriginatingView, $csThumbnail;
      var $originatingView = this.$el.find(".csui-table-tableview");
      $csThumbnail = $(this.thumbnailRegion.el)[0];
      $csThumbnail = $($csThumbnail);
      if (!$originatingView.is(":visible")) {
        var sortingstate = this.collection.state;
        var listArrowState = this.collection.orderBy;
        this.thumbnail.destroy();
        this.res = listArrowState.split(" ");
        if (this.res[1] === 'asc') {
          this.collection.orderstate = 'icon-sortArrowUp';
        } else {
          if (this.res[1] === 'desc') {
            this.collection.orderstate = 'icon-sortArrowDown';
          }
        }
        this.setTableView();
        this.collection.state = sortingstate;
        if (this.collection.sorting && this.collection.sorting.sort.length > 0 &&
            this.collection.sorting.sort[0].value) {
          this.collection.sorting.sort[0].value = sortingstate;
        }
        this.setTableRowSelectionToolbar({
          toolItemFactory: this.options.toolbarItems.tableHeaderToolbar,
          toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
          showCondensedHeaderToggle: true
        });
        if (!this.thumbnailViewState && this.tableToolbarView.filterToolbarView) {
          this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.tableView.thumbnailView;
        }
        this.tableToolbarView.rightToolbarView &&
        this.tableToolbarView.rightToolbarView.collection.refilter();
        if (this.tableView.collection && this.tableView.collection.length === 0) {
          this.tableView._showEmptyViewText = true;
        }
        this._updateZeroRecordsMessage();

        this.tableRegion.show(this.tableView);
        this.setDragNDrop();
        this._assignDragArea('.csui-table-tableview');
        this.tableView.render();
        $csThumbnail.hide('blind', {
          direction: 'right',
          complete: function () {
            $originatingView.show('blind',
                {
                  direction: 'left'
                },
                100);
            self.tableView.onAfterShow();
          }
        });
      } else {
        var gridArrowState = this.collection.orderBy;
        this.tableView.destroy();
        this.res = gridArrowState.split(" ");
        if (this.res[1] === 'asc') {
          this.collection.orderstate = 'icon-sortArrowDown';
        } else {
          if (this.res[1] === 'desc') {
            this.collection.orderstate = 'icon-sortArrowUp';
          }
        } 
        this.thumbnailRegion.show(this.thumbnail);
        this.setDragNDrop();
        this._assignDragArea('.cs-thumbnail-wrapper');
        this.tableToolbarView.rightToolbarView &&
        this.tableToolbarView.rightToolbarView.collection.refilter();
        var isUpdated = this.thumbnail._maintainNodeState(this.collection.at(0));
        if (!isUpdated) {
          var updateRowIndex = this.updateRowIndex;
          this.thumbnail._maintainNodeState(this.collection.at(updateRowIndex));
        }
        Marionette.triggerMethodOn(this.thumbnail, 'before:show');
        if (this.collection && this.collection.models &&
            this.collection.models.length >= 0) {
          if ($csThumbnail.length === 0) {
            $csThumbnail = $($(this.thumbnailRegion.el)[0]);
            Marionette.triggerMethodOn(this.thumbnail, 'before:show');
            $csThumbnail.append(this.thumbnail.el);
            $originatingView.hide('blind', {
              direction: 'left',
              complete: function () {
                $csThumbnail.show('blind',
                    {
                      direction: 'right',
                      complete: function () {
                        Marionette.triggerMethodOn(this.thumbnail, 'show');
                      }
                    }, 100);
              }
            }, 100);
          } else {
            $originatingView.hide('blind', {
              direction: 'left',
              complete: function () {
                $csThumbnail.show('blind',
                    {
                      direction: 'right',
                      complete: function () {
                        self.thumbnail.trigger('dom:refresh');
                      }
                    }, 100);
              }
            }, 100);
            self.thumbnail.onAfterShow();
          }
        }
      }
    },

    onDestroy: function () {
      $(window).unbind("resize.app", this.onWinRefresh);
      if (this.dragNDrop) {
        this.dragNDrop.destroy();
      }
    },

    windowRefresh: function () {
      if (this._isRendered && this.isDisplayed) {
        this.facetView && this.facetView.triggerMethod('dom:refresh');
      }
    },

    _refreshTableToolbar: function () {
      if (this.tableToolbarView && this.tableToolbarView.rightToolbarView) {
        this.tableToolbarView.rightToolbarView.collection.refilter();
      }
    },

    onRender: function () {
      if (this.facetBarView) {
        this.facetBarRegion.show(this.facetBarView);
      }
      this.tableToolbarRegion.show(this.tableToolbarView);

      if (this.tableRowSelectionToolbarRegion) {
        if (!this.thumbnailView && this._tableRowSelectionToolbarView) {
          this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
        } else if (this._thumbnailRowSelectionToolbarView) {
          this.tableRowSelectionToolbarRegion.show(this._thumbnailRowSelectionToolbarView);
        }
        this.tableRowSelectionToolbarRegion.$el.find('ul').attr('aria-label',
            controlLang.selectedItemActionBarAria);
      }

      if (this.facetView) {
        this.facetRegion.show(this.facetView);
      }
      this.tableRegion.show(this.tableView);
      this.paginationRegion.show(this.paginationView);

      this._assignDragArea('.csui-table-tableview');

      this.listenTo(this, 'csui.description.toggled', function (args) {
        this.tableView.showDetailRowDescriptions(args.showDescriptions);
        this.tableView.trigger('update:scrollbar');
      });
      this.addFilterCommandAria();
    },

    onShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('show');
        }
      });
    },

    onAfterShow: function () {
      _.each(this.regionManager._regions, function (region) {
        if (region.currentView) {
          region.currentView.triggerMethod('after:show');
        }
      });
    },

    getSelectedNodes: function () {
      return new NodeCollection(this.tableView.getSelectedChildren());
    },

    setActionBarEvents: function () {
      log.warn('The method \'setActionBarEvents\' has been deprecated and will be removed.') &&
      console.warn(log.last);
    },

    _updateToolItems: function () {
      log.warn('The method \'_updateToolItems\' has been deprecated and will be removed.') &&
      console.warn(log.last);
    },

    setDragNDrop: function () {
      if (this.container) {
        this.dragNDrop = new DragAndDrop({
          container: this.container,
          collection: this.collection,
          addableTypes: this.addableTypes,
          context: this.options.context
        });
        this.listenTo(this.dragNDrop, 'drag:over', this._addDragDropBorder, this);
        this.listenTo(this.dragNDrop, 'drag:leave', this._removeDragDropBorder, this);
        if (this.container) {
          this.listenTo(this.container, 'change:id', this._updateZeroRecordsMessage);
          this.listenTo(this.addableTypes, 'reset', this._updateZeroRecordsMessage);
        }
      }
    },

    _updateZeroRecordsMessage: function () {
      this.tableView.setCustomLabels({
        zeroRecords: (!this.container || this.container.get('type') !== 899) &&
                     this.dragNDrop && this.dragNDrop.canAdd() && lang.dragAndDropMessage
      });
    },

    _assignDragArea: function (el) {
      if (this.dragNDrop) {
        this.dragNDrop.setDragParentView(this, el);
      }
    },

    _addDragDropBorder: function (view, options) {
      var disableMethod = options && options.disabled ? 'addClass' : 'removeClass';
      if (!this.thumbnailViewState) {
        this.ui.tableView
            .addClass('drag-over')
            [disableMethod]('csui-disabled');
      } else {
        this.ui.thumbnail
            .addClass('drag-over')
            [disableMethod]('csui-disabled');
      }
    },

    _removeDragDropBorder: function () {
      if (!this.thumbnailViewState) {
        this.ui.tableView.removeClass('drag-over');
      } else {
        this.ui.thumbnail.removeClass('drag-over');
      }
    },

    setTableView: function (options) {
      options || (options = {});

      var self = this;
      var args = _.extend({
        context: this.options.context,
        connector: this.connector,
        collection: this.collection,
        columns: this.columns,
        tableColumns: this.tableColumns,
        descriptionRowView: DescriptionRowView,
        descriptionRowViewOptions: {
          firstColumnIndex: 2,
          lastColumnIndex: 2,
          showDescriptions: !accessibleTable && this.options.showDescriptions,
          collapsedHeightIsOneLine: true
        },
        pageSize: this.options.data.pageSize || this.options.pageSize,
        originatingView: this,
        columnsWithSearch: ["name"],
        orderBy: this.options.data.orderBy || this.options.orderBy,
        filterBy: this.options.filterBy,
        actionItems: this.defaultActionController.actionItems,
        commands: this.defaultActionController.commands,
        blockingParentView: this,
        parentView: this,
        inlineBar: {
          viewClass: TableActionBarView,
          options: _.extend({
            collection: this.options.toolbarItems.inlineActionbar,
            toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineActionbar,
            delayedActions: this.collection.delayedActions,
            container: this.container,
            containerCollection: this.collection
          }, this.options.toolbarItems.inlineActionbar.options, {
            inlineBarStyle: config.inlineActionBarStyle,
            forceInlineBarOnClick: config.forceInlineActionBarOnClick,
            showInlineBarOnHover: config.showInlineActionBarOnHover
          })
        }
      }, options);

      this.tableView = new TableView(args);

      this._ensureRequestingMetadata();
      this.listenTo(this.tableView, 'render', function () {
        this.tableView.$el.append($('<div>')[0]);
      });
      this._setTableViewEvents();
    },
    _ensureRequestingMetadata: function () {
      var container = this.container;
      if (container && container.makeFieldsV2) {
        ensureColumnInformation();
        this.listenTo(this.tableView, 'columnDefinitionsBuilt',
            ensureColumnInformation);
      }

      function ensureColumnInformation() {
        container.setFields('columns');
        container.includeResources('metadata');
      }
    },

    _setTableViewEvents: function () {
      this.listenTo(this.tableView, "tableRowSelected", function () {
        this.tableView.cancelAnyExistingInlineForm.call(this.tableView);
      });
      if (this.container) {
        this.listenTo(this.container, 'change:id', function () {
          if (this.options.fixedFilterOnChange) {
            this.collection.clearFilter(false);
            this.collection.setFilter(this.options.fixedFilterOnChange, false);
          }
          else if (this.options.clearFilterOnChange) {
            this.collection.clearFilter(false);
          }
          if (this.options.resetOrderOnChange) {
            this.collection.resetOrder(false);
          }
          if (this.options.resetLimitOnChange) {
            this.collection.resetLimit(false);
          }
        });
      }
      this.listenTo(this.tableView.selectedChildren, 'reset', function () {
        if (this.tableToolbarView) {
          this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.tableView.thumbnailView;
          this.tableToolbarView.updateForSelectedChildren(this.tableView.selectedChildren);
          this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
          this._onSelectionUpdateCssClasses(this.tableView.selectedChildren.length);
        }
      });

      this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
        var args = {node: node};
        this.trigger('before:defaultAction', args);
        if (!args.cancel) {
          var self = this;
          this.defaultActionController
              .executeAction(node, {
                context: this.options.context,
                originatingView: this
              })
              .done(function () {
                self.trigger('executed:defaultAction', args);
              });
        }
      });

      return true;
    },

    _setToolBar: function () {
      this.tableToolbarView = new TableToolbarView({
        context: this.options.context,
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        headermenuItems: this.options.headermenuItems,
        headermenuItemsMask: this.options.headermenuItemsMask,
        creationToolItemsMask: this.options.creationToolItemsMask,
        container: this.container,
        collection: this.collection,
        originatingView: this,
        blockingParentView: this,
        addableTypes: this.addableTypes,
        toolbarCommandController: this.commandController
      });
      return true;
    },

    setTableRowSelectionToolbar: function (options) {
      this._tableRowSelectionToolbarView = new TableRowSelectionToolbarView({
        toolItemFactory: options.toolItemFactory,
        toolbarItemsMask: options.toolbarItemsMask,
        toolbarCommandController: this.commandController,
        showCondensedHeaderToggle: options.showCondensedHeaderToggle,
        commands: this.defaultActionController.commands,
        selectedChildren: this.tableView.selectedChildren,
        container: this.collection.node,
        context: this.context,
        originatingView: this,
        collection: this.collection
      });
      var toolbarView;
      if (this.thumbnailViewState) {
        toolbarView = this._thumbnailRowSelectionToolbarView;
      } else {
        toolbarView = this._tableRowSelectionToolbarView;
      }
      this.listenTo(toolbarView, 'toggle:condensed:header', function () {
        if (this.tableToolbarRegion.$el.hasClass('csui-table-rowselection-toolbar-visible')) {
          this.ui.toolbarContainer && this.ui.toolbarContainer.toggleClass('csui-show-header');

          var showingBothToolbars = this.ui.toolbarContainer &&
                                    this.ui.toolbarContainer.hasClass('csui-show-header');
          if (showingBothToolbars) {
            this.tableToolbarRegion.$el.removeClass('binf-hidden');
          }
          toolbarView.trigger('toolbar:activity', true, showingBothToolbars);
        }
      });

    },

    _triggerToolbarActivityEvent: function (toolbarVisible, headerVisible) {
      var toolbarView = this.thumbnailView ?
                        this._thumbnailRowSelectionToolbarView : this._tableRowSelectionToolbarView;
      toolbarView.trigger('toolbar:activity', toolbarVisible, headerVisible);
    },

    _onSelectionUpdateCssClasses: function (selectionLength, stopTriggerToolbarActivity) {
      var self = this;
      var $rowSelectionToolbarEl = this.tableRowSelectionToolbarRegion.$el;

      function transitionEnd(headerVisible, stopTriggerToolbarActivity) {
        if (stopTriggerToolbarActivity !== true) {
          self._triggerToolbarActivityEvent(self._tableRowSelectionToolbarVisible, headerVisible);
        }
        if (self._tableRowSelectionToolbarVisible) {
          if (!headerVisible) {
            self.tableToolbarRegion.$el.addClass('binf-hidden');
          }
        } else {
          self.tableRowSelectionToolbarRegion.$el.addClass('binf-hidden');
        }
      }

      var headerVisible;
      if (accessibleTable) {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;
            this.tableToolbarRegion.$el.addClass('csui-table-rowselection-toolbar-visible');
            $rowSelectionToolbarEl.removeClass('binf-hidden');
            $rowSelectionToolbarEl.addClass('csui-table-rowselection-toolbar-visible');
            headerVisible = this.ui.toolbarContainer &&
                            this.ui.toolbarContainer.hasClass('csui-show-header');

            transitionEnd(headerVisible);
          }
        } else {
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            this.ui.toolbarContainer && this.ui.toolbarContainer.removeClass('csui-show-header');
            this.tableToolbarRegion.$el.removeClass('binf-hidden');
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
                'dom:refresh');
            this.tableToolbarRegion.$el.removeClass('csui-table-rowselection-toolbar-visible');
            $rowSelectionToolbarEl.removeClass('csui-table-rowselection-toolbar-visible');

            transitionEnd(false, stopTriggerToolbarActivity);
          }
        }
      } else {
        if (selectionLength > 0) {
          if (!this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = true;

            headerVisible = this.ui.toolbarContainer &&
                            this.ui.toolbarContainer.hasClass('csui-show-header');
            $rowSelectionToolbarEl
                .removeClass('binf-hidden').redraw()
                .one('transitionend', function () {
                  transitionEnd(headerVisible);
                }.bind(this))
                .addClass('csui-table-rowselection-toolbar-visible');
            this.tableToolbarRegion.$el.addClass('csui-table-rowselection-toolbar-visible');
          }
        } else {
          if (this._tableRowSelectionToolbarVisible) {
            this._tableRowSelectionToolbarVisible = false;
            this.ui.toolbarContainer && this.ui.toolbarContainer.removeClass('csui-show-header');

            this.tableToolbarRegion.$el.removeClass('binf-hidden').redraw();
            this.tableToolbarRegion.currentView.trigger(this.tableToolbarRegion.currentView,
                'dom:refresh');

            $rowSelectionToolbarEl
                .one('transitionend', function () {
                  transitionEnd(false, stopTriggerToolbarActivity);
                }.bind(this))
                .removeClass('csui-table-rowselection-toolbar-visible');
            this.tableToolbarRegion.$el.removeClass('csui-table-rowselection-toolbar-visible');
          }
        }
      }
    },

    _setTableRowSelectionToolbarEventListeners: function () {
      this.listenTo(this.tableView.selectedChildren, 'reset', function () {
        this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.thumbnailView;
        this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
        this._onSelectionUpdateCssClasses(this.tableView.selectedChildren.length);
      });

    },
    _setCommonRowSelectionToolbarEventListeners: function (selectedChildren) {
      this.listenTo(selectedChildren, 'reset', function () {
        this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.thumbnailView;
        this.tableRowSelectionToolbarRegion.show(this._tableRowSelectionToolbarView);
        this._onSelectionUpdateCssClasses(selectedChildren.length);
      });

    },

    _setThumbnailRowSelectionToolbarEventListeners: function () {
      this.listenTo(this.thumbnail.options.selectedChildren, 'reset', function () {
        this.tableToolbarView.filterToolbarView.collection.status.thumbnailViewState = this.thumbnailView;
        this.tableRowSelectionToolbarRegion.show(this._thumbnailRowSelectionToolbarView);
        this._onSelectionUpdateCssClasses(this.thumbnail.options.selectedChildren.length);
      });
    },

    setPagination: function () {
      this.paginationView = new PaginationView({
        collection: this.collection,
        pageSize: this.options.data.pageSize || this.options.pageSize,
        defaultDDList: this.options.data.pageSizes || this.options.ddItemsList
      });
      return true;
    },

    _handleFacetBarVisible: function () {
      this.facetBarView.$el.find(".csui-facet-list-bar .csui-facet-item:last a").focus();
    },

    _handleFacetBarHidden: function () {
    },

    _showOrHideLocationColumn: function (show) {
      var subType = this.container && this.container.get('type');
      show = !!show || (!!subType && (subType === 899 || subType === 298));

      var expand = {properties: ['parent_id']};
      if (!this.useV2RestApi) {
        expand = v1tov2.expandsV2toV1(expand);
      }

      if (show) {
        if (!this.tableColumns.get('parent_id')) {
          this.tableColumns.add([
            {
              key: 'parent_id',
              title: lang.columnTitleLocation,
              sequence: 800,
              permanentColumn: false
            }
          ]);
          this.collection.setExpand(expand);
        }
      } else {
        this.tableColumns.remove('parent_id');
        this.collection.resetExpand(expand);
      }
    },

    _ensureFacetPanelViewDisplayed: function () {
      if (this.facetView === undefined) {
        this._setFacetPanelView();
        this.facetRegion.show(this.facetView);
      }
    },

    _setFacetPanelView: function () {
      this.facetView = new FacetPanelView({
        collection: this.facetFilters,
        blockingLocal: true
      });
      this.listenTo(this.facetView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetView, 'remove:all', this._removeAll)
          .listenTo(this.facetView, 'apply:filter', this._addToFacetFilter)
          .listenTo(this.facetView, 'apply:all', this._setFacetFilter);
    },

    _removeFacetPanelView: function () {
      !!this.thumbnailViewState ? this.thumbnail._adjustThumbnailWidth() : '';
      this.facetRegion.empty();
      this.facetView = undefined;
    },

    _setFacetBarView: function () {
      this.facetBarView = new FacetBarView({
        collection: this.facetFilters,
        context: this.options.context,
        showSaveFilter: true
      });
      this.listenTo(this.facetBarView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetBarView, 'remove:all', this._removeAll)
          .listenTo(this.facetBarView, 'facet:bar:visible', this._handleFacetBarVisible)
          .listenTo(this.facetBarView, 'facet:bar:hidden', this._handleFacetBarHidden);
    },

    _addToFacetFilter: function (filter) {
      this.facetFilters.addFilter(filter);
      var facetValues = this.facetFilters.getFilterQueryValue();
      this._showOrHideLocationColumn(true);
      this.collection.resetLimit();
      this.collection.setFilter({facet: facetValues});
    },

    _setFacetFilter: function (filter) {
      this.facetFilters.setFilter(filter);
      var facetValues = this.facetFilters.getFilterQueryValue();
      this._showOrHideLocationColumn(true);
      this.collection.resetLimit();
      this.collection.setFilter({facet: facetValues});
    },

    _removeFacetFilter: function (filter) {
      this.facetFilters.removeFilter(filter);
      var facetValues     = this.facetFilters.getFilterQueryValue(),
          accountForFacet = facetValues.length === 0 ? false : true;
      this.collection.resetLimit();
      this.collection.setFilter({facet: facetValues});
      this._showOrHideLocationColumn(accountForFacet);
    },

    _removeAll: function () {
      this.facetFilters.clearFilter();
      this.collection.resetLimit();
      this.collection.setFilter({facet: []});
      this._showOrHideLocationColumn(false);
    },

    _beforeExecuteCommand: function (toolbarActionContext) {
      if (toolbarActionContext && toolbarActionContext.commandSignature !== "Thumbnail" &&
          !this.thumbnailViewState) {
        this.tableView.cancelAnyExistingInlineForm.call(this.tableView);
      } else if (toolbarActionContext && toolbarActionContext.commandSignature !== "Thumbnail" &&
                 this.thumbnailViewState) {
        this.thumbnail.cancelAnyExistingInlineForm.call(this.thumbnail);
      }
      if (toolbarActionContext.commandSignature === 'Delete') {
        this.deletingNodes = true;
        this.tableView.setDeletingNodesState(true);
      }
    },
    _toolbarActionTriggered: function (toolbarActionContext) {
      if (!toolbarActionContext || toolbarActionContext.cancelled) {
        return;
      }
      if (toolbarActionContext.status.forwardToTable) {
        var inlineFormView = inlineFormViewFactory.getInlineFormView(
            toolbarActionContext.addableType);
        if (inlineFormView) {
          if (!toolbarActionContext.newNodes[0].error) {
            if (!this.thumbnailView) {
              this.tableView.startCreateNewModel(toolbarActionContext.newNodes[0], inlineFormView);
            } else {
              this.thumbnail.startCreateNewModel(toolbarActionContext.newNodes[0], inlineFormView);
            }
          }
        }
      }
      if (!!toolbarActionContext.command && !!toolbarActionContext.command.allowCollectionRefetch
          && toolbarActionContext.commandSignature !== 'Delete') {
        this.collection.fetch();
      }

      switch (toolbarActionContext.commandSignature) {
      case 'Delete':
        this.deletingNodes = false;
        this.tableView.setDeletingNodesState(false);
        this.collection.fetch();
        break;
      case 'Filter':
        this._completeFilterCommand();
        break;
      case 'MaximizeWidgetView':
        this.tableToolbarView.rightToolbarView.collection.refilter();
        break;
      case 'RestoreWidgetViewSize':
        this.tableToolbarView.rightToolbarView.collection.refilter();
        break;
      case 'Thumbnail':
        this.thumbnailViewState = (!!this.thumbnailViewState) ? !this.thumbnailViewState : true;
        this.enableThumbnailView();
        break;
      }

    },

    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element     = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _completeFilterCommand: function () {
      var self = this;
      this.showFilter = !this.showFilter;
      if (this.showFilter) {
        this._ensureFacetPanelViewDisplayed();
        this.ui.facetView.removeClass('csui-facetview-visibility');
        if (accessibleTable) {
          this.ui.facetView.removeClass('csui-facetview-hidden');
          this.triggerMethod('dom:refresh');
        } else {
          this.ui.facetView.one(this._transitionEnd(),
              function () {
                self.triggerMethod('dom:refresh');
                !!self.thumbnailViewState ? self.thumbnail._adjustThumbnailWidth() : '';
              }).removeClass('csui-facetview-hidden');
        }
      } else {
        if (accessibleTable) {
          this.ui.facetView.addClass('csui-facetview-hidden');
          this.triggerMethod('dom:refresh');
          this.ui.facetView.hasClass('csui-facetview-hidden') &&
          this.ui.facetView.addClass('csui-facetview-visibility');
          this._removeFacetPanelView();
        } else {
          this.ui.facetView.one(this._transitionEnd(),
              function () {
                self.triggerMethod('dom:refresh');
                self.ui.facetView.hasClass('csui-facetview-hidden') &&
                self.ui.facetView.addClass('csui-facetview-visibility');
                self._removeFacetPanelView();
              }).addClass('csui-facetview-hidden');
        }
      }
      this.addFilterCommandAria();
    },

    addFilterCommandAria: function () {
      if (this.ui.facetView.hasClass('csui-facetview-hidden') && this.tableToolbarView &&
          this.tableToolbarView.filterToolbarView) {
        this.tableToolbarView.filterToolbarView.$el.find(".csui-toolitem").attr("aria-label",
            lang.filterExpandAria);
        this.tableToolbarView.filterToolbarView.$el.find(".csui-toolitem").attr("aria-expanded",
            false);
      } else {
        this.tableToolbarView.filterToolbarView.$el.find(".csui-toolitem").attr("aria-label",
            lang.filterCollapseAria);
        this.tableToolbarView.filterToolbarView.$el.find(".csui-toolitem").attr("aria-expanded",
            true);
      }
    },

    _rememberFocusInTable: function () {
      if (this.tableView.el.contains(document.activeElement)) {
        this._tableFocused = true;
      }
    },

    _restoreFocusInTable: function () {
      if (this._tableFocused) {
        this.tableView.currentlyFocusedElement() &&
        this.tableView.currentlyFocusedElement().focus();
      }
    }
  }, {
    useV2RestApi: config.useV2RestApi
  });

  _.extend(NodesTableView.prototype, LayoutViewEventsPropagationMixin);
  NodesTableView.prototype._eventsToPropagateToRegions.push('global.alert.inprogress',
      'global.alert.completed');

  if (NodesTableView.useV2RestApi) {
    ChildrenCollectionFactory = Children2CollectionFactory;
    ColumnCollectionFactory = Column2CollectionFactory;
  }

  return NodesTableView;
});
