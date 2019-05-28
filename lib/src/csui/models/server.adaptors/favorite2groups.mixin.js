/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/url', 'i18n!csui/models/impl/nls/lang'
], function ($, _, Url, lang) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        sync: function (method, model, options) {
          if (method !== 'read') {
            throw new Error('Only fetching groups with favorites is supported.');
          }
          var groups = $.ajax(this.connector.extendAjaxOptions({url: this.url()}))
            .then(function (response) {
              return response;
            });

          var favoritesCollection = this.favorites;
          var favoritesFetchOptions = _.omit(options, ['success', 'error']);
          var favorites = favoritesCollection.fetch(favoritesFetchOptions)
            .then(function (response) {
              return favoritesCollection; // need full object, including columns when merging
            });
          options.parse = false;

          return this.syncFromMultipleSources([groups, favorites], this._createMergedResponse, options);
        },

        _createMergedResponse: function (groups, favoritesCollection, options) {
          var favorites = favoritesCollection.toJSON();
          var columns = favoritesCollection.columns;
          groups.results.push({data: {name: lang.fav_ungrouped, order: -1, tab_id: -1}});
          var merged = groups.results.map(function (group) {
            group = group.data;

            var tabId = group.tab_id;
            group.favorites = favorites.filter(function (favorite) {
              return favorite.favorite_tab_id === tabId || tabId === -1 && favorite.favorite_tab_id ===
                null;
            });
            group.favorite_columns = columns.toJSON(); //
            return group;
          });

          return merged;
        },

        parse: function (response, options) {
          return response;
        },

        url: function () {
          var url = this.connector.connection.url.replace('/v1', '/v2'),
            query = Url.combineQueryString(
              this.getAdditionalResourcesUrlQuery(),
              this.getResourceFieldsUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getSortByOrderUrlQuery()
            );
          url = Url.combine(url, '/members/favorites/tabs');
          return query ? url + '?' + query : url;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
