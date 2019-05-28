/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui-ext!csui/widgets/metadata/metadata.general.action.fields'
], function (_, Backbone, generalActionFields) {

  var MetadataGeneralActionFieldModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      controller: null,
      controllerOptions: null
    },

    constructor: function MetadataGeneralActionFieldModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var MetadataGeneralActionFieldCollection = Backbone.Collection.extend({

    model: MetadataGeneralActionFieldModel,
    comparator: 'sequence',

    constructor: function MetadataGeneralActionFieldCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var metadataGeneralActionFields = new MetadataGeneralActionFieldCollection();

    if (generalActionFields) {
        generalActionFields = _.flatten(generalActionFields, true);
        _.each(generalActionFields, function () {
            var sequence = generalActionFields.sequence;
            if (sequence < 10 || sequence > 100) {
                throw new Error('Sequence must be greater or equal to 10 and less or equal to 100.');
            }
        });
        metadataGeneralActionFields.add(generalActionFields);
    }


  return metadataGeneralActionFields;

});
