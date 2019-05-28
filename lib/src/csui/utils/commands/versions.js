/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/models/commands',
  'csui/utils/commands/versions/delete',
  'csui/utils/commands/versions/download',
  'csui/utils/commands/versions/open',
  'csui/utils/commands/versions/properties',
  'csui-ext!csui/utils/commands/versions'
], function (_, CommandCollection,
    VersionDeleteCommand,
    VersionDownloadCommand,
    VersionOpenCommand,
    VersionPropertiesCommand,
    extraCommands) {
  'use strict';
  
  var commands = new CommandCollection([
    new VersionDeleteCommand(),
    new VersionDownloadCommand(),
    new VersionOpenCommand(),
    new VersionPropertiesCommand()
  ]);
  
  if (extraCommands) {
    commands.add(
        _.chain(extraCommands)
            .flatten(true)
            .map(function (Command) {
              return new Command();
            })
            .value()
    );
  }

  return commands;

});
