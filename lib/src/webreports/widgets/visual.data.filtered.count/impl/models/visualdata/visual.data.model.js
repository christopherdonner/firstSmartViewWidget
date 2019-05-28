/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/backbone',
  'webreports/utils/url.webreports',
  'csui/models/mixins/connectable/connectable.mixin'
], function (_, Backbone, UrlWebReports, ConnectableMixin) {

  var FilteredCountModel = Backbone.Model.extend({
    constructor: function FilteredCountModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

    }

  });

  return FilteredCountModel;

});
