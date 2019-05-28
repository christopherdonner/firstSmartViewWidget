/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/marionette'
], function (_, Marionette) {
  'use strict';

  var ViewEventsPropagationMixin = {

    propagateEventsToViews: function () {
      var views = Array.prototype.slice.call(arguments);
      _.each(this._eventsToPropagateToViews,
          _.bind(this._propagateEventToViews, this, views));
    },

    cancelEventsToViewsPropagation: function () {
      var views = Array.prototype.slice.call(arguments);
      _.each(this._eventsToPropagateToViews,
          _.bind(this._cancelEventToViewsPropagation, this, views));
    },

    _propagateEventToViews: function (views, name) {
      _.each(views, function (view) {
        var childView = view;
        view.listenTo(this, name, function () {
          if (childView._isShown && childView._isRendered &&
              Marionette.isNodeAttached(childView.el)) {
            var parameters = Array.prototype.slice.call(arguments);
            parameters.unshift(childView, name);
            Marionette.triggerMethodOn.apply(Marionette, parameters);
          }
        }, this);
      }, this);
    },

    _cancelEventToViewsPropagation: function (views, name) {
      _.each(views, function (view) {
        view.stopListening(this, name, undefined, this);
      }, this);
    },

    _eventsToPropagateToViews: ['dom:refresh']

  };

  return ViewEventsPropagationMixin;

});
