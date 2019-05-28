/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'csui/lib/backbone',
    'csui/models/widget/widget.model',
    'webreports/utils/url.webreports',
    'csui/models/mixins/connectable/connectable.mixin'
], function (_, Backbone, WidgetModel, UrlWebReports, ConnectableMixin) {
    var CarouselWidgetModel = WidgetModel.extend({
        defaults: {
            type: "",
            options: [],
            widget_loaded: false
        }
    });

    return CarouselWidgetModel;

});
