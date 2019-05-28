/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/jquery',
	'csui/utils/log',
	'csui/utils/contexts/factories/application.scope.factory',
	'csui/utils/contexts/factories/node',
	'csui/utils/contexts/factories/next.node',
	'csui/models/nodeancestors',
	'csui/controls/breadcrumbs/breadcrumbs.view',
	'csui/utils/contexts/perspective/perspective.context.plugin',
	'webreports/utils/perspective/webreport.perspectives',
	'webreports/utils/contexts/factories/query.parameters.factory',
	'webreports/utils/contexts/factories/run.webreport.pre.factory',
	'webreports/controls/run.webreport.pre/run.webreport.pre.controller',
	'webreports/utils/url.webreports'
], function (require, _, Backbone, $, log,
			 ApplicationScopeModelFactory,
			 NodeFactory,
			 NextNodeFactory,
			 NodeAncestorCollection,
			 BreadcrumbsView,
			 PerspectiveContextPlugin,
			 WebReportPerspectives,
			 QueryParametersFactory,
			 RunWRPreFactory,
			 RunWRController,
			 WRUrl
) {
	'use strict';

	var WebReportPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

		refreshPerspectiveAfterPrompt: false,

		constructor: function WebReportPerspectiveContextPlugin(options) {
			PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);
			this.listenTo(options.context, "before:change:perspective", this._beforeChangePerspective);
		},

		
		_beforeChangePerspective: function(context, nodeModel){

			var runWRPreModel,
				self,
				nextNode = this.context.getModel(NextNodeFactory);


			if (nextNode.get("type") === 30303) {
				this.wrid = nextNode.get("id");
				this.nodeModel = nodeModel;
				this.queryParameters = this.context.getModel( QueryParametersFactory, {
					permanent: true,
					detached: true
				}); // permanent so it's around for subsequent events
				runWRPreModel = this.context.getModel(RunWRPreFactory,{
					attributes: {
						id: this.wrid
					},
					options: {
						connector: nextNode.connector,
						id: this.wrid
					}
				});

				this.runWRPreModel = runWRPreModel;
				if (_.has(runWRPreModel, "parameters")){
					this.parameters = runWRPreModel.parameters;
				}

				if (_.has(runWRPreModel, "destinationModel")){
					this.destinationModel = runWRPreModel.destinationModel;
					this._replacePlaceholderWidget();

				} else {
					console.warn("Executing a WebReport via its direct URL isn't supported yet.");

				}

			}

		},
		_setupOptions: function(){

			var options = this.options || {};

			_.extend(options, {
				context: this.context,
				node: this.context.getModel(NextNodeFactory)
			});

			this.options = options;
		},
		_setupModels: function() {

			var destinationRoute,
				options = this.options,
				wrid = this.wrid,
				self = this,
				deferred = $.Deferred();
			
			
			this.perspectiveModel =  this.context.perspective;
			this.runWRPreModel.fetch({async:false})
				.done(function(){

					self.RunWRController.runWRPreModel = self.runWRPreModel;
					self.RunWRController.parametersModel = self.runWRPreModel.parametersModel;
					self.RunWRController.destinationModel = self.runWRPreModel.destinationModel;

					self.RunWRController.PerspectivePlugin = self; // pass this plugin so that the Controller can easily call it back
					self.RunWRController.options = self.options; // put options on the Controller if using _checkPrompts;
					destinationRoute = self.RunWRController._checkPrompts();
				});

		},
		updatePerspectiveOptions: function(){
			this.destinationModel =  this.runWRPreModel.destinationModel;
			this._replacePlaceholderWidget();
		},
		_replacePlaceholderWidget: function(){

			var	expandedParms,
				specifics = this.destinationModel.get("destination_specific"),
				widgetOptions = _.extend( specifics.options, { id: this.wrid }),
				perspective = this.nodeModel.get("perspective"), // todo:  use the perspective returned from the WR node for now.
				widgetPlaceholder = perspective.options.rows[0].columns[0].widget;
			if (typeof this.queryParameters !== "undefined" ) {
				expandedParms = WRUrl.getDataAsWebReportParameters(this.queryParameters.attributes);
				widgetOptions = _.extend( widgetOptions, {parameters: expandedParms});
			}
			widgetPlaceholder.type = specifics.type;
			widgetPlaceholder.options = widgetOptions;

		},
		showPromptWidget: function() {

			var	perspective = this.nodeModel.get("perspective"), // todo:  use the perspective returned from the WR node for now.
				widgetPlaceholder = perspective.options.rows[0].columns[0].widget;
			widgetPlaceholder.type = "webreports/widgets/parameter.prompt.form";
			widgetPlaceholder.options = {
				model:this.nodeModel,
				showBackIcon: false,
				RunWRController: this.RunWRController
			};
			this.refreshPerspectiveAfterPrompt = true;
		}


	});

	return WebReportPerspectiveContextPlugin;

});
