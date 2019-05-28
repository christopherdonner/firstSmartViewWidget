/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
	'csui/utils/base',
	'csui/utils/commandhelper', 'csui/models/command',
	'csui/controls/globalmessage/globalmessage',
	'webreports/utils/contexts/factories/run.webreport.factory',
	'i18n!webreports/controls/run.webreport.pre/impl/nls/lang'
], function (_, $,
			 base,
			 CommandHelper, CommandModel,
			 GlobalMessage,
			 RunWRModelFactory,
			 lang ){

	var ExecuteWebReport = CommandModel.extend({

		defaults: {
			signature: 'ExecuteWebReport',
			scope: "single"
		},

		enabled: function (status) {
			var node = CommandHelper.getJustOneNode(status);
			return node && node.get('type') === 30303;
		},
		convertParametersToFormData: function(parameters){
			
			var serializedParms = '';
			
			if ( _.isObject( parameters ) && !_.isArray( parameters) ){

				_.each( parameters, function(value, key, list){

					var parm,
						val;

					parm = encodeURI(key);
					val = encodeURI(value);

					if (serializedParms.length) {

						serializedParms += '&' + parm + '=' + val;

					} else {

						serializedParms += parm + '=' + val;

					}

				});

			}

			return serializedParms;
		},

		execute: function (status, options) {
			var executeWRModel,
				requestAttrs,
				crud_method = "read", // GET default
				deferred = $.Deferred(),
				destinationModel = options.destinationModel,
				http_method = destinationModel.get("http_method"),
				lower_http_method = http_method.toLowerCase(),
				runInBackground = destinationModel.get("run_in_background"),
				executeOptions = {
					attributes: {
						id: options.node.get("id")
					},
					options: {
						id: options.node.get("id")
					}
				},
				hasParameters = ( _.has( options, "parameters" ) );


			executeWRModel = options.context.getModel( RunWRModelFactory, executeOptions );


			if (lower_http_method === "get") {
				crud_method = "read";
				if ( hasParameters && _.has(executeWRModel, "options" ) ) {
					executeWRModel.options =  _.extend( executeWRModel.options, {
						parameters: options.parameters
					});
				}

			} else {
				switch ( lower_http_method ) {

					case "post":
						crud_method = "create";
						break;

					case "put":
						crud_method = "update";
						break;

					case "patch":
						crud_method = "patch";
						break;

					case "delete":
						crud_method = "delete";
						break;
				}

				if ( hasParameters ) {
					requestAttrs = this.convertParametersToFormData( options.parameters );
				}

			}
			executeWRModel
				.sync( crud_method, executeWRModel, {
					data: requestAttrs,
					success: function(resp) {
						 if (resp) {
							 var serverAttrs = executeWRModel.parse(resp, options);
							 executeWRModel.set(serverAttrs, options);
						 }
						executeWRModel.clearParameters();
						deferred.resolve( arguments, executeWRModel );
					 },
					error: function(request, statusText, errorThrown ){
						var error = new base.Error(request);
						GlobalMessage.showMessage("error", error.message, error.errorDetails);
						executeWRModel.clearParameters();
						deferred.reject();
					}
				});


			if (runInBackground){
				deferred.resolve( [{}, "success"], executeWRModel, true );
			}

			return deferred.promise();

		}

	});

	return ExecuteWebReport;

});