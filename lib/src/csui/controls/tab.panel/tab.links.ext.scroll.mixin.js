/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/models/version',
  'i18n!csui/controls/tab.panel/impl/nls/lang', 'csui/controls/form/pub.sub'
], function (_, $, Backbone, VersionModel, lang, PubSub) {
  var TabLinksScrollMixin = {

    _initializeToolbars: function (options) {
      options = options || {};
      this.tabsSelector = $(this.$el.find('.tab-links .tab-links-bar')[0]).find('> ul li');
      this.tablinksToolbar = $(this.$el.find('.tab-links .tab-links-bar')[0]);

      var tooltip;
      this.leftToolbar = $(this.$el.find('.tab-links .left-toolbar')[0]);
      if (this.leftToolbar && this.leftToolbar.find('>div.goto_previous_div').length === 0) {
        tooltip = options.gotoPreviousTooltip || lang.gotoPreviousTooltip;
        this.leftToolbar.append(
            "<div class='goto_previous_div' title='" + tooltip +
            "'><span class='icon goto_previous_page'></span></div>"
        );
        this.gotoPreviousPage = $(this.$el.find('.tab-links .goto_previous_div')[0]);
        this.gotoPreviousPage.on('click', _.bind(this._gotoPreviousTabClick, this));
      }
      this._hideLeftToolbar();

      this.rightToolbar = $(this.$el.find('.tab-links .right-toolbar')[0]);
      if (this.rightToolbar && this.rightToolbar.find('>div.goto_next_div').length === 0) {
        tooltip = options.gotoNextTooltip || lang.gotoNextTooltip;
        this.rightToolbar.append(
            "<div class='goto_next_div' title='" + tooltip +
            "'><span class='icon goto_next_page'></span></div>"
        );
        this.gotoNextPage = $(this.$el.find('.tab-links div.goto_next_div')[0]);
        this.gotoNextPage.on('click', _.bind(this._gotoNextTabClick, this));
      } else {
        this.gotoNextPage = $(this.$el.find('.tab-links div.goto_next_div')[0]);
      }
      this.gotoNextPage && this.gotoNextPage.hide();
    },

    _listenToTabEvent: function () {
      var i;
      var tabs = this.$el.find(this.tabsSelector);
      for (i = 0; i < tabs.length; i++) {
        this._listenToTabIdEvent(i, tabs);
      }
    },

    _listenToTabIdEvent: function (index, iTabs) {
      var self = this;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;

      $(tabs[index]).off('activate.binf.scrollspy')
          .on('activate.binf.scrollspy', function () {
            var tabID    = $(this).find('a').attr('href'),
                tabIndex = 0;
            if (tabID) {
              tabID[0] === '#' && (tabID = tabID.substr(1));
              tabIndex = self._findTabIndexByID(tabID);
              if (!!self.tabContentHeader) {
                var newTabHeaderText = $(tabs).parent().find(
                    "li.binf-active .cs-tablink-text").html(),
                    pubsubPostFix    = (self.options.node instanceof VersionModel ? 'v' : 'p') +
                                       self.options.node.get('id'),
                    objPubSubId      = 'pubsub:tab:contents:header:view:change:tab:title:' +
                                       pubsubPostFix;

                PubSub.trigger(objPubSubId, newTabHeaderText);
              }
            }
            tabs.removeAttr('aria-selected');
            $(tabs[index]).attr('aria-selected', 'true');
            if (self.activatingTab === true || self.skipAutoScroll === true ||
                (self.scrollspyActivatingTab === true && self.scrollspyActivatingTabId ===
                 tabIndex)) {
              return;
            }
            if (tabID) {
              if (tabIndex >= 0 && !self._isTablinkVisibleInParents($(tabs[tabIndex]))) {
                self.scrollspyActivatingTab = true;
                self.scrollspyActivatingTabId = tabIndex;
                self._autoScrollTabTo(tabIndex)
                    .done(function () {
                      self.scrollspyActivatingTab = false;
                      self.scrollspyActivatingTabId = -1;
                    });
              }
            }
          });
    },

    _beginTabHidden: function (iTabs) {
      var tabHidden = false;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
          var tabVisible = this._isTablinkVisibleInParents($(tabs[i]));
          if (tabVisible) {
            break;
          }
          if (!tabVisible && !($(tabs[i]).hasClass('hidden-by-switch'))) {
            tabHidden = true;
            break;
          }
        }
      }
      return tabHidden;
    },

    _trailingTabHidden: function (iTabs) {
      var tabHidden = false;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = tabs.length - 1; i >= 0; i--) {
          var tabVisible = this._isTablinkVisibleInParents($(tabs[i]));
          if (tabVisible) {
            break;
          }
          if (!tabVisible && !($(tabs[i]).hasClass('hidden-by-switch'))) {
            tabHidden = true;
            break;
          }
        }
      }
      return tabHidden;
    },

    _findTabIndexByID: function (tabID) {
      var tabIndex = -1;
      var tabs = this.$el.find(this.tabsSelector);
      if (tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
          var href = $(tabs[i]).find('>a').attr('href');
          href[0] === '#' && (href = href.substr(1));
          if (tabID === href) {
            tabIndex = i;
            break;
          }
        }
      }
      return tabIndex;
    },

    _firstVisibleTabIndex: function (iTabs) {
      var tabIndex = -1;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = 0; i < tabs.length; i++) {
          if (this._isTablinkVisibleInParents($(tabs[i]))) {
            tabIndex = i;
            break;
          }
        }
      }
      return tabIndex;
    },

    _lastVisibleTabIndex: function (iTabs) {
      var tabIndex = -1;
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        var i;
        for (i = tabs.length - 1; i >= 0; i--) {
          if (this._isTablinkVisibleInParents($(tabs[i]))) {
            tabIndex = i;
            break;
          }
        }
      }
      return tabIndex;
    },

    _showLeftToolbar: function () {
      this.leftToolbar && this.leftToolbar.show();
      this.tablinksToolbar && this.tablinksToolbar.addClass("with-left-toolbar");
    },

    _hideLeftToolbar: function () {
      this.leftToolbar && this.leftToolbar.hide();
      this.tablinksToolbar && this.tablinksToolbar.removeClass("with-left-toolbar");
    },

    _hideTabLinkByRequiredSwitch: function ($tab) {
      if ($tab && $tab instanceof $) {
        $tab.addClass('binf-hidden hidden-by-switch');
        this._hideTab($tab);
        $tab.find('a').attr('data-cstabindex', '-1');
        var tabDeleteIcon = $tab.find('.cs-delete-icon');
        if (tabDeleteIcon.attr('data-cstabindex') !== undefined) {
          tabDeleteIcon.attr('data-cstabindex', '-1');
        }
      }
    },

    _showTabLinkByRequiredSwitch: function ($tab, removeable) {
      if ($tab && $tab instanceof $) {
        $tab.removeClass('binf-hidden hidden-by-switch');
        this._showTab($tab);
        $tab.find('a').removeAttr('data-cstabindex');
        removeable === true && $tab.find('.cs-delete-icon').attr('data-cstabindex', '0');
      }
    },

    _hideTab: function ($tab) {
      if ($tab && $tab instanceof $) {
        $tab.css('width', '');
        $tab.css('text-overflow', 'clip');
        $tab.hide();
      }
    },

    _showTab: function ($tab) {
      if ($tab && $tab instanceof $) {
        $tab.css('width', '');
        $tab.css('text-overflow', 'ellipsis');
        $tab.show();
      }
    },

    _showLastTab: function (iTabs) {
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      var i;
      for (i = tabs.length - 1; i >= 0; i--) {
        var $tab = $(tabs[i]);
        if (!this._isTablinkVisibleInParents($tab) && !($tab.hasClass('hidden-by-switch'))) {
          this._showTab($tab);
          break;
        }
      }
    },

    _enableToolbarState: function (iTabs) {
      var tabs = iTabs === undefined ? this.$el.find(this.tabsSelector) : iTabs;
      if (tabs) {
        this._beginTabHidden(tabs) ? this._showLeftToolbar() : this._hideLeftToolbar();
        this.gotoNextPage && this.gotoNextPage.toggle(this._trailingTabHidden(tabs));
      }
    },

    _gotoPreviousTabClick: function (event) {
      Backbone.trigger('closeToggleAction');
      this._gotoPreviousTab({event: event});
    },

    _gotoNextTabClick: function (event) {
      Backbone.trigger('closeToggleAction');
      var deferred = $.Deferred();
      var tabs = this.$el.find(this.tabsSelector);
      var visibleIndex = this._lastVisibleTabIndex(tabs);
      if (visibleIndex >= 0 && visibleIndex < tabs.length) {
        var i, nextIndex = -1;
        for (i = visibleIndex + 1; i < tabs.length; i++) {
          var $tab = $(tabs[i]);
          if (!($tab.hasClass('hidden-by-switch')) && !this._isTablinkVisibleInParents($tab)) {
            nextIndex = i;
            break;
          }
        }
        if (nextIndex >= 0 && nextIndex < tabs.length) {
          return this._gotoNextTab({tabs: tabs, visibleTabIndex: nextIndex});
        }
      }
      return $.Deferred().resolve();
    },
    _gotoPreviousTab: function (options) {
      options || (options = {});
      options.event && options.event.preventDefault();
      options.event && options.event.stopPropagation();

      var deferred = options.deferred ? options.deferred : $.Deferred();
      var tabs = options.tabs === undefined ? this.$el.find(this.tabsSelector) : options.tabs;
      var i, lastTabIndex = tabs.length - 1;

      var visibleTabIndex = options.visibleTabIndex;
      if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
          visibleTabIndex <= lastTabIndex) {
        if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex]))) {
          return deferred.resolve();
        }
      }

      var defBeingHandled = false;
      for (i = 0; i <= lastTabIndex; i++) {
        var $tab2 = $(tabs[i]);
        if (this._isTablinkVisibleInParents($tab2)) {
          if (i === 0) {
            this._hideLeftToolbar();
          }
          var j;
          for (j = i - 1; j >= 0; j--) {
            var $tab1 = $(tabs[j]);
            if ($tab1 && !this._isTablinkVisibleInParents($tab1) &&
                !($tab1.hasClass('hidden-by-switch'))) {
              $tab1.css('visibility', 'binf-hidden');
              $tab1.css('width', '');
              $tab1.show();
              var width = $tab1.width();
              $tab1.css('text-overflow', 'clip');
              $tab1.width(0);
              $tab1.css('visibility', '');

              defBeingHandled = true;
              var duration = options.animationOff === true ? 0 : 'fast';
              $tab1.animate({"width": "+=" + width}, duration,
                  _.bind(function () {
                    $tab1.css('width', '');
                    $tab1.css('text-overflow', 'ellipsis');
                    var recurse = false;
                    if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
                        visibleTabIndex <= lastTabIndex) {
                      if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex])) === false) {
                        recurse = true;
                      }
                    }
                    if (recurse) {
                      var opts = {tabs: tabs, deferred: deferred};
                      options.event && (opts.event = options.event);
                      (visibleTabIndex !== undefined) && (opts.visibleTabIndex = visibleTabIndex);
                      (options.animationOff !== undefined) &&
                      (opts.animationOff = options.animationOff);
                      this._gotoPreviousTab(opts);
                    } else {
                      this._enableToolbarState(tabs);
                      this.autoScrollingLastTab = false;
                      deferred.resolve();
                    }
                  }, this));

              break;  // j loop
            }
          }
          break;  // i loop
        }
        if (i === lastTabIndex) {
          this._showLastTab(tabs);
          this._enableToolbarState(tabs);
          this.autoScrollingLastTab = false;
          deferred.resolve();
        }
      }

      if (defBeingHandled === false) {
        return deferred.resolve();
      }
      if (options.deferred === undefined) {
        return deferred.promise();
      }
    },
    _gotoNextTab: function (options) {
      options || (options = {});
      options.event && options.event.preventDefault();
      options.event && options.event.stopPropagation();

      var deferred = options.deferred ? options.deferred : $.Deferred();
      var tabs = options.tabs === undefined ? this.$el.find(this.tabsSelector) : options.tabs;
      var i, lastTabIndex = tabs.length - 1;

      var visibleTabIndex = options.visibleTabIndex;
      if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
          visibleTabIndex <= lastTabIndex) {
        if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex]))) {
          return deferred.resolve();
        }
      }

      var defBeingHandled = false;
      for (i = 0; i <= lastTabIndex; i++) {
        var $tab = $(tabs[i]);
        if (this._isTablinkVisibleInParents($tab)) {
          if (this.leftToolbar.is(':hidden')) {
            this._showLeftToolbar();
          }

          if ($tab) {
            defBeingHandled = true;
            var duration = options.animationOff === true ? 0 : 'fast';
            $tab.animate({"width": "-=" + $tab.width()}, duration,
                _.bind(function () {
                  $tab.hide();
                  $tab.css('width', '');
                  var recurse = false;
                  if (visibleTabIndex !== undefined && visibleTabIndex >= 0 &&
                      visibleTabIndex <= lastTabIndex) {
                    if (this._isTablinkVisibleInParents($(tabs[visibleTabIndex])) === false) {
                      recurse = true;
                    }
                  }
                  if (recurse) {
                    var opts = {tabs: tabs, deferred: deferred};
                    options.event && (opts.event = options.event);
                    (visibleTabIndex !== undefined) && (opts.visibleTabIndex = visibleTabIndex);
                    (options.animationOff !== undefined) &&
                    (opts.animationOff = options.animationOff);
                    this._gotoNextTab(opts);
                  } else {
                    this._enableToolbarState(tabs);
                    this.autoScrollingLastTab = false;
                    deferred.resolve();
                  }
                }, this));
          }
          break;
        }
        if (i === lastTabIndex) {
          this._showLastTab(tabs);
          this._enableToolbarState(tabs);
          this.autoScrollingLastTab = false;
          deferred.resolve();
        }
      }

      if (defBeingHandled === false) {
        return deferred.resolve();
      }
      if (options.deferred === undefined) {
        return deferred.promise();
      }
    },

    _autoScrollLastTab: function () {
      this.autoScrollingLastTab = true;
      var tabs = this.$el.find(this.tabsSelector);
      var deferred = this._gotoNextTab({tabs: tabs, visibleTabIndex: tabs.length - 1});
      deferred.done(_.bind(function () {
        this.autoScrollingLastTab = false;
      }, this));
      return deferred;
    },

    _autoScrollFirstTabAsync: function ($tab0, tabs, iteration, iDeferred) {
      var iter = iteration === undefined ? 0 : iteration;
      if (iter < 0 && iter >= tabs.length) {
        if (iDeferred) {
          iDeferred.resolve();
          return;
        } else {
          return $.Deferred().resolve();
        }
      }

      var deferred = iDeferred ? iDeferred : $.Deferred();
      this._gotoPreviousTab({tabs: tabs}).done(_.bind(function () {
        if (this._isTablinkVisibleInParents($tab0)) {
          deferred.resolve();
        } else {
          iter++;
          this._autoScrollFirstTabAsync($tab0, tabs, iter, deferred);
        }
      }, this));

      if (iDeferred === undefined) {
        return deferred;
      }
    },

    _autoScrollFirstTab: function () {
      var deferred = $.Deferred();
      this.autoScrollingLastTab = true;
      var tabs = this.$el.find(this.tabsSelector);
      var $tab0 = $(tabs[0]);
      if (!this._isTablinkVisibleInParents($tab0) && tabs.length > 0) {
        this._autoScrollFirstTabAsync($tab0, tabs).done(_.bind(function () {
          this._enableToolbarState(tabs);
          this.autoScrollingLastTab = false;
          deferred.resolve();
        }, this));
      } else {
        this.autoScrollingLastTab = false;
      }
      return deferred.promise();
    },

    _autoScrollTabTo: function (index, options) {
      options || (options = {});
      var tabs = this.$el.find(this.tabsSelector);
      var scrollOptions = _.extend({visibleTabIndex: index}, options, {tabs: tabs});
      var firstVisibleIndex = this._firstVisibleTabIndex(tabs);
      var lastVisibleIndex = this._lastVisibleTabIndex(tabs);

      if (firstVisibleIndex >= 0 && firstVisibleIndex < tabs.length &&
          lastVisibleIndex >= 0 && lastVisibleIndex < tabs.length &&
          index >= 0 && index < tabs.length) {
        this.autoScrollingLastTab = true;
        var deferred;
        if (index < firstVisibleIndex) {
          deferred = this._gotoPreviousTab(scrollOptions);
        } else if (index > lastVisibleIndex) {
          deferred = this._gotoNextTab(scrollOptions);
        } else {
          this.autoScrollingLastTab = false;
          return $.Deferred().resolve();
        }
        deferred.done(_.bind(function () {
          this.autoScrollingLastTab = false;
        }, this));
        return deferred;
      } else {
        return $.Deferred().resolve();
      }
    },

    _autoScrolling: function () {
      if (this.autoScrollingLastTab || this.activatingTab === true ||
          this.skipAutoScroll === true) {
        return $.Deferred().resolve();
      }

      var i, iActive = -1;
      var tabs = this.$el.find(this.tabsSelector);
      var tabHidden = false;
      for (i = 0; i < tabs.length; i++) {
        var $tab = $(tabs[i]);
        if (iActive === -1 && $tab.hasClass('binf-active')) {
          if (this._isTablinkVisibleInParents($tab) === false) {
            tabHidden = true;
          }
          iActive = i;
          break;
        }
      }

      if (tabHidden) {
        return this._autoScrollTabTo(iActive);
      }
      return $.Deferred().resolve();
    }

  };

  return TabLinksScrollMixin;

});
