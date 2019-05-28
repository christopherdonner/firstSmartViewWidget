/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {
  'use strict';
  _.extend($.mockjaxSettings, {
    responseTime: 0,
    headers: {}
  });
  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/volumes/141',
        responseText: {
          "addable_types": [{
            "icon": "\/alphasupport\/webdoc\/folder.gif",
            "type": 0,
            "type_name": "Folder"
          }, {"icon": "\/alphasupport\/tinyali.gif", "type": 1, "type_name": "Shortcut"},
            {"icon": "\/alphasupport\/tinygen.gif", "type": 2, "type_name": "Generation"}, {
              "icon": "\/alphasupport\/webattribute\/16category.gif",
              "type": 131,
              "type_name": "Category"
            }, {
              "icon": "\/alphasupport\/webdoc\/cd.gif",
              "type": 136,
              "type_name": "Compound Document"
            }, {"icon": "\/alphasupport\/webdoc\/url.gif", "type": 140, "type_name": "URL"},
            {"icon": "\/alphasupport\/webdoc\/doc.gif", "type": 144, "type_name": "Document"},
            {"icon": "\/alphasupport\/project\/16project.gif", "type": 202, "type_name": "Project"},
            {"icon": "\/alphasupport\/task\/16tasklist.gif", "type": 204, "type_name": "Task List"},
            {"icon": "\/alphasupport\/channel\/16channel.gif", "type": 207, "type_name": "Channel"},
            {
              "icon": "\/alphasupport\/collections\/collection.gif",
              "type": 298,
              "type_name": "Collection"
            }, {
              "icon": "\/alphasupport\/otemail\/emailcontainer.gif",
              "type": 557,
              "type_name": "Compound Email"
            }, {"icon": "\/alphasupport\/otemail\/email.gif", "type": 749, "type_name": "Email"}, {
              "icon": "\/alphasupport\/otemail\/emailfolder.gif",
              "type": 751,
              "type_name": "Email Folder"
            }, {
              "icon": "\/alphasupport\/webdoc\/virtual_folder.png",
              "type": 899,
              "type_name": "Virtual Folder"
            }, {"icon": "\/alphasupport\/wiki\/wiki.gif", "type": 5573, "type_name": "Wiki"}, {
              "icon": "\/alphasupport\/webreports\/webreports.gif",
              "type": 30303,
              "type_name": "WebReport"
            }, {
              "icon": "\/alphasupport\/activeview\/activeview.gif",
              "type": 30309,
              "type_name": "ActiveView"
            }],
          "available_actions": [{
            "parameterless": false,
            "read_only": true,
            "type": "browse",
            "type_name": "Browse",
            "webnode_signature": null
          }, {
            "parameterless": false,
            "read_only": false,
            "type": "update",
            "type_name": "Update",
            "webnode_signature": null
          }],
          "available_roles": [{"type": "permissions", "type_name": "Permissions"},
            {"type": "audit", "type_name": "Audit"},
            {"type": "categories", "type_name": "Categories"},
            {"type": "nicknames", "type_name": "Nicknames"}],
          "data": {
            "container": true,
            "container_size": 116,
            "create_date": "2003-10-01T13:30:55",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {"de_DE": "", "en": "", "ja": ""},
            "external_create_date": null,
            "external_identity": "",
            "external_identity_type": "",
            "external_modify_date": null,
            "external_source": "",
            "favorite": false,
            "guid": null,
            "icon": "\/alphasupport\/webdoc\/icon_library.gif",
            "icon_large": "\/alphasupport\/webdoc\/icon_library_large.gif",
            "id": 2000,
            "modify_date": "2017-12-03T21:17:32",
            "modify_user_id": 1000,
            "name": "Enterprise Workspace",
            "name_multilingual": {
              "de_DE": "Enterprise Workspace",
              "en": "Enterprise Workspace",
              "ja": ""
            },
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 141,
            "type_name": "Enterprise Workspace",
            "versions_control_advanced": false,
            "volume_id": -2000
          },
          "definitions": {
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": true,
              "multilingual": true,
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
            "external_create_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_create_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Create Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_identity": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity",
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
            "external_identity_type": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity_type",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity Type",
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
            "external_modify_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_modify_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Modify Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_source": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_source",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Source",
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
            "guid": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "guid",
              "key_value_pairs": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "multi_value": false,
              "multiline": false,
              "multilingual": true,
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
              "key_value_pairs": false,
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
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
          },
          "definitions_base": ["container", "container_size", "create_date", "create_user_id",
            "description", "external_create_date", "external_identity", "external_identity_type",
            "external_modify_date", "external_source", "favorite", "guid", "icon", "icon_large",
            "id", "modify_date", "modify_user_id", "name", "owner_group_id", "owner_user_id",
            "parent_id", "reserved", "reserved_date", "reserved_user_id", "type", "type_name",
            "versions_control_advanced", "volume_id"],
          "definitions_order": ["id", "type", "type_name", "name", "description", "parent_id",
            "volume_id", "guid", "create_date", "create_user_id", "modify_date", "modify_user_id",
            "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id",
            "icon", "icon_large", "versions_control_advanced", "container", "container_size",
            "favorite", "external_create_date", "external_modify_date", "external_source",
            "external_identity", "external_identity_type"],
          "type": 141,
          "type_info": {"advanced_versioning": false, "container": true},
          "type_name": "Enterprise Workspace"
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/volumes/142',
        responseText: {
          "addable_types": [{
            "icon": "\/alphasupport\/webdoc\/folder.gif",
            "type": 0,
            "type_name": "Folder"
          }, {"icon": "\/alphasupport\/tinyali.gif", "type": 1, "type_name": "Shortcut"},
            {"icon": "\/alphasupport\/tinygen.gif", "type": 2, "type_name": "Generation"}, {
              "icon": "\/alphasupport\/webattribute\/16category.gif",
              "type": 131,
              "type_name": "Category"
            }, {
              "icon": "\/alphasupport\/webdoc\/cd.gif",
              "type": 136,
              "type_name": "Compound Document"
            }, {"icon": "\/alphasupport\/webdoc\/url.gif", "type": 140, "type_name": "URL"},
            {"icon": "\/alphasupport\/webdoc\/doc.gif", "type": 144, "type_name": "Document"},
            {"icon": "\/alphasupport\/project\/16project.gif", "type": 202, "type_name": "Project"},
            {"icon": "\/alphasupport\/task\/16tasklist.gif", "type": 204, "type_name": "Task List"},
            {"icon": "\/alphasupport\/channel\/16channel.gif", "type": 207, "type_name": "Channel"},
            {
              "icon": "\/alphasupport\/collections\/collection.gif",
              "type": 298,
              "type_name": "Collection"
            }, {
              "icon": "\/alphasupport\/otemail\/emailcontainer.gif",
              "type": 557,
              "type_name": "Compound Email"
            }, {"icon": "\/alphasupport\/otemail\/email.gif", "type": 749, "type_name": "Email"}, {
              "icon": "\/alphasupport\/otemail\/emailfolder.gif",
              "type": 751,
              "type_name": "Email Folder"
            }, {
              "icon": "\/alphasupport\/webdoc\/virtual_folder.png",
              "type": 899,
              "type_name": "Virtual Folder"
            }, {"icon": "\/alphasupport\/wiki\/wiki.gif", "type": 5573, "type_name": "Wiki"}, {
              "icon": "\/alphasupport\/webreports\/webreports.gif",
              "type": 30303,
              "type_name": "WebReport"
            }, {
              "icon": "\/alphasupport\/activeview\/activeview.gif",
              "type": 30309,
              "type_name": "ActiveView"
            }],
          "available_actions": [{
            "parameterless": false,
            "read_only": true,
            "type": "browse",
            "type_name": "Browse",
            "webnode_signature": null
          }, {
            "parameterless": false,
            "read_only": false,
            "type": "update",
            "type_name": "Update",
            "webnode_signature": null
          }],
          "available_roles": [{"type": "permissions", "type_name": "Permissions"},
            {"type": "audit", "type_name": "Audit"},
            {"type": "categories", "type_name": "Categories"},
            {"type": "nicknames", "type_name": "Nicknames"}],
          "data": {
            "container": true,
            "container_size": 116,
            "create_date": "2003-10-01T13:30:55",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {"de_DE": "", "en": "", "ja": ""},
            "external_create_date": null,
            "external_identity": "",
            "external_identity_type": "",
            "external_modify_date": null,
            "external_source": "",
            "favorite": false,
            "guid": null,
            "icon": "\/alphasupport\/webdoc\/icon_library.gif",
            "icon_large": "\/alphasupport\/webdoc\/icon_library_large.gif",
            "id": 2000,
            "modify_date": "2017-12-03T21:17:32",
            "modify_user_id": 1000,
            "name": "Enterprise Workspace",
            "name_multilingual": {
              "de_DE": "Enterprise Workspace",
              "en": "Enterprise Workspace",
              "ja": ""
            },
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 141,
            "type_name": "Enterprise Workspace",
            "versions_control_advanced": false,
            "volume_id": -2000
          },
          "definitions": {
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": true,
              "multilingual": true,
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
            "external_create_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_create_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Create Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_identity": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity",
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
            "external_identity_type": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity_type",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity Type",
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
            "external_modify_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_modify_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Modify Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_source": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_source",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Source",
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
            "guid": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "guid",
              "key_value_pairs": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "multi_value": false,
              "multiline": false,
              "multilingual": true,
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
              "key_value_pairs": false,
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
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
          },
          "definitions_base": ["container", "container_size", "create_date", "create_user_id",
            "description", "external_create_date", "external_identity", "external_identity_type",
            "external_modify_date", "external_source", "favorite", "guid", "icon", "icon_large",
            "id", "modify_date", "modify_user_id", "name", "owner_group_id", "owner_user_id",
            "parent_id", "reserved", "reserved_date", "reserved_user_id", "type", "type_name",
            "versions_control_advanced", "volume_id"],
          "definitions_order": ["id", "type", "type_name", "name", "description", "parent_id",
            "volume_id", "guid", "create_date", "create_user_id", "modify_date", "modify_user_id",
            "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id",
            "icon", "icon_large", "versions_control_advanced", "container", "container_size",
            "favorite", "external_create_date", "external_modify_date", "external_source",
            "external_identity", "external_identity_type"],
          "type": 141,
          "type_info": {"advanced_versioning": false, "container": true},
          "type_name": "Enterprise Workspace"
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/volumes/133',
        responseText: {
          "addable_types": [{
            "icon": "\/alphasupport\/webattribute\/16category.gif",
            "type": 131,
            "type_name": "Category"
          }, {
            "icon": "\/alphasupport\/webattribute\/16catfolder.gif",
            "type": 132,
            "type_name": "Category Folder"
          }],
          "available_actions": [{
            "parameterless": false,
            "read_only": true,
            "type": "browse",
            "type_name": "Browse",
            "webnode_signature": null
          }],
          "available_roles": [{"type": "permissions", "type_name": "Permissions"},
            {"type": "audit", "type_name": "Audit"},
            {"type": "categories", "type_name": "Categories"},
            {"type": "nicknames", "type_name": "Nicknames"}],
          "data": {
            "container": true,
            "container_size": 70,
            "create_date": "2003-10-01T13:30:55",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {"de_DE": "", "en": "", "ja": ""},
            "external_create_date": null,
            "external_identity": "",
            "external_identity_type": "",
            "external_modify_date": null,
            "external_source": "",
            "favorite": false,
            "guid": null,
            "icon": "\/alphasupport\/webattribute\/16vol_categories.gif",
            "icon_large": "\/alphasupport\/webattribute\/16vol_categories_large.gif",
            "id": 2004,
            "modify_date": "2017-11-21T08:47:40",
            "modify_user_id": 1000,
            "name": "Categories Volume",
            "name_multilingual": {"de_DE": "", "en": "Categories Volume", "ja": ""},
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 133,
            "type_name": "Categories Volume",
            "versions_control_advanced": false,
            "volume_id": -2004
          },
          "definitions": {
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": true,
              "multilingual": true,
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
            "external_create_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_create_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Create Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_identity": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity",
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
            "external_identity_type": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_identity_type",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Identity Type",
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
            "external_modify_date": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "include_time": true,
              "key": "external_modify_date",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "External Modify Date",
              "persona": "",
              "read_only": true,
              "required": false,
              "type": -7,
              "type_name": "Date",
              "valid_values": [],
              "valid_values_name": []
            },
            "external_source": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "external_source",
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "External Source",
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
            "guid": {
              "allow_undefined": false,
              "bulk_shared": false,
              "default_value": null,
              "description": null,
              "hidden": false,
              "key": "guid",
              "key_value_pairs": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "key_value_pairs": false,
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
              "multi_value": false,
              "multiline": false,
              "multilingual": true,
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
              "key_value_pairs": false,
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
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
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
          },
          "definitions_base": ["container", "container_size", "create_date", "create_user_id",
            "description", "external_create_date", "external_identity", "external_identity_type",
            "external_modify_date", "external_source", "favorite", "guid", "icon", "icon_large",
            "id", "modify_date", "modify_user_id", "name", "owner_group_id", "owner_user_id",
            "parent_id", "reserved", "reserved_date", "reserved_user_id", "type", "type_name",
            "versions_control_advanced", "volume_id"],
          "definitions_order": ["id", "type", "type_name", "name", "description", "parent_id",
            "volume_id", "guid", "create_date", "create_user_id", "modify_date", "modify_user_id",
            "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id",
            "icon", "icon_large", "versions_control_advanced", "container", "container_size",
            "favorite", "external_create_date", "external_modify_date", "external_source",
            "external_identity", "external_identity_type"],
          "type": 133,
          "type_info": {"advanced_versioning": false, "container": true},
          "type_name": "Categories Volume"
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/targets?fields=properties&fields=versions.element(0)&expand=properties%7Boriginal_id%7D&orderBy=asc_type&actions=',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/members\/targets?actions&expand=properties{original_id}&fields=properties&fields=versions.element(0)",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [{
            "volume_id": {
              "container": true,
              "container_size": 109,
              "create_date": "2003-10-01T13:30:55",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {
                "de_DE": "",
                "en": "",
                "ja": ""
              },
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "/alphasupport/webdoc/icon_library.gif",
              "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
              "id": 2000,
              "modify_date": "2017-12-14T06:46:00",
              "modify_user_id": 1000,
              "name": "Enterprise Workspace",
              "name_multilingual": {
                "de_DE": "Enterprise Workspace",
                "en": "Enterprise Workspace",
                "ja": ""
              },
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": -1,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 141,
              "type_name": "Enterprise Workspace",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "id": 9804402,
            "parent_id": {
              "container": true,
              "container_size": 43,
              "create_date": "2016-07-14T00:49:07",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {
                "de_DE": "",
                "en": "",
                "ja": ""
              },
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "icon_large": "/alphasupport/webdoc/folder_large.gif",
              "id": 1282482,
              "modify_date": "2017-12-14T01:52:25",
              "modify_user_id": 1000,
              "name": "0 0 7 Ravi Lab",
              "name_multilingual": {
                "de_DE": "0 0 7 Ravi Lab",
                "en": "007 Ravi Lab",
                "ja": ""
              },
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": 604999,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 0,
              "type_name": "Folder",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "user_id": 1000,
            "name": "asrr.jpg",
            "type": 144,
            "description": "eee",
            "create_date": "2017-11-16T00:26:46",
            "create_user_id": 1000,
            "modify_date": "2017-12-05T18:50:33",
            "modify_user_id": 1000,
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "/alphasupport/webdoc/appjpeg.gif",
            "mime_type": "image/jpeg",
            "original_id": 0,
            "wnd_comments": null,
            "type_name": "Document",
            "container": false,
            "size": 16022,
            "perm_see": true,
            "perm_see_contents": true,
            "perm_modify": true,
            "perm_modify_attributes": true,
            "perm_modify_permissions": true,
            "perm_create": true,
            "perm_delete": true,
            "perm_delete_versions": true,
            "perm_reserve": true,
            "favorite": false,
            "wnd_owner": 1000,
            "wnd_createdby": 1000,
            "wnd_createdate": "2017-11-16T00:26:46",
            "wnd_modifiedby": 1000,
            "size_formatted": "16 KB",
            "reserved_user_login": null,
            "action_url": "/v1/actions/9804402",
            "parent_id_url": "/v1/nodes/1282482",
            "commands": {
              "addversion": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api/v1/forms/nodes/versions/create?id=9804402",
                "method": "",
                "name": "Add Version"
              },
              "comment": {
                "body": "",
                "content_type": "application/x-www-form-urlencoded",
                "href": "",
                "href_form": "",
                "method": "POST",
                "name": "Comments"
              },
              "copy": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api/v1/forms/nodes/copy?id=9804402",
                "method": "",
                "name": "Copy"
              },
              "default": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/9804402/content?action=open",
                "href_form": "",
                "method": "GET",
                "name": "Open"
              },
              "delete": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/9804402",
                "href_form": "",
                "method": "DELETE",
                "name": "Delete"
              },
              "download": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/9804402/content?action=download",
                "href_form": "",
                "method": "GET",
                "name": "Download"
              },
              "edit": {
                "body": "",
                "content_type": "",
                "href": "func=Edit.Edit&nodeid=9804402&uiType=2",
                "href_form": "",
                "method": "GET",
                "name": "Edit"
              },
              "move": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api/v1/forms/nodes/move?id=9804402",
                "method": "",
                "name": "Move"
              },
              "properties": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "",
                "method": "",
                "name": "Properties"
              },
              "properties_audit": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/9804402/audit?limit=1000",
                "href_form": "",
                "method": "GET",
                "name": "Audit"
              },
              "properties_categories": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "",
                "method": "",
                "name": "Categories"
              },
              "properties_classifications": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/9804402/classifications",
                "href_form": "",
                "method": "GET",
                "name": "Classifications"
              },
              "properties_general": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api/v1/forms/nodes/properties/general?id=9804402",
                "method": "",
                "name": "General"
              },
              "properties_versions": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/9804402/versions",
                "href_form": "",
                "method": "GET",
                "name": "Versions"
              },
              "rename": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "/api/v1/forms/nodes/rename?id=9804402",
                "method": "",
                "name": "Rename"
              },
              "reserve": {
                "body": "reserved_user_id=1000",
                "content_type": "application/x-www-form-urlencoded",
                "href": "api/v1/nodes/9804402",
                "href_form": "",
                "method": "PUT",
                "name": "Reserve"
              }
            },
            "commands_map": {
              "properties": [
                "properties_general",
                "properties_audit",
                "properties_categories",
                "properties_classifications",
                "properties_versions"
              ]
            },
            "commands_order": [
              "default",
              "download",
              "addversion",
              "edit",
              "rename",
              "copy",
              "move",
              "reserve",
              "delete",
              "comment",
              "properties"
            ],
            "wnf_att_690t_4_formatted": null,
            "wnd_att_690t_3_formatted": null,
            "wnf_att_690t_5_formatted": null,
            "wnd_att_690t_6_formatted": null,
            "wnf_att_690t_7_formatted": null,
            "wnd_comments_formatted": null
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1261480\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddClassifications": {
                  "body": "",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1261480\/classifications",
                  "method": "POST",
                  "name": "Add Classification"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1261480\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=1261480",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1261480",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=1261480",
                  "method": "GET",
                  "name": "View"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=1261480",
                  "href": "\/api\/v2\/nodes\/1261480",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1261480\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1261480",
                  "method": "GET",
                  "name": "Properties"
                },
                "removefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/1261480",
                  "method": "DELETE",
                  "name": "Remove Favorite"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=1261480",
                  "href": "\/api\/v2\/nodes\/1261480",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "removefavorite", "copy",
                "move", "permissions", "AddClassifications", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 116,
                "create_date": "2016-07-12T13:19:05",
                "create_user_id": 1000,
                "description": "replacing with new description.........",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "replacing with new description........."
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "id": 1261480,
                "mime_type": null,
                "modify_date": "2017-12-04T20:39:22",
                "modify_user_id": 1000,
                "name": "100 Documents",
                "name_multilingual": {"de_DE": "100 Documents", "en": "100 Documents"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2000,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 116,
                "size_formatted": "116 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10063433\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10063433\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=10063433",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10063433",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=10063433",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/10063433",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=10063433",
                  "href": "\/api\/v2\/nodes\/10063433",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10063433\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10063433",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=10063433",
                  "href": "\/api\/v2\/nodes\/10063433",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 4,
                "create_date": "2017-11-26T23:14:42",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"de_DE": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 10063433,
                "mime_type": null,
                "modify_date": "2017-12-04T19:55:52",
                "modify_user_id": 1000,
                "name": "HTML",
                "name_multilingual": {"de_DE": "HTML"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2609792,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 4,
                "size_formatted": "4 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4934774\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4934774\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=4934774",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4934774",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=4934774",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/4934774",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=4934774",
                  "href": "\/api\/v2\/nodes\/4934774",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4934774\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4934774",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=4934774",
                  "href": "\/api\/v2\/nodes\/4934774",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 11,
                "create_date": "2017-06-07T07:48:43",
                "create_user_id": 1000,
                "description": "f",
                "description_multilingual": {"de_DE": "f", "en": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 4934774,
                "mime_type": null,
                "modify_date": "2017-10-19T20:16:07",
                "modify_user_id": 1000,
                "name": "ArunFolder",
                "name_multilingual": {"de_DE": "", "en": "ArunFolder"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 604999,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 11,
                "size_formatted": "11 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9343940\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddClassifications": {
                  "body": "",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9343940\/classifications",
                  "method": "POST",
                  "name": "Add Classification"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9343940\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=9343940",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9343940",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=9343940",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/9343940",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=9343940",
                  "href": "\/api\/v2\/nodes\/9343940",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9343940\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9343940",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=9343940",
                  "href": "\/api\/v2\/nodes\/9343940",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "AddClassifications", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 6,
                "create_date": "2017-10-30T07:33:52",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"de_DE": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 9343940,
                "mime_type": null,
                "modify_date": "2017-12-04T03:47:50",
                "modify_user_id": 1000,
                "name": "Christine O",
                "name_multilingual": {"de_DE": "Christine O"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2000,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 6,
                "size_formatted": "6 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2058937\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddClassifications": {
                  "body": "",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2058937\/classifications",
                  "method": "POST",
                  "name": "Add Classification"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2058937\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=2058937",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2058937",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=2058937",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/2058937",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=2058937",
                  "href": "\/api\/v2\/nodes\/2058937",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2058937\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2058937",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=2058937",
                  "href": "\/api\/v2\/nodes\/2058937",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "AddClassifications", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 3,
                "create_date": "2017-03-06T07:36:01",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"en": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 2058937,
                "mime_type": null,
                "modify_date": "2017-12-04T02:48:32",
                "modify_user_id": 1000,
                "name": "55544_Time_test",
                "name_multilingual": {"en": "55544_Time_test"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2003,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 3,
                "size_formatted": "3 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2003
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2904354\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddClassifications": {
                  "body": "",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2904354\/classifications",
                  "method": "POST",
                  "name": "Add Classification"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2904354\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=2904354",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2904354",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=2904354",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/2904354",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=2904354",
                  "href": "\/api\/v2\/nodes\/2904354",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2904354\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2904354",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=2904354",
                  "href": "\/api\/v2\/nodes\/2904354",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "AddClassifications", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 21,
                "create_date": "2017-03-29T07:41:03",
                "create_user_id": 1000,
                "description": "Folder used in automatic tests for Admin user.",
                "description_multilingual": {
                  "de_DE": "",
                  "en": "Folder used in automatic tests for Admin user."
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 2904354,
                "mime_type": null,
                "modify_date": "2017-12-03T23:49:11",
                "modify_user_id": 1000,
                "name": "Admin folder",
                "name_multilingual": {"de_DE": "Admin folder", "en": "Admin folder"},
                "owner": "Kristen Smith",
                "owner_group_id": 1001,
                "owner_user_id": 64039,
                "parent_id": 2000,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 21,
                "size_formatted": "21 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9331950\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9331950\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=9331950",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9331950",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=9331950",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/9331950",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=9331950",
                  "href": "\/api\/v2\/nodes\/9331950",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9331950\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9331950",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=9331950",
                  "href": "\/api\/v2\/nodes\/9331950",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 18,
                "create_date": "2017-10-29T20:15:08",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"de_DE": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 9331950,
                "mime_type": null,
                "modify_date": "2017-12-01T05:49:04",
                "modify_user_id": 1000,
                "name": "000000",
                "name_multilingual": {"de_DE": "000000"},
                "owner": "Ranking",
                "owner_group_id": 1001,
                "owner_user_id": 53684,
                "parent_id": 2000,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 18,
                "size_formatted": "18 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2000\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2000\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=2000",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/2000",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2000\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2000",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=2000",
                  "href": "\/api\/v2\/nodes\/2000",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "permissions",
                "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 116,
                "create_date": "2003-10-01T13:30:55",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"de_DE": "", "en": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 2000,
                "mime_type": null,
                "modify_date": "2017-12-03T21:17:32",
                "modify_user_id": 1000,
                "name": "Enterprise Workspace",
                "name_multilingual": {
                  "de_DE": "Enterprise Workspace",
                  "en": "Enterprise Workspace"
                },
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 116,
                "size_formatted": "116 Items",
                "type": 141,
                "type_name": "Enterprise Workspace",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/604999\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/604999\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=604999",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/604999",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=604999",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/604999",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=604999",
                  "href": "\/api\/v2\/nodes\/604999",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/604999\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/604999",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=604999",
                  "href": "\/api\/v2\/nodes\/604999",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 65,
                "create_date": "2016-04-26T10:04:49",
                "create_user_id": 1000,
                "description": "Hyderabad Smart UI team\u0027s (Kaveri & Manas) folder.",
                "description_multilingual": {
                  "de_DE": "Hyderabad Smart UI team\u0027s (Kaveri & Manas) folder.",
                  "en": "Hyderabad Smart UI teams (Kaveri & Manas) folder."
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 604999,
                "mime_type": null,
                "modify_date": "2017-12-04T18:21:57",
                "modify_user_id": 1000,
                "name": "007 Hyderabad",
                "name_multilingual": {"de_DE": "007 Hyderabad", "en": "007 Hyderabad"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2000,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 65,
                "size_formatted": "65 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2905124\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddClassifications": {
                  "body": "",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2905124\/classifications",
                  "method": "POST",
                  "name": "Add Classification"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2905124\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=2905124",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2905124",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=2905124",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/2905124",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=2905124",
                  "href": "\/api\/v2\/nodes\/2905124",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2905124\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/2905124",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=2905124",
                  "href": "\/api\/v2\/nodes\/2905124",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "AddClassifications", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 8,
                "create_date": "2017-03-29T07:41:58",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"en": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 2905124,
                "mime_type": null,
                "modify_date": "2017-12-01T08:19:48",
                "modify_user_id": 1000,
                "name": "Documents_02",
                "name_multilingual": {"en": "Documents_02"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2904354,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 8,
                "size_formatted": "8 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/67449\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddClassifications": {
                  "body": "",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/67449\/classifications",
                  "method": "POST",
                  "name": "Add Classification"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/67449\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=67449",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/67449",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=67449",
                  "method": "GET",
                  "name": "View"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=67449",
                  "href": "\/api\/v2\/nodes\/67449",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/67449\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/67449",
                  "method": "GET",
                  "name": "Properties"
                },
                "removefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/67449",
                  "method": "DELETE",
                  "name": "Remove Favorite"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=67449",
                  "href": "\/api\/v2\/nodes\/67449",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "removefavorite", "copy",
                "move", "permissions", "AddClassifications", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 38,
                "create_date": "2015-03-03T13:53:46",
                "create_user_id": 1000,
                "description": "ed",
                "description_multilingual": {"de_DE": "ed", "en": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "id": 67449,
                "mime_type": null,
                "modify_date": "2017-12-01T07:42:56",
                "modify_user_id": 1000,
                "name": "HH_Folder",
                "name_multilingual": {"de_DE": "HH_Folder", "en": "HH_Folder"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2000,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 38,
                "size_formatted": "38 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/421327\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddClassifications": {
                  "body": "",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/421327\/classifications",
                  "method": "POST",
                  "name": "Add Classification"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/421327\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=421327",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/421327",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=421327",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/421327",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=421327",
                  "href": "\/api\/v2\/nodes\/421327",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/421327\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/421327",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=421327",
                  "href": "\/api\/v2\/nodes\/421327",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "AddClassifications", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 8,
                "create_date": "2016-01-22T12:26:37",
                "create_user_id": 1000,
                "description": "ab",
                "description_multilingual": {"en": "ab"},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 421327,
                "mime_type": null,
                "modify_date": "2017-12-01T07:42:56",
                "modify_user_id": 1000,
                "name": "aaaaaaaa",
                "name_multilingual": {"en": "aaaaaaaa"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 67449,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 8,
                "size_formatted": "8 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9781520\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9781520\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=9781520",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9781520",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=9781520",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/9781520",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=9781520",
                  "href": "\/api\/v2\/nodes\/9781520",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9781520\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/9781520",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=9781520",
                  "href": "\/api\/v2\/nodes\/9781520",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "delete", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 6,
                "create_date": "2017-11-15T17:31:54",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"de_DE": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 9781520,
                "mime_type": null,
                "modify_date": "2017-11-29T01:39:51",
                "modify_user_id": 1000,
                "name": "007 Ravi Test Collection",
                "name_multilingual": {"de_DE": "007 Ravi Test Collection"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 1282482,
                "permissions_model": "simple",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 6,
                "size_formatted": "6 Items",
                "type": 298,
                "type_name": "Collection",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10161230\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddClassifications": {
                  "body": "",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10161230\/classifications",
                  "method": "POST",
                  "name": "Add Classification"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10161230\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=10161230",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10161230",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=10161230",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/10161230",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=10161230",
                  "href": "\/api\/v2\/nodes\/10161230",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10161230\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/10161230",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=10161230",
                  "href": "\/api\/v2\/nodes\/10161230",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "AddClassifications", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 5,
                "create_date": "2017-11-30T11:48:16",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"de_DE": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 10161230,
                "mime_type": null,
                "modify_date": "2017-11-30T12:51:11",
                "modify_user_id": 1000,
                "name": "Folder with tabbed perspective",
                "name_multilingual": {"de_DE": "Folder with tabbed perspective"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 67449,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 5,
                "size_formatted": "5 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/605224\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "AddClassifications": {
                  "body": "",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/605224\/classifications",
                  "method": "POST",
                  "name": "Add Classification"
                },
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/605224\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=605224",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/605224",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "docview": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "?func=doc.viewdoc&nodeid=605224",
                  "method": "GET",
                  "name": "View"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/605224",
                  "method": "POST",
                  "name": "Add to Favorites"
                },
                "more": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "..."
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=605224",
                  "href": "\/api\/v2\/nodes\/605224",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/605224\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "Permissions"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/605224",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=605224",
                  "href": "\/api\/v2\/nodes\/605224",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {"default_action": "open", "more": ["properties", "audit"]},
              "order": ["docview", "open", "addcategory", "rename", "makefavorite", "copy", "move",
                "permissions", "AddClassifications", "delete", "comment", "more"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 21,
                "create_date": "2016-04-27T06:40:48",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"en": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 605224,
                "mime_type": null,
                "modify_date": "2017-11-29T22:39:49",
                "modify_user_id": 1000,
                "name": "SubtypeTests",
                "name_multilingual": {"en": "SubtypeTests"},
                "owner": "Admin",
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 77317,
                "permissions_model": "advanced",
                "reserved": false,
                "reserved_date": null,
                "reserved_shared_collaboration": false,
                "reserved_user_id": 0,
                "size": 21,
                "size_formatted": "21 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }, {
            "volume_id": {
              "container": true,
              "container_size": 109,
              "create_date": "2003-10-01T13:30:55",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {
                "de_DE": "",
                "en": "",
                "ja": ""
              },
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "/alphasupport/webdoc/icon_library.gif",
              "icon_large": "/alphasupport/webdoc/icon_library_large.gif",
              "id": 2000,
              "modify_date": "2017-12-14T06:46:00",
              "modify_user_id": 1000,
              "name": "Enterprise Workspace",
              "name_multilingual": {
                "de_DE": "Enterprise Workspace",
                "en": "Enterprise Workspace",
                "ja": ""
              },
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": -1,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 141,
              "type_name": "Enterprise Workspace",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "id": 3162416,
            "parent_id": {
              "container": true,
              "container_size": 43,
              "create_date": "2016-07-14T00:49:07",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {
                "de_DE": "",
                "en": "",
                "ja": ""
              },
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "/alphasupport/webdoc/folder.gif",
              "icon_large": "/alphasupport/webdoc/folder_large.gif",
              "id": 1282482,
              "modify_date": "2017-12-14T01:52:25",
              "modify_user_id": 1000,
              "name": "0 0 7 Ravi Lab",
              "name_multilingual": {
                "de_DE": "0 0 7 Ravi Lab",
                "en": "007 Ravi Lab",
                "ja": ""
              },
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": 604999,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 0,
              "type_name": "Folder",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "user_id": 1000,
            "name": "007 Bob.jpg",
            "type": 144,
            "description": null,
            "create_date": "2017-04-05T05:31:11",
            "create_user_id": 1000,
            "modify_date": "2017-12-11T17:22:48",
            "modify_user_id": 1000,
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "/alphasupport/webdoc/appjpeg.gif",
            "mime_type": "image/jpeg",
            "original_id": 0,
            "wnd_comments": null,
            "type_name": "Document",
            "container": false,
            "size": 845941,
            "perm_see": true,
            "perm_see_contents": true,
            "perm_modify": true,
            "perm_modify_attributes": true,
            "perm_modify_permissions": true,
            "perm_create": true,
            "perm_delete": true,
            "perm_delete_versions": true,
            "perm_reserve": true,
            "favorite": false,
            "wnd_owner": 1000,
            "wnd_createdby": 1000,
            "wnd_createdate": "2017-04-05T05:31:11",
            "wnd_modifiedby": 1000,
            "size_formatted": "827 KB",
            "reserved_user_login": null,
            "action_url": "/v1/actions/3162416",
            "parent_id_url": "/v1/nodes/1282482",
            "commands": {
              "addversion": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api/v1/forms/nodes/versions/create?id=3162416",
                "method": "",
                "name": "Add Version"
              },
              "comment": {
                "body": "",
                "content_type": "application/x-www-form-urlencoded",
                "href": "",
                "href_form": "",
                "method": "POST",
                "name": "Comments"
              },
              "copy": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api/v1/forms/nodes/copy?id=3162416",
                "method": "",
                "name": "Copy"
              },
              "default": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/3162416/content?action=open",
                "href_form": "",
                "method": "GET",
                "name": "Open"
              },
              "delete": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/3162416",
                "href_form": "",
                "method": "DELETE",
                "name": "Delete"
              },
              "download": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/3162416/content?action=download",
                "href_form": "",
                "method": "GET",
                "name": "Download"
              },
              "edit": {
                "body": "",
                "content_type": "",
                "href": "func=Edit.Edit&nodeid=3162416&uiType=2",
                "href_form": "",
                "method": "GET",
                "name": "Edit"
              },
              "move": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api/v1/forms/nodes/move?id=3162416",
                "method": "",
                "name": "Move"
              },
              "properties": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "",
                "method": "",
                "name": "Properties"
              },
              "properties_audit": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/3162416/audit?limit=1000",
                "href_form": "",
                "method": "GET",
                "name": "Audit"
              },
              "properties_categories": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api/v1/forms/nodes/categories/update?id=3162416&category_id=7337905",
                "method": "",
                "name": "Categories"
              },
              "properties_classifications": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/3162416/classifications",
                "href_form": "",
                "method": "GET",
                "name": "Classifications"
              },
              "properties_general": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "api/v1/forms/nodes/properties/general?id=3162416",
                "method": "",
                "name": "General"
              },
              "properties_versions": {
                "body": "",
                "content_type": "",
                "href": "api/v1/nodes/3162416/versions",
                "href_form": "",
                "method": "GET",
                "name": "Versions"
              },
              "rename": {
                "body": "",
                "content_type": "",
                "href": "",
                "href_form": "/api/v1/forms/nodes/rename?id=3162416",
                "method": "",
                "name": "Rename"
              },
              "reserve": {
                "body": "reserved_user_id=1000",
                "content_type": "application/x-www-form-urlencoded",
                "href": "api/v1/nodes/3162416",
                "href_form": "",
                "method": "PUT",
                "name": "Reserve"
              }
            },
            "commands_map": {
              "properties": [
                "properties_general",
                "properties_audit",
                "properties_categories",
                "properties_classifications",
                "properties_versions"
              ]
            },
            "commands_order": [
              "default",
              "download",
              "addversion",
              "edit",
              "rename",
              "copy",
              "move",
              "reserve",
              "delete",
              "comment",
              "properties"
            ],
            "wnf_att_690t_4_formatted": null,
            "wnd_att_690t_3_formatted": null,
            "wnf_att_690t_5_formatted": null,
            "wnd_att_690t_6_formatted": null,
            "wnf_att_690t_7_formatted": null,
            "wnd_comments_formatted": null
          }]
        }
      }));
      mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2001',
        status: 200,
        responseText: {}
      });

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2007(?:\\?(.*))?$'),
        responseText: {
          results: {
            actions: {
              data: {
                removefromcollection: {}
              },
              map: {},
              order: {}
            },
            data: {
              "id": 2007,
              "name": "Test",
              "type": 144
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions\\?reference_id=5001&ids=2007(?:&(.*))?$'),
        responseText: {
          results: {
            '2007': {
              data: {
                'removefromcollection': {}
              },
              map: {},
              order: {}
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2006(?:\\?(.*))?$'),
        responseText: {
          results: {
            actions: {
              data: {
                collectionCanCollect: {}
              },
              map: {},
              order: {}
            },
            data: {
              "id": 2006,
              "name": "Test",
              "type": 298
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions\\?ids=2006(?:&(.*))?$'),
        responseText: {
          results: {
            '2006': {
              data: {
                'collectionCanCollect': {}
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
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };
});
