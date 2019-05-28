/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/handlebars', 'csui/lib/marionette',  // 3rd party libraries
    'module',
    'csui/utils/contexts/factories/connector',
    'csui/controls/table/table.view',
    'csui/controls/pagination/nodespagination.view',
    'csui/controls/toolbar/toolbar.view',
    'csui/utils/commands',
    'csui/utils/base',
    'csui/controls/toolbar/toolbar.command.controller',
    'csui/controls/tableactionbar/tableactionbar.view',
    'csui/behaviors/default.action/default.action.behavior',
    'csui/controls/progressblocker/blocker',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
    'webreports/utils/contexts/factories/nodestablereportcolumns',
    'webreports/utils/contexts/factories/nodestablereport',
    'webreports/models/nodestablereport/impl/nodestablereport.columns',
    'webreports/controls/nodestablereport/impl/nodestablereport.toolbaritems',
    'webreports/controls/nodestablereport/impl/nodestablereport.toolbaritems.masks',
    'webreports/mixins/webreports.view.mixin',
    'hbs!webreports/controls/nodestablereport/impl/nodestablereport',
    'i18n!webreports/controls/nodestablereport/impl/nls/nodestablereport.lang',
    'css!webreports/controls/nodestablereport/impl/nodestablereport',
    'css!webreports/style/webreports.css'
], function (_, $, Handlebars, Marionette, module,ConnectorFactory, TableView, PaginationView, ToolbarView, commands, base, ToolbarCommandController, TableActionBarView, DefaultActionBehavior, BlockingView, LayoutViewEventsPropagationMixin, NodesTableReportColumnCollectionFactory, NodesTableReportCollectionFactory, nodesTableReportColumns, toolbarItems, ToolbarItemsMasks, WebReportsViewMixin, template, lang) {
    "use strict";

    var config = module.config();
    _.defaults(config, {
        defaultPageSize: 30,
        defaultPageSizes: [30, 50, 100],
        showInlineActionBarOnHover: true,
        forceInlineActionBarOnClick: false,
        inlineActionBarStyle: "csui-table-actionbar-bubble",
        clearFilterOnChange: true,
        resetOrderOnChange: false,
        resetLimitOnChange: true,
        fixedFilterOnChange: false
    });

    var NodesTableReportView = Marionette.LayoutView.extend({

        template: template,

        regions: {
            tableRegion: '#tableview',
            paginationRegion: '#paginationview'
        },

        behaviors: {

            DefaultAction: {
                behaviorClass: DefaultActionBehavior
            }

        },

        constructor: function NodesTableReportView(options) {
            options = this._processOptions(options);
            var modelOptions = this.setCommonModelOptions(options);
            BlockingView.imbue(this);
            Marionette.LayoutView.prototype.constructor.call(this, options);
            this.propagateEventsToRegions();

            this.collection = this.options.collection || this.context.getCollection(NodesTableReportCollectionFactory, { attributes: modelOptions });
            this.collection.setExpand('properties', ['parent_id', 'reserved_user_id']);
            this.columns = this.options.columns || this.context.getCollection(NodesTableReportColumnCollectionFactory, { attributes: modelOptions });

        },

        onRender: function () {

            if (this.collection) {

                this._setTableView(this.options);
                this._setPagination();

            }

            this.tableRegion.show(this.tableView);
            this.paginationRegion.show(this.paginationView);

        },

        templateHelpers: function () {
            var helpers = {
                title: base.getClosestLocalizedString(this.options.data.title, lang.dialogTitle),
                icon: this.options.data.titleBarIcon || 'title-webreports'
            };
            if (this.options.data.header !== false){
                _.extend(helpers,{header: true});
            }

            return helpers;
        },

        _processOptions: function(options){

            if (_.isUndefined(options)){
                options = {};
            }
            _.defaults(options, {
                data: {},
                pageSize: config.defaultPageSize,
                ddItemsList: config.defaultPageSizes,
                toolbarItems: toolbarItems,
                clearFilterOnChange: config.clearFilterOnChange,
                resetOrderOnChange: config.resetOrderOnChange,
                resetLimitOnChange: config.resetLimitOnChange,
                fixedFilterOnChange: config.fixedFilterOnChange
            });
            var pageSize  = options.data.pageSize || options.pageSize,
                pageSizes = options.data.pageSizes || options.ddItemsList;

            if (!_.contains(pageSizes, pageSize)) {
                pageSizes.push(pageSize);
                options.data.pageSizes = pageSizes.sort();
            }
            options.data.titleBarIcon = ( _.has(options.data, 'titleBarIcon')) ? 'title-icon '+ options.data.titleBarIcon : 'title-icon title-webreports';
            this.context = options.context;
            if (!options.connector) {
                options.connector = this.context.getObject(ConnectorFactory);
            }
            this.connector = options.connector;
            this.tableColumns = options.tableColumns || nodesTableReportColumns.deepClone();
            this.commands = options.commands || commands;
            this.commandController = new ToolbarCommandController({commands: this.commands});
            if (!options.toolbarItemsMasks) {
                options.toolbarItemsMasks = new ToolbarItemsMasks();
            }

            this.options = options;

            return options;
        },

        _setTableView: function (options) {
            options || (options = {});

            var args = _.extend({
                context: this.options.context,
                connector: this.connector,
                collection: this.collection,
                columns: this.columns,
                tableColumns: this.tableColumns,
                pageSize: this.options.data.pageSize || this.options.pageSize,
                originatingView: this,
                columnsWithSearch: ["name"],
                orderBy: this.options.data.orderBy || this.options.orderBy,
                filterBy: this.options.filterBy,
                actionItems: this.defaultActionController.actionItems,
                commands: this.defaultActionController.commands,
                blockingParentView: this,
                parentView: this,
                clientSideDataOperation: false,
                alternativeHeader: {
                    viewClass: ToolbarView,
                    options: {
                        toolbarItems: this.options.toolbarItems,
                        toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
                        toolbarCommandController: this.commandController
                    }
                },
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

            this._setTableViewEvents();
        },

        _setPagination: function () {
            this.paginationView = new PaginationView({
                collection: this.collection,
                pageSize: this.options.data.pageSize || this.options.pageSize
            });
            return true;
        },

        _setTableViewEvents: function(){
            this.listenTo(this.tableView, 'execute:defaultAction', function (node) {
                var args = {node: node};
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

        }

    });

    _.extend(NodesTableReportView.prototype, LayoutViewEventsPropagationMixin);
    WebReportsViewMixin.mixin(NodesTableReportView.prototype);

    return NodesTableReportView;
});