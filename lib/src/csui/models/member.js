/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone',
'csui/models/mixins/expandable/expandable.mixin',
'csui/models/mixins/resource/resource.mixin',
'csui/models/mixins/uploadable/uploadable.mixin',
'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
'csui/models/member/server.adaptor.mixin'
], function (Backbone, ExpandableMixin, ResourceMixin,
  UploadableMixin, IncludingAdditionalResourcesMixin, ServerAdaptorMixin) {
    'use strict';

  var MemberModel = Backbone.Model.extend({
    constructor: function MemberModel(attributes, options) {
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

  IncludingAdditionalResourcesMixin.mixin(MemberModel.prototype);
  ExpandableMixin.mixin(MemberModel.prototype);
  UploadableMixin.mixin(MemberModel.prototype);
  ResourceMixin.mixin(MemberModel.prototype);
  ServerAdaptorMixin.mixin(MemberModel.prototype);

  return MemberModel;
});
