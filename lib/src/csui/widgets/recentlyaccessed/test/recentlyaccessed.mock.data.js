/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/accessed?*',
        responseTime: 0,
        responseText: {
          "results": [
            {
              "actions": {
                "open": {}
              },
              "data": {
                "properties": {
                  "id": 31,
                  "name": 'Paternity Leave Policy',

                  "create_date": "2014-07-10T14:12:31",
                  "create_user_id": 1000,
                  "description": "",
                  "description_multilingual": {
                    "en": "",
                    "fr": ""
                  },

                  "mime_type": "application/pdf",
                  "modify_date": "2014-10-15T14:54:06",
                  "modify_user_id": 1000,
                  "name_multilingual": {
                    "en": "Document 001",
                    "fr": "Document 001"
                  },
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "id": 2000,
                    "type": 0,
                    "container": true,
                    "name":"Fact Sheets"
                  },
                  "type": 144,
                  "type_name": "Document"
                }
              },
              "metadata": {
                "properties": {
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
              }
            },
            {
              "actions": {
                "open": {}
              },
              "data": {
                "properties": {
                  "id": 32,
                  "name": 'Classic 5000-7',

                  "create_date": "2014-07-10T14:12:31",
                  "create_user_id": 1000,
                  "description": "",
                  "description_multilingual": {
                    "en": "",
                    "fr": ""
                  },

                  "mime_type": "application/pdf",
                  "modify_date": "2014-10-15T14:54:06",
                  "modify_user_id": 1000,
                  "name_multilingual": {
                    "en": "Document 001",
                    "fr": "Document 001"
                  },
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "id": 2000,
                    "type": 0,
                    "container": true,
                    "name":"Fact Sheets"
                  },
                  "type": 144,
                  "type_name": "Document"
                }
              }
            },
            {
              "actions": {
                "open": {}
              },
              "data": {
                "properties": {
                  "id": 33,
                  "name": 'Sales Bid Sprite',

                  "create_date": "2014-07-10T14:12:31",
                  "create_user_id": 1000,
                  "description": "",
                  "description_multilingual": {
                    "en": "",
                    "fr": ""
                  },

                  "mime_type": "application/pdf",
                  "modify_date": "2014-10-15T14:54:06",
                  "modify_user_id": 1000,
                  "name_multilingual": {
                    "en": "Document 001",
                    "fr": "Document 001"
                  },
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "id": 2000,
                    "type": 0,
                    "container": true,
                    "name":"Fact Sheets"
                  },
                  "type": 144,
                  "type_name": "Document"
                }
              }
            },
            {
              "actions": {
                "open": {}
              },
              "data": {
                "properties": {
                  "id": 34,
                  "name": 'Home Office Leave Policy',

                  "create_date": "2014-07-10T14:12:31",
                  "create_user_id": 1000,
                  "description": "",
                  "description_multilingual": {
                    "en": "",
                    "fr": ""
                  },

                  "mime_type": "application/pdf",
                  "modify_date": "2014-10-15T14:54:06",
                  "modify_user_id": 1000,
                  "name_multilingual": {
                    "en": "Document 001",
                    "fr": "Document 001"
                  },
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "id": 2000,
                    "type": 0,
                    "container": true,
                    "name":"Fact Sheets"
                  },
                  "type": 144,
                  "type_name": "Document"
                }
              }
            },
            {
              "actions": {
                "open": {}
              },
              "data": {
                "properties": {
                  "id": 35,
                  "name": 'Classic 6000-8',

                  "create_date": "2014-07-10T14:12:31",
                  "create_user_id": 1000,
                  "description": "",
                  "description_multilingual": {
                    "en": "",
                    "fr": ""
                  },

                  "mime_type": "application/pdf",
                  "modify_date": "2014-10-15T14:54:06",
                  "modify_user_id": 1000,
                  "name_multilingual": {
                    "en": "Document 001",
                    "fr": "Document 001"
                  },
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "id": 2000,
                    "type": 0,
                    "container": true,
                    "name":"Fact Sheets"
                  },
                  "type": 144,
                  "type_name": "Document"
                }
              }
            },
            {
              "actions": {
                "open": {}
              },
              "data": {
                "properties": {
                  "id": 36,
                  "name": 'Test Results Overview',

                  "create_date": "2014-07-10T14:12:31",
                  "create_user_id": 1000,
                  "description": "",
                  "description_multilingual": {
                    "en": "",
                    "fr": ""
                  },

                  "mime_type": "application/pdf",
                  "modify_date": "2014-10-15T14:54:06",
                  "modify_user_id": 1000,
                  "name_multilingual": {
                    "en": "Document 001",
                    "fr": "Document 001"
                  },
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "id": 2000,
                    "type": 0,
                    "container": true,
                    "name":"Fact Sheets"
                  },
                  "type": 144,
                  "type_name": "Document"
                }
              }
            },
            {
              "actions": {
                "open": {}
              },
              "data": {
                "properties": {
                  "id": 37,
                  "name": 'Ultimate documentation on a top secret file that has a long title',

                  "create_date": "2014-07-10T14:12:31",
                  "create_user_id": 1000,
                  "description": "",
                  "description_multilingual": {
                    "en": "",
                    "fr": ""
                  },

                  "mime_type": "application/pdf",
                  "modify_date": "2014-10-15T14:54:06",
                  "modify_user_id": 1000,
                  "name_multilingual": {
                    "en": "Document 001",
                    "fr": "Document 001"
                  },
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "id": 2000,
                    "type": 0,
                    "container": true,
                    "name":"Fact Sheets"
                  },
                  "type": 144,
                  "type_name": "Document"
                }
              }
            }

          ],
          "filtering": [
            {
              "key": "where_type",
              "value": 144
            },
            {
              "key": "where_name",
              "value": "doc"
            }
          ],
          "paging": {
            "limit": 25,
            "page": 1
          },
          "sorting": [
            {
              "value": "asc_name"
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
