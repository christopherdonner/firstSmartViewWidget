/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'module',
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/utils/contexts/factories/factory',
    'csui/utils/contexts/factories/connector',
    'webreports/models/widget.carousel/folder.collection'
], function (module,_, Backbone, CollectionFactory, ConnectorFactory, CarouselFolderCollection) {

    var CarouselFolderCollectionFactory = CollectionFactory.extend({
        propertyPrefix: 'carousel',

        constructor: function CarouselFolderCollectionFactory(context, options) {
            CollectionFactory.prototype.constructor.apply(this, arguments);
            var connector = context.getObject(ConnectorFactory, options);
            options.connector = connector;
            var carousel = this.options.carousel || {};

            if (!(carousel instanceof Backbone.Collection)) {
                var config = module.config();
                carousel = new CarouselFolderCollection(carousel.models, _.extend({
                    connector: connector}, carousel.attributes, config.options, {
                    autoreset: true
                }));
            }
            this.property = carousel;
        },

        fetch: function (options) {
            return this.property.fetch(options);
        }

    });

    return CarouselFolderCollectionFactory;

});
