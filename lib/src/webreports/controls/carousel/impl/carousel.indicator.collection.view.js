/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
	'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/lib/backbone',// 3rd party libraries
	'csui/controls/tile/behaviors/perfect.scrolling.behavior',
	'webreports/controls/carousel/impl/carousel.indicator.item.view',
	'i18n!webreports/controls/carousel/impl/nls/carousel.lang',
	'css!webreports/controls/carousel/impl/carousel'
], function (_, $, Marionette, Backbone, PerfectScrollingBehavior, IndicatorItemView, lang) {
	
	var CarouselIndicatorCollectionView = Marionette.CollectionView.extend({

		childView: IndicatorItemView,

		tagName: "ol",

		className: "binf-carousel-indicators",

		childViewOptions: function (model, index) {

			return {
				starting_index: this.options.data.starting_index
			};
		},

		constructor: function CarouselIndicatorCollectionView(options) {

			var attributes;

			if (options && options.data) {
				
				attributes = {
					id: options.data.id,
					models: options.data.requestedWidgetModels
				};
				
			}
			Marionette.CollectionView.prototype.constructor.apply(this, arguments);
		}
	});

	return CarouselIndicatorCollectionView;

});
