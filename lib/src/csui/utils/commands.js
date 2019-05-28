/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/commands',
  'csui-ext!csui/utils/commands'
], function (_, CommandCollection, extraCommands) {
  'use strict';

  var commands = new CommandCollection();

  _.extend(commands, {
    signatures: {
      browse: 'Browse',
      open: 'Open',
      download: 'Download',
      add: 'Add',
      navigate: 'Navigate',
      original: 'Original'
    },
    version: '1.0'
  });

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
