/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module','csui/lib/underscore', 'csui/lib/backbone', 'webreports/utils/url.webreports',
    'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns', 'csui/models/node/node.model',
    'csui/models/mixins/connectable/connectable.mixin', 'csui/models/mixins/fetchable/fetchable.mixin',
    'csui/models/browsable/browsable.mixin', 'csui/models/browsable/v1.request.mixin','csui/models/browsable/v2.response.mixin'
], function (module, _, Backbone, UrlWebReports, NodeChildrenColumnModel, NodeChildrenColumnCollection, NodeModel,
             ConnectableMixin, FetchableMixin, BrowsableMixin, BrowsableV1RequestMixin,BrowsableV2ResponseMixin ) {

    var config = module.config();
    _.defaults(config, {
        defaultPageSize: 30
    });

	var TableReportColumnModel = Backbone.Model.extend({

		idAttribute: "column_key",

		constructor: function TableReportColumnModel(attributes, options) {

			Backbone.Model.prototype.constructor.apply(this, arguments);

		}

	});

	var	TableReportColumnCollection = Backbone.Collection.extend({

			model: TableReportColumnModel,

			constructor: function TableReportColumnCollection(models, options) {

				Backbone.Collection.prototype.constructor.apply(this, arguments);

			}
	});

	var TableReportCollection = Backbone.Collection.extend({
		constructor: function TableReportCollection(attributes, options) {

			Backbone.Collection.prototype.constructor.apply(this, arguments);
			this.columns = new TableReportColumnCollection();
			this.totalCount = 0;
			this.skipCount = 0;
			this.topCount = config.defaultPageSize;

            if (options.data.sortBy && options.data.sortOrder) {
            	if (!options.data.orderBy) {
                    options.data.orderBy = options.data.sortBy + " " + options.data.sortOrder;
				}
                options.orderBy = options.data.sortBy + " " + options.data.sortOrder;
            }

			this.orderBy = options.data.orderBy;
			this.options = options;
		this.makeConnectable(options)
			.makeBrowsable(options)
			.makeBrowsableV1Request(options)
			.makeBrowsableV2Response(options)
			.makeFetchable(options);
		},
		url: function () {
			var query = '',
				context = this.options.context || undefined,
				parameters = this.options.data.parameters || undefined;

			query = UrlWebReports.combineQueryString(
				query,
				this.getBrowsableUrlQuery()
			);
			query = UrlWebReports.appendWebReportParameters(query, parameters);
			query = UrlWebReports.appendCurrentContainer(query, context);
            query = UrlWebReports.appendSWRCellID(query, this.options);

			return UrlWebReports.combine(this.connector.connection.url + '/nodes/' + this.options.data.id,
				query ? '/output?format=webreport&' + query : '/output?format=webreport');
		},

		parse: function(response){

			this.parseBrowsedState(response, this.options);

			this.columns.reset(this._processColumns(response));
			return response.data;
		},

		_processColumns: function(response) {

            var firstSortableColumn;
			if (this.orderBy === "") {
                firstSortableColumn = _.findWhere(response.columns, {sort:true});
                if (!_.isUndefined(firstSortableColumn)) {
                    this.orderBy = firstSortableColumn.column_key + " ASC";
                }
            }

			return _.map(response.columns, _.bind( function (column) {

				var options,
                    swrLaunchCell;

				if (column.name_formatted && column.name_formatted !== ""){
                    column.name = column.name_formatted;
				}

				if (column.column_key === 'subwebreportid') {
					options = this.options;
                    if (options && options.data && options.data.swrLaunchCell) {
                    	swrLaunchCell = options.data.swrLaunchCell;
                    	if(swrLaunchCell.iconClass){
                            column.iconClass = swrLaunchCell.iconClass;
						}
						if(swrLaunchCell.hoverText){
                    		column.hoverText = swrLaunchCell.hoverText;
						}
					}
				}

				return column;

			}, this));
		}

	});

    BrowsableMixin.mixin(TableReportCollection.prototype);
    ConnectableMixin.mixin(TableReportCollection.prototype);
	BrowsableV1RequestMixin.mixin(TableReportCollection.prototype);
	BrowsableV2ResponseMixin.mixin(TableReportCollection.prototype);
	FetchableMixin.mixin(TableReportCollection.prototype);

    var originalSetFilter = TableReportCollection.prototype.setFilter;

	TableReportCollection.prototype.setFilter = function (value, attributes, options){
    	this.skipCount = 0;

        return originalSetFilter.apply(this, [value, attributes, options]);
	};

    return TableReportCollection;

});
