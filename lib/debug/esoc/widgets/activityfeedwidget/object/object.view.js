// Shows a list of items
csui.define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/behaviors/default.action/default.action.behavior',
  'esoc/widgets/common/util',
  'esoc/widgets/activityfeedwidget/activityfeeditem.view',
  'esoc/widgets/activityfeedwidget/emptyactivityfeed.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/tile/behaviors/blocking.behavior',
  'esoc/widgets/activityfeedwidget/afw.infinite.scrolling.behavior',
  'esoc/widgets/activityfeedwidget/util',
  'csui/utils/contexts/factories/node',
  'hbs!esoc/widgets/activityfeedwidget/object/impl/object',
  'i18n!esoc/widgets/activityfeedwidget/impl/nls/lang',
  'esoc/widgets/utils/adaptivepoll',
  'css!esoc/widgets/activityfeedwidget/object/impl/object'
], function (_, $, Marionette, Log, DefaultActionBehavior, CommonUtil,
    ActivityFeedItemView, EmptyActivityFeedView,
    PerfectScrollingBehavior, BlockingBehavior, InfiniteScrollingBehavior, Util, NodeFactory,
    objectTemplate, lang, Adaptivepoll) {
  var ObjectView = Marionette.CompositeView.extend({
    className: "esoc-afw-object-view esoc-afw-newupdates  esoc",
    initialize: function (options) {
      var self = this;
      this.listenTo(this.collection, 'request', function () {
        this.$el.find(".esoc-empty-activityfeed-wrapper").hide();
      }).listenTo(this.collection, "sync", function () {
        this.$el.find(".esoc-empty-activityfeed-wrapper").show();
        //this.triggerMethod("update:notification");
        this.triggerMethod('update:scrollbar');
      });
      var objNode = this.options.context ? this.options.context.getObject(NodeFactory) : undefined;
      if (!!objNode) {
        objNode.on('change:id', function (e) {
          if (objNode.get("id") !== undefined) {
            if (self.options &&
                self.options.honorfeedsource !== undefined & self.options.honorfeedsource) {
              self.options.objectnodeid = objNode.get("id");
              var widgetId = self.collection.widgetOptions.activityfeed.widgetId;
              if (self.options.context._factories[widgetId] !== undefined) {
                self.options.context._factories[widgetId].options.objectnodeid = self.options.objectnodeid;
              }
              self.collection.fetch(self.options);
              self.triggerMethod("update:notification");
              var expandViewNewUpdates =
                      $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
                        widgetId);

              if (expandViewNewUpdates.length > 0) {
                expandViewNewUpdates.hide();
              }
            }
          }
        });
      }
      this.on('refresh:collection', function (filterInfo) {
        if (!!filterInfo) {
          var filterOptions = _.extend({}, self.options);
          if (!!filterInfo.feedtype) {
            filterOptions.feedtype = filterInfo.feedtype;
          }
          if (!!filterInfo.updatesfrom) {
            filterOptions.updatesfrom = filterInfo.updatesfrom;
          }
          self.collection.fetch(filterOptions);
          $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
            filterOptions.collection.widgetOptions.activityfeed.widgetId).hide();
        }
        this.triggerMethod("update:notification");
      });
    },

    log: Log,
    commonUtil: CommonUtil,
    template: objectTemplate,
    templateHelpers: function () {
      var wrapperClass = "";
      if (this.options.wrapperClass !== undefined) {
        wrapperClass = this.options.wrapperClass;
      }
      var feedtype = "";
      if (this.options.feedtype !== undefined) {
        feedtype = this.options.feedtype;
      }
      return {
        title: this.options.title ||
               lang.dialogTitle,
        icon: this.options.titleBarIcon,
        searchPlaceholder: lang.searchPlaceholder,
        wrapperClass: wrapperClass,
        feedtype: this.options.widgetId ||
                  this.options.collection.widgetOptions.activityfeed.widgetId,
        feedOptions: this.options,
        noActivityFeedMessage: lang.noactivities
      };
    },
    childViewContainer: '.object-group',
    childView: ActivityFeedItemView,
    emptyView: EmptyActivityFeedView,
    childViewOptions: function (model, index) {
      return {
        strdViewOptions: this.options,
        context: this.options.context,
        parentCollectionView: this,
        index: index
      };
    },
    events: {
      "click .esoc-social-activity-load-more": "loadMoreItems",
      'click .esoc-activityfeed-invisiblebutton': 'getNewSinceId'
    },
    triggers: {
      'click .tile-header': 'click:header'
    },
    behaviors: {
      Blocking: {
        behaviorClass: BlockingBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true
      },
      InfiniteScrolling: {
        behaviorClass: InfiniteScrollingBehavior
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },
    childEvents: {
      'click:item': 'onClickItem',
      'click:attachment': 'onClickAttachment',
      'childview:comment:action': 'onCommentdialogAction',
      'childview:start:notification': 'resumeNotification'
    },
    onShow: function () {
      var that = this;
      if (!!this.options.headerView) {
        //Delaying dom:refresh to recalculate container height to display perfect scroll bar as
        //Mutation observer is not adding the elements to DOM until all children element are
        // rendered.
        setTimeout(function () {
          that.triggerMethod("dom:refresh");
          Util.commonUtil.navigationWithArrowKeys(that, ".object-group");
        }, 1000);
      }
      var feedsAutoRefreshWait = (this.collection.widgetOptions.config_settings &&
                                  this.collection.widgetOptions.config_settings.feedsAutoRefreshWait) ?
                                 this.collection.widgetOptions.config_settings.feedsAutoRefreshWait :
                                 undefined;
      if (!!feedsAutoRefreshWait) {
        this.updateGetNotification(feedsAutoRefreshWait);
      }
      this.listenToOnce(this.collection, "sync", function () {
        feedsAutoRefreshWait = feedsAutoRefreshWait || ((this.collection.config_settings &&
                                                         this.collection.config_settings.feedsAutoRefreshWait));
        setTimeout(function () {
          if (!that.options.headerView) {
            Util.commonUtil.navigationWithArrowKeys(that, ".object-group");
          }
          that.updateGetNotification(feedsAutoRefreshWait);
        }, 500);
      });
    },
    updateGetNotification: function (notificationInterval) {
      var afwId = this.collection.widgetOptions.activityfeed.widgetId;
      if ($(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
            afwId).length === 0) {
        setTimeout(this.commonUtil.alignUpdateButton, 1000, afwId, true);
      }
      if (notificationInterval !== 0) {
        clearInterval(this.collection.widgetOptions.notificationInterval);
        var getNewUpdates = this.collection.widgetOptions.getNewUpdates !== undefined ?
                            this.collection.widgetOptions.getNewUpdates : true;
        if (getNewUpdates) {
          this.adaptivepollObj = new Adaptivepoll(this.getLatestSinceId, "global_countdown_last_reset_timestamp"
              , notificationInterval, afwId, this);
          this.adaptivepollObj.lastState = 1;
        }
      }
    },
    getLatestSinceId: function (widgetId, objView) {
      var stdInvisibleButton = $(".esoc-activityfeed-list.esoc-activityfeed-list-" +
                                 widgetId).find(".esoc-activityfeed-invisiblebutton");
      if (stdInvisibleButton.length > 0) {
        objView.getNewSinceId();
        objView.collection.widgetOptions.notificationInterval = objView.adaptivepollObj.setUpdateTimer();
      }
    },
    onUpdateNotification: function () {
      var widgetId = this.collection.widgetOptions.activityfeed.widgetId;
      $(".esoc-activityfeed-expand-getnewupdates.esoc-activityfeed-expand-getnewupdates-" +
        widgetId).hide();
      $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
        widgetId).hide();
      var feedsAutoRefreshWait = (this.options.config_settings &&
                                  this.options.config_settings.feedsAutoRefreshWait) ||
                                 (this.collection.config_settings &&
                                  this.collection.config_settings.feedsAutoRefreshWait);
      if (!!feedsAutoRefreshWait) {
        this.updateGetNotification(feedsAutoRefreshWait);
      }
    },
    onCommentdialogAction: function () {
      $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
        this.collection.widgetOptions.activityfeed.widgetId).hide();
      this.collection.fetch(_.extend(this.collection.widgetOptions, {remove: true}));
    },
    resumeNotification: function () {
      var feedsAutoRefreshWait = this.collection.config_settings &&
                                 this.collection.config_settings.feedsAutoRefreshWait;
      this.updateGetNotification(feedsAutoRefreshWait);
    },
    loadMoreItems: function (e) {
      var that = this;
      this.options = _.extend(this.options, {});
      var activityModel = this.collection.models[this.collection.models.length - 1];
      if (!activityModel.attributes.noMoreData) {
        delete this.collection.defaults.params["since_id"];
        activityModel.collection.defaults.params.queryParams = {};
        this.collection.defaults.params.queryParams["max_id"] = e.target.id;
        this.collection.fetch(_.extend({remove: false}, this.collection.widgetOptions));
        delete this.collection.defaults.params.queryParams["max_id"];
      }
    },
    onClickItem: function (target) {
      var objectArgs = {
        "node": target.sgmModel,
        "callingViewInstance": this
      }
      this.commonUtil.openItem(objectArgs);

    },
    onClickAttachment: function (target) {
      var objectArgs = {
        "node": target.attachmentModel,
        "callingViewInstance": this
      }
      this.commonUtil.openItem(objectArgs);
    },
    onDestroy: function () {
      clearInterval(this.collection.widgetOptions.notificationInterval);
      if (!!this.adaptivepollObj) {
        this.adaptivepollObj.destroy();
      }
    },
    getNewSinceId: function (e) {
      var sinceId     = this.collection.models.length > 0 ?
                        this.collection.models[0].attributes.id : 0,
          conn        = this.options.connector,
          includeTop  = this.options.hideHeader,
          self        = this,
          queryString = "",
          _context    = self.options.context !== undefined ? self.options.context :
                        self.options.activityfeed.context,
          widgetId    = self.collection.widgetOptions.activityfeed.widgetId;
      self.feedtype = !!this.collection.widgetOptions.feedtype ?
                      this.collection.widgetOptions.feedtype : this.options.feedtype;
      self.updatesfrom = !!this.collection.widgetOptions.updatesfrom ?
                         this.collection.widgetOptions.updatesfrom :
                         this.options.updatesfrom;
      self.widgetId = widgetId;
      var activityWidgetfactory = _context._factories[widgetId];
      if (activityWidgetfactory !== undefined && activityWidgetfactory.options !== undefined &&
          activityWidgetfactory.options.honorfeedsource !== undefined &&
          activityWidgetfactory.options.honorfeedsource &&
          activityWidgetfactory.options.objectnodeid !== undefined) {
        sinceId = this.collection.models.length > 0 ?
                  this.collection.models[0].attributes.id : 0;
        queryString = "&where_feedsource=pulsefrom&where_feedsource_id=" +
                      activityWidgetfactory.options.objectnodeid;
      } else if (this.options.feedsource !== undefined) {
        if (this.options.feedsource.source !== undefined && this.options.feedsource.source) {
          queryString = "&where_feedsource=" + this.options.feedsource.source;
        }
        if (this.options.feedsource.id !== undefined && this.options.feedsource.id) {
          queryString = queryString + "&where_feedsource_id=" + this.options.feedsource.id;
        }
      }
      if (self.updatesfrom !== undefined) {
        if (self.updatesfrom.from !== undefined && self.updatesfrom.from) {
          queryString = queryString + "&where_updatesfrom=" + self.updatesfrom.from;
        }
        if (self.updatesfrom.id !== undefined && self.updatesfrom.id) {
          queryString = queryString + "&where_updatesfrom_id=" + self.updatesfrom.id;
        }
      }
      $.ajax(conn.extendAjaxOptions({
        url: conn.connection.url + this.commonUtil.REST_URLS.csGetAFSinceId + self.feedtype +
             queryString,
        type: 'GET',
        success: function (data, status, jXHR) {
          var responsefromServer = data.lastestIDReturned !== undefined;
          if (responsefromServer &&
              parseInt(data.lastestIDReturned, 10) !== parseInt(sinceId, 10)) {
            var newUpdatesEle =
                    $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
                      self.widgetId);
            $(newUpdatesEle).addClass(!includeTop ? "esoc-activityfeed-getnewupdates-top" :
                                      "").show();
            $(newUpdatesEle).one('click', self, self.getNewUpdates);
            $(newUpdatesEle).on("keydown", self,function (e) {
              var keyCode = e.keyCode || e.which;
              if (keyCode === 13 || keyCode === 32) {
                self.getNewUpdates(e);
              }
            });
            clearInterval(self.options.collection.widgetOptions.notificationInterval);
            if (self.adaptivepollObj !== null) {
              self.adaptivepollObj.destroy();
            }
          }
        },
        error: function (xhr, status, text) {
          self.log.error("Error while retriving the latest since Id...");
        }
      }));
    },
    getNewUpdates: function (e) {
      var feedview             = e.data,
          widgetId             = feedview.options.widgetId ||
                                 feedview.collection.widgetOptions.activityfeed.widgetId,
          feedsAutoRefreshWait = (feedview.options.config_settings &&
                                  feedview.options.config_settings.feedsAutoRefreshWait) ||
                                 (feedview.collection.config_settings &&
                                  feedview.collection.config_settings.feedsAutoRefreshWait);
      if (!$(e.target).hasClass("esoc-activityfeed-close")) {
        delete feedview.collection.defaults.params["since_id"];
        delete feedview.collection.defaults.params["max_id"];
        feedview.collection.defaults.params.queryParams = {};
        var _context = feedview.options.context !== undefined ? feedview.options.context :
                       feedview.options.activityfeed.context;
        feedview.$el.scrollTop(0);
        feedview.collection.fetch(_.extend(feedview.collection.widgetOptions, {remove: true}));
      }
      $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" + widgetId).hide();
      $(".esoc-activityfeed-new-updates-wrapper").css("outline", "none");
      if (!!feedsAutoRefreshWait) {
        feedview.updateGetNotification(feedsAutoRefreshWait);
      }
    }
  });
  return ObjectView;
});
