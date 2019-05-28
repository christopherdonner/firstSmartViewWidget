/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/item.state/item.state.view'
], function (_, Backbone, Marionette, ItemStateView) {
  'use strict';

  var ItemStateBehavior = Marionette.Behavior.extend({

    constructor: function ItemStateBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;
      var model = getBehaviorOption.call(this, 'model') ||
                  view.model || view.options.model;
      this.listenTo(model, 'request', this._fetchingCollectionStarted)
          .listenTo(model, 'sync', this._fetchingCollectionSucceeded)
          .listenTo(model, 'error', this._fetchingCollectionFailed);

      this.itemState = new Backbone.Model({
        state: model.fetching ? 'loading' :
               model.error ? 'failed' : 'loaded'
      });

      var stateView = this.getOption('stateView');
      if (_.isFunction(stateView) &&
          !(stateView.prototype instanceof Backbone.View)) {
        stateView = stateView.call(view);
      }
      this.stateView = stateView || ItemStateView;
      var getTemplate = view.getTemplate,
          self = this;
      view.getTemplate = function () {
        if (!model.fetched) {
          var el = getBehaviorOption.call(self, 'el');
          if (typeof el !== 'string') {
            if (!getBehaviorOption.call(self, 'region')) {
              return false;
            }
          }
        }
        return getTemplate.apply(view, arguments);
      };

      var stateRegion;
      this.listenTo(view, 'render', function () {
            if (!model.fetched) {
              if (stateRegion) {
                stateRegion.empty();
              }
              stateRegion = getBehaviorOption.call(this, 'region');
              if (!stateRegion) {
                var el = getBehaviorOption.call(this, 'el') || view.el;
                if (typeof el === 'string') {
                  el = view.$(el);
                }
                stateRegion = new Marionette.Region({el: el});
              }
              stateRegion.show(new this.stateView(
                  _.extend({
                    model: this.itemState,
                    stateMessages: getBehaviorOption.call(this, 'stateMessages') || {}
                  }, getBehaviorOption.call(this, 'stateViewOptions'))
              ));
            }
          })
          .listenTo(view, 'before:destroy', function () {
            if (stateRegion) {
              stateRegion.empty();
            }
          });
    },

    _fetchingCollectionStarted: function () {
      this.itemState.set('state', 'loading');
      this.view.render();
      this.view.blockWithoutIndicator && this.view.blockWithoutIndicator();
    },

    _fetchingCollectionSucceeded: function (model) {
      this.itemState.set('state', 'loaded');
      this.view.unblockActions && this.view.unblockActions();
    },

    _fetchingCollectionFailed: function () {
      this.itemState.set('state', 'failed');
      this.view.unblockActions && this.view.unblockActions();
    }

  });

  function getBehaviorOption(property) {
    var value = this.getOption(property);
    return (_.isFunction(value) ? value.call(this.view) : value);
  }

  return ItemStateBehavior;
});
