/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
	'csui/lib/underscore',
	'csui/controls/tile/tile.view',
	'webreports/controls/table.report/table.report.view',
	'webreports/controls/nodestablereport/nodestablereport.view',
	'i18n!webreports/widgets/table.report/impl/nls/table.report.lang',
	'hbs!webreports/widgets/table.report/impl/table.report.tile',
	'css!webreports/style/webreports.css'
], function (_, TileView, TableReportView, NodesTableReportView, lang, template) {

	var TableReportTileView = TileView.extend({

		contentView: TableReportView,

		template: template,

		constructor: function TableReportTileView(options) {

			if (options.data){
                options.data.header = false;

                if (options.data.sortBy && options.data.sortOrder) {
                	options.data.orderBy = options.data.sortBy + " " + options.data.sortOrder;
				}
			}
			this.contentViewOptions = options;
			TileView.prototype.constructor.apply(this, arguments);
		},

		templateHelpers: function () {

			var helpers = {
				title: this.options.data.title || lang.dialogTitle,
				icon: this.options.data.titleBarIcon || 'title-webreports'
			};

			return helpers;

		}

	});

	return TableReportTileView;

});
