/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/tab.panel/behaviors/common.keyboard.behavior.mixin'
], function (module, _, $, log, Marionette, base, KeyboardBehaviorMixin) {
  'use strict';

  var TabLinksKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabLinksKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'refresh:tabable:elements', function (tabPanel) {
        self.refreshTabableElements(view, tabPanel);
      });

      KeyboardBehaviorMixin.mixin(view);

      _.extend(view, {
        _setFirstAndLastFocusable: function (event) {
          if (this.keyboardBehavior.tabableElements.length > 0) {
            var $elem = $(this.keyboardBehavior.tabableElements[0]).prop('tabindex', '0');
            var lastElemIndex = this.keyboardBehavior.tabableElements.length - 1;
            if ($elem.is('a')) {
              $elem = $(this.keyboardBehavior.tabableElements[lastElemIndex]);
              $elem.prop('tabindex', '0');
              while (!$elem.is('a') && lastElemIndex > 0) {
                lastElemIndex--;
                $elem = $(this.keyboardBehavior.tabableElements[lastElemIndex]);
              }
              $elem.prop('tabindex', '0');
            }
          }
        },
        _autoScrollUntilElemIsVisible: function ($elem) {
          var $tabLink = $elem;
          if ($tabLink && $tabLink.hasClass('cs-delete-icon')) {
            $tabLink = $elem.parent().parent().find('.cs-tablink');
          }

          if ($tabLink && $tabLink.is('a') && $tabLink.hasClass('cs-tablink')) {
            var tabPanel = this.options && this.options.tabPanel;
            var tabID = $tabLink.attr('href');
            tabID[0] === '#' && (tabID = tabID.substr(1));
            if (tabPanel && tabPanel._isTablinkVisibleInParents($tabLink) === false) {
              var tabIndex = tabPanel._findTabIndexByID ? tabPanel._findTabIndexByID(tabID) : -1;
              if (tabIndex >= 0) {
                var deferred = $.Deferred();
                tabPanel.skipAutoScroll = true;  // unset this after the deferred is done
                $tabLink.csuiPromise = deferred.promise();
                var options = {animationOff: true};
                tabPanel._autoScrollTabTo && tabPanel._autoScrollTabTo(tabIndex, options)
                    .done(function () {
                      tabPanel.skipAutoScroll = false;
                      deferred.resolve();
                    });
              }
            }
          }
        },

        onKeyInView: function (event) {
          var ret;
          if (this.keyboardBehavior.tabableElements.length === 0) {
            return ret;
          }

          this.keyboardBehavior.keyboardActionDeleteTabPosition = undefined;
          var self = this;
          var _focusOnTabContent = function (e) {
            var hrefElem = self.keyboardBehavior.tabableElements[self.currentTabPosition];
            var $hrefElem = hrefElem && $(hrefElem);
            if ($hrefElem && $hrefElem.is(":focus")) {
              e.preventDefault();
              e.stopPropagation();
              var tabPanel = self.options && self.options.tabPanel;
              tabPanel && (tabPanel.skipAutoScroll = true);
              if ($hrefElem.hasClass('cs-delete-icon')) {
                self.keyboardBehavior.keyboardActionDeleteTabPosition = self.currentTabPosition - 2;
              }
              $hrefElem.click();
              if (self.keyboardBehavior.keyboardActionDeleteTabPosition === undefined) {
                setTimeout(function () {
                  var href = $hrefElem.attr('href');
                  var focusEvent = $.Event('tab:content:focus', {tabId: href});
                  self.$el.trigger(focusEvent);
                  tabPanel && (tabPanel.skipAutoScroll = false);
                }, 100);
              }
            }
          };

          if (event.keyCode === 9) {  // tab

            var leftScroll = event.shiftKey;
            var $elem = this._accSetFocusToPreviousOrNextElement(leftScroll);
            this._autoScrollUntilElemIsVisible($elem);

            ret = $elem;
          } else if (event.keyCode === 32 || event.keyCode === 13) {
            _focusOnTabContent.call(this, event);
          } else if (event.keyCode === 46) {
            var hrefElem = this.keyboardBehavior.tabableElements[this.currentTabPosition];
            if (hrefElem && $(hrefElem).is(":focus")) {
              event.preventDefault();
              event.stopPropagation();
              this.keyboardBehavior.keyboardActionDeleteTabPosition = this.currentTabPosition - 1;
              var href = $(hrefElem).attr('href');
              var deleteEvent = $.Event('tab:link:delete', {tabId: href});
              this.$el.trigger(deleteEvent);
            }
          }
          return ret;
        }
      });

    }, // constructor

    refreshTabableElements: function (view, tabPanel) {
      this.tabableElements = view.$el.find('a[href], *[tabindex], *[data-cstabindex]');
      var i;
      for (i = this.tabableElements.length - 1; i >= 0; i--) {
        if ($(this.tabableElements[i]).attr('data-cstabindex') === '-1') {
          this.tabableElements.splice(i, 1);
        }
      }

      this.view.currentTabPosition = -1;
      if (this.keyboardActionDeleteTabPosition !== undefined) {
        var $elem = $(this.tabableElements[this.keyboardActionDeleteTabPosition]);
        if ($elem && $elem.length > 0) {
          this.view.currentTabPosition = this.keyboardActionDeleteTabPosition;
          this.view._autoScrollUntilElemIsVisible($elem);
          $elem.focus();
        }
        this.keyboardActionDeleteTabPosition = undefined;
      }

      setTimeout(function () {
        view._setFirstAndLastFocusable && view._setFirstAndLastFocusable();
      }, 50);
    }

  });

  return TabLinksKeyboardBehavior;

});
