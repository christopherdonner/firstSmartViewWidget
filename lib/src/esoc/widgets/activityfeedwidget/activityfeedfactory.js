/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/utils/namedsessionstorage',
  'esoc/widgets/activityfeedwidget/activityfeed.model',
  'csui/utils/contexts/factories/node'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, NamedSessionStorage,
    ActivityFeedCollection, NodeFactory) {

  var ActivityFeedFactory = CollectionFactory.extend({

    propertyPrefix: 'activityfeed',
    uniqueid: 'all',
    namedSessionStorage: new NamedSessionStorage("esoc-activity-filterinfo"),
    constructor: function ActivityFeedFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);
      this.options.activityfeed = this.options[this.uniqueid] || {};
      var sessionFilterInfo,
          filterInfoKey = this.options.filterSource ? this.options.filterSource + "_" +
                                                      this.uniqueid : this.uniqueid;
      sessionFilterInfo = this.namedSessionStorage.get(filterInfoKey);
      this.options.activityfeed = this.options[this.uniqueid] || {}
      this.options.activityfeed.widgetId = this.uniqueid;
      if (!!sessionFilterInfo) {
        if (!!sessionFilterInfo.feedtype) {
          this.options.activityfeed.feedtype = sessionFilterInfo.feedtype;
        }
        if (!!sessionFilterInfo.updatesfrom) {
          this.options.activityfeed.updatesfrom = sessionFilterInfo.updatesfrom;
        }
      }
      var activityfeed = this.options.activityfeed || {};
      if (!(activityfeed instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            container = context.getObject(NodeFactory),
            config    = module.config();
        this.options.connector = connector;
        this.options.feedsize = this.options.activityfeed.feedsize !== undefined ?
                                parseInt(this.options.activityfeed.feedsize, 10) : 15;
        this.options.feedtype = this.options.activityfeed.feedtype !== undefined ?
                                this.options.activityfeed.feedtype :
                                "all";
        if (this.options.activityfeed.feedSettings !== undefined &&
            this.options.activityfeed.feedSettings.enableComments !== undefined) {
          this.options.enableComments = this.options.activityfeed.feedSettings.enableComments;
        } else {
          this.options.enableComments = true;
        }

        if (this.options.activityfeed.feedSettings !== undefined &&
            this.options.activityfeed.feedSettings.enableFilters !== undefined) {
          this.options.enableFilters = this.options.activityfeed.feedSettings.enableFilters;
        } else {
          this.options.enableFilters = false;
        }
        var honorfeedsource = (this.options.activityfeed.honorfeedsource !== undefined &&
                               this.options.activityfeed.honorfeedsource);
        if (honorfeedsource) {
          this.options.honorfeedsource = honorfeedsource;
          if (container.get("id") !== undefined) {
            this.options.objectnodeid = container.get("id");
          }
        }
        if (this.options.activityfeed.feedsource !== undefined) {
          this.options.feedsource = this.options.activityfeed.feedsource;
        } else {
          this.options.feedsource = {"source": "all"};
        }
        if (this.options.activityfeed.updatesfrom !== undefined) {
          this.options.updatesfrom = this.options.activityfeed.updatesfrom;
        } else {
          this.options.updatesfrom = {"from": "all"};
        }

        if (this.options.activityfeed.wrapperClass !== undefined) {
          this.options.wrapperClass = this.options.activityfeed.wrapperClass;
        }
        var feedsAutoRefreshWait;
        if (this.options.activityfeed.config_settings !== undefined &&
            this.options.activityfeed.config_settings.feedsAutoRefreshWait !== undefined) {
          feedsAutoRefreshWait = this.options.activityfeed.config_settings.feedsAutoRefreshWait;
        }
        this.options.config_settings = {
          "feedsAutoRefreshWait": feedsAutoRefreshWait
        };
        this.options.maxMessageLength = (this.options.activityfeed.config_settings !== undefined &&
                                         this.options.activityfeed.config_settings.maxMessageLength !==
                                         undefined) ?
                                        parseInt(
                                            this.options.activityfeed.config_settings.maxMessageLength,
                                            10) : undefined;
        activityfeed = new ActivityFeedCollection(activityfeed.models, _.extend({ //self
          connector: connector,
          context: context
        }, this.options, config.options, {
          autoreset: true
        }));
      }
      this.property = activityfeed;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });
  return ActivityFeedFactory;
});
