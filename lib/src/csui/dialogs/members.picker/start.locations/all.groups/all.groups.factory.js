/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/dialogs/node.picker/start.locations/location.base.factory',
  'csui/models/member/membercollection',
  'i18n!csui/dialogs/members.picker/start.locations/impl/nls/lang'
], function (_, $, LocationBaseFactory, AllMembersCollection, lang) {
  "use strict";

  var AllMembersFactory = LocationBaseFactory.extend({

    updateLocationModel: function (model) {
      var container = this.options.container;
      model.set({
        name: lang.labelAllGroups,
        icon: 'group',
        invalid: !(container && container.isFetchable())
      });
      return $.Deferred().resolve().promise();
    },

    getLocationParameters: function () {
      var container = this.options.container;
      var membersCollectionModel = new AllMembersCollection(undefined, {
        connector: this.options.connector,
        type: 1
      });
      return {
        container: this.options.container,
        collection: membersCollectionModel,
        locationName: lang.labelCurrentLocation
      };
    }
  });
  return AllMembersFactory;

});
