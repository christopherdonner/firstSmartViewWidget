/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/backbone", "csui/utils/log", "csui/utils/base"],
function (module, Backbone, log, base) {

    var SearchResultsModel = Backbone.Model.extend({

        constructor: function SearchResultsModel(options) {
            Backbone.Model.prototype.constructor.apply(this);
            options.connector.assignTo(this);
        },

        clone: function () {
            return new this.constructor(this.attributes, {
                connector: this.connector
            });
        },

        urlRoot: function () {
            var path = "search";
            return base.Url.combine(this.connector.connection.url, path);
        }

    });

    SearchResultsModel.version = '1.0';

    return SearchResultsModel;
});
