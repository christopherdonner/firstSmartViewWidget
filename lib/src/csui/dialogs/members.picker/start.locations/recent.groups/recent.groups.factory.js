/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/dialogs/node.picker/start.locations/location.base.factory',
  'csui/dialogs/members.picker/start.locations/recent.groups/impl/recent.groups.collection',
  'csui/utils/commands', 'i18n!csui/dialogs/members.picker/start.locations/impl/nls/lang'
], function (_, $, LocationBaseFactory, RecentContainerCollection, commands, lang) {
  "use strict";

  var RecentGroupsFactory = LocationBaseFactory.extend({

    updateLocationModel: function (model) {
      var container = this.options.container;
      model.set({
        name: lang.labelRecentGroups,
        icon: 'recent',
        invalid: !(container && container.isFetchable())
      });
      return $.Deferred().resolve().promise();
    },

    getLocationParameters: function () {
      var container = this.options.container;
      var memberCollectionModel = new RecentContainerCollection(undefined, {
        connector: this.options.connector
      });
      container.set('unselectable', false);
      return {
        container: this.options.container,
        collection: memberCollectionModel,
        locationName: lang.labelCurrentLocation
      };
    }
  });
  return RecentGroupsFactory;
});