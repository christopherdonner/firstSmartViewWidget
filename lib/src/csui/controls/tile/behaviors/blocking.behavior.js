/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/progressblocker/blocker'
], function (_, Marionette, BlockingView) {
  'use strict';

  var BlockingBehavior = Marionette.Behavior.extend({

    constructor: function BlockingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      var blockingParentView = getOption.call(this, 'blockingParentView', options);
      if (blockingParentView) {
        BlockingView.delegate(view, blockingParentView);
      } else {
        BlockingView.imbue(view);
      }

      if (this.collection) {
        view.listenTo(view.collection, "request", view.blockActions)
            .listenTo(view.collection, "sync", view.unblockActions)
            .listenTo(view.collection, "destroy", view.unblockActions)
            .listenTo(view.collection, "error", view.unblockActions);
      }
      if (view.model) {
        view.listenTo(view.collection, "request", view.blockActions)
            .listenTo(view.collection, "sync", view.unblockActions)
            .listenTo(view.collection, "error", view.unblockActions);
      }
    }

  });
  function getOption(property, options) {
    options = this.options || options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return BlockingBehavior;

});
