/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
	'csui/utils/base', 'csui/models/node/node.model',
	'csui/utils/contexts/factories/node',
	'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
	'csui/utils/nodesprites',
	'csui/controls/progressblocker/blocker',
	'webreports/widgets/parameter.prompt.form/impl/header/parameter.prompt.header.view',
	'webreports/widgets/parameter.prompt.form/impl/footer/parameter.prompt.footer.view',
	'csui/utils/commandhelper',
	'csui/utils/commands',
	'webreports/controls/run.webreport.pre/run.webreport.pre.controller',
	'i18n!webreports/widgets/parameter.prompt.form/impl/nls/lang',
	'hbs!webreports/widgets/parameter.prompt.form/impl/parameter.prompt.layout',
	'css!webreports/widgets/parameter.prompt.form/impl/parameter.prompt'
], function (_, $, Marionette, base, NodeModel,
			 NodeModelFactory,
			 ViewEventsPropagationMixin, NodeSpriteCollection,
			 BlockingView,
			 PromptHeaderView,
			 PromptFooterView,
			 CommandHelper,
			 commands,
			 RunWebReportPreController,
			 lang, template) {

	var ParameterPromptLayoutView = Marionette.LayoutView.extend({

		template: template,

		regions: {
			header: ".webreport-parameter-prompt-header-container",
			content: ".webreport-parameter-prompt-content-container",
			footer: ".webreport-parameter-prompt-footer-container"
		},

		constructor: function (options) {
			Marionette.LayoutView.prototype.constructor.call(this, options);

			this.options = options;

			this.RunWRController = ( _.has( options, "RunWRController") ) ? options.RunWRController : new RunWebReportPreController(); //2nd case is for test page scenarios

			BlockingView.imbue(this);
		},

		childEvents: {
			"submitWR": "submitWR",
			"cancelWR": "cancelWR",
			"onClickBackArrow": "_closePromptView",
			"show:prompt:form": "showPromptForm"
		},

		onBeforeShow: function(){

			var self = this,
				options = this.options || {};

			this.blockActions();
			this.RunWRController.getFormView(options)
				.done(function( formView ){

					if ( typeof formView !== "undefined" ){
						self.showChildView( "content", formView );
					}

					self.unblockActions();
				});
			this.showChildView( "header", new PromptHeaderView( options ));
			this.showChildView( "footer", new PromptFooterView( options ));
			this.listenTo(this.getChildView("header"), "promptView:close", function () {
					self.trigger("promptView:close");
				})
				.listenTo(options.context, 'request', function () {
					self._closePromptView();
				})
				.listenTo(options.context, 'request:perspective', function () {
					self._closePromptView();
				});
		},

		_blockActions: function () {
			var origView = this.options.originatingView;
			origView && origView.blockActions && origView.blockActions();
		},

		_unblockActions: function () {
			var origView = this.options.originatingView;
			origView && origView.unblockActions && origView.unblockActions();
		},


		submitWR: function() {
			var parm,
				parmData,
				schema,
				promptView = this.getRegion("content").currentView,
				parmsOK = promptView.validate();

			if (parmsOK === true) {

				parmData = promptView.getValues(); // The entered values
				if ( _.has(promptView, "alpaca") && _.has(promptView.alpaca, "schema") && _.has(promptView.alpaca.schema, "properties")){

					schema =  promptView.alpaca.schema.properties;

					for ( parm in schema ) {

						if ( schema[parm].type === "number" ){

							if (isNaN(parmData[parm])) {
								parmData[parm] = "";
							}

						}


					}
				}
				this.RunWRController.executeWR( parmData );
				this._closePromptView();
			}

		},

		cancelWR: function() {
			this._closePromptView();
		},

		_closePromptView: function() {

			var node = this.options.model;

			if (node.get('type') === 1 && node.original && node.original.get('type') === 0) {
				this.trigger("promptView:close");
			} else {
				this.trigger('promptView:close:without:animation');
			}
		}

	});

	return ParameterPromptLayoutView;

});
