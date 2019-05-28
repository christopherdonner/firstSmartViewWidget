/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {
  "use strict";

  var ConnectableMixin = {

    mixin: function (prototype) {
      var originalPrepareModel = prototype._prepareModel;

      return _.extend(prototype, {

        makeConnectable: function (options) {
          options && options.connector && options.connector.assignTo(this);
          return this;
        },

        _prepareModel: function (attrs, options) {
          options || (options = {});
          if (!options.connector) {
            options.connector = this.connector;
          }
          return originalPrepareModel.call(this, attrs, options);
        }

      });
    }

  };

  return ConnectableMixin;

});
