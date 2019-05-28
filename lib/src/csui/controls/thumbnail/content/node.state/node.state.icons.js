/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui-ext!csui/controls/table/cells/node.state/node.state.icons',
  'csui-ext!csui/controls/thumbnail/content/node.state/node.state.icons'
], function (_, Backbone, extraNodeStateIcons, extraThumbnailNodeStateIcons) {
  'use strict';

  var NodeStateIconModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      iconView: null,
      iconViewOptions: null
    },

    constructor: function NodeStateIconModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var NodeStateIconCollection = Backbone.Collection.extend({

    model: NodeStateIconModel,
    comparator: 'sequence',

    constructor: function NodeStateIconCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });

  var nodeStateIcons = new NodeStateIconCollection();

  if (extraThumbnailNodeStateIcons) {
    extraThumbnailNodeStateIcons = _.flatten(extraThumbnailNodeStateIcons, true);
    nodeStateIcons.add(extraThumbnailNodeStateIcons);
  }

  return nodeStateIcons;
});