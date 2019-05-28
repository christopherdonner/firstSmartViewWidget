/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette','csui/lib/backbone', // 3rd party libraries
    'csui/controls/tile/behaviors/perfect.scrolling.behavior',
    'webreports/utils/contexts/factories/carousel.collection.factory',
    'i18n!webreports/controls/carousel/impl/nls/carousel.lang',
    'hbs!webreports/controls/carousel/impl/carousel.slide.item',
    'css!webreports/controls/carousel/impl/carousel'
], function (_, $, Marionette, Backbone, PerfectScrollingBehavior, CarouselCollectionFactory, lang, template) {
	
    var CarouselSlideItemView = Marionette.ItemView.extend({
        
        className: function () {
            var activeClass = ( typeof this.model !== "undefined" && this.model.collection.indexOf( this.model ) === 0 ) ? " binf-active" : "";
            return "binf-item" + activeClass;
        },

        template: template,

        templateHelpers: function () {

            var dataURL = ( typeof this.model !== "undefined"  ) ? this.model.get("id") : "";

            return {
                dataURL:  dataURL,
                index: this._index
                };
        },
        
        onRender: function (){
            if (this._index === this.options.starting_index) {
                this.trigger("starting:slide:added", this.$el );
            }
        }

    });

    return CarouselSlideItemView;

});
