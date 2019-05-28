/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/toolbar.state.behavior',
], function (ToolbarView, ToolbarStateBehavior) {
  'use strict';

  var DelayedToolbarView = ToolbarView.extend({

    behaviors: {

      ToolbarState: {
        behaviorClass: ToolbarStateBehavior,
        delayedActions: function () {
          return this.options.delayedActions;
        }
      }

    },

    constructor: function DelayedToolbarView(options) {
      ToolbarView.prototype.constructor.apply(this, arguments);
    }

  });

  return DelayedToolbarView;

});
