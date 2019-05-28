/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/backbone', 'csui/utils/log',
  'i18n!csui/models/impl/nls/lang'
], function (module, Backbone, log, lang) {
  'use strict';
  var NodeChildrenColumnModel = Backbone.Model.extend({

    constructor: function NodeChildrenColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var titleTranslated = lang[attributes.column_key];
        if (titleTranslated !== undefined) {
          attributes.title = titleTranslated;
        }
      }
      Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    idAttribute: null

  });

  return NodeChildrenColumnModel;

});
