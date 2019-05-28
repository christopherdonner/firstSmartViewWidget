/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", 'csui/lib/jquery', 'csui/utils/base', 'csui/lib/underscore',
  "i18n!csui/utils/commands/nls/localized.strings",
  "csui/utils/commandhelper", "csui/utils/commands/node",
  'csui/utils/command.error'
], function (require, $, base, _, lang, CommandHelper, NodeCommand, CommandError) {
  'use strict';

  var NonFavoriteCommand = NodeCommand.extend({

    defaults: {
      signature: "NonFavorite",
      command_key: ['nonfavorite', 'NonFavorite'],
      scope: "single",
      verb: lang.CommandVerbFavorite,
      doneVerb: lang.CommandRemovedVerbFavorite
    },
    enabled: function (status, options) {
      if (options && options.data && options.data.useContainer) {
        return status.container && status.container.get('favorite');
      } else {
        var nodes = CommandHelper.getAtLeastOneNode(status);
        return nodes && (nodes.length === 1) && nodes.models[0].get('favorite');
      }
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      var originatingView = status.originatingView;

      require([
        'csui/models/favorite.model',
        'csui/dialogs/modal.alert/modal.alert'
      ], function (FavoriteModel, ModalAlert) {
        var model;
        if (status.data && status.data.useContainer) {
          model = status.container;
        } else {
          model = status.nodes.models[0];
        }
        var modelId = model.get('id');
        var favModel = new FavoriteModel({
              node: model,
              id: modelId,
              selected: false
            },
            {connector: model.connector}
        );
        favModel.removeFromFavorites()
            .done(function (results) {
              model.set('favorite', false);
              originatingView.trigger('fav:change');
              deferred.resolve(results);
            })
          .fail(function (err) {
            deferred.reject(new CommandError(err));
          });

      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }
  });

  return NonFavoriteCommand;

});
