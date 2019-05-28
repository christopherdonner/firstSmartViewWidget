/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/widgets/metadata/impl/header/metadata.header.view',
  'csui/widgets/metadata/impl/metadata.dropdowntab.view', 'csui/models/node/node.model',
  'csui/utils/contexts/factories/node', 'csui/utils/contexts/factories/browsing.states',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/widgets/metadata/impl/metadata.controller', 'csui/utils/nodesprites',
  'csui/controls/progressblocker/blocker', 'csui/utils/commandhelper',
  'csui/widgets/permissions/permissions.view',
  'csui/models/nodechildren', 'csui/models/version', 'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/commands', 'i18n!csui/widgets/metadata/impl/nls/lang',
  'css!csui/widgets/metadata/impl/metadata'
], function (_, $, Marionette, base, MetadataHeaderView, MetadataDropdownTabView,
    NodeModel, NodeModelFactory, BrowsingStateCollectionFactory, ViewEventsPropagationMixin,
    MetadataController, NodeSpriteCollection, BlockingView, CommandHelper, PermissionsView,
    NodeChildrenCollection, VersionModel, ModalAlert, commands, lang) {

  var MetadataView = Marionette.ItemView.extend({

    className: 'cs-metadata',

    template: false,

    constructor: function MetadataView(options) {
      var self = this;
      options || (options = {});
      options.data || (options.data = {});
      this.options = options;

      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: options.data.id && {id: options.data.id},
          temporary: true
        });
      }
      options.model.unset('initialPanel', {silent: true});
      if (options.data.initialPanel) {
        options.model.set('initialPanel', options.data.initialPanel, {silent: true});
      }

      this.browsingStates = options.context.getCollection(BrowsingStateCollectionFactory);
      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var query = browsingState && browsingState.get('query');
      var perspective = query && query.perspective;
      if (perspective === 'metadata' || perspective === 'metadata.navigation') {
        var panel = query && query.panel;
        panel && options.model.set('initialPanel', panel, {silent: true});
        var path = browsingState && browsingState.get('path');
        var versionNumberUrlOverride = path && path.version_num;
        if (versionNumberUrlOverride && !(options.model instanceof VersionModel)) {
          options.model = new VersionModel({
            id: options.model.get('id'),
            version_number: versionNumberUrlOverride,
            initialPanel: options.model.get('initialPanel')
          }, {
            connector: options.model.connector
          });
          this._ensureCompleteVersionNode();
        }
      }

      this.options.showShortcutSwitch = true;
      this.options.showRequiredFieldsSwitch = true;
      if (this.options.model.get('type') === 1 || !!this.options.model.get('shortcutNode')) {  // shortcut
        if (!!this.options.model.get('shortcutNode') && this.options.model.get('type') !== 1) {
          this.options.shortcutNode = this.options.model.get('shortcutNode');
        } else {
          this.options.model.connector.assignTo(this.options.model.original); //TODO: have to do this?
          this.options.shortcutNode = this.options.model;
          var shortcutResourceScope = this.options.shortcutNode.getResourceScope();
          this.options.model.original.setResourceScope(shortcutResourceScope);
          this.options.model = this.options.model.original;
          this.options.model.set('shortcutNode', this.options.shortcutNode, {silent: true});
        }
        this.options.actionsPromise = this._ensureCompleteNode();
      } else {
        this.options.actionsPromise = $.Deferred().resolve().promise();
      }
      if (!!this.options.originatingView && !!this.options.originatingView.supportOriginatingView) {
        this.options.baseOriginatingView = this.options.originatingView;
        this.options.originatingView = this;
      }

      Marionette.ItemView.prototype.constructor.call(this, options);
      BlockingView.imbue(this);

      this.options.showDropdownMenu = true;
      this.options.originatingView = this.options.originatingView || this;
      this.metadataHeaderView = new MetadataHeaderView(_.extend({
        metadataScenario: true,
        originatingView: this
      }, this.options));
      this.listenTo(this.metadataHeaderView, "metadata:item:name:save", this._saveItemName)
          .listenTo(this.metadataHeaderView, 'metadata:item:before:delete',
              function (args) {
                self.trigger('metadata:item:before:delete', args);
              })
          .listenTo(this.metadataHeaderView, 'metadata:item:before:move',
              function (args) {
                self.trigger('metadata:item:before:move', args);
              })
          .listenTo(this.metadataHeaderView, 'metadata:item:deleted', function (args) {
            self.trigger('metadata:item:deleted', args);
          })
          .listenTo(this.metadataHeaderView, "shortcut:switch", function (view) {
            self.options.model = view.node;
            self.options.model.set('shortcutNode', self.model.get('shortcutNode'), {silent: true});
            this._ensureCompleteNode()
                .always(function () {
                  !!self.metadataTabView && self.metadataTabView.destroy();
                  if (!!self.options.showPermissionView) {
                    self.metadataTabView = new PermissionsView({
                      model: self.options.model,
                      originatingView: self.options.originatingView,
                      context: self.options.context,
                      showCloseIcon: self.options.originatingView ? false : true,
                      showBackIcon: self.options.originatingView ? true : false,
                      selectedTab: status.selectedTab,
                      selectedProperty: self.options.selectedProperty
                    });

                  } else {
                    self.metadataTabView = new MetadataDropdownTabView({
                      context: self.options.context,
                      node: self.options.model,
                      containerCollection: self.options.containerCollection,
                      originatingView: self.options.originatingView,
                      metadataView: self,
                      activeTab: self.options.activeTab,
                      delayTabContent: self.options.delayTabContent
                    });
                  }

                  self.$el.append(self.metadataTabView.render().$el);
                  self.propagateEventsToViews(self.metadataTabView);
                });
          })
          .listenTo(this.metadataHeaderView, "metadata:close", function () {
            self.trigger("metadata:close");
          })
          .listenTo(this.options.context, 'request', function () {
            self._closeMetadata();
          })
          .listenTo(this.options.context, 'request:perspective', function () {
            self._closeMetadata();
          });

      var tabOptions = {
        context: this.options.context,
        node: this.options.model,
        containerCollection: this.options.containerCollection,
        originatingView: this.options.originatingView,
        metadataView: this,
        blockingParentView: this,
        activeTab: this.options.activeTab,
        selectedTab: this.options.selectedTab,
        selectedProperty: this.options.selectedProperty,
        delayTabContent: self.options.delayTabContent
      };

      if (this.options.showPermissionView) {
        this.options.actionsPromise.always(function(){
          self.metadataTabView = new PermissionsView({
            model: self.options.model,
            originatingView: self.options.originatingView,
            context: self.options.context,
            showCloseIcon: self.options.originatingView ? false : true,
            showBackIcon: self.options.originatingView ? true : false,
            selectedTab: status.selectedTab,
            selectedProperty: self.options.selectedProperty
          });
          self.propagateEventsToViews(self.metadataTabView, self.metadataHeaderView);
        });
      } else {
        this.metadataTabView = new MetadataDropdownTabView(tabOptions);
        this.propagateEventsToViews(this.metadataTabView, this.metadataHeaderView);
      }
    },

    onRender: function () {
      var fetching = this.options.model.fetching;
      if (fetching) {
        return fetching.always(_.bind(this.render, this));
      }

      var mhv = this.metadataHeaderView.render();
      var mdv = this.metadataTabView.render();

      Marionette.triggerMethodOn(mhv, 'before:show', mhv, this);
      Marionette.triggerMethodOn(mdv, 'before:show', mdv, this);

      this.$el.append(mhv.el);
      this.$el.append(mdv.el);

      Marionette.triggerMethodOn(mhv, 'show', mhv, this);
      Marionette.triggerMethodOn(mdv, 'show', mdv, this);
    },

    onBeforeDestroy: function () {
      this.cancelEventsToViewsPropagation(this.metadataTabView, this.metadataHeaderView);
      this.metadataHeaderView.destroy();
      this.metadataTabView.destroy();
    },

    _saveItemName: function (args) {
      var self = this;
      var itemName = args.sender.getValue();
      var data = {'name': itemName};
      var metadataController = new MetadataController();
      var node = this.options.model;
      var collection = this.options.collection;
      var shortcutOriginal;
      if (this.options.shortcutNode && this.options.shortcutNode.original === node) {
        var originalNodeInCollection = this.options.collection.findWhere(
            {id: node.get('id')});
        if (originalNodeInCollection) {
          shortcutOriginal = node;
          node = originalNodeInCollection;
        } else {
          collection = undefined;
        }
      }

      self._blockActions();
      metadataController.save(node, data)
          .done(function () {
            return node.fetch()
                .then(function () {
                  if (shortcutOriginal) {
                    shortcutOriginal.set(node.attributes);
                  }
                  args.success && args.success();
                  self._unblockActions();
                  if (self.options.originatingView &&
                      _.isFunction(self.options.originatingView.unblockActions)) {
                    self.options.originatingView.unblockActions();
                  }
                });
          })
          .fail(function (error) {
            self._unblockActions();
            var errorMsg = CommandHelper._getErrorMessageFromResponse(error);
            errorMsg === undefined && (errorMsg = lang.failedToSaveName);
            args.error && args.error(errorMsg);
          });
    },

    _ensureCompleteVersionNode: function () {
      this._blockActions();
      return this.options.model.fetch()
          .always(_.bind(this._unblockActions, this))
          .fail(function (request) {
            var error = new base.Error(request);
            ModalAlert.showError(error.message);
          });
    },

    _ensureCompleteNode: function () {
      var node = this.options.model;

      function checkExpansion(property) {
        var value = node.get(property + '_id');
        if (value && !_.isObject(value) && !_.isObject(node.get(property + '_id_expand'))) {
          node.setExpand('properties', property);
          return true;
        }
      }

      var expandable = _.invoke(['original', 'parent', 'create_user',
        'modify_user', 'owner_user', 'reserved_user'], checkExpansion);
      expandable = _.contains(expandable, true);

      var actionsNeeded = node.actions.length <= 1;

      if (expandable || actionsNeeded) {
        this._blockActions();
        return node.fetch()
            .always(_.bind(this._unblockActions, this))
            .fail(_.bind(function (request) {
              var error = new base.Error(request);
              ModalAlert.showError(error.message);
            }, this));
      }
      return $.Deferred().resolve().promise();
    },

    _closeMetadata: function () {
      var node = this.options.model;
      if (node.get('type') === 1 && node.original && node.original.get('type') === 0) {
        this.trigger("metadata:close");
      } else {
        this.trigger('metadata:close:without:animation');
      }
    },

    _blockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.blockActions && origView.blockActions();
    },

    _unblockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.unblockActions && origView.unblockActions();
    }

  });

  _.extend(MetadataView.prototype, ViewEventsPropagationMixin);

  return MetadataView;

});
