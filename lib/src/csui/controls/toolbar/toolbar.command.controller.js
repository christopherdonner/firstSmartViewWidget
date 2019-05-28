/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/commandhelper', 'csui/utils/commands'
], function (_, $, Backbone, CommandHelper, commands) {
  'use strict';

  function ToolbarCommandController(options) {
    options || (options = {});
    this.commands = options.commands || commands;
    this.nameAttribute = options.nameAttribute;
  }

  _.extend(ToolbarCommandController.prototype, Backbone.Events, {

    toolitemClicked: function (toolItem, status) {
      var signature = toolItem.get("signature");
      var command = this.commands.findWhere({
        signature: signature
      });

      var addableTypeName = toolItem.get("name");
      var addableType = toolItem.get("type");
      var data = _.extend({}, status.data, toolItem.get('commandData'));
      status = _.defaults({
        toolItem: toolItem,
        data: data
      }, status);

      var eventArgs = {
        status: status,
        commandSignature: signature,
        addableType: addableType,
        addableTypeName: addableTypeName,
        command: command
      };
      this.trigger('before:execute:command', eventArgs);
      Backbone.trigger('closeToggleAction');  // don't copy this to newer code! This is ugly

      var self = this;
      self.commandSignature = signature;
      try {

        var executeOptions = {
          context: status.context,
          addableType: addableType,
          addableTypeName: addableTypeName,
          nameAttribute: self.nameAttribute
        };
        var promiseFromCommand = command.execute(status, executeOptions);

        CommandHelper.handleExecutionResults(
            promiseFromCommand, {
              command: command,
              suppressSuccessMessage: status.forwardToTable || status.suppressSuccessMessage,
              suppressFailMessage: status.suppressFailMessage
            })
            .done(function (nodes) {
              if (nodes && !nodes[0].cancelled) {
                eventArgs.newNodes = nodes;
                self.trigger('after:execute:command', eventArgs);
              }
            })
            .fail(function (error) {
              if (error === undefined) {
                error = {
                  cancelled: true,
                  commandSignature: self.commandSignature
                };
              }
              self.trigger('after:execute:command', error);
            });
      }
      catch (e) {
        self.trigger('after:execute:command', eventArgs);
      }

    }
  });

  ToolbarCommandController.extend = Backbone.View.extend;

  return ToolbarCommandController;
});
