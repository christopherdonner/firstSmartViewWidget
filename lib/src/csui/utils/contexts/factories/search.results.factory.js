/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/models/widget/search.results/search.results.model',
  'csui/utils/commands',
  'csui/utils/base'
], function (require, module, _, Backbone, CollectionFactory, ConnectorFactory,
    SearchQueryModelFactory, SearchResultCollection, commands, base) {

  var SearchResultCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'searchResults',

    constructor: function SearchResultCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var searchResults = this.options.searchResults || {};
      if (!(searchResults instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            query     = options.searchResults.query,
            config    = module.config();
        searchResults = new SearchResultCollection(searchResults.models, _.extend({
          connector: connector,
          query: query,
          commands: commands.getAllSignatures()
        }, searchResults.options, config.options, {
          autofetch: true,
          autoreset: true
        }));
      }
      this.property = searchResults;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      this.property.fetch({
        success: _.bind(this._onSearchResultsFetched, this, options),
        error: _.bind(this._onSearchResultsFailed, this, options)
      });
    },

    _onSearchResultsFetched: function (options) {
      return true;
    },

    _onSearchResultsFailed: function (model, request, message) {
      var error = new base.RequestErrorMessage(message);
      require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlert) {
        ModalAlert.showError(error.toString());
      });
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        commands: commands.getAllSignatures()
      });
    }

  });

  return SearchResultCollectionFactory;

});
