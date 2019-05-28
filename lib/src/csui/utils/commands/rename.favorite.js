/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", "csui/lib/underscore", "csui/lib/jquery",
  "csui/models/command", "csui/utils/commandhelper"
], function (require, _, $, CommandModel, CommandHelper) {
  'use strict';

  var RenameFavoriteCommand = CommandModel.extend({

    defaults: {
      signature: "FavoriteRename",
      command_key: ['favorite_rename'],
      scope: "single"
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      require(['csui/controls/table/inlineforms/favorite/favorite.view'
      ], function (inlineFormFavoriteView) {
        var node = status.nodes && status.nodes.length === 1 && status.nodes.at(0);

          node.inlineFormView = inlineFormFavoriteView;
          node.set('csuiInlineFormErrorMessage', 'dummy', {silent: true});
          node.unset('csuiInlineFormErrorMessage');

        deferred.resolve();
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }

  });

  _.extend(RenameFavoriteCommand, {

    version: "1.0"

  });

  return RenameFavoriteCommand;

});
