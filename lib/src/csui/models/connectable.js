/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function ConnectableModel(ParentModel) {
    var prototype = {

      makeConnectable: function (options) {
        options && options.connector && options.connector.assignTo(this);
        options && options.connector && this.original && options.connector.assignTo(this.original);
        return this;
      },

      _prepareModel: function (attrs, options) {
        options || (options = {});
        options.connector = this.connector;
        return ParentModel.prototype._prepareModel.call(this, attrs, options);
      }

    };
    prototype.Connectable = _.clone(prototype);

    return prototype;
  }

  return ConnectableModel;

});
