/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log'
], function (module, _, $, log) {
  'use strict';

  var KeyboardBehaviorMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {
        _findNextFocusableElementIndex: function (start, reverseDirection) {
          var tabElemId = start;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength === 0) {
            return -1;
          }

          if (tabElemId < 0 || tabElemId >= elemsLength) {
            return tabElemId;
          }

          var $currentElem = $(this.keyboardBehavior.tabableElements[tabElemId]);
          while (this.closestTabable($currentElem) === false) {
            tabElemId = reverseDirection === true ? tabElemId - 1 : tabElemId + 1;
            if (tabElemId < 0 || tabElemId >= elemsLength) {
              tabElemId = -1;
              break;
            }
            $currentElem = $(this.keyboardBehavior.tabableElements[tabElemId]);
          }
          return tabElemId;
        },
        _findNextValidFocusableElementIndex: function (start, reverseDirection) {
          var tabElemId = this._findNextFocusableElementIndex (start, reverseDirection);
          return tabElemId;
        },
        _setFirstAndLastFocusable: function (event) {
          var tabElemId;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength === 0) {
            return;
          }
          tabElemId = 0;
          tabElemId = this._findNextValidFocusableElementIndex (tabElemId);
          if (tabElemId >= 0 && tabElemId < elemsLength) {
            $(this.keyboardBehavior.tabableElements[tabElemId]).prop('tabindex', '0');
          }
          tabElemId = this.keyboardBehavior.tabableElements.length - 1;
          tabElemId = this._findNextValidFocusableElementIndex (tabElemId, true);
          if (tabElemId >= 0 && tabElemId < elemsLength) {
            $(this.keyboardBehavior.tabableElements[tabElemId]).prop('tabindex', '0');
          }
        },

        currentlyFocusedElement: function (event) {
          return this.currentlyFocusedElementInternal(event);
        },

        currentlyFocusedElementInternal: function (event) {

          this._setFirstAndLastFocusable(event);

          var tabElemId = -1;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength > 0) {
            var reverseDirection = event && event.shiftKey;
            tabElemId = event.elementCursor || (reverseDirection ? elemsLength - 1 : 0);
            if (this.options.tabPanel && this.options.tabPanel.activatingTab) {
              var curPos = this.currentTabPosition;
              if (curPos >= 0 && curPos < elemsLength) {
                tabElemId = curPos;
              }
            }
            tabElemId = this._findNextValidFocusableElementIndex (tabElemId, reverseDirection);
          }

          if (tabElemId >= 0 && tabElemId < elemsLength) {
            this.currentTabPosition = tabElemId;
            var $elem = $(this.keyboardBehavior.tabableElements[tabElemId]);
            this._autoScrollUntilElemIsVisible && this._autoScrollUntilElemIsVisible($elem);
            return $elem;
          } else {
            return undefined;
          }
        },

        _accSetFocusToPreviousOrNextElement: function (previous) {

          var newTabbedElement = -1;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength > 0) {
            if (this.currentTabPosition < 0) {
              newTabbedElement = 0;
            } else {
              if (previous) {
                if (this.currentTabPosition > 0) {
                  newTabbedElement = this.currentTabPosition - 1;
                }
              } else {
                if (this.currentTabPosition < elemsLength - 1) {
                  newTabbedElement = this.currentTabPosition + 1;
                }
              }
              newTabbedElement = this._findNextValidFocusableElementIndex (newTabbedElement,
                  previous);
            }
          }
          if (newTabbedElement >= 0 && newTabbedElement !== this.currentTabPosition) {
            this.currentTabPosition = newTabbedElement;
            return $(this.keyboardBehavior.tabableElements[newTabbedElement]);
          }
          this.currentTabPosition = -1;
          return undefined;
        },

        containTargetElement: function (event) {
          var contain = this.$el.find(event.target).length > 0 ? true : false;
          if (contain) {
            var pos, elem;
            for (pos = 0; pos < this.keyboardBehavior.tabableElements.length; pos++) {
              elem = this.keyboardBehavior.tabableElements[pos];
              if ($(elem).parents('.alpaca-control').find(event.target).length > 0) {
                this.currentTabPosition = pos;
              }
              if (elem.isSameNode && elem.isSameNode(event.target)) {
                this.currentTabPosition = pos;
                break;
              } else if (elem === event.target) {
                this.currentTabPosition = pos;
                break;
              }
            }
          }
          return contain;
        },

        numberOfTabableElements: function (event) {
          return this.keyboardBehavior.tabableElements.length;
        },

        closestTabable: function ($el) {
          var tabable = true;
          var $currentElem = $el;
          var i;
          for (i = 0; i < 10; i++) {
            if ($currentElem &&
                ($currentElem.attr("data-cstabindex") === "-1" || $currentElem.attr("disabled"))) {
              tabable = false;
              break;
            }
            $currentElem = $currentElem.parent();
          }
          return tabable;
        }

      });
    }
  };

  return KeyboardBehaviorMixin;

});
