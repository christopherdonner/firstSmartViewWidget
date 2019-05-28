/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/lib/jquery", "csui/utils/commandhelper",
  "csui/models/command"
], function (module, _, $, CommandHelper,
    CommandModel) {
  'use strict';

  var OpenShortlinkCommand = CommandModel.extend({

    defaults: {
      signature: "OpenShortlink",
      command_key: ['openshortlink', 'OpenShortlink'],
      name: 'OpenShortlink',
      verb: 'OpenShortlink',
      doneVerb: 'OpenShortlink',
      scope: "single"
    },

    execute: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      var deferred = $.Deferred();
      node.set('ActionBarShortcutOpenCommand', true, {silent: true});
      node.unset('ActionBarShortcutOpenCommand');
      deferred.resolve();
      return deferred.promise();

    },

  });

  return OpenShortlinkCommand;

});
