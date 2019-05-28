/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", 'csui/lib/marionette', 'csui/lib/jquery',
  'csui/lib/underscore', 'csui/utils/commandhelper', 'csui/utils/commands/node',
  'csui/utils/command.error', 'csui/utils/url', 'i18n!esoc/commands/nls/lang'
], function (require, Marionette, $, _, CommandHelper, NodeCommand, CommandError, Url, lang) {
  'use strict';

  var CommentCommand = NodeCommand.extend({

    constructor: function CommentCommand(attributes, options) {
      NodeCommand.prototype.constructor.call(this, arguments);
      var self = this;
      require(
          ['esoc/widgets/utils/command/comment/comment.toolitem.view'],
          function (CommentToolItemView) {
            self.customView = CommentToolItemView;
          });
    },

    defaults: {
      signature: "Comment",
      command_key: ['comment', 'Comment'],
      scope: "single",
      name: lang.name,
      verb: lang.verb,
      doneVerb: lang.doneVerb
    },
    enabled: function (status) {
      var nodeModel;
      if (status && status.data) {
        nodeModel = status.data.useContainer ? status.container :
                    CommandHelper.getJustOneNode(status);
        if (!!nodeModel) {
          if (status.toolItem) {
            status.toolItem.set({
              commandData: _.defaults({
                wnd_comments: nodeModel.get('wnd_comments'),
                id: nodeModel.get('id'),
                customView: this.customView
              }, status.toolItem.get('commandData'))
            });
          }
        }
      } else {
        nodeModel = CommandHelper.getJustOneNode(status);
      }
      return nodeModel && !!nodeModel.actions.get('comment');
    },

    execute: function (status, options) {
      var self      = this,
          nodeModel = (status.data && status.data.useContainer) ?
                      status.container :
                      CommandHelper.getJustOneNode(status),
          deferred  = $.Deferred();
      require(['esoc/widgets/socialactions/commentscollectionwidget', 'esoc/widgets/common/util'],
          function (CommentsCollectionWidget, CommonUtil) {
            var config        = (typeof window.require !== "undefined") ?
                                window.require.s.contexts._.config :
                                window.csui.require.s.contexts._.config,
                commentConfig = _.extend(config, {
                  tablecellwidget: true,
                  currentNodeModel: nodeModel,
                  nodeID: nodeModel.get('id'),
                  CSID: nodeModel.get('id'),
                  context: status.context,
                  baseElement: status.toolItemView.$el,
                  connector: nodeModel.connector,
                  currentTarget: document.activeElement
                }),
                restUrl       = Url.combine(nodeModel.connector.connection.url,
                        CommonUtil.REST_URLS.csGetROI) + "CSID=" + commentConfig.CSID,
                responseData;

            $.ajax(nodeModel.connector.extendAjaxOptions({
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
            nodeModel.attributes.socialactions = responseData;
            commentConfig.socialActions = responseData;
            commentConfig.baseElement.dataset = {value: nodeModel.get('id')};
            var commentsCollectionWidget = new CommentsCollectionWidget(commentConfig);
            commentsCollectionWidget.show();

            deferred.resolve();
          }, function (error) {
            deferred.reject(new CommandError(error));
          });
    }
  });

  return CommentCommand;

});
