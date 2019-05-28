/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/backbone", 'csui/models/node/node.model', "csui/utils/log",
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin'
], function (module, Backbone, NodeModel, log, DelayedCommandableV2Mixin) {

  var Nodes = Backbone.Collection.extend({

    model: NodeModel,

    constructor: function Nodes(models,options) {
      options || (options = {});
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.makeDelayedCommandableV2(options);
    },

    automateFetch: function (enable) {
    }

  });
  DelayedCommandableV2Mixin.mixin(Nodes.prototype);
  Nodes.version = '1.0';

  return Nodes;

});
