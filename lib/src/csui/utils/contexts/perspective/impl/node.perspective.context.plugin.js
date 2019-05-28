/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/browsing.states',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/node.perspectives',
  'csui/utils/classic.nodes/classic.nodes'
], function (_, Backbone, log, NodeModelFactory,
    NextNodeModelFactory, PreviousNodeModelFactory,
    ApplicationScopeModelFactory, BrowsingStateCollectionFactory,
    PerspectiveContextPlugin, nodePerspectives, classicNodes) {
  'use strict';

  var nodeOptions = {
    fields: {
      properties: [],
      columns: [],
      'versions.element(0)': ['mime_type']
    },
    includeResources: ['metadata', 'perspective']
  };

  var NodePerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function NodePerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory);
      this.nextNodeFactory = this.context.getFactory(NextNodeModelFactory, {
        options: nodeOptions,
        permanent: true,
        detached: true
      });
      this.nextNode = this.nextNodeFactory.property
          .on('change:id', this._fetchNodePerspective, this);
      this.previousNode = this.context
          .getModel(PreviousNodeModelFactory, {
            permanent: true,
            detached: true
          });
      this.browsingStates = this.context
          .getCollection(BrowsingStateCollectionFactory, {
            permanent: true,
            detached: true
          });
      this.node = this.context
          .getModel(NodeModelFactory, {
            options: nodeOptions
          });
    },

    onClear: function () {
      this._clearModels(true);
    },

    onRefresh: function () {
      this._clearModels(false);
    },

    isFetchable: function (factory) {
      return factory.property !== this.node;
    },

    _clearModels: function (recreateNode) {
      this.previousNode.clear({silent: true});
      this.previousNode.set(this.node.attributes);
      if (recreateNode) {
        this.node = this.context
            .getModel(NodeModelFactory, {
              options: nodeOptions
            });
      }
      this.node.clear({silent: true});
      this.node.set(this.nextNode.attributes);
    },

    _fetchNodePerspective: function () {
      Backbone.trigger('closeToggleAction');
      var nextNodeId = this.nextNode.get('id');
      if (nextNodeId == null || nextNodeId <= 0) {
        return;
      }
      this.context.triggerMethod('request:perspective', this);
      this.applicationScope.set('id', 'node');
      this.nextNodeFactory.fetch({
        success: _.bind(this._changePerspective, this, this.nextNode),
        error: _.bind(this.context.rejectPerspective, this.context)
      });
    },

    _changePerspective: function (sourceModel) {
      var classicUrl = classicNodes.getUrl(sourceModel);
      if (classicUrl) {
        window.location.replace(classicUrl);
        return;
      }

      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var query = browsingState && browsingState.get('query');
      var perspectiveUrlOverride = query && query.perspective;
      if (perspectiveUrlOverride) {
        this.context.perspective.clear({silent: true});
        return this.context.overridePerspective(sourceModel,
            'json!csui/utils/contexts/perspective/impl/perspectives/' +
            perspectiveUrlOverride + '.json');
      }

      var perspectiveModule,
          perspective = nodePerspectives.findByNode(sourceModel);
      if (_.isEmpty(sourceModel.get('perspective')) || !sourceModel.get('container') ||
          perspective.get('important')) {
        perspectiveModule = perspective.get('module');
      }
      if (perspectiveModule) {
        return this.context.overridePerspective(sourceModel, perspectiveModule);
      }

      this.context.applyPerspective(sourceModel);
    }

  });

  return NodePerspectiveContextPlugin;

});
