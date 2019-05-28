/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/lib/backbone", "csui/utils/url",
  "csui/utils/log"
], function (module, _, Backbone, Url, log) {

  var ColumnModel = Backbone.Model.extend({

    constructor: function ColumnModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    idAttribute: null,

    parse: function (response) {
      switch (response.column_key) {
      case "name":
        response = _.extend(response, {
          default_action: true,
          contextual_menu: false,
          editable: true,
          filter_key: "name"
        });
        break;
      case "type":
        response = _.extend(response, {
          default_action: true
        });
        break;
      }

      return response;
    }

  });
  ColumnModel.version = '1.0';

  return ColumnModel;

});
