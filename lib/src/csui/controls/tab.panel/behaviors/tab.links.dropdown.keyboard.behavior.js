/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette',
  'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin'
], function (module, _, $, log, Marionette, KeyboardBehaviorMixin) {
  'use strict';

  var TabLinksDropdownKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabLinksDropdownKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        self.refreshTabableElements(view, tabPanel);
      });

      KeyboardBehaviorMixin.mixin(view);

      _.extend(view, {

        onKeyInView: function (event) {
          var ret;
          if (this.keyboardBehavior.tabableElements.length === 0) {
            return ret;
          }
          if (event.keyCode === 9) {  // tab
            ret = this._accSetFocusToPreviousOrNextElement(event.shiftKey);
          }
          return ret;
        }
      });

    }, // constructor

    refreshTabableElements: function (view, tabPanel) {
      this.tabableElements = view.$el.find('button:not([disabled])').filter(':visible');
      this.view.currentTabPosition = -1;
      setTimeout(function () {
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }, 50);
    }

  });

  return TabLinksDropdownKeyboardBehavior;

});
