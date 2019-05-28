/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/url', 'csui/models/actions',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/versions/v2.versions.response.mixin',
  'csui/models/server.adaptors/version.mixin',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, log, Url, ActionCollection,
    ExpandableMixin, ResourceMixin, UploadableMixin, VersionsableV2ResponseMixin, ServerAdaptorMixin) {
  'use strict';

  var VersionModel = Backbone.Model.extend({

    idAttribute: 'version_number',

    constructor: function VersionModel(attributes, options) {
      attributes || (attributes = {});
      options = _.extend({expand: ['user', 'versions{id, owner_id}']}, options);

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options)
          .makeUploadable(options)
          .makeVersionableV2Response(options)
          .makeExpandable(options)
          .makeServerAdaptor(options);

      if (!attributes.actions) {
        this.actions = new ActionCollection();
      }
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector,
        expand: _.deepClone(this.expand)
      });
    },

    set: function (key, val, options) {
      var attrs;
      if (key == null) {
        return this;
      }
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});
      if (attrs.actions) {
        if (this.actions) {
          this.actions.reset(attrs.actions, options);
        } else {
          this.actions = new ActionCollection(attrs.actions);
        }
      }
      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    isNew: function () {
      return !this.has('version_number');
    },

    isFetchable: function () {
      return !!(this.get('id') && this.get('version_number'));
    }

  });

  ExpandableMixin.mixin(VersionModel.prototype);
  UploadableMixin.mixin(VersionModel.prototype);
  ResourceMixin.mixin(VersionModel.prototype);
  VersionsableV2ResponseMixin.mixin(VersionModel.prototype);
  ServerAdaptorMixin.mixin(VersionModel.prototype);

  return VersionModel;

});
