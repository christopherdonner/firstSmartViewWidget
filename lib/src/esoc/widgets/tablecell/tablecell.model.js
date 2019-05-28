/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
  'esoc/widgets/tablecell/server.adaptor.mixin'
], function (Backbone, ExpandableMixin, ResourceMixin,
    UploadableMixin, IncludingAdditionalResourcesMixin, ServerAdaptorMixin) {
  'use strict';

  var TableCellModel = Backbone.Model.extend({
    constructor: function TableCellModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options)
          .makeIncludingAdditionalResources(options)
          .makeUploadable(options)
          .makeExpandable(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    }
  });

  IncludingAdditionalResourcesMixin.mixin(TableCellModel.prototype);
  ExpandableMixin.mixin(TableCellModel.prototype);
  UploadableMixin.mixin(TableCellModel.prototype);
  ResourceMixin.mixin(TableCellModel.prototype);
  ServerAdaptorMixin.mixin(TableCellModel.prototype);

  return TableCellModel;
});
