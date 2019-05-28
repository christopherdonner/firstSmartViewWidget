/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette'
], function (module, _, $, log, Marionette) {
  'use strict';
  var TabPosition = {
    none: -1,
    header: 0,
    list: 1,
    footer: 2
  };

  var ListViewKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function ListViewKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'show', function () {
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'childview:click:item childview:click:tree:header', function (item) {
        var selIndex = view.selectedIndex;
        var selectedElem = view.getElementByIndex(selIndex);
        selectedElem && selectedElem.prop('tabindex', '-1');
        view.currentTabPosition = TabPosition.list;
        view.selectedIndex = view.collection.indexOf(item.model);
        selectedElem = view.getElementByIndex(view.selectedIndex);
        selectedElem && selectedElem.prop('tabindex', '0');
      });
      this.listenTo(view, 'change:filterValue', function () {
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'before:collection:scroll:fetch', function () {
        view._beforeCollectionScrollFetch();
      });
      this.listenTo(view, 'collection:scroll:fetch', function () {
        view._afterCollectionScrollFetch();
      });

      _.extend(view, {

        _focusHeader: function (event) {
          this.currentTabPosition = TabPosition.header;
          var shiftTab = event && event.shiftKey;
          if (shiftTab) {
            return $(this.ui.searchIcon);
          } else if (this.ui.searchInput.css && this.ui.searchInput.css('display') !== 'none') {
            return $(this.ui.searchInput);
          } else {
            return $(this.ui.searchIcon);
          }
        },

        _focusList: function (event) {
          this.currentTabPosition = TabPosition.list;
          if (this.selectedIndex < 0 || this.selectedIndex > this.collection.length - 1) {
            this.selectedIndex = 0;
          }
          return this.getElementByIndex(this.selectedIndex, event);
        },

        _focusFooter: function () {
          this.currentTabPosition = TabPosition.footer;
          return $(this.ui.tileExpand);
        },

        currentlyFocusedElement: function (event) {
          if (event && event.shiftTab) {
            if (this._footerIsVisible()) {
              return this._focusFooter();
            } else {
              return this._focusList();
            }
          } else {
            if (this._headerIsVisible()) {
              return this._focusHeader();
            } else {
              return this._focusList();
            }
          }
        },

        _footerIsInFocus: function () {
          if (this.currentTabPosition === TabPosition.footer || this.ui.tileExpand.is(":focus")) {
            return true;
          } else {
            return false;
          }
        },

        _footerIsVisible: function () {
          if (!this.ui.tileExpand.css || this.ui.tileExpand.css('display') === 'none' ||
              this.ui.tileExpand.hasClass('binf-hidden')) {
            return false;
          } else {
            return true;
          }
        },

        isMoreActionsDropdownOpen: function () {
          return this.$el.find('.csui-table-cell-name-appendix .csui-table-actionbar' +
                               ' .binf-dropdown-menu').is(':visible') ? true : false;
        },

        _headerIsInFocus: function () {
          if (this.currentTabPosition === TabPosition.header || this.ui.searchIcon.is(":focus") ||
              this.ui.searchInput.is(":focus") || this.ui.clearer.is(":focus")) {
            return true;
          } else {
            return false;
          }
        },

        _headerIsVisible: function () {
          if (!this.ui.searchIcon.css || this.ui.searchIcon.css('display') === 'none' ||
              this.ui.searchIcon.hasClass('binf-hidden')) {
            return false;
          } else {
            return true;
          }
        },

        _beforeCollectionScrollFetch: function () {
          this.selectedIndexInFocus = false;
          if (this.selectedIndex >= 0 && this.selectedIndex < this.collection.length) {
            var $elem = this.getElementByIndex(this.selectedIndex);
            if ($elem && $elem.is(":focus")) {
              $elem.prop('tabindex', '-1');
              this.selectedIndexInFocus = true;
            }
          }
        },

        _afterCollectionScrollFetch: function () {
          if (this.selectedIndexInFocus === true && this.selectedIndex >= 0 &&
              this.selectedIndex < this.collection.length) {
            setTimeout(_.bind(function () {
              var $elem = this.getElementByIndex(this.selectedIndex);
              if ($elem) {
                $elem.prop('tabindex', '0');
                $elem.focus();
              }
            }, this), 100);
          }
        },

        _onKeyInSearchArea: function (event) {
          if (this.ui.searchIcon.is(":focus") || this.ui.clearer.is(":focus")) {
            event.preventDefault();
            event.stopPropagation();
            $(event.target).click();
          } else if (this.ui.searchInput.is(":focus") && event.keyCode === 13) {  // Enter (13)
            event.preventDefault();
            event.stopPropagation();
            this.filterChanged(event);
          }
        },

        _moveTo: function (event, $elem, $preElem) {
          event.preventDefault();
          event.stopPropagation();
          setTimeout(_.bind(function () {
            this.trigger('before:keyboard:change:focus');
            $preElem && $preElem.prop('tabindex', '-1');
            $elem && $elem.prop('tabindex', '0');
            $elem && $elem.focus();
            this.trigger('after:keyboard:change:focus');
          }, this), 50);
        },

        onKeyInView: function (event) {
          if (event.keyCode === 9) {  // tab (9)
            var curPos = this.currentTabPosition;
            if (this._headerIsInFocus() && !this.ui.searchIcon.is(":focus")) {
              return;
            }
            if (this._headerIsInFocus()) {
              curPos = this.currentTabPosition = TabPosition.header;
            }
            if (this._footerIsInFocus()) {
              curPos = this.currentTabPosition = TabPosition.footer;
            }

            if (event.shiftKey) {  // shift tab -> activate previous region
              curPos -= this.collection.length === 0 ? 2 : 1;
            } else {
              curPos += this.collection.length === 0 ? 2 : 1;
            }
            if (curPos === TabPosition.header && !this._headerIsVisible()) {
              curPos -= 1;
            }
            if (curPos === TabPosition.footer && !this._footerIsVisible()) {
              curPos += 1;
            }

            switch (curPos) {
            case TabPosition.header:
              this._moveTo(event, this._focusHeader(event));
              break;
            case TabPosition.list:
              this._moveTo(event, this._focusList());
              break;
            case TabPosition.footer:
              this._moveTo(event, this._focusFooter());
              break;
            default:
              this.currentTabPosition = TabPosition.none;
              break;
            }
          } else if (event.keyCode === 32 || event.keyCode === 13) {  // space (32) or enter (13)
            if (this._headerIsInFocus()) {
              this.currentTabPosition = TabPosition.header;
              this._onKeyInSearchArea(event);
            } else {
              event.preventDefault();
              event.stopPropagation();
              $(event.target).click();
            }
          } else if (event.keyCode === 27) {  // escape (27)
            if (this.isMoreActionsDropdownOpen()) {
              return false;
            } else if (this._headerIsInFocus()) {
              event.preventDefault();
              event.stopPropagation();
              var bIsSearchVisible = this.ui.searchInput.is(":visible");
              if (bIsSearchVisible) {
                this.searchClicked(event);
                setTimeout(_.bind(function () {
                  this.ui.searchIcon.prop('tabindex', '0');
                  this.ui.searchIcon.focus();
                }, this), 250);
              }
            }
          }
        },

        onKeyDown: function (event) {
          if (this._headerIsInFocus() || this._footerIsInFocus()) {
            this.onKeyInView(event);
            return;
          }

          var $preElem;  // get this $preElem before any _select*() method call
          switch (event.which) {
          case 33: // page up (30)
          case 36: // home (36)
            $preElem = this.getElementByIndex(this.selectedIndex);
            this._moveTo(event, this._selectFirst(), $preElem);
            break;
          case 34: // page down (34)
          case 35: // end (35)
            $preElem = this.getElementByIndex(this.selectedIndex);
            this._moveTo(event, this._selectLast(event), $preElem);
            break;
          case 38: // arrow up (38)
            if (this.selectedIndex > 0) {
              $preElem = this.getElementByIndex(this.selectedIndex);
              this._moveTo(event, this._selectPrevious(event), $preElem);
            } else {
              event.preventDefault();
              event.stopPropagation();
            }
            break;
          case 40: // arrow down (40)
            if (this.selectedIndex < this.collection.length - 1) {
              $preElem = this.getElementByIndex(this.selectedIndex);
              this._moveTo(event, this._selectNext(), $preElem);
            } else {
              event.preventDefault();
              event.stopPropagation();
            }
            break;
          default:
            this.onKeyInView(event);
            return; // exit this handler for other keys
          }
        },

        _selectFirst: function () {
          this.selectedIndex = 0;
          return this.getElementByIndex(this.selectedIndex);
        },

        _selectLast: function (event) {
          var focusableItem;
          var currentIndex = this.selectedIndex;
          if (currentIndex < 0 || currentIndex >= this.collection.length) {
            currentIndex = 0;
          }
          var focusableIndex = this.collection.length;
          while (focusableIndex > currentIndex && !focusableItem) {
            focusableIndex--;
            focusableItem = this.getElementByIndex(focusableIndex, event);
          }
          if (focusableItem) {
            this.selectedIndex = focusableIndex;
            return focusableItem;
          }
          return this.getElementByIndex(this.selectedIndex);  // no change of focus
        },

        _selectNext: function () {
          var focusableItem;
          var focusableIndex = this.selectedIndex;
          if (focusableIndex < 0 || focusableIndex >= this.collection.length) {
            focusableIndex = -1;
          }
          while (focusableIndex < this.collection.length - 1 && !focusableItem) {
            focusableIndex++;
            focusableItem = this.getElementByIndex(focusableIndex);
          }
          if (focusableItem) {
            this.selectedIndex = focusableIndex;
            return focusableItem;
          }
          return this.getElementByIndex(this.selectedIndex);  // no change of focus
        },

        _selectPrevious: function (event) {
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.getElementByIndex(this.selectedIndex, event);
        }

      });

    }, // constructor

    refreshTabableElements: function (view) {
      log.debug('ListViewKeyboardBehavior::refreshTabableElements ' + view.constructor.name) &&
      console.log(log.last);
      this.view.currentTabPosition = TabPosition.none;
      this.view.selectedIndex = -1;
    }

  });

  return ListViewKeyboardBehavior;
});
