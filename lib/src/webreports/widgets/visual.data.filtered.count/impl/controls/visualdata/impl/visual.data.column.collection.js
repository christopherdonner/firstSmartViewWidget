/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/backbone', // 3rd party libraries
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data.column.model'
], function (Backbone, FilteredCountColumnModel) {

    var FilteredCountColumnCollection = Backbone.Collection.extend({
        constructor: function FilteredCountColumnCollection(models, options) {
            Backbone.Collection.prototype.constructor.apply(this, arguments);

        },

        model: FilteredCountColumnModel

    });

    return FilteredCountColumnCollection;

});
