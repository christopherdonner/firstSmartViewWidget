/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/non-emptying.region/non-emptying.region',
], function (module, _, $, Marionette, NonEmptyingRegion) {
  'use strict';

  var TabExtensionsBehavior = Marionette.Behavior.extend({

    constructor: function TabExtensionsBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this.renderExtension);
      this.listenTo(view, 'before:destroy', this.destroyExtension);
      this.listenTo(view, 'dom:refresh', this.refreshTab);
    },

    renderExtension: function () {
      var options                    = this.view.options,
          tabBarExtensionViewClass   = options.tabBarExtensionViewClass,
          tabBarExtensionViewOptions = options.tabBarExtensionViewOptions;
      if (!!tabBarExtensionViewClass) {
        if (typeof (tabBarExtensionViewClass) === "function") {
          this.tabBarExtensionView = new tabBarExtensionViewClass(tabBarExtensionViewOptions);
          this.tabBarExtensionView.$el.addClass("tab-extension");
          this.tabBarExtensionsRegion = new NonEmptyingRegion({
            el: this.view.el,
            prependChild: true
          });
          this.tabBarExtensionsRegion.show(this.tabBarExtensionView);
        }
      }
      this.view._initializeToolbars();
    },

    refreshTab: function () {
      if (!!this.tabBarExtensionsRegion) {
        var currentTabIndex   = this.view.activeTab && this.view.activeTab.get("tabIndex"),
            extensionOnTabBar = true;
        if (!this.view.options.enableExtensionOnFirstTab && currentTabIndex == 0) {
          extensionOnTabBar = false;
        }
        if (extensionOnTabBar) {
          var bufferWidth   = 0.4, // Adding some buffer as outerWidth ignores the decimal part
              extWidth      = this.tabBarExtensionsRegion.currentView.$el.outerWidth(true) +
                              bufferWidth,
              tabLinksWidth = "calc(100% - " + extWidth + "px)";
          this.view.tabLinks.$el.width(tabLinksWidth);
        } else {
          this.view.tabLinks.$el.width("100%");
        }
      }
      this.view._enableToolbarState();
    },

    destroyExtension: function () {
      if (!!this.tabBarExtensionsRegion) {
        this.tabBarExtensionsRegion.empty();
      }
    }
  });

  return TabExtensionsBehavior;

});
