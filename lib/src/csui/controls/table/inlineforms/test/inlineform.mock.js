/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./inlineform.data.json'
], function (_, mockjax, parseParam, mockData) {
  'use strict';
  return {

    enable: function () {

      mockjax({
        name: 'controls/table/inlineforms/test/inlineform.mock.nodes',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'],
        type: 'GET',
        response: function (settings, done) {
          var nodeId = parseInt(settings.urlParams.nodeId, 10);
          this.responseText = mockData.nodes;
          done();
        }
      });
      mockjax({
        name: 'controls/table/inlineforms/test/inlineform.mock.nodeActions',
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/]+)/?actions'),
        urlParams: ['nodeId', 'query'],
        type: 'GET',
        response: function (settings, done) {
          this.responseText = mockData.actions205659;
          done();
        }
      });

      mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/forms/nodes/create\\?parent_id=(.*)&type=(.*)$'),
        responseTime: 0,
        responseText: mockData.forms

      });
      mockjax({
        name: 'controls/table/inlineforms/test/inlineform.mock.actionsBayIds',
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions(?:\\?(.+))?$'),
        urlParams: ['query'],
        response: function (settings, done) {
          this.responseText = mockData.actionsByIds;
          done();
        }
      });

      mockjax({
        name: 'controls/table/inlineforms/test/inlineform.mock.put',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes'),
        type: 'POST',
        response: function (settings, done) {
          this.responseText = {"id": 1772465};
          done();
        }
      });

      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        type: 'GET',
        response: function (settings, done) {
          this.responseText = {results: []};
          done();
        }
      });

    },

    disable: function () {
      mockjax.clear();
    }

  };

});
