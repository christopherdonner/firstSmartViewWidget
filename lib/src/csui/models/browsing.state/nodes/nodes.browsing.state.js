/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/models/browsing.state/browsing.state'
], function (_, BrowsingStateModel) {
  'use strict';
  var NodeBrowsingStateModel = BrowsingStateModel.extend({

    metadataParams: ['perspective', 'panel', 'container_id'],

    constructor: function NodeBrowsingStateModel(attributes, options) {
      var attrs = _.clone(attributes);
      var state = 'browse';
      if (_.has(attributes.query, 'perspective')) {
        state = (attrs.path && attrs.path.version_num !== undefined) ? 'version' : 'metadata';
      }
      attrs.query = this._trimQuery(attributes.query);

      BrowsingStateModel.prototype.constructor.call(this, attrs, options);
      this.set('id', state, {silent: true});
    },
    setData: function (attributes, options) {
      var query = this._trimQuery(attributes.query);
      this.set({path: attributes.path, query: query}, options);
    },
    getBaseUrlPath: function () {
      var pathStr = '';
      if (this.attributes.path) {
        if (this.attributes.path.node_id !== undefined) {
          pathStr += 'nodes/' + this.attributes.path.node_id;
          if (this.attributes.path.version_num !== undefined) {
            pathStr += '/versions/' + this.attributes.path.version_num;
          }
        }
      }
      return pathStr;
    },
    _trimQuery: function (query) {
      var qr = query;
      if (_.has(query, 'perspective') !== true) {
        qr = _.omit(query, this.metadataParams);
      }
      return qr;
    }

  });

  return NodeBrowsingStateModel;

});
