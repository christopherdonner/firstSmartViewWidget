/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/behaviors/keyboard.navigation/tabable.region.behavior',
], function ($, TabableRegionBehavior) {
  'use strict';

  var KeyNavigation = {

    currentlyFocusedElement: function (shiftTab) {
      shiftTab = typeof shiftTab === 'object' ? shiftTab.shiftKey : shiftTab;
      var focusables = this.$('button[tabindex=-1]');
      if (focusables.length) {
        focusables.prop('tabindex', 0);
        this.$('.circle_delete').prop('tabindex', 0);
      }

      if (shiftTab) {
        return this.$('[tabindex]:visible').last();
      } else {
        return this.$('[tabindex]:visible').first();
      }
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode,
          target  = $(event.target),
          retVal  = false;

      switch (keyCode) {
      case 39:
      case 37:
        if (target.hasClass('cs-input')) {
          return true;
        }
        this.navigateLeftRight(keyCode);
        break;
      case 38:
      case 40:
        this.navigateUpDown(keyCode);
        break;
      default:
        retVal = true;
      }
      return retVal;
    },

    navigateUpDown: function (keyCode) {
      var activeElement    = this.focusedElement,
          classMatches     = activeElement.hasClass('btn-version') ? '.btn-version' :
                             (activeElement.hasClass('btn-rename') ||
                              activeElement.hasClass('btn-undo')) ? '.btn-rename, .btn-undo' :
                             '.circle_delete',
          collectionLength = this.collection.length,
          nextIndex, i, nextChild, nextItem;
      if (keyCode === 38 && this.activeChildIndex > 0) {
        for (i = this.activeChildIndex - 1; i >= 0; i--) {
          nextChild = this.children.findByIndex(i);
          nextItem = nextChild.$(classMatches);
          if (nextItem.length > 0) {
            nextIndex = i;
            break;
          }
        }
      }
      else if (keyCode === 40 && this.activeChildIndex < collectionLength - 1) {
        for (i = this.activeChildIndex + 1; i < collectionLength; i++) {
          nextChild = this.children.findByIndex(i);
          nextItem = nextChild.$(classMatches);
          if (nextItem.length > 0) {
            nextIndex = i;
            break;
          }
        }
      }

      if (nextIndex !== undefined) {
        this.$('.csui-focus').removeClass('csui-focus');
        $(this.children.findByIndex(nextIndex).$(classMatches)).focus();
      }
    },

    navigateLeftRight: function (keyCode) {
      var tabItems    = this.activeChildView.$('[tabindex=0]'),
          activeIndex = this._getActiveIndex(tabItems),
          nextIndex;

      if (activeIndex !== undefined) {
        if (keyCode === 37 && activeIndex > 0) {
          nextIndex = activeIndex - 1;
        }
        else if (keyCode === 39 && activeIndex < tabItems.length - 1) {
          nextIndex = activeIndex + 1;
        }

        if (nextIndex !== undefined) {
          $(tabItems[nextIndex]).focus();
        }
      }
    },

    onLastTabElement: function (shiftTab) {
      var activeIndex    = this.activeElementIndex === undefined ? 0 : this.activeElementIndex,
          activeListItem = this.children.findByIndex(activeIndex),
          tabItems       = this.$('[tabindex=0]'),
          lastItem       = tabItems.length - 1;

      if (tabItems.length) {
        var focusElement = shiftTab ? tabItems[0] : tabItems[lastItem];
        this.$('.csui-focus').removeClass('csui-focus');
        return $(focusElement).hasClass(TabableRegionBehavior.accessibilityActiveElementClass);
      }

      return true;
    },

    setItemFocus: function (childView, target) {
      this.activeChildView = childView;
      this.$('.csui-focus').removeClass('csui-focus');
      childView.$el.addClass('csui-focus');

      this.focusedElement &&
      this.focusedElement.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
      this.focusedElement = $(target);
      this.focusedElement.addClass(TabableRegionBehavior.accessibilityActiveElementClass);

      this.activeChildIndex = childView.model.index;
    },
    clearTabFocus: function () {
    }
  };

  return KeyNavigation;
});
