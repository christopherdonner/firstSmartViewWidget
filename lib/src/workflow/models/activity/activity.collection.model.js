/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'workflow/models/activity/activity.model'
], function (_, $, Backbone, Url, ActivityModel) {
  'use strict';

  var ActivityCollection = Backbone.Collection.extend({
    model: ActivityModel,

    url: function () {
      var url = this.connector.connection.url.replace('/v1', '/v2');
      return Url.combine(url,
          'processes', this._processId,
          'subprocesses', this._subprocessId,
          'activities');
    },

    parse: function (response) {
      return response.results.data;
    },

    constructor: function ActivityCollection(context, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    isFetchable: function () {
      if (this._processId !== undefined && this._subprocessId !== undefined) {
        return true;
      } else {
        return false;
      }
    },

    setData: function (data) {
      this._processId = data.processId;
      this._subprocessId = data.subprocessId;
    }
  });
  return ActivityCollection;
});
