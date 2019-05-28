/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/node/node.model', 'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin', 'csui/models/browsable/browsable.mixin',
  'csui/models/browsable/v1.request.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/widget/search.results/search.response.mixin',
  'csui/models/widget/search.results/search.facets',
  'csui/models/widget/search.results/server.adaptor.mixin',
  'i18n!csui/models/widget/nls/lang', 'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, Url, NodeModel, ConnectableMixin, FetchableMixin, BrowsableMixin,
    BrowsableV1RequestMixin, BrowsableV2ResponseMixin, DelayedCommandableV2Mixin,
    AdditionalResourcesV2Mixin, SearchResponseMixin, SearchFacetCollection, ServerAdaptorMixin,
    lang) {
  'use strict';

  var SearchResultCollection = Backbone.Collection.extend({
    model: NodeModel,

    constructor: function SearchResultCollection(models, options) {
      this.options = options || (options = {});
      this.expand = options.expand || {properties: 'reserved_user_id'};
      Backbone.Collection.prototype.constructor.call(this, models, options);
      this.includeCommands = options.commands || [];

      this.title = lang.searchResults;

      this.searchFacets = new SearchFacetCollection();

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeBrowsable(options)
          .makeBrowsableV1Request(options)
          .makeBrowsableV2Response(options)
          .makeDelayedCommandableV2(options)
          .makeSearchResponse(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.models, {
        connector: this.connector,
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: _.clone(this.orderBy),
        expand: _.clone(this.expand),
        includeActions: this.includeActions,
        commands: _.clone(this.includeCommands),
        includeCommands: _.clone(this.includeCommands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands
      });
    },

    isFetchable: function () {
      return (!!this.options.query.get('where') || !!this.options.query.get('query_id'));
    },

    setDefaultPageNum: function () {
      this.skipCount = 0;
    },

    getResourceScope: function () {
      return _.deepClone({
        includeResources: this._additionalResources,
        includeCommands: this.includeCommands,
        commands: this.includeCommands,
        defaultActionCommands: this.defaultActionCommands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
      scope.includeCommands && (this.includeCommands = scope.includeCommands);
      this.resetDefaultActionCommands();
      scope.defaultActionCommands && this.setDefaultActionCommands(scope.defaultActionCommands);
    }
  });

  BrowsableMixin.mixin(SearchResultCollection.prototype);
  BrowsableV1RequestMixin.mixin(SearchResultCollection.prototype);
  BrowsableV2ResponseMixin.mixin(SearchResultCollection.prototype);
  ConnectableMixin.mixin(SearchResultCollection.prototype);
  FetchableMixin.mixin(SearchResultCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(SearchResultCollection.prototype);
  SearchResponseMixin.mixin(SearchResultCollection.prototype);
  ServerAdaptorMixin.mixin(SearchResultCollection.prototype);
  DelayedCommandableV2Mixin.mixin(SearchResultCollection.prototype);

  return SearchResultCollection;
});
