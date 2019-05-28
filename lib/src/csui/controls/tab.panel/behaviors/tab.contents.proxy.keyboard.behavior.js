/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';

  var TabContentProxyKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabContentProxyKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        self.refreshTabableElements(view, tabPanel);
      });

      _.extend(view, {
        _setFirstAndLastFocusable: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView._setFirstAndLastFocusable) {
            event.activeTabContent.childTabPanelView._setFirstAndLastFocusable(event);
          }
        },

        currentlyFocusedElement: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.currentlyFocusedElement) {
            return event.activeTabContent.childTabPanelView.currentlyFocusedElement(event);
          }
          return undefined;
        },

        _accSetFocusToPreviousOrNextElement: function (previous) {
          if (this.tabPanel && this.tabPanel.activeTabContent &&
              this.tabPanel.activeTabContent.childTabPanelView &&
              this.tabPanel.activeTabContent.childTabPanelView._accSetFocusToPreviousOrNextElement) {
            return this.tabPanel.activeTabContent.childTabPanelView._accSetFocusToPreviousOrNextElement(
                previous);
          }
          return undefined;
        },

        containTargetElement: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.containTargetElement) {
            return event.activeTabContent.childTabPanelView.containTargetElement(event);
          }
          return false;
        },

        onKeyInView: function (event) {
          if (event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.onKeyInView) {
            return event.activeTabContent.childTabPanelView.onKeyInView(event);
          }
          return undefined;
        },

        numberOfTabableElements: function (event) {
          if (event && event.activeTabContent && event.activeTabContent.childTabPanelView &&
              event.activeTabContent.childTabPanelView.numberOfTabableElements) {
            return event.activeTabContent.childTabPanelView.numberOfTabableElements(event);
          }
          return 0;
        }

      });
    }, // constructor

    refreshTabableElements: function (view, tabPanel) {

      view.tabPanel = tabPanel;
      if (tabPanel && tabPanel.activeTabContent && tabPanel.activeTabContent.childTabPanelView) {
        var childTabPanel = tabPanel.activeTabContent.childTabPanelView;
        childTabPanel.refreshTabableElements && childTabPanel.refreshTabableElements(childTabPanel);
        var e = {activeTabLink: tabPanel.activeTabLink, activeTabContent: tabPanel.activeTabContent};
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }
    }

  });

  return TabContentProxyKeyboardBehavior;

});
