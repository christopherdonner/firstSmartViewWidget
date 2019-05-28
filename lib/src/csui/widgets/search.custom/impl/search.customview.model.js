/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/utils/url'
], function (_, $, Backbone, ConnectableMixin, FetchableMixin, Url) {
  var SearchCustomModel = Backbone.Model.extend({

    constructor: function SearchCustomModel(attributes, options) {
      options || (options = {});
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      this.options = options;
      this.makeConnectable(options).makeFetchable(options);
    }
  });

  ConnectableMixin.mixin(SearchCustomModel.prototype);
  FetchableMixin.mixin(SearchCustomModel.prototype);
  _.extend(SearchCustomModel.prototype, {

    isFetchable: function () {
      return !!this.options;
    },

    url: function () {
      return Url.combine(this.connector.connection.url,
          'nodes/' + this.options.nodeId + '/customviewsearchforms');
    },

    parse: function (response, options) {
      response.name = response.text;
      return response;
    }
  });

  return SearchCustomModel;
});



