/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone'
], function (Backbone) {

  var FilteredCountColumnModel = Backbone.Model.extend({

    defaults: {
      "active_column":false,
      "client_format":{
        "type":"none"
      },
      "column_key":"",
      "count_column":false,
      "data_type":10,
      "id": undefined ,
      "name":"",
      "tag_format":""
    },
    constructor: function FilteredCountColumnModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

    }

  });

  return FilteredCountColumnModel;

});
