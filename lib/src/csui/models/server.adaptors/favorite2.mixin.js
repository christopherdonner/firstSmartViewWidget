/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      var superParseMethod = prototype.parse;
      var superSyncMethod = prototype.sync;

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        parse: function (response, options) {
          if (response.results) {
            response = response.results;
          }
          if (_.isEmpty(response)) {
            return {};
          } else {
            if (options.attrs) {
              var updatedAttributes = {};
              _.each(_.keys(options.attrs), function (attr) {
                updatedAttributes['favorite_' + attr] = options.attrs[attr];
              }, this);
              return updatedAttributes;
            } else {
              if (response.data && response.data.properties && response.data.favorites) {
                response.data.properties.favorite_name = response.data.favorites.name;
                response.data.properties.favorite_tab_id = response.data.favorites.tab_id;
              }

              var m = superParseMethod.call(this, response);

              if (m.actions) {
                m.actions = _.reject(m.actions,
                  function (action) {
                    return action.signature == 'rename' || action.signature == 'delete';
                  });
                m.actions.push({signature: 'favorite_rename'});
              }
              return m;
            }
          }
        },

        sync: function (method, model, options) {
          var useFavoritesUrl = false;
          if (method === 'update' || method === 'patch') {
            var prefix = 'favorite_';
            var attributesToUpdate = {};
            _.each(_.keys(options.attrs), function (k) {
              var newKey = k;
              if (k.indexOf(prefix) === 0) {
                useFavoritesUrl = true;
                newKey = k.substr(prefix.length);
              }
              attributesToUpdate[newKey] = options.attrs[k];
            });
            options.attrs = attributesToUpdate;
            if (useFavoritesUrl) {
              var url = this.connector.connection.url.replace('/v1', '/v2');
              url = Url.combine(url, '/members/favorites');
              url = Url.combine(url, model.id);

              options.url = url;
            }
          }
          return superSyncMethod.call(this, method, model, options);
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
