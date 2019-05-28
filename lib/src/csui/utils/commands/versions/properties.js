/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commands/properties', 'csui/models/version'
], function (PropertiesCommand, VersionModel) {
  'use strict';

  var VersionPropertiesCommand = PropertiesCommand.extend({

    defaults: {
      signature: 'VersionProperties',
      command_key: 'versions_properties',
      scope: 'multiple',
      commands: 'csui/utils/commands/versions'
    },
    
    _getAtLeastOneNode: function (status) {
      if (status.collection && status.nodes.length === 1) {
        return status.collection;
      }
      return status.nodes;
    }

  });

  return VersionPropertiesCommand;

});
