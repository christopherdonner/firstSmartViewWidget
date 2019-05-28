/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', "csui/lib/backbone"
], function (_, Backbone, lang, extraTableColumns) {

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  return TableColumnModel;
});
