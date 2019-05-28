/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
	'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
	'csui/utils/commands',
	'hbs!webreports/widgets/parameter.prompt.form/impl/footer/parameter.prompt.footer',
	'i18n!webreports/widgets/parameter.prompt.form/impl/nls/lang',
	'css!webreports/widgets/parameter.prompt.form/impl/footer/parameter.prompt.footer'
], function (_, $, Backbone, Marionette, ViewEventsPropagationMixin,
			 Commands,
			  template, lang) {

	var PromptFooterView = Marionette.ItemView.extend({

		className: 'webreport-parameter-prompt-footer',

		template: template,

		templateHelpers: function () {
			return {
				cancel: lang.cancel,
				runWebReport: lang.runWebReport
			};
		},

		ui: {
			"submitWR": "button.submitWR",
			"cancelWR": "button.cancelWR"
		},

		triggers: {
			"click @ui.submitWR": "submitWR",
			"click @ui.cancelWR": "cancelWR"
		},

		constructor: function PromptFooterView(options) {
			options || (options = {});
			this.options = options;
			this.node = this.options.model;
			Marionette.ItemView.prototype.constructor.call(this, options);
		}

	});

	return PromptFooterView;
});