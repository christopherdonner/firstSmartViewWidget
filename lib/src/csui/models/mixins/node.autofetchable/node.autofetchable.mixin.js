/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {
  "use strict";

  var NodeAutoFetchableMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeNodeAutoFetchable: function (options) {
          var autofetchEvent = options && options.autofetchEvent;
          if (autofetchEvent) {
            this._autofetchEvent = options.autofetchEvent;
          }
          var autofetch = options && options.autofetch;
          if (autofetch) {
            this.automateFetch(autofetch);
          }
          return this;
        },

        automateFetch: function (enable) {
          var event = _.result(this, '_autofetchEvent'),
              method = enable ? 'on' : 'off';
          this.autofetch = !!enable;
          this.node[method](event, _.bind(this._fetchAutomatically, this, enable));
        },

        isFetchable: function () {
          return this.node.isFetchableDirectly();
        },

        _autofetchEvent: 'change:id',

        _fetchAutomatically: function (options) {
          this.isFetchable() && this.fetch(_.isObject(options) && options);
        }
      });
    }
  };

  return NodeAutoFetchableMixin;
});
