/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (_, $, mockjax) {

  var DataManager = function DataManager() {},
      test0Mocks = [],
      test1Mocks = [],
      test100Mocks = [],
      testMockDataMocks = [];

  DataManager.url = '//server/otcs/cs/api/v2/members/assignments*';

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
          "assignments": {
            "container": true,
            "container_size": 0,
            "date_due": "2015-04-07T22:00:00",
            "description": "Hello World",
            "description_multilingual": {"en_US": ""},
            "favorite": false,
            "from_user_id": 1000,
            "from_user_id_expand": {
              "business_email": null,
              "business_fax": null,
              "business_phone": null,
              "deleted": false,
              "first_name": null,
              "group_id": 1001,
              "id": 1000,
              "last_name": null,
              "middle_name": null,
              "name": "Admin",
              "office_location": null,
              "privilege_login": true,
              "privilege_modify_groups": true,
              "privilege_modify_users": true,
              "privilege_public_access": true,
              "privilege_system_admin_rights": true,
              "privilege_user_admin_rights": true,
              "time_zone": null,
              "title": null,
              "type": 0,
              "type_name": "User"
            },
            "id": 35664,
            "id_expand": {
              "assigned_member_id": 1000,
              "attachment_id": 0,
              "comments": "This is a comment that can be long .. a text to keep the comment a little longer...",
              "container": true,
              "container_size": 0,
              "create_date": "2015-03-28T22:51:19",
              "create_user_id": 1000,
              "description": "Hello World",
              "description_multilingual": {"en_US": ""},
              "due_date": "2015-04-07T22:00:00",
              "favorite": false,
              "guid": null,
              "icon": "\/imgcs11dailydevws\/task\/16task.gif",
              "icon_large": "\/imgcs11dailydevws\/task\/16task_large.gif",
              "id": 35664,
              "instructions": "Instructions ...",
              "milestone_id": 35663,
              "modify_date": "2015-03-28T22:51:19",
              "modify_user_id": 1000,
              "name": "Task 1",
              "name_multilingual": {"en_US": "Task 1"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": -35657,
              "priority": 50,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "start_date": "2015-03-28T22:50:24",
              "status": 0,
              "type": 206,
              "type_name": "Task",
              "versions_control_advanced": false,
              "volume_id": 35657
            },
            "instructions": "Instructions ...",
            "location_id": 35657,
            "location_id_expand": {
              "container": true,
              "container_size": 0,
              "create_date": "2015-03-28T22:42:09",
              "create_user_id": 1000,
              "description": "Hello World",
              "description_multilingual": {"en_US": ""},
              "favorite": true,
              "guid": null,
              "icon": "\/imgcs11dailydevws\/task\/16tasklist.gif",
              "icon_large": "\/imgcs11dailydevws\/task\/16tasklist_large.gif",
              "id": 35657,
              "modify_date": "2015-03-28T23:04:46",
              "modify_user_id": 1000,
              "name": "Task List 1",
              "name_multilingual": {"en_US": "Task List 1"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": 2000,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 204,
              "type_name": "Task List",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "name": "Task 1",
            "name_multilingual": {"en_US": "Task 1"},
            "priority": 50,
            "priority_name": "Medium",
            "status": 0,
            "status_name": "Pending",
            "type": 206,
            "type_name": "Task"
          }
        },
        "metadata": {
          "assignments": {
            "date_due": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "assignment_date_due",
              "multi_value": false,
              "name": "Due Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "from_user_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "assignment_from_user_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "From",
              "persona": "user",
              "read_only": false,
              "required": false,
              "type": 2,
              "type_name": "Integer",
              "valid_values": [],
              "valid_values_name": []
            },
            "priority": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "assignment_priority",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": true,
              "multi_value": false,
              "name": "Priority",
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
            "status": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "assignment_status",
              "max_length": null,
              "min_length": null,
              "multiline": false,
              "multilingual": true,
              "multi_value": false,
              "name": "Status",
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
            "container": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "container",
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
            "description": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "description",
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
            "location_id": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "location_id",
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Location",
              "persona": "node",
              "read_only": true,
              "required": false,
              "type": 2,
              "type_name": "Integer",
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
      this.data.assignments.id = id;
      this.data.assignments.name = name;
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
