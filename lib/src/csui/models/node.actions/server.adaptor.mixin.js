/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var query;
          if (!!this.parent_id) {
            query = Url.combineQueryString({
                  reference_id: this.parent_id,
                  ids: this.nodes
                },
                this.getRequestedCommandsUrlQuery()
            );
          }
          else {
            query = Url.combineQueryString({
                  ids: this.nodes
                },
                this.getRequestedCommandsUrlQuery()
            );
          }


          return Url.combine(this.connector.connection.url.replace('/v1', '/v2'),
            '/nodes/actions') + '?' + query;
        },

        parse: function (response, options) {
          if (_.isArray(response)) {
            return response;
          }
          return _.map(response.results, function (value, key) {
            return {
              id: key,
              actions: _.map(value.data, function (value, key) {
                value.signature = key;
                return value;
              })
            };
          }, {});
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
