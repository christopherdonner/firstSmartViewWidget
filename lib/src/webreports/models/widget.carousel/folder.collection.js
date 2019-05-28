/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/backbone', // 3rd party libraries
    'webreports/utils/url.webreports',
    'webreports/models/widget.carousel/folder.model',
    'csui/models/mixins/connectable/connectable.mixin'
], function (_, Backbone, UrlWebReports, CarouselFolderModel, ConnectableMixin) {

    var CarouselFolderCollection = Backbone.Collection.extend({
        constructor: function CarouselFolderCollection(models, options) {
            Backbone.Collection.prototype.constructor.apply(this, arguments);

            if (_.isUndefined(options)){
                options = {};
            }
            if (options && options.id && !this.id) {
                this.id = options.id;
            }
            this.options = options;
            this.makeConnectable(options);
        },

        model: CarouselFolderModel,
        url: function () {

            var query = '',
                context = this.options.context || undefined,
                parameters = this.options.parameters || undefined;
            return UrlWebReports.combine(this.connector.connection.url + '/nodes/' + this.id,
                '/nodes?extra=false&commands=default&limit=100&sort=asc_create_date');
        },
        parse: function (response) {
            return response.data;
        }

    });

    ConnectableMixin.mixin(CarouselFolderCollection.prototype);

    return CarouselFolderCollection;

});
