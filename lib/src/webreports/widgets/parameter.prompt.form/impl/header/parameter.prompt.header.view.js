/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
	'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
	'hbs!webreports/widgets/parameter.prompt.form/impl/header/parameter.prompt.header',
	'i18n!webreports/widgets/parameter.prompt.form/impl/nls/lang',
	'css!webreports/widgets/parameter.prompt.form/impl/header/parameter.prompt.header'
], function (_, $, Backbone, Marionette, ViewEventsPropagationMixin,
			 template, lang) {

	var PromptHeaderView = Marionette.ItemView.extend({

		className: 'webreport-parameter-prompt-header',

		template: template,

		ui: {
			backArrow: '.cs-go-back'
		},

		triggers: {
			"click @ui.backArrow": "onClickBackArrow"
		},

		constructor: function PromptHeaderView(options) {
			options || (options = {});
			this.options = options;

			Marionette.ItemView.prototype.constructor.call(this, options);

		},

		templateHelpers: function () {
			
			var model = (_.has( this.model, "models")) ? this.model.models[0] : this.model,
				showBackIcon = ( _.has(this.options, "showBackIcon") ) ? this.options.showBackIcon : true;

			return {
				webreport_name: model.get("name"),
				go_back_tooltip: lang.goBackTooltip,
				back_button: showBackIcon
			};
		},

		onClickHeader: function (event) {
			event.preventDefault();
			event.stopPropagation();
		}
	});

	return PromptHeaderView;
});