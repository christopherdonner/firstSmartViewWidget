/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/next.node', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.model', 'csui/utils/contexts/factories/browsing.states',
  'csui/utils/contexts/factories/application.scope.factory',
  'i18n!csui/pages/start/nls/lang', 'i18n!csui/pages/start/impl/nls/lang'
], function (_, PerspectiveRouter, NextNodeModelFactory, NodeModelFactory, NodeModel,
    BrowsingStateCollectionFactory, ApplicationScopeModelFactory, publicLang, lang) {
  'use strict';

  var NodePerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      'nodes/:id': 'openNodePerspective',
      'nodes/:id/versions/:ver': 'openNodeVersionPerspective'
    },

    constructor: function NodePerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);

      this.nextNode = this.context.getModel(NextNodeModelFactory);
      this.listenTo(this.nextNode, 'change:id', this._updateNodeUrl);
      this.listenTo(this.nextNode, 'change:name', this._updatePageTitle);

      this.browsingStates = this.context.getCollection(BrowsingStateCollectionFactory);
      this.listenTo(this.browsingStates, 'state:change', this._browsingStateUpdateUrl);
      this.listenTo(this.browsingStates, 'update:title', this._browsingStateUpdateTitle);
    },

    openNodePerspective: function (id, query) {
      var nodeId = id;
      if (NodeModel.usesIntegerId) {
        nodeId = parseInt(nodeId);
      }
      this._resetBrowsingData({node_id: nodeId}, query || '');
      this._openNodePerspective(nodeId);
    },

    openNodeVersionPerspective: function (id, version, query) {
      var nodeId = id;
      var versionNum = version;
      if (NodeModel.usesIntegerId) {
        nodeId = parseInt(nodeId);
        versionNum = parseInt(versionNum);
      }
      this._resetBrowsingData({node_id: nodeId, version_num: versionNum}, query || '');
      this._openNodePerspective(nodeId);
    },

    _openNodePerspective: function (id) {
      if (this.nextNode.get('id') === id) {
        this.nextNode.unset('id', {silent: true});
      }
      this.nextNode.set('id', id);
    },

    onOtherRoute: function () {
      this.nextNode.clear({silent: true});
      this._resetBrowsingData();
      this.url = undefined;
    },

    _resetBrowsingData: function (path, query) {
      this.browsingStates.resetAll({silent: true});
      this.url = {path: path, query: query};
    },

    _setBrowsingStates: function () {
      var nodeId = this.nextNode.get('id');
      this.url = this.url || {};
      this.url.path = this.url.path || {};
      this.url.path.node_id = nodeId;
      this.url.path.node_name = this._getNodeName();

      this.browsingStates.setBrowsingStates(this.url.path, this.url.query);
      this.url = undefined;
    },

    _updateNodeUrl: function () {
      var url = 'nodes/' + this.nextNode.get('id');
      if (this.url === undefined) {
        var urlUpdateMode = this.browsingStates.allowUrlUpdate;
        this.browsingStates.resetAll({silent: true});
        this._setBrowsingStates();
        if (urlUpdateMode) {
          url = this.browsingStates.getUrlPathWithQuery();
          this.navigate(url, {urlIncludedQuery: true});
        } else {
          this.navigate(url);
        }
      } else {
        this._setBrowsingStates();
        url = this.browsingStates.getUrlPathWithQuery();
        this.navigate(url, {urlIncludedQuery: true});
      }

      this._updatePageTitle();
    },

    _browsingStateUpdateUrl: function () {
      if (this.applicationScope.get('id') !== 'node' || !this.browsingStates.allowUrlUpdate) {
        return;
      }

      var url = '';
      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var path = browsingState && browsingState.get('path');
      var nodeId = (path && path.node_id) || this.nextNode.get('id');
      if (nodeId !== undefined) {
        var currentNode = this.context.getObject(NodeModelFactory);
        if (currentNode && currentNode.get('id') !== nodeId) {
          currentNode.clear({silent: true});
          currentNode.fetched = false;
          currentNode.set('id', nodeId, {silent: true});
          this.context.trigger('current:folder:changed');
        }
        url = this.browsingStates.getUrlPathWithQuery();
      }
      this.navigate(url, {urlIncludedQuery: true});

      if (nodeId !== undefined) {
        this._updatePageTitle((path && path.node_name) || undefined);
      } else {
        this._updatePageTitle(publicLang.UserTitle);
      }
    },

    _browsingStateUpdateTitle: function () {
      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var path = browsingState && browsingState.get('path');
      (path && path.node_name) && this._updatePageTitle(path.node_name);
    },

    _updatePageTitle: function (title) {
      if (title && title.length > 0) {
        document.title = _.str.sformat(publicLang.NodeTitle, title);
        return;
      }
      var nodeName = this._getNodeName();
      document.title = _.str.sformat(publicLang.NodeTitle, nodeName);

      var browsingState = this.browsingStates.at(this.browsingStates.length - 1);
      var path = browsingState && browsingState.get('path');
      path && (path.node_name = nodeName);
    },

    _getNodeName: function () {
      var name = !this.nextNode.has('name') ?
                 _.str.sformat(lang.NodeLoadingTitle, this.nextNode.get('id')) :
                 this.nextNode.get('name');
      return name;
    }
  });

  return NodePerspectiveRouter;
});
