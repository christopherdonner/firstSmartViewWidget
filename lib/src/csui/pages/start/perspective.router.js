/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/utils/contexts/factories/browsing.states'
], function (Backbone, BrowsingStateCollectionFactory) {
  'use strict';

  var PerspectiveRouter = Backbone.Router.extend({

    constructor: function PerspectiveRouter(options) {
      Backbone.Router.prototype.constructor.apply(this, arguments);
      this.context = options.context;
      this._routeWithSlashes = options.routeWithSlashes;
      this.browsingStates = this.context.getCollection(BrowsingStateCollectionFactory);
      this.listenTo(this, 'other:route', this.onOtherRoute);
    },

    execute: function (callback, args) {
      this.trigger('before:route', this);
      return Backbone.Router.prototype.execute.apply(this, arguments);
    },

    navigate: function navigate(fragment, options) {
      var urlIncludedQuery = options && options.urlIncludedQuery;
      if (this._routeWithSlashes && urlIncludedQuery !== true) {
        var query = location.search;
        this.browsingStates && (query = this.browsingStates.clearMetadataParamsInUrlQuery(query));
        fragment += query + location.hash;
      }

      this.trigger('before:route', this);
      return Backbone.Router.prototype.navigate.call(this, fragment, options);
    }

  });

  return PerspectiveRouter;

});
