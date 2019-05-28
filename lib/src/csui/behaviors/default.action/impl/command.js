/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/commands', 'csui/controls/globalmessage/globalmessage', 
  'csui/utils/commandhelper'
], function ( _, $, Backbone, commands, GlobalMessage, CommandHelper) {
  'use strict';

  function CommandController(options) {
    options || (options = {});
    this.commands = options.commands || commands;
  }

  _.extend(CommandController.prototype, {

    executeAction: function (action, status, options) {
      var signature = action.get("signature"),
          command = this.commands.findWhere({signature: signature});

      if (!command) {
        throw new Error('Invalid command: ' + signature);
      }

      var promises = command.execute(status, options);
      if (!_.isArray(promises)) {
        promises = [promises];
      }
      return $.when
          .apply($, promises)
          .fail(function (error) {
            if (error) {
              if(!CommandHelper.showOfflineMessage(error)) {
                GlobalMessage.showMessage('error', error.message);
              }
            }
          });
    }
  });

  CommandController.extend = Backbone.View.extend;

  return CommandController;

});
