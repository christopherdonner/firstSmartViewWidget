/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log', "csui/utils/base",
  'csui/lib/marionette'
], function (module, _, $, log, base, Marionette) {
  'use strict';

  var TabPanelKeyboardBehavior = Marionette.Behavior.extend({

    constructor: function TabPanelKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      view.keyboardBehavior = this;
      view.currentTabPosition = options.currentTabPosition || 0;
      this.tabableElements = [];

      var self = this;
      this.listenTo(view, 'render', function () {
        self.refreshTabableElements(view);
        view.$el.bind('tab:content:render', function () {
          self.refreshTabableElements(view);
        });
      });
      this.listenTo(view, 'activate:tab', function (tabContent, tabPane, tabLink) {
        var tabLinkHref = tabLink && tabLink.$el.find('>a')[0];
        if (tabLinkHref) {
          var event = {target: tabLinkHref};
          var tabLinks = this.tabableElements[this.tabLinksIndex];
          if (tabLinks && tabLinks.containTargetElement && tabLinks.containTargetElement(event)) {
            var tabContents = this.tabableElements[this.tabContentIndex];
            if (tabContents && tabContents.options.searchTabContentForTabableElements !== true) {
              var $elem = $(tabLinks.keyboardBehavior.tabableElements[tabLinks.currentTabPosition]);
              setTimeout(_.bind(function () {
                this.view._focusOnElement($elem);
              }, this), 500);
            }
          }
        }
      });

      _.extend(view, {
        _checkAndRefreshTabableElements: function (event) {
          if (this.keyboardBehavior.tabableElements.length > 0) {
            var tabLinks = this.keyboardBehavior.tabableElements[this.keyboardBehavior.tabLinksIndex];
            if (tabLinks.numberOfTabableElements && tabLinks.numberOfTabableElements(event) === 0) {
              tabLinks.keyboardBehavior.refreshTabableElements(tabLinks);
            }
          }
        },
        _setFirstAndLastFocusable: function (event) {
          if (this.keyboardBehavior.tabableElements.length > 0) {
            var elem = this.keyboardBehavior.tabableElements[0];
            elem && elem._setFirstAndLastFocusable && elem._setFirstAndLastFocusable(event);
            var lastElemIndex = this.keyboardBehavior.tabableElements.length - 1;
            elem = this.keyboardBehavior.tabableElements[lastElemIndex];
            elem && elem._setFirstAndLastFocusable && elem._setFirstAndLastFocusable(event);
          }
        },

        currentlyFocusedElement: function (event) {

          var e = _.extend(
              {activeTabLink: this.activeTabLink, activeTabContent: this.activeTabContent},
              event);

          this._checkAndRefreshTabableElements(e);
          this._setFirstAndLastFocusable(e);

          var $focusElem;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          if (elemsLength > 0) {
            var curPos = this.currentTabPosition;
            if (curPos < 0 || curPos > elemsLength - 1) {
              curPos = this.currentTabPosition = e.shiftKey ? elemsLength - 1 : 0;
            }
            e.shiftKey && (curPos = this.currentTabPosition = elemsLength - 1);
            var elem = this.keyboardBehavior.tabableElements[curPos];
            if (elem.currentlyFocusedElement) {
              $focusElem = elem.currentlyFocusedElement(e);
              if ($focusElem !== undefined) {
                $focusElem.prop("tabindex", "0");
                if (this.currentTabPosition === this.tabContentIndex) {
                  self.skipAutoScroll = true;
                  this._focusOnElement($focusElem);
                  self.skipAutoScroll = false;
                }
              }
            }
          }
          return $focusElem;
        },

        accActivateTabableRegion: function (shiftTab) {
          if (shiftTab) {
            this.currentTabPosition = -1;
          }
          var $focusElem = this.currentlyFocusedElement({shiftKey: shiftTab});
          this._focusOnElement($focusElem);
        },

        _focusOnElement: function ($elem) {
          if ($elem && $elem instanceof $) {
            this.tabableRegionBehavior && (this.tabableRegionBehavior.ignoreFocusEvents = true);
            $elem.focus();
            this.tabableRegionBehavior && (this.tabableRegionBehavior.ignoreFocusEvents = false);
          }
        },

        _moveTo: function (event, $elem) {
          event.preventDefault();
          event.stopPropagation();
          var self = this;
          if ($elem.csuiPromise) {
            $elem.csuiPromise.done(function () {
              $elem.prop("tabindex", "0");
              self._focusOnElement($elem);
              setTimeout(function () {
                self.skipAutoScroll = false;
              }, 600);
            });
          } else {
            $elem.prop("tabindex", "0");
            self._focusOnElement($elem);
            setTimeout(function () {
              self.skipAutoScroll = false;
            }, 600);
          }
        },

        onKeyInView: function (event) {
          if (event.keyCode !== 9 && event.keyCode !== 32 && event.keyCode !== 13 &&
              event.keyCode !== 46) {
            return;
          }

          event.activeTabLink = this.activeTabLink;
          event.activeTabContent = this.activeTabContent;

          var elem, $focusingElem;
          var curPos = this.currentTabPosition;
          var elemsLength = this.keyboardBehavior.tabableElements.length;
          var focusPos = 0;
          while (focusPos < elemsLength) {
            elem = this.keyboardBehavior.tabableElements[focusPos];
            if (elem && elem.containTargetElement && elem.containTargetElement(event)) {
              if (elem.numberOfTabableElements() === 0) {
                this.currentTabPosition = -1;
                return;
              }
              break;
            }
            focusPos++;
          }
          if (focusPos >= 0 && focusPos < elemsLength) {
            curPos = this.currentTabPosition = focusPos;
          }
          if (curPos >= 0 && curPos < elemsLength) {
            elem = this.keyboardBehavior.tabableElements[curPos];
            if (elem.onKeyInView) {
              curPos === 0 && (this.skipAutoScroll = true);
              $focusingElem = elem.onKeyInView(event);
              if ($focusingElem !== undefined) {
                this._moveTo(event, $focusingElem);
                return;
              }
            }
          }
          if (event.keyCode === 9) {  // tab
            if (curPos >= 0 && curPos < elemsLength) {

              var newTabbedElement = -1;
              if (event.shiftKey) {  // shift tab -> activate previous region
                if (this.currentTabPosition > 0) {
                  newTabbedElement = this.currentTabPosition - 1;
                }
              } else {
                if (this.currentTabPosition < elemsLength - 1) {
                  newTabbedElement = this.currentTabPosition + 1;
                }
              }
              while (newTabbedElement >= 0 && newTabbedElement < elemsLength) {
                elem = this.keyboardBehavior.tabableElements[newTabbedElement];
                if (elem.currentlyFocusedElement) {
                  $focusingElem = elem.currentlyFocusedElement(event);
                  if ($focusingElem !== undefined) {
                    break;
                  }
                }
                if (event.shiftKey) {  // shift tab -> activate previous region
                  newTabbedElement = newTabbedElement - 1;
                } else {
                  newTabbedElement = newTabbedElement + 1;
                }
              }

              if (newTabbedElement >= 0 && newTabbedElement < elemsLength &&
                  newTabbedElement !== this.currentTabPosition) {
                newTabbedElement === this.tabLinksIndex && (this.skipAutoScroll = true);
                this.currentTabPosition = newTabbedElement;
                this._moveTo(event, $focusingElem);
              } else {
                if (base.isMSBrowser()) {
                  $(event.srcElement).blur();
                } else {
                  $(event.target).blur();
                }
                this.currentTabPosition = -1;
              }
            }
          }
        }
      });

    }, // constructor

    onBeforeDestroy: function () {
      this.view.$el.unbind('tab:content:render');
    },

    refreshTabableElements: function (view) {

      view.tabLinks.triggerMethod('refresh:tabable:elements', view);
      view.tabContent.triggerMethod('refresh:tabable:elements', view);
      this.tabLinksIndex = 0;
      this.tabableElements[this.tabLinksIndex] = view.tabLinks;
      this.tabContentHeaderIndex = -1;
      if (view.tabContentHeader) {
        this.tabContentHeaderIndex = 1;
        this.tabableElements[this.tabContentHeaderIndex] = view.tabContentHeader;
      }
      this.tabContentIndex = view.tabContentHeader ? 2 : 1;
      this.tabableElements[this.tabContentIndex] = view.tabContent;

      this.view.currentTabPosition = -1;
      this.view.triggerMethod("refresh:tabindexes");
    }

  });

  return TabPanelKeyboardBehavior;

});