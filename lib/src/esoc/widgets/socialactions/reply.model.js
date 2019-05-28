/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
  'esoc/widgets/socialactions/reply/server.adaptor.mixin'
], function ($, Backbone, ExpandableMixin, ResourceMixin, UploadableMixin,
    IncludingAdditionalResourcesMixin, ServerAdaptorMixin) {
  var Reply = Backbone.Model.extend({
    defaults: {
      id: 0,
      data_id: 0,
      created_at: "-",
      text: "-",
      feed_event_type: 0,
      user: {
        name: "-",
        screen_name: "-" /* TODO: for now just giving user display name, need to provide more details here like user profile image,.... */,
        profile_image_url: "-"
      },
      noMoreData: true,
      actions: {},
      extended_info: {}
    },
    constructor: function Reply(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeResource(options)
          .makeIncludingAdditionalResources(options)
          .makeUploadable(options)
          .makeExpandable(options)
          .makeServerAdaptor(options);

    },
    isNew: function () {
      return this.id === 0;
    }
  });

  IncludingAdditionalResourcesMixin.mixin(Reply.prototype);
  ExpandableMixin.mixin(Reply.prototype);
  UploadableMixin.mixin(Reply.prototype);
  ResourceMixin.mixin(Reply.prototype);
  ServerAdaptorMixin.mixin(Reply.prototype);

  return Reply;
});