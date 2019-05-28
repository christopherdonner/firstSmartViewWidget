/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url', 'csui/models/node/node.model',
  'csui/models/server.adaptors/favorite2.mixin', 'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, NodeModel, ServerAdaptorMixin) {
  'use strict';

  var Favorite2Model = NodeModel.extend({

    mustRefreshAfterPut: false,

    idAttribute: 'id',

    constructor: function Favorite2Model(attributes, options) {
      NodeModel.prototype.constructor.apply(this, arguments);
      this.makeServerAdaptor(options);
    }
  });

  ServerAdaptorMixin.mixin(Favorite2Model.prototype);

  return Favorite2Model;
});
