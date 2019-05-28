/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
	'csui/utils/command.error', 'csui/utils/commandhelper', 'csui/models/command',
	'csui/models/nodes',
	'webreports/controls/run.webreport.pre/run.webreport.pre.controller'
], function (require, _, $, Marionette,
			 CommandError, CommandHelper, CommandModel,
			 NodeCollection,
			 RunWebReportPreController ) {

	var OpenWebReportCommand = CommandModel.extend({

		constructor: function OpenWebReportCommand() {
			CommandModel.prototype.constructor.call(this);
			this.RunWRController = new RunWebReportPreController();
		},

		defaults: {
			signature: 'OpenWebReport',
			scope: "single"
		},

		enabled: function (status) {
			var node = CommandHelper.getJustOneNode(status);
			return node && node.get('type') === 30303;
		},

		execute: function (status, options) {

			var theForms,
				showPrompts,
				self = this,
				deferred = $.Deferred();


			if ( !(_.has(options, "node") )) {
				options.node = status.nodes.models[0];
			}

			this.RunWRController.commandStatus = status;
			showPrompts = this.RunWRController.checkForPromptParameters(options)
				.done(function(){
					deferred.resolve();
				})
				.fail(function(error){
					deferred.reject();
				});


			return deferred.promise();
		}

	});

	return OpenWebReportCommand;

});