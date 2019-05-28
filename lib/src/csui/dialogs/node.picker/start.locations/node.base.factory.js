/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore',
  'csui/dialogs/node.picker/start.locations/location.base.factory',
  'csui/models/node/node.model', 'csui/models/nodechildren', 'csui/utils/commands'
], function ( $, _, LocationBaseFactory, NodeModel, NodeChildrenCollection, commands) {
  "use strict";

  var NodeBaseFactory = LocationBaseFactory.extend({

    constructor: function PersonalVolumeFactory(options) {
      LocationBaseFactory.prototype.constructor.apply(this, arguments);
      this.container = new NodeModel(this.options.node, {
        connector: this.options.connector
      });
    },

    updateLocationModel: function (model) {
      var self = this,
        deferred  = $.Deferred();
      this.container.fetch()
          .then(function () {
            model.set({
              name: self.container.get('name') || self.options.defaultName,
              icon: self.options.icon,
              invalid: false,
              selectable: self.options.selectable
            });
          deferred.resolve();
          }, function () {
            model.set({invalid: true});
            deferred.reject();
          });
      return deferred.promise();
    },

    getLocationParameters: function () {
      var children = new NodeChildrenCollection(undefined, {
        node: this.container,
        autoreset: true,
        expand: ['node'],
        orderBy: 'name asc',
        commands: commands.getAllSignatures()
      });
      this.container.set('unselectable', this.options.unselectable);
      return {
        container: this.container,
        collection: children
      };
    }

  });

  return NodeBaseFactory;

});
