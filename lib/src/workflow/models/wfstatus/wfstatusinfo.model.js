/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone',
  'csui/lib/underscore',
  'csui/utils/url',
  'csui/models/node/node.model'
], function (Backbone, _, Url, NodeModel) {
  'use strict';

  var WFStatusInfoModel = Backbone.Model.extend({

    constructor: function WFStatusInfoModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    url: function () {
      var baseUrl      = this.connector.connection.url.replace('/v1', '/v2'),
          getUrl       = Url.combine(baseUrl, 'workflows/status'),
          processId    = this.get('process_id');
      getUrl += "/processes/" + processId ;
      return getUrl;
    },

    parse: function (response) {

      return response.results;

    },

    reset: function (options) {
      this.clear(options);
      if (!_.isUndefined(this.wfStatusInfo)) {
        this.wfStatusInfo.reset();
      }
    },

    isFetchable: function () {
      return true;
    }
  });

  return WFStatusInfoModel;

});
