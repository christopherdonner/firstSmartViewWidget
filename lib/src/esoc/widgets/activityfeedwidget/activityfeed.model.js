/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/base',
  'csui/utils/url',
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/models/connectable',
  'csui/models/fetchable', 'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns', 'csui/models/node/node.model',
  'csui/models/clientsidecollection',
  'esoc/widgets/activityfeedwidget/activityfeeditem.model',
  'esoc/widgets/common/util'

], function (_, $, Backbone, Base, Url, DefaultActionController, ConnectableModel, FetchableModel,
    NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel, ClientSideCollection, ActivityFeedItemModel,
    CommonUtil) {
  var ActivityFeedColumnModel = NodeChildrenColumnModel.extend({});
  var ActivityFeedColumnCollection = NodeChildrenColumnCollection.extend({
    model: ActivityFeedColumnModel,
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'modify_date') {
          column.sort = true;
        }
      });
      return columns;
    }

  });
  var ActivityFeedModel = NodeModel.extend({
    parse: function (response, options) {
      response.name = response.text;
      return NodeModel.prototype.parse.call(this, response, options);
    }
  });
  var ActivityFeedCollection = Backbone.Collection.extend(_.extend({},
      ConnectableModel(Backbone.Collection),
      FetchableModel(Backbone.Collection), ClientSideCollection(), {
        defaults: {
          params: {
            data_id: "",
            text: "",
            since_id: "",
            max_id: ""
          }
        },
        model: ActivityFeedModel,
        base: Base,
        feedRESTUrl: "",
        constRESTUrl: "",
        maxMessageLength: "",
        feedtype: "",
        widgetOptions: {},
        context: "",
        commonUtil: CommonUtil,
        config_settings: {},
        url: function () {
          this.constructURL(this.options);
          return this.feedRESTUrl;
        },
        constructURL: function (options) {
          if (options) {
            this.options = options || {};
            this.constRESTUrl = options.connector ? options.connector.connection.url :
                                this.connector.connection.url;
            this.constRESTUrl += "/pulse/statuses/public_timeline?commands=default&count=" +
                                 (options.feedsize ? options.feedsize : 15)
                                 + "&includes=actions,reply_count&where_feedtype=" +
                                 (options.feedtype ? options.feedtype : "all");
            var queryString = "",
                honorfeedsource,
                objectnodeid;
            if (options.honorfeedsource !== undefined) {
              honorfeedsource = options.honorfeedsource;
            } else if (options.activityfeed && options.activityfeed.honorfeedsource !== undefined) {
              honorfeedsource = options.activityfeed.honorfeedsource;
            }
            if (options.objectnodeid !== undefined) {
              objectnodeid = options.objectnodeid;
            } else if (options.activityfeed && options.activityfeed.objectnodeid !== undefined) {
              objectnodeid = options.activityfeed.objectnodeid;
            }
            if (!!honorfeedsource && objectnodeid !== undefined) {
              queryString = "&where_feedsource=pulsefrom&where_feedsource_id=" + objectnodeid;
            } else if (options.feedsource !== undefined) {
              if (options.feedsource.source !== undefined && options.feedsource.source) {
                queryString = "&where_feedsource=" + options.feedsource.source
              }
              if (options.feedsource.id !== undefined && options.feedsource.id) {
                queryString = queryString + "&where_feedsource_id=" + options.feedsource.id
              }
            }
            if (options.updatesfrom !== undefined) {
              if (options.updatesfrom.from !== undefined && options.updatesfrom.from) {
                queryString = queryString + "&where_updatesfrom=" + options.updatesfrom.from
              }
              if (options.updatesfrom.id !== undefined && options.updatesfrom.id) {
                queryString = queryString + "&where_updatesfrom_id=" + options.updatesfrom.id
              }
            }
            var defaultActionController = new DefaultActionController(),
                commands                = {
                  commands: defaultActionController.actionItems.getAllCommandSignatures(
                      defaultActionController.commands)
                };
            this.constRESTUrl = Url.appendQuery(this.constRESTUrl,
                Url.combineQueryString(commands)) + queryString;
            this.feedRESTUrl = this.constRESTUrl;
            options.params = $.extend(this.defaults.params, options.params);
            if (options.params.queryParams) {
              var queryParams = options.params.queryParams !== undefined ?
                                ("&" + $.param(options.params.queryParams)) : "";
              this.feedRESTUrl = this.constRESTUrl + queryParams;
            }
            delete this.widgetOptions["remove"];
            delete options["remove"];
            this.widgetOptions = $.extend(this.widgetOptions, options);
          }
          return this.constRESTUrl;
        },
        constructor: function ActivityFeedCollection(models, options) {
          this.options = options || {};
          if (options && options.connector) {
            options.connector.assignTo(this);
          }
          if (options) {
            this.defaults.params = $.extend(this.defaults.params, options.params);
            this.constRESTUrl = options.connector.connection.url;
            this.constRESTUrl += "/pulse/statuses/public_timeline?commands=default&count=" +
                                 (options.feedsize ? options.feedsize : 15)
                                 + "&includes=actions,reply_count&where_feedtype=" +
                                 (options.feedtype ? options.feedtype : "all");
            var queryString = "",
                honorfeedsource,
                objectnodeid;
            if (options.honorfeedsource !== undefined) {
              honorfeedsource = options.honorfeedsource;
            } else if (options.activityfeed && options.activityfeed.honorfeedsource !== undefined) {
              honorfeedsource = options.activityfeed.honorfeedsource;
            }
            if (options.objectnodeid !== undefined) {
              objectnodeid = options.objectnodeid;
            } else if (options.activityfeed && options.activityfeed.objectnodeid !== undefined) {
              objectnodeid = options.activityfeed.objectnodeid;
            }
            if (!!honorfeedsource && objectnodeid !== undefined) {
              queryString = "&where_feedsource=pulsefrom&where_feedsource_id=" + objectnodeid;
            } else if (options.feedsource !== undefined) {
              if (options.feedsource.source !== undefined && options.feedsource.source) {
                queryString = "&where_feedsource=" + options.feedsource.source
              }
              if (options.feedsource.id !== undefined && options.feedsource.id) {
                queryString = queryString + "&where_feedsource_id=" + options.feedsource.id
              }
            }
            if (options.updatesfrom !== undefined) {
              if (options.updatesfrom.from !== undefined && options.updatesfrom.from) {
                queryString = queryString + "&where_updatesfrom=" + options.updatesfrom.from
              }
              if (options.updatesfrom.id !== undefined && options.updatesfrom.id) {
                queryString = queryString + "&where_updatesfrom_id=" + options.updatesfrom.id
              }
            }
            this.constRESTUrl = this.constRESTUrl + queryString;
            this.feedRESTUrl = this.constRESTUrl;
            this.enableComments = options.enableComments;
            this.enableFilters = options.enableFilters;
            this.maxMessageLength = options.maxMessageLength;
            this.feedtype = options.feedtype;
            this.context = options.context !== undefined ? options.context :
                           options.activityfeed.context;
            this.widgetOptions = $.extend(options, this.widgetOptions);
          }

          Backbone.Collection.prototype.constructor.apply(this, arguments);
        },
        fetch: function (options) {
          if (!!options && !($.isEmptyObject(options))) {
            this.options = options;
          }
          return this.Fetchable.fetch.apply(this, arguments);
        },
        parse: function (response) {
          var returnData = JSON.parse(JSON.stringify(response.data));
          this.config_settings = response.config_settings;
          return this.parseActivityFeedResponse(returnData);
        },
        fetchError: function (collection, response) {
          var args = {
            parent: "body",
            errorContent: response.responseJSON ?
                          ( response.responseJSON.errorDetail ? response.responseJSON.errorDetail :
                            response.responseJSON.error) :
                          collection.lang.defaultErrorMessageCommentsFetch
          }
          collection.commonUtil.openErrorDialog(args);
        },
        parseActivityFeedResponse: function (jsonResponse) {
          for (var response in jsonResponse) {
            var currentObj = jsonResponse[response];
            currentObj["commentText"] = $.trim(currentObj.text);
            currentObj["maxMessageLength"] = this.maxMessageLength;
            currentObj["feedtype"] = !!this.options.feedtype ? this.options.feedtype :
                                     this.feedtype;
            currentObj["widgetOptions"] = this.widgetOptions;
            currentObj["config_settings"] = this.config_settings;
            currentObj.created_at_iso8601 = this.base.formatFriendlyDateTimeNow(
                currentObj.created_at_iso8601);
            if (currentObj.modified_at_iso8601 !== "" &&
                currentObj.modified_at_iso8601 !== undefined) {
              currentObj.modified_at_iso8601 = this.base.formatFriendlyDateTimeNow(
                  currentObj.modified_at_iso8601);
            }
          }
          return jsonResponse;
        }
      }));
  return ActivityFeedCollection;
});
