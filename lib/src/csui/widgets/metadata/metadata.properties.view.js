/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/widgets/metadata/impl/metadata.properties.view',
  'css!csui/widgets/metadata/impl/metadata'
], function (MetadataPropertiesViewImpl) {
  var MetadataPropertiesView = MetadataPropertiesViewImpl.extend({

    constructor: function MetadataPropertiesView(options) {
      MetadataPropertiesViewImpl.prototype.constructor.apply(this, arguments);
    },

    validateForms: function () {
      return MetadataPropertiesViewImpl.prototype.validateForms.apply(this, arguments);
    },

    getFormsValues: function () {
      return MetadataPropertiesViewImpl.prototype.getFormsValues.apply(this, arguments);
    }

  });

  return MetadataPropertiesView;

});
