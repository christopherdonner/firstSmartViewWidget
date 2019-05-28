/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url', 'csui/models/node/node.model', 'csui/utils/nodesprites'
], function (_, Url, NodeModel, NodeSpriteCollection) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          return Url.combine(this.node.urlBase(), 'addablenodetypes');
        },

        parse: function (response, options) {
          var data        = response.data,
            definitions = response.definitions;
          var self = this;
          return _.chain(data)
            .keys()
            .map(function (key) {
              var url        = data[key],
                definition = definitions[key];
              if (url && definition) {
                var match = url && /[?&]type=([^&]+)(?:&.*)?$/.exec(url);
                if (match) {
                  var subtype = parseInt(match[1], 10);
                  var type_name = NodeSpriteCollection.findTypeByNode(
                    new NodeModel({type: subtype, type_name: definition.name}));
                  return {
                    type: subtype,
                    type_name: type_name
                  };
                }
              }
            })
            .compact()
            .value();
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
