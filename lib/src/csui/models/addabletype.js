/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/backbone", "csui/utils/log"
], function (module, Backbone, log) {

  var AddableTypeModel = Backbone.Model.extend({

    constructor: function AddableTypeModel() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    parse: function (response) {

      return response;
    }

  });
  AddableTypeModel.version = '1.0';
  AddableTypeModel.Hidden = -1;

  return AddableTypeModel;

});
