/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/contexts/factories/search.results.factory'
], function (SearchResultsFactory) {

  var SearchResultCollectionFactory = SearchResultsFactory.extend({

    constructor: function SearchResultCollectionFactory(context, options) {
      SearchResultsFactory.prototype.constructor.apply(this, arguments);
      console.warn('warning: "csui/widgets/search.results/impl/search.results.factory" has been' +
                  ' deprecated. Use "csui/utils/contexts/factories/search.results.factory');
    }

  });

  return SearchResultCollectionFactory;

});
