/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/widgets/metadata/impl/metadata.properties.content.view',
  'csui/widgets/metadata/impl/versions/metadata.versions.view',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui-ext!csui/widgets/metadata/metadata.panels'
], function (_, Backbone, MetadataPropertiesContentView,
    MetadataVersionsTableView, lang, extraPanels) {

  var MetadataPanelModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      title: null,
      contentView: null,
      contentViewOptions: null
    },

    constructor: function MetadataPanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var MetadataPanelCollection = Backbone.Collection.extend({

    model: MetadataPanelModel,
    comparator: "sequence",

    constructor: function MetadataPanelCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var metadataPanels = new MetadataPanelCollection([
    {
      title: lang.properties,
      name: 'properties',
      sequence: 10,
      contentView: MetadataPropertiesContentView
    }, {
      title: lang.versions,
      name: 'versions',
      sequence: 20,
      contentView: MetadataVersionsTableView
    }
  ]);

  if (extraPanels) {
    metadataPanels.add(_.flatten(extraPanels, true));
    var counter = 1;
    metadataPanels.forEach(function (model) {
      if (model.get('name') === undefined) {
        model.set('name', 'unnamed_panel' + counter, {silent: true});
        counter++;
      }
    });
  }

  return metadataPanels;

});
