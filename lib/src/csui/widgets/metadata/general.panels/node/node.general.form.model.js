/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/models/form',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/widgets/metadata/general.panels/node/server.adaptor.mixin',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function ($, _, FormModel, NodeResourceMixin, ServerAdaptorMixin,
    lang) {
  'use strict';

  var NodeGeneralFormModel = FormModel.extend({
    defaults: {
      id: 'general'
    },

    constructor: function NodeGeneralFormModel(attributes, options) {
      FormModel.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options)
          .makeServerAdaptor(options);
    }
  });

  NodeResourceMixin.mixin(NodeGeneralFormModel.prototype);
  ServerAdaptorMixin.mixin(NodeGeneralFormModel.prototype);

  return NodeGeneralFormModel;
});
