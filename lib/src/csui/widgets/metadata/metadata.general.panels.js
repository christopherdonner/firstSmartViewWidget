/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/widgets/metadata/general.panels/document/document.general.form.model',
  'csui/widgets/metadata/general.panels/document/document.general.form.view',
  'csui/widgets/metadata/general.panels/node/node.general.form.model',
  'csui/widgets/metadata/general.panels/node/node.general.form.view',
  'csui/widgets/metadata/general.panels/shortcut/shortcut.general.form.model',
  'csui/widgets/metadata/general.panels/shortcut/shortcut.general.form.view',
  'csui/widgets/metadata/general.panels/url/url.general.form.model',
  'csui/widgets/metadata/general.panels/url/url.general.form.view',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui-ext!csui/widgets/metadata/metadata.general.panels'
], function (_, Backbone,
    DocumentGeneralFormModel, DocumentGeneralFormView,
    NodeGeneralFormModel, NodeGeneralFormView,
    ShortcutGeneralFormModel, ShortcutGeneralFormView,
    UrlGeneralFormModel, UrlGeneralFormView,
    RulesMatchingMixin, extraGeneralPanels) {
  'use strict';

  var MetadataGeneralPanelModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      contentModel: null,
      contentView: null,
      contentViewOptions: null
    },

    constructor: function MetadataGeneralPanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(MetadataGeneralPanelModel.prototype);

  var MetadataGeneralPanelCollection = Backbone.Collection.extend({

    model: MetadataGeneralPanelModel,
    comparator: "sequence",

    constructor: function MetadataGeneralPanelCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByNode: function (node) {
      return this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
    }

  });

  var generalPanels = new MetadataGeneralPanelCollection([
    {
      equals: {type: [144, 749]},
      contentModel: DocumentGeneralFormModel,
      contentView: DocumentGeneralFormView,
      sequence: 100
    },
    {
      equals: {type: [1, 2]},
      contentModel: ShortcutGeneralFormModel,
      contentView: ShortcutGeneralFormView,
      sequence: 100
    },
    {
      equals: {type: 140},
      contentModel: UrlGeneralFormModel,
      contentView: UrlGeneralFormView,
      sequence: 100
    },
    {
      contentModel: NodeGeneralFormModel,
      contentView: NodeGeneralFormView,
      sequence: 10000
    }
  ]);

  if (extraGeneralPanels) {
    generalPanels.add(_.flatten(extraGeneralPanels, true));
  }

  return generalPanels;

});
