/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
  'csui/models/authenticated.user/server.adaptor.mixin'
], function (Backbone, ExpandableMixin, ResourceMixin,
    IncludingAdditionalResourcesMixin, ServerAdaptorMixin) {
  'use strict';

  var AuthenticatedUserModel = Backbone.Model.extend({
    constructor: function AuthenticatedUserModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options)
          .makeIncludingAdditionalResources(options)
          .makeExpandable(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    }
  });

  IncludingAdditionalResourcesMixin.mixin(AuthenticatedUserModel.prototype);
  ExpandableMixin.mixin(AuthenticatedUserModel.prototype);
  ResourceMixin.mixin(AuthenticatedUserModel.prototype);
  ServerAdaptorMixin.mixin(AuthenticatedUserModel.prototype);

  return AuthenticatedUserModel;
});
