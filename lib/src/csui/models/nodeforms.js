/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/log', 'csui/utils/base',
  'csui/models/forms',
  'csui/models/mixins/node.resource/node.resource.mixin'
], function (module, $, _, Backbone, log, base, FormCollection,
    NodeResourceMixin) {
  'use strict';

  var NodeFormCollection = FormCollection.extend({

    constructor: function NodeFormCollection(models, options) {
      FormCollection.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options);
    },

    parse: function (response) {
      return response.forms;
    }

  });

  NodeResourceMixin.mixin(NodeFormCollection.prototype);

  return NodeFormCollection;

});
