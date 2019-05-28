/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/lib/backbone'
], function (_, Backbone) {

    var OverlayModel = Backbone.Model.extend({

        defaults: {
            vis_type: '',
            active_column: '',
            active_column_formatted: '',
            count_column: '',
            column_names: [],
            column_names_formatted: [],
            sort_by: 'Count',
            sort_order: 'desc',
            view_value_as_percentage: false,
            group_after: 10,
            fc_filters: []
        },
        constructor: function OverlayModel(attributes, options) {
            Backbone.Model.prototype.constructor.apply(this, arguments);

        }

    });

    return OverlayModel;

});
