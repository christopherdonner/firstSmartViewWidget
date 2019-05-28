/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/node.autofetchable/node.autofetchable.mixin'
], function (_, NodeConnectableMixin, FetchableMixin, NodeAutoFetchableMixin) {

  var NodeResourceMixin = {

    mixin: function (prototype) {
      NodeConnectableMixin.mixin(prototype);
      FetchableMixin.mixin(prototype);
      NodeAutoFetchableMixin.mixin(prototype);

      return _.extend(prototype, {

        makeNodeResource: function (options) {
          return this.makeNodeConnectable(options)
              .makeFetchable(options)
              .makeNodeAutoFetchable(options);
        }

      });
    }

  };

  return NodeResourceMixin;

});
