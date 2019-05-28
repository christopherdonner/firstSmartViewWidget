/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param',
  'json!./results244861v2nodes.json',
  'json!./results244861v1versions.json'
], function ($, _, mockjax,
    parseParam,
    results244861v2nodes,
    results244861v1versions) {
  'use strict';
  return {

    enable: function () {

      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/244861(?:\\?(.+))?$'),
        responseTime: 0,
        responseText: results244861v2nodes
      });

      mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/244861/versions(?:\\?(.+))?$'),
        responseTime: 0,
        responseText: results244861v1versions
      });

    },

    disable: function () {
      mockjax.clear();
    }

  };

});
