/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base'], function (_, $, base) {
  'use strict';
  var ModalKeyboardNavigationMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {

        _rebuildFocusableElements: function () {
          this.focusableElements = base.findFocusables(this._focusHolder);
        },
        refreshFocusEngage: function () {
          this._rebuildFocusableElements();
        },
        _maintainTabFocus: function (modalElement) {
          this._focusHolder = modalElement;
          this._rebuildFocusableElements();

          var self = this;
          modalElement.keydown(function (e) {
            var currentIndex   = self.focusableElements.index(e.target),
                focusableCount = self.focusableElements.length,
                cancelEvent    = false;
            if (currentIndex === -1) {
              return;
            }
            if (e.keyCode === 9) {
              if (!e.shiftKey && currentIndex === focusableCount - 1) {
                self.focusableElements[0].focus();
                cancelEvent = true;
              } else if (e.shiftKey && currentIndex === 0) {
                self.focusableElements[focusableCount - 1].focus();
                cancelEvent = true;
              }
            }
            cancelEvent && e.preventDefault();
            e.stopPropagation();
          });

          this.listenTo(this, 'dom:refresh', function () {
            this.refreshFocusEngage();
          });

          var disengage = function disengage() {
            modalElement.off('keydown');
          };
          return {
            disengage: disengage
          };
        },
        engageModalKeyboardFocusOnOpen: function (modalElement) {
          this._allyHandles || (this._allyHandles = []);
          modalElement = $(modalElement || this.el);
          this._allyHandles.push(this._maintainTabFocus(modalElement));
        },

        disengageModalKeyboardFocusOnClose: function () {
          if (this._allyHandles) {
            while (this._allyHandles.length > 0) {
              this._allyHandles.pop().disengage();
            }
          }
        },

        hasEngagedModalKeyboardFocus: function () {
          return this._allyHandles && this._allyHandles.length;
        }
      });
    }
  };

  return ModalKeyboardNavigationMixin;
});