/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base'
], function (module, _, $, Marionette, log, base) {
  'use strict';

  log = log(module.id);
  var config = module.config();

  var accessibilityRegionClass = 'csui-acc-tab-region';
  var accessibilityActiveRegionClass = 'csui-acc-tab-region-active';

  var TabablesBehavior = Marionette.Behavior.extend({

        constructor: function TabablesBehavior(options, view) {
          Marionette.Behavior.prototype.constructor.apply(this, arguments);

          var self = this;

          this.view = view;
          this._pushTabableHandler();

          this.tabableRegions = [];
          this.mustSortTabableRegions = false;
          this.listenTo(view, 'render', this._registerEventHandlers);
          this.listenTo(view, 'destroy', this._popTabableHandler);
          this.listenTo(view, 'dom:refresh', this.setFocusInActiveTabableRegion);
          setTimeout(function () {
            view.$el.on('keydown.csui-tabables', function (event) {
              if (event.keyCode === 9 && getOption.call(self, 'containTabFocus')) {
                return self._maintainTabFocus(event);
              }
            });
          });
          this.listenTo(view, 'changed:focus', this._setFocusToNextRegion);
        }, // constructor

        registerTabableRegion: function (tabableRegion) {
          if ($.contains(this.view.el, tabableRegion.view.el)) {
            this.unregisterTabableRegionBehavior(tabableRegion);
            this.tabableRegions.push(tabableRegion);
            this.mustSortTabableRegions = true;
            return true;
          } else {
            log.debug('registerTabableRegion: not registering non descendant view ' +
                      tabableRegion.view.constructor.name) &&
            console.log(log.last);
            return false;
          }
        },

        unregisterTabableRegionBehavior: function (tabableRegion) {
          if (tabableRegion) {
            if (_.contains(this.tabableRegions, tabableRegion)) {
              log.debug('unregisterTabableRegion ' + tabableRegion.view.constructor.name) &&
              console.log(log.last);

              this.tabableRegions = _.reject(this.tabableRegions,
                  function (trb) { return trb === tabableRegion; });

            }
          }
        },

        _pushTabableHandler: function () {
          log.debug('_pushTabableHandler in view ' + this.view.constructor.name) &&
          console.log(log.last);
          if (TabablesBehavior.tabablesHandlers.length > 0) {
            var topTabablesHandler = _.last(TabablesBehavior.tabablesHandlers);
            _.each(topTabablesHandler.tabableRegions, function (tabableRegion) {
              tabableRegion._unregisterEventHandlers.call(tabableRegion);
              topTabablesHandler._clearTabIndexes.call(topTabablesHandler, tabableRegion.view);
            }, this);

          }
          TabablesBehavior.tabablesHandlers.push(this);
        },

        _popTabableHandler: function () {
          if (TabablesBehavior.tabablesHandlers.length > 0) {

            var tabableHandlerToPop = _.last(TabablesBehavior.tabablesHandlers);

            log.debug('_popTabableHandler in view ' + tabableHandlerToPop.view.constructor.name) &&
            console.log(log.last);

            _.each(tabableHandlerToPop.tabableRegions, function (tabableRegion) {
              tabableRegion._unregisterEventHandlers.call(tabableRegion);
            });
            tabableHandlerToPop.view.$el.off('keydown.csui-tabables');

            tabableHandlerToPop.stopListening(tabableHandlerToPop.view);
            TabablesBehavior.tabablesHandlers.pop();
            if (TabablesBehavior.tabablesHandlers.length > 0) {
              var topTabableHandler = _.last(TabablesBehavior.tabablesHandlers);
              _.each(topTabableHandler.tabableRegions, function (tabableRegion) {
                tabableRegion.setInitialTabIndex.call(tabableRegion);
                tabableRegion._registerEventHandlers.call(tabableRegion);
              });

              topTabableHandler._setFocusInActiveTabableRegion();
            }
          }
        },

        _sortTabableRegions: function () {
          var tabableRegions = this.tabableRegions;
          var sortedTabableRegions = [];
          var tabableRegionElements = this.view.$el.find('.' + accessibilityRegionClass);
          tabableRegionElements.each(function (index, el) {
            var trb = _.find(tabableRegions, function (tabableRegion) {
              return tabableRegion.view.el === el;
            });
            if (trb) {
              sortedTabableRegions.push(trb);
            }
          });
          this.tabableRegions = sortedTabableRegions;
          this.mustSortTabableRegions = false;
        },
        _getNextActiveRegion: function (shiftTab, recursiveNavigate) {
          var regions = this.tabableRegions, i, tabableRegion;
          regions = _.filter(regions, function (region) {
            return !region.$el.hasClass('binf-hidden');
          });

          var lastIndex   = regions.length - 1,
              activeIndex = this._getActiveIndex(regions);

          if (recursiveNavigate) {
            i = shiftTab ? (activeIndex === 0 ? lastIndex : activeIndex - 1) :
                (activeIndex === lastIndex ? 0 : activeIndex + 1);
          } else {
            i = shiftTab ? (activeIndex === 0 ? 0 : activeIndex - 1) :
                (activeIndex === lastIndex ? lastIndex : activeIndex + 1);
          }
          if (regions.length === 1) {
            tabableRegion = regions[0];
            return tabableRegion;
          }

          while (i != activeIndex) {
            tabableRegion = regions[i];
            var elToFocus = tabableRegion.getCurrentlyFocusedElementFromView(shiftTab);
            if (tabableRegion.view.isTabable() && elToFocus &&
                base.isVisibleInWindowViewport(elToFocus)) {
              return tabableRegion;
            }

            if (shiftTab) {
              if (i === 0) {
                i = recursiveNavigate ? lastIndex : activeIndex;
              }
              else if (i > 0) {
                --i;
              }
            }
            else {
              if (i === lastIndex) {
                i = recursiveNavigate ? 0 : activeIndex;
              }
              else if (i < lastIndex) {
                ++i;
              }
            }
          }
        },
        _getActiveIndex: function (regions) {
          if (this.currentlyActiveTabableRegion) {
            this._sortTabableRegions();
            var currentlyActive = this.currentlyActiveTabableRegion,
              tabableRegions  = this.tabableRegions;
            if (!!regions) {
              tabableRegions = regions;
            }
            for (var i = 0; i < tabableRegions.length; i++) {
              if (currentlyActive.view.cid === tabableRegions[i].view.cid) {
                return i;
              }
            }
          }
        },

        _deactivateCurrentActiveTabableRegion: function () {
          var activeIdx = this._getActiveIndex();

          if (activeIdx !== undefined && !!this.tabableRegions[activeIdx]) {
            var activeView = this.tabableRegions[activeIdx].view;
            var tabRegionEl = activeView.$el;

            tabRegionEl.removeClass(accessibilityActiveRegionClass);
            delete this.currentlyActiveTabableRegion;
            if (activeView.accDeactivateTabableRegion) {
              log.debug('deactivating tabable region ' + activeView.constructor.name) &&
              console.log(log.last);

              this.tabableRegions[activeIdx].ignoreFocusEvents = true;
              activeView.accDeactivateTabableRegion.call(activeView);
              this.tabableRegions[activeIdx].ignoreFocusEvents = false;
            }
          }
          return activeIdx;
        },

        _setTabableRegionActive: function (tabableRegion, shiftTab) {
          log.debug('activating ' + tabableRegion.view.constructor.name + ' as active tabable' +
                    ' region') && console.log(log.last);

          this._deactivateCurrentActiveTabableRegion();
          tabableRegion.view.$el.addClass(accessibilityActiveRegionClass);
          this.currentlyActiveTabableRegion = tabableRegion;
          if (tabableRegion.view.accActivateTabableRegion) {
            tabableRegion.ignoreFocusEvents = true;
            tabableRegion.view.accActivateTabableRegion.call(tabableRegion.view, shiftTab);
            tabableRegion.ignoreFocusEvents = false;
          }
        },

        _setFocusInActiveTabableRegion: function (shiftTab) {
          if (this.currentlyActiveTabableRegion) {
            this.currentlyActiveTabableRegion.setFocus(shiftTab);
          } else {
            var tabableRegionsByWeight = _.sortBy(this.tabableRegions, function (tabableRegion) {
              return tabableRegion.view.options.initialActivationWeight;
            });
            var preferredRegion = _.last(tabableRegionsByWeight);
            if (preferredRegion && preferredRegion.view.options.initialActivationWeight > 0) {
              log.debug("setFocus: " + preferredRegion.view.constructor.name) &&
              console.log(log.last);
              preferredRegion.setFocus(shiftTab);
            }
          }
        },

        _clearTabIndexes: function (view) {
          var focusables = view.$el.find(TabablesBehavior.focusablesSelector).addBack(
              TabablesBehavior.focusablesSelector);
          if (focusables.length) {
            focusables.prop('tabindex', -1);
          } else {
            log.debug('_clearTabIndexes: no focusables found in ' + view.constructor.name) &&
            console.log(log.last);
          }
        },

        _maintainTabFocus: function (event) {
          var shiftTab    = event.shiftKey,
              activeIndex = this._getActiveIndex();
          if (activeIndex !== undefined) {
            var activeRegion = this.tabableRegions[activeIndex];
            var recursiveNavigate = getOption.call(this, 'recursiveNavigation');
            if (!!activeRegion && activeRegion.onlastTabElement(shiftTab, event)) {
              var nextActiveRegion = this._getNextActiveRegion(shiftTab, false);
              if (!nextActiveRegion) {
                nextActiveRegion = this._getNextActiveRegion(shiftTab, recursiveNavigate);

              }
              if (nextActiveRegion) {
                this._setTabableRegionActive(nextActiveRegion, shiftTab);
                this._setFocusInActiveTabableRegion(shiftTab);
              }
              return false;
            }
          }
          return true;
        },

        _setFocusToNextRegion: function setFocusToNextRegion(shiftTab) {
          var recursiveNavigate = getOption.call(this, 'recursiveNavigation');
          var nextActiveRegion = this._getNextActiveRegion(shiftTab, recursiveNavigate);
          if (nextActiveRegion) {
            this._setTabableRegionActive(nextActiveRegion);
            this._setFocusInActiveTabableRegion();
          }
        }
      },
      {
        tabablesHandlers: [],

        focusablesSelector: 'a[href], area[href], input, select, textarea, button,' +
                            ' iframe, object, embed, *[tabindex], *[contenteditable]',

        clearTabIndexes: function (view) {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior && $.contains(tabablesBehavior.view.el, view.el)) {
            tabablesBehavior._clearTabIndexes.call(tabablesBehavior, view);
          }
        },

        setTabableRegionActive: function (tabableRegion) {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior && $.contains(tabablesBehavior.view.el, tabableRegion.view.el)) {
            tabablesBehavior._setTabableRegionActive.call(tabablesBehavior, tabableRegion);
          }
        },

        registerTabableRegion: function (tabableRegion) {
          log.debug('registerTabableRegion for view ' + tabableRegion.view.constructor.name) &&
          console.log(log.last);

          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior) {
            return tabablesBehavior.registerTabableRegion.call(tabablesBehavior, tabableRegion);
          }
        },

        unregisterTabableRegion: function (tabableRegion) {
          if (tabableRegion) {
            _.each(TabablesBehavior.tabablesHandlers, function (tabablesBehavior) {
              tabablesBehavior.unregisterTabableRegionBehavior.call(tabablesBehavior,
                  tabableRegion);
            });
          }
        },

        setFocusInActiveTabableRegion: function activateInitialTabableRegion() {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior) {
            tabablesBehavior._setFocusInActiveTabableRegion.call(tabablesBehavior);
          }
        },

        popTabableHandler: function () {
          var tabablesBehavior = _.last(TabablesBehavior.tabablesHandlers);
          if (tabablesBehavior) {
            tabablesBehavior._popTabableHandler();
          }
        }

      });
  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return TabablesBehavior;
});
