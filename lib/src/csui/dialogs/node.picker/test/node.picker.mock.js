/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/jquery.mockjax',
  'json!./jsons/action.results.json',
  'json!./jsons/node.results.json',
  'json!./jsons/nodes.results.data.json',
  'json!./jsons/volume.results.json',
  'json!./jsons/category.node.result.json',
  'json!./jsons/category.results.json'
], function ($, _, mockjax, actionResults, nodeResult, nodesData, volumeResults,
    categoryNodeResult, categoryResults) {
  'use strict';

  window.csui.require.config({
    config: {
      'csui/dialogs/node.picker/impl/command.type': {
        addable_types: {899: [899, 480, 146]}
      }
    }
  });

  var DataManager = function DataManager() { };

  DataManager.test1 = {

    enable: function () {

      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/5?actions'),
        responseTime: 50,
        status: 400,
        responseText: {'error': 'Sorry, the item you requested could not be accessed. Either it does not exist or you do not have permission to access it. If you were sent a link to this item, please contact the sender for assistance.'}
      });

      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/?]+)' + '(\\?.*)?$'),
        urlParams: ['nodeId'],
        response: function (settings, done) {
          actionResults.results.data.properties.id = parseInt(
              settings.urlParams.nodeId, 10);
          this.responseText = actionResults;
          done();
        }
      });
      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/5/nodes(?:\\?(.*))?$'),
        responseTime: 50,
        status: 400,
        responseText: {'error': 'Sorry, the item you requested could not be accessed. Either it does not exist or you do not have permission to access it. If you were sent a link to this item, please contact the sender for assistance.'}
      });

      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp(
            '^//server/otcs/cs/api/v1/nodes/([^/?]+)' + '/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId'],
        response: function (settings, done) {
          if (settings.urlParams.nodeId === '2004') {
            this.responseText = categoryResults;
          }
          else {
            this.responseText = nodesData;
          }
          done();
        }
      });

      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/(.*)/ancestors$'),
        responseTime: 50,
        responseText: DataManager.ancestors(2000)
      });
      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/5204/ancestors'),
        responseTime: 50,
        responseText: DataManager.ancestors(5204)
      });
      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/2241/ancestors'),
        responseTime: 50,
        responseText: DataManager.ancestors(2241)
      });
      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/1/ancestors'),
        responseTime: 50,
        responseText: DataManager.ancestors(1)
      });
      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/3/ancestors'),
        responseTime: 50,
        responseText: DataManager.ancestors(3)
      });
      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/5/ancestors'),
        responseTime: 50,
        responseText: DataManager.ancestors(3)
      });
      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/7/ancestors'),
        responseTime: 50,
        responseText: DataManager.ancestors(7)
      });

      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: DataManager.memberData(2, 2)
      });

      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v2/members/targets(\\?.*)?'),
        responseTime: 50,
        responseText: DataManager.memberData(3, 3)
      });

      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/volumes/([^/?]+)' + '(\\?.*)?$'),
        urlParams: ['volumeType', 'nodeIdOrType'],
        response: function (settings, done) {
          var results = volumeResults;
          volumeResults.type = volumeResults.data.type = volumeResults.data.volume_id.type = settings.urlParams.volumeType;

          if (settings.urlParams.volumeType === '133') {
            results = categoryNodeResult;
          }
          this.responseText = results;
          done();
        }
      });

      mockjax({
        name: 'dialogs/node.picker/test/node.picker.mock',
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/?]+)' + '(\\?.*)?$'),
        urlParams: ['nodeId'],
        response: function (settings, done) {
          actionResults.results.data.properties.id = settings.urlParams.nodeId;
          this.responseText = actionResults;
          done();
        }
      });
    },

    disable: function () {
      mockjax.clear();
    }

  };

  DataManager.test2 = {

      enable: function () {
        mockjax({
          name: 'dialogs/node.picker/test/node.picker.mock',
          url: '//server/otcs/cs/api/v1/nodes/2000/nodes?extra=false&actions=false&expand=node&limit=30&page=1',
          responseTime: 0,
          status: 200,
          responseText: {}
        });
        mockjax({
          url: new RegExp('//server/otcs/cs/api/v1/volumes/(.*)$'),
          responseTime: 0,
          status: 200,
          responseText: {}
        });

        mockjax({
          url: new RegExp('//server/otcs/cs/api/v1/nodes/(.*)/ancestors$'),
          responseTime: 0,
          status: 200,
          responseText: { "ancestors": [{ "name": "Enterprise Workspace", "volume_id": -2000, "parent_id": -1, "type": 141, "id": 2000, "type_name": "Enterprise Workspace" }, { "name": "007 Hyderabad", "volume_id": -2000, "parent_id": 2000, "type": 0, "id": 604999, "type_name": "Folder" }, { "name": "00000 pk folder", "volume_id": -2000, "parent_id": 604999, "type": 0, "id": 14405715, "type_name": "Folder" }, { "name": "Shortcut Test", "volume_id": -2000, "parent_id": 14405715, "type": 0, "id": 16707863, "type_name": "Folder" }] }
        });
        mockjax({
          url: new RegExp('//server/otcs/cs/api/v2/nodes/(.*)\?expand=properties(.*)$'),
          responseTime: 0,
          status: 200,
          responseText: { "links": { "data": { "self": { "body": "", "content_type": "", "href": "\/api\/v2\/nodes\/16707863?actions=addclassifications&actions=sharecsobjects&actions=revokeshare&actions=manageshareinfo&actions=releaseshare&actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=editactivex&actions=editofficeonline&actions=rename&actions=move&actions=permissions&actions=properties&actions=reserve&actions=unreserve&actions=collectioncancollect&actions=removefromcollection&actions=comment&actions=physobjrequest&actions=physobjborrow&actions=physobjacknowledge&actions=physobjpickup&actions=physobjcancelrequested&actions=finalizerecord&actions=applyhold&actions=assignxref&actions=addrmclassifications&actions=followup&actions=addreminder&actions=setasdefaultpage&actions=unsetasdefaultpage&actions=initiateworkflow&actions=initiatedocumentworkflow&expand=properties{original_id}&fields=columns&fields=properties&fields=versions{mime_type}.element(0)&metadata", "method": "GET", "name": "" } } }, "results": { "actions": { "data": { "addcategory": { "body": "", "content_type": "", "form_href": "", "href": "\/api\/v2\/nodes\/16707863\/categories", "method": "POST", "name": "Add Category" }, "AddReminder": { "body": "", "content_type": "", "form_href": "", "href": "", "method": "GET", "name": "Reminder" }, "AddRMClassifications": { "body": "{\u0022displayPrompt\u0022:true,\u0022enabled\u0022:true,\u0022inheritfrom\u0022:true,\u0022managed\u0022:true}", "content_type": "application\/x-www-form-urlencoded", "form_href": "", "href": "\/api\/v2\/nodes\/16707863\/rmclassifications", "method": "POST", "name": "Add RM Classification" }, "ApplyHold": { "body": "", "content_type": "application\/x-www-form-urlencoded", "form_href": "", "href": "", "method": "", "name": "Apply Hold" }, "AssignXRef": { "body": "", "content_type": "application\/x-www-form-urlencoded", "form_href": "", "href": "", "method": "", "name": "Assign Cross-Reference" }, "comment": { "body": "", "content_type": "", "form_href": "", "href": "", "method": "POST", "name": "Comments" }, "copy": { "body": "", "content_type": "", "form_href": "\/api\/v2\/forms\/nodes\/copy?id=16707863", "href": "\/api\/v2\/nodes", "method": "POST", "name": "Copy" }, "delete": { "body": "", "content_type": "", "form_href": "", "href": "\/api\/v2\/nodes\/16707863", "method": "DELETE", "name": "Delete" }, "move": { "body": "", "content_type": "", "form_href": "\/api\/v2\/forms\/nodes\/move?id=16707863", "href": "\/api\/v2\/nodes\/16707863", "method": "PUT", "name": "Move" }, "open": { "body": "", "content_type": "", "form_href": "", "href": "\/api\/v2\/nodes\/16707863\/nodes", "method": "GET", "name": "Open" }, "permissions": { "body": "", "content_type": "", "form_href": "", "href": "", "method": "", "name": "Permissions" }, "properties": { "body": "", "content_type": "", "form_href": "", "href": "\/api\/v2\/nodes\/16707863", "method": "GET", "name": "Properties" }, "rename": { "body": "", "content_type": "", "form_href": "\/api\/v2\/forms\/nodes\/rename?id=16707863", "href": "\/api\/v2\/nodes\/16707863", "method": "PUT", "name": "Rename" } }, "map": { "default_action": "open", "more": ["properties"] }, "order": ["open", "addcategory", "rename", "copy", "move", "AddReminder", "permissions", "AddRMClassifications", "ApplyHold", "AssignXRef", "delete", "comment"] }, "data": { "columns": [{ "data_type": 906, "key": "type", "name": "Type", "sort_key": "x61031" }, { "data_type": 906, "key": "name", "name": "Name", "sort_key": "x61028" }, { "data_type": 906, "key": "size_formatted", "name": "Size", "sort_key": "x61029" }, { "data_type": 906, "key": "modify_date", "name": "Modified", "sort_key": "x61027" }, { "data_type": 2, "key": "wnd_comments", "name": "Comments" }], "properties": { "container": true, "container_size": 3, "create_date": "2018-08-08T04:06:12Z", "create_user_id": 1000, "description": "", "description_multilingual": { "de_DE": "", "en": "", "ja": "" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "id": 16707863, "mime_type": null, "modify_date": "2018-08-10T10:38:15Z", "modify_user_id": 1000, "name": "Shortcut Test", "name_multilingual": { "de_DE": "", "en": "Shortcut Test", "ja": "" }, "owner": "Admin", "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": 14405715, "permissions_model": "advanced", "reserved": false, "reserved_date": null, "reserved_shared_collaboration": false, "reserved_user_id": 0, "size": 3, "size_formatted": "3 Items", "type": 0, "type_name": "Folder", "versions_control_advanced": false, "volume_id": -2000, "wnd_comments": null } }, "metadata": { "properties": { "container": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "container", "key_value_pairs": false, "multi_value": false, "name": "Container", "persona": "", "read_only": true, "required": false, "type": 5, "type_name": "Boolean", "valid_values": [], "valid_values_name": [] }, "container_size": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "container_size", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "Container Size", "persona": "", "read_only": true, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] }, "create_date": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "include_time": true, "key": "create_date", "key_value_pairs": false, "multi_value": false, "name": "Created", "persona": "", "read_only": true, "required": false, "type": -7, "type_name": "Date", "valid_values": [], "valid_values_name": [] }, "create_user_id": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "create_user_id", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "Created By", "persona": "user", "read_only": false, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] }, "description": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "description", "key_value_pairs": false, "max_length": null, "min_length": null, "multi_value": false, "multiline": true, "multilingual": true, "name": "Description", "password": false, "persona": "", "read_only": false, "regex": "", "required": false, "type": -1, "type_name": "String", "valid_values": [], "valid_values_name": [] }, "external_create_date": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "include_time": true, "key": "external_create_date", "key_value_pairs": false, "multi_value": false, "name": "External Create Date", "persona": "", "read_only": true, "required": false, "type": -7, "type_name": "Date", "valid_values": [], "valid_values_name": [] }, "external_identity": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "external_identity", "key_value_pairs": false, "max_length": null, "min_length": null, "multi_value": false, "multiline": false, "multilingual": false, "name": "External Identity", "password": false, "persona": "", "read_only": true, "regex": "", "required": false, "type": -1, "type_name": "String", "valid_values": [], "valid_values_name": [] }, "external_identity_type": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "external_identity_type", "key_value_pairs": false, "max_length": null, "min_length": null, "multi_value": false, "multiline": false, "multilingual": false, "name": "External Identity Type", "password": false, "persona": "", "read_only": true, "regex": "", "required": false, "type": -1, "type_name": "String", "valid_values": [], "valid_values_name": [] }, "external_modify_date": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "include_time": true, "key": "external_modify_date", "key_value_pairs": false, "multi_value": false, "name": "External Modify Date", "persona": "", "read_only": true, "required": false, "type": -7, "type_name": "Date", "valid_values": [], "valid_values_name": [] }, "external_source": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "external_source", "key_value_pairs": false, "max_length": null, "min_length": null, "multi_value": false, "multiline": false, "multilingual": false, "name": "External Source", "password": false, "persona": "", "read_only": true, "regex": "", "required": false, "type": -1, "type_name": "String", "valid_values": [], "valid_values_name": [] }, "favorite": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "favorite", "key_value_pairs": false, "multi_value": false, "name": "Favorite", "persona": "", "read_only": true, "required": false, "type": 5, "type_name": "Boolean", "valid_values": [], "valid_values_name": [] }, "id": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "id", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "ID", "persona": "node", "read_only": false, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] }, "modify_date": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "include_time": true, "key": "modify_date", "key_value_pairs": false, "multi_value": false, "name": "Modified", "persona": "", "read_only": true, "required": false, "type": -7, "type_name": "Date", "valid_values": [], "valid_values_name": [] }, "modify_user_id": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "modify_user_id", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "Modified By", "persona": "user", "read_only": false, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] }, "name": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "name", "key_value_pairs": false, "max_length": null, "min_length": null, "multi_value": false, "multiline": false, "multilingual": true, "name": "Name", "password": false, "persona": "", "read_only": false, "regex": "", "required": false, "type": -1, "type_name": "String", "valid_values": [], "valid_values_name": [] }, "owner": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "owner", "key_value_pairs": false, "max_length": null, "min_length": null, "multi_value": false, "multiline": false, "multilingual": false, "name": "Owner", "password": false, "persona": "", "read_only": true, "regex": "", "required": false, "type": -1, "type_name": "String", "valid_values": [], "valid_values_name": [] }, "owner_group_id": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "owner_group_id", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "Owned By", "persona": "group", "read_only": false, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] }, "owner_user_id": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "owner_user_id", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "Owned By", "persona": "user", "read_only": false, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] }, "parent_id": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "parent_id", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "Parent ID", "persona": "node", "read_only": false, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] }, "reserved": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "reserved", "key_value_pairs": false, "multi_value": false, "name": "Reserved", "persona": "", "read_only": false, "required": false, "type": 5, "type_name": "Boolean", "valid_values": [], "valid_values_name": [] }, "reserved_date": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "include_time": true, "key": "reserved_date", "key_value_pairs": false, "multi_value": false, "name": "Reserved", "persona": "", "read_only": false, "required": false, "type": -7, "type_name": "Date", "valid_values": [], "valid_values_name": [] }, "reserved_user_id": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "reserved_user_id", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "Reserved By", "persona": "member", "read_only": false, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] }, "type": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "type", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "Type", "persona": "", "read_only": true, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] }, "type_name": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "type_name", "key_value_pairs": false, "max_length": null, "min_length": null, "multi_value": false, "multiline": false, "multilingual": false, "name": "Type", "password": false, "persona": "", "read_only": true, "regex": "", "required": false, "type": -1, "type_name": "String", "valid_values": [], "valid_values_name": [] }, "versions_control_advanced": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "versions_control_advanced", "key_value_pairs": false, "multi_value": false, "name": "Versions Control Advanced", "persona": "", "read_only": false, "required": false, "type": 5, "type_name": "Boolean", "valid_values": [], "valid_values_name": [] }, "volume_id": { "allow_undefined": false, "bulk_shared": false, "default_value": null, "description": null, "hidden": false, "key": "volume_id", "key_value_pairs": false, "max_value": null, "min_value": null, "multi_value": false, "name": "VolumeID", "persona": "node", "read_only": false, "required": false, "type": 2, "type_name": "Integer", "valid_values": [], "valid_values_name": [] } } }, "metadata_map": {}, "metadata_order": { "properties": ["id", "type", "type_name", "name", "description", "parent_id", "volume_id", "create_date", "create_user_id", "modify_date", "modify_user_id", "owner_user_id", "owner_group_id", "reserved", "reserved_date", "reserved_user_id", "versions_control_advanced", "container", "container_size", "favorite", "external_create_date", "external_modify_date", "external_source", "external_identity", "external_identity_type", "owner"] }, "perspective": { "canEditPerspective": true, "options": { "rows": [{ "columns": [{ "heights": { "xs": "full" }, "sizes": { "md": 12 }, "widget": { "options": {}, "type": "nodestable" } }] }] }, "type": "grid" } } }
        });
        mockjax({
          url: new RegExp('//server/otcs/cs/api/v1/nodes/(.*)/nodes\\?extra=(.*)$'),
          responseTime: 0,
          status: 200,
          responseText: { "data": [{ "volume_id": { "container": true, "container_size": 69, "create_date": "2003-10-01T13:30:55", "create_user_id": 1000, "description": "Test", "description_multilingual": { "de_DE": "", "en": "", "ja": "Test" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "guid": null, "icon": "\/alphasupport\/webdoc\/icon_library.gif", "icon_large": "\/alphasupport\/webdoc\/icon_library_large.gif", "id": 2000, "modify_date": "2018-08-13T20:06:41", "modify_user_id": 1000, "name": "Enterprise Workspace", "name_multilingual": { "de_DE": "Enterprise", "en": "Enterprise Workspace", "ja": "" }, "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": -1, "reserved": false, "reserved_date": null, "reserved_user_id": 0, "type": 141, "type_name": "Enterprise Workspace", "versions_control_advanced": false, "volume_id": -2000 }, "id": 16707313, "parent_id": { "container": true, "container_size": 3, "create_date": "2018-08-07T18:06:12", "create_user_id": 1000, "description": "", "description_multilingual": { "de_DE": "", "en": "", "ja": "" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "guid": null, "icon": "\/alphasupport\/webdoc\/folder.gif", "icon_large": "\/alphasupport\/webdoc\/folder_large.gif", "id": 16707863, "modify_date": "2018-08-10T00:38:15", "modify_user_id": 1000, "name": "Shortcut Test", "name_multilingual": { "de_DE": "", "en": "Shortcut Test", "ja": "" }, "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": 14405715, "reserved": false, "reserved_date": null, "reserved_user_id": 0, "type": 0, "type_name": "Folder", "versions_control_advanced": false, "volume_id": -2000 }, "user_id": 1000, "name": "Short 100\u0027s 10", "type": 1, "description": null, "create_date": "2018-08-07T18:10:39", "create_user_id": 1000, "modify_date": "2018-08-10T00:38:15", "modify_user_id": 1000, "reserved": false, "reserved_user_id": 0, "reserved_date": null, "icon": "\/alphasupport\/webdoc\/folder.gif", "mime_type": null, "original_id": { "container": true, "container_size": 2, "create_date": "2017-08-11T14:35:11", "create_user_id": 1000, "description": "", "description_multilingual": { "de_DE": "", "en": "", "ja": "" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "guid": null, "icon": "\/alphasupport\/webdoc\/folder.gif", "icon_large": "\/alphasupport\/webdoc\/folder_large.gif", "id": 8232460, "modify_date": "2018-08-01T00:49:17", "modify_user_id": 1000, "name": "10", "name_multilingual": { "de_DE": "", "en": "10", "ja": "" }, "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": 8230344, "reserved": false, "reserved_date": null, "reserved_user_id": 0, "type": 0, "type_name": "Folder", "versions_control_advanced": false, "volume_id": -2000 }, "wnd_comments": null, "type_name": "Shortcut", "container": false, "size": null, "perm_see": true, "perm_see_contents": true, "perm_modify": true, "perm_modify_attributes": true, "perm_modify_permissions": true, "perm_create": true, "perm_delete": true, "perm_delete_versions": true, "perm_reserve": true, "perm_add_major_version": true, "favorite": false, "wnd_owner": 1000, "wnd_createdby": 1000, "wnd_createdate": "2018-08-07T18:10:39", "wnd_modifiedby": 1000, "size_formatted": "", "reserved_user_login": null, "action_url": "\/v1\/actions\/16707313", "parent_id_url": "\/v1\/nodes\/16707863", "commands": { "copy": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/copy?id=16707313", "method": "", "name": "Copy" }, "delete": { "body": "", "content_type": "", "href": "api\/v1\/nodes\/16707313", "href_form": "", "method": "DELETE", "name": "Delete" }, "move": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/move?id=16707313", "method": "", "name": "Move" }, "properties": { "body": "", "content_type": "", "href": "", "href_form": "", "method": "", "name": "Properties" }, "properties_audit": { "body": "", "content_type": "", "href": "api\/v1\/nodes\/16707313\/audit?limit=1000", "href_form": "", "method": "GET", "name": "Audit" }, "properties_categories": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/categories\/update?id=16707313&category_id=520012", "method": "", "name": "Categories" }, "properties_general": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/properties\/general?id=16707313", "method": "", "name": "General" }, "properties_specific": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/properties\/specific?id=16707313", "method": "", "name": "Specific" }, "rename": { "body": "", "content_type": "", "href": "", "href_form": "\/api\/v1\/forms\/nodes\/rename?id=16707313", "method": "", "name": "Rename" } }, "commands_map": { "properties": ["properties_general", "properties_specific", "properties_audit", "properties_categories"] }, "commands_order": ["rename", "copy", "move", "delete", "properties"], "wnf_att_690t_4_formatted": null, "wnd_att_690t_3_formatted": null, "wnf_att_690t_5_formatted": null, "wnd_att_690t_6_formatted": null, "wnf_att_690t_7_formatted": null, "wnd_comments_formatted": null }, { "volume_id": { "container": true, "container_size": 69, "create_date": "2003-10-01T13:30:55", "create_user_id": 1000, "description": "Test", "description_multilingual": { "de_DE": "", "en": "", "ja": "Test" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "guid": null, "icon": "\/alphasupport\/webdoc\/icon_library.gif", "icon_large": "\/alphasupport\/webdoc\/icon_library_large.gif", "id": 2000, "modify_date": "2018-08-13T20:06:41", "modify_user_id": 1000, "name": "Enterprise Workspace", "name_multilingual": { "de_DE": "Enterprise", "en": "Enterprise Workspace", "ja": "" }, "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": -1, "reserved": false, "reserved_date": null, "reserved_user_id": 0, "type": 141, "type_name": "Enterprise Workspace", "versions_control_advanced": false, "volume_id": -2000 }, "id": 16708083, "parent_id": { "container": true, "container_size": 3, "create_date": "2018-08-07T18:06:12", "create_user_id": 1000, "description": "", "description_multilingual": { "de_DE": "", "en": "", "ja": "" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "guid": null, "icon": "\/alphasupport\/webdoc\/folder.gif", "icon_large": "\/alphasupport\/webdoc\/folder_large.gif", "id": 16707863, "modify_date": "2018-08-10T00:38:15", "modify_user_id": 1000, "name": "Shortcut Test", "name_multilingual": { "de_DE": "", "en": "Shortcut Test", "ja": "" }, "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": 14405715, "reserved": false, "reserved_date": null, "reserved_user_id": 0, "type": 0, "type_name": "Folder", "versions_control_advanced": false, "volume_id": -2000 }, "user_id": 1000, "name": "Short f1", "type": 1, "description": null, "create_date": "2018-08-07T18:08:26", "create_user_id": 1000, "modify_date": "2018-08-12T19:26:56", "modify_user_id": 1000, "reserved": false, "reserved_user_id": 0, "reserved_date": null, "icon": "\/alphasupport\/webdoc\/folder.gif", "mime_type": null, "original_id": { "container": true, "container_size": 17, "create_date": "2018-05-11T00:18:01", "create_user_id": 1000, "description": "", "description_multilingual": { "de_DE": "", "en": "", "ja": "" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "guid": null, "icon": "\/alphasupport\/webdoc\/folder.gif", "icon_large": "\/alphasupport\/webdoc\/folder_large.gif", "id": 14681051, "modify_date": "2018-08-10T00:38:14", "modify_user_id": 1000, "name": "f1", "name_multilingual": { "de_DE": "", "en": "f1", "ja": "" }, "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": 14405715, "reserved": false, "reserved_date": null, "reserved_user_id": 0, "type": 0, "type_name": "Folder", "versions_control_advanced": false, "volume_id": -2000 }, "wnd_comments": null, "type_name": "Shortcut", "container": false, "size": null, "perm_see": true, "perm_see_contents": true, "perm_modify": true, "perm_modify_attributes": true, "perm_modify_permissions": true, "perm_create": true, "perm_delete": true, "perm_delete_versions": true, "perm_reserve": true, "perm_add_major_version": true, "favorite": false, "wnd_owner": 1000, "wnd_createdby": 1000, "wnd_createdate": "2018-08-07T18:08:26", "wnd_modifiedby": 1000, "size_formatted": "", "reserved_user_login": null, "action_url": "\/v1\/actions\/16708083", "parent_id_url": "\/v1\/nodes\/16707863", "commands": { "copy": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/copy?id=16708083", "method": "", "name": "Copy" }, "delete": { "body": "", "content_type": "", "href": "api\/v1\/nodes\/16708083", "href_form": "", "method": "DELETE", "name": "Delete" }, "move": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/move?id=16708083", "method": "", "name": "Move" }, "properties": { "body": "", "content_type": "", "href": "", "href_form": "", "method": "", "name": "Properties" }, "properties_audit": { "body": "", "content_type": "", "href": "api\/v1\/nodes\/16708083\/audit?limit=1000", "href_form": "", "method": "GET", "name": "Audit" }, "properties_categories": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/categories\/update?id=16708083&category_id=520012", "method": "", "name": "Categories" }, "properties_general": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/properties\/general?id=16708083", "method": "", "name": "General" }, "properties_specific": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/properties\/specific?id=16708083", "method": "", "name": "Specific" }, "rename": { "body": "", "content_type": "", "href": "", "href_form": "\/api\/v1\/forms\/nodes\/rename?id=16708083", "method": "", "name": "Rename" } }, "commands_map": { "properties": ["properties_general", "properties_specific", "properties_audit", "properties_categories"] }, "commands_order": ["rename", "copy", "move", "delete", "properties"], "wnf_att_690t_4_formatted": null, "wnd_att_690t_3_formatted": null, "wnf_att_690t_5_formatted": null, "wnd_att_690t_6_formatted": null, "wnf_att_690t_7_formatted": null, "wnd_comments_formatted": null }, { "volume_id": { "container": true, "container_size": 69, "create_date": "2003-10-01T13:30:55", "create_user_id": 1000, "description": "Test", "description_multilingual": { "de_DE": "", "en": "", "ja": "Test" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "guid": null, "icon": "\/alphasupport\/webdoc\/icon_library.gif", "icon_large": "\/alphasupport\/webdoc\/icon_library_large.gif", "id": 2000, "modify_date": "2018-08-13T20:06:41", "modify_user_id": 1000, "name": "Enterprise Workspace", "name_multilingual": { "de_DE": "Enterprise", "en": "Enterprise Workspace", "ja": "" }, "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": -1, "reserved": false, "reserved_date": null, "reserved_user_id": 0, "type": 141, "type_name": "Enterprise Workspace", "versions_control_advanced": false, "volume_id": -2000 }, "id": 16707650, "parent_id": { "container": true, "container_size": 3, "create_date": "2018-08-07T18:06:12", "create_user_id": 1000, "description": "", "description_multilingual": { "de_DE": "", "en": "", "ja": "" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "guid": null, "icon": "\/alphasupport\/webdoc\/folder.gif", "icon_large": "\/alphasupport\/webdoc\/folder_large.gif", "id": 16707863, "modify_date": "2018-08-10T00:38:15", "modify_user_id": 1000, "name": "Shortcut Test", "name_multilingual": { "de_DE": "", "en": "Shortcut Test", "ja": "" }, "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": 14405715, "reserved": false, "reserved_date": null, "reserved_user_id": 0, "type": 0, "type_name": "Folder", "versions_control_advanced": false, "volume_id": -2000 }, "user_id": 1000, "name": "Collection - Shortcuts holder", "type": 298, "description": null, "create_date": "2018-08-07T18:19:36", "create_user_id": 1000, "modify_date": "2018-08-12T19:26:57", "modify_user_id": 1000, "reserved": false, "reserved_user_id": 0, "reserved_date": null, "icon": "\/alphasupport\/collections\/collection.gif", "mime_type": null, "original_id": 0, "wnd_comments": null, "type_name": "Collection", "container": true, "size": 1, "perm_see": true, "perm_see_contents": true, "perm_modify": true, "perm_modify_attributes": true, "perm_modify_permissions": true, "perm_create": true, "perm_delete": true, "perm_delete_versions": true, "perm_reserve": true, "perm_add_major_version": true, "favorite": false, "wnd_owner": 1000, "wnd_createdby": 1000, "wnd_createdate": "2018-08-07T18:19:36", "wnd_modifiedby": 1000, "size_formatted": "1 Item", "reserved_user_login": null, "action_url": "\/v1\/actions\/16707650", "parent_id_url": "\/v1\/nodes\/16707863", "commands": { "copy": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/copy?id=16707650", "method": "", "name": "Copy" }, "default": { "body": "", "content_type": "", "href": "api\/v1\/nodes\/16707650\/nodes", "href_form": "", "method": "GET", "name": "Open" }, "delete": { "body": "", "content_type": "", "href": "api\/v1\/nodes\/16707650", "href_form": "", "method": "DELETE", "name": "Delete" }, "move": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/move?id=16707650", "method": "", "name": "Move" }, "properties": { "body": "", "content_type": "", "href": "", "href_form": "", "method": "", "name": "Properties" }, "properties_audit": { "body": "", "content_type": "", "href": "api\/v1\/nodes\/16707650\/audit?limit=1000", "href_form": "", "method": "GET", "name": "Audit" }, "properties_categories": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/categories\/update?id=16707650&category_id=520012", "method": "", "name": "Categories" }, "properties_general": { "body": "", "content_type": "", "href": "", "href_form": "api\/v1\/forms\/nodes\/properties\/general?id=16707650", "method": "", "name": "General" }, "rename": { "body": "", "content_type": "", "href": "", "href_form": "\/api\/v1\/forms\/nodes\/rename?id=16707650", "method": "", "name": "Rename" } }, "commands_map": { "properties": ["properties_general", "properties_audit", "properties_categories"] }, "commands_order": ["default", "rename", "copy", "move", "delete", "properties"], "wnf_att_690t_4_formatted": null, "wnd_att_690t_3_formatted": null, "wnf_att_690t_5_formatted": null, "wnd_att_690t_6_formatted": null, "wnf_att_690t_7_formatted": null, "wnd_comments_formatted": null }], "definitions": { "create_date": { "align": "center", "name": "Created", "persona": "", "type": -7, "width_weight": 0 }, "create_user_id": { "align": "left", "name": "Created By", "persona": "user", "type": 2, "width_weight": 0 }, "description": { "align": "left", "name": "Description", "persona": "", "type": -1, "width_weight": 100 }, "favorite": { "align": "center", "name": "Favorite", "persona": "", "type": 5, "width_weight": 0 }, "icon": { "align": "center", "name": "Icon", "persona": "", "type": -1, "width_weight": 0 }, "id": { "align": "left", "name": "ID", "persona": "node", "type": 2, "width_weight": 0 }, "mime_type": { "align": "left", "name": "MIME Type", "persona": "", "type": -1, "width_weight": 0 }, "modify_date": { "align": "left", "name": "Modified", "persona": "", "sort": true, "type": -7, "width_weight": 0 }, "modify_user_id": { "align": "left", "name": "Modified By", "persona": "user", "type": 2, "width_weight": 0 }, "name": { "align": "left", "name": "Name", "persona": "", "sort": true, "type": -1, "width_weight": 100 }, "original_id": { "align": "left", "name": "Original ID", "persona": "node", "type": 2, "width_weight": 0 }, "parent_id": { "align": "left", "name": "Parent ID", "persona": "node", "type": 2, "width_weight": 0 }, "reserved": { "align": "center", "name": "Reserve", "persona": "", "type": 5, "width_weight": 0 }, "reserved_date": { "align": "center", "name": "Reserved", "persona": "", "type": -7, "width_weight": 0 }, "reserved_user_id": { "align": "center", "name": "Reserved By", "persona": "member", "type": 2, "width_weight": 0 }, "size": { "align": "right", "name": "Size", "persona": "", "sort": true, "sort_key": "size", "type": 2, "width_weight": 0 }, "size_formatted": { "align": "right", "name": "Size", "persona": "", "sort": true, "sort_key": "size", "type": 2, "width_weight": 0 }, "type": { "align": "center", "name": "Type", "persona": "", "sort": true, "type": 2, "width_weight": 0 }, "volume_id": { "align": "left", "name": "VolumeID", "persona": "node", "type": 2, "width_weight": 0 }, "wnd_comments": { "align": "center", "name": "Comments", "sort": false, "type": 2, "width_weight": 1 } }, "definitions_map": { "name": ["menu"] }, "definitions_order": ["type", "name", "size_formatted", "modify_date", "wnd_comments"], "limit": 30, "page": 1, "page_total": 1, "range_max": 3, "range_min": 1, "sort": "asc_type", "total_count": 3, "where_facet": [], "where_name": "", "where_type": [] }
        });
        mockjax({
          url: new RegExp('//server/otcs/cs/api/v2/nodes/(.*)\?fields=properties'),
          responseTime: 0,
          status: 200,
          responseText: { "links": { "data": { "self": { "body": "", "content_type": "", "href": "\/api\/v2\/nodes\/8232460?fields=properties", "method": "GET", "name": "" } } }, "results": { "data": { "properties": { "container": true, "container_size": 2, "create_date": "2017-08-12T00:35:11Z", "create_user_id": 1000, "description": "", "description_multilingual": { "de_DE": "", "en": "", "ja": "" }, "external_create_date": null, "external_identity": "", "external_identity_type": "", "external_modify_date": null, "external_source": "", "favorite": false, "id": 8232460, "mime_type": null, "modify_date": "2018-08-01T10:49:17Z", "modify_user_id": 1000, "name": "10", "name_multilingual": { "de_DE": "", "en": "10", "ja": "" }, "owner": "Admin", "owner_group_id": 1001, "owner_user_id": 1000, "parent_id": 8230344, "permissions_model": "advanced", "reserved": false, "reserved_date": null, "reserved_shared_collaboration": false, "reserved_user_id": 0, "size": 2, "size_formatted": "2 Items", "type": 0, "type_name": "Folder", "versions_control_advanced": false, "volume_id": -2000, "wnd_comments": null } } } }
        });
      },

      disable: function () {
        mockjax.clear();
      }

    };

    DataManager.nodeData = function (id, size, parentId) {
      var responseText = nodeResult;
      responseText.data.id = id;
      responseText.data.container_size = size;
      responseText.data.parent_id = parentId;
      return responseText;
    };

    DataManager.memberData = function (numNonBrowse, numBrowse) {
      var responseText = {
        'links': {
          'self': {
            'body': '',
            'content_type': '',
            'href': '\/api\/v2\/members\/favorites?metadata&fields=properties&fields=versions.element(0)',
            'method': 'GET',
            'name': ''
          }
        }, 'results': []
      };

      for (var i = 0; i < numBrowse; i++) {
        var resultWithBrowse = {
          'actions': {
            'audit-list': {
              'body': '',
              'content_type': '',
              'form_href': '',
              'href': '\/api\/v1\/nodes\/2241\/audit?limit=1000',
              'method': 'GET',
              'name': 'Audit'
            },
            browse: {
              body: '',
              content_type: '',
              form_href: '',
              href: '/api/v1/nodes/2241/nodes',
              method: 'GET',
              name: 'Browse'
            },
            'copy': {
              'body': '',
              'content_type': '',
              'form_href': '\/api\/v1\/forms\/nodes\/copy?id=2241',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Copy'
            },
            'create_0': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=0',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Folder'
            },
            'create_1': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=1',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Shortcut'
            },
            'create_136': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=136',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Compound Document'
            },
            'create_140': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=140',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'URL'
            },
            'create_144': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=144',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Document'
            },
            'delete': {
              'body': '',
              'content_type': '',
              'form_href': '',
              'href': '\/api\/v1\/nodes\/2241',
              'method': 'DELETE',
              'name': 'Delete'
            },
            'more': {
              'body': '',
              'content_type': '',
              'form_href': '',
              'href': '',
              'method': '',
              'name': '...'
            },
            'move': {
              'body': '',
              'content_type': '',
              'form_href': '\/api\/v1\/forms\/nodes\/move?id=2241',
              'href': '\/api\/v1\/nodes\/2241',
              'method': 'PUT',
              'name': 'Move'
            },
            'properties': {
              'body': '',
              'content_type': '',
              'form_href': '',
              'href': '\/api\/v1\/nodes\/2241',
              'method': 'GET',
              'name': 'Properties'
            }
          },
          'actions_map': {
            'create': ['create_0', 'create_144', 'create_136', 'create_1',
              'create_140'],
            'default_action': 'browse',
            'more': ['properties', 'audit-list']
          },
          'actions_order': ['browse', 'copy', 'move', 'delete', 'more'],
          'data': {
            'properties': {
              'container': true,
              'container_size': 6,
              'create_date': '2003-10-01T13:49:06',
              'create_user_id': 1000,
              'description': '',
              'description_multilingual': { 'en': '', 'ja': '' },
              'favorite': true,
              'guid': null,
              'icon': '\/alphasupport\/webdoc\/folder.gif',
              'icon_large': '\/alphasupport\/webdoc\/folder_large.gif',
              'id': 2241,
              'modify_date': '2015-05-26T15:22:03',
              'modify_user_id': 1000,
              'name': 'Filter Documents and',
              'name_multilingual': { 'en': 'Filter Documents and', 'ja': '' },
              'owner_group_id': 1001,
              'owner_user_id': 1000,
              'parent_id': 2000,
              'reserved': false,
              'reserved_date': null,
              'reserved_user_id': 0,
              'type': 0,
              'type_name': 'Folder',
              'versions_control_advanced': false,
              'volume_id': -2000
            }
          },
          'metadata': {
            'properties': {
              'container': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'container',
                'multi_value': false,
                'name': 'Container',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': 5,
                'type_name': 'Boolean',
                'valid_values': [],
                'valid_values_name': []
              },
              'container_size': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'container_size',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Container Size',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'create_date': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'include_time': true,
                'key': 'create_date',
                'multi_value': false,
                'name': 'Created',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': -7,
                'type_name': 'Date',
                'valid_values': [],
                'valid_values_name': []
              },
              'create_user_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'create_user_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Created By',
                'persona': 'user',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'description': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'description',
                'max_length': null,
                'min_length': null,
                'multiline': true,
                'multilingual': true,
                'multi_value': false,
                'name': 'Description',
                'password': false,
                'persona': '',
                'read_only': false,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'favorite': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'favorite',
                'multi_value': false,
                'name': 'Favorite',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': 5,
                'type_name': 'Boolean',
                'valid_values': [],
                'valid_values_name': []
              },
              'guid': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'guid',
                'multi_value': false,
                'name': 'GUID',
                'persona': '',
                'read_only': false,
                'required': false,
                'type': -95,
                'type_name': 'GUID',
                'valid_values': [],
                'valid_values_name': []
              },
              'icon': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'icon',
                'max_length': null,
                'min_length': null,
                'multiline': false,
                'multilingual': false,
                'multi_value': false,
                'name': 'Icon',
                'password': false,
                'persona': '',
                'read_only': false,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'icon_large': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'icon_large',
                'max_length': null,
                'min_length': null,
                'multiline': false,
                'multilingual': false,
                'multi_value': false,
                'name': 'Large Icon',
                'password': false,
                'persona': '',
                'read_only': false,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'ID',
                'persona': 'node',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'modify_date': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'include_time': true,
                'key': 'modify_date',
                'multi_value': false,
                'name': 'Modified',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': -7,
                'type_name': 'Date',
                'valid_values': [],
                'valid_values_name': []
              },
              'modify_user_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'modify_user_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Modified By',
                'persona': 'user',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'name': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'name',
                'max_length': null,
                'min_length': null,
                'multiline': false,
                'multilingual': true,
                'multi_value': false,
                'name': 'Name',
                'password': false,
                'persona': '',
                'read_only': false,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'owner_group_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'owner_group_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Owned By',
                'persona': 'group',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'owner_user_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'owner_user_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Owned By',
                'persona': 'user',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'parent_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'parent_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Parent ID',
                'persona': 'node',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'reserved': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'reserved',
                'multi_value': false,
                'name': 'Reserved',
                'persona': '',
                'read_only': false,
                'required': false,
                'type': 5,
                'type_name': 'Boolean',
                'valid_values': [],
                'valid_values_name': []
              },
              'reserved_date': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'include_time': true,
                'key': 'reserved_date',
                'multi_value': false,
                'name': 'Reserved',
                'persona': '',
                'read_only': false,
                'required': false,
                'type': -7,
                'type_name': 'Date',
                'valid_values': [],
                'valid_values_name': []
              },
              'reserved_user_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'reserved_user_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Reserved By',
                'persona': 'member',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'type': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'type',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Type',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'type_name': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'type_name',
                'max_length': null,
                'min_length': null,
                'multiline': false,
                'multilingual': false,
                'multi_value': false,
                'name': 'Type',
                'password': false,
                'persona': '',
                'read_only': true,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'versions_control_advanced': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'versions_control_advanced',
                'multi_value': false,
                'name': 'Versions Control Advanced',
                'persona': '',
                'read_only': false,
                'required': false,
                'type': 5,
                'type_name': 'Boolean',
                'valid_values': [],
                'valid_values_name': []
              },
              'volume_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'volume_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'VolumeID',
                'persona': 'node',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              }
            }
          },
          'metadata_map': { 'properties': {} },
          'metadata_order': {
            'properties': ['id', 'type', 'type_name', 'name', 'description',
              'parent_id',
              'volume_id', 'guid', 'create_date', 'create_user_id',
              'modify_date',
              'modify_user_id', 'owner_user_id', 'owner_group_id',
              'reserved', 'reserved_date',
              'reserved_user_id', 'icon', 'icon_large',
              'versions_control_advanced', 'container',
              'container_size', 'favorite']
          }
        };
        if (i === 1) {
          resultWithBrowse.data.properties.id = 5204;
        }
        responseText.results.push(resultWithBrowse);
      }

      for (i = 0; i < numNonBrowse; i++) {
        var resultWithoutBrowse = {
          'actions': {
            'audit-list': {
              'body': '',
              'content_type': '',
              'form_href': '',
              'href': '\/api\/v1\/nodes\/2241\/audit?limit=1000',
              'method': 'GET',
              'name': 'Audit'
            },
            'copy': {
              'body': '',
              'content_type': '',
              'form_href': '\/api\/v1\/forms\/nodes\/copy?id=2241',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Copy'
            },
            'create_0': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=0',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Folder'
            },
            'create_1': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=1',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Shortcut'
            },
            'create_136': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=136',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Compound Document'
            },
            'create_140': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=140',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'URL'
            },
            'create_144': {
              'body': '',
              'content_type': 'application\/x-www-form-urlencoded',
              'form_href': '\/api\/v1\/forms\/nodes\/create?parent_id=2241&type=144',
              'href': '\/api\/v1\/nodes',
              'method': 'POST',
              'name': 'Document'
            },
            'delete': {
              'body': '',
              'content_type': '',
              'form_href': '',
              'href': '\/api\/v1\/nodes\/2241',
              'method': 'DELETE',
              'name': 'Delete'
            },
            'more': {
              'body': '',
              'content_type': '',
              'form_href': '',
              'href': '',
              'method': '',
              'name': '...'
            },
            'move': {
              'body': '',
              'content_type': '',
              'form_href': '\/api\/v1\/forms\/nodes\/move?id=2241',
              'href': '\/api\/v1\/nodes\/2241',
              'method': 'PUT',
              'name': 'Move'
            },
            'properties': {
              'body': '',
              'content_type': '',
              'form_href': '',
              'href': '\/api\/v1\/nodes\/2241',
              'method': 'GET',
              'name': 'Properties'
            }
          },
          'actions_map': {
            'create': ['create_0', 'create_144', 'create_136', 'create_1',
              'create_140'],
            'default_action': 'browse',
            'more': ['properties', 'audit-list']
          },
          'actions_order': ['browse', 'copy', 'move', 'delete', 'more'],
          'data': {
            'properties': {
              'container': true,
              'container_size': 6,
              'create_date': '2003-10-01T13:49:06',
              'create_user_id': 1000,
              'description': '',
              'description_multilingual': { 'en': '', 'ja': '' },
              'favorite': true,
              'guid': null,
              'icon': '\/alphasupport\/webdoc\/folder.gif',
              'icon_large': '\/alphasupport\/webdoc\/folder_large.gif',
              'id': 2241,
              'modify_date': '2015-05-26T15:22:03',
              'modify_user_id': 1000,
              'name': 'Filter Documents and',
              'name_multilingual': { 'en': 'Filter Documents and', 'ja': '' },
              'owner_group_id': 1001,
              'owner_user_id': 1000,
              'parent_id': 2000,
              'reserved': false,
              'reserved_date': null,
              'reserved_user_id': 0,
              'type': 0,
              'type_name': 'Folder',
              'versions_control_advanced': false,
              'volume_id': -2000
            }
          },
          'metadata': {
            'properties': {
              'container': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'container',
                'multi_value': false,
                'name': 'Container',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': 5,
                'type_name': 'Boolean',
                'valid_values': [],
                'valid_values_name': []
              },
              'container_size': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'container_size',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Container Size',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'create_date': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'include_time': true,
                'key': 'create_date',
                'multi_value': false,
                'name': 'Created',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': -7,
                'type_name': 'Date',
                'valid_values': [],
                'valid_values_name': []
              },
              'create_user_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'create_user_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Created By',
                'persona': 'user',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'description': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'description',
                'max_length': null,
                'min_length': null,
                'multiline': true,
                'multilingual': true,
                'multi_value': false,
                'name': 'Description',
                'password': false,
                'persona': '',
                'read_only': false,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'favorite': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'favorite',
                'multi_value': false,
                'name': 'Favorite',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': 5,
                'type_name': 'Boolean',
                'valid_values': [],
                'valid_values_name': []
              },
              'guid': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'guid',
                'multi_value': false,
                'name': 'GUID',
                'persona': '',
                'read_only': false,
                'required': false,
                'type': -95,
                'type_name': 'GUID',
                'valid_values': [],
                'valid_values_name': []
              },
              'icon': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'icon',
                'max_length': null,
                'min_length': null,
                'multiline': false,
                'multilingual': false,
                'multi_value': false,
                'name': 'Icon',
                'password': false,
                'persona': '',
                'read_only': false,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'icon_large': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'icon_large',
                'max_length': null,
                'min_length': null,
                'multiline': false,
                'multilingual': false,
                'multi_value': false,
                'name': 'Large Icon',
                'password': false,
                'persona': '',
                'read_only': false,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'ID',
                'persona': 'node',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'modify_date': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'include_time': true,
                'key': 'modify_date',
                'multi_value': false,
                'name': 'Modified',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': -7,
                'type_name': 'Date',
                'valid_values': [],
                'valid_values_name': []
              },
              'modify_user_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'modify_user_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Modified By',
                'persona': 'user',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'name': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'name',
                'max_length': null,
                'min_length': null,
                'multiline': false,
                'multilingual': true,
                'multi_value': false,
                'name': 'Name',
                'password': false,
                'persona': '',
                'read_only': false,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'owner_group_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'owner_group_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Owned By',
                'persona': 'group',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'owner_user_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'owner_user_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Owned By',
                'persona': 'user',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'parent_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'parent_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Parent ID',
                'persona': 'node',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'reserved': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'reserved',
                'multi_value': false,
                'name': 'Reserved',
                'persona': '',
                'read_only': false,
                'required': false,
                'type': 5,
                'type_name': 'Boolean',
                'valid_values': [],
                'valid_values_name': []
              },
              'reserved_date': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'include_time': true,
                'key': 'reserved_date',
                'multi_value': false,
                'name': 'Reserved',
                'persona': '',
                'read_only': false,
                'required': false,
                'type': -7,
                'type_name': 'Date',
                'valid_values': [],
                'valid_values_name': []
              },
              'reserved_user_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'reserved_user_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Reserved By',
                'persona': 'member',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'type': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'type',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'Type',
                'persona': '',
                'read_only': true,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              },
              'type_name': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'type_name',
                'max_length': null,
                'min_length': null,
                'multiline': false,
                'multilingual': false,
                'multi_value': false,
                'name': 'Type',
                'password': false,
                'persona': '',
                'read_only': true,
                'regex': '',
                'required': false,
                'type': -1,
                'type_name': 'String',
                'valid_values': [],
                'valid_values_name': []
              },
              'versions_control_advanced': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'versions_control_advanced',
                'multi_value': false,
                'name': 'Versions Control Advanced',
                'persona': '',
                'read_only': false,
                'required': false,
                'type': 5,
                'type_name': 'Boolean',
                'valid_values': [],
                'valid_values_name': []
              },
              'volume_id': {
                'allow_undefined': false,
                'bulk_shared': false,
                'default_value': null,
                'description': null,
                'hidden': false,
                'key': 'volume_id',
                'max_value': null,
                'min_value': null,
                'multi_value': false,
                'name': 'VolumeID',
                'persona': 'node',
                'read_only': false,
                'required': false,
                'type': 2,
                'type_name': 'Integer',
                'valid_values': [],
                'valid_values_name': []
              }
            }
          },
          'metadata_map': { 'properties': {} },
          'metadata_order': {
            'properties': ['id', 'type', 'type_name', 'name', 'description',
              'parent_id',
              'volume_id', 'guid', 'create_date', 'create_user_id',
              'modify_date',
              'modify_user_id', 'owner_user_id', 'owner_group_id',
              'reserved', 'reserved_date',
              'reserved_user_id', 'icon', 'icon_large',
              'versions_control_advanced', 'container',
              'container_size', 'favorite']
          }
        };
        resultWithoutBrowse.data.properties.id = 2000;
        responseText.results.push(resultWithoutBrowse);
      }

      return responseText;
    };

    DataManager.nodesData = function (numItems, id) {
      var responseText = {
        'data': [],
        'definitions': {
          'create_date': {
            'align': 'center',
            'name': 'Created',
            'persona': '',
            'type': -7,
            'width_weight': 0
          },
          'description': {
            'align': 'left',
            'name': 'Description',
            'persona': '',
            'type': -1,
            'width_weight': 100
          },
          'icon': {
            'align': 'center',
            'name': 'Icon',
            'persona': '',
            'type': -1,
            'width_weight': 0
          },
          'id': {
            'align': 'left',
            'name': 'ID',
            'persona': 'node',
            'type': 2,
            'width_weight': 0
          },
          'mime_type': {
            'align': 'left',
            'name': 'MIME Type',
            'persona': '',
            'type': -1,
            'width_weight': 0
          },
          'modify_date': {
            'align': 'left',
            'name': 'Modified',
            'persona': '',
            'sort': true,
            'type': -7,
            'width_weight': 0
          },
          'name': {
            'align': 'left',
            'name': 'Name',
            'persona': '',
            'sort': true,
            'type': -1,
            'width_weight': 100
          },
          'original_id': {
            'align': 'left',
            'name': 'Original ID',
            'persona': 'node',
            'type': 2,
            'width_weight': 0
          },
          'parent_id': {
            'align': 'left',
            'name': 'Parent ID',
            'persona': 'node',
            'type': 2,
            'width_weight': 0
          },
          'reserved': {
            'align': 'center',
            'name': 'Reserve',
            'persona': '',
            'type': 5,
            'width_weight': 0
          },
          'reserved_date': {
            'align': 'center',
            'name': 'Reserved',
            'persona': '',
            'type': -7,
            'width_weight': 0
          },
          'reserved_user_id': {
            'align': 'center',
            'name': 'Reserved By',
            'persona': 'member',
            'type': 2,
            'width_weight': 0
          },
          'size': {
            'align': 'right',
            'name': 'Size',
            'persona': '',
            'sort': true,
            'sort_key': 'size',
            'type': 2,
            'width_weight': 0
          },
          'size_formatted': {
            'align': 'right',
            'name': 'Size',
            'persona': '',
            'sort': true,
            'sort_key': 'size',
            'type': 2,
            'width_weight': 0
          },
          'type': {
            'align': 'center',
            'name': 'Type',
            'persona': '',
            'sort': true,
            'type': 2,
            'width_weight': 0
          },
          'volume_id': {
            'align': 'left',
            'name': 'VolumeID',
            'persona': 'node',
            'type': 2,
            'width_weight': 0
          }
        },
        'definitions_map': { 'name': ['menu'] },
        'definitions_order': ['type', 'name', 'size_formatted', 'modify_date'],
        'limit': 30,
        'page': 1,
        'page_total': 12,
        'range_max': 30,
        'range_min': 1,
        'sort': 'asc_name',
        'total_count': 1200,
        'where_facet': [],
        'where_name': '',
        'where_type': []
      };

      var actionsWithBrowse = [{
        name: 'Open',
        signature: 'Browse',
        url: '/otcs/cs?func=ll&objId=156435&objAction=browse'
      }],
        actionsWithoutBrowser = [];

    for (var i = 1; i <= numItems; i++) {
      var data = {};
      data.id = i;
      data.parent_id_url = '\/v1\/nodes\/' + id;
      data.type = 0;
      data.mime_type = null;

      if (i === 1) {
        data.type = 899;
      }

      if ((i % 2) !== 0) {
        data.type_name = 'Folder';
        data.actions = actionsWithBrowse;
        data.container = true;
        }
        else {
          data.type_name = 'Category';
          data.type = 131;
          data.actions = actionsWithoutBrowser;
          data.container = false;
        }
        _.defaults(data, nodesData);
        responseText.data.push(data);
      }

    return responseText;
    };

    DataManager.ancestors = function (id) {
      var responseText = {
        'ancestors': [
          {
            id: 5,
            name: 'Folder5',
            parent_id: -1,
            type: 0,
            type_name: 'Folder',
            volume_id: -2000
          },
          {
            id: 1,
            name: 'Folder1',
            parent_id: 5,
            type: 0,
            type_name: 'Folder',
            volume_id: -2000
          },
          {
            id: 3,
            name: 'Folder1',
            parent_id: 1,
            type: 0,
            type_name: 'Folder',
            volume_id: -2000
          },
          {
            id: 7,
            name: 'Folder1',
            parent_id: 3,
            type: 0,
            type_name: 'Folder',
            volume_id: -2000
          }
        ]
      };

      return responseText;

    };

    return DataManager;
  });
