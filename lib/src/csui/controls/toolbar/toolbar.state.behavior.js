/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/toolbar/toolbar.state.view'
], function (_, Backbone, Marionette, ToolbarStateView) {
  'use strict';

  var ToolbarStateBehavior = Marionette.Behavior.extend({

    constructor: function ToolbarStateBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.view = view;
      var collection     = view.collection || view.options.collection,
          delayedActions = this.getOption('delayedActions');
      if (_.isFunction(delayedActions) &&
          !(delayedActions instanceof Backbone.Collection)) {
        delayedActions = delayedActions.call(view);
      }
      if (!delayedActions && collection) {
        delayedActions = collection.delayedActions;
      }
      if (delayedActions) {
        this
            .listenTo(delayedActions, 'request', this._fetchingActionsStarted)
            .listenTo(delayedActions, 'sync', this._fetchingActionsSucceeded)
            .listenTo(delayedActions, 'error', this._fetchingActionsFailed);
      }
      this.listenTo(collection, 'reset change', this._fetchingActionsSucceeded);

      view.actionState = new Backbone.Model({
        state: delayedActions && (delayedActions.fetching ? 'loading' :
                                  delayedActions.error ? 'failed' :
                                  collection.length ? 'full' : 'empty'),
        showMessage: true
      });

      view.emptyView = ToolbarStateView;
      view.emptyViewOptions = {
        model: view.actionState,
        toolbarView: view
      };

      this.listenTo(view, 'render', this._updateClasses);
    },

    _fetchingActionsStarted: function () {
      this.view.actionState.set('state', 'loading');
      this._updateClasses();
    },

    _fetchingActionsSucceeded: function (collection) {
      this.view.actionState.set('state', collection.length ? '' : 'emptyfull');
      this._updateClasses();
    },

    _fetchingActionsFailed: function () {
      this.view.actionState.set('state', 'failed');
      this._updateClasses();
    },

    _updateClasses: function () {
      this.view.$el
          .removeClass('csui-state-empty csui-state-loading csui-state-failed')
          .addClass('csui-state-' + this.view.actionState.get('state'));
    }

  });

  return ToolbarStateBehavior;

});
