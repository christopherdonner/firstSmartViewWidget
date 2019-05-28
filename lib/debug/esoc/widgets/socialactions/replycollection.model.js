csui.define([
  'csui/lib/underscore',
  "csui/lib/jquery",
  "csui/lib/backbone",
  'csui/utils/url',
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/utils/contexts/factories/connector',
  "esoc/widgets/socialactions/reply.model",
  "esoc/widgets/common/util",
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
  'esoc/widgets/socialactions/replycollection/server.adaptor.mixin'
], function (_, $, Backbone, Url, DefaultActionController, ConnectorFactory, ReplyModel, CommonUtil,
    ExpandableMixin, ResourceMixin, UploadableMixin, IncludingAdditionalResourcesMixin, ServerAdaptorMixin) {

  var ReplyCollectionModel = Backbone.Collection.extend({
    defaults: {
      params: {},
      csRESTUrl: ""
    },
    model: ReplyModel,
    thisjQuery: $,
    commonUtil: CommonUtil,
    constructor: function ReplyCollectionModel(options) {
      options.connector = options.connector || options.context.getObject(ConnectorFactory);
      delete this.defaults.params[this.commonUtil.globalConstants.MAX_ID];
      delete this.defaults.params[this.commonUtil.globalConstants.SINCE_ID];
      this.defaults.params = $.extend(this.defaults.params, options.params);
      this.defaults.params.sort_by_nid = true;
      this.getRepliesUrl = options.connector.connection.url;
      this.getRepliesUrl += options.getRepliesUrl;
      this.defaults.csRESTUrl = this.getRepliesUrl;
      this.getRepliesUrl += $.param(this.defaults.params);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }

      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeResource(options)
          .makeIncludingAdditionalResources(options)
          .makeUploadable(options)
          .makeExpandable(options)
          .makeServerAdaptor(options);

    },
    initialize: function () {
    }
  });

  IncludingAdditionalResourcesMixin.mixin(ReplyCollectionModel.prototype);
  ExpandableMixin.mixin(ReplyCollectionModel.prototype);
  UploadableMixin.mixin(ReplyCollectionModel.prototype);
  ResourceMixin.mixin(ReplyCollectionModel.prototype);
  ServerAdaptorMixin.mixin(ReplyCollectionModel.prototype);

  return ReplyCollectionModel;
});