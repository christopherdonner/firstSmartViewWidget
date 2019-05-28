/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {
  'use strict';
  var mocks = [];
  return {
    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/perspectives/1',
        responseTime: 5,
        type: 'GET',
        responseText: {
          "perspectives": [
            {
              "av_id": 17666942,
              "cascading": false,
              "constant_data": [],
              "container_type": -1,
              "node": 17667275,
              "node_path": "Enterprise Workspace:007 Hyderabad:00000 pk folder:Perspective Playground:LCR",
              "override_id": 2982,
              "override_type": "genericcontainer",
              "perspective": "{\"options\":{\"center\":{\"kind\":\"fullpage\",\"options\":{\"containerId\":\"\",\"pageSize\":30,\"pageSizes\":[30,null]},\"type\":\"csui\\/widgets\\/nodestable\"},\"left\":{\"kind\":\"tile\",\"type\":\"csui\\/widgets\\/myassignments\"},\"right\":{}},\"type\":\"left-center-right\"}",
              "perspective_node_path": "Perspectives:pk-lcr",
              "priority": 2,
              "rule_compatibility": 1,
              "rule_data": [],
              "rule_string": "",
              "scope": "local",
              "title": "pk-lcr"
            }
          ]
        }
      }));
    },
    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };
});
  