/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin'
], function (_, Backbone, ConnectableMixin, UploadableMixin) {

  var AppliedCategoryModel = Backbone.Model.extend({

    constructor: function AppliedCategoryModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeConnectable(options)
          .makeUploadable(options);
    },

    isNew: function () {
      return !!this.get('category_id');
    },

    parse: function (response, options) {
      var attributes = this.attributes;
      if (attributes.category_id) {
        response.id = attributes.category_id;
        delete attributes.category_id;
      }
      return response;
    }

  });

  UploadableMixin.mixin(AppliedCategoryModel.prototype);
  ConnectableMixin.mixin(AppliedCategoryModel.prototype);

  return AppliedCategoryModel;

});
