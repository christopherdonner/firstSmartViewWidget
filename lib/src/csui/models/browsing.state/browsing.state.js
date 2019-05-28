/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';
  var BrowsingStateModel = Backbone.Model.extend({

    idAttribute: null,

    constructor: function BrowsingStateModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    setData: function (attributes, options) {
      this.set(attributes, options);
    },
    getBaseUrlPath: function () {
      return '';
    }

  });


  return BrowsingStateModel;

});
