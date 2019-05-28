/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function NodeAutoFetchableModel(ParentModel) {
    var prototype = {

      makeNodeAutoFetchable: function (options) {
        options && options.autofetch && this.automateFetch(options.autofetch);
        return this;
      },

      automateFetch: function (enable) {
        this.node[enable ? 'on' : 'off'](_.result(this, '_autofetchEvent'),
          _.bind(this._fetchAutomatically, this, enable));
      },

      isFetchable: function () {
        return this.node.isFetchableDirectly();
      },

      _autofetchEvent: 'change:id',

      _fetchAutomatically: function (options) {
        this.isFetchable() && this.fetch(_.isObject(options) && options);
      }

    };
    prototype.NodeAutoFetchable = _.clone(prototype);
    
    return prototype;
  }

  return NodeAutoFetchableModel;

});
