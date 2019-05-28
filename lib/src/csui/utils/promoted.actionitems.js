/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/actionitems',
  'csui-ext!csui/utils/promoted.actionitems'
], function (_, ActionItemCollection, extraActions) {
  'use strict';

  var promotedActionItems = new ActionItemCollection([
    {
      signature: 'properties',
      sequence: 10
    },
    {
      signature: 'unreserve',
      sequence: 10
    },
    {
      signature: 'permissions',
      sequence: 10
    },
    {
      signature: 'reserve',
      sequence: 10
    },
    {
      signature: 'rename',
      sequence: 10
    },
    {
      signature: 'edit',
      sequence: 10
    },
    {
      signature: 'copy',
      sequence: 10
    },
    {
      signature: 'move',
      sequence: 10
    },
    {
      signature: 'download',
      sequence: 10
    },
    {
      signature: 'comment',
      sequence: 10
    },
    {
      signature: 'open',
      sequence: 10
    },
    {
      signature: 'delete',
      sequence: 10
    },
    {
      signature: 'browse',
      sequence: 10
    },
    {
      signature: 'addversion',
      sequence: 10
    }
  ]);

  if (extraActions) {
    promotedActionItems.add(_.flatten(extraActions, true));
  }

  return promotedActionItems;

});
