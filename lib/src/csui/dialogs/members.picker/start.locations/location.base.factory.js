/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  "use strict";

  function LocationBaseFactory(options) {
    this.options = options || {};
  }

  _.extend(LocationBaseFactory.prototype, {

    updateLocationModel: function (model) {
    },

    getLocationParameters: function () {
      return {
        container: null,
        collection: null,
        locationName: ''
      };
    }

  });

  LocationBaseFactory.extend = Backbone.View.extend;

  return LocationBaseFactory;

});
