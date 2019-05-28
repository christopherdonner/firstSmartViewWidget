/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define([
  'module',
  'require',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/connector',
  'esoc/widgets/utils/commentdialog/commentdialog.view',
  'csui/utils/contexts/factories/connector'
], function (module, _require, $, Marionette, Connector, CommentDialogView, ConnectorFactory) {
  var CommentsDialog = {
    getCommentButton: function (options) {
      if (!options.connector) {
        options.connector = options.context.getObject(ConnectorFactory);
      }
      $(options.placeholder).ready(function () {
        var contentRegion = new Marionette.Region({
          el: $(options.placeholder)
        });
        var commentDialogView = new CommentDialogView({
          connector: options.connector,
          CSID: options.nodeid,
          baseElement: $(options.placeholder),
          context: options.context
        });
        contentRegion.show(commentDialogView);
      });
    }
  };
  return CommentsDialog;
});
