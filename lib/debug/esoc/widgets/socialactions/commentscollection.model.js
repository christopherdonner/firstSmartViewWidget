csui.define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/underscore",
  "csui/utils/base",
  'csui/utils/url',
  'csui/utils/namedsessionstorage',
  'csui/behaviors/default.action/impl/defaultaction',
  "esoc/widgets/socialactions/comment.model",
  "esoc/widgets/socialactions/util",
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
  'esoc/widgets/socialactions/commentscollection/server.adaptor.mixin',
  'i18n!esoc/widgets/socialactions/nls/lang'
], function ($, Backbone, _, Base, Url, NamedSessionStorage, DefaultActionController, CommentModel,
    Util, ExpandableMixin, ResourceMixin,
    UploadableMixin, IncludingAdditionalResourcesMixin, ServerAdaptorMixin, Lang) {

  var CommentsCollectionModel = Backbone.Collection.extend({
    defaults: {
      params: {
        data_id: "",
        commands: "default"
      },

      csRESTUrl: ""
    },
    model: CommentModel,
    util: Util,
    namedSessionStorage: new NamedSessionStorage(Util.commonUtil.globalConstants.ESOCIAL_USER_INFO),
    getCommentsRESTUrl: "",
    context: "",
    currentNodeModel: undefined,
    constructor: function CommentsCollectionModel(options) {
      delete this.defaults.params[this.util.commonUtil.globalConstants.MAX_ID];
      delete this.defaults.params[this.util.commonUtil.globalConstants.SINCE_ID];
      this.defaults.params = $.extend(this.defaults.params, options.params);
      this.defaults.params.sort_by_nid = true;
      this.defaults.params.data_id = options.nodeID;
      this.getCommentsRESTUrl = options.connector.connection.url;
      this.context = options.context;

      if (options.statusInfo && options.statusInfo.getStatusUrl) {
        this.getCommentsRESTUrl += options.statusInfo.getStatusUrl;
        this.getCommentsRESTUrl = Util.updateQueryStringValues(this.getCommentsRESTUrl,
            "conversation_id", options.statusInfo.conversation_id);
        this.getCommentsRESTUrl = Util.updateQueryStringValues(this.getCommentsRESTUrl, "item_id",
            options.statusInfo.item_id);
      } else {
        this.getCommentsRESTUrl += this.util.commonUtil.REST_URLS.csGetCommentRESTUrl;
      }
      this.defaults.csRESTUrl = this.getCommentsRESTUrl;
      this.getCommentsRESTUrl += $.param(this.defaults.params);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }

      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.currentNodeModel = options.currentNodeModel;

      this.makeResource(options)
          .makeIncludingAdditionalResources(options)
          .makeUploadable(options)
          .makeExpandable(options)
          .makeServerAdaptor(options);

    },
    initialize: function () {
    },
    fetchSuccess: function (collection, response) {
      $(".esoc-social-comment-widget").show();
      $(".esoc-socialactions-widget-arrow-right").length > 0 ?
      $(".esoc-socialactions-widget-arrow-right").show() :
      $(".esoc-socialactions-widget-arrow-left").show();
      Util.setCommentDialogPointer();
    },
    fetchError: function (collection, response) {
      var args = {
        parent: "body",
        errorContent: response.responseJSON ?
                      ( response.responseJSON.errorDetail ? response.responseJSON.errorDetail :
                        response.responseJSON.error) : Lang.defaultErrorMessageCommentsFetch
      };
      Util.commonUtil.openErrorDialog(args);
    }

  });

  IncludingAdditionalResourcesMixin.mixin(CommentsCollectionModel.prototype);
  ExpandableMixin.mixin(CommentsCollectionModel.prototype);
  UploadableMixin.mixin(CommentsCollectionModel.prototype);
  ResourceMixin.mixin(CommentsCollectionModel.prototype);
  ServerAdaptorMixin.mixin(CommentsCollectionModel.prototype);

  return CommentsCollectionModel;
});