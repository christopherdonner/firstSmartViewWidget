/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/models/widget/search.results/search.metadata/search.metadata.items'
], function (_, $, Backbone, metadataCollection) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        sync: function (method, model, options) {
          var deferred = $.Deferred();
          options = _.defaults({parse: true}, options);
          this.trigger('request', this, {}, options);
          setTimeout(function () {
            options.success.call(options.context, metadataCollection, 'success', {});
            deferred.resolve();
          }.bind(this));
          return deferred.promise();
        },

        parse: function (response, options) {
          return this.parseSearchMetadataResponse(response, options);
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
