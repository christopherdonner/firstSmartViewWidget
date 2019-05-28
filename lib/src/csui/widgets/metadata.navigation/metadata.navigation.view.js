/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/progressblocker/blocker', 'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/children', 'csui/utils/contexts/factories/children2',
  'csui/widgets/nodestable/nodestable.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view',
  'csui/behaviors/default.action/impl/defaultaction', 'csui/dialogs/modal.alert/modal.alert',
  'i18n!csui/widgets/metadata.navigation/impl/nls/lang',
  'css!csui/widgets/metadata.navigation/impl/metadata.navigation'
], function (_, $, Backbone, Marionette, base, BlockingView, NodeModelFactory,
    ChildrenCollectionFactory, Children2CollectionFactory, NodesTableView,
    ViewEventsPropagationMixin, MetadataNavigationViewImpl, DefaultActionController,
    ModalAlert, lang) {
  'use strict';
  if (NodesTableView.useV2RestApi) {
    ChildrenCollectionFactory = Children2CollectionFactory;
  }
  var MetadataNavigationView = Marionette.ItemView.extend({

    className: 'cs-metadata-navigation-wrapper',

    template: false,

    constructor: function MetadataNavigationView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.showCloseIcon = false;
      this.options = options;
      this.defaultActionController = new DefaultActionController();
      if (!!this.options.originatingView && !!this.options.originatingView.supportOriginatingView) {
        this.options.baseOriginatingView = this.options.originatingView;
        this.options.originatingView = this;
      }

      Marionette.ItemView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);
    },

    onRender: function () {
      var fetching = this._ensureCompleteData();
      if (fetching) {
        return fetching.done(_.bind(this.render, this));
      }

      this.metadataNavigationView && this.metadataNavigationView.destroy();
      var mnv = this.metadataNavigationView = new MetadataNavigationViewImpl(this.options);
      this.propagateEventsToViews(this.metadataNavigationView);

      this.metadataNavigationView.render();
      Marionette.triggerMethodOn(mnv, 'before:show', mnv, this);
      this.$el.append(mnv.el);
      Marionette.triggerMethodOn(mnv, 'show', mnv, this);
    },

    onBeforeDestroy: function () {
      if (this.metadataNavigationView) {
        this.cancelEventsToViewsPropagation(this.metadataNavigationView);
        this.metadataNavigationView.destroy();
      }
    },

    _ensureCompleteData: function () {
      var self = this;
      var deferred;
      var options = this.options;
      if (!options.model || (!options.collection && !options.containerCollection)) {
        deferred = $.Deferred();
      }

      function ensureCollectionAfterModel() {
        self._ensureCollection()
            .always(function () {
              self.unblockActions();
            })
            .done(function (response) {
              deferred && deferred.resolve(response);
            })
            .fail(function (error) {
              deferred && deferred.reject(error);
            });
      }

      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: options.data.id && {id: options.data.id},
          temporary: true
        });
        options.selected = options.model;
        self.blockActions();
        options.model.ensureFetched()
            .done(function (response) {
              ensureCollectionAfterModel();
            })
            .fail(function (error) {
              self.unblockActions();
              self._showFetchNodeFailMessage(error, options.model.get("id"));
              deferred && deferred.reject(error);
            });
      } else if (!options.collection || !options.containerCollection) {
        options.selected = options.model;
        self.blockActions();
        ensureCollectionAfterModel();
      }

      return deferred && deferred.promise();
    },

    _ensureCollection: function () {
      var self = this;
      var deferred = $.Deferred();
      var options = this.options;

      var collection = options.collection || options.containerCollection;
      if (!collection) {
        options.container = options.context.getModel(NodeModelFactory, {
          attributes: {id: options.model.get('parent_id')},
          temporary: true
        });
        options.container.ensureFetched()
            .done(function (response) {
              collection = options.context.getCollection(
                  ChildrenCollectionFactory, {
                    options: {
                      node: options.container,
                      commands: self.defaultActionController.commands,
                      defaultActionCommands: self.defaultActionController.actionItems.getAllCommandSignatures(
                          self.defaultActionController.commands),
                      delayRestCommands: false
                    }

                  });
              collection.ensureFetched()
                  .done(function (response2) {
                    self._ensureModelInCollection(collection);
                    deferred && deferred.resolve(response2);
                  })
                  .fail(function (error2) {
                    self.unblockActions();
                    self._showFetchNodeFailMessage(error2, options.container.get("id"));
                    deferred && deferred.reject(error2);
                  });
            })
            .fail(function (error) {
              self.unblockActions();
              self._showFetchNodeFailMessage(error, options.container.get("id"));
              deferred && deferred.reject(error);
            });

        return deferred && deferred.promise();
      }

      this._ensureModelInCollection(collection);

      return deferred && deferred.promise().resolve();
    },

    _ensureModelInCollection: function (collection) {
      if (!collection.findWhere({id: this.options.model.get('id')})) {
        collection.add(this.options.model, {at: 0, silent: true});
      }

      this.options.collection || (this.options.collection = collection);
      this.options.containerCollection || (this.options.containerCollection = collection);
    },

    _showFetchNodeFailMessage: function (error, nodeId) {
      var errorObj = new base.Error(error);
      var title = lang.FetchNodeFailTitle;
      var message = _.str.sformat(lang.FetchNodeFailMessage, nodeId, errorObj.message);
      ModalAlert.showError(message, title);
    }

  });

  _.extend(MetadataNavigationView.prototype, ViewEventsPropagationMixin);

  return MetadataNavigationView;

});
