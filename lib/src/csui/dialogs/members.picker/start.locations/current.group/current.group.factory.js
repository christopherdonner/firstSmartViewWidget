/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/dialogs/node.picker/start.locations/location.base.factory',
  'csui/models/member/membercollection',
  'i18n!csui/dialogs/members.picker/start.locations/impl/nls/lang'
], function (_, $, LocationBaseFactory, MemberCollectionModel, lang) {
  "use strict";

  var CurrentGroupFactory = LocationBaseFactory.extend({

    updateLocationModel: function (model) {
      var container = this.options.container;
      model.set({
        hide: true,
        invalid: false
      });
      return $.Deferred().resolve().promise();
    },

    getLocationParameters: function () {
      var container = this.options.container;
      var memberCollectionModel = new MemberCollectionModel(undefined, {
        connector: this.options.connector,
        groupId: container.groupId,
        member: container
      });
      container.set('unselectable', false);
      return {
        container: this.options.container,
        collection: memberCollectionModel,
        locationName: lang.labelCurrentLocation
      };
    }
  });
  return CurrentGroupFactory;
});
