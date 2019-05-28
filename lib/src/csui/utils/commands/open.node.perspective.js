/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery',
  'csui/models/command', 'csui/utils/commandhelper'
], function (require, $, CommandModel, CommandHelper) {
  'use strict';

  var OpenNodePerspectiveCommand = CommandModel.extend({

    execute: function (status, options) {
      var deferred = $.Deferred();
      require(['csui/utils/contexts/factories/next.node',
      ], function (NextNodeModelFactory) {
        var context = status.context || options && options.context,
            nextNode = context.getModel(NextNodeModelFactory),
            node = CommandHelper.getJustOneNode(status);
        nextNode.set('id', node.get('id'));
        deferred.resolve();
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }

  });

  return OpenNodePerspectiveCommand;

});
