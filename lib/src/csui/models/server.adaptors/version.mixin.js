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
          var url = Url.combine(this.connector.connection.url, 'nodes',
            this.get('id'), 'versions');
          if (!this.isNew()) {
            url = Url.combine(url.replace("/v1", "/v2"), this.get('version_number'));
            var query = Url.combineQueryString(
              this.getExpandableResourcesUrlQuery()
            );
            if (query) {
              url += '?' + query;
            }
          }

          return url;
        },

        parse: function (response) {
          var version = response.data || this.parseVersionsResponse(response);
          if (version.id_expand && version.id_expand.type) {
            version.type = version.id_expand.type;
          }

          if (!!version.version_number_name) {
            version.version_number_name_formatted = version.version_number_name;
          }

          if (version.commands) {
            var commands = version.commands;
            version.actions = _
              .chain(commands)
              .keys()
              .map(function (key) {
                var attributes = commands[key];
                attributes.signature = key;
                return attributes;
              })
              .value();
            delete version.commands;
            delete version.commands_map;
            delete version.commands_order;
          }

          return version;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
