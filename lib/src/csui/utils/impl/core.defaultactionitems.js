/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/classic.nodes/classic.nodes',
  'csui/utils/smart.nodes/smart.nodes'
], function (classicNodes, smartNodes) {
  'use strict';

  return [
    {
      equals: {type: [144, 736, 2]},
      signature: 'Open',
      sequence: 10
    },
    {
      type: 140,
      signature: 'Navigate',
      sequence: 30
    },
    {
      type: 258,
      signature: 'ExecuteSavedQuery',
      sequence: 30
    },
    {
      signature: 'OpenSpecificClassicPage',
      sequence: 600,
      decides: function (node) {
        return classicNodes.isForced(node);
      }
    },
    {
      signature: 'OpenSpecificNodePerspective',
      sequence: 800,
      decides: function (node) {
        return smartNodes.isSupported(node);
      }
    }
  ];
});
