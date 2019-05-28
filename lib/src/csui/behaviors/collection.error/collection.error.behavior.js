/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/error/error.view'
], function (_, Backbone, Marionette, ErrorView) {
  'use strict';

  var CollectionErrorBehavior = Marionette.Behavior.extend({

    constructor: function CollectionErrorBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;
      var collection = getBehaviorOption.call(this, 'collection') ||
                       view.collection || view.options.collection;
      var getEmptyView = view.getEmptyView;
      view.getEmptyView = function () {
        return collection.error ? ErrorView :
               getEmptyView.apply(view, arguments);
      };
      var emptyViewOptions = view.emptyViewOptions;
      view.emptyViewOptions = function () {
        var error = collection.error;
        if (error) {
          return {
            model: new Backbone.Model({
              message: error.message
            })
          };
        }
        return _.isFunction(emptyViewOptions) ?
               emptyViewOptions.apply(view, arguments) :
               emptyViewOptions;
      };
      this.listenTo(collection, 'error', function () {
        view.collection.reset();
      });
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return CollectionErrorBehavior;
});
