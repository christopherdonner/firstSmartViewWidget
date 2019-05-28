csui.define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/behaviors/default.action/default.action.behavior',
  'esoc/widgets/activityfeedwidget/activityfeeditem.view',
  'esoc/widgets/activityfeedwidget/emptyactivityfeed.view',
  'esoc/widgets/common/util',
  'i18n!esoc/widgets/activityfeedwidget/impl/nls/lang',
  'hbs!esoc/widgets/activityfeedwidget/impl/newupdates',
  'esoc/widgets/utils/adaptivepoll'
], function (_require, $, _, Backbone, Marionette, Log, DefaultActionBehavior,
    ActivityFeedItemView, EmptyActivityFeedView, CommonUtil, afLang, NewUpdatesButtonTemplate,
    Adaptivepoll) {
  var self = null;
  var ActivityFeedView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'activityfeed-list binf-container-fluid',
    childView: ActivityFeedItemView,
    emptyView: EmptyActivityFeedView,
    log: Log,
    commonUtil: CommonUtil,
    feedtype: "",
    options: {},
    childViewOptions: function (model, index) {
      return {
        context: this.options.context,
        defaultActionController: this.defaultActionController,
        parentCollectionView: !!this.options.parentCollectionView ?
                              this.options.parentCollectionView : this.options.activityfeed &&
                                                                  this.options.activityfeed.parentCollectionView,
        index: index
      };
    },
    setParentView: function (parentView) {
      this.parentView = parentView;
    },
    initialize: function (options) {
      self = this;
      this.listenTo(this.collection, 'request', function () {
        this.$el.find(".esoc-empty-activityfeed-wrapper").hide();
      }).listenTo(this.collection, "sync", function () {
        this.$el.find(".esoc-empty-activityfeed-wrapper").show();
      });
      if (!this.childView) {
        this.childView = _require('esoc/widgets/activityfeedwidget/activityfeeditem.view');
      }
      this.on('refresh:collection', function (filterInfo) {
        if (!!filterInfo) {
          var filterOptions = _.extend({}, this.options);
          if (!!filterInfo.feedtype) {
            filterOptions.feedtype = filterInfo.feedtype;
          }
          if (!!filterInfo.updatesfrom) {
            filterOptions.updatesfrom = filterInfo.updatesfrom;
          }

          this.collection.fetch(_.extend({error: this.collection.fetchError}, filterOptions));

          this.triggerMethod("update:notification");
        }
      });
    },
    constructor: function ActivityFeedView() {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },
    behaviors: {
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
    events: {
      "click .esoc-social-activity-load-more": "loadMoreItems"
    },
    onCommentdialogAction: function () {
      $(".esoc-activityfeed-expand-getnewupdates.esoc-activityfeed-expand-getnewupdates-" +
        this.collection.widgetOptions.activityfeed.widgetId).hide();
      $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
        this.collection.widgetOptions.activityfeed.widgetId).hide();
      $(".esoc-acitivityfeed-collection").scrollTop(0);
      $(".esoc-afw-object-view").has('.esoc-activityfeed-list-' +
                                     this.collection.widgetOptions.activityfeed.widgetId).scrollTop(
          0);
      this.collection.fetch(_.extend(this.collection.widgetOptions, {remove: true}));
      var feedsAutoRefreshWait = this.collection.config_settings &&
                                 this.collection.config_settings.feedsAutoRefreshWait;
      this.updateGetNotification(feedsAutoRefreshWait);
    },
    resumeNotification: function (e) {
      var feedsAutoRefreshWait = this.collection.config_settings &&
                                 this.collection.config_settings.feedsAutoRefreshWait;
      this.updateGetNotification(feedsAutoRefreshWait);
      //TODO: need to resume notification for tile view.
      //this.collection.updateGetNotification(feedsAutoRefreshWait);
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
    onShow: function (e) {

      var widgetOptions = this.options.collection.widgetOptions;
      if (widgetOptions.activityfeed !== undefined) {
        widgetOptions = widgetOptions.activityfeed;
      }
      var wrapperClass = widgetOptions.wrapperClass;
      if (wrapperClass !== undefined && wrapperClass.trim().length > 0) {
        var targetEle = this.$el.parent().parent();
        targetEle.addClass(wrapperClass);
        var heroElement = this.$el.closest(".activityfeed-expand").find("." + wrapperClass);
        var heroBackgroundColor = $("." + wrapperClass).css("background-color");
        targetEle.css("background-color", heroBackgroundColor);

        this.$el.closest(".activityfeed-expand").find(".tile-content").css("background-color",
            heroBackgroundColor);
        heroElement.find(".object-group-item").css("background-color", heroBackgroundColor);
        heroElement.find(".tile-header").css("background-color", heroBackgroundColor);
        this.$el.closest(".activityfeed-expand").find(".binf-container-fluid").css(
            "background-color",
            heroBackgroundColor);
        this.$el.closest(".activityfeed-expand").find(".binf-modal-body").css("background-color",
            heroBackgroundColor);
      }
      // honor feed auto refresh interval time from widget config, if not available then consider auto refresh interval time from cs config.
      var feedsAutoRefreshWait = this.options.collection.config_settings &&
                                 this.options.collection.config_settings.feedsAutoRefreshWait;
      if (!!feedsAutoRefreshWait) {
        this.updateGetNotification(feedsAutoRefreshWait);
        if ($(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
              widgetOptions.widgetId) && feedsAutoRefreshWait !== 0) {
          this.getExpandNewSinceId();
        }
      } else {
        var that = this;
        this.listenToOnce(this.options.collection, "sync", function () {
          feedsAutoRefreshWait = that.options.collection.config_settings &&
                                 that.options.collection.config_settings.feedsAutoRefreshWait;
          that.updateGetNotification(feedsAutoRefreshWait);
          if ($(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
                widgetOptions.widgetId) && feedsAutoRefreshWait !== 0) {
            that.getExpandNewSinceId();
          }
        });
      }
    },
    onDestroy: function () {
      clearInterval(this.collection.widgetOptions.expNotificationInterval);
      if (!!this.adaptivepollObj) {
        this.adaptivepollObj.destroy();
      }
    },
    onUpdateNotification: function () {
      var widgetId = this.collection.widgetOptions.activityfeed.widgetId;
      $(".esoc-activityfeed-expand-getnewupdates.esoc-activityfeed-expand-getnewupdates-" +
        widgetId).hide();
      $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
        widgetId).hide();
      var feedsAutoRefreshWait = this.collection.config_settings &&
                                 this.collection.config_settings.feedsAutoRefreshWait;
      if (!!feedsAutoRefreshWait) {
        this.updateGetNotification(feedsAutoRefreshWait);
      }
    },
    loadMoreItems: function (e) {
      if (!this.collection.models[this.collection.models.length - 1].attributes.noMoreData) {
        delete this.collection.defaults.params["since_id"];
        this.collection.defaults.params.queryParams = {};
        this.collection.defaults.params.queryParams["max_id"] = e.target.id;
        var _context = this.options.context !== undefined ? this.options.context :
                       this.options.activityfeed.context;
        if (this.collection.widgetOptions.remove) {
          this.collection.widgetOptions.remove = false;
        }
        this.collection.fetch(_.extend({remove: false}, this.collection.widgetOptions));
        delete this.collection.defaults.params.queryParams["max_id"];
      }
    },
    updateGetNotification: function (notificationInterval) {
      var afwId = this.collection.widgetOptions.activityfeed.widgetId;
      if ($(".esoc-activityfeed-expand-getnewupdates.esoc-activityfeed-expand-getnewupdates-" +
            afwId).length === 0) {
        setTimeout(this.alignUpdateButton, 1000, this.$el, afwId);
      }
      if (notificationInterval !== 0) {
        clearInterval(this.collection.widgetOptions.expNotificationInterval);
        this.adaptivepollObj = new Adaptivepoll(this.getExpandLatestSinceId, "global_countdown_last_reset_timestamp"
            , notificationInterval, afwId, this);
        this.adaptivepollObj.lastState = 1;
      }
    },
    alignUpdateButton: function (currentEle, afwId) {
      var autoReloadEle = $('<div />', {
            'class': 'esoc-activityfeed-new-updates-wrapper',
            'html': NewUpdatesButtonTemplate({
              'messages': afLang,
              'newUpdatesWrapperClass': 'esoc-activityfeed-expand-getnewupdates' +
                                        ' esoc-activityfeed-expand-getnewupdates-' + afwId
            })
          }),
          hiddenEle     = $('<div />', {
            'class': 'activityfeed-expand-invisiblebutton-' + afwId
          });
      autoReloadEle.css({
        'position': 'absolute',
        'top': '15px',
        'left': '50%',
        'transform': 'translate(-50%, -50%)'
      });
      currentEle.closest(".esoc-afw-newupdates").parent().append(autoReloadEle);
      currentEle.append(hiddenEle);
    },
    getNewUpdates: function (e) {
      var feedview             = e.data,
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
        $(".esoc-acitivityfeed-collection").scrollTop(0);
        feedview.collection.fetch(_.extend(feedview.options, {remove: true}));
        $(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
          feedview.options.activityfeed.widgetId).click();
      }
      $(".esoc-activityfeed-expand-getnewupdates.esoc-activityfeed-expand-getnewupdates-" +
        feedview.options.activityfeed.widgetId).hide();

      if (!!feedsAutoRefreshWait) {
        feedview.updateGetNotification(feedsAutoRefreshWait);
      }
    },
    getExpandNewSinceId: function (feedview) {
      feedview = !!feedview && !!feedview.data ? feedview.data : self;
      var sinceId    = feedview.collection.models.length > 0 ?
                       feedview.collection.models[0].attributes.id :
                       0,
          conn       = feedview.options.connector,
          includeTop = feedview.options.hideHeader;
      feedview.feedtype = feedview.collection.widgetOptions.feedtype;
      feedview.updatesfrom = !!feedview.collection.widgetOptions.updatesfrom ?
                             feedview.collection.widgetOptions.updatesfrom :
                             feedview.options.updatesfrom;
      var queryString       = "",
          collectionOptions = feedview.collection.models.length > 0 ?
                              feedview.collection.models[0].attributes.widgetOptions :
                              feedview.collection.widgetOptions;
      feedview.options = $.isEmptyObject(collectionOptions) === false ? collectionOptions :
                         feedview.options;
      var _context              = feedview.options.context !== undefined ?
                                  feedview.options.context :
                                  feedview.options.activityfeed.context,
          activityWidgetfactory = _context._factories[feedview.collection.widgetOptions.activityfeed.widgetId];
      if (activityWidgetfactory !== undefined && activityWidgetfactory.options !== undefined &&
          activityWidgetfactory.options.honorfeedsource !== undefined &&

          activityWidgetfactory.options.honorfeedsource && activityWidgetfactory !== undefined &&
          activityWidgetfactory.options !== undefined &&
          activityWidgetfactory.options.objectnodeid !== undefined) {
        queryString = "&where_feedsource=pulsefrom&where_feedsource_id=" +
                      activityWidgetfactory.options.objectnodeid;
      } else if (feedview.options.feedsource !== undefined) {
        if (feedview.options.feedsource.source !== undefined &&
            feedview.options.feedsource.source) {
          queryString = "&where_feedsource=" + feedview.options.feedsource.source;
        }
        if (feedview.options.feedsource.id !== undefined && feedview.options.feedsource.id) {
          queryString = queryString + "&where_feedsource_id=" + feedview.options.feedsource.id;
        }
      }
      if (feedview.updatesfrom !== undefined) {
        if (feedview.updatesfrom.from !== undefined && feedview.updatesfrom.from) {
          queryString = queryString + "&where_updatesfrom=" + feedview.updatesfrom.from;
        }
        if (feedview.updatesfrom.id !== undefined && feedview.updatesfrom.id) {
          queryString = queryString + "&where_updatesfrom_id=" + feedview.updatesfrom.id;
        }
      }
      $.ajax(conn.extendAjaxOptions({
        url: conn.connection.url + feedview.commonUtil.REST_URLS.csGetAFSinceId +
             feedview.feedtype +
             queryString,
        type: 'GET',
        success: function (data, status, jXHR) {
          var responsefromServer = data.lastestIDReturned !== undefined;
          if (responsefromServer &&
              parseInt(data.lastestIDReturned, 10) !== parseInt(sinceId, 10)) {
            var newUpdatesEle = $(
                ".esoc-activityfeed-expand-getnewupdates.esoc-activityfeed-expand-getnewupdates-" +
                feedview.options.activityfeed.widgetId);
            $(newUpdatesEle).addClass(!includeTop ? "esoc-activityfeed-expand-getnewupdates-top" :
                                      "").show();

            $(newUpdatesEle).on("focus", function (event) {
              var target = $(event.target)
              var parentView = feedview.parentView;
              if (target.is(":visible") && parentView) {
                self.commonUtil.addTabableClass(parentView, target);
              }
            });

            if ($(newUpdatesEle).length > 0) {
              clearInterval(feedview.collection.widgetOptions.expNotificationInterval);
              if (feedview.adaptivepollObj !== null) {
                feedview.adaptivepollObj.destroy();
              }
            }
            $(newUpdatesEle).on("keydown", self, function (e) {
              var keyCode = e.keyCode || e.which;
              if (keyCode === 13 || keyCode === 32) {
                feedview.getNewUpdates(e);
              }
            });
            $(newUpdatesEle).one('click', feedview, feedview.getNewUpdates);
          }
        },
        error: function (xhr, status, text) {
          self.log.error("Error while retriving the latest since Id...");
        }
      }));
    },
    getExpandLatestSinceId: function (afwId, feedview) {
      var expndInvisibleButton = $(".activityfeed-expand-invisiblebutton-" + afwId);
      if (expndInvisibleButton.length > 0) {
        feedview.getExpandNewSinceId(feedview);
        feedview.collection.widgetOptions.expNotificationInterval = feedview.adaptivepollObj.setUpdateTimer();
      }
    }
  });
  return ActivityFeedView;
});
