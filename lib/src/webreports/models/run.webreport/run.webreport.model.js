/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
	'csui/lib/underscore',
	'csui/lib/backbone',
	'csui/utils/base',
	'csui/models/mixins/connectable/connectable.mixin'
], function (_, Backbone, base, ConnectableMixin ) {

	var RunWebReportModel = Backbone.Model.extend({

		constructor: function RunWebReportModel(attributes, options) {
			this.options = options || {};
			Backbone.Model.prototype.constructor.apply(this, arguments);

			this.makeConnectable(this.options);
		},

		url: function () {
			var parms,
				options = this.options,
				id = options.id,
				connector = this.connector,
				path = "nodes/"+ id +"/output";
			if (_.has(options, "parameters")) {
				if ( !_.isArray(options.parameters) && _.isObject(options.parameters)){
					parms = options.parameters;
					path = path + "?" + base.Url.combineQueryString(parms);
				}

			}

			return base.Url.combine( connector.connection.url, path );

		},

		parse: function(resp, options) {
			if (_.has(options, "destinationModel")){
				options.destinationModel.set( resp.data.destination_data, options);
			} else {
				options.destinationModel = new Backbone.Model(resp.data.destination_data);
			}

			return resp;
		},
		clearParameters: function () {
			if ( _.has(this, "options") && _.has(this.options, "parameters") ) {
				delete( this.options.parameters);
			}
		}
		
	});

	ConnectableMixin.mixin(RunWebReportModel.prototype);

	return RunWebReportModel;

});