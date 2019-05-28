/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  var KeyEventNavigation = {

    onKeyInView: function (event) {
      var keyCode = event.keyCode;
      var retVal = false;

      switch (keyCode) {
      case 27:
        this.trigger('escape:focus');
        if (this.activeChild) {
          this.activeChild.removeClass('csui-focus');
        }
        break;
      case 32:
      case 13:
        this.execute(this.activeChild);
        break;
      case 38:
      case 33:
      case 40:
      case 34:
        if (this.activeChild && this.activeChild.hasClass('csui-focus')) {
          break;
        }
        retVal = true;
        break;
      case 9:
        if (this.activeChild && this.$el.hasClass('csui-focus')) {
          retVal = this.tab(event.shiftKey);
          break;
        }
        retVal = true;
        break;
      default:
        retVal = true;
      }
      return retVal;
    },

    execute: function (activeChild) {
      this.$el.addClass('csui-focus');
      if (this.$el.find('.facet-disabled').length) {
        this.onShowFacet();
      }
      else {
        this.setfocus(activeChild);
      }
    },
    setfocus: function (activeChild) {
      (activeChild && activeChild.is(':visible')) || (activeChild = this.getActiveChild());

      if (activeChild.hasClass('csui-focus')) {

        switch (activeChild) {
        case this.ui.facetHeaderIcon:
          if (this.ui.facetHeader.hasClass('binf-disabled')) {
            break;
          }
          activeChild.trigger('click');
          if (this.ui.facetHeaderIcon.hasClass('icon-expandArrowDown')) {
            this.trigger('escape:focus');
            this.activeChild = this.getActiveChild();
          } else {
            activeChild.addClass('csui-focus');
          }
          break;

        case this.ui.apply:
        case this.ui.cancel:
          activeChild.trigger('click');
          this.trigger('escape:focus');
          this.activeChild = undefined;
          break;

        case this.ui.facetMore:
          activeChild.trigger('click');
          if (activeChild === this.ui.facetMore) {
            this.activateChild(activeChild);
          }
        }
      }
      else {
        this.activateChild(activeChild);
      }
    },

    tab: function (shiftTab) {
      var facets = this.$el.find('.csui-facet-item:not(.binf-hidden)');

      if (this.activeChild.hasClass('csui-focus')) {
        if (shiftTab) {
          this.activeChild = this._getPrevActiveChild(facets);
        }
        else {
          this.activeChild = this._getNextActiveChild(facets);
        }

        this.activateChild(this.activeChild);
        return false;
      }

      return true;
    },

    activateChild: function (activeChild) {
      activeChild || (activeChild = this.getActiveChild());
      if (this.prevChild) {
        this.prevChild.removeClass('csui-focus');
      }
      activeChild.addClass('csui-focus');
      activeChild.focus();
      this.prevChild = this.activeChild;
    },

    getActiveChild: function () {
      var childViewContainers = this.$el.find('.csui-facet-item:not(.binf-hidden)');
      if (!this.activeChild || !this.activeChild.is(':visible')) {
        if (this.ui.facetHeaderIcon.hasClass('icon-expandArrowDown')) {
          this.activeChild = this.ui.facetHeaderIcon;
        }
        else {
          this.activeChild = $(childViewContainers[0]).find('span');
          if (this.activeChild.length === 0) {
            this.activeChild = $(childViewContainers[0]).find('div[tabindex]');
          }
          this.activeChildIndex = 0;
        }
      }
      return this.activeChild;
    },

    cursorNextFilter: function (view, keyUp, target) {
      var childViewContainers = this.$el.find('.csui-facet-item:not(.binf-hidden)'),
          numViews            = childViewContainers.length - 1;

      if (keyUp) {
        this.activeChildIndex = this.activeChildIndex === 0 ? numViews : --this.activeChildIndex;
      }
      else {
        this.activeChildIndex = this.activeChildIndex === numViews ? 0 : ++this.activeChildIndex;
      }

      if (target.hasClass('icon')) {
        this.activeChild = $(childViewContainers[this.activeChildIndex]).find('span');
      }
      else {
        this.activeChild = $(childViewContainers[this.activeChildIndex]).find('.csui-filter-name');
      }

      this.children.findByIndex(this.activeChildIndex).activeChild = this.activeChild;
      this.activateChild(this.activeChild);
    },

    _getLastFilterFocus: function (facets) {
      var childIndex = this.activeChildIndex;
      this.activeChildIndex = childIndex && childIndex < facets.length ? childIndex : 0;
      return this.children.findByIndex(this.activeChildIndex).activeChild;
    },

    _getNextActiveChild: function (facets) {
      var nextChild = this.activeChild;

      switch (this.activeChild) {
      case this.ui.facetHeaderIcon:
        if (this.ui.facetHeaderIcon.hasClass('icon-expandArrowUp')) {
          nextChild = this._getLastFilterFocus(facets);
        }
        break;
      case this.ui.facetMore:
        if (this.$el.find('.csui-multi-select').length > 0) {
          nextChild = this.ui.apply;
        } else if (this.$el.find('.csui-multi-select').length === 0 &&
                   this.ui.facetHeaderIcon.hasClass('icon-expandArrowUp')) {
          nextChild = this.ui.facetHeaderIcon;
        }
        break;
      case this.ui.cancel:
        if (this.$el.find('.csui-multi-select').length > 0 &&
            !this.ui.facetHeader.hasClass('binf-disabled') &&
            this.ui.facetHeaderIcon.hasClass('icon-expandArrowUp')) {
          nextChild = this.ui.facetHeaderIcon;
        } else if (this.ui.facetHeader.hasClass('binf-disabled')) {
          nextChild = this._getLastFilterFocus(facets);
        }
        break;
      case this.ui.apply:
        nextChild = this.ui.cancel;
        break;
      default:
        if (this.ui.facetMore.length > 0) {
          nextChild = this.ui.facetMore;
        } else if (this.$el.find('.csui-multi-select').length > 0) {
          nextChild = this.ui.apply;
        } else if (this.$el.find('.csui-multi-select').length === 0 &&
                   this.ui.facetMore.length === 0) {
          nextChild = this.ui.facetHeaderIcon;
        }
      }

      return nextChild;
    },

    _getPrevActiveChild: function (facets) {
      var nextChild = this.activeChild;

      switch (this.activeChild) {
      case this.ui.facetHeaderIcon:
        if (this.$el.find('.csui-multi-select').length > 0) {
          nextChild = this.ui.cancel;
        } else if (this.$el.find('.csui-multi-select').length === 0 &&
                   this.ui.facetMore.length === 0) {
          nextChild = this._getLastFilterFocus(facets);
        } else if (this.$el.find('.csui-multi-select').length === 0 &&
                   this.ui.facetMore.length > 0) {
          nextChild = this.ui.facetMore;
        }
        break;
      case this.ui.facetMore:
        nextChild = this._getLastFilterFocus(facets);
        break;
      case this.ui.cancel:
        nextChild = this.ui.apply;
        break;
      case this.ui.apply:
        if (this.ui.facetMore.length > 0) {
          nextChild = this.ui.facetMore;
        }
        else {
          nextChild = this._getLastFilterFocus(facets);
        }
        break;
      default:
        if (this.ui.facetHeader.hasClass('binf-disabled')) {
          nextChild = this.ui.cancel;
          break;
        }
        nextChild = this.ui.facetHeaderIcon;
      }

      return nextChild;
    }

  };

  return KeyEventNavigation;

});
