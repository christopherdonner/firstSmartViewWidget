/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
	'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/lib/backbone', // 3rd party libraries
	'csui/controls/tile/behaviors/perfect.scrolling.behavior',
	'webreports/controls/carousel/impl/carousel.slide.item.view',
	'i18n!webreports/controls/carousel/impl/nls/carousel.lang',
	'css!webreports/controls/carousel/impl/carousel'
], function (_, $, Marionette, Backbone, PerfectScrollingBehavior, SlideItemView, lang) {
	
	var CarouselSlideCollectionView = Marionette.CollectionView.extend({

		childView: SlideItemView,

		childViewContainer: ".carousel-slides-container",

		className: "binf-carousel-inner",

		childViewOptions: function (model, index) {

			return {
				starting_index: this.options.data.starting_index
			};
		},

		childEvents: {
			"starting:slide:added": "onStartingChildAdded"
		},

		onStartingChildAdded: function (item) {
			this.trigger('starting:slide:added', item);
		},

		constructor: function CarouselSlideCollectionView(options) {

			if (options && options.data) {
				
				var attributes = {
							id: options.data.id,
							models: options.data.requestedWidgetModels
						};

			}
			Marionette.CollectionView.prototype.constructor.apply(this, arguments);
		},

		ui: {
			carousel_container: "#carousel-main-data-container"
		},

		onRender: function () {
			this.$el.attr("role", "listbox");
		}
	});

	return CarouselSlideCollectionView;

});
