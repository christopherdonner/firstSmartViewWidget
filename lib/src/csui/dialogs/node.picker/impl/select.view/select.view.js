/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(
    ["module", "csui/lib/jquery", "csui/lib/underscore", 'csui/lib/backbone', "csui/lib/marionette",
      "csui/utils/log", "csui/utils/base",
      'csui/dialogs/node.picker/impl/node.list/node.list.view',
      'csui/dialogs/node.picker/impl/select.view/impl/header/header.view',
      'hbs!csui/dialogs/node.picker/impl/select.view/impl/select.view',
      'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
      'csui/behaviors/keyboard.navigation/tabable.region.behavior',
      'i18n!csui/dialogs/node.picker/impl/nls/lang',
      'css!csui/controls/list/impl/list',
      'css!csui/dialogs/node.picker/impl/select.view/impl/select.view'
    ], function (module, $, _, Backbone, Marionette, log, base,
        NodeListView, HeaderView, template, LayoutViewEventsPropagationMixin,
        TabableRegionBehavior, lang) {

      var SelectView = Marionette.LayoutView.extend({

        template: template,
        templateHelpers: function () {
          var langtext,tooltiptext = '';
          if (this.options.targetBrowseHistory.length) {
            langtext = this.options.targetBrowseHistory[this.options.targetBrowseHistory.length-1];
            if (langtext[0] === 'search') {
              tooltiptext = lang.backToSearchAria;
            } else if (langtext[0] === 'location') {
              tooltiptext = lang.backToFolderView;
            }
            else if (langtext[0] === 'node') {
              tooltiptext = lang.backToFolderView;
            }
            else {
              tooltiptext = '';
            }

          }
          return {
            backButtonTooltip: lang.backButtonTooltip,
            backButtonAria: tooltiptext != '' ? tooltiptext : lang.backToFolderView
          };
        },
        regions: {
          viewHeaderRegion: '.csui-np-header',
          viewContentRegion: '.csui-np-content'
        },
        ui: {
          "backSearchButton": ".csui-targetbrowse-arrow-back"
        },

        events: {
          'tabNextRegion': 'tabNextRegion',
          'click @ui.backSearchButton': 'onClickFolderBack',
          'keydown @ui.backSearchButton': 'selectFolderBack'
        },

        behaviors: {
          TabableRegion: {
            behaviorClass: TabableRegionBehavior,
            recursiveNavigation: true,
            containTabFocus: true
          }
        },

        constructor: function SelectView(options) {
          options || (options = {});
          _.defaults(options, {pageSize: 30});

          Marionette.LayoutView.prototype.constructor.call(this, options);

          this.search = false;
          this.rendered = false;
          this.selectList = {};

          this.collection = options.collection;
          this.container = options.container;

          this.propagateEventsToRegions();

          this.listenTo(this.collection, "sync", this._handlePendingFilter);

          this.setHeader(options);
          this.setListView(options);
          this.onWinRefresh = _.bind(this.windowRefresh, this);
          $(window).bind("resize.app", this.onWinRefresh);
        },
        tabNextRegion: function (event) {
          if (this.listView.currentlyFocusedElement()) {
            event.preventDefault();
            event.stopPropagation();
            this.listView.setFocus();
          }
        },

        windowRefresh: function () {
          var parentHeight = this.options.parentEl.height();
          if ((!!window.chrome || (navigator.userAgent.indexOf("Firefox") > 0) ) &&
              parentHeight > 0) {
            this.$el.css('height', parentHeight + 'px');
          }
        },
        onDestroy: function () {
          this.$el.off();
          $(window).unbind("resize.app", this.onWinRefresh);
        },

        onRender: function () {
          var self        = this,
              contentList = self.$el.find('.csui-np-content');

          this.viewHeaderRegion.show(this.headerView);
          this.viewContentRegion.show(this.listView);
          this.$el.hover(function () {
            contentList.addClass('binf-focus');
          }, function () {
            contentList.removeClass('binf-focus');
          });

       this.$el.find('*[data-cstabindex]').on('focus', function () {
            var target = $(this);
            self.focusedElement &&
            self.focusedElement.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
            target.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
            self.focusedElement = target;
          });

          this.rendered = true;
          this.trigger('dom:refresh');
        },

        onDomRefresh: function () {
          this.windowRefresh();
        },

        onShow: function () {
          if (!this.rendered) {
            this.render();
          }

          _.each(this.regionManager._regions, function (region) {
            if (region.currentView) {
              region.currentView.trigger('show');
            }
          });
        },

        getNumberOfSelectItems: function () {
          return _.size(this.selectList);
        },

        setNewSelect: function (node, silent) {
          this.clearSelect();
          this._setSelection({node: node, add: true, silent: silent});
        },

        isTabable: function () {
          return this.$('*[tabindex]').length > 0;
        },

        currentlyFocusedElement: function (event) {
          var focusables = this.$el.find('*[tabindex=-1]');
          if (focusables.length) {
            focusables.prop('tabindex', 0);
          }
          if (this.$el.find('.csui-folder-name.binf-hidden').length) {
            return this.$el.find('input');
          } else if (this.$el.find('.csui-targetbrowse-arrow-back .cs-go-back:visible').length && !event.shiftKey) {
            return this.$el.find('.csui-targetbrowse-arrow-back .cs-go-back');
          } else {
            return this.$el.find('.csui-folder-name .icon-sv-search');
          }
        },

        onLastTabElement: function (shiftTab) {
          var tabItems = this.$('[data-cstabindex=-1]'),
              lastItem = tabItems.length - 1;

          if (tabItems.length) {
            var focusElement = shiftTab ? tabItems[0] : tabItems[lastItem];
            this.$('.csui-focus').removeClass('csui-focus');
            return $(focusElement).hasClass(TabableRegionBehavior.accessibilityActiveElementClass);
          }

          return true;
        },

        clearSelect: function () {
          this.listView.clearSelect();
          this.selectList = {};
        },

        setListView: function (options) {
          options || (options = {});
          var self = this,
              args = {
                collection: this.collection,
                container: this.container,
                commandType: options.commandType,
                pageSize: options.pageSize,
                searchView: options.searchView,
                resolveShortcuts: options.resolveShortcuts,
                resultOriginalNode: options.resultOriginalNode,
                context: options.context
              };

          var listView = this.listView = new NodeListView(args);
          this.listenTo(listView, 'selection:change', this._setSelection)
              .listenTo(listView, 'click:location', this._clickLocation)
              .listenTo(listView, 'browse:select',
                  _.bind(this.trigger, this, 'browse:select', this))
              .listenTo(this, "browse:complete",
                  _.bind(listView.trigger, listView, 'browse:complete'));
        },

        selectFolderBack: function (event) {
          if (event.keyCode === 13 || event.keyCode === 32) {
            this.trigger("backbutton:click", this);
          }
        },

        onClickFolderBack: function (event) {
          this.trigger("backbutton:click", this);
        },

        setHeader: function (options) {
          var title = this.container && (this.container.get('name') || '');
          title = (title == null) ? this.options.locationName : title;

          this.headerView = new HeaderView({
            title: title,
            container: this.container,
            searchView: options.searchView
          });

          this.listenTo(this.headerView, 'change:filterValue', this.applyFilter);
        },

        applyFilter: function (searchInfo) {
          _.extend(searchInfo, {type: this.options.listTypes});
          if (this.collection.fetching) {
            this.filterValuePending = searchInfo;
          }
          else {
            var self = this;
            this.collection.setLimit(0, this.options.pageSize, false);
            this.collection.setFilter(searchInfo, false);
            this.collection.fetch({reset: true})
                .fail(function (resp) {
                  self.listView.stopBlocker();
                  self.trigger('search:failed', {resp: resp, view: self});
                });
            this.listView.reset();
          }

        },

        refresh: function () {
          var self = this;
          this.collection.fetch({reset: true})
              .fail(function () {
                self.listView.stopBlocker();
              });
        },

        addFolderSelection: function (node) {
          this._setSelection({browse: true, add: true, node: node});
        },

        _handlePendingFilter: function () {
          if (!_.isEmpty(this.filterValuePending)) {
            this.collection.setFilter(this.filterValuePending);
            this.filterValuePending = {};
          }
        },

        _setSelection: function (args) {
          var id          = args.node.get('id'),
              commandType = this.options.commandType;

          !commandType.multiSelect && (this.selectList = {});

          if (args.add && commandType.isSelectable(args.node)) {
            if(!!commandType.multiSelect) {
              var self = this;
              _.each(this.selectList, function (list) {
                var parentNode = args.node.parent;
                if (list.get("id") === parentNode.get("id")) {
                  self.selectList = {};
                }
              });
            }

            this.selectList[id] = args.node;
          }
          else {
            delete this.selectList[id];
            if(!commandType.multiSelect){
              this.trigger('clear:selectList', args, this);
            }

          }

          if (!args.silent) {
            this.trigger('selection:change', args, this);
          }
        },

        _clickLocation: function (args) {
          this.trigger('click:location', args, this);
        }

      });

      _.extend(SelectView.prototype, LayoutViewEventsPropagationMixin);

      return SelectView;

    });
