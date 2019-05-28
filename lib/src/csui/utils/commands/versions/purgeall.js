/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/models/command'
], function (CommandModel) {
  'use strict';
  
  var PurgeAllVersionsCommand = CommandModel.extend({

    defaults: {
      signature: 'PurgeAllVersions',
      command_key: ['versions_purge_all'],
      name: 'Purge All',
      scope: 'single'
    },
    
    execute: function (status, options) {
      throw new Error('Not implemented');
    }

  });

  return PurgeAllVersionsCommand;

});
