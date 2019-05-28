/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module",
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/utils/log",
  'csui/utils/base',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/favorite2groups',
  'csui/models/favorite2columns',
  'csui/utils/contexts/factories/favorites2',
  'csui/models/favorites2',
  'csui/widgets/favorites/toolbaritems',
  'csui/widgets/favorites/toolbaritems.masks',
  'csui/controls/progressblocker/blocker',
  'csui/widgets/favorites/impl/favorites2.groups.view',
  "csui/controls/table/table.view",
  'csui/utils/commands',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/controls/tile/behaviors/infinite.scrolling.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/globalmessage/globalmessage',
  'csui/widgets/favorites/impl/favorites2.table.columns',
  'hbs!csui/widgets/favorites/impl/favorites2.table',
  'i18n!csui/widgets/favorites/impl/nls/lang',
  'csui/behaviors/table.rowselection.toolbar/table.rowselection.toolbar.behavior',
  'csui/lib/perfect-scrollbar',
  'css!csui/widgets/favorites/impl/favorites2.table.view'
], function (module, $, _, Backbone, Marionette, log, base,
    ConnectorFactory,
    Favorite2GroupsCollectionFactory,
    Favorite2ColumnCollection,
    Favorite2CollectionFactory,
    Favorite2Collection,
    toolbaritems,
    ToolbarItemsMasks,
    BlockingView,
    FavoriteGroupsView,
    TableView,
    commands,
    ToolbarView,
    DelayedToolbarView,
    TableActionBarView,
    ToolbarCommandController,
    LayoutViewEventsPropagationMixin,
    DefaultActionBehavior,
    InfiniteScrollingBehavior,
    PerfectScrollingBehavior,
    TabableRegionBehavior,
    GlobalMessage,
    favorites2TableColumns,
    template, lang,
    TableRowSelectionToolbarBehavior) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30,
    showGroupsRegion: true,
    dragAndDropEnabled: true
  });

  var InfiniteScrollingTableView = TableView.extend({
    constructor: function InfiniteScrollingTableView(options) {
      InfiniteScrollingTableView.__super__.constructor.apply(this, arguments);
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: 'tbody',
        suppressScrollX: true
      },
      InfiniteScrolling: {
        behaviorClass: InfiniteScrollingBehavior,
        contentParent: 'tbody',
        content: 'tbody>tr:visible'
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    }
  });

  var Favorites2TableView = Marionette.LayoutView.extend({

    className: 'csui-fav2-table',
    template: template,

    ui: {
      tableView: '.csui-table-view'
    },

    regions: {
      toolbarRegion: '.csui-rowselection-toolbar',
      groupsRegion: '.csui-favorite-groups-view',
      tableRegion: '.csui-table-view'
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },

      TableRowSelectionToolbar: {
        behaviorClass: TableRowSelectionToolbarBehavior
      }
    },

    constructor: function Favorites2TableView(options) {
      options || (options = {});
      _.defaults(options, {
        pageSize: config.defaultPageSize,
        showGroupsRegion: config.showGroupsRegion,
        clearFilterOnChange: config.clearFilterOnChange,
        resetOrderOnChange: config.resetOrderOnChange,
        resetLimitOnChange: config.resetLimitOnChange,
        fixedFilterOnChange: config.fixedFilterOnChange,
        dragAndDropEnabled: config.dragAndDropEnabled
      }, {
        showInlineActionBarOnHover: true,
        forceInlineActionBarOnClick: false,
        inlineActionBarStyle: "csui-table-actionbar-bubble",
        clearFilterOnChange: true,
        resetOrderOnChange: false,
        resetLimitOnChange: true,
        fixedFilterOnChange: false,
        toolbarItems: toolbaritems
      });

      if (!options.toolbarItemsMasks) {
        options.toolbarItemsMasks = new ToolbarItemsMasks();
      }

      this.context = options.context;
      this.connector = this.context.getObject(ConnectorFactory);

      this.commands = options.commands || commands;
      this.commandController = new ToolbarCommandController({
        commands: this.commands,
        nameAttribute: 'favorite_name'
      });

      this.favoritesTableOptions = {
        isFavoritesTable: true
      };

      this.tableColumns = this.options.tableColumns || favorites2TableColumns.deepClone();
      BlockingView.imbue(this);

      Favorites2TableView.__super__.constructor.call(this, options);

      this.propagateEventsToRegions(); // propagate dom:refresh to child views
    },

    initialize: function () {
      this.collection = new Favorite2Collection(undefined, {
        connector: this.connector,
        autoreset: true,
        skip: 0, // start at first item
        top: this.options.pageSize // page size
      });
      var defaultActionCommands = this.defaultActionController.actionItems.getAllCommandSignatures(
          commands);

      this.collection.setResourceScope(Favorite2CollectionFactory.getDefaultResourceScope());
      this.collection.setDefaultActionCommands(defaultActionCommands);
      this.collection.setEnabledDelayRestCommands(true);

      this.groups = this.options.groups ||
                    this.context.getCollection(Favorite2GroupsCollectionFactory, {
                      detached: true,
                      permanent: true
                    });
      this.groups.favorites.setResourceScope(
          Favorite2CollectionFactory.getDefaultsOnlyResourceScope());
      this.groups.favorites.setEnabledDelayRestCommands(false);

      this.columns = this.collection.columns ||
                     new Favorite2ColumnCollection(undefined, {
                       connector: this.connector
                     });

      this._dragData = new Backbone.Model();
      this._allowDragging = true;

      if (this.collection.delayedActions) {
        this.listenTo(this.collection.delayedActions, 'error',
            function (collection, request, options) {
              var error = new base.Error(request);
              GlobalMessage.showMessage('error', error.message);
            });
      }

      this.listenTo(this.groups, 'request', this.blockActions);
      this.listenTo(this.groups, 'sync error destroy', this.unblockActions);
      this.listenTo(this.groups, 'reset', this._trySelectGroup);
      this.listenTo(this.groups, 'bulk:update', function () {
        this._saveAllFavorites();
      });

      this.setGroupsView();
      this.setTableView();
      this.tableView.listenTo(this.groups, 'sync error destroy',
          this.tableView.enableEmptyViewText);
    },

    _setSelectedGroup: function (group) {
      this.selectedGroup = group;
      this.favoritesTableOptions.selectedGroup = group;
    },

    _trySelectGroup: function () {
      var groupToSelect;
      if (this.selectedGroup !== undefined) {
        groupToSelect = this.groups.get(this.selectedGroup);
      } else {
        groupToSelect = this.groups.find(function (group) {
          return (group.favorites && group.favorites.length > 0) || group.get('tab_id') === -1;
        });
      }

      if (groupToSelect) {
        if (this.columns.length === 0) {
          this.columns.reset(groupToSelect.favorites.columns.models, {
            silent: true
          });
        }
        this._setTableColumns(groupToSelect.favorites.columns, {
          silent: true
        });
        this.collection.populate(groupToSelect.favorites.models, {
          parse: false
        });
        this._setSelectedGroup(groupToSelect);
        this.groupsView.selectGroup(groupToSelect); // shows group as selected group
      } else {
        delete this.selectedGroup;
        delete this.favoritesTableOptions.selectedGroup;
        this.collection.populate([]);
      }
    },

    _setTableColumns: function (columns, options) {
      if (!this.options.tableColumns && columns && columns.models) {
        var self = this;
        var propertiesToMerge = ['permanentColumn', 'noTitleInHeader', 'title', 'align',
          'widthFactor', 'isNaming'
        ];
        var cols = _.map(columns.models, function (column) {
          var columnData = column.toJSON();
          var columnKey = column.get('column_key') || column.get('key');
          var tableColumn = self.tableColumns.findWhere({
            key: columnKey
          });
          if (tableColumn) {
            _.each(propertiesToMerge, function (propName) {
              var propToMergeValue = tableColumn.get(propName);
              if (propToMergeValue !== undefined && columnData[propName] === undefined) {
                columnData[propName] = propToMergeValue;
              }
            });
          }
          return columnData;
        });
        this.tableColumns.resetCollection(cols, options);
      }
    },

    _saveAllFavorites: function () {
      var self = this;
      var deferred = $.Deferred();
      this.blockActions();
      this._dragData.clear();
      this.groups.saveAll()
          .then(function () {
            log.debug("Complete set of favorite information saved") && console.log(log.last);
            self._updateTabIdsInSelectedGroup();
            deferred.resolve();
          })
          .fail(function (err) {
            if (err) {
              log.error(
                  "failed to save complete set of favorite information: " + err.statusText) &&
              console.log(log.last);
              GlobalMessage.showMessage('error', lang.errorFavoritesSaveFailed + ' ' +
                                                 err.statusText);

              self.groups.fetch({
                reload: true
              }); // re-fetch the groups in case save failed to
              deferred.reject();
            }
          })
          .always(function () {
            self.unblockActions();
          });
      return deferred.promise();
    },

    _updateTabIdsInSelectedGroup: function () {
      var favorites = this.collection;
      if (this.selectedGroup) {
        var selectedGroup = this.selectedGroup;
        var tabId = selectedGroup.get('tab_id');
        favorites.each(function (favoriteInTable, index) {
          var favorite = selectedGroup.favorites.at(index);
          favorites.remove(favoriteInTable, {
            silent: true
          });
          favoriteInTable.set('favorite_tab_id', tabId, {
            silent: true
          });
          favorites.add(favoriteInTable, {
            at: index,
            silent: true
          });
        });
      }
    },

    _moveModel: function (collection, idSource, idDestination, moveAfterDestination) {
      var modelSource = collection.get(idSource);
      var modelDestination = collection.get(idDestination);
      var sourceIndex = collection.indexOf(modelSource);
      var targetIndex = collection.indexOf(modelDestination);
      if (sourceIndex < targetIndex) {
        targetIndex = targetIndex - 1;
      }
      if (moveAfterDestination) {
        targetIndex = targetIndex + 1;
      }
      if (sourceIndex != targetIndex) {
        collection.remove(modelSource);
        collection.add(modelSource, {
          at: targetIndex
        });
        return true;
      } else {
        return false;
      }
    },

    _moveAndSaveFavorites: function (sourceIds, targetId, dropAfter) {
      var selectedGroup = this.groups.get(this.selectedGroup);
      this.blockActions();
      _.each(sourceIds, function (id) {
        var modelToMove = this.collection.get(id);
        if (modelToMove) {
          this._moveModel(this.collection, id, targetId, dropAfter);
          this._moveModel(selectedGroup.favorites, id, targetId, dropAfter);
        }
      }, this);
      this.unblockActions();
      return this._saveAllFavorites();  // returns the promise from save call
    },

    setGroupsView: function () {
      this.groupsView = new FavoriteGroupsView(
          {
            connector: this.connector,
            collection: this.groups,
            dragData: this._dragData,
            blockingParentView: this,
            dragAndDropEnabled: this.options.dragAndDropEnabled
          });

      this.listenTo(this.groupsView, 'group:selected', function (groupView) {
        this.collection.populate(groupView.model.favorites.models, {
          parse: false
        });
        this._setSelectedGroup(groupView.model);
      });

      this.listenTo(this.groupsView, 'group:any:editing', function (args) {
        this._allowDragging = !args.on;
        this._updateDraggable();
      });

      this.listenTo(this.groupsView, 'group:deleted', function (model) {
        if (this.selectedGroup) {
          var id = model.get('tab_id');
          var selectedGroupId = this.selectedGroup.get('tab_id');
          if (selectedGroupId === id) {
            delete this.selectedGroup; // this is no more valid - choose new one
            this._trySelectGroup(); // select another group
          }
        }
      });

      this.listenTo(this.groupsView, 'group:dropped', function (args) {
        var self = this;
        var collection = this.groups;
        var idSource = args.tabIdSource;
        var idDestination = args.tabIdDestination;

        if (this._moveModel(collection, idSource, idDestination, args.dropAfter)) {

          var groupToFocus = this.groups.get(idSource);
          var groupToFocusIndex = this.groups.indexOf(groupToFocus);

          args.savePromise = this._saveAllFavorites().then(function () {
            self.groupsView._setFocusedByIndex(groupToFocusIndex);
            self.groupsView._tryReSetFocus();
          });
        }
      });

      this.listenTo(this.groupsView, 'dropped:favorite', function (args) {

        var idSources = args.idSources;
        if (!_.isArray(idSources) || idSources.length === 0) {
          return; // nothing to do
        }
        var groups = this.groups;
        var favorites = this.collection;
        var idTarget = args.tabIdDestination;
        var sourceGroup = groups.get(args.tabIdSource);
        var selectedGroupId = this.selectedGroup.get('tab_id');

        _.each(idSources, function (idSource) {
          var modelSource = sourceGroup.favorites.get(idSource);
          sourceGroup.favorites.remove(modelSource);
          var targetGroup = groups.get(idTarget);
          targetGroup.favorites.add(modelSource);
          if (selectedGroupId === args.tabIdSource) {
            modelSource = favorites.get(idSource);
            favorites.remove(modelSource);
            modelSource.set('csuiIsSelected', false);
          } else {
            if (selectedGroupId === idTarget) {
              favorites.add(modelSource);
            }
          }

        });

        args.savePromise = this._saveAllFavorites();
      });
    },

    _removeDragline: function () {
      this.tableView.$el.find('.csui-dragline').remove();
      this.tableView.$el.find('tr.csui-no-border').removeClass('csui-no-border');
      delete this._dropAfter;
    },

    _updateDraggable: function () {
      if (this._allowDragging) {
        if (base.isAppleMobile() === false && this.options.dragAndDropEnabled) {
          var selectedRowsCount = this.tableView.getSelectedChildren().length;
          if (selectedRowsCount > 0) {
            var rows = this.tableView.$el.find('tr[draggable=true]');
            rows.attr('draggable', false);
            rows = this.tableView.$el.find('tr.binf-active');
            rows.attr('draggable', true);
          } else {
            this.tableView.$el.find('tr:not(.csui-table-row-shows-inlineform)').attr('draggable',
                true);
          }
        }
      } else {
        var draggableRows = this.tableView.$el.find('tr[draggable=true]');
        draggableRows.attr('draggable', false);
      }
    },

    _handleKeydown: function (event, model) {

      var isMac = base.isMacintosh();
      var dragSourceFavoriteIds;

      switch (event.keyCode) {
      case 88:
        if (isMac && event.metaKey && !event.ctrlKey || !isMac && !event.metaKey &&
            event.ctrlKey) {

          event.preventDefault();
          event.stopPropagation();
          var dragSourceGroupId = this.selectedGroup.get('tab_id');
          dragSourceFavoriteIds = [];
          this._dragData.set({
            groupId: dragSourceGroupId,
            favorites: dragSourceFavoriteIds
          });

          var selected = this.tableView.getSelectedChildren();
          if (selected.length > 0) {
            _.each(selected, function (model) {
              dragSourceFavoriteIds.push(model.get('id'));
            });
          } else {
            var focused = this.tableView.getFocusedChild();
            if (focused) {
              dragSourceFavoriteIds.push(focused.get('id'));
            }
          }
          this.tableView.trigger('closeOther');
          this.tableView.cancelAnyExistingInlineForm.call(this.tableView);
        }
        break;
      case 86:
        if (isMac && event.metaKey && !event.ctrlKey || !isMac && !event.metaKey &&
            event.ctrlKey) {

          event.preventDefault();
          event.stopPropagation();

          dragSourceFavoriteIds = this._dragData.get('favorites');

          if (!dragSourceFavoriteIds || dragSourceFavoriteIds.length === 0) {
            return;
          }

          var targetNode = model;
          var targetNodeId = targetNode.get('id');

          if (_.contains(dragSourceFavoriteIds, targetNodeId)) {
            return;
          }

          try {
            var dropAfter = false;
            this._moveAndSaveFavorites(this._dragData.get('favorites'), targetNodeId,
                dropAfter);
          } catch (error) {

          }
        }
        break;
      }
    },

    setTableView: function () {
      this.tableView = new InfiniteScrollingTableView({
        context: this.options.context,
        connector: this.connector,
        collection: this.collection,
        columns: this.columns,
        tableColumns: this.tableColumns,
        pageSize: this.options.pageSize,
        originatingView: this,
        columnsWithSearch: ["favorite_name"],
        orderBy: this.options.orderBy,
        filterBy: this.options.filterBy,
        nameEdit: false,
        favoritesTableOptions: this.favoritesTableOptions,
        actionItems: this.defaultActionController.actionItems,
        commands: this.defaultActionController.commands,
        blockingParentView: this,
        tableTexts: {
          zeroRecords: lang.emptyGroupText
        },
        inlineBar: {
          viewClass: TableActionBarView,
          options: _.extend({
            collection: this.options.toolbarItems.inlineActionbar,
            toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineActionbar,
            delayedActions: this.collection.delayedActions,
            container: this.collection.node,
            containerCollection: this.collection,
            commandExecutionOptions: {
              nameAttribute: 'favorite_name'
            }
          }, this.options.toolbarItems.inlineActionbar.options, {
            inlineBarStyle: this.options.inlineActionBarStyle,
            forceInlineBarOnClick: this.options.forceInlineActionBarOnClick,
            showInlineBarOnHover: this.options.showInlineActionBarOnHover
          })
        }
      });

      var self = this;

      this.listenTo(this.tableView, 'tableRowRendered', function (row) {
        var $row = $(row.target);
        $row.on('focusin', function (event) {
          self._tableRowWithFocus = row;
        });
        $row.on('focusout', function (event) {
          delete self._tableRowWithFocus;
        });
        $row.on('keydown', function (event) {
          self._handleKeydown.call(self, event, row.node);
        });
      });

      this.listenTo(this.tableView, 'tableRowRendered', function (row) {

        var $row = $(row.target);
        $row.find('a').attr('draggable', false);
        if (base.isAppleMobile() === false && this.options.dragAndDropEnabled) {
          if ($row.hasClass("csui-table-row-shows-inlineform") === false) {
            $row.attr('draggable', true);
          }
        }

        $row.on('dragstart', function (event) {
          var dragSourceGroupId = self.selectedGroup.get('tab_id');
          var dragSourceFavorites = [];
          self._dragData.set({
            groupId: dragSourceGroupId,
            favorites: dragSourceFavorites,
            sourceIndex: event.currentTarget._DT_RowIndex
          });

          var selected = self.tableView.getSelectedChildren();
          if (selected.length > 0) {
            _.each(selected, function (model) {
              dragSourceFavorites.push(model.get('id'));
            });
          } else {
            var modelToMove = self.collection.at(self._dragData.get('sourceIndex'));
            dragSourceFavorites.push(modelToMove.get('id'));
            $(event.currentTarget).removeClass("csui-state-hover");
          }
          event.originalEvent.dataTransfer.setData('text', '');

          self.tableView.trigger('closeOther');
          self.tableView.cancelAnyExistingInlineForm.call(self.tableView);
        });

        $row.on('dragover', function (event) {

          if (!self._dragData.get('favorites') || self._dragData.get('favorites').length === 0) {
            return; // don't show this element as drop target, because no favorite was dragged
          }

          var sourceIndex = self._dragData.get('sourceIndex');
          var targetIndex = event.currentTarget._DT_RowIndex;

          if (sourceIndex === undefined || sourceIndex === targetIndex) {
            return; // don't allow dropping to the same element and drag sources not from table
          }

          event.preventDefault(); // enables dropping to this element

          var dragline = $('<tr class="csui-dragline">');
          var h = $(event.currentTarget).height();
          if (event.offsetY > (h / 2)) {
            if (self._dropAfter === undefined || self._dropAfter === false) {
              self._removeDragline.call(self);
              $(event.currentTarget).after(dragline);
              self._dropAfter = true;
            }
          } else {
            if (self._dropAfter === undefined || self._dropAfter === true) {
              self._removeDragline.call(self);
              $(event.currentTarget).before(dragline);
              if (targetIndex === 0) {
                dragline.before('<tr class="csui-dragline csu-dragline-spacer">');
              }
              self._dropAfter = false;
            }
          }
          dragline.next().addClass('csui-no-border');
        });

        $row.on('drop', function (event) {

          var sourceIndex = self._dragData.get('sourceIndex');
          var targetIndex = event.currentTarget._DT_RowIndex;
          var targetNode = row.node;
          var targetNodeId = targetNode.get('id');
          if (sourceIndex === undefined || sourceIndex === targetIndex) {
            return; // don't allow dropping to the same element and drag sources not from table
          }

          event.preventDefault(); // enables dropping to this element

          try {
            if (self._dragData.get('favorites') && self._dragData.get('groupId')) {
              var h = $(event.currentTarget).height();
              var dropAfter = event.offsetY > (h / 2);
              self._moveAndSaveFavorites(self._dragData.get('favorites'), targetNodeId, dropAfter);
            }
          } catch (error) {}
          self._removeDragline();
        });

        $row.on('dragleave', function (event) {
          self._removeDragline();
        });

        $row.on('dragend', function (event) {
          event.preventDefault();
          self._removeDragline();
          self._dragData.clear();
        });

      });

      this.listenTo(this.tableView, 'tableRowSelected', this._updateDraggable);
      this.listenTo(this.tableView, 'tableRowUnselected', this._updateDraggable);

      this.listenTo(this, 'render', function () {
        this.groupsRegion.show(this.groupsView);
        this.tableRegion.show(this.tableView);

        this.groups.ensureFetched({
          reload: true
        }); // to make sure to have the latest node state

        this.options.showGroupsRegion === false && this.groupsRegion.$el.hide();

        delete this._tableRowWithFocus;
      });

      this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
        var args = {
          node: node
        };
        this.trigger('before:defaultAction', args);
        if (!args.cancel) {
          var self = this;
          this.defaultActionController.executeAction(node, {
            context: this.options.context,
            originatingView: this
          }).done(function () {
            self.trigger('executed:defaultAction', args);
          });
        }
      });

    },

    _addFavoriteAttribute: function (collection) {
      collection.each(function (node) {
        node.set('favorite', true);
      }, this);
      return true;
    }

  });

  _.extend(Favorites2TableView.prototype, LayoutViewEventsPropagationMixin);

  return Favorites2TableView;
});