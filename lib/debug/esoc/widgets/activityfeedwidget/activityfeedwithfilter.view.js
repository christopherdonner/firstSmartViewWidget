csui.define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'esoc/widgets/activityfeedwidget/activityfeedfactory',
  "esoc/widgets/activityfeedwidget/activityfeed.view",
  "esoc/widgets/activityfeedwidget/activityfeedfilter.view",
  'esoc/widgets/activityfeedwidget/util',
  'hbs!esoc/widgets/activityfeedwidget/impl/activityfeedwithfilter',
  'csui/controls/progressblocker/blocker',
  'csui/utils/namedsessionstorage',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin'
], function (_require, $, _, Backbone, Marionette, ItemCollection, ActivityFeedView,
    ActivityFeedFilterView, Util, ActivityFeedWithFilterTemplate, BlockingView,
    NamedSessionStorage, PerfectScrollingBehavior, TabablesBehavior, TabableRegionBehavior,
    LayoutViewEventsPropagationMixin) {
  var ActivityFeedWithFilterView = Marionette.LayoutView.extend({
    className: 'esoc-activityfeed-with-filter',
    feedCount: 0,
    initialActivationWeight: 0,
    template: ActivityFeedWithFilterTemplate,
    namedSessionStorage: new NamedSessionStorage("esoc-activity-filterinfo"),
    regions: {
      filterRegion: '.esoc-activityfeed-filter',
      feedRegion: '.esoc-acitivityfeed-collection'
    },
    templateHelpers: function () {
      return {
        messages: {
          enableFilters: this.options.feedSettings.enableFilters
        }
      };
    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: ".esoc-acitivityfeed-collection",
        suppressScrollX: true
      },
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    onLastTabElement: function (shiftTab) {
      var tabItems = this.$('[data-cstabindex=0]').filter(":visible"),
          lastItem = tabItems.length - 1;
      if (tabItems.length) {
        var focusElement = shiftTab ? tabItems[0] : tabItems[lastItem];
        return $(focusElement).hasClass(TabableRegionBehavior.accessibilityActiveElementClass);
      }
      return true;
    },

    currentlyFocusedElement: function (event) {
      var element = this.focusedElement;
      if (!event || !event.shiftKey) {
        return this.$el.find("a.esoc-activityfeed-filter-types");
      } else if (element && $(element).length) {
        return element;
      }
    },

    events: {"keydown": "onKeyInView"},
    constructor: function ActivityFeedWithFilterView(options) {
      options || (options = {});
      this.options = options;
      this.listenToOnce(this, 'before:hide', TabablesBehavior.popTabableHandler);
      this.propagateEventsToRegions();
      if (!!!this.options.collection) {
        Util.commonUtil.fillDefaultActivityOptions(options);
        if (this.options.feedtype !== undefined) {
          ItemCollection.prototype.propertyPrefix = Util.commonUtil.getActivityWidgetId(
              this.options);
          ItemCollection.prototype.uniqueid = Util.commonUtil.getActivityWidgetId(this.options);
        }
        var sessionFilterInfo,
            filterInfoKey = this.options.filterSource ? this.options.filterSource + "_" +
                                                        ItemCollection.prototype.uniqueid :
                            ItemCollection.prototype.uniqueid;
        sessionFilterInfo = this.namedSessionStorage.get(filterInfoKey);
        if (!!sessionFilterInfo) {
          if (!!sessionFilterInfo.feedtype) {
            this.options.feedtype = sessionFilterInfo.feedtype;
          }
          if (!!sessionFilterInfo.updatesfrom) {
            this.options.updatesfrom = sessionFilterInfo.updatesfrom;
          }
        }
        if (this.options.origin === 'userwidget') {
          delete this.options.context._factories[Util.commonUtil.getActivityWidgetId(this.options)];
        }
        this.options.collection = this.options.context.getCollection(ItemCollection, this.options);
      }
      var self = this;
      this.options.parentCollectionView = this;
      if (!ActivityFeedView) {
        ActivityFeedView = _require("esoc/widgets/activityfeedwidget/activityfeed.view");
      }
      this.activityview = new ActivityFeedView(this.options, {collection: this.options.collection});
      this.activityview.setParentView(this);

      this.activityview.listenTo(this.options.collection, "sync", function (collection, response) {
        self.triggerMethod('dom:refresh');
        var tabItems = self.$el.find('[data-cstabindex=0]');
        tabItems.attr("tabindex", "0");
        self.focusedElement && self.focusedElement.focus();
        self.triggerMethod('update:scrollbar');
      });

      if (this.options.feedSettings.enableFilters) {
        this.filterview = new ActivityFeedFilterView(this.options, this);
        this.filterview.on('select:filter', function (filterOptions) {
          self.$el.find(".esoc-acitivityfeed-collection").scrollTop(0);
          self.activityview.trigger('refresh:collection', filterOptions);
        });
      }
      Marionette.LayoutView.prototype.constructor.apply(this, options);
      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }
      this.listenTo(this.options.collection, "request", this.blockActions)
          .listenTo(this.options.collection, "sync", this.unblockActions)
          .listenTo(this.options.collection, "error", this.unblockActions);
    },
    onRender: function () {
      this.feedRegion.show(this.activityview);
      if (this.options.feedSettings.enableFilters) {
        this.filterRegion.show(this.filterview);
      }
    },
    onShow: function (e) {
      if (!!this.options.userActivity) {
        this.onAfterShow(e);
      }
    },
    onAfterShow: function (e) {
      var filterElements = this.$el.find(".csui-facet .esoc_activityfeed_filter");
      filterElements.prop("tabindex", "-1").attr("data-cstabindex", "-1");

      this.$el.find(".esoc-activityfeed-filter-types")
          .prop("tabindex", "0").attr("data-cstabindex", "0");
      this.$el.find("#esoc_activityfeed_filter_status")
          .prop("tabindex", "0").attr("data-cstabindex", "0")
      this.$el.find(".esoc-activityfeed-filter-updatesfrom")
          .prop("tabindex", "0").attr("data-cstabindex", "0")

      this.$el.find('input[type=radio][checked]').each(function () {
        $(this).prop("tabindex", "0").attr("data-cstabindex", "0")
      });

      Util.commonUtil.navigationWithArrowKeys(this, "div.activityfeed-list");

      if (!!this.options.selectedTab) {
        var that         = this,
            expandDialog = $(".activityfeed-expand");
        if (expandDialog.length > 0) {
          expandDialog.find(".cs-close").on('click', function (e) {
            if (that.options.selectedTab === Util.commonUtil.globalConstants.FRIENDS) {
              $("#esoc-user-profile-following-tab").trigger("click");
            }
            else if (that.options.selectedTab === Util.commonUtil.globalConstants.FOLLOWERS) {
              $("#esoc-user-profile-followers-tab").trigger("click");
            }
          });
        }
      }
      if (this.options.feedSettings.enableFilters) {
        this.filterview.triggerMethod("after:show");
      }
      var self      = this,
          container = self.$el.find(".esoc-acitivityfeed-collection");
      container.on("scroll", function (e, that) {
        var containerHeight = container.height();
        var containerScrollHeight = container[0].scrollHeight;
        var containerScrollTop = container.scrollTop();
        if ((containerScrollTop + 30) >= (containerScrollHeight - containerHeight)) {
          container.find(".esoc-social-activity-load-more:last").trigger("click");
        }
      });
    }
  });
  _.extend(ActivityFeedWithFilterView.prototype, LayoutViewEventsPropagationMixin);
  return ActivityFeedWithFilterView;
});
