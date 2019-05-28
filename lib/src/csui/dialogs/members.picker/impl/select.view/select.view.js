/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(
    ["module", "csui/lib/jquery", "csui/lib/underscore", 'csui/lib/backbone', "csui/lib/marionette",
      "csui/utils/log", "csui/utils/base",
      'csui/dialogs/members.picker/impl/member.list/member.list.view',
      'csui/controls/list/list.view',
      'csui/behaviors/keyboard.navigation/tabable.region.behavior',
      'csui/dialogs/members.picker/impl/select.view/impl/header/header.view',
      'hbs!csui/dialogs/members.picker/impl/select.view/impl/select.view',
      'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
      'i18n!csui/dialogs/members.picker/impl/nls/lang',
      'css!csui/dialogs/members.picker/impl/select.view/impl/select.view'
    ], function (module, $, _, Backbone, Marionette, log, base,
        MemberListView, Lview,TabableRegionBehavior, HeaderView, template, LayoutViewEventsPropagationMixin, lang) {

      var SelectView = Marionette.LayoutView.extend({

        template: template,
        templateHelpers: function () {
          return {
            backButtonTooltip: lang.backButtonTooltip,
            backButtonAria: lang.backButtonTooltip
          };
        },
        regions: {
          viewHeaderRegion: '.csui-mp-header',
          viewContentRegion: '.csui-mp-content'
        },
        ui: {
          "backButton": ".csui-targetbrowse-arrow-back"
        },

        behaviors: {
          TabableRegion: {
            behaviorClass: TabableRegionBehavior
          }
        },

        events: {
          'click @ui.backButton': 'onClickFolderBack',
          'keydown @ui.backButton': 'selectFolderBack'
        },

        constructor: function SelectView(options) {
          options || (options = {});
          _.defaults(options, {pageSize: 30});

          Marionette.LayoutView.prototype.constructor.call(this, options);

          this.rendered = false;
          this.selectedMember = null;

          this.collection = options.collection;
          this.completeCollection = options.collection;
          this.originalModels = options.collection.models;
          this.container = options.container;

          this.propagateEventsToRegions();

          this.setHeader(options);
          this.setListView(options);
          this.onWinRefresh = _.bind(this.windowRefresh, this);
          $(window).bind("resize.app", this.onWinRefresh);
        },

        windowRefresh: function () {
          var parentHeight = this.options.parentEl.height();
          if ((!!window.chrome || (navigator.userAgent.indexOf("Firefox") > 0)) &&
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
              contentList = self.$el.find('.csui-mp-content');

          this.viewHeaderRegion.show(this.headerView);
          this.viewContentRegion.show(this.listView);
          this.$el.hover(function () {
            contentList.addClass('binf-focus');
          }, function () {
            contentList.removeClass('binf-focus');
          });

          this.rendered = true;
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
          return this.selectedMember !== null ? 1 : 0;
        },

        setNewSelect: function (member, silent) {
          this.clearSelect();
          this._setSelection({member: member, add: true, silent: silent});
        },

        clearSelect: function () {
          !!this.listView && this.listView.clearSelect();
          this.selectedMember = null;
        },

        setListView: function (options) {
          options || (options = {});
          var args = {
            collection: this.collection,
            container: this.container,
            commandType: options.commandType,
            pageSize: options.pageSize
          };

          var listView = this.listView = new MemberListView(args);
          this.listenTo(listView, 'selection:change', this._setSelection)
              .listenTo(listView, 'browse:select',
                  _.bind(this.trigger, this, 'browse:select', this))
              .listenTo(this, "browse:complete",
                  _.bind(listView.trigger, listView, 'browse:complete'));
        },

        selectFolderBack: function (event) {
          if (event.keyCode === 13 || event.keyCode === 32) {
            event.preventDefault();
            event.stopPropagation();
            this.trigger("backbutton:click", this);
          }
        },

        onClickFolderBack: function (event) {
          event.preventDefault();
          event.stopPropagation();
          this.trigger("backbutton:click", this);
        },

        setHeader: function () {
          var title = this.container && (this.container.get('name') || this.options.displayName);
          title = (title === null) ? this.options.locationName : title;

          this.headerView = new HeaderView({
            title: title,
            container: this.container,
            searchView: this.options.searchView
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

        stopBlocker: function () {
          this.listView.stopBlocker();
        },

        addMemberSelection: function (member) {
          this._setSelection({
            browse: true,
            add: true,
            breadCrumbSelection: true,
            member: member,
            type: 1
          });
        },

        _setSelection: function (args) {
          var id          = args.member.get('id'),
              commandType = this.options.commandType;

          this.selectedMember = null;

          if (args.add && commandType.isSelectable(args.member)) {
            this.selectedMember = args.member;
          }

          if (!args.silent) {
            this.trigger('selection:change', args, this);
          }
        }
      });

      _.extend(SelectView.prototype, LayoutViewEventsPropagationMixin);

      return SelectView;

    });
