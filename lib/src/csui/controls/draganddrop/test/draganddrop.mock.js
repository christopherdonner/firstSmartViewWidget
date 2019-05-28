/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/jquery.mockjax', 'json!./result2000.json'], function ($, mockjax, result2000) {

  window.csui.require.config({
    config: {
      'csui/controls/draganddrop/draganddrop.view': {
        detectLeaveDelay: 0
      }
    }
  });

  var DataManager = function DataManager() {
    },

    mocks = [];

  DataManager.enable = function () {

    mocks.push(mockjax({
      url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions(.*)$'),
      responseTime: 50,
      responseText: DataManager.nodesActions(20)
    }));

    mocks.push(mockjax({
      url: new RegExp('^//server/otcs/cs/api/v2/nodes/2000(?:\\?(.*))?$'),
      responseTime: 0,
      response: function () {
        this.responseText = result2000;
      }
    }));

    mocks.push(mockjax({
      url: new RegExp('^//server/otcs/cs/api/v1/nodes/2000/nodes(.*)$'),
      responseTime: 50,
      responseText: DataManager.nodesData(20, 2000)
    }));

    mocks.push(mockjax({
      url: new RegExp('^//server/otcs/cs/api/v1/nodes/2000/ancestors'),
      responseTime: 50,
      responseText: DataManager.ancestors(2000)
    }));
    mocks.push(mockjax({
      url: new RegExp('^//server/otcs/cs/api/v1/nodes'),
      responseTime: 50,
      responseText: {'id': 1}
    }));

  };


  DataManager.disable = function () {
    var mock;
    while ((mock = mocks.pop()) != null) {
      mockjax.clear(mock);
    }
  };



DataManager.nodeData = function (id, size, parentId) {
 var responseText = {data:{}};
  responseText.data.id = id;
  responseText.data.container_size = size;
  responseText.data.parent_id = parentId;
  return responseText;
};

DataManager.memberData = function (numNonBrowse, numBrowse) {
  var responseText = {
    "links": {
      "self": {
        "body": "",
        "content_type": "",
        "href": "\/api\/v2\/members\/favorites?metadata&fields=properties&fields=versions.element(0)",
        "method": "GET",
        "name": ""
      }
    }, 'results': []
  };

  for (var i = 0; i < numBrowse; i++) {
    var resultWithBrowse = {
      "actions": {
        "audit-list": {
          "body": "",
          "content_type": "",
          "form_href": "",
          "href": "\/api\/v1\/nodes\/2241\/audit?limit=1000",
          "method": "GET",
          "name": "Audit"
        },
        browse: {
          body: "",
          content_type: "",
          form_href: "",
          href: "/api/v1/nodes/2241/nodes",
          method: "GET",
          name: "Browse"
        },
        "copy": {
          "body": "",
          "content_type": "",
          "form_href": "\/api\/v1\/forms\/nodes\/copy?id=2241",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Copy"
        },
        "create_0": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=0",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Folder"
        },
        "create_1": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=1",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Shortcut"
        },
        "create_136": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=136",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Compound Document"
        },
        "create_140": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=140",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "URL"
        },
        "create_144": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=144",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Document"
        },
        "delete": {
          "body": "",
          "content_type": "",
          "form_href": "",
          "href": "\/api\/v1\/nodes\/2241",
          "method": "DELETE",
          "name": "Delete"
        },
        "more": {"body": "", "content_type": "", "form_href": "", "href": "", "method": "", "name": "..."},
        "move": {
          "body": "",
          "content_type": "",
          "form_href": "\/api\/v1\/forms\/nodes\/move?id=2241",
          "href": "\/api\/v1\/nodes\/2241",
          "method": "PUT",
          "name": "Move"
        },
        "properties": {
          "body": "",
          "content_type": "",
          "form_href": "",
          "href": "\/api\/v1\/nodes\/2241",
          "method": "GET",
          "name": "Properties"
        }
      },
      "actions_map": {
        "create": ["create_0", "create_144", "create_136", "create_1", "create_140"],
        "default_action": "browse",
        "more": ["properties", "audit-list"]
      },
      "actions_order": ["browse", "copy", "move", "delete", "more"],
      "data": {
        "properties": {
          "container": true,
          "container_size": 6,
          "create_date": "2003-10-01T13:49:06",
          "create_user_id": 1000,
          "description": "",
          "description_multilingual": {"en": "", "ja": ""},
          "favorite": true,
          "guid": null,
          "icon": "\/alphasupport\/webdoc\/folder.gif",
          "icon_large": "\/alphasupport\/webdoc\/folder_large.gif",
          "id": 2241,
          "modify_date": "2015-05-26T15:22:03",
          "modify_user_id": 1000,
          "name": "Filter Documents and",
          "name_multilingual": {"en": "Filter Documents and", "ja": ""},
          "owner_group_id": 1001,
          "owner_user_id": 1000,
          "parent_id": 2000,
          "reserved": false,
          "reserved_date": null,
          "reserved_user_id": 0,
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
          "create_date": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "include_time": true,
            "key": "create_date",
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
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Created By",
            "persona": "user",
            "read_only": false,
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
          "favorite": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "favorite",
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
          "guid": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "guid",
            "multi_value": false,
            "name": "GUID",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": -95,
            "type_name": "GUID",
            "valid_values": [],
            "valid_values_name": []
          },
          "icon": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "icon",
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Icon",
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
          "icon_large": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "icon_large",
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Large Icon",
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
          "modify_user_id": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "modify_user_id",
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
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Owned By",
            "persona": "user",
            "read_only": false,
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
            "multi_value": false,
            "name": "Reserved",
            "persona": "",
            "read_only": false,
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
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Reserved By",
            "persona": "member",
            "read_only": false,
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
          },
          "versions_control_advanced": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "versions_control_advanced",
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
      "metadata_map": {"properties": {}},
      "metadata_order": {"properties": ["id", "type", "type_name", "name", "description", "parent_id", "volume_id", "guid", "create_date", "create_user_id", "modify_date", "modify_user_id", "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id", "icon", "icon_large", "versions_control_advanced", "container", "container_size", "favorite"]}
    };
    if (i === 1) {
      resultWithBrowse.data.properties.id = 5204;
    }
    responseText.results.push(resultWithBrowse);
  }

  for (i = 0; i < numNonBrowse; i++) {
    var resultWithoutBrowse = {
      "actions": {
        "audit-list": {
          "body": "",
          "content_type": "",
          "form_href": "",
          "href": "\/api\/v1\/nodes\/2241\/audit?limit=1000",
          "method": "GET",
          "name": "Audit"
        },
        "copy": {
          "body": "",
          "content_type": "",
          "form_href": "\/api\/v1\/forms\/nodes\/copy?id=2241",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Copy"
        },
        "create_0": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=0",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Folder"
        },
        "create_1": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=1",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Shortcut"
        },
        "create_136": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=136",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Compound Document"
        },
        "create_140": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=140",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "URL"
        },
        "create_144": {
          "body": "",
          "content_type": "application\/x-www-form-urlencoded",
          "form_href": "\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=144",
          "href": "\/api\/v1\/nodes",
          "method": "POST",
          "name": "Document"
        },
        "delete": {
          "body": "",
          "content_type": "",
          "form_href": "",
          "href": "\/api\/v1\/nodes\/2241",
          "method": "DELETE",
          "name": "Delete"
        },
        "more": {"body": "", "content_type": "", "form_href": "", "href": "", "method": "", "name": "..."},
        "move": {
          "body": "",
          "content_type": "",
          "form_href": "\/api\/v1\/forms\/nodes\/move?id=2241",
          "href": "\/api\/v1\/nodes\/2241",
          "method": "PUT",
          "name": "Move"
        },
        "properties": {
          "body": "",
          "content_type": "",
          "form_href": "",
          "href": "\/api\/v1\/nodes\/2241",
          "method": "GET",
          "name": "Properties"
        }
      },
      "actions_map": {
        "create": ["create_0", "create_144", "create_136", "create_1", "create_140"],
        "default_action": "browse",
        "more": ["properties", "audit-list"]
      },
      "actions_order": ["browse", "copy", "move", "delete", "more"],
      "data": {
        "properties": {
          "container": true,
          "container_size": 6,
          "create_date": "2003-10-01T13:49:06",
          "create_user_id": 1000,
          "description": "",
          "description_multilingual": {"en": "", "ja": ""},
          "favorite": true,
          "guid": null,
          "icon": "\/alphasupport\/webdoc\/folder.gif",
          "icon_large": "\/alphasupport\/webdoc\/folder_large.gif",
          "id": 2241,
          "modify_date": "2015-05-26T15:22:03",
          "modify_user_id": 1000,
          "name": "Filter Documents and",
          "name_multilingual": {"en": "Filter Documents and", "ja": ""},
          "owner_group_id": 1001,
          "owner_user_id": 1000,
          "parent_id": 2000,
          "reserved": false,
          "reserved_date": null,
          "reserved_user_id": 0,
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
          "create_date": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "include_time": true,
            "key": "create_date",
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
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Created By",
            "persona": "user",
            "read_only": false,
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
          "favorite": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "favorite",
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
          "guid": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "guid",
            "multi_value": false,
            "name": "GUID",
            "persona": "",
            "read_only": false,
            "required": false,
            "type": -95,
            "type_name": "GUID",
            "valid_values": [],
            "valid_values_name": []
          },
          "icon": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "icon",
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Icon",
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
          "icon_large": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "icon_large",
            "max_length": null,
            "min_length": null,
            "multiline": false,
            "multilingual": false,
            "multi_value": false,
            "name": "Large Icon",
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
          "modify_user_id": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "modify_user_id",
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
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Owned By",
            "persona": "user",
            "read_only": false,
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
            "multi_value": false,
            "name": "Reserved",
            "persona": "",
            "read_only": false,
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
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Reserved By",
            "persona": "member",
            "read_only": false,
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
          },
          "versions_control_advanced": {
            "allow_undefined": false,
            "bulk_shared": false,
            "default_value": null,
            "description": null,
            "hidden": false,
            "key": "versions_control_advanced",
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
      "metadata_map": {"properties": {}},
      "metadata_order": {"properties": ["id", "type", "type_name", "name", "description", "parent_id", "volume_id", "guid", "create_date", "create_user_id", "modify_date", "modify_user_id", "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id", "icon", "icon_large", "versions_control_advanced", "container", "container_size", "favorite"]}
    };
    resultWithoutBrowse.data.properties.id = 2000;
    responseText.results.push(resultWithoutBrowse);
  }

  return responseText;
};

DataManager.nodesActions = function (numItems) {
  var response = {};
  for (var i = 1; i <= numItems; ++i) {
    response[i] = {
      data: {
        properties: {},
        open: {}
      }
    };
  }
  return response;
};

DataManager.nodesData = function (numItems, id) {
  var responseText = {
    "data": [],
    "definitions": {
      "create_date": {
        "align": "center",
        "name": "Created",
        "persona": "",
        "type": -7,
        "width_weight": 0
      },
      "description": {"align": "left", "name": "Description", "persona": "", "type": -1, "width_weight": 100},
      "icon": {"align": "center", "name": "Icon", "persona": "", "type": -1, "width_weight": 0},
      "id": {"align": "left", "name": "ID", "persona": "node", "type": 2, "width_weight": 0},
      "mime_type": {"align": "left", "name": "MIME Type", "persona": "", "type": -1, "width_weight": 0},
      "modify_date": {
        "align": "left",
        "name": "Modified",
        "persona": "",
        "sort": true,
        "type": -7,
        "width_weight": 0
      },
      "name": {"align": "left", "name": "Name", "persona": "", "sort": true, "type": -1, "width_weight": 100},
      "original_id": {"align": "left", "name": "Original ID", "persona": "node", "type": 2, "width_weight": 0},
      "parent_id": {"align": "left", "name": "Parent ID", "persona": "node", "type": 2, "width_weight": 0},
      "reserved": {"align": "center", "name": "Reserve", "persona": "", "type": 5, "width_weight": 0},
      "reserved_date": {"align": "center", "name": "Reserved", "persona": "", "type": -7, "width_weight": 0},
      "reserved_user_id": {
        "align": "center",
        "name": "Reserved By",
        "persona": "member",
        "type": 2,
        "width_weight": 0
      },
      "size": {
        "align": "right",
        "name": "Size",
        "persona": "",
        "sort": true,
        "sort_key": "size",
        "type": 2,
        "width_weight": 0
      },
      "size_formatted": {
        "align": "right",
        "name": "Size",
        "persona": "",
        "sort": true,
        "sort_key": "size",
        "type": 2,
        "width_weight": 0
      },
      "type": {"align": "center", "name": "Type", "persona": "", "sort": true, "type": 2, "width_weight": 0},
      "volume_id": {"align": "left", "name": "VolumeID", "persona": "node", "type": 2, "width_weight": 0}
    },
    "definitions_map": {"name": ["menu"]},
    "definitions_order": ["type", "name", "size_formatted", "modify_date"],
    "limit": 100,
    "page": 1,
    "page_total": 12,
    "range_max": 100,
    "range_min": 1,
    "sort": "asc_name",
    "total_count": 1200,
    "where_facet": [],
    "where_name": "",
    "where_type": []
  };

  var actionsWithBrowse = [{
      name: "Open",
      signature: "Browse",
      url: "/otcs/cs?func=ll&objId=156435&objAction=browse"
    }],
    actionsWithoutBrowser = [];

  for (var i = 1; i <= numItems; i++) {
    var data = {
      "volume_id": -2000,
      "id": 5204,
      "parent_id": id,
      "name": "Commitment Document HTML5viewer - Copy - Copy - Copy.docx",
      "type": 144,
      "description": "",
      "create_date": "2015-03-17T08:55:42",
      "modify_date": "2015-03-17T08:55:42",
      "reserved": false,
      "reserved_user_id": 0,
      "reserved_date": null,
      "icon": "\/img_0317\/webdoc\/appword.gif",
      "mime_type": "application\/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "original_id": 0,
      "wnd_owner": 1000,
      "wnd_createdby": 1000,
      "wnd_createdate": "2015-03-17T08:55:42",
      "wnd_modifiedby": 1000,
      "wnd_version": 1,
      "wnf_readydate": null,
      "type_name": "Document",
      "container": false,
      "size": 170333,
      "perm_see": true,
      "perm_see_contents": true,
      "perm_modify": true,
      "perm_modify_attributes": true,
      "perm_modify_permissions": true,
      "perm_create": true,
      "perm_delete": true,
      "perm_delete_versions": true,
      "perm_reserve": true,
      "cell_metadata": {
        "data": {
          "menu": "api\/v1\/nodes\/5204\/actions",
          "name": "api\/v1\/nodes\/5204\/content?action=open",
          "type": ""
        },
        "definitions": {
          "menu": {
            "body": "",
            "content_type": "",
            "display_hint": "menu",
            "display_href": "",
            "handler": "menu",
            "image": "",
            "method": "GET",
            "name": "",
            "parameters": {},
            "tab_href": ""
          },
          "name": {
            "body": "",
            "content_type": "",
            "display_hint": "link",
            "display_href": "",
            "handler": "file",
            "image": "",
            "method": "GET",
            "name": "Commitment Document HTML5viewer - Copy - Copy - Copy.docx",
            "parameters": {"mime_type": "application\/vnd.openxmlformats-officedocument.wordprocessingml.document"},
            "tab_href": ""
          },
          "type": {
            "body": "",
            "content_type": "",
            "display_hint": "icon",
            "display_href": "",
            "handler": "",
            "image": "\/img_0317\/webdoc\/doc.gif",
            "method": "",
            "name": "Document",
            "parameters": {},
            "tab_href": ""
          }
        }
      },
      "menu": null,
      "size_formatted": "167 KB",
      "reserved_user_login": null,
      "action_url": "\/v1\/actions\/5204",
      "parent_id_url": "\/v1\/nodes\/2442"
    };
    data.id = i;
    data.parent_id_url = "\/v1\/nodes\/" + id;
    data.type = 0;
    data.mime_type = null;

    if ((i % 2) !== 0) {
      data.type_name = "Folder";
      data.icon = "\/alphasupport\/webdoc\/folder.gif",
        data.actions = actionsWithBrowse;
      data.container = true;
    }
    else {
      data.type_name = "Category";
      data.icon = "/suspport__0622/webattribute/16category.gif",
        data.type = 131;
      data.actions = actionsWithoutBrowser;
    }
    responseText.data.push(data);
  }

  return responseText;
};

DataManager.ancestors = function (numAncestors, id) {
  var responseText = {
    "ancestors": [
      {
        id: 5,
        name: "Folder5",
        parent_id: -1,
        type: 0,
        type_name: "Folder",
        volume_id: -2000
      },
      {
        id: 1,
        name: "Folder1",
        parent_id: 5,
        type: 0,
        type_name: "Folder",
        volume_id: -2000
      },
      {
        id: 3,
        name: "Folder1",
        parent_id: 1,
        type: 0,
        type_name: "Folder",
        volume_id: -2000
      },
      {
        id: 7,
        name: "Folder1",
        parent_id: 3,
        type: 0,
        type_name: "Folder",
        volume_id: -2000
      }
    ]
  };


  return responseText;

};

DataManager.mockFiles = function (numFiles) {
  var files = [];

  for (var i = 0; i < numFiles; i++) {
    var name = "new file " + i;
    files.push({name: name});
  }
  return {currentEvent: {originalEvent: {target: {files: files}}}};
};


return DataManager;
});
