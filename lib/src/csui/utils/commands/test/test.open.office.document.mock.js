/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'json!./test.open.office.document.mock.data.json',
  'csui/lib/jquery.parse.param'
], function (_, mockjax, mockData, parseParam) {
  'use strict';

  return {

    enable: function (apiUrlBase) {

      mockjax({
        name: 'utils/commands/test/tet.open.office.document.mock.nodes',
        url: new RegExp('^' + apiUrlBase + '/api/v1/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'],
        type: 'GET',
        response: function (settings, done) {
          this.responseText = mockData.nodes;
          done();
        }
      });
      mockjax({
        name: 'controls/table/inlineforms/test/inlineform.mock.nodeActions',
        url: new RegExp('^' + apiUrlBase + '/api/v2/nodes/([^/]+)/?actions'),
        urlParams: ['nodeId', 'query'],
        type: 'GET',
        response: function (settings, done) {
          this.responseText = mockData.actions205659;
          done();
        }
      });

      mockjax({
        name: 'controls/table/inlineforms/test/inlineform.mock.contentauth',
        url: new RegExp('^' + apiUrlBase + '/api/v1/contentauth(?:\\?(.*))?$'),
        urlParams: ['query'],
        type: 'GET',
        response: function (settings, done) {
          this.responseText = mockData.contentAuth205659;
          done();
        }
      });

    },

    disable: function () {
      mockjax.clear();
    }

  };

});
