/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/collection.state/collection.state.view'
], function (_, Backbone, Marionette, CollectionStateView) {
  'use strict';

  var CollectionStateBehavior = Marionette.Behavior.extend({

    constructor: function CollectionStateBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;
      var viewCollection = view.collection || view.options.collection,
          collection = getBehaviorOption.call(this, 'collection') ||
                       viewCollection;
      this.listenTo(collection, 'request', this._fetchingCollectionStarted)
          .listenTo(collection, 'sync', this._fetchingCollectionSucceeded)
          .listenTo(collection, 'error', this._fetchingCollectionFailed)
          .listenTo(viewCollection, 'reset', this._collectionReset);

      this.collectionState = new Backbone.Model({
        state: collection.fetching ? 'loading' :
               collection.error ? 'failed' :
               collection.length ? 'full' : 'empty'
      });

      var stateView = this.getOption('stateView');
      if (_.isFunction(stateView) &&
          !(stateView.prototype instanceof Backbone.View)) {
        stateView = stateView.call(view);
      }
      view.emptyView = stateView || CollectionStateView;

      var self = this;
      view.emptyViewOptions = function () {
        return _.extend({
          model: self.collectionState,
          stateMessages: getBehaviorOption.call(self, 'stateMessages') || {}
        }, getBehaviorOption.call(self, 'stateViewOptions'));
      };
    },

    _collectionReset: function (collection) {
      var state = this.collectionState.get('state');
      if (state !== 'loading' && state !== 'error') {
        this.collectionState.set('state', collection.length ? 'full' : 'empty');
      }
    },

    _fetchingCollectionStarted: function () {
      if (this.view.collection.length === 0) {
        this.collectionState.set('state', 'loading');
        this.view.collection.reset();
        this.view.blockWithoutIndicator && this.view.blockWithoutIndicator();
      }
    },

    _fetchingCollectionSucceeded: function () {
      this.collectionState.set('state',
          this.view.collection.length ? 'full' : 'empty');
      this.view.unblockActions && this.view.unblockActions();
    },

    _fetchingCollectionFailed: function () {
      this.collectionState.set('state', 'failed');
      this.view.unblockActions && this.view.unblockActions();
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return CollectionStateBehavior;
});
