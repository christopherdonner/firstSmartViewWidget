/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'csui/behaviors/keyboard.navigation/tabables.behavior'
], function (module, _, $, Marionette, log, base, TabablesBehavior) {
  'use strict';

  var TabableRegionBehavior = Marionette.Behavior.extend({

      defaults: {
        initialActivationWeight: 0
      },

      constructor: function TabableRegionBehavior(options, view) {
        Marionette.Behavior.prototype.constructor.apply(this, arguments);

        this.view = view;
        view.tabableRegionBehavior = this;
        _.extend(view, this.defaults);
        _.defaults(view, {
            isTabable: function () {
              return true;  // default: this view can be reached by tab
            },
            onLastTabElement: function () {
              return true;  //most regions will only have one tab, with further navigation handled through arrow keys
            }
          }
        );

        if (view.options && !view.options.initialActivationWeight) {
          view.options.initialActivationWeight = this.options.initialActivationWeight;
        }

        this._registerEventHandlers();

      },

      _registerEventHandlers: function () {
        if (!this._eventsRegistered) {
          var view = this.view;
          var self = this;

          this.listenTo(view, 'render', this._applyClasses);
          this.listenTo(view, 'dom:refresh', function () {
            TabablesBehavior.clearTabIndexes(view);
            if (TabablesBehavior.registerTabableRegion(this)) {
              self.isRegistered = true;
              this.setInitialTabIndex();
              TabablesBehavior.setFocusInActiveTabableRegion();
            }
          });
          this.listenTo(view, 'refresh:tabindexes', function () {
            TabablesBehavior.clearTabIndexes(view);
            if (self.isRegistered) {
              this.setInitialTabIndex();
              TabablesBehavior.setFocusInActiveTabableRegion();
            }
          });

          this.listenTo(view, 'destroy', function () {
            TabablesBehavior.unregisterTabableRegion(this);
            TabablesBehavior.clearTabIndexes(view);
            self.isRegistered = false;
          });
          this.listenTo(view, 'tabable', function () {
            TabablesBehavior.clearTabIndexes(view);
            if (TabablesBehavior.registerTabableRegion(this)) {
              this.setInitialTabIndex();
              TabablesBehavior.setFocusInActiveTabableRegion();
            }
          });
          this.listenTo(view, 'tabable:not', function () {
            TabablesBehavior.unregisterTabableRegion(this);
            TabablesBehavior.clearTabIndexes(view);
            this.isRegistered = false;
          });

          this.listenTo(view, 'changed:focus', function () {
            if (self.isRegistered) {
              this.moveTabIndex();
            }
          });

          this.listenTo(view, 'escaped:focus', function () {
            TabablesBehavior.setFocusInActiveTabableRegion();
          });
          this._eventsRegistered = true;
        }
      },

      _unregisterEventHandlers: function () {
        var view = this.view;

        this.stopListening(view);
        this._eventsRegistered = false;
      },

      getCurrentlyFocusedElementFromView: function (shiftTab) {
        if (_.isFunction(this.view.currentlyFocusedElement)) {
          var focusEl = this.view.currentlyFocusedElement({shiftKey: shiftTab});
          return (focusEl instanceof $ ? focusEl : $(focusEl));
        } else {
          if (_.isString(this.view.currentlyFocusedElement)) {
            return this.view.$(this.view.currentlyFocusedElement);
          } else {
            log.debug('setInitialTabIndex: ' + this.view.constructor.name + ' does not have' +
              ' currentlyFocusedElement -> not setting tabindex in that view ') &&
            console.log(log.last);
            return $();
          }
        }
      },

      onlastTabElement: function (shiftTab, event) {
        return this.view.onLastTabElement(shiftTab, event);
      },

      setFocus: function (shiftTab) {
        if (this.options.notSetFocus) {
          return;
        }

        var elToFocus = this.getCurrentlyFocusedElementFromView(shiftTab);
        if (elToFocus && base.isVisibleInWindowViewport(elToFocus)) {
          this.ignoreFocusEvents = true;
          elToFocus.focus();
          this.ignoreFocusEvents = false;
        }
      },

      setInitialTabIndex: function () {
        if (this.currentlyFocusedElement) {
          this.currentlyFocusedElement.off('focus.' + this.view.cid);
        }
        if (this.view.isTabable()) {
          try {
            this.currentlyFocusedElement = this.getCurrentlyFocusedElementFromView();
            if (this.currentlyFocusedElement && this.currentlyFocusedElement.length > 0) {
              var self = this;
              this.currentlyFocusedElement.prop('tabindex', 0);
              this.currentlyFocusedElement.addClass(
                TabableRegionBehavior.accessibilityActiveElementClass);
              this.currentlyFocusedElement.on('focus.' + this.view.cid, function () {
                if (!self.ignoreFocusEvents) {
                  TabablesBehavior.setTabableRegionActive(self);
                }
              });
            }
          } catch (e) {
            console.warn('Could not set as active element: ', this.view.cid, e.message);
          }

        } else {
          this.currentlyFocusedElement = $();
        }
      },

      moveTabIndex: function () {
        var self = this;
        if (this.currentlyFocusedElement) {
          this.currentlyFocusedElement.off('focus.' + this.view.cid);
          this.currentlyFocusedElement.prop('tabindex', -1);
          this.currentlyFocusedElement.removeClass(
            TabableRegionBehavior.accessibilityActiveElementClass);
          this.currentlyFocusedElement = $();

        }
        var newlyFocusedElement = this.getCurrentlyFocusedElementFromView();
        newlyFocusedElement.prop('tabindex', 0);
        this.currentlyFocusedElement = newlyFocusedElement;
        this.currentlyFocusedElement.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
        this.currentlyFocusedElement.on('focus.' + this.view.cid, function () {
          if (!self.ignoreFocusEvents) {
            TabablesBehavior.setTabableRegionActive(self);
          }
        });
      },

      _applyClasses: function () {
        this.$el.addClass(TabableRegionBehavior.accessibilityRegionClass);
      }
    },
    {
      accessibilityRegionClass: 'csui-acc-tab-region',
      accessibilityActiveRegionClass: 'csui-acc-tab-region-active',
      accessibilityFocusableClass: 'csui-acc-focusable',
      accessibilityActiveElementClass: 'csui-acc-focusable-active'
    }
  );

  return TabableRegionBehavior;
});
