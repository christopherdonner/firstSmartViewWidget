/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/actionitems',
  'csui-ext!csui/utils/versions.default.action.items'
], function (_, ActionItemCollection, extraActions) {
  'use strict';

  var defaultActionItems = new ActionItemCollection([
    {
      type: 144,
      signature: 'VersionOpen',
      sequence: 10
    }
  ]);

  if (extraActions) {
    defaultActionItems.add(_.flatten(extraActions, true));
  }

  return defaultActionItems;

});
