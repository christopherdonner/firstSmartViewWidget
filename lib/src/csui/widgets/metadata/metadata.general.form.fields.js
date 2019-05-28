/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui-ext!csui/widgets/metadata/metadata.general.form.fields'
], function (_, Backbone, extraGeneralFormFields) {

  var MetadataGeneralFormFieldModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      controller: null,
      controllerOptions: null
    },

    constructor: function MetadataGeneralFormFieldModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var MetadataGeneralFormFieldCollection = Backbone.Collection.extend({

    model: MetadataGeneralFormFieldModel,
    comparator: 'sequence',

    constructor: function MetadataGeneralFormFieldCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var metadataGeneralFormFields = new MetadataGeneralFormFieldCollection();

  if (extraGeneralFormFields) {
    extraGeneralFormFields = _.flatten(extraGeneralFormFields, true);
    _.each(extraGeneralFormFields, function () {
      var sequence = extraGeneralFormFields.sequence;
      if (sequence < 10 || sequence > 100) {
        throw new Error('Sequence must be greater or equal to 10 and less or equal to 100.');
      }
    });
    metadataGeneralFormFields.add(extraGeneralFormFields);
  }

  return metadataGeneralFormFields;

});
