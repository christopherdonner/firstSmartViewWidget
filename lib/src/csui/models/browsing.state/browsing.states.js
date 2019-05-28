/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/models/browsing.state/browsing.state',
  'csui/models/browsing.state/nodes/nodes.browsing.state'
], function (_, Backbone, BrowsingStateModel, NodeBrowsingStateModel) {
  'use strict';
  var BrowsingStateCollection = Backbone.Collection.extend({

    model: BrowsingStateModel,

    constructor: function BrowsingStateCollection(models, options) {
      this.options = options || {};
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    resetAll: function (options) {
      this.updateBrowserTitleAfterPageLoaded = false;
      this.triggerStateChangeOnStateRemoval = false;
      this.allowUrlUpdate = false;
      this.reset(null, options);
    },

    clearMetadataParamsInUrlQuery: function (query) {
      var queryStr = query;
      if (this.allowUrlUpdate && this._routeWithSlashes()) {
        if (queryStr && queryStr.length > 0) {
          var metaParams = ['perspective', 'panel', 'container_id'];
          queryStr.charAt(0) === '?' && (queryStr = queryStr.substring(1));
          var queryObj = _.omit(this._convertQuerystringToObject(queryStr), metaParams);
          queryStr = this._convertQueryObjectToQueryString(queryObj);
        }
      }
      return queryStr;
    },
    setBrowsingStates: function (path, query) {
      if (path && path.node_id !== undefined) {
        this._setNodeBrowsingStates(path, query);
      } else {  // add new browsing state type when needed
        throw new Error("Not yet supported browsing state. Please add a new type.");
      }
    },

    _setNodeBrowsingStates: function (path, query) {
      var currentBrowsingState;
      var addNewState = true;
      if (this.length > 0) {
        var nodeStateIds = ['browse', 'metadata', 'version'];
        currentBrowsingState = this.at(this.length - 1);
        if (_.indexOf(nodeStateIds, currentBrowsingState.get('id')) !== -1) {
          addNewState = false;
        }
      }
      var queryStr = query;
      if (queryStr === undefined && this._routeWithSlashes()) {
        var locationQuery = location.search;  // location.hash will be added on later
        if (locationQuery.length > 0) {
          var prevAllowUrlUpdate = this.allowUrlUpdate;
          this.allowUrlUpdate = true;  // temporary
          queryStr = this.clearMetadataParamsInUrlQuery(locationQuery);
          queryStr.charAt(0) === '?' && (queryStr = queryStr.substring(1));
          this.allowUrlUpdate = prevAllowUrlUpdate;  // reset back to previous value
        }
      }

      var queryObj = this._convertQuerystringToObject(queryStr);
      var attributes = {path: path, query: queryObj};
      if (addNewState) {
        if (queryObj.perspective === 'metadata' || queryObj.perspective === 'metadata.navigation') {
          this.push(new NodeBrowsingStateModel(attributes), {silent: true});
          this.allowUrlUpdate = true;
          this.updateBrowserTitleAfterPageLoaded = true;
        } else {
          this.push(new NodeBrowsingStateModel(attributes), {silent: true});
        }
      } else {
        currentBrowsingState.setData(attributes, {silent: true});
      }
    },

    getUrlPathWithQuery: function () {
      var urlPath = '';
      if (this.length > 0) {
        var currentBrowsingState = this.at(this.length - 1);
        if (currentBrowsingState) {
          urlPath = currentBrowsingState.getBaseUrlPath();
          urlPath += this._getCurrentStateAccumulatedQueryParamsString();
        }
      }

      if (this._routeWithSlashes()) {
        return urlPath + location.hash;
      } else {
        return urlPath;
      }
    },

    _getCurrentStateAccumulatedQueryParamsString: function () {
      var i, queryObj = {};
      for (i = this.length - 1; i >= 0; i--) {
        queryObj = _.defaults(queryObj, this.at(i).get('query') || {});
      }
      return this._convertQueryObjectToQueryString(queryObj);
    },
    _convertQueryObjectToQueryString: function (query) {
      var queryStr = '';
      if (query) {
        _.each(query, function (value, key) {
          queryStr += queryStr.length === 0 ? '?' : '&';
          queryStr += key + '=' + value;
        });
      }
      return queryStr;
    },
    _convertQuerystringToObject: function (queryStr) {
      var params = {};
      if (queryStr && _.isString(queryStr)) {
        var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
        while ((match = search.exec(queryStr)) !== null) {
          params[decode(match[1])] = decode(match[2]);
        }
      }
      return params;
    },

    _routeWithSlashes: function () {
      return /\/app(?:\/.*)?$/.test(location.pathname);
    }

  });

  return BrowsingStateCollection;

});
