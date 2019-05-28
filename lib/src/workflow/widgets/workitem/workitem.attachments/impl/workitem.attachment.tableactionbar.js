/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/models/nodes',
  'csui/utils/commandhelper',
  'csui/utils/commands/properties'
], function (Backbone, TableActionBarView, NodeCollection, CommandHelper, PropertiesCommand) {
  'use strict';

  var WorkItemAttachmentActionbar = TableActionBarView.extend({
    onChildviewToolitemAction: function (toolItemView, args) {

      var signature = args.toolItem.get("signature");
      var promisesFromCommands;
      var command = this.commands.findWhere({signature: signature});

      var status = {
        nodes: new NodeCollection([this.model]),
        container: this.container,
        collection: this.containerCollection,
        originatingView: this.originatingView, // use the workitem view as originating view, so that the full view is replaced.
        context: this.options.context
      };
      Backbone.trigger('closeToggleAction');
      if (signature === "Properties") {
        this.originatingView.collection.propertiesAction = true;
        this.propertiesCommand = new PropertiesCommand();
        promisesFromCommands = this.propertiesCommand.execute(status);

      } else {
        promisesFromCommands = command.execute(status);
      }
      CommandHelper.handleExecutionResults(promisesFromCommands,
          {command: command, suppressSuccessMessage: status.suppressSuccessMessage});
    }

  });

  return WorkItemAttachmentActionbar;

});
