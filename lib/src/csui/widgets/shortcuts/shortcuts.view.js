/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  "csui/lib/underscore",
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/behaviors/keyboard.navigation/tabable.region.behavior",
  "csui/widgets/shortcuts/impl/shortcut/shortcut.view",
  "hbs!csui/widgets/shortcuts/impl/shortcuts",
  "css!csui/widgets/shortcuts/impl/shortcuts"
], function (
  _,
  $,
  Backbone,
  Marionette,
  TabableRegionBehavior,
  MiniShortcutView,
  shortcutsTemplate) {
  
  'use strict';

  var THEME_SUFFIX = ["shade1", "shade2", "shade3", "shade4"];
  var ShortcutsView = Marionette.LayoutView.extend({
  
    constructor: function ShortcutsView(options) {
      options || (options = {});
      options.data || (options.data = {shortcutItems:[]});
    
      Marionette.LayoutView.prototype.constructor.call(this, options);
    
      this._setupItems();
      this._currentShortcutIndex = 0;
    },
  
    _setupItems: function() {
      var self = this;
      self._items = _.map(_.first(this.options.data.shortcutItems, 4), function(item, index, arr) {
        var theme = self._getShortcutTheme(index, arr.length);
        var layout;
        
        if (self.options.data.shortcutItems.length === 1) {
          layout = "large";
        }
        else if (self.options.data.shortcutItems.length === 2) {
          layout = "medium";
        }
        else {
          layout = "small";
        }

        return {
          id: (item.id || item.lauchButtonID),
          type: item.type,
          layout: layout,
          shortcutView: self._getShortcutView((item.id || item.launchButtonID), item.type, self.options.context, layout, theme)
        };
      });
    },

    tagName: 'div',

    className: "csui-shortcut-container tile",

    regions: {
      "shortcut0": ".shortcut-region-0",
      "shortcut1": ".shortcut-region-1",
      "shortcut2": ".shortcut-region-2",
      "shortcut3": ".shortcut-region-3"
    },

    _getShortcutTheme: function(itemIndex, numberOfItems) {
      var theme = this.options.data.shortcutTheme ? this.options.data.shortcutTheme : "csui-shortcut-theme-grey";
      if (numberOfItems > 1) {
        itemIndex += (4 - numberOfItems);
        theme += "-" + THEME_SUFFIX[itemIndex];
      }

      return theme;
    },

    _getShortcutView: function(id, type, context, layout, theme) {
      return new MiniShortcutView({
        data: {
          id: id,
          type: type,
          theme: theme,
          layout: layout
        },
        context: context
      });
    },

    template: shortcutsTemplate,

    templateHelpers: function() {
      return {
        items: this._items
      };
    },

    onRender: function () {
      var self = this;

      this.$el.attr('role', 'menu');

      _.each(this._items, function(item, index) {
        self.getRegion("shortcut" + index).show(item.shortcutView);
      });
    },
    
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function() {
      return this._items[this._currentShortcutIndex].shortcutView.$el;
    },

    onKeyInView: function(event) {
      if (event.keyCode === 38) {
        this._selectPreviousShortcut();
      }
      else if (event.keyCode === 40) {
        this._selectNextShortcut();
      }
      else if (event.keyCode === 32 || event.keyCode === 13) {
        this.currentlyFocusedElement().click();
      }
    },
    
    _selectNextShortcut: function() {
      var index = Math.min(this._currentShortcutIndex + 1, this._items.length - 1);
      this._selectShortcut(index);
    },
    
    _selectPreviousShortcut: function() {
      var index = Math.max(this._currentShortcutIndex - 1, 0);
      this._selectShortcut(index);
    },
    
    _selectShortcut: function(index) {
      if (index !== this._currentShortcutIndex) {
        this._currentShortcutIndex = index;
        this.trigger('changed:focus', this);
        this.currentlyFocusedElement().focus();
      }
    }
    
  });
  
  return ShortcutsView;

});
