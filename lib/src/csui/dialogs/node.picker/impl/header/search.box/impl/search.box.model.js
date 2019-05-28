/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone'
], function (module, _, Backbone) {

  var SearchBoxModel = Backbone.Model.extend({

    constructor: function SearchBoxModel(attributes, options) {
      SearchBoxModel.__super__.constructor.apply(this, arguments);
    },

    toJSON: function () {
      return SearchBoxModel.__super__.toJSON.apply(this, arguments);
    }
  });

  return SearchBoxModel;
});