/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone'
], function (module, _, Backbone) {

  var SearchQueryTargetBrowseModel = Backbone.Model.extend({

    constructor: function SearchQueryTargetBrowseModel(attributes, options) {
      SearchQueryTargetBrowseModel.__super__.constructor.apply(this, arguments);
    },

    toJSON: function () {
      return SearchQueryTargetBrowseModel.__super__.toJSON.apply(this, arguments);
    }
  });
  return SearchQueryTargetBrowseModel;
});
