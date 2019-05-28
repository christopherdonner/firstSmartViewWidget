/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/widgets/metadata/property.panels/general/metadata.general.property.controller',
  'csui-ext!csui/widgets/metadata/metadata.property.panels'
], function (_, Backbone, MetadataGeneralPropertyController, extraPropertyPanels) {

  var MetadataPropertyPanelModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      controller: null,
      controllerOptions: null
    },

    constructor: function MetadataPropertyPanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var MetadataPropertyPanelCollection = Backbone.Collection.extend({

    model: MetadataPropertyPanelModel,
    comparator: "sequence",

    constructor: function MetadataPropertyPanelCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var metadataPropertyPanels = new MetadataPropertyPanelCollection([
    {
      sequence: 10,
      controller: MetadataGeneralPropertyController
    }
  ]);

  if (extraPropertyPanels) {
    extraPropertyPanels = _.flatten(extraPropertyPanels, true);
    _.each(extraPropertyPanels, function () {
      var sequence = extraPropertyPanels.sequence;
      if (sequence < 10 || sequence > 100) {
        throw new Error('Sequence must be greater or equal to 10 and less or equal to 100.');
      }
    });
    metadataPropertyPanels.add(extraPropertyPanels);
  }

  return metadataPropertyPanels;

});
