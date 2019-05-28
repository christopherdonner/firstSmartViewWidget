/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/defaultactionitems', 'csui/utils/commands'
], function (_, Marionette, DefaultActionBehavior, defaultActionItems, commands) {
  'use strict';

  var ParentBaseView = Marionette.ItemView.extend({
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    constructor: function ParentBaseView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.listenTo(this, 'cell:node:request', function () {
        if (this.model.actions.length > 0) {
          this.triggerMethod('execute:defaultAction', this.model);
        } else {
          this.model.resetCommands();
          this.model.setCommands(defaultActionItems.getAllCommandSignatures(commands));
          var self = this;
          this.model.fetch().done(function () {
            self.triggerMethod('execute:defaultAction', self.model);
          });
        }
      });
    }
  });

  return ParentBaseView;
});
