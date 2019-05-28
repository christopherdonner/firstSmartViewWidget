/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/backbone", "csui/utils/log", "csui/utils/base"],
function (module, Backbone, log, base) {

    var TableModel = Backbone.Model.extend({

        constructor: function TableModel(options) {
            Backbone.Model.prototype.constructor.apply(this);
            options.connector.assignTo(this);
            this.datasource = options.datasource;
        },
        
        urlRoot: function () {
            var newURL = new base.Url(this.connector.connection.url).getCgiScript(true);
            if(this.datasource.indexOf('/') !== 0){
            	newURL += '/';
            }
            
            return new base.Url(newURL + this.datasource);
        }                

    });

    TableModel.version = '1.0';

    return TableModel;
});
