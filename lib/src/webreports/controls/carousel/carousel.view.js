/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/lib/backbone',  // 3rd party libraries
	'csui/lib/binf/js/binf',
	'csui/utils/base',
	'csui/controls/tile/behaviors/perfect.scrolling.behavior',
	'webreports/utils/contexts/factories/carousel.collection.factory',
	'webreports/controls/carousel/impl/carousel.indicator.collection.view',
	'webreports/controls/carousel/impl/carousel.slide.collection.view',
	'i18n!webreports/controls/carousel/impl/nls/carousel.lang',
	'hbs!webreports/controls/carousel/impl/carousel.generic',
	'css!webreports/controls/carousel/impl/carousel'
], function (_, $, Marionette, Backbone, BINF, base, PerfectScrollingBehavior, CarouselCollectionFactory, IndicatorCollectionView, SlideCollectionView,  lang, template) {

	var CarouselContentView = Marionette.LayoutView.extend({

		currentSlideIndex: 0,
		nextSlideIndex: 0,
		isCycling: false,

		defaults: {
			title : "",
			titleBarIcon: "",
			header: false,
			auto_cycle: true,
			interval: 5000,
			pause_on_hover: "hover",
			wrap: true
		},

		template: template,

		tagName: "div",

		className: "binf-carousel binf-slide lazy",

		attributes: {
			"id": "carousel-main-data-container"
		},

		regions: {
			indicator_container: ".carousel-indicators-container",
			slide_container: ".carousel-slides-container"
		},

		constructor: function CarouselContentView(options) {
			options.data.title = ( _.has( options.data, "title") ) ? base.getClosestLocalizedString(options.data.title, this.defaults.title) : this.defaults.title;
			options.data.titleBarIcon = (  _.has( options.data, "titleBarIcon") ) ? options.data.titleBarIcon : this.defaults.titleBarIcon;
			options.data.header = (  _.has( options.data, "header") ) ? options.data.header : this.defaults.header;
			options.data.behavior.auto_cycle = ( _.has( options.data, "behavior") && _.has( options.data.behavior, "auto_cycle") ) ? options.data.behavior.auto_cycle : this.defaults.auto_cycle;
			options.data.behavior.interval = ( _.has( options.data, "behavior") && _.has( options.data.behavior, "interval") ) ? options.data.behavior.interval : this.defaults.interval;
			options.data.behavior.pause_on_hover = ( _.has( options.data, "behavior") && _.has( options.data.behavior, "pause_on_hover") ) ? ((options.data.behavior.pause_on_hover) ? "hover" : false ): this.defaults.pause_on_hover;
			options.data.behavior.wrap = ( _.has( options.data, "behavior") && _.has( options.data.behavior, "wrap") ) ? options.data.behavior.wrap : this.defaults.wrap;
			Marionette.LayoutView.prototype.constructor.apply(this, arguments);

			_.bindAll( this, "onAfterSlide", "onBeforeSlide", "loadSlide");
		},


		onRender: function() {
			this.getRegion('indicator_container').show(new IndicatorCollectionView(this.options));
			this.getRegion('slide_container').show(new SlideCollectionView(this.options));
			this.loadSlide(0);
		},

		onShow: function () {
			if (this.options.data.behavior.auto_cycle) {
				this.startCarousel();
			}
			this.onShowCarousel(this.$el);
		},

		onDestroy: function(){
			if (this.isCycling) {
				this.pauseCarousel();
			}
		},

		events: {
			"click #carousel_play_button": "startCarousel",
			"click #carousel_pause_button": "pauseCarousel",
			"slide.binf.carousel": "onBeforeSlide",  	// Executes just before the slide transitions into the stage.
			"slid.binf.carousel": "onAfterSlide"		// Executes right after the slide has transitioned onto the stage.
		},

		onBeforeSlide: function (event) {
		},

		onAfterSlide: function ( event ){
		},

		startCarousel: function () {
			this.isCycling = true;
			this.$el.binf_carousel({
				interval: this.options.data.behavior.interval,
				pause: this.options.data.behavior.pause_on_hover,
				wrap: this.options.data.behavior.wrap
			});
		},

		pauseCarousel: function () {
			this.isCycling = false;
			this.$el.binf_carousel('pause');
		},

		onShowCarousel: function (parentEl) {
		},

		loadSlide: function (index) {
		}
		
	});

	return CarouselContentView;

});