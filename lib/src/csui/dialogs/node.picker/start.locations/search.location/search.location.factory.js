/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/dialogs/node.picker/start.locations/location.base.factory',
  'csui/dialogs/node.picker/start.locations/search.location/impl/search.collection',
  'csui/utils/commands', 'i18n!csui/dialogs/node.picker/start.locations/impl/nls/lang'
], function (_, $, LocationBaseFactory, SearchCollection, commands, lang) {
  "use strict";

  var SearchLocationFactory = LocationBaseFactory.extend({

    updateLocationModel: function (model) {
      var container = this.options.container;
      model.set({
        hide: true,
        invalid: false
      });
      return $.Deferred().resolve().promise();
    },

    getLocationParameters: function (options) {
      var container = this.options.container;
      var children = new SearchCollection(undefined, options);
      if (container) {
        container.set('unselectable', false);
      }
      return {
        container: container,
        collection: children
      };
    }
  });
  return SearchLocationFactory;
});

