/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url',
  'csui/models/node.facets/facet.query.mixin'
], function (_, Url, FacetQueryMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      FacetQueryMixin.mixin(prototype);

      return _.extend(prototype, {
        filterQueryParameterName: 'filter',

        makeServerAdaptor: function (options) {
          return this.makeFacetQuery(options);
        },

        cacheId: '',

        url: function () {
          var url   = this.connector.connection.url.replace('/v1', '/v2'),
            query = this.options.query.toJSON();
          if (!!this.options.query.resetDefaults) {
            this.orderBy = "";
            this.skipCount = 0;
            this.options.query.resetDefaults = false;
          } else {
            this.orderBy = ((this.orderBy) &&
              (this.previousQuery !== this.options.query.attributes.where)) ? "" :
              this.orderBy;
            this.skipCount = (this.previousOrderBy !== this.orderBy) ? 0 : this.skipCount;
          }
          query = Url.combineQueryString(
            this.getBrowsableUrlQuery(),
            this.getFilterQuery(this.searchFacets.filters),
            {
              expand: 'properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}',
              options: '{\'highlight_summaries\',\'facets\'}'
            },
            this.getRequestedCommandsUrlQuery(),
            query
          );
          if ((!!this.orderBy || !!this.pagination) && !!this.cacheId) {
            query = Url.combineQueryString(query, "cache_id=" + this.cacheId);
            this.pagination = false; // reset pagination to default.
          }
          return Url.combine(url, 'search?' + query);
        },

        parse: function (response, options) {
          this.parseBrowsedState(response.collection, options);
          this.parseSearchResponse(response, options);
          this._parseFacets(response.collection.searching.facets);
          response.results.sorting = response.collection.sorting;
          this.cacheId = (!!response.collection && !!response.collection.searching &&
            !!response.collection.searching.cache_id) ?
            response.collection.searching.cache_id : "";
          return this.parseBrowsedItems(response, options);
        },

        _parseFacets: function (facets) {
          var topics;
          if (facets) {
            topics = convertFacets(facets.selected, true)
                .concat(convertFacets(facets.available, false));
          }
          this.searchFacets.reset(topics);
        }
      });
    }
  };

  function convertFacets (facets, selected) {
    return _.map(facets, function (facet) {
      var topics = _.map(facet.facet_items, function (topic) {
        return {
          name: topic.display_name,
          total: topic.count,
          value: topic.value,
          selected: selected
        };
      });
      return {
        id: facet.name,
        name: facet.display_name,
        type: facet.type,
        topics: topics,
        items_to_show: 5
      };
    });
  }

  return ServerAdaptorMixin;
});
