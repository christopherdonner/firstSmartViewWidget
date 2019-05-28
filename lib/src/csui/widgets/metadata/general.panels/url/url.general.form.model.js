/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore',
  'csui/widgets/metadata/general.panels/node/node.general.form.model',
  'csui/models/specificnodemodel',
  'csui/models/mixins/syncable.from.multiple.sources/syncable.from.multiple.sources.mixin',
  'i18n!csui/widgets/metadata/impl/nls/lang'
], function ($, _, NodeGeneralFormModel, SpecificNodeModel, SyncableMixin, lang) {
  'use strict';

  var UrlGeneralFormModel = NodeGeneralFormModel.extend({

    constructor: function UrlGeneralFormModel(attributes, options) {
      NodeGeneralFormModel.prototype.constructor.apply(this, arguments);
      this.makeSyncableFromMultipleSources(options);
    },

    _mergeSources: function (specificNodeModel, nodeGeneralFormModel) {
      var specProperties    = specificNodeModel[0].forms[0], // for specific node propertie
          generalProperties = nodeGeneralFormModel[0].forms[0]; // for general node properties

      _.extend(generalProperties.data, specProperties.data);
      _.extend(generalProperties.options.fields, specProperties.options.fields);
      _.extend(generalProperties.schema.properties, specProperties.schema.properties);

      generalProperties.options = _.omit(generalProperties.options, 'form');

      this.set(generalProperties);  // fused properties
    },

    sync: function () {
      var specNodeModel        = new SpecificNodeModel(this.node.attributes, {
            connector: this.connector,
            node: this.node,
            context: this.options.context
          }),
          nodeGeneralModel     = new NodeGeneralFormModel(this.node.attributes, {
            connector: this.connector,
            node: this.options.node,
            context: this.options.context
          }),
          specificModelPromise = specNodeModel.fetch(),
          generalModelPromise  = nodeGeneralModel.fetch(),
          options              = {parse: false};
      return this.syncFromMultipleSources(
          [specificModelPromise, generalModelPromise], this._mergeSources, options);
    }
  });

  SyncableMixin.mixin(UrlGeneralFormModel.prototype);
  return UrlGeneralFormModel;

});
