csui.define([
  'module',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'esoc/widgets/activityfeedwidget/activityfeedfactory',
  '../../../activityfeedwidget/object/object.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'esoc/widgets/activityfeedwidget/util',
  'esoc/widgets/common/util',
  'hbs!esoc/widgets/metadata/impl/activity/metadata.activity',
  'css!esoc/widgets/metadata/impl/activity/metadata.activity'
], function (module,
    _,
    Marionette,
    ActivityFeedFactory,
    ObjectView,
    PerfectScrollingBehavior,
    Util,
    CommonUtil,
    MetadataTemplate) {

  var config = module.config() || {};
  _.defaults(config, {
    enabled: true
  });

  var MetadataActivityFeedView = Marionette.LayoutView.extend({
    // FIXME: Function should be used here to merge the value
    // from the parent prototype
    className: 'cs-metadata-activity-feed',

    template: MetadataTemplate,
    commonUtil: CommonUtil,
    regions: {
      feeds: '.feeds'
    },

    behaviors: {

      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.esoc-afw-object-view',
        suppressScrollX: true,
        scrollYMarginOffset: 10,
        wheelSpeed: 20,
        wheelPropagation: false
      }

    },

    constructor: function MetadataActivityFeedView(options) {
      Marionette.LayoutView.apply(this, arguments);
      this.listenTo(this, "dom:refresh", this.showSeeMoreLink);
    },

    showSeeMoreLink: function () {
      var that = this;
      this.$el.find(".esoc-extended-view-mode").each(function () {
        var self = that, _ele = this;
        setTimeout(function () {
          if (self.commonUtil.isTextOverflown(_ele)) {
            self.$(_ele).find(".esoc-see-more").show();
            self.$(_ele).addClass("esoc-see-more-activity");
          }
        }, 2000);
      });
    },

    onRender: function () {
      var _collection;
      var _options;
      var _listView;

      _options = _.defaults({}, {
        blockingParentView: this.options.blockingParentView,
        context: this.options.context,
        originatingView: this.options.originatingView,
        metadataView: this.options.metadataView
      }, {
        feedsize: 15,
        feedtype: "all",
        wrapperClass: "hero",
        feedSettings: {
          enableComments: true,
          enableFilters: false
        },
        feedsource: {
          source: 'pulsefrom',
          id: this.options.model.get('id')
        },
        "showCommentIcon": true,
        "origin": "metadata"

      });

      ActivityFeedFactory.prototype.propertyPrefix = Util.commonUtil.getActivityWidgetId(_options);
      this.uniqueid = ActivityFeedFactory.prototype.uniqueid = Util.commonUtil.getActivityWidgetId(
          _options);

      delete this.options.context._factories[Util.commonUtil.getActivityWidgetId(_options)];
      _collection = this.options.context.getCollection(ActivityFeedFactory, _options);
      _options = _.extend(_options, {collection: _collection});

      _listView = new ObjectView(_options);
      this.feeds.show(_listView);
      _collection.fetch();
    },
    onDestroy: function () {
      if (!!this.uniqueid) {
        delete this.options.context._factories[this.uniqueid];
      }
    }
  }, {
    enabled: function (options) {
      return (config.enabled !== false);
    }
  });

  return MetadataActivityFeedView;

});
