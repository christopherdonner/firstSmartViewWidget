/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var DataManager = function DataManager() {},
      mocks       = [];

  DataManager.test = {

    enable: function () {

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/3333/ancestors',
        responseTime: 0,
        responseText: {
          "ancestors": [
            {
              "volume_id": -2000,
              "id": 2000,
              "parent_id": -1,
              "name": "Enterprise",
              "type": 141,
              "type_name": "Enterprise Workspace"
            },
            {
              "volume_id": -2000,
              "id": 3346,
              "parent_id": 2000,
              "name": "Folder",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "volume_id": -2000,
              "id": 2883,
              "parent_id": 3346,
              "name": "Sub Fold 1",
              "type": 0,
              "type_name": "Folder"
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/3333*',
        responseTime: 0,
        responseText: {
          id: 3333,
          name: "Bag a things"
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2222/ancestors',
        responseTime: 0,
        responseText: {
          "ancestors": [
            {
              "volume_id": -2000,
              "id": 2000,
              "parent_id": -1,
              "name": "Enterprise",
              "type": 141,
              "type_name": "Enterprise Workspace"
            },
            {
              "volume_id": -2000,
              "id": 3346,
              "parent_id": 2000,
              "name": "Folder",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "volume_id": -2000,
              "id": 2883,
              "parent_id": 3346,
              "name": "Sub Folder",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "volume_id": -2000,
              "id": 1232,
              "parent_id": 2883,
              "name": "Current Location",
              "type": 0,
              "type_name": "Folder"
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2222*',
        responseTime: 0,
        responseText: {
          id: 2222,
          name: "Test node"
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1111/ancestors',
        responseTime: 0,
        responseText: {
          "ancestors": [
            {
              "volume_id": -2000,
              "id": 2000,
              "parent_id": -1,
              "name": "Enterprise",
              "type": 141,
              "type_name": "Enterprise Workspace"
            },
            {
              "volume_id": -2000,
              "id": 3346,
              "parent_id": 2000,
              "name": "Folder",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "volume_id": -2000,
              "id": 2883,
              "parent_id": 3346,
              "name": "Sub Fold 1",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "volume_id": -2000,
              "id": 1212,
              "parent_id": 2883,
              "name": "Sub Fold 2",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "volume_id": -2000,
              "id": 4040,
              "parent_id": 1212,
              "name": "Sub Fold 3",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "volume_id": -2000,
              "id": 5050,
              "parent_id": 4040,
              "name": "Sub Fold 4",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "volume_id": -2000,
              "id": 6060,
              "parent_id": 5050,
              "name": "Sub Fold 5",
              "type": 0,
              "type_name": "Folder"
            },
            {
              "volume_id": -2000,
              "id": 7070,
              "parent_id": 6060,
              "name": "Current Location",
              "type": 0,
              "type_name": "Folder"
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/1111*',
        responseTime: 0,
        responseText: {
          id: 1111,
          name: "Kite"
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

  return DataManager;

});
