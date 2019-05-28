/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/search.box.model'
], function (module, _, $, Backbone, CollectionFactory, ConnectorFactory,
    SearchBoxModel) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var SearchBoxFactory = CollectionFactory.extend({
    propertyPrefix: 'searchBox',

    constructor: function SearchBoxFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var searchBox = this.options.searchBox || {},
          config = module.config();
      if (prefetch) {
        this.initialResponse = searchBox.initialResponse || config.initialResponse;
      }
      if (!(searchBox instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options);
        searchBox = new SearchBoxModel(searchBox.attributes || config.attributes,
          _.defaults({
            connector: connector
          }, searchBox.options, config.options, {
            autofetch: true
          }));
      }
      this.property = searchBox;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return SearchBoxFactory;
});
