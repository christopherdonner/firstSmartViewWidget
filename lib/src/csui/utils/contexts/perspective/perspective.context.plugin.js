/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/contexts/context.plugin'
], function (ContextPlugin) {
  'use strict';

  var PerspectiveContextPlugin = ContextPlugin.extend({
    onCreate: function () {},
    onClear: function () {},
    onRefresh: function () {},
  });

  return PerspectiveContextPlugin;
});
