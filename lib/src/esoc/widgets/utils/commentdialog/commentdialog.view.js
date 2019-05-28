/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'esoc/widgets/utils/commentdialog/commentdialog.model',
  'hbs!esoc/widgets/tablecell/impl/tablecell',
  'esoc/widgets/socialactions/commentscollectionwidget',
  'esoc/widgets/common/util',
  'csui/utils/log',
  'csui/utils/url',
  'i18n!esoc/widgets/tablecell/nls/lang',
  'css!esoc/widgets/socialactions/socialactions.css',
  'css!esoc/widgets/tablecell/impl/social.css'
], function ($, _, Handlebars, Marionette, CommentDialogModel,
    CommentDialogTemplate, CommentsCollectionWidget, CommonUtil, Log, Url, Lang) {
  var self = null;
  var CommentDialogView = Marionette.ItemView.extend({
    className: 'esoc-socialactions-wrapper',
    template: CommentDialogTemplate,
    templateHelpers: function () {
      var messages = {
        addComments: Lang.addComments
      }
      var wnd_comments_title = this.model.attributes.wnd_comments > 0 ?
                               this.model.attributes.wnd_comments > 1 ?
                               this.model.attributes.wnd_comments + " " + Lang.commentCount :
                               this.model.attributes.wnd_comments + " " + Lang.oneComment : '';
      return {
        messages: messages,
        wnd_comments_title: wnd_comments_title
      };
    },
    initialize: function (options) {
      this.options = options;
      self = this;
      $(document).bind('keydown click', this.closeCommentDialog);
    },
    events: {
      'click .esoc-socialactions-comment .cs-icon-comment': 'onClickComments'
    },
    log: Log,
    commonUtil: CommonUtil,
    constructor: function CommentDialogView(options) {
      options = options || {};
      if (!options.model) {
        options.model = new CommentDialogModel(undefined, {
          connector: options.connector,
          csid: options.nodeid
        });
        options.model.fetch();
      } else {
        this.updateSocailActions(options.model);
        var wnd_comments_validated = options.model.attributes.wnd_comments > 0 ?
                                     options.model.attributes.wnd_comments > 99 ? '99+' :
                                     options.model.attributes.wnd_comments : '';
        options.model = new CommentDialogModel({
          wnd_comments_validated: wnd_comments_validated,
          wnd_comments: options.model.attributes.wnd_comments,
          socialactions: options.model.attributes.socialactions,
          id: options.model.attributes.id,
          showSocialActions: options.model.attributes.showSocialActions
        }, {
          connector: options.connector,
          csid: options.nodeid
        });

      }
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.model.on('change', this.render, this);
      this.model.on('error', this.errorHandle, this);
    },
    errorHandle: function (model, response) {
      var errText = response.responseJSON ?
                    ( response.responseJSON.errorDetail ? response.responseJSON.errorDetail :
                      response.responseJSON.error) :
                    Lang.defaultErrorMessageCommentsFetch;
      self.log.info("Error Occured :" + errText);
    },
    updateSocailActions: function (nodeModel) {
      var showSocialActions = !!nodeModel.actions.get('comment');
      nodeModel.attributes.showSocialActions = showSocialActions;
      nodeModel.attributes.socialactions = {
        "attachementsEnabled": showSocialActions,
        "chatEnabled": showSocialActions,
        "commentingOpen": showSocialActions,
        "commentsEnabled": showSocialActions,
        "CSID": nodeModel.attributes.id,
        "likesEnabled": showSocialActions,
        "taggingEnabled": showSocialActions,
        "threadingEnabled": showSocialActions,
        "shortcutEnabled": showSocialActions
      };

    },
    onClickComments: function (e) {

      var commentConfig = {
            tablecellwidget: true,
            currentNodeModel: this.model,
            baseElement: this.$el.find(".esoc-socialactions-comment"),
            currentTarget: e.currentTarget,
            socialActionsInstanse: this,
            nodeID: this.options.CSID,
            context: this.options.context
          },
          csId          = commentConfig.nodeID;
      commentConfig.csId = csId;
      var ajaxParams = {
        "url": Url.combine(CommonUtil.getV2Url(this.options.connector.connection.url),
            "nodes", csId),
        "type": "GET",
        "connector": this.options.connector,
        "currentNodeModel": this.model,
        "requestType": "updateCommentCount"
      };
      CommonUtil.updateAjaxCall(ajaxParams);

      var restUrl = Url.combine(this.options.connector.connection.url,
              this.commonUtil.REST_URLS.csGetROI) + "CSID=" + csId;
      var responseData;

      $.ajax(this.options.connector.extendAjaxOptions({
        type: "GET",
        async: false,
        cache: false,
        url: restUrl,
        success: function (response) {
          responseData = JSON.parse(JSON.stringify(response.available_settings));
        },
        error: function () {
          self.log.error("Error while getting available settings");
        }
      }));
      this.model.attributes.socialactions = responseData;
      commentConfig.socialActionsInstanse.options.connector.connection.url = this.options.connector.connection.url;
      var commentsCollectionWidget = new CommentsCollectionWidget(commentConfig);
      commentsCollectionWidget.show();
      document.activeElement.blur();
    }
  });
  return CommentDialogView;
});
