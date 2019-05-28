/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette','csui/lib/backbone', // 3rd party libraries
    'csui/controls/tile/behaviors/perfect.scrolling.behavior',
    'webreports/utils/contexts/factories/carousel.collection.factory',
    'i18n!webreports/controls/carousel/impl/nls/carousel.lang',
    'css!webreports/controls/carousel/impl/carousel'
], function (_, $, Marionette, Backbone, PerfectScrollingBehavior, CarouselCollectionFactory, lang) {

    var CarouselIndicatorItemView = Marionette.ItemView.extend({
        template: false,

        tagName: "li",
        attributes: function () {
            return {
                "data-binf-target": "#carousel-main-data-container",
                "data-binf-slide-to": this.model.collection.indexOf( this.model )
            };
        },
        className: function () {

            var activeClass = ( this.model.collection.indexOf( this.model) === 0 )? 'binf-active' : '';

            return activeClass;
        }

    });

    return CarouselIndicatorItemView;

});
