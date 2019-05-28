/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/jquery', 'csui/utils/commandhelper',
  'csui/models/command',
], function (require, $, CommandHelper, CommandModel) {
  'use strict';

  var ExecuteSavedQueryCommand = CommandModel.extend({
    defaults: {
      signature: 'ExecuteSavedQuery',
      scope: 'single'
    },
    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 258;
    },

    execute: function (status, options) {
      var deferred = $.Deferred(),
          self = this;
      require([
        'csui/utils/contexts/factories/search.query.factory'
      ], function (SearchQueryModelFactory) {
        var node = CommandHelper.getJustOneNode(status),
            context = status.context || options && options.context,
            searchQuery = context.getModel(SearchQueryModelFactory);
        searchQuery.clear({silent: true});
        searchQuery.set('query_id', node.get('id'));
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise();
    }
  });

  return ExecuteSavedQueryCommand;
});
