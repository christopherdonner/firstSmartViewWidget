/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/actionitems',
  'csui-ext!csui/utils/defaultactionitems'
], function (_, ActionItemCollection, rules) {
  'use strict';

  var defaultActionItems = new ActionItemCollection();

  if (rules) {
    defaultActionItems.add(_.flatten(rules, true));
  }

  return defaultActionItems;
});
