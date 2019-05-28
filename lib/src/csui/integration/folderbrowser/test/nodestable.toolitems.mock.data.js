/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/jquery.mockjax', 'csui/lib/underscore',
  'json!./nodestable.toolitems.result.json'
], function ($, mockjax, _, nodeResults) {
  'use strict';

  var DataManager = function DataManager() {},
      test1Mocks = [];

  DataManager.test = {
    enable: function () {
      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions(?:\\?(.*))?$'),
        urlParams: ['query'],
        responseText: {}          // TODO: check
      }));

      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/101(?:\\?(.*))?$'),
        urlParams: ['query'],
        responseText: DataManager.nodeData(101, 1)
      }));

      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/101/addablenodetypes(?:\\?(.*))?$'),
        urlParams: ['query'],
        responseText: {
          data: {},
          definitions: {}
        }
      }));

      test1Mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/101/facets',
        responseText: {
          facets: {}
        }
      }));

      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/101/facets(?:\\?(.*))?$'),
        urlParams: ['query'],
        responseText: {
          facets: {}
        }
      }));

      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth(?:\\?(.*))?$'),
        urlParams: ['query'],
        responseText: {
          data: {}
        }
      }));

      test1Mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/101/ancestors', responseTime: 50,
        responseText: {
          "ancestors": [{
            "volume_id": -2000,
            "id": 2000,
            "parent_id": -1,
            "name": "Enterprise",
            "type": 141,
            "type_name": "Enterprise Workspace"
          }, {
            "volume_id": -2000,
            "id": 37474,
            "parent_id": 2000,
            "name": "Items22",
            "type": 0,
            "type_name": "Folder"
          }, {
            "volume_id": -2000,
            "id": 103298,
            "parent_id": 37474,
            "name": "SecondTear",
            "type": 0,
            "type_name": "Folder"
          }, {
            "volume_id": -2000,
            "id": 103299,
            "parent_id": 103298,
            "name": "ThirdTear",
            "type": 0,
            "type_name": "Folder"
          }, {
            "volume_id": -2000,
            "id": 103408,
            "parent_id": 103299,
            "name": "forthTear",
            "type": 0,
            "type_name": "Folder"
          }]
        }
      }));

      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/101/nodes(.*)$'),
        responseTime: 50,
        responseText: DataManager.nodesData('v2', 1, 20, 1, 101)
      }));

      test1Mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/103/facets',
        responseText: {
          facets: {}
        }
      }));


      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/103409/addablenodetypes(?:\\?(.*))?$'),
        urlParams: ['query'],
        responseText: {
          data: {},
          definitions: {}
        }
      }));

      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/103409(?:\\?(.*))?$'),
        responseTime: 50,
        responseText: DataManager.nodesData('v1', 1, 20, 1, 103409)
      }));

      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/103409/nodes(.*)$'),
        responseTime: 50,
        responseText: DataManager.nodesData('v2', 1, 20, 1, 103409)
      }));

      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/103409/facets(?:\\?(.*))?$'),
        urlParams: ['query'],
        responseText: {
          facets: {}
        }
      }));

      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
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

  DataManager.nodeData = function (id, size) {
    var responseText = nodeResults;
    responseText.results.data.properties.id = id;
    responseText.results.data.properties.container_size = size;
    return responseText;
  };

  DataManager.nodesData = function (apiVersion, numItems, pgSize, pgTotal, id) {
    var responseText = {
      "data": [{
        "volume_id": {
          "container": true,
          "container_size": 3,
          "create_date": "2015-04-05T09:44:09",
          "create_user_id": 1000,
          "description": "",
          "description_multilingual": {"en_CA": ""},
          "favorite": false,
          "guid": null,
          "icon": "\/img_0428\/webdoc\/icon_library.gif",
          "icon_large": "\/img_0428\/webdoc\/icon_library_large.gif",
          "id": 2000,
          "modify_date": "2015-04-22T16:02:05",
          "modify_user_id": 1000,
          "name": "Enterprise",
          "name_multilingual": {"en_CA": "Enterprise"},
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
        "id": 103409,
        "parent_id": {
          "container": true,
          "container_size": 1,
          "create_date": "2015-05-03T19:00:36",
          "create_user_id": 1000,
          "description": "",
          "description_multilingual": {"en_CA": ""},
          "favorite": false,
          "guid": null,
          "icon": "\/img_0428\/webdoc\/folder.gif",
          "icon_large": "\/img_0428\/webdoc\/folder_large.gif",
          "id": 103408,
          "modify_date": "2015-05-03T19:01:04",
          "modify_user_id": 1000,
          "name": "forthTear",
          "name_multilingual": {"en_CA": "forthTear"},
          "owner_group_id": 1001,
          "owner_user_id": 1000,
          "parent_id": 103299,
          "reserved": false,
          "reserved_date": null,
          "reserved_user_id": 0,
          "type": 0,
          "type_name": "Folder",
          "versions_control_advanced": false,
          "volume_id": -2000
        },
        "name": "fifth",
        "type": 0,
        "description": "",
        "create_date": "2015-05-03T19:01:04",
        "modify_date": "2015-05-03T19:01:51",
        "reserved": false,
        "reserved_user_id": 0,
        "reserved_date": null,
        "icon": "\/img_0428\/webdoc\/folder.gif",
        "mime_type": null,
        "original_id": 0,
        "wnd_owner": 1000,
        "wnd_createdby": 1000,
        "wnd_createdate": "2015-05-03T19:01:04",
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
            "menu": "api\/v1\/nodes\/103409\/actions",
            "name": "api\/v1\/nodes\/103409\/nodes",
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
              "name": "fifth",
              "parameters": {"is_default_action": true},
              "tab_href": ""
            },
            "type": {
              "body": "",
              "content_type": "",
              "display_hint": "icon",
              "display_href": "",
              "handler": "",
              "image": "\/img_0428\/webdoc\/folder.gif",
              "method": "",
              "name": "Folder",
              "parameters": {},
              "tab_href": ""
            }
          }
        },
        "menu": null,
        "favorite": false,
        "size_formatted": "0 Items",
        "reserved_user_login": null,
        "action_url": "\/v1\/actions\/103409",
        "parent_id_url": "\/v1\/nodes\/103408",
        "actions": [{
          "name": "Open",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=browse",
          "children": {},
          "signature": "Browse"
        }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
          "name": "Collect Folder",
          "url": "\/OTCS_0428\/cs.exe?func=collections.collectFolder&objId=103409&nexturl=",
          "children": {},
          "signature": "CollectFolder"
        }, {
          "name": "Configure",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=editconfig&nexturl=",
          "children": {},
          "signature": "EditConfig"
        }, {
          "name": "Order Custom Views",
          "url": "\/OTCS_0428\/cs.exe?func=srch.ordercustomviews&objId=103409&nexturl=",
          "children": {},
          "signature": "OrderCustomViews"
        }, {
          "name": "Rename",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=rename&nexturl=",
          "children": {},
          "signature": "Rename"
        }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
          "name": "Add to Favorites",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objid=103409&objaction=MakeFavorite&nexturl=",
          "children": {},
          "signature": "MakeFavorite"
        }, {
          "name": "Copy",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=copy&nexturl=",
          "children": {},
          "signature": "Copy"
        }, {
          "name": "Make Shortcut",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=103409&parentID=103408&nexturl=",
          "children": {},
          "signature": "CreateAlias"
        }, {
          "name": "Move",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=move&nexturl=",
          "children": {},
          "signature": "Move"
        }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
          "name": "Set Notification",
          "url": "\/OTCS_0428\/cs.exe?func=notify.specificnode&Nodeid=103409&VolumeID=-2000&Subtype=0&Name=fifth&nexturl=",
          "children": {},
          "signature": "SetNotification"
        }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
          "name": "Make News",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=103409&nexturl=",
          "children": {},
          "signature": "CreateNewsAndAttach"
        }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
          "name": "Permissions",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objAction=Permissions&objId=103409&id=103409&nexturl=",
          "children": {},
          "signature": "Permissions"
        }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
          "name": "Print",
          "url": "\/OTCS_0428\/cs.exe?func=multifile.printmulti&nodeID_list=103409&nexturl=",
          "children": {},
          "signature": "Print"
        }, {
          "name": "Version Control",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=VersionControl&nexturl=",
          "children": {},
          "signature": "VersionControl"
        }, {
          "name": "Zip & Download",
          "url": "\/OTCS_0428\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=103409&nexturl=",
          "children": {},
          "signature": "ZipDwnld"
        }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
          "name": "Delete",
          "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=delete&nexturl=",
          "children": {},
          "signature": "Delete"
        }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
          "name": "Properties",
          "url": "",
          "children": [{
            "children": {},
            "name": "General",
            "signature": "Properties",
            "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=properties&nexturl="
          }, {
            "children": {},
            "name": "Audit",
            "signature": "Audit",
            "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=audit&nexturl="
          }, {
            "children": {},
            "name": "Categories",
            "signature": "InfoCmdCategories",
            "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=attrvaluesedit&version=0&nexturl="
          }, {
            "children": {},
            "name": "Perspectives",
            "signature": "Perspectives",
            "url": "\/OTCS_0428\/cs.exe?func=ll&objaction=perspectives&objID=103409&nexturl="
          }, {
            "children": {},
            "name": "Presentation",
            "signature": "Catalog",
            "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=catalog&nexturl="
          }, {
            "children": {},
            "name": "References",
            "signature": "References",
            "url": "\/OTCS_0428\/cs.exe?func=ll&objId=103409&objAction=references&nexturl="
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
        "favorite": {
          "align": "center",
          "name": "Favorite",
          "persona": "",
          "type": 5,
          "width_weight": 0
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
      "limit": 100,
      "page": 1,
      "page_total": 1,
      "range_max": 1,
      "range_min": 1,
      "sort": "asc_name",
      "total_count": 1,
      "where_facet": [],
      "where_name": "",
      "where_type": []
    };

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
      "parent_id_url": "\/v1\/nodes\/2442",
      "actions": [{
        "name": "Download",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=download",
        "children": {},
        "signature": "Download"
      }, {
        "name": "View as Web Page",
        "url": "\/OTCS_0317\/cs.exe?func=doc.ViewDoc&nodeid=5204",
        "children": {},
        "signature": "ViewDoc"
      }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
        "name": "Add Version",
        "url": "\/OTCS_0317\/cs.exe?func=doc.AddVersion&nodeid=5204&nexturl=",
        "children": {},
        "signature": "AddVersion"
      }, {
        "name": "Edit",
        "url": "\/OTCS_0317\/cs.exe?func=Edit.Edit&reqp=0&nodeid=5204&nexturl=",
        "children": {},
        "signature": "Edit"
      }, {
        "name": "Rename",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=rename&nexturl=",
        "children": {},
        "signature": "Rename"
      }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
        "name": "Add to Favorites",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objid=5204&objaction=MakeFavorite&nexturl=",
        "children": {},
        "signature": "MakeFavorite"
      }, {
        "name": "Copy",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=copy&nexturl=",
        "children": {},
        "signature": "Copy"
      }, {
        "name": "Make Generation",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objType=2&objAction=Create&sourceID=5204&parentID=2442&nexturl=",
        "children": {},
        "signature": "CreateGeneration"
      }, {
        "name": "Make Shortcut",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objType=1&objAction=Create&sourceID=5204&parentID=2442&nexturl=",
        "children": {},
        "signature": "CreateAlias"
      }, {
        "name": "Move",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=move&nexturl=",
        "children": {},
        "signature": "Move"
      }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
        "name": "Set Notification",
        "url": "\/OTCS_0317\/cs.exe?func=notify.specificnode&Nodeid=5204&VolumeID=-2000&Subtype=144&Name=Commitment%20Document%20HTML5viewer%20%2D%20Copy%20%2D%20Copy%20%2D%20Copy%2Edocx&nexturl=",
        "children": {},
        "signature": "SetNotification"
      }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
        "name": "Make News",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objtype=208&objaction=create&createin&attachmentid=5204&nexturl=",
        "children": {},
        "signature": "CreateNewsAndAttach"
      }, {
        "name": "Rate It",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objid=5204&objAction=Ratings",
        "children": {},
        "signature": "RateIt"
      }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
        "name": "Permissions",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objAction=Permissions&objId=5204&id=5204&nexturl=",
        "children": {},
        "signature": "Permissions"
      }, {
        "name": "Reserve",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=reservedoc&nexturl=",
        "children": {},
        "signature": "ReserveDoc"
      }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
        "name": "Overview",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objaction=overview&objid=5204",
        "children": {},
        "signature": "Overview"
      }, {
        "name": "Print",
        "url": "\/OTCS_0317\/cs.exe?func=multifile.printmulti&nodeID_list=5204&nexturl=",
        "children": {},
        "signature": "Print"
      }, {
        "name": "Zip & Download",
        "url": "\/OTCS_0317\/cs.exe?func=multifile.zipdwnldmulti&nodeID_list=5204&nexturl=",
        "children": {},
        "signature": "ZipDwnld"
      }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
        "name": "Find Similar",
        "url": "\/OTCS_0317\/cs.exe?func=OTCIndex.FindSimilarURL&DataID=5204&VersionNum=1",
        "children": {},
        "signature": "OTCIndexResultFindSimilar"
      }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
        "name": "Delete",
        "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=delete&nexturl=",
        "children": {},
        "signature": "Delete"
      }, {"name": "-", "url": "", "children": {}, "signature": "-"}, {
        "name": "Properties",
        "url": "",
        "children": [{
          "children": {},
          "name": "General",
          "signature": "Properties",
          "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=properties&nexturl="
        }, {
          "children": {},
          "name": "Specific",
          "signature": "Info",
          "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=info&nexturl="
        }, {
          "children": {},
          "name": "Audit",
          "signature": "Audit",
          "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=audit&nexturl="
        }, {
          "children": {},
          "name": "Categories",
          "signature": "InfoCmdCategories",
          "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=attrvaluesedit&version=1&nexturl="
        }, {
          "children": {},
          "name": "Ratings",
          "signature": "Ratings",
          "url": "\/OTCS_0317\/cs.exe?func=ll&objid=5204&objAction=Ratings"
        }, {
          "children": {},
          "name": "References",
          "signature": "References",
          "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=references&nexturl="
        }, {
          "children": {},
          "name": "Versions",
          "signature": "Versions",
          "url": "\/OTCS_0317\/cs.exe?func=ll&objId=5204&objAction=versions&nexturl="
        }],
        "signature": "PropertiesMenu"
      }]
    };

    for (var i = 1; i <= pgSize; i++) {
      data.id = i;
      data.parent_id_url = "\/v1\/nodes\/" + id;
      responseText.data.push(data);
    }

    if (apiVersion === 'v1') {
      responseText.limit = pgSize;
      responseText.page_total = pgTotal;
      responseText.range_max = pgSize;
      responseText.total_count = numItems;
    } else {
      responseText = {
        results: responseText.data.map(getV2Node),
        collection: {
          paging: {
            page: 1,
            limit: pgSize,
            total_count: numItems,
            page_total: pgTotal,
            range_min: 1,
            range_max: pgSize,
          },
          sorting: {
            sort: ['asc_name']
          }
        }
      };
    }

    return responseText;

    function getV2Node(node) {
      var columns = [
        {
          "key": "type",
          "name": "Type",
          "data_type": 2,
          "sortable": true
        },
        {
          "key": "name",
          "name": "Name",
          "data_type": -1,
          "sortable": true
        },
        {
          "key": "size",
          "name": "Size",
          "data_type": 2,
          "sortable": true
        }
      ];
      return {
        actions: getNodeActions(node),
        data: {
          columns: node.container && columns,
          properties: node
        },
        metadata: {
          properties: responseText.definitions
        }
      };
    }

    function getNodeActions(node) {
      var actions = {
        "0": [
          "browse"
        ],
        "141": [
          "browse"
        ]
      };
      return _.chain(actions[node.type] || [])
              .reduce(function (result, action) {
                result[action] = {};
                return result;
              }, {})
              .value();
    }
  };

  DataManager.mockData = {
    'id': 101,
    'totalCount': 20,
    pageSize: 20,
    status: 'start'
  };

  return DataManager;
});
