/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/dialogs/node.picker/start.locations/location.base.factory',
  'i18n!csui/dialogs/node.picker/start.locations/impl/nls/lang',
  'csui/dialogs/node.picker/start.locations/recent.containers/impl/recent.containers.collection'
], function (_, $, LocationBaseFactory, lang, RecentContainerCollection) {
  "use strict";

  var RecentContainerFactory = LocationBaseFactory.extend({

    updateLocationModel: function (model) {
      model.set({
        name: lang.labelRecentContainers,
        icon: 'recent'
      });
      return $.Deferred().resolve().promise();
    },

    getLocationParameters: function () {
      var nodes = new RecentContainerCollection(undefined, {
        connector: this.options.connector,
        autoreset: true,
        expand: ['node']
      });
      return {
        container: null,
        collection: nodes,
        locationName: lang.labelRecentContainers
      };
    }

  });

  return RecentContainerFactory;

});
