/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
	'csui/lib/underscore',
	'csui/utils/contexts/factories/factory',
	'csui/utils/contexts/factories/connector',
	'webreports/models/run.webreport/run.webreport.model'
], function (_,ModelFactory, ConnectorFactory, RunWRModel) {

	var RunWRModelFactory = ModelFactory.extend({
		propertyPrefix: 'runwrmodel',

		constructor: function RunWRModelFactory(context, options) {
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
			if (_.has(options,"parameters") ) {
				modelOptions = _.extend( modelOptions, {
					parameters: options.parameters
				});
			}
			this.property = new RunWRModel({}, modelOptions);
		}

	});

	return RunWRModelFactory;

});
