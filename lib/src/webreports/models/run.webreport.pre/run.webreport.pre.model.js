/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
	'csui/lib/jquery',
	'csui/lib/underscore',
	'csui/lib/backbone',
	'csui/utils/base',
	'csui/models/form',
	'csui/models/mixins/connectable/connectable.mixin'
], function ($, _, Backbone, base, FormModel, ConnectableMixin) {
	'use strict';

	var RunWRPreModel = FormModel.extend({

		parametersModel: undefined,
		destinationModel: undefined,

		constructor: function RunWRPreModel(attributes, options) {

			this.options = options || (options = {});

			Backbone.Model.prototype.constructor.apply(this, arguments);

			this.makeConnectable(options);

		},

		url: function () {
			var path = "forms/nodes/run",
				connector = this.connector,
				params = {
					id: this.options.id
				},
				resource = path + '?' + $.param(params);
			return base.Url.combine( connector.connection.url, resource);
		},

		parse: function (response) {
			this.parametersModel = new Backbone.Model( response.data.parameters_data );
			this.destinationModel = new Backbone.Model( response.data.destination_data );
			return response.forms[0];
		}

	});

	ConnectableMixin.mixin(RunWRPreModel.prototype);

	return RunWRPreModel;

});
