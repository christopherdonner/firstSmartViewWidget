/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.parse.param',
  'csui/lib/jquery.mockjax'
], function (_, $, parseParam, mockjax) {

  var DataManager       = function DataManager() {},
      test0Mocks        = [],
      test1Mocks        = [],
      test100Mocks      = [],
      testMockDataMocks = [];

  DataManager.url = '//server/otcs/cs/api/v2/members/accessed*';

  DataManager.test0 = {

    enable: function () {
      test0Mocks.push(mockjax({
        url: DataManager.url,
        responseTime: 10,
        responseText: {
          "results": []
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test0Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test1 = {

    enable: function () {
      test1Mocks.push(mockjax({
        url: DataManager.url,
        responseTime: 10,
        responseText: DataManager._createElements(1, 1, 'Name')
      }));
      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions\\?ids=1(?:&(.*))?$'),
        responseTime: 10,
        responseText: {
          "results": {
            '1': {
              data: {
                'delete': {}
              },
              map: {},
              order: {}
            }
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test1Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test100 = {

    enable: function () {
      test100Mocks.push(mockjax({
        url: DataManager.url,
        responseTime: 10,
        responseText: DataManager._createElements(21, 120, 'Name')
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test100Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.mockData = {

    enable: function (idFrom, idTo, name) {
      testMockDataMocks.push(mockjax({
        url: DataManager.url,
        responseTime: 10,
        responseText: DataManager._createElements(idFrom, idTo, name)
      }));
      testMockDataMocks.push(mockjax({
        url: new RegExp('^^//server/otcs/cs/api/v2/nodes/actions(?:\\?(.*))?$'),
        urlParams: ['query'], // ids, actions
        response: function (settings) {
          var parameters = parseParam(settings.urlParams.query);
          this.responseText = {
            results: _.reduce(parameters.ids, function (results, id) {
              results[id] = {
                data: {
                  'delete': {}
                },
                map: {},
                order: {}
              };
              return results;
            }, {})
          };
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = testMockDataMocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager._createElements = function (idFrom, idTo, name) {

    var Element = function Element(id, name) {
      _.extend(this, {
        "data": {
          "properties": {
            "create_date": "2014-07-10T14:12:31",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {
              "en": "",
              "fr": ""
            },

            "modify_date": "2014-10-15T14:54:06",
            "modify_user_id": 1000,
            "name_multilingual": {
              "en": "Document 001",
              "fr": "Document 001"
            },
            "parent_id": -1,
            "type": 144,
            "type_name": "Document"

          }
        },
        "metadata": {
          "properties": {
            "id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "ID",
              "persona": "node",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "modify_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "modify_date",
              "multi_value": false,
              "name": "Modified",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "name",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": true,
              "multi_value": false,
              "name": "Name",
              "password": false,
              "persona": "",
              "read_only": false,
              "regex": "",
              "required": false,
              "type": -1,
              "type_name": "String",
              "valid_values": [],
              "valid_values_name": []
            },
            "type": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "type",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Type",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "type_name": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "type_name",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": false,
              "multi_value": false,
              "name": "Type",
              "password": false,
              "persona": "",
              "read_only": true,
              "regex": "",
              "required": false,
              "type": -1,
              "type_name": "String",
              "valid_values": [],
              "valid_values_name": []
            }
          }
        }

      });
      this.data.properties.id = id;
      this.data.properties.name = name;
    };

    var response = {
      "results": []
    };

    for (var i = idFrom; i <= idTo; i++) {
      response.results.push(new Element(i, name + i));
    }

    return response;
  };

  return DataManager;

});
