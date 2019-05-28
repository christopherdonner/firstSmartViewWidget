/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
	'csui/lib/underscore',
	'csui/utils/contexts/factories/factory',
	'csui/utils/contexts/factories/connector',
	'webreports/models/run.webreport.pre/run.webreport.pre.model'
], function (_,ModelFactory, ConnectorFactory, RunWRPreModel) {

	var runWebReportPreFactory = ModelFactory.extend({
		propertyPrefix: 'runwebreportpre',

		constructor: function runWebReportPreFactory(context, options) {
			if (_.has(options,"attributes")){
				delete options.attributes;
			}
			if (_.has(options, this.propertyPrefix) && _.has(options[this.propertyPrefix], "attributes")){
				delete options[this.propertyPrefix].attributes;
			}

			ModelFactory.prototype.constructor.apply(this, arguments);
			var connector = context.getObject(ConnectorFactory, options),
				modelOptions = _.extend( options.options, {
				connector: connector
			});
			this.property = new RunWRPreModel( {}, modelOptions );
		}

	});

	return runWebReportPreFactory;

});