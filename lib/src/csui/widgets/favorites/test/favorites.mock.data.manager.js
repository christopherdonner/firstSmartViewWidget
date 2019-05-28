/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {



  var DataManager = function DataManager() {},
      test0Mocks = [],
      test1Mocks = [],
      testMockDataMocks = [];

  DataManager.url = '//server/otcs/cs/api/v2/members/favorites*';
  DataManager.urlGroups = '//server/otcs/cs/api/v2/members/favorites/tabs*';

  DataManager.test0 = {

    enable: function () {

      _.extend($.mockjaxSettings, {
      });

      test0Mocks.push(mockjax({
        url: DataManager.urlGroups,
        responseTime: 10,
        responseText: {
          "results": []
        }
      }));
    },

    disable: function () {

      _.extend($.mockjaxSettings, {
      });

      var mock;
      while ((mock = test0Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test1 = {

    enable: function () {
      test1Mocks.push(mockjax({
        url: DataManager.urlGroups,
        responseTime: 10,
        responseText: DataManager._createElements(1, 1, 'Name')
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test1Mocks.pop()) != null) {
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
        "actions": {
          "data": {
            "addcategory": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "\/api\/v2\/nodes\/3314\/categories",
              "method": "POST",
              "name": "Add Category"
            },
            "comment": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "",
              "method": "POST",
              "name": "Comments"
            },
            "copy": {
              "body": "",
              "content_type": "",
              "form_href": "\/api\/v2\/forms\/nodes\/copy?id=3314",
              "href": "\/api\/v2\/nodes",
              "method": "POST",
              "name": "Copy"
            },
            "delete": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "\/api\/v2\/nodes\/3314",
              "method": "DELETE",
              "name": "Delete"
            },
            "move": {
              "body": "",
              "content_type": "",
              "form_href": "\/api\/v2\/forms\/nodes\/move?id=3314",
              "href": "\/api\/v2\/nodes\/3314",
              "method": "PUT",
              "name": "Move"
            },
            "open": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "\/api\/v2\/nodes\/3314\/nodes",
              "method": "GET",
              "name": "Open"
            },
            "properties": {
              "body": "",
              "content_type": "",
              "form_href": "",
              "href": "\/api\/v2\/nodes\/3314",
              "method": "GET",
              "name": "Properties"
            },
            "rename": {
              "body": "",
              "content_type": "",
              "form_href": "\/api\/v2\/forms\/nodes\/rename?id=3314",
              "href": "\/api\/v2\/nodes\/3314",
              "method": "PUT",
              "name": "Rename"
            }
          },
          "map": {"default_action": "open", "more": ["properties"]},
          "order": ["open", "addcategory", "rename", "copy", "move", "delete", "comment"]
        },
        "data": {
          "favorites": {"name": "Pictures", "order": 1, "tab_id": null},
          "properties": {
            "container": true,
            "container_size": 21,
            "create_date": "2016-08-01T12:56:41",
            "create_user_id": 3313,
            "description": "",
            "description_multilingual": {"en_US": ""},
            "favorite": true,
            "id": 3314,
            "mime_type": null,
            "modify_date": "2017-01-16T15:41:28",
            "modify_user_id": 3313,
            "name": "Pictures",
            "name_multilingual": {"en_US": "Pictures"},
            "owner_group_id": 1001,
            "owner_user_id": 3313,
            "parent_id": 2000,
            "parent_id_expand": {
              "container": true,
              "container_size": 9,
              "create_date": "2016-08-01T12:28:05",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {"en_US": ""},
              "favorite": false,
              "id": 2000,
              "mime_type": null,
              "modify_date": "2017-01-17T13:44:50",
              "modify_user_id": 1000,
              "name": "Enterprise",
              "name_multilingual": {"en_US": "Enterprise"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": -1,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "size": 9,
              "size_formatted": "9 Items",
              "type": 141,
              "type_name": "Enterprise Workspace",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "size": 21,
            "size_formatted": "21 Items",
            "type": 0,
            "type_name": "Folder",
            "versions_control_advanced": false,
            "volume_id": -2000
          }
        },
        "metadata": {
          "properties": {
            "container": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "container",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Container",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "container_size": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "container_size",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Container Size",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "create_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "create_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Created",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "create_user_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "create_user_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Created By",
              "persona": "user",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "description": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "description",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multiline": true,
              "multilingual": true,
              "multi_value": false,
              "name": "Description",
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
            "favorite": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "favorite",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Favorite",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "id",
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
            "modify_user_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "modify_user_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Modified By",
              "persona": "user",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
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
              "key_value_pairs": false,
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
            "owner_group_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "owner_group_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Owned By",
              "persona": "group",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "owner_user_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "owner_user_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Owned By",
              "persona": "user",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "parent_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "parent_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Parent ID",
              "persona": "node",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "reserved": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "reserved",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Reserved",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "reserved_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "reserved_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Reserved",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "reserved_user_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "reserved_user_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Reserved By",
              "persona": "member",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "type": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": true,
              "key": "type",
              "key_value_pairs": false,
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
              "key_value_pairs": false,
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
            },
            "versions_control_advanced": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "versions_control_advanced",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Versions Control Advanced",
              "persona": "",
              "read_only": false,
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "valid_values": [],
              "valid_values_name": []
            },
            "volume_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "volume_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "VolumeID",
              "persona": "node",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            }
          }
        },
        "metadata_map": {},
        "metadata_order": {
          "properties": ["id", "type", "type_name", "name", "description", "parent_id",
            "volume_id", "create_date", "create_user_id", "modify_date", "modify_user_id",
            "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id",
            "versions_control_advanced", "container", "container_size", "favorite"]
        }
      });
      this.data.properties.id = id;
      this.data.properties.name = name;
      this.data.favorites.name = name;
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
