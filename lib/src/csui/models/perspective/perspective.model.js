/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["module", 'csui/lib/underscore', "csui/lib/backbone",
  "csui/models/perspective/server.adaptor.mixin",
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/connectable/connectable.mixin',
  "csui/utils/log", "csui/utils/base"
], function (module, _, Backbone, ServerAdaptorMixin, UploadableMixin, ConnectableMixin, log,
    base) {
  "use strict";

  var config = _.extend({
    idAttribute: null
  }, module.config());

  var PerspectiveModel = Backbone.Model.extend({
    idAttribute: config.idAttribute,

    constructor: function PerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      this.options = _.pick(options, ['connector']);
      this.makeUploadable(options)
          .makeConnectable(options)
          .makeServerAdaptor(options);
    },

    isNew: function () {
      return !this.get('id') || this.get('id') === 0;
    },

    isFetchable: function () {
      return !!this.get('id');
    },

    prepareFormData: function (data, options) {
      return {pData: JSON.stringify(data)};
    }
  });

  UploadableMixin.mixin(PerspectiveModel.prototype);
  ConnectableMixin.mixin(PerspectiveModel.prototype);
  ServerAdaptorMixin.mixin(PerspectiveModel.prototype);

  return PerspectiveModel;

});