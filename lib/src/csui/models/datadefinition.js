/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([ "module", "csui/lib/backbone", "csui/utils/log"
],  function ( module, Backbone, log )
  {
    "use strict";
    var DataDefinitionModel = Backbone.Model.extend({

      constructor: function DataDefinitionModel() {
        Backbone.Model.prototype.constructor.apply(this, arguments);
      },

      idAttribute: null,

      parse: function (response) {
        return response;
      }

    });

    DataDefinitionModel.version = '1.0';

    return DataDefinitionModel;

  });
