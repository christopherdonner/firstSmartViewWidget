/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
      'require',
      'csui/lib/jquery',
      'csui/lib/underscore',
      'csui/lib/backbone',
      'csui/utils/url',
      'csui/models/mixins/expandable/expandable.mixin',
      'csui/models/mixins/resource/resource.mixin',
      'csui/models/mixins/uploadable/uploadable.mixin',
      'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
      'esoc/model/pulsesettings/server.adaptor.mixin',
      'csui/models/resource',
      'esoc/widgets/common/util'],
    function (module, _require, $, _, Backbone, Url, ExpandableMixin, ResourceMixin,
        UploadableMixin, IncludingAdditionalResourcesMixin, ServerAdaptorMixin,
        ResourceModel, CommonUtil) {
      var PulseSettingsModel = Backbone.Model.extend(_.extend({},
          ResourceModel(Backbone.Model), {
            constructor: function PulseSettingsModel(attributes, options) {
              Backbone.Model.prototype.constructor.apply(this, arguments);
              this.options = options;
              if (options && options.connector) {
                options.connector.assignTo(this);
              }
              this.options.fetched = true;

              this.makeResource(options)
                  .makeIncludingAdditionalResources(options)
                  .makeUploadable(options)
                  .makeExpandable(options)
                  .makeServerAdaptor(options);

            },
            isFetchable: function () {
              return this.options.fetched;
            }
          }));

      IncludingAdditionalResourcesMixin.mixin(PulseSettingsModel.prototype);
      ExpandableMixin.mixin(PulseSettingsModel.prototype);
      UploadableMixin.mixin(PulseSettingsModel.prototype);
      ResourceMixin.mixin(PulseSettingsModel.prototype);
      ServerAdaptorMixin.mixin(PulseSettingsModel.prototype);

      return PulseSettingsModel;
    });