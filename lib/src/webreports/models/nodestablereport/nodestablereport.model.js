/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module','csui/lib/underscore', 'csui/lib/backbone', 'webreports/utils/url.webreports',
    'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns', 'csui/models/node/node.model',
    'csui/models/mixins/connectable/connectable.mixin', 'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/commandable/commandable.mixin',
    'csui/models/browsable/browsable.mixin', 'csui/models/browsable/v1.request.mixin','csui/models/browsable/v2.response.mixin',
    'csui/models/mixins/v2.expandable/v2.expandable.mixin'
], function (module, _, Backbone, UrlWebReports, NodeChildrenColumnModel, NodeChildrenColumnCollection, NodeModel,
             ConnectableMixin, FetchableMixin, CommandableMixin, BrowsableMixin, BrowsableV1RequestMixin,BrowsableV2ResponseMixin,ExpandableV2Mixin ) {

    var config = module.config();
    _.defaults(config, {
        defaultPageSize: 30
    });

    var NodesTableReportColumnModel = NodeChildrenColumnModel.extend({});

    var NodesTableReportColumnCollection = NodeChildrenColumnCollection.extend({

        model: NodesTableReportColumnModel,
        getColumnModels: function (columnKeys, definitions) {
            var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
                this, columnKeys, definitions);
            _.each(columns, function (column) {
                var columnKey = column['column_key'];
                if (columnKey === 'type' || columnKey === 'name' || columnKey === 'modify_date') {
                    column.sort = true;
                }
            }, this);
            return columns;
        },
        getV2Columns: function (response) {

            var definitions = (response.results && response.results[0] &&
                response.results[0].metadata && response.results[0].metadata.properties) || {};
            if (!definitions.size &&
                (definitions.container_size ||
                (definitions.versions && definitions.versions.file_size))) {
                definitions.size = definitions.container_size || definitions.versions.file_size;
                definitions.size.align = 'right';
                definitions.size.key = 'size';
                definitions.size.name = 'Size';
                definitions.size.sort = true;
            }

            var columnKeys = _.keys(definitions);

            return this.getColumnModels(columnKeys, definitions);
        }

    });

    var NodesTableReportModel = NodeModel.extend({

        parse: function (response, options) {
            var node, node_version;
            if (response.data && response.data.properties) {
                node = response.data.properties;
                node_version = (!_.isUndefined(response.data.versions)) ? response.data.versions : undefined;
            } else {
                node = response;
                node_version = (!_.isUndefined(response.versions)) ? response.versions : undefined;
            }
            node.short_name = node.name; // node.name.length > 20 ? node.name.substr(0, 20) + '...' : node.name;
            if (!node.size) {
                if (node.container) {
                    node.size = node.container_size;
                } else if (node_version) {
                    node.size = node_version.file_size;
                    node.size_formatted = undefined;
                }
            }
            if (!node.mime_type && node_version && node_version.mime_type) {
                node.mime_type = node_version.mime_type;
            }
            return NodeModel.prototype.parse.call(this, response, options);
        }

    });

    var NodesTableReportCollection = Backbone.Collection.extend({

			model: NodesTableReportModel,

			constructor: function NodesTableReportCollection(attributes, options) {
				Backbone.Collection.prototype.constructor.apply(this, arguments);

				if (_.isUndefined(options)){
					options = {};
				}

				if (options && options.id && !this.id) {
					this.id = options.id;
				}

				this.options = options;

				this.makeConnectable(options)
					.makeFetchable(options)
					.makeCommandable(options)
					.makeBrowsable(options)
					.makeBrowsableV1Request(options)
					.makeBrowsableV2Response(options)
                    .makeExpandableV2(options);

				this.skipCount = options.skip || 0;
				this.topCount = options.pageSize || config.defaultPageSize;
				this.filters = options.filter || {};
				this.orderBy = options.orderBy || 'name';

				this.columns = new NodesTableReportColumnCollection();
			},

			clone: function () {
                var clone = new this.constructor(this.models, this.options);
                if (this.columns) {
                    clone.columns.reset(this.columns.toJSON());
                }
                clone.actualSkipCount = this.actualSkipCount;
                clone.totalCount = this.totalCount;
                clone.filteredCount = this.filteredCount;
                clone.skipCount = this.skipCount;
                clone.filters = this.filters;

                return clone;
			},

			url: function () {
				var query = '',
					context = this.options.context || undefined,
					parameters = this.options.parameters || undefined;

				query = UrlWebReports.combineQueryString(
					query,
					this.getBrowsableUrlQuery(),
                    this.getExpandableResourcesUrlQuery()
				);
				query = UrlWebReports.appendWebReportParameters(query, parameters);
				query = UrlWebReports.appendCurrentContainer(query, context);

				return UrlWebReports.combine(this.connector.connection.url + '/nodes/' + this.id,
					query ? '/output?format=webreport&' + query : '/output?format=webreport');
			},

			parse: function (response, options) {
				var webReportBrowseData;

				this.columns && this.columns.resetColumnsV2(response, options);
				this.parseBrowsedState(response, options);
				webReportBrowseData = this.parseBrowsedItems(response, options);
				return webReportBrowseData;
			},

			_renameColumnKeys: function (columns) {

				var newColumns = {};

				_.each(columns, function (value, key) {
					key = value.key;
					newColumns[key] = value;
				} );
				return newColumns;
			}
		}
    );

    BrowsableMixin.mixin(NodesTableReportCollection.prototype);
    ConnectableMixin.mixin(NodesTableReportCollection.prototype);
    FetchableMixin.mixin(NodesTableReportCollection.prototype);
	CommandableMixin.mixin(NodesTableReportCollection.prototype);
    BrowsableV1RequestMixin.mixin(NodesTableReportCollection.prototype);
    BrowsableV2ResponseMixin.mixin(NodesTableReportCollection.prototype);
    ExpandableV2Mixin.mixin(NodesTableReportCollection.prototype);

    var originalSetFilter = NodesTableReportCollection.prototype.setFilter;

    NodesTableReportCollection.prototype.setFilter = function (value, attributes, options){
        this.skipCount = 0;

        return originalSetFilter.apply(this, [value, attributes, options]);
    };

    return NodesTableReportCollection;

});
