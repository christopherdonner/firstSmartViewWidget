/**
 * ActivityFeedContentWidget is for initiating objectview and expanding behavior for the view. It
 * doesn't show up a title for the view
 */

csui.define([
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'csui/controls/tile/behaviors/expanding.behavior',
  'esoc/widgets/activityfeedwidget/activityfeedfactory',
  'esoc/widgets/activityfeedwidget/activityfeed.view',
  'esoc/widgets/activityfeedwidget/activityfeedwithfilter.view',
  'csui/utils/contexts/page/page.context',
  'esoc/widgets/activityfeedwidget/object/object.view',
  'esoc/widgets/activityfeedwidget/activityfeedfilter.view',
  'esoc/widgets/activityfeedwidget/util',
  'hbs!esoc/widgets/activityfeedwidget/impl/activityfeedcontent',
  'i18n!esoc/widgets/activityfeedwidget/impl/nls/lang',
  'csui/controls/progressblocker/blocker',
  'csui/utils/namedsessionstorage',
  'css!esoc/widgets/activityfeedwidget/activityfeed.css',
  // TODO: Only stylesheets are needed from those two, but a stylesheet
  // alone is not the public interface - the views should be used here
  'csui/controls/list/list.view',
  'csui/controls/tile/tile.view'
], function (_require, _, $, Backbone, Marionette, Handlebars,
    ExpandingBehavior, ItemCollection, ItemCollectionView, ActivityFeedWithFilterView,
    PageContext, ObjectView, ActivityFeedFilterView, Util, ActivityFeedContent, Lang,
    BlockingView, NamedSessionStorage) {
  function ActivityFeedContentWidget(options) {
    Util.commonUtil.fillDefaultActivityOptions(options);
    if (options.feedtype !== undefined) {
      ItemCollection.prototype.propertyPrefix = Util.commonUtil.getActivityWidgetId(options);
      ItemCollection.prototype.uniqueid = Util.commonUtil.getActivityWidgetId(options);
    }
    var ContentView = Marionette.LayoutView.extend({
          className: 'esoc-activityfeed-contentwidget cs-list',
          template: ActivityFeedContent,
          regions: {
            listRegion: '.eosc-acitivity-feed-content',
            filterRegion: '.esoc-activityfeed-filter'
          },
          namedSessionStorage: new NamedSessionStorage("esoc-activity-filterinfo"),
          templateHelpers: function () {
            return {
              messages: {
                hideExpandIcon: this.options.hideExpandIcon,
                enableFiltersForStandardView: this.options.enableFiltersForStandardView
              }
            };
          },
          constructor: function ActivityFeedContentWidget(options) {
            options || (options = {});
            this.options = options;
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
            var self = this;
            if (this.options.wrapperClass !== undefined) {
              this.$el.addClass(this.options.wrapperClass);
            }
            var sessionFilterInfo,
                filterInfoKey = options.filterSource ? options.filterSource + "_" +
                                                       ItemCollection.prototype.uniqueid :
                                ItemCollection.prototype.uniqueid;
            sessionFilterInfo = this.namedSessionStorage.get(filterInfoKey);
            if (!!sessionFilterInfo) {
              if (!!sessionFilterInfo.feedtype) {
                options.feedtype = sessionFilterInfo.feedtype;
              }
              if (!!sessionFilterInfo.updatesfrom) {
                options.updatesfrom = sessionFilterInfo.updatesfrom;
              }
            }
            if (options.origin === 'userwidget') {
              delete options.context._factories[ItemCollection.prototype.uniqueid];
            }
            this.collection = options.context.getCollection(ItemCollection, options);
            var _options = _.extend(options, {collection: this.collection}),
                ObjectView = !!ObjectView ? ObjectView :
                             _require('esoc/widgets/activityfeedwidget/object/object.view');
            this.listView = new ObjectView(_options);
            if (this.options.enableFiltersForStandardView) {
              this.activityFeedFilterView = new ActivityFeedFilterView(_options);
              this.activityFeedFilterView.on('select:filter', function (filterOptions) {
                self.listView.trigger('refresh:collection', filterOptions);
              });
            }
            if (this.options.blockingParentView) {
              BlockingView.delegate(this, this.options.blockingParentView);
            } else {
              BlockingView.imbue(this);
            }
            this.listenTo(this, "dom:refresh", function () {
              Util.commonUtil.navigationWithArrowKeys(this, ".object-group");
            });
            this.listenTo(this.collection, "request", this.blockActions)
                .listenTo(this.collection, "sync", this.unblockActions)
                .listenTo(this.collection, "error", this.unblockActions);
          },
          events: {
            "keydown .icon-tileExpand": "onTileExpandKeydown"
          },
          behaviors: {
            Expanding: {
              behaviorClass: ExpandingBehavior,
              expandedView: function () {
                return this.options.feedSettings && this.options.feedSettings.enableFilters ?
                       ActivityFeedWithFilterView :
                       ItemCollectionView;
              },
              titleBarIcon: options.titleBarIcon || 'title-activityfeed',
              dialogTitle: options.title || Lang.dialogTitle,
              dialogTitleIconRight: 'icon-tileCollapse',
              dialogClassName: 'activityfeed-expand esoc',
              expandedViewOptions: _.extend(options, {collection: this.collection})
            }
          },
          onTileExpandKeydown: function (event) {
            var keyCode = event.keyCode || event.which;
            if (keyCode === 32 || keyCode === 13) {
              this.triggerMethod('expand');
            }
          },
          onShow: function () {
            if (this.options.enableFiltersForStandardView) {
              this.filterRegion.show(this.activityFeedFilterView);
              this.activityFeedFilterView.triggerMethod("after:show");
            }
            this.listRegion.show(this.listView);
            if (this.options.headerView) {
              !!this.listRegion.$el ?
              this.listRegion.$el.addClass("esoc-activityfeed-header-container") : "";
            }
            this.$el.find(".icon-tileExpand").attr("tabindex", "0").attr("data-cstabindex", "0");
          }
        }),
        contentView = new ContentView(options);
    this.contentView = contentView;
  }

  return ActivityFeedContentWidget;
});
