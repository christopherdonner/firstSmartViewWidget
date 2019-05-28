/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/ancestor', 'csui/utils/url'
], function (_, AncestorModel, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          return Url.combine(this.node.urlBase(), "ancestors");
        },

        parse: function (response, options) {

          response = response.ancestors;

          if (this.options.stop) {
            var id = this.options.stop.get ? this.options.stop.get("id") :
              this.options.stop.id;
            var skip;
            response = _
              .filter(response.reverse(), function (ancestor) {
                var result = !skip;
                if (ancestor.id == id) {
                  skip = true;
                }
                return result;
              })
              .reverse();
          }

          if (this.options.limit && response.length > this.options.limit) {
            response.splice(0, response.length - this.options.limit);
            response.unshift({
              type: AncestorModel.Hidden
            });
          }
          _.each(response, function (node) {
            node.container = true;
          });

          return response;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
