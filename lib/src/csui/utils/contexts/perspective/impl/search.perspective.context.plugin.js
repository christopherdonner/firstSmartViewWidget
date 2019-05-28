/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/search.perspectives'
], function (require, _, Backbone, log, SearchQueryModelFactory,
    ApplicationScopeModelFactory, PerspectiveContextPlugin,
    searchPerspectives) {
  'use strict';

  var SearchPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function SearchPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory);
      this.searchQuery = this.context
          .getModel(SearchQueryModelFactory, {
            permanent: true,
            detached: true
          })
          .on('change', this._fetchSearchPerspective, this);
    },

    _fetchSearchPerspective: function () {
      var perspective = searchPerspectives.findByQuery(this.searchQuery);
      this.applicationScope.set('id', 'search'); // set application view state
      this.context.loadPerspective(perspective.get('module'));
    }

  });

  return SearchPerspectiveContextPlugin;

});
