/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore','csui/lib/handlebars', 'csui/lib/marionette',
	'csui/utils/contexts/factories/connector',
	'csui/controls/table/table.view',
	'csui/controls/pagination/nodespagination.view',
    'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
	'webreports/utils/contexts/factories/table.report.factory',
	'webreports/controls/table.report/impl/table.report.columns',
	'hbs!webreports/controls/table.report/impl/table.report',
    'i18n!webreports/controls/table.report/impl/nls/table.report.lang',
    'css!webreports/controls/table.report/impl/table.report',
    'css!webreports/style/webreports.css'
], function (_, Handlebars, Marionette, ConnectorFactory, TableView, PaginationView, LayoutViewEventsPropagationMixin, TableReportCollectionFactory, TableColumns, template, lang) {
	"use strict";

	var TableReportView = Marionette.LayoutView.extend({

		template: template,

		regions: {
			tableRegion: '#tableview',
			paginationRegion: '#paginationview'
		},

		constructor: function TableLayoutView(options) {

			if(_.has(options.data, "columnsWithSearch")){
				if(typeof options.data.columnsWithSearch === "string") {

					options.data.columnsWithSearch = [options.data.columnsWithSearch];
				}
			}

            if (options.data.sortBy && options.data.sortOrder) {
                options.data.orderBy = options.data.sortBy + " " + options.data.sortOrder;
            }

			if (!this.options.tableColumns){
                this.options.tableColumns = TableColumns;
			}
            options.data.titleBarIcon = ( _.has(options.data, 'titleBarIcon')) ? 'title-icon '+ options.data.titleBarIcon : 'title-icon title-webreports';


			Marionette.LayoutView.prototype.constructor.call(this, options);
            this.propagateEventsToRegions();

		},

		initialize: function(){
			this.collection = this.options.collection ||
				this.options.context.getCollection(TableReportCollectionFactory, {attributes: this.options});
			this.columns = this.options.context.getCollection(TableReportCollectionFactory, {attributes: this.options});

		},

		onRender: function () {


			if (this.collection) {
				this.tableView = new TableView({
					context: this.options.context,
					connector: this.options.context.getObject(ConnectorFactory),
					collection: this.collection,
					columns: this.collection.columns,
					tableColumns: this.options.tableColumns,
					selectRows: this.options.data.selectRows || 'none',
					columnsWithSearch: this.options.data.columnsWithSearch || [],
					orderBy: this.options.data.orderBy || '',
					selectColumn: false
				});
				this.setPagination();

			} else if (this.tableView) {
				this.stopListening(this.tableView);
				delete this.tableView;
			}

			this.tableRegion.show(this.tableView);
			this.paginationRegion.show(this.paginationView);


		},

        templateHelpers: function () {
            var helpers = {
                title: this.options.data.title || lang.dialogTitle,
                icon: this.options.data.titleBarIcon || 'title-webreports'
            };
            if (this.options.data.header !== false){
                _.extend(helpers,{header: true});
            }

            return helpers;
        },

		setPagination: function () {

			this.paginationView = new PaginationView({
				collection: this.collection,
				pageSize: this.options.pageSize || 30
			});
			return true;

		}
	});

    _.extend(TableReportView.prototype, LayoutViewEventsPropagationMixin);

	return TableReportView;
});

