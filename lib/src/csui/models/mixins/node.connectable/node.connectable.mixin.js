/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {
  "use strict";

  var NodeConnectableMixin = {

    mixin: function (prototype) {
      var originalPrepareModel = prototype._prepareModel;

      return _.extend(prototype, {

        makeNodeConnectable: function (options) {
          if (options && options.node) {
            this.node = options.node;
            options.node.connector && options.node.connector.assignTo(this);
          }
          return this;
        },

        _prepareModel: function (attrs, options) {
          options || (options = {});
          var node = options.node || this.node;
          options.connector = node && node.connector;
          return originalPrepareModel.call(this, attrs, options);
        }

      });
    }

  };

  return NodeConnectableMixin;

});
