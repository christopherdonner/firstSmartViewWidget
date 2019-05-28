/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette',
  'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin'
], function (module, _, $, log, Marionette, KeyboardBehaviorMixin) {
  'use strict';

  var TabContentKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabContentKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        this.alreadyRefreshedTabableElements = false;
        self.refreshTabableElements(view);
      });
      this.listenTo(view, 'render', function () {
        view.children && view.children.each(function (child) {
          child.content && self.listenTo(child.content, 'render', function () {
            this.alreadyRefreshedTabableElements = false;
            self.refreshTabableElements(view);
          });
        });
        view.$el.bind('tab:content:field:changed', function () {
          this.alreadyRefreshedTabableElements = false;
          if (this.keyboardAction) {
            self.refreshTabableElementsAndSetFocus(view);
          } else {
            self.refreshTabableElements(view);
          }
          this.keyboardAction = false;
        });
      });

      KeyboardBehaviorMixin.mixin(view);

      _.extend(view, {

        onKeyInView: function (event) {
          var ret;
          if (this.keyboardBehavior.alreadyRefreshedTabableElements !== true) {
            this.keyboardBehavior.refreshTabableElements(this);
          }
          if (this.keyboardBehavior.tabableElements.length === 0) {
            return ret;
          }
          var elem, elemsLength, focusPos;
          elemsLength = this.keyboardBehavior.tabableElements.length;
          focusPos = 0;
          if (event.keyCode === 9) {  // tab

            while (focusPos < elemsLength) {
              elem = this.keyboardBehavior.tabableElements[focusPos];
              if (elem && $(elem).is(event.target)) {
                break;
              }
              focusPos++;
            }
            if (focusPos >= 0 && focusPos < elemsLength) {
              this.currentTabPosition = focusPos;
            }
            ret = this._accSetFocusToPreviousOrNextElement(event.shiftKey);
          } else if (event.keyCode === 32 || event.keyCode === 13) {
            var $elem = $(this.keyboardBehavior.tabableElements[this.currentTabPosition]);
            if ($elem && $elem.is(':focus') && $elem.hasClass('binf-hidden') === false &&
                $elem.closest('.cs-field-write').length === 0) {
              event.preventDefault();
              event.stopPropagation();
              this.keyboardBehavior.keyboardAction = true;  // triggered by keyboard, not mouse
              $elem.click();
            }

            while (focusPos < elemsLength) {
              elem = this.keyboardBehavior.tabableElements[focusPos];
              if (elem && $(elem).is(event.target)) {
                break;
              }
              focusPos++;
            }
            var foundFocusable = focusPos >= 0 && focusPos < elemsLength;
            if (foundFocusable) {
              this.currentTabPosition = focusPos;
            }

            $elem = this._accSetFocusToPreviousOrNextElement(event.shiftKey);
            if ($elem !== undefined) {
              $elem.prop("tabindex", "0");
            }

            if (!!event.activeTabContent && !!event.activeTabContent.alpaca &&
                event.activeTabContent.alpaca.data.type === 140 && foundFocusable) {
              var urlelem = this.keyboardBehavior.tabableElements[focusPos];
              urlelem.click();

            }

          }
          return ret;
        }

      });
    }, // constructor

    onBeforeDestroy: function () {
      this.view.$el.unbind('tab:content:field:changed');
    },

    refreshTabableElements: function (view) {
      this.tabableElements = view.options.searchTabContentForTabableElements ?
                             view.$el.find(view.options.tabContentAccSelectors).filter(':visible') :
          [];
      var i;
      for (i = this.tabableElements.length - 1; i >= 0; i--) {
        if (view.closestTabable && view.closestTabable($(this.tabableElements[i])) === false) {
          this.tabableElements.splice(i, 1);
        }
      }
      this.view.currentTabPosition = -1;
      this.alreadyRefreshedTabableElements = true;
      setTimeout(function () {
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }, 50);
    },

    refreshTabableElementsAndSetFocus: function (view) {
      var currentTabPos = this.view.currentTabPosition;
      this.refreshTabableElements(view);
      $(this.tabableElements[currentTabPos]).prop("tabindex", "0");
      $(this.tabableElements[currentTabPos]).focus();
      this.view.currentTabPosition = currentTabPos;
    },

    updateCurrentTabPosition: function () {
      var i;
      for (i = 0; i < this.tabableElements.length; i++) {
        if ($(this.tabableElements[i]).is(':focus')) {
          this.view.currentTabPosition = i;
          break;
        }
      }
    }

  });

  return TabContentKeyboardBehavior;

});
