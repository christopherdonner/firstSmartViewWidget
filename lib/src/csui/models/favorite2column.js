/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/url',
  'i18n!csui/models/impl/nls/lang'
], function (_, Backbone,
    Url,
    lang) {
  'use strict';

  var Favorite2ColumnModel = Backbone.Model.extend({

    idAttribute: null,

    constructor: function Favorite2ColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'fav_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      Backbone.Model.prototype.constructor.call(this, attributes, options);
    }

  });

  return Favorite2ColumnModel;
});
