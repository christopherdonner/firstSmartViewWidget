/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/lib/backbone',  // 3rd party libraries
	'csui/lib/binf/js/binf',
	'csui/controls/tile/behaviors/perfect.scrolling.behavior',
	'webreports/controls/carousel/carousel.view',
	'webreports/models/widget.carousel/widget.carousel.model'
], function (_, $, Marionette, Backbone, BINF, PerfectScrollingBehavior, GenericCarousel,  WidgetModel) {

	var CarouselContentView = GenericCarousel.extend({

		activeSlideIndex: 0,  // Index of the slide that's currently on the stage.
		CSUIWidgetCollection: new Backbone.Collection(),
		currentlyLoadingSlideIndex: 0, // Index of the slide that's being loading.
		currentWidgetID: null,
		currentWidgetOptions: null,
		currentWidgetContext: null,
		previousSlideIndex: 0, // Index of the slide that originally loaded and kicked off lazy-loading of the next slide (low-water mark)
		maxSlidesNum: 10,
		allSlidesSynced: false,

		constructor: function CarouselContentView(options) {
			if (_.has(options.data, "widgets") ){
				if (options.data.widgets.length > this.maxSlidesNum){
					options.data.widgets.splice(this.maxSlidesNum);
					console.warn( "The maximum number of widgets allowed in the carousel is " + options.data.widgets.length +".  The additional widgets have been removed from the carousel." );
				}
				_.each( options.data.widgets, function(options, index, list){

					if ( (typeof options.options ) === "string") {
						options.options = JSON.parse(options.options);
					}
					if ( options.type.slice( 0, options.type.indexOf("/")).toLowerCase() !== "webreports" || options.type === "webreports/widgets/carousel") {
						list.splice(index, 1);
						console.warn( "The "+ options.type +" widget is not supported in the carousel.  It has been removed." );
					}
				});

			} else {
				options.data.widgets = [];
			}
			_.extend( options, { collection: new Backbone.Collection(options.data.widgets) });
			GenericCarousel.prototype.constructor.apply(this, arguments);

			_.bindAll( this, "onAfterSlide", "onBeforeSlide", "loadSlide", "loadWidget", "fetchWidget", "postWidgetLoad");
		},

		events: {
			"slide.binf.carousel": "onBeforeSlide",
			"slid.binf.carousel": "onAfterSlide",
			"click ol.binf-carousel-indicators > li" : "onIndicatorClick"
		},
		onBeforeSlide: function (event) {
			var index =  $( event.relatedTarget).index();

			this.loadSlide( index );
		},

		onAfterSlide: function (event) {
			var index =  $( event.relatedTarget).index(),
				region = this.regionManager.get("slide" + index),
				currentWidget = this.collection.at(index);
			if ( _.has(region, "currentView") && _.has(region.currentView, "contentView") && currentWidget.get("type").indexOf("visual.data") !== -1 && (!region.isChartRenderedInCarousel)) {
				region.currentView.contentView.isChartRendered = false;
				region.currentView.contentView.triggerMethod("dom:refresh");
				region.isChartRenderedInCarousel = true;  // flag so this only runs the first time the slide transitions onto the stage
				this.bindChartExpandedViewEvents(region.currentView);
			}
		},

		onIndicatorClick: function (event) {

			if ( !(this.allSlidesSynced)) {
				console.warn("Carousel controls are disabled until all slides are fully loaded");
				event.preventDefault();
				return false;
			}

		},

		onShowCarousel: function (parentEl) {

			var allSlides = parentEl.find(".carousel-slides-container .binf-carousel-inner").children();

			if ( this.options.data.widgets.length > 0 ) {
				for (var i = 0; i < allSlides.length; i++) {
					this.regionManager.addRegion( "slide" + i, new Marionette.Region({
						el: allSlides[i]
					}));
				}

			} else {
				console.warn("The carousel is empty, please add some widgets");
				this.pauseCarousel();
			}
			if (this.options.data.behavior.auto_cycle && this.isCycling ) {
				this.pauseCarousel();
			}
			this.regionManager.get('indicator_container').$el.find("li").addClass("carousel-content-loading");

		},

		onDomRefresh: function(){
			var firstSlideView,
				firstSlideRegion = this.regionManager.get("slide0"),
				currentWidget = this.collection.at(0);

			if (_.has(firstSlideRegion, "currentView") && currentWidget.get("type").indexOf("visual.data") !== -1 ){

				firstSlideView = firstSlideRegion.currentView;

				if (_.has(firstSlideView, "contentView") && (!firstSlideView.contentView.isChartRendered)){
					firstSlideView.contentView.triggerMethod("dom:refresh");
					firstSlideRegion.isChartRenderedInCarousel = true;
					this.bindChartExpandedViewEvents(firstSlideView );
				}
			}

		},
		bindChartExpandedViewEvents: function( view ){
			view.$el.find(".icon-tileExpand,.tile-header").on("click", {view: view, carouselView: this}, function(e){
				e.data.carouselView.onExpandWidget();
				var waitForCollapseIcon = setInterval( function() {
						if ( $('.icon-tileCollapse').length > 0) {
							$('.icon-tileCollapse').on("click", {view: e.data.view, carouselView: e.data.carouselView}, function(e){
								e.data.view.contentView.triggerMethod("dom:refresh");
								e.data.carouselView.onCollapseWidget();

							});
							clearInterval(waitForCollapseIcon);
						}
					}, 150);
			});

		},

		loadSlide: function (index) {

			var widgetPath,
				slideModel,
				slideCollection = this.regionManager.get("slide_container").currentView.collection;
			this.previousSlideIndex = this.currentlyLoadingSlideIndex;
			this.currentlyLoadingSlideIndex = index;
			if ( !_.isUndefined( slideCollection )) {

				slideModel = slideCollection.at(index);

				if ( !_.isUndefined( slideModel )) {
					if ( !slideModel.get("widget_loaded") ){

                        widgetPath = slideModel.get("type");
						this.currentWidgetOptions = slideModel.get("options"); // passed when constructing the widget View later on
						this.currentWidgetID = widgetPath;

						this.loadWidget(widgetPath).done(this.fetchWidget);
						
					} else {
						this.postWidgetLoad();
					}
				}
			}
		},
		loadWidget: function (id) {

			var widgetModel;

			widgetModel = new WidgetModel(
				{
					id: id
				},
				{
					includeView: true,
					includeManifest: false,
					includeServerModule: false,
					includeToolItems: false
				});

			this.CSUIWidgetCollection.add(widgetModel);

			return widgetModel.fetch(); // This can take some time if the widget has a lot of collateral (views/templates/controls/etc)
		},
		fetchWidget: function () {

			var key,
				view,
				childWidgetDataObject,
				newFactories,
				newFactoryKeys,
				filteredFactories = {},
				originalFactories = _.clone(this.options.context._factories),
				originalWidgetOptions = this.collection.at(this.currentlyLoadingSlideIndex).get("options"),
				region = this.regionManager.get("slide" + this.currentlyLoadingSlideIndex),
				widgetModel = this.CSUIWidgetCollection.get(this.currentWidgetID),
				WidgetView = widgetModel.get('view');
			view = new WidgetView({
				context: this.options.context,
				data: originalWidgetOptions
			});
			if (_.has( view, "behaviors") && _.has( view.behaviors, "ExpandableList")){
				this.listenTo(view, "expand", this.onExpandWidget);
				this.listenTo(view, "collapse", this.onCollapseWidget);

			}
			if ( _.has(view, "model")){
				childWidgetDataObject = view.model;
			} else if (_.has(view, "collection")){
				childWidgetDataObject = view.collection;
			} else if ( _.has(view, "contentView") ) {
				this.listenTo( view, "render", _.bind( this.onChildContentViewRender, this, view, this.currentlyLoadingSlideIndex) );
			}
			if (typeof childWidgetDataObject !== "undefined"){
				this.listenTo( childWidgetDataObject, "sync", _.bind( this.onChildSync, this, view, this.currentlyLoadingSlideIndex ) );
			}
			region.show(view);
			if ( (_.isEmpty( originalFactories)) ) {
				filteredFactories = view.options.context._factories;

			} else {
				newFactories = this.options.context._factories;
				newFactoryKeys = _.keys(newFactories);

				for ( var i=0; i<newFactoryKeys.length; i++ ) {
					if ( !(newFactoryKeys[i] in originalFactories ) ){
						filteredFactories[newFactoryKeys[i]] = newFactories[newFactoryKeys[i]];
					}
				}
			}
			for ( key in filteredFactories ){
				if ( _.isFunction(filteredFactories[key].fetch ) ) {
					filteredFactories[key].fetch( _.extend( _.clone( originalWidgetOptions ) ) );
				}
			}

			this.postWidgetLoad();

		},
		postWidgetLoad: function() {

			var nextWidgetModel,
				isLastSlide = ( this.collection.length === (this.currentlyLoadingSlideIndex + 1) ),
				currentWidget = this.collection.at(this.currentlyLoadingSlideIndex);

			if (this.currentlyLoadingSlideIndex === 0){
                this._restoreIndicators("li.binf-active");
			}
			if (!currentWidget.get("widget_loaded")) {
				currentWidget.set("widget_loaded", true);
			}
			if (!isLastSlide){

				nextWidgetModel = this.collection.at( this.currentlyLoadingSlideIndex + 1 );
				if ( nextWidgetModel.get("widget_loaded") !== true ) {
					this.loadSlide( this.currentlyLoadingSlideIndex + 1 );
				}

			}
		},

		_restoreIndicators: function(selector) {
			if (selector) {
                this.regionManager.get('indicator_container').$el.find(selector).animate({
                    "height": "16px",
                    "margin-bottom": "0px"
                }).removeClass("carousel-content-loading");
			}
		},
		onChildContentViewRender: function(view, index) {

			var childWidgetDataObject,
				childView;

			if ( _.has(view, "contentView" ) ){

				childView = view.contentView;

				if (_.has(childView, "collection")){
					childWidgetDataObject = childView.collection;
				} else if ( _.has(childView, "model")) {
					childWidgetDataObject = childView.model;
				}
			}
			if (typeof childWidgetDataObject !== "undefined") {
				this.listenTo(childWidgetDataObject, "sync", _.bind(this.onChildSync, this, view, index));
			}
		},

		onChildSync: function(view, index) {

			var syncCheck,
				requestedWidget = this.collection.at(index),
				widgetType = requestedWidget.get("type");
			requestedWidget.set("widget_synced", true);
			if ( widgetType.indexOf("visual.data") !== -1 ) {

				if (_.has(view, "contentView" ) && _.has(view.contentView, "collection") ) {
					this.stopListening( view.contentView.collection, "sync");
				}

			}
			if (widgetType.indexOf("nodeslistreport") !== -1 ) {
				this.listenTo(view,"change:filterValue", _.bind(this.onChildFilterValueChange, this, view) );
			}
			syncCheck = this.collection.where({"widget_synced": true});

			if (syncCheck.length === this.collection.length) {
				this.onAllSlidesSynced();
			}

		},

		onAllSlidesSynced: function() {
			if (this.options.data.behavior.auto_cycle) {
				this.startCarousel();
			}
            this._restoreIndicators("li:not('.binf-active')");
			this.allSlidesSynced = true;
		},
		onChildFilterValueChange: function(view) {
			if ( view.ui.searchInput.val() === "" ) {
				this.onCollapseWidget();
			} else {
				this.onExpandWidget();
			}
		},

		onExpandWidget: function() {
			if (this.isCycling) {
				this.pauseCarousel();
			}
		},

		onCollapseWidget: function() {
			if ( (!this.isCycling) && this.options.data.behavior.auto_cycle ){
				this.startCarousel();
			}
		}

	});

	return CarouselContentView;

});