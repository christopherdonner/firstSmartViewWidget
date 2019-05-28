/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/tab.panel/impl/tab.link.dropdown.view',
  'hbs!csui/controls/tab.panel/impl/tab.links.dropdown',
  'csui/controls/tab.panel/behaviors/tab.links.dropdown.keyboard.behavior',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'i18n!csui/controls/tab.panel/impl/nls/lang',
  'css!csui/controls/tab.panel/impl/tab.links.dropdown',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, TabLinkDropDownView, collectionTemplate,
    TabLinksDropdownKeyboardBehavior, DropdownMenuBehavior, lang) {
  "use strict";

  var TabLinkDropDownCollectionView = Marionette.CompositeView.extend({

    className: 'cs-tab-links binf-dropdown tile-nav',

    template: collectionTemplate,
    templateHelpers: function () {
      return {
        single_item: this.collection.length === 1 ? true : false,
        addToolTipContent: lang.showMore,
        btnId: _.uniqueId("cstabBtn")
      };
    },

    childView: TabLinkDropDownView,
    childViewContainer: '>ul',

    ui: {
      toggle: '>.binf-dropdown-toggle',
      menuButton: '>.binf-btn',
      selectedLabel: '>.binf-btn >.cs-label'
    },

    behaviors: {
      TabLinksDropdownKeyboardBehavior: {
        behaviorClass: TabLinksDropdownKeyboardBehavior
      },
      DropdownMenuBehavior: {
        behaviorClass: DropdownMenuBehavior
      }
    },

    constructor: function TabLinkDropDownCollectionView(options) {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.selected = new Backbone.Model();
      var activeTabIndex = options.activeTab && options.activeTab.get("tabIndex");
      if (this.collection && this.collection.length > 0 && activeTabIndex !== undefined &&
          activeTabIndex < this.collection.length) {
        var selectedTabTitle = options.selectedTab && options.selectedTab.get("title");
        if (selectedTabTitle !== undefined &&
            selectedTabTitle === this.collection.at(activeTabIndex).get("title")) {
          this._setSelection(this.collection.at(activeTabIndex));
        } else {
          var matchIndex = -1;
          if (selectedTabTitle !== undefined) {
            for (var i = 0; i < this.collection.length; i++) {
              if (selectedTabTitle === this.collection.at(i).get("title")) {
                matchIndex = i;
              }
            }
          }
          if (matchIndex !== -1) {
            this._setSelection(this.collection.at(matchIndex));
            options.activeTab.set("tabIndex", matchIndex);
          } else {
            this._setSelection(this.collection.at(0));
            options.activeTab.set("tabIndex", 0);
          }
        }
      }
      this.listenTo(this.collection, 'change', this._refreshSelection);
      this.listenTo(this.selected, 'change', this._updateSelection);
    },

    onRender: function () {
      var title = this.selected.get('title');
      this.ui.selectedLabel.text(title);
      this.ui.menuButton.attr('aria-label', title);
      if (this.collection.length !== 1) {
        this.ui.toggle.binf_dropdown();
      }
      var selectedId = this.selected.get('id');
      for (var i = 0; i < this.collection.length; i++) {
        if (selectedId === this.collection.at(i).get("id")) {
          var menuItems = this.$el.find("ul li");
          menuItems.removeClass('binf-active');  //.removeAttr('aria-selected');
          this.$(menuItems.get(i)).addClass('binf-active');  //.attr('aria-selected', 'true');
          break;
        }
      }
    },

    onChildviewClickLink: function (childView) {
      this._setSelection(childView.model);
      this.ui.toggle.binf_dropdown('toggle');
    },

    onChildviewClearActiveTab: function (childView) {
      this.children.each(function (view) {
        if (view.$el.hasClass('binf-active')) {
          view.$el.removeClass('binf-active');
        }
      });
    },

    _setSelection: function (model) {
      this.selected.set(model.pick('id', 'title'));
    },

    _updateSelection: function () {
      var title = this.selected.get('title');
      this.ui.selectedLabel.text(title);
      this.ui.menuButton.attr('aria-label', title);
    },

    _refreshSelection: function (model) {
      if (model.get('id') === this.selected.get('id')) {
        this._setSelection(model);
      }
    }

  });

  return TabLinkDropDownCollectionView;

});
