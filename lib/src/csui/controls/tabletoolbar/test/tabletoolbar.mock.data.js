/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/jquery.mockjax'], function ($, mockjax) {

  var DataManager = function DataManager() {},
      mocks = [];

  DataManager.test65909 = {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/65909(?:\\?(.*))?$'),
        responseText: {
          "addable_types": [{
            "icon": "\/alphasupport\/webdoc\/folder.gif",
            "type": 0,
            "type_name": "Folder"
          }, {"icon": "\/alphasupport\/tinyali.gif", "type": 1, "type_name": "Shortcut"}, {
            "icon": "\/alphasupport\/webattribute\/16category.gif",
            "type": 131,
            "type_name": "Category"
          },
            {
              "icon": "\/alphasupport\/webdoc\/cd.gif",
              "type": 136,
              "type_name": "Compound Document"
            },
            {"icon": "\/alphasupport\/webdoc\/url.gif", "type": 140, "type_name": "URL"},
            {"icon": "\/alphasupport\/webdoc\/doc.gif", "type": 144, "type_name": "Document"},
            {"icon": "\/alphasupport\/task\/16tasklist.gif", "type": 204, "type_name": "Task List"},
            {
              "icon": "\/alphasupport\/channel\/16channel.gif",
              "type": 207,
              "type_name": "Channel"
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
            "type": "create",
            "type_name": "Create",
            "webnode_signature": null
          }, {
            "parameterless": true,
            "read_only": false,
            "type": "delete",
            "type_name": "Delete",
            "webnode_signature": "Delete"
          }, {
            "parameterless": false,
            "read_only": false,
            "type": "update",
            "type_name": "Update",
            "webnode_signature": null
          }, {
            "parameterless": false,
            "read_only": false,
            "type": "copy",
            "type_name": "Copy",
            "webnode_signature": "Copy"
          }, {
            "parameterless": false,
            "read_only": false,
            "type": "move",
            "type_name": "Move",
            "webnode_signature": "Move"
          }],
          "available_roles": [{"type": "audit", "type_name": "Audit"},
            {"type": "categories", "type_name": "Categories"},
            {"type": "versionscontrol", "type_name": "Versions Control"}],
          "data": {
            "create_date": "2015-03-03T06:47:52",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {"en": ""},
            "guid": null,
            "icon": "\/alphasupport\/webdoc\/folder.gif",
            "icon_large": "\/alphasupport\/webdoc\/folder_large.gif",
            "id": 65909,
            "modify_date": "2015-03-10T11:11:05",
            "modify_user_id": 1000,
            "name": "CarbonFiber Demo Area",
            "name_multilingual": {"en": "CarbonFiber Demo Area"},
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
          },
          "definitions": {
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
          },
          "definitions_base": ["create_date", "create_user_id", "description", "guid", "icon",
            "icon_large", "id", "modify_date", "modify_user_id", "name", "owner_group_id",
            "owner_user_id", "parent_id", "reserved", "reserved_date", "reserved_user_id", "type",
            "type_name", "versions_control_advanced", "volume_id"],
          "definitions_order": ["id", "type", "type_name", "name", "description", "parent_id",
            "volume_id", "guid", "create_date", "create_user_id", "modify_date", "modify_user_id",
            "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id",
            "icon", "icon_large", "versions_control_advanced"],
          "perspective": {
            "options": {
              "rows": [{
                "columns": [{
                  "sizes": {"md": 12},
                  "widget": {"options": {}, "type": "nodestable"}
                }]
              }]
            }, "type": "grid"
          },
          "type": 0,
          "type_info": {"advanced_versioning": false, "container": true},
          "type_name": "Folder"
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/65909/addablenodetypes',
        responseText: {
          "data": {
            "compound_document": "api\/v1\/forms\/nodes\/create?type=136&parent_id=183718",
            "document": "api\/v1\/forms\/nodes\/create?type=144&parent_id=183718",
            "folder": "api\/v1\/forms\/nodes\/create?type=0&parent_id=183718",
            "shortcut": "api\/v1\/forms\/nodes\/create?type=1&parent_id=183718",
            "url": "api\/v1\/forms\/nodes\/create?type=140&parent_id=183718"
          },
          "definitions": {
            "compound_document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/alphasupport\/webdoc\/cd.gif",
              "method": "GET",
              "name": "Compound Document",
              "parameters": {},
              "tab_href": "",
              "type": 136
            },
            "document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/alphasupport\/webdoc\/doc.gif",
              "method": "GET",
              "name": "Document",
              "parameters": {},
              "tab_href": "",
              "type": 144
            },
            "folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/alphasupport\/webdoc\/folder.gif",
              "method": "GET",
              "name": "Folder",
              "parameters": {},
              "tab_href": "",
              "type": 0
            },
            "shortcut": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/alphasupport\/tinyali.gif",
              "method": "GET",
              "name": "Shortcut",
              "parameters": {},
              "tab_href": "",
              "type": 1
            },
            "url": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/alphasupport\/webdoc\/url.gif",
              "method": "GET",
              "name": "URL",
              "parameters": {},
              "tab_href": "",
              "type": 140
            }
          },
          "definitions_map": {},
          "definitions_order": ["compound_document", "document", "folder", "shortcut", "url"]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/65909/nodes(?:\\?(.*))?$'),
        responseText: {
          "data": [{
            "volume_id": -2000,
            "id": 66239,
            "parent_id": 65909,
            "name": "Carbon Fiber Project Documents",
            "type": 0,
            "description": null,
            "create_date": "2015-03-03T06:52:54",
            "modify_date": "2015-03-03T06:53:36",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/alphasupport\/webdoc\/folder.gif",
            "mime_type": null,
            "original_id": 0,
            "wnd_owner": 64039,
            "wnd_createdby": 64039,
            "wnd_createdate": "2015-03-03T06:52:54",
            "wnd_modifiedby": 64039,
            "wnd_version": null,
            "wnf_readydate": null,
            "type_name": "Folder",
            "container": true,
            "size": 8,
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
                "menu": "api\/v1\/nodes\/66239\/actions",
                "name": "api\/v1\/nodes\/66239\/nodes",
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
                  "handler": "table",
                  "image": "",
                  "method": "GET",
                  "name": "Carbon Fiber Project Documents",
                  "parameters": {"is_default_action": true},
                  "tab_href": ""
                },
                "type": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "icon",
                  "display_href": "",
                  "handler": "",
                  "image": "\/alphasupport\/webdoc\/folder.gif",
                  "method": "",
                  "name": "Folder",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null,
            "size_formatted": "8 Items",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/66239",
            "parent_id_url": "\/v1\/nodes\/65909",
            "actions": [{
              "name": "Open",
              "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=browse",
              "children": {},
              "signature": "Browse"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Configure",
              "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=editconfig&nexturl=",
              "children": {},
              "signature": "EditConfig"
            }, {
              "name": "Order Custom Views",
              "url": "\/alpha\/cs.exe?func=srch.ordercustomviews&objId=66239&nexturl=",
              "children": {},
              "signature": "OrderCustomViews"
            }, {
              "name": "Rename",
              "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=rename&nexturl=",
              "children": {},
              "signature": "Rename"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add to Favorites",
              "url": "\/alpha\/cs.exe?func=ll&objid=66239&objaction=MakeFavorite&nexturl=",
              "children": {},
              "signature": "MakeFavorite"
            }, {
              "name": "Copy",
              "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=copy&nexturl=",
              "children": {},
              "signature": "Copy"
            }, {
              "name": "Make Shortcut",
              "url": "\/alpha\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=66239&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateAlias"
            }, {
              "name": "Move",
              "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=move&nexturl=",
              "children": {},
              "signature": "Move"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Set Notification",
              "url": "\/alpha\/cs.exe?func=notify.specificnode&Nodeid=66239&VolumeID=-2000&Subtype=0&Name=Carbon%20Fiber%20Project%20Documents&nexturl=",
              "children": {},
              "signature": "SetNotification"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Make News",
              "url": "\/alpha\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=66239&nexturl=",
              "children": {},
              "signature": "CreateNewsAndAttach"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Permissions",
              "url": "\/alpha\/cs.exe?func=ll&objAction=Permissions&objId=66239&id=66239&nexturl=",
              "children": {},
              "signature": "Permissions"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Print",
              "url": "\/alpha\/cs.exe?func=multifile.printmulti&nodeID_list=66239&nexturl=",
              "children": {},
              "signature": "Print"
            }, {
              "name": "Version Control",
              "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=VersionControl&nexturl=",
              "children": {},
              "signature": "VersionControl"
            }, {
              "name": "Zip & Download",
              "url": "\/alpha\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=66239&nexturl=",
              "children": {},
              "signature": "ZipDwnld"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Delete",
              "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=delete&nexturl=",
              "children": {},
              "signature": "Delete"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Properties",
              "url": "",
              "children": [{
                "children": {},
                "name": "General",
                "signature": "Properties",
                "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=properties&nexturl="
              }, {
                "children": {},
                "name": "Audit",
                "signature": "Audit",
                "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=audit&nexturl="
              }, {
                "children": {},
                "name": "Categories",
                "signature": "InfoCmdCategories",
                "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=attrvaluesedit&version=0&nexturl="
              }, {
                "children": {},
                "name": "Columns",
                "signature": "Columns",
                "url": "\/alpha\/cs.exe?func=ll&objid=66239&objAction=columns&nexturl="
              }, {
                "children": {},
                "name": "Perspectives",
                "signature": "Perspectives",
                "url": "\/alpha\/cs.exe?func=ll&objaction=perspectives&objID=66239&nexturl="
              }, {
                "children": {},
                "name": "Presentation",
                "signature": "Catalog",
                "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=catalog&nexturl="
              }, {
                "children": {},
                "name": "References",
                "signature": "References",
                "url": "\/alpha\/cs.exe?func=ll&objId=66239&objAction=references&nexturl="
              }],
              "signature": "PropertiesMenu"
            }]
          }, {
            "volume_id": -2000,
            "id": 66242,
            "parent_id": 65909,
            "name": "Content Server 11 - UX Design Workshop - Closing.pptx",
            "type": 144,
            "description": null,
            "create_date": "2015-03-03T06:56:30",
            "modify_date": "2015-03-30T12:23:31",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/alphasupport\/webdoc\/appppoin.gif",
            "mime_type": "application\/vnd.openxmlformats-officedocument.presentationml.presentation",
            "original_id": 0,
            "wnd_owner": 64039,
            "wnd_createdby": 64039,
            "wnd_createdate": "2015-03-03T06:56:30",
            "wnd_modifiedby": 1000,
            "wnd_version": 1,
            "wnf_readydate": null,
            "type_name": "Document",
            "container": false,
            "size": 13009879,
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
                "menu": "api\/v1\/nodes\/66242\/actions",
                "name": "api\/v1\/nodes\/66242\/content?action=open",
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
                  "name": "Content Server 11 - UX Design Workshop - Closing.pptx",
                  "parameters": {"mime_type": "application\/vnd.openxmlformats-officedocument.presentationml.presentation"},
                  "tab_href": ""
                },
                "type": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "icon",
                  "display_href": "",
                  "handler": "",
                  "image": "\/alphasupport\/webdoc\/doc.gif",
                  "method": "",
                  "name": "Document",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null,
            "size_formatted": "13 MB",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/66242",
            "parent_id_url": "\/v1\/nodes\/65909",
            "actions": [{
              "name": "Download",
              "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=download",
              "children": {},
              "signature": "Download"
            }, {
              "name": "View as Web Page",
              "url": "\/alpha\/cs.exe?func=doc.ViewDoc&nodeid=66242",
              "children": {},
              "signature": "ViewDoc"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add Version",
              "url": "\/alpha\/cs.exe?func=doc.AddVersion&nodeid=66242&nexturl=",
              "children": {},
              "signature": "AddVersion"
            }, {
              "name": "Edit",
              "url": "\/alpha\/cs.exe?func=Edit.Edit&reqp=0&nodeid=66242&nexturl=",
              "children": {},
              "signature": "Edit"
            }, {
              "name": "Rename",
              "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=rename&nexturl=",
              "children": {},
              "signature": "Rename"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add to Favorites",
              "url": "\/alpha\/cs.exe?func=ll&objid=66242&objaction=MakeFavorite&nexturl=",
              "children": {},
              "signature": "MakeFavorite"
            }, {
              "name": "Copy",
              "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=copy&nexturl=",
              "children": {},
              "signature": "Copy"
            }, {
              "name": "Make Generation",
              "url": "\/alpha\/cs.exe?func=ll&objType=2&objAction=Create&sourceID=66242&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateGeneration"
            }, {
              "name": "Make Shortcut",
              "url": "\/alpha\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=66242&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateAlias"
            }, {
              "name": "Move",
              "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=move&nexturl=",
              "children": {},
              "signature": "Move"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Set Notification",
              "url": "\/alpha\/cs.exe?func=notify.specificnode&Nodeid=66242&VolumeID=-2000&Subtype=144&Name=Content%20Server%2011%20%2D%20UX%20Design%20Workshop%20%2D%20Closing%2Epptx&nexturl=",
              "children": {},
              "signature": "SetNotification"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Make News",
              "url": "\/alpha\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=66242&nexturl=",
              "children": {},
              "signature": "CreateNewsAndAttach"
            }, {
              "name": "Rate It",
              "url": "\/alpha\/cs.exe?func=ll&objid=66242&objAction=Ratings",
              "children": {},
              "signature": "RateIt"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Permissions",
              "url": "\/alpha\/cs.exe?func=ll&objAction=Permissions&objId=66242&id=66242&nexturl=",
              "children": {},
              "signature": "Permissions"
            }, {
              "name": "Reserve",
              "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=reservedoc&nexturl=",
              "children": {},
              "signature": "ReserveDoc"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Overview",
              "url": "\/alpha\/cs.exe?func=ll&objaction=overview&objid=66242",
              "children": {},
              "signature": "Overview"
            }, {
              "name": "Print",
              "url": "\/alpha\/cs.exe?func=multifile.printmulti&nodeID_list=66242&nexturl=",
              "children": {},
              "signature": "Print"
            }, {
              "name": "Zip & Download",
              "url": "\/alpha\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=66242&nexturl=",
              "children": {},
              "signature": "ZipDwnld"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Find Similar",
              "url": "\/alpha\/cs.exe?func=OTCIndex.FindSimilarURL&DataID=66242&VersionNum=1",
              "children": {},
              "signature": "OTCIndexResultFindSimilar"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Delete",
              "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=delete&nexturl=",
              "children": {},
              "signature": "Delete"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Properties",
              "url": "",
              "children": [{
                "children": {},
                "name": "General",
                "signature": "Properties",
                "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=properties&nexturl="
              }, {
                "children": {},
                "name": "Specific",
                "signature": "Info",
                "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=info&nexturl="
              }, {
                "children": {},
                "name": "Audit",
                "signature": "Audit",
                "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=audit&nexturl="
              }, {
                "children": {},
                "name": "Categories",
                "signature": "InfoCmdCategories",
                "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=attrvaluesedit&version=1&nexturl="
              }, {
                "children": {},
                "name": "Ratings",
                "signature": "Ratings",
                "url": "\/alpha\/cs.exe?func=ll&objid=66242&objAction=Ratings"
              }, {
                "children": {},
                "name": "References",
                "signature": "References",
                "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=references&nexturl="
              }, {
                "children": {},
                "name": "Versions",
                "signature": "Versions",
                "url": "\/alpha\/cs.exe?func=ll&objId=66242&objAction=versions&nexturl="
              }],
              "signature": "PropertiesMenu"
            }]
          }, {
            "volume_id": -2000,
            "id": 66352,
            "parent_id": 65909,
            "name": "Invoice.doc",
            "type": 144,
            "description": null,
            "create_date": "2015-03-03T06:57:36",
            "modify_date": "2015-03-31T03:04:29",
            "reserved": true,
            "reserved_user_id": 64150,
            "reserved_date": "2015-03-12T11:16:22",
            "icon": "\/alphasupport\/webdoc\/appword.gif",
            "mime_type": "application\/msword",
            "original_id": 0,
            "wnd_owner": 64039,
            "wnd_createdby": 64039,
            "wnd_createdate": "2015-03-03T06:57:36",
            "wnd_modifiedby": 1000,
            "wnd_version": 1,
            "wnf_readydate": null,
            "type_name": "Document",
            "container": false,
            "size": 41472,
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
                "menu": "api\/v1\/nodes\/66352\/actions",
                "name": "api\/v1\/nodes\/66352\/content?action=open",
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
                  "name": "Invoice.doc",
                  "parameters": {"mime_type": "application\/msword"},
                  "tab_href": ""
                },
                "type": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "icon",
                  "display_href": "",
                  "handler": "",
                  "image": "\/alphasupport\/webdoc\/doc.gif",
                  "method": "",
                  "name": "Document",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null,
            "size_formatted": "41 KB",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/66352",
            "parent_id_url": "\/v1\/nodes\/65909",
            "actions": [{
              "name": "Download",
              "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=download",
              "children": {},
              "signature": "Download"
            }, {
              "name": "View as Web Page",
              "url": "\/alpha\/cs.exe?func=doc.ViewDoc&nodeid=66352",
              "children": {},
              "signature": "ViewDoc"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add Version",
              "url": "\/alpha\/cs.exe?func=doc.AddVersion&nodeid=66352&nexturl=",
              "children": {},
              "signature": "AddVersion"
            }, {
              "name": "Edit",
              "url": "\/alpha\/cs.exe?func=Edit.Edit&reqp=0&nodeid=66352&nexturl=",
              "children": {},
              "signature": "Edit"
            }, {
              "name": "Rename",
              "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=rename&nexturl=",
              "children": {},
              "signature": "Rename"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add to Favorites",
              "url": "\/alpha\/cs.exe?func=ll&objid=66352&objaction=MakeFavorite&nexturl=",
              "children": {},
              "signature": "MakeFavorite"
            }, {
              "name": "Copy",
              "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=copy&nexturl=",
              "children": {},
              "signature": "Copy"
            }, {
              "name": "Make Generation",
              "url": "\/alpha\/cs.exe?func=ll&objType=2&objAction=Create&sourceID=66352&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateGeneration"
            }, {
              "name": "Make Shortcut",
              "url": "\/alpha\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=66352&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateAlias"
            }, {
              "name": "Move",
              "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=move&nexturl=",
              "children": {},
              "signature": "Move"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Set Notification",
              "url": "\/alpha\/cs.exe?func=notify.specificnode&Nodeid=66352&VolumeID=-2000&Subtype=144&Name=Invoice%2Edoc&nexturl=",
              "children": {},
              "signature": "SetNotification"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Make News",
              "url": "\/alpha\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=66352&nexturl=",
              "children": {},
              "signature": "CreateNewsAndAttach"
            }, {
              "name": "Rate It",
              "url": "\/alpha\/cs.exe?func=ll&objid=66352&objAction=Ratings",
              "children": {},
              "signature": "RateIt"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Permissions",
              "url": "\/alpha\/cs.exe?func=ll&objAction=Permissions&objId=66352&id=66352&nexturl=",
              "children": {},
              "signature": "Permissions"
            }, {
              "name": "Unreserve",
              "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=unreservedoc&nexturl=",
              "children": {},
              "signature": "UnreserveDoc"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Overview",
              "url": "\/alpha\/cs.exe?func=ll&objaction=overview&objid=66352",
              "children": {},
              "signature": "Overview"
            }, {
              "name": "Print",
              "url": "\/alpha\/cs.exe?func=multifile.printmulti&nodeID_list=66352&nexturl=",
              "children": {},
              "signature": "Print"
            }, {
              "name": "Zip & Download",
              "url": "\/alpha\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=66352&nexturl=",
              "children": {},
              "signature": "ZipDwnld"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Find Similar",
              "url": "\/alpha\/cs.exe?func=OTCIndex.FindSimilarURL&DataID=66352&VersionNum=1",
              "children": {},
              "signature": "OTCIndexResultFindSimilar"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Properties",
              "url": "",
              "children": [{
                "children": {},
                "name": "General",
                "signature": "Properties",
                "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=properties&nexturl="
              }, {
                "children": {},
                "name": "Specific",
                "signature": "Info",
                "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=info&nexturl="
              }, {
                "children": {},
                "name": "Audit",
                "signature": "Audit",
                "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=audit&nexturl="
              }, {
                "children": {},
                "name": "Categories",
                "signature": "InfoCmdCategories",
                "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=attrvaluesedit&version=1&nexturl="
              }, {
                "children": {},
                "name": "Ratings",
                "signature": "Ratings",
                "url": "\/alpha\/cs.exe?func=ll&objid=66352&objAction=Ratings"
              }, {
                "children": {},
                "name": "References",
                "signature": "References",
                "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=references&nexturl="
              }, {
                "children": {},
                "name": "Versions",
                "signature": "Versions",
                "url": "\/alpha\/cs.exe?func=ll&objId=66352&objAction=versions&nexturl="
              }],
              "signature": "PropertiesMenu"
            }]
          }, {
            "volume_id": -2000,
            "id": 66023,
            "parent_id": 65909,
            "name": "Iteration 3",
            "type": 0,
            "description": null,
            "create_date": "2015-03-03T06:54:59",
            "modify_date": "2015-03-03T06:54:59",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/alphasupport\/webdoc\/folder.gif",
            "mime_type": null,
            "original_id": 0,
            "wnd_owner": 64039,
            "wnd_createdby": 64039,
            "wnd_createdate": "2015-03-03T06:54:59",
            "wnd_modifiedby": 64039,
            "wnd_version": null,
            "wnf_readydate": null,
            "type_name": "Folder",
            "container": true,
            "size": 0,
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
                "menu": "api\/v1\/nodes\/66023\/actions",
                "name": "api\/v1\/nodes\/66023\/nodes",
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
                  "handler": "table",
                  "image": "",
                  "method": "GET",
                  "name": "Iteration 3",
                  "parameters": {"is_default_action": true},
                  "tab_href": ""
                },
                "type": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "icon",
                  "display_href": "",
                  "handler": "",
                  "image": "\/alphasupport\/webdoc\/folder.gif",
                  "method": "",
                  "name": "Folder",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null,
            "size_formatted": "0 Items",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/66023",
            "parent_id_url": "\/v1\/nodes\/65909",
            "actions": [{
              "name": "Open",
              "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=browse",
              "children": {},
              "signature": "Browse"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Configure",
              "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=editconfig&nexturl=",
              "children": {},
              "signature": "EditConfig"
            }, {
              "name": "Order Custom Views",
              "url": "\/alpha\/cs.exe?func=srch.ordercustomviews&objId=66023&nexturl=",
              "children": {},
              "signature": "OrderCustomViews"
            }, {
              "name": "Rename",
              "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=rename&nexturl=",
              "children": {},
              "signature": "Rename"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add to Favorites",
              "url": "\/alpha\/cs.exe?func=ll&objid=66023&objaction=MakeFavorite&nexturl=",
              "children": {},
              "signature": "MakeFavorite"
            }, {
              "name": "Copy",
              "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=copy&nexturl=",
              "children": {},
              "signature": "Copy"
            }, {
              "name": "Make Shortcut",
              "url": "\/alpha\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=66023&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateAlias"
            }, {
              "name": "Move",
              "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=move&nexturl=",
              "children": {},
              "signature": "Move"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Set Notification",
              "url": "\/alpha\/cs.exe?func=notify.specificnode&Nodeid=66023&VolumeID=-2000&Subtype=0&Name=Iteration%203&nexturl=",
              "children": {},
              "signature": "SetNotification"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Make News",
              "url": "\/alpha\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=66023&nexturl=",
              "children": {},
              "signature": "CreateNewsAndAttach"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Permissions",
              "url": "\/alpha\/cs.exe?func=ll&objAction=Permissions&objId=66023&id=66023&nexturl=",
              "children": {},
              "signature": "Permissions"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Print",
              "url": "\/alpha\/cs.exe?func=multifile.printmulti&nodeID_list=66023&nexturl=",
              "children": {},
              "signature": "Print"
            }, {
              "name": "Version Control",
              "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=VersionControl&nexturl=",
              "children": {},
              "signature": "VersionControl"
            }, {
              "name": "Zip & Download",
              "url": "\/alpha\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=66023&nexturl=",
              "children": {},
              "signature": "ZipDwnld"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Delete",
              "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=delete&nexturl=",
              "children": {},
              "signature": "Delete"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Properties",
              "url": "",
              "children": [{
                "children": {},
                "name": "General",
                "signature": "Properties",
                "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=properties&nexturl="
              }, {
                "children": {},
                "name": "Audit",
                "signature": "Audit",
                "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=audit&nexturl="
              }, {
                "children": {},
                "name": "Categories",
                "signature": "InfoCmdCategories",
                "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=attrvaluesedit&version=0&nexturl="
              }, {
                "children": {},
                "name": "Columns",
                "signature": "Columns",
                "url": "\/alpha\/cs.exe?func=ll&objid=66023&objAction=columns&nexturl="
              }, {
                "children": {},
                "name": "Perspectives",
                "signature": "Perspectives",
                "url": "\/alpha\/cs.exe?func=ll&objaction=perspectives&objID=66023&nexturl="
              }, {
                "children": {},
                "name": "Presentation",
                "signature": "Catalog",
                "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=catalog&nexturl="
              }, {
                "children": {},
                "name": "References",
                "signature": "References",
                "url": "\/alpha\/cs.exe?func=ll&objId=66023&objAction=references&nexturl="
              }],
              "signature": "PropertiesMenu"
            }]
          }, {
            "volume_id": -2000,
            "id": 66351,
            "parent_id": 65909,
            "name": "Iteration 4",
            "type": 0,
            "description": null,
            "create_date": "2015-03-03T06:54:44",
            "modify_date": "2015-03-03T06:54:44",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/alphasupport\/webdoc\/folder.gif",
            "mime_type": null,
            "original_id": 0,
            "wnd_owner": 64039,
            "wnd_createdby": 64039,
            "wnd_createdate": "2015-03-03T06:54:44",
            "wnd_modifiedby": 64039,
            "wnd_version": null,
            "wnf_readydate": null,
            "type_name": "Folder",
            "container": true,
            "size": 0,
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
                "menu": "api\/v1\/nodes\/66351\/actions",
                "name": "api\/v1\/nodes\/66351\/nodes",
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
                  "handler": "table",
                  "image": "",
                  "method": "GET",
                  "name": "Iteration 4",
                  "parameters": {"is_default_action": true},
                  "tab_href": ""
                },
                "type": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "icon",
                  "display_href": "",
                  "handler": "",
                  "image": "\/alphasupport\/webdoc\/folder.gif",
                  "method": "",
                  "name": "Folder",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null,
            "size_formatted": "0 Items",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/66351",
            "parent_id_url": "\/v1\/nodes\/65909",
            "actions": [{
              "name": "Open",
              "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=browse",
              "children": {},
              "signature": "Browse"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Configure",
              "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=editconfig&nexturl=",
              "children": {},
              "signature": "EditConfig"
            }, {
              "name": "Order Custom Views",
              "url": "\/alpha\/cs.exe?func=srch.ordercustomviews&objId=66351&nexturl=",
              "children": {},
              "signature": "OrderCustomViews"
            }, {
              "name": "Rename",
              "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=rename&nexturl=",
              "children": {},
              "signature": "Rename"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add to Favorites",
              "url": "\/alpha\/cs.exe?func=ll&objid=66351&objaction=MakeFavorite&nexturl=",
              "children": {},
              "signature": "MakeFavorite"
            }, {
              "name": "Copy",
              "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=copy&nexturl=",
              "children": {},
              "signature": "Copy"
            }, {
              "name": "Make Shortcut",
              "url": "\/alpha\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=66351&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateAlias"
            }, {
              "name": "Move",
              "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=move&nexturl=",
              "children": {},
              "signature": "Move"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Set Notification",
              "url": "\/alpha\/cs.exe?func=notify.specificnode&Nodeid=66351&VolumeID=-2000&Subtype=0&Name=Iteration%204&nexturl=",
              "children": {},
              "signature": "SetNotification"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Make News",
              "url": "\/alpha\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=66351&nexturl=",
              "children": {},
              "signature": "CreateNewsAndAttach"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Permissions",
              "url": "\/alpha\/cs.exe?func=ll&objAction=Permissions&objId=66351&id=66351&nexturl=",
              "children": {},
              "signature": "Permissions"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Print",
              "url": "\/alpha\/cs.exe?func=multifile.printmulti&nodeID_list=66351&nexturl=",
              "children": {},
              "signature": "Print"
            }, {
              "name": "Version Control",
              "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=VersionControl&nexturl=",
              "children": {},
              "signature": "VersionControl"
            }, {
              "name": "Zip & Download",
              "url": "\/alpha\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=66351&nexturl=",
              "children": {},
              "signature": "ZipDwnld"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Delete",
              "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=delete&nexturl=",
              "children": {},
              "signature": "Delete"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Properties",
              "url": "",
              "children": [{
                "children": {},
                "name": "General",
                "signature": "Properties",
                "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=properties&nexturl="
              }, {
                "children": {},
                "name": "Audit",
                "signature": "Audit",
                "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=audit&nexturl="
              }, {
                "children": {},
                "name": "Categories",
                "signature": "InfoCmdCategories",
                "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=attrvaluesedit&version=0&nexturl="
              }, {
                "children": {},
                "name": "Columns",
                "signature": "Columns",
                "url": "\/alpha\/cs.exe?func=ll&objid=66351&objAction=columns&nexturl="
              }, {
                "children": {},
                "name": "Perspectives",
                "signature": "Perspectives",
                "url": "\/alpha\/cs.exe?func=ll&objaction=perspectives&objID=66351&nexturl="
              }, {
                "children": {},
                "name": "Presentation",
                "signature": "Catalog",
                "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=catalog&nexturl="
              }, {
                "children": {},
                "name": "References",
                "signature": "References",
                "url": "\/alpha\/cs.exe?func=ll&objId=66351&objAction=references&nexturl="
              }],
              "signature": "PropertiesMenu"
            }]
          }, {
            "volume_id": -2000,
            "id": 66461,
            "parent_id": 65909,
            "name": "Iteration 5",
            "type": 0,
            "description": null,
            "create_date": "2015-03-03T06:54:11",
            "modify_date": "2015-03-30T12:40:36",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/alphasupport\/webdoc\/folder.gif",
            "mime_type": null,
            "original_id": 0,
            "wnd_owner": 64039,
            "wnd_createdby": 64039,
            "wnd_createdate": "2015-03-03T06:54:11",
            "wnd_modifiedby": 1000,
            "wnd_version": null,
            "wnf_readydate": null,
            "type_name": "Folder",
            "container": true,
            "size": 0,
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
                "menu": "api\/v1\/nodes\/66461\/actions",
                "name": "api\/v1\/nodes\/66461\/nodes",
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
                  "handler": "table",
                  "image": "",
                  "method": "GET",
                  "name": "Iteration 5",
                  "parameters": {"is_default_action": true},
                  "tab_href": ""
                },
                "type": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "icon",
                  "display_href": "",
                  "handler": "",
                  "image": "\/alphasupport\/webdoc\/folder.gif",
                  "method": "",
                  "name": "Folder",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null,
            "size_formatted": "0 Items",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/66461",
            "parent_id_url": "\/v1\/nodes\/65909",
            "actions": [{
              "name": "Open",
              "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=browse",
              "children": {},
              "signature": "Browse"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Configure",
              "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=editconfig&nexturl=",
              "children": {},
              "signature": "EditConfig"
            }, {
              "name": "Order Custom Views",
              "url": "\/alpha\/cs.exe?func=srch.ordercustomviews&objId=66461&nexturl=",
              "children": {},
              "signature": "OrderCustomViews"
            }, {
              "name": "Rename",
              "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=rename&nexturl=",
              "children": {},
              "signature": "Rename"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add to Favorites",
              "url": "\/alpha\/cs.exe?func=ll&objid=66461&objaction=MakeFavorite&nexturl=",
              "children": {},
              "signature": "MakeFavorite"
            }, {
              "name": "Copy",
              "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=copy&nexturl=",
              "children": {},
              "signature": "Copy"
            }, {
              "name": "Make Shortcut",
              "url": "\/alpha\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=66461&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateAlias"
            }, {
              "name": "Move",
              "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=move&nexturl=",
              "children": {},
              "signature": "Move"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Set Notification",
              "url": "\/alpha\/cs.exe?func=notify.specificnode&Nodeid=66461&VolumeID=-2000&Subtype=0&Name=Iteration%205&nexturl=",
              "children": {},
              "signature": "SetNotification"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Make News",
              "url": "\/alpha\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=66461&nexturl=",
              "children": {},
              "signature": "CreateNewsAndAttach"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Permissions",
              "url": "\/alpha\/cs.exe?func=ll&objAction=Permissions&objId=66461&id=66461&nexturl=",
              "children": {},
              "signature": "Permissions"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Print",
              "url": "\/alpha\/cs.exe?func=multifile.printmulti&nodeID_list=66461&nexturl=",
              "children": {},
              "signature": "Print"
            }, {
              "name": "Version Control",
              "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=VersionControl&nexturl=",
              "children": {},
              "signature": "VersionControl"
            }, {
              "name": "Zip & Download",
              "url": "\/alpha\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=66461&nexturl=",
              "children": {},
              "signature": "ZipDwnld"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Delete",
              "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=delete&nexturl=",
              "children": {},
              "signature": "Delete"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Properties",
              "url": "",
              "children": [{
                "children": {},
                "name": "General",
                "signature": "Properties",
                "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=properties&nexturl="
              }, {
                "children": {},
                "name": "Audit",
                "signature": "Audit",
                "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=audit&nexturl="
              }, {
                "children": {},
                "name": "Categories",
                "signature": "InfoCmdCategories",
                "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=attrvaluesedit&version=0&nexturl="
              }, {
                "children": {},
                "name": "Columns",
                "signature": "Columns",
                "url": "\/alpha\/cs.exe?func=ll&objid=66461&objAction=columns&nexturl="
              }, {
                "children": {},
                "name": "Perspectives",
                "signature": "Perspectives",
                "url": "\/alpha\/cs.exe?func=ll&objaction=perspectives&objID=66461&nexturl="
              }, {
                "children": {},
                "name": "Presentation",
                "signature": "Catalog",
                "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=catalog&nexturl="
              }, {
                "children": {},
                "name": "References",
                "signature": "References",
                "url": "\/alpha\/cs.exe?func=ll&objId=66461&objAction=references&nexturl="
              }],
              "signature": "PropertiesMenu"
            }]
          }, {
            "volume_id": -2000,
            "id": 65801,
            "parent_id": 65909,
            "name": "Iteration 6",
            "type": 0,
            "description": null,
            "create_date": "2015-03-03T06:54:00",
            "modify_date": "2015-03-03T06:54:00",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/alphasupport\/webdoc\/folder.gif",
            "mime_type": null,
            "original_id": 0,
            "wnd_owner": 64039,
            "wnd_createdby": 64039,
            "wnd_createdate": "2015-03-03T06:54:00",
            "wnd_modifiedby": 64039,
            "wnd_version": null,
            "wnf_readydate": null,
            "type_name": "Folder",
            "container": true,
            "size": 0,
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
                "menu": "api\/v1\/nodes\/65801\/actions",
                "name": "api\/v1\/nodes\/65801\/nodes",
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
                  "handler": "table",
                  "image": "",
                  "method": "GET",
                  "name": "Iteration 6",
                  "parameters": {"is_default_action": true},
                  "tab_href": ""
                },
                "type": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "icon",
                  "display_href": "",
                  "handler": "",
                  "image": "\/alphasupport\/webdoc\/folder.gif",
                  "method": "",
                  "name": "Folder",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null,
            "size_formatted": "0 Items",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/65801",
            "parent_id_url": "\/v1\/nodes\/65909",
            "actions": [{
              "name": "Open",
              "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=browse",
              "children": {},
              "signature": "Browse"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Configure",
              "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=editconfig&nexturl=",
              "children": {},
              "signature": "EditConfig"
            }, {
              "name": "Order Custom Views",
              "url": "\/alpha\/cs.exe?func=srch.ordercustomviews&objId=65801&nexturl=",
              "children": {},
              "signature": "OrderCustomViews"
            }, {
              "name": "Rename",
              "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=rename&nexturl=",
              "children": {},
              "signature": "Rename"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add to Favorites",
              "url": "\/alpha\/cs.exe?func=ll&objid=65801&objaction=MakeFavorite&nexturl=",
              "children": {},
              "signature": "MakeFavorite"
            }, {
              "name": "Copy",
              "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=copy&nexturl=",
              "children": {},
              "signature": "Copy"
            }, {
              "name": "Make Shortcut",
              "url": "\/alpha\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=65801&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateAlias"
            }, {
              "name": "Move",
              "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=move&nexturl=",
              "children": {},
              "signature": "Move"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Set Notification",
              "url": "\/alpha\/cs.exe?func=notify.specificnode&Nodeid=65801&VolumeID=-2000&Subtype=0&Name=Iteration%206&nexturl=",
              "children": {},
              "signature": "SetNotification"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Make News",
              "url": "\/alpha\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=65801&nexturl=",
              "children": {},
              "signature": "CreateNewsAndAttach"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Permissions",
              "url": "\/alpha\/cs.exe?func=ll&objAction=Permissions&objId=65801&id=65801&nexturl=",
              "children": {},
              "signature": "Permissions"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Print",
              "url": "\/alpha\/cs.exe?func=multifile.printmulti&nodeID_list=65801&nexturl=",
              "children": {},
              "signature": "Print"
            }, {
              "name": "Version Control",
              "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=VersionControl&nexturl=",
              "children": {},
              "signature": "VersionControl"
            }, {
              "name": "Zip & Download",
              "url": "\/alpha\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=65801&nexturl=",
              "children": {},
              "signature": "ZipDwnld"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Delete",
              "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=delete&nexturl=",
              "children": {},
              "signature": "Delete"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Properties",
              "url": "",
              "children": [{
                "children": {},
                "name": "General",
                "signature": "Properties",
                "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=properties&nexturl="
              }, {
                "children": {},
                "name": "Audit",
                "signature": "Audit",
                "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=audit&nexturl="
              }, {
                "children": {},
                "name": "Categories",
                "signature": "InfoCmdCategories",
                "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=attrvaluesedit&version=0&nexturl="
              }, {
                "children": {},
                "name": "Columns",
                "signature": "Columns",
                "url": "\/alpha\/cs.exe?func=ll&objid=65801&objAction=columns&nexturl="
              }, {
                "children": {},
                "name": "Perspectives",
                "signature": "Perspectives",
                "url": "\/alpha\/cs.exe?func=ll&objaction=perspectives&objID=65801&nexturl="
              }, {
                "children": {},
                "name": "Presentation",
                "signature": "Catalog",
                "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=catalog&nexturl="
              }, {
                "children": {},
                "name": "References",
                "signature": "References",
                "url": "\/alpha\/cs.exe?func=ll&objId=65801&objAction=references&nexturl="
              }],
              "signature": "PropertiesMenu"
            }]
          }, {
            "volume_id": -2000,
            "id": 66024,
            "parent_id": 65909,
            "name": "Purchase Order.pdf",
            "type": 144,
            "description": null,
            "create_date": "2015-03-03T06:57:14",
            "modify_date": "2015-03-30T09:23:28",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/alphasupport\/webdoc\/apppdf.gif",
            "mime_type": "application\/pdf",
            "original_id": 0,
            "wnd_owner": 64039,
            "wnd_createdby": 64039,
            "wnd_createdate": "2015-03-03T06:57:14",
            "wnd_modifiedby": 1000,
            "wnd_version": 1,
            "wnf_readydate": null,
            "type_name": "Document",
            "container": false,
            "size": 18585,
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
                "menu": "api\/v1\/nodes\/66024\/actions",
                "name": "api\/v1\/nodes\/66024\/content?action=open",
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
                  "name": "Purchase Order.pdf",
                  "parameters": {"mime_type": "application\/pdf"},
                  "tab_href": ""
                },
                "type": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "icon",
                  "display_href": "",
                  "handler": "",
                  "image": "\/alphasupport\/webdoc\/doc.gif",
                  "method": "",
                  "name": "Document",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null,
            "size_formatted": "19 KB",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/66024",
            "parent_id_url": "\/v1\/nodes\/65909",
            "actions": [{
              "name": "Download",
              "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=download",
              "children": {},
              "signature": "Download"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add Version",
              "url": "\/alpha\/cs.exe?func=doc.AddVersion&nodeid=66024&nexturl=",
              "children": {},
              "signature": "AddVersion"
            }, {
              "name": "Rename",
              "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=rename&nexturl=",
              "children": {},
              "signature": "Rename"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add to Favorites",
              "url": "\/alpha\/cs.exe?func=ll&objid=66024&objaction=MakeFavorite&nexturl=",
              "children": {},
              "signature": "MakeFavorite"
            }, {
              "name": "Copy",
              "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=copy&nexturl=",
              "children": {},
              "signature": "Copy"
            }, {
              "name": "Make Generation",
              "url": "\/alpha\/cs.exe?func=ll&objType=2&objAction=Create&sourceID=66024&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateGeneration"
            }, {
              "name": "Make Shortcut",
              "url": "\/alpha\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=66024&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateAlias"
            }, {
              "name": "Move",
              "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=move&nexturl=",
              "children": {},
              "signature": "Move"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Set Notification",
              "url": "\/alpha\/cs.exe?func=notify.specificnode&Nodeid=66024&VolumeID=-2000&Subtype=144&Name=Purchase%20Order%2Epdf&nexturl=",
              "children": {},
              "signature": "SetNotification"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Make News",
              "url": "\/alpha\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=66024&nexturl=",
              "children": {},
              "signature": "CreateNewsAndAttach"
            }, {
              "name": "Rate It",
              "url": "\/alpha\/cs.exe?func=ll&objid=66024&objAction=Ratings",
              "children": {},
              "signature": "RateIt"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Permissions",
              "url": "\/alpha\/cs.exe?func=ll&objAction=Permissions&objId=66024&id=66024&nexturl=",
              "children": {},
              "signature": "Permissions"
            }, {
              "name": "Reserve",
              "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=reservedoc&nexturl=",
              "children": {},
              "signature": "ReserveDoc"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Overview",
              "url": "\/alpha\/cs.exe?func=ll&objaction=overview&objid=66024",
              "children": {},
              "signature": "Overview"
            }, {
              "name": "Print",
              "url": "\/alpha\/cs.exe?func=multifile.printmulti&nodeID_list=66024&nexturl=",
              "children": {},
              "signature": "Print"
            }, {
              "name": "Zip & Download",
              "url": "\/alpha\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=66024&nexturl=",
              "children": {},
              "signature": "ZipDwnld"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Find Similar",
              "url": "\/alpha\/cs.exe?func=OTCIndex.FindSimilarURL&DataID=66024&VersionNum=1",
              "children": {},
              "signature": "OTCIndexResultFindSimilar"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Delete",
              "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=delete&nexturl=",
              "children": {},
              "signature": "Delete"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Properties",
              "url": "",
              "children": [{
                "children": {},
                "name": "General",
                "signature": "Properties",
                "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=properties&nexturl="
              }, {
                "children": {},
                "name": "Specific",
                "signature": "Info",
                "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=info&nexturl="
              }, {
                "children": {},
                "name": "Audit",
                "signature": "Audit",
                "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=audit&nexturl="
              }, {
                "children": {},
                "name": "Categories",
                "signature": "InfoCmdCategories",
                "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=attrvaluesedit&version=1&nexturl="
              }, {
                "children": {},
                "name": "Ratings",
                "signature": "Ratings",
                "url": "\/alpha\/cs.exe?func=ll&objid=66024&objAction=Ratings"
              }, {
                "children": {},
                "name": "References",
                "signature": "References",
                "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=references&nexturl="
              }, {
                "children": {},
                "name": "Versions",
                "signature": "Versions",
                "url": "\/alpha\/cs.exe?func=ll&objId=66024&objAction=versions&nexturl="
              }],
              "signature": "PropertiesMenu"
            }]
          }, {
            "volume_id": -2000,
            "id": 67339,
            "parent_id": 65909,
            "name": "Tasks for Iteration 7",
            "type": 204,
            "description": null,
            "create_date": "2015-03-04T04:05:43",
            "modify_date": "2015-03-04T04:06:48",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/alphasupport\/task\/16tasklist.gif",
            "mime_type": null,
            "original_id": 0,
            "wnd_owner": 1000,
            "wnd_createdby": 1000,
            "wnd_createdate": "2015-03-04T04:05:43",
            "wnd_modifiedby": 1000,
            "wnd_version": null,
            "wnf_readydate": null,
            "type_name": "Task List",
            "container": false,
            "size": null,
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
                "menu": "api\/v1\/nodes\/67339\/actions",
                "name": "api\/v1\/nodes\/67339\/nodes",
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
                  "handler": "table",
                  "image": "",
                  "method": "GET",
                  "name": "Tasks for Iteration 7",
                  "parameters": {"is_default_action": true},
                  "tab_href": ""
                },
                "type": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "icon",
                  "display_href": "",
                  "handler": "",
                  "image": "\/alphasupport\/task\/16tasklist.gif",
                  "method": "",
                  "name": "Task List",
                  "parameters": {},
                  "tab_href": ""
                }
              }
            },
            "menu": null,
            "size_formatted": "",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/67339",
            "parent_id_url": "\/v1\/nodes\/65909",
            "actions": [{
              "name": "Open",
              "url": "\/alpha\/cs.exe?func=ll&objId=67339&objAction=BrowseTaskList",
              "children": {},
              "signature": "BrowseTaskList"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Edit Items",
              "url": "\/alpha\/cs.exe?func=ll&objId=67339&objAction=EditItems&nexturl=",
              "children": {},
              "signature": "EditItems"
            }, {
              "name": "Rename",
              "url": "\/alpha\/cs.exe?func=ll&objId=67339&objAction=rename&nexturl=",
              "children": {},
              "signature": "Rename"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Add to Favorites",
              "url": "\/alpha\/cs.exe?func=ll&objid=67339&objaction=MakeFavorite&nexturl=",
              "children": {},
              "signature": "MakeFavorite"
            }, {
              "name": "Make Shortcut",
              "url": "\/alpha\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=67339&parentID=65909&nexturl=",
              "children": {},
              "signature": "CreateAlias"
            }, {
              "name": "Move",
              "url": "\/alpha\/cs.exe?func=ll&objId=67339&objAction=move&nexturl=",
              "children": {},
              "signature": "Move"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Set Notification",
              "url": "\/alpha\/cs.exe?func=notify.specificnode&Nodeid=67339&VolumeID=-2000&Subtype=204&Name=Tasks%20for%20Iteration%207&nexturl=",
              "children": {},
              "signature": "SetNotification"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Make News",
              "url": "\/alpha\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=67339&nexturl=",
              "children": {},
              "signature": "CreateNewsAndAttach"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Permissions",
              "url": "\/alpha\/cs.exe?func=ll&objAction=Permissions&objId=67339&id=67339&nexturl=",
              "children": {},
              "signature": "Permissions"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Delete",
              "url": "\/alpha\/cs.exe?func=ll&objId=67339&objAction=delete&nexturl=",
              "children": {},
              "signature": "Delete"
            }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
              "name": "Properties",
              "url": "",
              "children": [{
                "children": {},
                "name": "General",
                "signature": "Properties",
                "url": "\/alpha\/cs.exe?func=ll&objId=67339&objAction=properties&nexturl="
              }, {
                "children": {},
                "name": "Audit",
                "signature": "Audit",
                "url": "\/alpha\/cs.exe?func=ll&objId=67339&objAction=audit&nexturl="
              }, {
                "children": {},
                "name": "Categories",
                "signature": "InfoCmdCategories",
                "url": "\/alpha\/cs.exe?func=ll&objId=67339&objAction=attrvaluesedit&version=0&nexturl="
              }, {
                "children": {},
                "name": "References",
                "signature": "References",
                "url": "\/alpha\/cs.exe?func=ll&objId=67339&objAction=references&nexturl="
              }],
              "signature": "PropertiesMenu"
            }]
          }],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "description": {
              "align": "left",
              "name": "Description",
              "persona": "",
              "type": -1,
              "width_weight": 100
            },
            "icon": {
              "align": "center",
              "name": "Icon",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "id": {"align": "left", "name": "ID", "persona": "node", "type": 2, "width_weight": 0},
            "mime_type": {
              "align": "left",
              "name": "MIME Type",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "modify_date": {
              "align": "left",
              "name": "Modified",
              "persona": "",
              "sort": true,
              "type": -7,
              "width_weight": 0
            },
            "name": {
              "align": "left",
              "name": "Name",
              "persona": "",
              "sort": true,
              "type": -1,
              "width_weight": 100
            },
            "original_id": {
              "align": "left",
              "name": "Original ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "parent_id": {
              "align": "left",
              "name": "Parent ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "reserved": {
              "align": "center",
              "name": "Reserve",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "reserved_date": {
              "align": "center",
              "name": "Reserved",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
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
            "type": {
              "align": "center",
              "name": "Type",
              "persona": "",
              "sort": true,
              "type": 2,
              "width_weight": 0
            },
            "volume_id": {
              "align": "left",
              "name": "VolumeID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            }
          },
          "definitions_map": {"name": ["menu"]},
          "definitions_order": ["type", "name", "size_formatted", "modify_date"],
          "limit": 20,
          "page": 1,
          "page_total": 1,
          "range_max": 9,
          "range_min": 1,
          "sort": "asc_name",
          "total_count": 9,
          "where_facet": [],
          "where_name": "",
          "where_type": []
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
