/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", "csui/lib/underscore", "csui/lib/jquery",
  "csui/models/command", "csui/utils/commandhelper"
], function (require, _, $, CommandModel, CommandHelper) {
  'use strict';

  var InlineEditCommand = CommandModel.extend({

    defaults: {
      signature: "InlineEdit",
      command_key: ['rename', 'Rename'],
      scope: "single"
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      require(['csui/controls/table/inlineforms/inlineform.factory'
      ], function (inlineFormViewFactory) {
        var node = status.nodes && status.nodes.length === 1 && status.nodes.at(0);

        var inlineFormView = inlineFormViewFactory.getInlineFormView(node.get('type'));
        if (!inlineFormView) {
          inlineFormView = inlineFormViewFactory.getInlineFormView(-1);
        }
        if (inlineFormView) {
          node.inlineFormView = inlineFormView;
          node.set('csuiInlineFormErrorMessage', 'dummy', {silent: true});
          node.unset('csuiInlineFormErrorMessage');
        }

        deferred.resolve();
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }

  });

  _.extend(InlineEditCommand, {

    version: "1.0"

  });

  return InlineEditCommand;

});
