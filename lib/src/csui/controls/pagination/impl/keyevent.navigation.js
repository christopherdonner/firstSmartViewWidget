/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base'
], function (_, $, base) {
  'use strict';

  var KeyEventNavigation = {
    isTabable: function(){
      if (base.isVisibleInWindowViewport(this.ui.pageSizeMenu) &&
          base.isVisibleInWindowViewport(this.ui.navPagingMenu)){
        return true;
      }
    },

    currentlyFocusedElement: function () {
      var activeChild = this.getActiveChild();
      return activeChild;
    },

    accActivateTabableRegion: function () {
      this.activateChild(true);
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode;
      var activeChild = this.getActiveChild();
      this.activeChild || (this.activeChild = this.ui.dropDownMenu);

      switch (keyCode) {
      case 32:
      case 13:
        if (this.activeChild === this.ui.dropDownMenu) {
          return true;
        }
        this.executeAction(this.activeChild);
        break;
      case 39:
        var nextChild = this._getNextActiveChild();
        this.setNextActiveChild(nextChild);
        break;
      case 37:
        var prevChild = this._getPrevActiveChild();
        this.setNextActiveChild(prevChild);
        break;
      case 38:
        if (this.activeChild === this.ui.dropDownMenu) {
          return true;
        }
        this._pageUp();
        break;
      case 33:
        this._pageUp();
        break;
      case 40:
        if (this.activeChild === this.ui.dropDownMenu) {
          return true;
        }
        this._pageDown();
        break;
      case 34:
        this._pageDown();
        break;
      case 36:
        this._activateHomeElem();
        break;
      case 35:
        this._activateEndElem();
        break;
      }
    },

    executeAction: function (activeChild) {
      if (activeChild) {
        var pageId = activeChild.attr('data-pageid');
        var nextPageMenu = activeChild.attr('data-slidepage');

        if (nextPageMenu) {
          var pageMenu = parseInt(nextPageMenu, 10);
          this.slidePageMenu(pageMenu);
          this.activeChild = this.ui.navPagingMenu.find('a').first();
          this.activateChild(true, this.activeChild);
        }
        else if (pageId) {
          var pageNum = parseInt(pageId, 10);
          this.changePage(pageNum);
          this.activeChild.removeClass('csui-acc-focusable-active');
        }
      }
    },

    activateChild: function (setActive, activeChild) {
      activeChild || (activeChild = this.getActiveChild());
      if (setActive) {
        activeChild.addClass('csui-acc-focusable-active');
        activeChild.focus();
      }
      else {
        activeChild.removeClass('csui-acc-focusable-active');
      }
    },

    setActiveChild: function (child) {
      this.activeChild = child;
    },

    getActiveChild: function () {
      this.activeChild || (this.activeChild = this.ui.dropDownMenu);
      return this.activeChild;
    },

    setNextActiveChild: function (nextChild) {
      if (nextChild !== this.activeChild) {
        this.activateChild(false, this.activeChild);
        this.activateChild(true, nextChild);
        this.activeChild = nextChild;
      }
    },

    resetActiveChild: function () {
      var activeChild = this.activeChild;
      this.activateChild(false);
      this.activeChild = null;
      if (activeChild) {

        var pageId = activeChild.attr('data-pageid');
        var pageMenu = activeChild.attr('data-slidepage');

        if (pageId) {
          this.activeChild = this._updatedChildPosition(pageId, activeChild);
        }
        else if (pageMenu && (this.numSlideMenus > 1)) {
          var nextPageTab = activeChild.parent().prev();
          if (nextPageTab.length > 0) {
            nextPageTab = nextPageTab.find('a');
          }
          else {
            nextPageTab = activeChild.parent().next().find('a');
          }
          pageId = nextPageTab.attr('data-pageid');
          this.activeChild = this._updatedChildPosition(pageId, nextPageTab);
        }
      }

      this.activeChild || (this.activeChild = this.ui.dropDownMenu);
    },

    _updatedChildPosition: function (pageId, activeChild) {
      pageId = parseInt(pageId, 10);
      if (this.totalCount > this.pageSize) {
        var numPages = this.numPages - 1;
        pageId = pageId > (numPages) ? numPages : pageId;
        var pageMenu = Math.floor(pageId / this.pageTabsPerMenu);
        if (pageMenu > 0) {
          this._initializePageTabMenu(true, true, pageMenu);
        }

        pageId += '';
        activeChild = _.find(this.ui.navPagingMenu.find('a'), function (child) {
          return $(child).attr('data-pageid') === pageId;
        });

        return $(activeChild);
      }
      return null;
    },

    _getPrevActiveChild: function () {
      var nextChild = this.ui.dropDownMenu;
      var activeChild = this.activeChild;
      if (activeChild === this.ui.dropDownMenu) {
        nextChild = this.ui.navPagingMenu.find('a').last();
      }
      else {
        var pageId = activeChild.attr('data-pageid');
        var nextPageMenu = activeChild.attr('data-slidepage');

        if (pageId || nextPageMenu) {
          var nextSibling = activeChild.parent().prev().find('a');

          if (nextSibling.length > 0) {
            nextChild = nextSibling;
          }
        }
      }
      return nextChild;
    },

    _getNextActiveChild: function () {
      var nextChild = this.ui.dropDownMenu;
      var activeChild = this.activeChild;
      if (activeChild === this.ui.dropDownMenu) {
        nextChild = this.ui.navPagingMenu.find('a').first();
      }
      else {
        var pageId = activeChild.attr('data-pageid');
        var nextPageMenu = activeChild.attr('data-slidepage');

        if (pageId || nextPageMenu) {
          var nextSibling = activeChild.parent().next().find('a');

          if (nextSibling.length > 0) {
            nextChild = nextSibling;
          }
        }
      }
      return nextChild;
    },

    _activateHomeElem: function () {
      this.activeChild = this.ui.dropDownMenu;
      this.activateChild(true, this.activeChild);
    },

    _activateEndElem: function () {
      this.activeChild = this._getLastElem();
      this.activateChild(true, this.activeChild);
    },

    _getLastElem: function () {
      return this.ui.navPagingMenu.find('a').last();
    },

    _pageUp: function () {
      var pageTab = this.ui.navPagingMenu.find('a').last();
      this._page(pageTab);
    },

    _page: function (activeChild) {
      var nextPageMenu = activeChild.attr('data-slidepage');
      if (nextPageMenu) {
        this.activateChild(false, this.activeChild);
        this.activeChild = activeChild;
        this.executeAction(this.activeChild);
      }
    },

    _pageDown: function () {
      var pageTab = this.ui.navPagingMenu.find('a').first();
      this._page(pageTab);
    }

  };

  return KeyEventNavigation;

});
