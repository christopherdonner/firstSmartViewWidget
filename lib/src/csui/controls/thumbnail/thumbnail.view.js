/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/utils/commands',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/thumbnail/impl/metadata/thumbnail.metadata.view',
  'csui/controls/thumbnail/impl/sort/sort.view',
  'csui/controls/thumbnail/content/content.factory',
  'csui/controls/thumbnail/thumbnail.content',
  'csui/controls/thumbnail/content/thumbnail.icon/thumbnail.icon.view',
  'csui/controls/thumbnail/content/select/select.view',
  'csui/controls/table/cells/searchbox/searchbox.view',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/progressblocker/blocker',
  'hbs!csui/controls/thumbnail/impl/thumbnail.header',
  'hbs!csui/controls/thumbnail/impl/thumbnail.item',
  'hbs!csui/controls/thumbnail/impl/thumbnail',
  'hbs!csui/controls/thumbnail/impl/empty.thumbnail',
  'i18n!csui/controls/thumbnail/impl/nls/lang',
  'css!csui/controls/thumbnail/thumbnail',
  'csui/lib/jquery.mousehover'
], function (module, _, $, Backbone, Marionette, base, commands, DefaultActionBehavior,
    DefaultActionController, PerfectScrollingBehavior, TabableRegionBehavior, ThumbnailMetadataView,
    SortView, ContentFactory, ThumbnailContent, ThumbnailIconView, SelectContentView, SearchBoxView,
    TableActionBarView, LayoutViewEventsPropagationMixin, BlockingView, thumbnailHeaderTemplate,
    thumbnailItemTemplate, thumbnailTemplate, emptyThumbnailTemplate, lang) {
  'use strict';
  var config = _.extend({}, module.config());

  var NoThumbnailView = Marionette.ItemView.extend({

    className: 'csui-thumbnail-empty',
    template: emptyThumbnailTemplate,

    templateHelpers: function () {
      return {
        noResults: (this.options.isFilterApplied ||
                    ([298, 899].indexOf(this._parent.collection.node.get('type')) !== -1)) ?
                   lang.noResults : lang.dragAndDropMessage
      };
    },

    constructor: function NoThumbnailView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onRender: function () {
      this.options.$parentEl.addClass('csui-thumbnail-empty');
    },

    onShow: function () {
      this.$el.addClass('icon-thumbnail-empty-page');
    },

    onDestroy: function () {
      this.options.$parentEl.removeClass('csui-thumbnail-empty');
    }
  });

  var ThumbnailItemView = Marionette.LayoutView.extend({

    className: function () {
      var className = 'csui-thumbnail-item' + ' csui-thumbnail-item-' + this.model.cid;
      if (this.model.inlineFormView) {
        className = className + ' csui-thumbnail-item-form';
      }
      return className;
    },
    template: thumbnailItemTemplate,
    templateHelpers: function () {
      return {
        columns: ThumbnailContent.models,
        isChecked: this.options.thumbnailView.collection.itemchecked
      };
    },

    regions: {
      selectContentRegion: ".csui-thumbnail-select",
      thumbnailIconRegion: ".csui-thumbnail-thumbnailIcon"
    },

    initialize: function () {
      var self = this;
      if (ThumbnailContent && ThumbnailContent.models) {
        _.each(ThumbnailContent.models, function (model, index) {
          var content = ContentFactory.getContentView(model);
          if (content) {
            var region = model.get("key");
            self.addRegion(region, ".csui-thumbnail-" + region);
          }
        }, this);
      }
      if (!base.isTouchBrowser() && this.options.showInlineToolbar) {
        this._subscribeEventHandlers();
      }
      this.model.set('inactive', !this.options.thumbnailView.checkModelHasAction(this.model),
          {silent: true});
      self.ContentFactory = ContentFactory;
    },

    constructor: function ThumbnailItemView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.listenTo(this.model, 'sync', this.render);
    },

    _subscribeEventHandlers: function () {
      this.$el && this.$el.mousehover(
          this.showInlineActions.bind(this),
          this.hideInlineActions.bind(this),
          {namespace: this.cid});
    },

    _unsubscribeEventHandlers: function () {
      if (this._isRendered) {
        this.$el.mousehover('off', {namespace: this.cid});
      }
    },

    showInlineActions: function (e) {
      if (this.$el.find(".csui-inlineform-group").length === 0) {
        var inlineToolbarContainer = this.$el.find('.csui-thumbnail-actionbar');
        if (inlineToolbarContainer.length > 0 &&
            !this.options.originatingView.lockedForOtherContols) {
          var self = this,
              args = {
                sender: self,
                target: inlineToolbarContainer,
                model: self.model
              };
          self.trigger("mouseenter:row", args);
        }
      } else {
        this.$el.find(".csui-thumbnail-select").css({"display": "none"});
      }
    },

    hideInlineActions: function (e) {
      var inlineToolbarContainer = this.$el.find('.csui-thumbnail-actionbar');
      if (inlineToolbarContainer.length > 0) {
        var self = this,
            args = {
              sender: self,
              target: inlineToolbarContainer,
              model: self.model
            };
        self.trigger("mouseleave:row", args);
      }
    },

    onRender: function (e) {
      var self = this;
      if (self.model.isLocallyCreated && !self.model.inlineFormView) {
        this.$el.find('.csui-thumbnail-content-container').addClass('csui-new-item');
      }
      this.selectContentView = new SelectContentView({
        tagName: 'div',
        model: this.options.model,
        thumbnailView: this.options.thumbnailView,
        events: function () {
          if (base.isFirefox()) {
            return _.extend({}, SelectContentView.prototype.events, {
              'keydown': self.onKeyInView
            });
          }
          return SelectContentView.prototype.events;
        }
      });
      this.selectContentRegion.show(this.selectContentView);
      if (this.options.model.get('csuiIsSelected')) {
        this.selectContentRegion.$el.addClass('csui-checkbox');
        this.$el.addClass('csui-thumbnail-item-selected');
      }
      if (this.options.model.get(SelectContentView.isSelectedModelAttributeName)) {
        this.$el.addClass('csui-thumbnail-item-selected');
      }
      self.listenTo(this.selectContentView, 'clicked:checkbox', function (event) {
        if (this.options.thumbnailView.activeInlineForm && event.checked) {
          this.options.thumbnailView.cancelAnyExistingInlineForm();
        }
        self.showToolBarActions(event);
        if (event.checked) {
          if (this.options.thumbnailView.resultsView.inlineToolbarView) {
            this.options.thumbnailView.resultsView.inlineToolbarView.destroy();
          }
          self._parent.$el.find(".csui-thumbnail-select").addClass(
              'csui-checkbox');
          self.$el.addClass('csui-thumbnail-item-selected');

          self.model.set(SelectContentView.isSelectedModelAttributeName, true);
          self.model.attributes.isSelected = true;
        } else {
          self.$el.removeClass('csui-thumbnail-item-selected');
          self.model.set(SelectContentView.isSelectedModelAttributeName, false);
          self.model.attributes.isSelected = false;
          var selectedModelsCount = 0;
          _.each(self._parent.collection.models, function (model) {
            if (!!model.attributes.csuiIsSelected) {
              selectedModelsCount++;
            }
          });

          if (selectedModelsCount === 0 ||
              (!!self.model.get('selectAllThumbnailsEnabled') &&
               (selectedModelsCount === 0))) {
            self._parent.$el.find(".csui-thumbnail-select").removeClass('csui-checkbox');
            self.$el.removeClass('csui-thumbnail-item-selected');
          }
        }
        this.options.thumbnailHeaderView.trigger('selectOrUnselect.mixed');
      });
      this.thumbnailIconView = new ThumbnailIconView({
        model: this.options.model,
        context: this.options.context,
        column: {defaultAction: true},
        originatingView: this.options.originatingView
      });
      this.thumbnailIconRegion.show(this.thumbnailIconView);
      this.listenTo(this.thumbnailIconView, 'execute:defaultAction', function (event) {
        event.preventDefault();
        event.stopPropagation();
        self.options.thumbnailView.trigger("execute:defaultAction", self.model);
      });
      if (ThumbnailContent && ThumbnailContent.models) {
        _.each(ThumbnailContent.models, function (model, index) {
          var content = ContentFactory.getContentView(model);
          if (content) {
            var region        = model.get("key"),
                defaultAction = model.get("defaultAction"),
                conFactory    = model.get("showoverview") ? ContentFactory : undefined,
                name          = model.get("key");
            var contentView = new content({
              tagName: 'DIV',
              model: self.model,
              context: self.options.context,
              column: {name: name, defaultAction: defaultAction},
              ContentFactory: conFactory,
              displayLabel: model.get("displayLabel"),
              displayTitle: model.get("displayTitle"),
              displayIcon: true,
              originatingView: self.options.originatingView,
              selectedChildren: this.options.thumbnailView.options.selectedChildren,
              collection: this.options.thumbnailView.options.collection,
              columns: this.options.columns
            });
            self.model.collection = this.options.thumbnailView.options.collection;
            self[region].show(contentView);
            self.listenTo(contentView, 'clicked:content', function (event) {
              self.trigger('clicked:content', {
                contentView: contentView,
                rowIndex: self._index,
                colIndex: index,
                model: self.model
              });
            });
            self.listenTo(contentView, 'execute:defaultAction', function (event) {
              event.preventDefault();
              event.stopPropagation();
              self.options.thumbnailView.trigger("execute:defaultAction", self.model);
            });
            self.listenTo(contentView, 'show:add:favorite:form', function () {
              self.hideInlineActions();
              self.options.originatingView.lockedForOtherContols = true;
            });
            self.listenTo(contentView, 'close:add:favorite:form', function () {
              self.options.originatingView.lockedForOtherContols = false;
            });
            self.listenTo(contentView, 'shown:overview:flyout', function () {
              self.hideInlineActions();
              self.options.originatingView.lockedForOtherContols = true;
            });
            self.listenTo(contentView, 'hide:overview:flyout', function () {
              self.options.originatingView.lockedForOtherContols = false;
            });
          }
        }, this);
      }
    },

    showToolBarActions: function (event) {
      var self         = this,
          args         = {},
          selectedNode = [];
      if (event.checked) {
        self.model.set(SelectContentView.isSelectedModelAttributeName, true, {silent: true});
        self.model.attributes.isSelected = true;
      } else {
        this._subscribeEventHandlers();
        self.model.set(SelectContentView.isSelectedModelAttributeName, false, {silent: true});
        self.model.attributes.isSelected = false;
      }
      this.options.thumbnailView.showToolBarActions();
    },

    getSelectedChildren: function () {
      return this.model.collection.where({csuiIsSelected: true});
    }
  });

  var ThumbnailListView = Marionette.CollectionView.extend({

    className: 'csui-thumbnail-collection',

    childView: ThumbnailItemView,

    childViewOptions: function () {
      return {
        context: this.options.context,
        showInlineToolbar: this.showInlineToolbar,
        toolbarItems: this.options.inlineBar.options.collection,
        toolbarItemsMasks: this.options.inlineBar.options.toolItemsMask,
        originatingView: this.options.originatingView,
        thumbnailView: this.options.thumbnailView,
        thumbnailHeaderView: this.options.thumbnailHeaderView,
        tableColumns: this.options.tableColumns,
        columns: this.options.columns
      };
    },

    childEvents: {
      'mouseenter:row': 'onChildShowInlineActionBarWithDelay',
      'mouseleave:row': 'onChildActionBarShouldDestroy'
    },

    emptyView: NoThumbnailView,
    emptyViewOptions: function () {
      return {
        isFilterApplied: _.some(this.collection.filters, function (filter) {
          return filter && filter.trim().length > 0;
        }),
        $parentEl: this.$el,
        model: this.emptyModel
      };
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    constructor: function ThumbnailListView(options) {
      options || (options = {});
      this.context = options.context;
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.showInlineToolbar = (this.options.inlineBar.options.collection &&
                                this.options.inlineBar.options.toolItemsMask);
      if (this.showInlineToolbar) {
        this.setInlineActionBarEvents();
      }
      $(window).bind('resize', _.bind(this._adjustThumbnailWidth, this));
    },

    setInlineActionBarEvents: function () {
      this.listenTo(this, 'closeOther', this._destroyInlineActionBar);
      this.listenTo(this.collection, "reset", this._destroyInlineActionBar);
    },

    _destroyInlineActionBar: function () {
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
        this.inlineToolbarView = undefined;
      }
    },

    _showInlineActionBar: function (args) {
      if (this.inlineToolbarView) {
        this._savedHoverEnterArgs = args;
      } else if (!!args) {
        this._savedHoverEnterArgs = null;

        this.inlineToolbarView = new TableActionBarView(_.extend({
              context: this.options.context,
              commands: commands,
              collection: this.options.inlineBar.options.collection,
              toolItemsMask: this.options.inlineBar.options.toolItemsMask,
              originatingView: this.options.originatingView,
              model: args.model,
              status: {
                targetView: args.sender,
                connector: this.options.collection.connector
              }
            }, this.options.inlineBar.options)
        );

        this.listenTo(this.inlineToolbarView, 'before:execute:command', function (eventArgs) {
          this.lockedForOtherContols = true;
          if (eventArgs && eventArgs.status && eventArgs.status.targetView &&
              eventArgs.status.targetView.$el) {
            eventArgs.status.targetView.$el.addClass("active-row");
          }
          this._destroyInlineActionBar();
        });
        this.listenTo(this.inlineToolbarView, 'after:execute:command', function (eventArgs) {
          this.lockedForOtherContols = false;
          if (eventArgs && eventArgs.status && eventArgs.status.targetView &&
              eventArgs.status.targetView.$el) {
            eventArgs.status.targetView.$el.removeClass("active-row");
          }
        });

        if (this.options.originatingView) {
          this.listenTo(this.options.originatingView, "block:view:actions", function () {
            this.lockedForOtherContols = true;
            this._destroyInlineActionBar();
          });
          this.listenTo(this.options.originatingView, "unblock:view:actions", function () {
            this.lockedForOtherContols = false;
          });
        }

        this.inlineToolbarView.render();
        this.listenTo(this.inlineToolbarView, 'destroy', function () {
          this.inlineToolbarView = undefined;
          if (this._savedHoverEnterArgs) {
            this.onChildShowInlineActionBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);
        $(args.target).append(this.inlineToolbarView.$el);
        this.inlineToolbarView.triggerMethod("show");
      }
    },

    onChildShowInlineActionBarWithDelay: function (childView, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
      }
      var self = this;
      self.isSelected = self.collection.where({csuiIsSelected: true}).length > 0;
      self._showInlineActionbarTimeout = setTimeout(function () {
        self._showInlineActionbarTimeout = undefined;
        self.lockedForOtherContols = self.options.thumbnailView && self.options.thumbnailView.lockedForOtherContols;
        if (!self.lockedForOtherContols && !self.isSelected) {
          !self.isSelected && self._showInlineActionBar.call(self, args);
        }
      }, 200);
    },

    onChildActionBarShouldDestroy: function (childView, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
        this._showInlineActionbarTimeout = undefined;
      }
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
      }
    },
    showOrHideZeroRecordsMessage: function () {
      this.$el.find('div.csui-thumbnail-empty').remove();
      if (this.collection.length === 0) {
        this.$el.addClass("csui-thumbnail-empty");
        var emptyThumbnailText = "", zeroRecords;
        if (this._showingEmptyView) {
          zeroRecords = (this.collection.node.get("container") &&
                        ([298, 899].indexOf(this.collection.node.get('type')) !== -1)) &&
                        lang.noResults;

          emptyThumbnailText = (!!this.collection.filters && this.collection.filters.name ?
                                lang.noResults : lang.dragAndDropMessage);
          emptyThumbnailText = zeroRecords ? zeroRecords : emptyThumbnailText;
        }
        var emptyEl = $(
            "<div class='csui-thumbnail-empty  icon-thumbnail-empty-page'><p class='csui-no-result-message' title='" +
            emptyThumbnailText + "'>" + emptyThumbnailText + "</p></div>");
        this.$el.append(emptyEl);
      } else {
        this.$el.removeClass("csui-thumbnail-empty");
        this.$el.removeClass("icon-thumbnail-empty-page");
      }
    },

    onRender: function () {
      this.showOrHideZeroRecordsMessage();
      this._adjustThumbnailWidth();
    },

    _adjustThumbnailWidth: function () {
      var thumbnailViewItem             = this.$el.find('.csui-thumbnail-item'),
          thumbnailViewItemWidth        = 190, //min, max width                   
          parentWidth                   = $('.csui-table-facetview .csui-facet-panel').length > 0 ?
                                          $('.csui-facet-table-container').width() -
                                          $('.csui-table-facetview').width() :
                                          $('.cs-thumbnail-wrapper').width(),
          spaceBetweenItems             = 2,
          thumbnailViewItemWidthPercent = thumbnailViewItemWidth / parentWidth * 100;
      for (var i = 1; i <= thumbnailViewItem.length; i++) {
        var thumbnailViewItemTotalWidth = i * thumbnailViewItemWidthPercent;
        if (thumbnailViewItemTotalWidth > 100) {
          i = i - 1;
          thumbnailViewItemWidthPercent = 100 / i;
          break;
        }
      }
      thumbnailViewItem.css({
        'maxWidth': "calc(" + thumbnailViewItemWidthPercent + '% - ' + spaceBetweenItems * 2 +
                    "px)",
        'minWidth': "calc(" + thumbnailViewItemWidthPercent + '% - ' + spaceBetweenItems * 2 +
                    "px)"
      });
    }
  });

  var ThumbnailHeaderView = Marionette.LayoutView.extend({

    className: 'csui-thumbnail-header',

    tagName: 'div',

    regions: {
      sortRegion: '#csui-sorting-container',
      searchRegion: '#csui-thumbnail-column-search'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },

    ui: {
      selectAll: '.csui-selectAll-input'
    },

    events: {
      "keydown": "onKeyInView",
      'click @ui.selectAll': 'selectAllThumbnails'
    },

    template: thumbnailHeaderTemplate,

    templateHelpers: function () {
      return {
        columns: this.options.thumbnailColumns,
        addTitle: lang.addTitle,
        selectAll: lang.selectAll,
        selectAllTitle: lang.selectAllTitle,
        isEmptyNode: this.collection.models.length === 0,
        items: base.formatMessage(this.collection.length, lang)
      };
    },

    constructor: function ThumbnailHeaderView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.columnsWithSearch = options.columnsWithSearch || [];
      this.listenTo(this, 'selectOrUnselect.mixed', this.thumbnailItemClicked);
    },

    sortmenurender: function (name) {
      this.options.thumbnailView.resultsView.render();
      this.sortRegion.$el.find('button.binf-dropdown-toggle').focus();
    },

    thumbnailItemClicked: function () {
      var selection = this.collection.filter(function (model) {
        return model.get(SelectContentView.isSelectedModelAttributeName);
      });
      var all = selection.length === this.collection.length;
      if (selection.length > 0 && !all) {
        this.$el.find('.csui-selected-checkbox').addClass('csui-checkbox-atleastone');
      } else {
        this.$el.find('.csui-selected-checkbox').removeClass('csui-checkbox-atleastone');
      }
      this.$(".csui-selectAll-input").prop("checked", all);
    },

    selectAllThumbnails: function (event) {
      if (this.options.thumbnailView.activeInlineForm) {
        this.options.thumbnailView.cancelAnyExistingInlineForm();
      }
      this.$el.find('.csui-checkbox-atleastone').removeClass('csui-checkbox-atleastone');
      this.trigger('selectOrUnselect.all', event.target.checked);
      if (this.collection.where({csuiIsSelected: true}).length > 0) {
        this.trigger('selectOrUnselect.mixed');
      }
    },

    onRender: function (e) {
      var event         = e || window.event,
          thumbnailView = this.options.thumbnailView;
      this.focusIndex = 0;
      var length = thumbnailView.$el.find('.csui-thumbnail-item-selected').length;
      if (this.collection.where({csuiIsSelected: true}).length > 0) {
        this.trigger('selectOrUnselect.mixed');
      } else if (length > 0) {
        thumbnailView.$el.find('.csui-checkbox').removeClass();
        this.trigger('selectOrUnselect.all', event.target && event.target.checked);
      } else if (length === 0) {
        var selectedNodes = thumbnailView.getSelectedChildren();
        thumbnailView.options.selectedChildren &&
        thumbnailView.options.selectedChildren.reset(selectedNodes);
      }
      var sortView = new SortView({
        collection: this.collection,
        resultView: this
      });
      this.sortRegion.show(sortView);
      this.listenTo(sortView, 'render:sortmenu', this.sortmenurender);
      this.ensureAllSearchBox();
    },

    ensureAllSearchBox: function () {
      var self          = this,
          thumbnailView = this.options.thumbnailView,
          searchWrapper = this.$el.find('.csui-thumbnail-column-search'),
          sortWrapper   = this.$el.find('.csui-sorting-container'),
          columnName    = "name";
      if ($(this).find('.csui-thumbnail-column-search').length === 0) {
        var searchbox = new SearchBoxView(self.collection.filters[columnName], {
          column: columnName,
          columnTitle: lang.name
        });
        self.searchBoxes = searchbox;
        searchbox.on('change:filterValue', function (data) {
          self.applyFilter(data);
        });
        searchbox.on('opened', function () {
          sortWrapper.addClass('binf-hidden');
          self.searchColumn = columnName;
        });
        searchbox.on('closed', function () {
          sortWrapper.removeClass('binf-hidden');
          self.collection.filters[columnName] = undefined;
        });
        this.searchRegion.show(self.searchBoxes);
        if (columnName === self.searchColumn) {
          searchbox.setFocus();
        }
        searchWrapper = $(this).find('.csui-table-column-search');
        if (searchWrapper) {
          searchWrapper.attr('aria-label',
              _.str.sformat(lang.searchIconTooltip, lang.name));
        }
      }
    },
    applyFilter: function (data) {
      var filterObj = {};
      filterObj[data.column] = data.keywords;
      if (this.collection.fetching) {
        this.filterValuePending = filterObj;
      } else {
        this.collection.resetLimit(false);
        this.collection.setFilter(filterObj);
      }
    }
  });

  var ThumbnailView = Marionette.LayoutView.extend({

    className: 'csui-thumbnail-container',
    template: thumbnailTemplate,
    regions: {
      headerRegion: '#csui-thumbnail-header',
      resultsRegion: '#csui-thumbnail-results'
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-thumbnail-results',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    constructor: function ThumbnailView(options) {
      options || (options = {});
      this.options = options;
      if (options.actionItems && options.commands) {
        this.defaultActionController = new DefaultActionController({
          actionItems: options.actionItems,
          commands: options.commands
        });
        this.checkModelHasAction = this.defaultActionController.hasAction.bind(
            this.defaultActionController);
      } else {
        this.checkModelHasAction = function () {
          return true;
        };
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.context = options.context;
      this.collection = options.collection;
      var checkSelection = this.collection.where({csuiIsSelected: true});
      this.collection.itemchecked = false;
      if (checkSelection.length > 0) {
        this.collection.itemchecked = true;
      }
      BlockingView.imbue(this);
      this.listenTo(this.collection, "update", this._handleModelsUpdate);
      this.listenTo(this.collection, "change", _.debounce(this.updateRow, 100));

      if (this.context) {
        this.listenTo(this.context, 'request', this._handleContextRequest)
            .listenTo(this.context, 'sync error', this._handleContextFinish)
            .listenTo(this.context, 'sync', this._handleContextSync);
      }

      if (this.collection.node) {
        this.listenTo(this.collection.node, "change:id", this._clearSearchBoxes);
      }

      this.listenTo(this.collection, "request", this.blockActions)
          .listenTo(this.collection, "sync", this.unblockActions)
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "error", this.unblockActions);

      this._ViewCollection = Backbone.Collection.extend({
        model: this.collection.model
      });
      this.selectedChildren = new this._ViewCollection();
      var self = this;
      this.el.addEventListener('scroll', function () {
        self.trigger('scroll');
      }, true);
      this.listenTo(this.collection, "reset", this._updateSelectedChildren);
      this.listenTo(this.collection, "new:page", this.resetScrollToTop);
      this.listenTo(this.collection, "reset", function () {
        if (!this._isRendered) {
          return;
        }
        this.resetScrollToTop();  // reset scroll when navigating from breadcrumb
        if (this.thumbnailHeaderView) {
          this.thumbnailHeaderView.render();
        }
      });
    },

    _updateSelectedChildren: function () {
      if (!this._isRendered) {
        return;
      }
    },

    _handleContextRequest: function () {
      this._fetchingContext = true;
      this._columnsReset = false;
      this._collectionReset = false;
    },

    _handleContextSync: function () {
      if (!this._isRendered) {
        return;
      }
      if (this._columnsReset) {
        this.rebuild();
      } else if (this._collectionReset) {
        this.render();
      }
    },

    _handleContextFinish: function () {
      this._fetchingContext = false;
    },

    resetScrollToTop: function () {
      if (this._isRendered && this.resultsRegion) {
        this.resultsRegion.$el.scrollTop(0);
      }
    },

    onDestroy: function () {
      if (this._originalScope) {
        this.options.collection.setResourceScope(this._originalScope);
      }
    },

    _handleModelsUpdate: function (collection, options) {
      if (!this._isRendered) {
        return;
      }
      var models = options.changes.added,
          self   = this;
      if (models.length > 0) {
        _.each(models, function (model) {
          model.unset(SelectContentView.isSelectedModelAttributeName);
        });
        this.triggerMethod('before:render', this);
        var nodeModel = null;
        _.each(models, function (model) {
          nodeModel = model;
        });
        if (nodeModel.inlineFormView) {
          if (self.activeInlineForm) {
            self.activeInlineForm.destroy();
          }
          self.activeInlineForm = new nodeModel.inlineFormView({
            model: nodeModel,
            originatingView: self.options.originatingView,
            context: self.context
          });
          var className = '.csui-thumbnail-name-' + nodeModel.cid;
          var divForInlineForm = this.$el.find(className);
          self.activeInlineForm.listenTo(self.activeInlineForm, 'destroy', function () {
            self.lockedForOtherContols = false;
            delete self.activeInlineForm;
          });
          var inlineFormRegion = new Marionette.Region({el: divForInlineForm});
          inlineFormRegion.show(self.activeInlineForm);
        }
        this.resultsView.showOrHideZeroRecordsMessage();
        this._adjustThumbnailWidth();
        this.trigger('dom:refresh');  // fix for perfect scrollbar on updating collection (adding or removing node)
        _.each(models, function (model) {
          if (model.isLocallyCreated && !model.inlineFormView) {
            self.$el.find(".csui-thumbnail-item-" + model.cid).find(
                ".csui-thumbnail-content-container").addClass("csui-new-item");
          }
        });
      }
      if (this.thumbnailHeaderView) {
        this.thumbnailHeaderView.render();
      }
    },

    _maintainNodeState: function (model) {
      var nodeModel = model,
          self      = this;
      if (model && !!model.inlineFormView) {
        self.activeInlineForm = new nodeModel.inlineFormView({
          model: nodeModel,
          originatingView: self.options.originatingView,
          context: self.context
        });
        self.$el.find('.csui-thumbnail-item-' + nodeModel.cid).addClass('csui-thumbnail-item-form');
        var className = '.csui-thumbnail-name-' + nodeModel.cid;
        var divForInlineForm = this.$el.find(className);
        var inlineFormRegion = new Marionette.Region({el: divForInlineForm});
        inlineFormRegion.show(self.activeInlineForm);
      }
      else {
        return false;
      }
    },

    updateRow: function (collectionOrModel) {
      if (collectionOrModel.isLocallyCreated) {
        this.$el.find(".csui-thumbnail-item-form") &&
        this.$el.find(".csui-thumbnail-item-form").find(
            ".csui-thumbnail-content-container").addClass("csui-new-item");
      }
      this.isSelected = this.collection.where({csuiIsSelected: true}).length > 0;
      if (collectionOrModel.inlineFormView) {
        this.options.originatingView.updateRowIndex = this.collection.indexOf(collectionOrModel);
        var self = this;

        if (self.activeInlineForm && self.activeInlineForm.model !== collectionOrModel) {
          this.$el.find(".csui-thumbnail-item-form").removeClass('csui-thumbnail-item-form');
          this.$el.find(".csui-thumbnail-item-form").removeClass('csui-thumbnail-item-rename-form');
          this.activeInlineForm.model.trigger('sync');
          this.cancelAnyExistingInlineForm({silent: true});
        }
        self.activeInlineForm = new collectionOrModel.inlineFormView({
          model: collectionOrModel,
          originatingView: self.options.originatingView,
          context: self.context
        });
        this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).addClass(
            "csui-thumbnail-item-rename-form");
        var className = '.csui-thumbnail-name-' + collectionOrModel.cid;
        var divForInlineForm = this.$el.find(className);
        self.activeInlineForm.listenTo(self.activeInlineForm, 'destroy', function () {
          self.lockedForOtherContols = false;
          self.activeInlineForm.model.trigger('sync');
          delete self.activeInlineForm;
        });
        this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).removeClass(
            'csui-thumbnail-item-apply-transition');

        self.$el.find(".csui-thumbnail-item-" + self.activeInlineForm.model.cid).addClass(
            'csui-thumbnail-item-form');
        var inlineFormRegion = new Marionette.Region({el: divForInlineForm});
        inlineFormRegion.show(self.activeInlineForm);

        self.$el.find(".csui-thumbnail-item-" + self.activeInlineForm.model.cid).removeClass(
            'csui-thumbnail-item-rename-form');
            self.lockedForOtherContols = true;
        self.$el.find(".csui-thumbnail-item-" + self.activeInlineForm.model.cid).find(
            "div.csui-thumbnail-overview-icon").addClass("binf-hidden");
        if (this.$el.find(".csui-thumbnail-item-form") &&
            this.$el.find(".csui-thumbnail-item-form").find(
                ".csui-thumbnail-content-container .csui-inlineform-error").length > 0) {
          this.$el.find(".csui-thumbnail-item-form").find(
              ".csui-thumbnail-content-container.csui-new-item").addClass("csui-new-item-error");
          collectionOrModel.isLocallyCreated = true;
        }
      } else {
        this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).removeClass(
            'csui-thumbnail-item-form');
        this.$el.find(".csui-thumbnail-item-" + collectionOrModel.cid).addClass(
            'csui-thumbnail-item-apply-transition');
        if (this.activeInlineForm && this.activeInlineForm.model.cid === collectionOrModel.cid) {
          this.activeInlineForm.model.trigger('sync');
          this.cancelAnyExistingInlineForm({silent: true});
        }
        if (this.collection && this.collection.filters.name) {
          this.thumbnailHeaderView.searchBoxes.setFocus();
        }
        if (this.$el.find(
                ".csui-thumbnail-content-container.csui-new-item.csui-new-item-error").length > 0) {
          this.$el.find(
              ".csui-thumbnail-content-container.csui-new-item.csui-new-item-error").removeClass(
              "csui-new-item-error");
        }
      }
    },

    onAfterShow: function () {
      this.thumbnailHeaderView.searchBoxes.setFocus();
    },

    _adjustThumbnailWidth: function () {
      var thumbnailViewItem             = this.$el.find('.csui-thumbnail-item'),
          thumbnailViewItemWidth        = 190, //min, max width          
          parentWidth                   = $('.csui-table-facetview .csui-facet-panel').length > 0 ?
                                          $('.csui-facet-table-container').width() -
                                          $('.csui-table-facetview').width() :
                                          $('.cs-thumbnail-wrapper').width(),
          spaceBetweenItems             = 2,
          thumbnailViewItemWidthPercent = thumbnailViewItemWidth / parentWidth * 100;
      for (var i = 1; i <= thumbnailViewItem.length; i++) {
        var thumbnailViewItemTotalWidth = i * thumbnailViewItemWidthPercent;
        if (thumbnailViewItemTotalWidth > 100) {
          i = i - 1;
          thumbnailViewItemWidthPercent = 100 / i;
          break;
        }
      }
      thumbnailViewItem.css({
        'maxWidth': "calc(" + thumbnailViewItemWidthPercent + '% - ' + spaceBetweenItems * 2 +
                    "px)",
        'minWidth': "calc(" + thumbnailViewItemWidthPercent + '% - ' + spaceBetweenItems * 2 +
                    "px)"
      });
    },

    cancelAnyExistingInlineForm: function (options) {
      if (this.activeInlineForm) {
        this.activeInlineForm.cancel(options);
      }
    },

    startCreateNewModel: function (newNode, inlineFormView) {
      this.cancelAnyExistingInlineForm();
      if (this.collection && this.collection.node) {
        newNode.set("parent_id", this.collection.node.get('id'));
        newNode.isLocallyCreated = true;
        newNode.inlineFormView = inlineFormView;
        this.collection.add(newNode, {at: 0});
        this._adjustThumbnailWidth();
      }
    },

    _clearSearchBoxes: function () {
      if (!this._isRendered) {
        return;
      }
      _.each(this.searchBoxes, function (sb) {
        sb.hideAndClear();
      });
    },

    onRender: function () {
      this.thumbnailHeaderView = new ThumbnailHeaderView({
        columns: this.displayedColumns,
        context: this.context,
        columnsWithSearch: this.options.columnsWithSearch,
        filterBy: this.options.filterBy,
        collection: this.options.collection,
        thumbnailView: this
      });
      this.headerRegion.show(this.thumbnailHeaderView);
      var self = this;
      this.listenTo(this.thumbnailHeaderView, 'selectOrUnselect.all', function (isSelectAll) {
        if (isSelectAll) {
          if (self.collection.models.length > 0) {
            _.each(self.collection.models, function (model) {
              model.set(SelectContentView.isSelectedModelAttributeName, true);
              model.attributes.selectAllThumbnailsEnabled = true;
              model.attributes.isSelected = true;
            });
          }
          self.$el.find(".csui-thumbnail-results .csui-thumbnail-select").addClass('csui-checkbox');
          self.$el.find(".csui-thumbnail-results .csui-thumbnail-item").addClass(
              'csui-thumbnail-item-selected');
        } else {
          if (self.collection.models.length > 0) {
            _.each(self.collection.models, function (model) {
              model.set(SelectContentView.isSelectedModelAttributeName, false);
              model.attributes.selectAllThumbnailsEnabled = false;
              model.attributes.isSelected = false;
            });
            self.$el.find(".csui-thumbnail-select").removeClass('csui-checkbox');
            self.$el.find(".csui-thumbnail-results .csui-thumbnail-item").removeClass(
                'csui-thumbnail-item-selected');

          }
        }
        self.showToolBarActions();
      });

      this.resultsView = new ThumbnailListView({
        context: this.options.context,
        collection: this.options.collection,
        thumbnailView: this,
        originatingView: this.options.originatingView,
        inlineBar: this.options.inlineBar,
        thumbnailHeaderView: this.thumbnailHeaderView,
        tableColumns: this.options.tableColumns,
        columns: this.options.columns
      });
      this.showToolBarActions();
      this.resultsRegion.show(this.resultsView);
    },

    showToolBarActions: function (e) {
      var selectedNodes = this.getSelectedChildren();
      this.options.selectedChildren.reset(selectedNodes);
    },
    getSelectedChildren: function () {
      var self          = this,
          selectedNodes = [];
      this.options.collection.each(function (model) {
        if (!!model.get('csuiIsSelected')) {
          selectedNodes.push(model);
        }
      });
      return selectedNodes;
    }
  });

  _.extend(ThumbnailView.prototype, LayoutViewEventsPropagationMixin);

  return ThumbnailView;
});
