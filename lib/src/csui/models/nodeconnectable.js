/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function NodeConnectableModel(ParentModel) {
    var prototype = {

      makeNodeConnectable: function (options) {
        if (options && options.node) {
          this.node = options.node;
          options.node.connector && options.node.connector.assignTo(this);
        }
        return this;
      },

      _prepareModel: function (attrs, options) {
        options.connector = this.node && this.node.connector;
        return ParentModel.prototype._prepareModel.call(this, attrs, options);
      }

    };
    prototype.NodeConnectable = _.clone(prototype);
    
    return prototype;
  }

  return NodeConnectableModel;

});
