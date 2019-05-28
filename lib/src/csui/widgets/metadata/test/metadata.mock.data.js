/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {
  'use strict';

  _.extend($.mockjaxSettings, {
    responseTime: 0,
    headers: {}
  });

  var enterpriseVolume = {
    "id": 2000,
    "name": "Enterprise",
    "type": 141
  };
  var personalVolume = {
    "id": 2004,
    "name": "Personal",
    "type": 142
  };
  var categoriesVolume = {
    "id": 2006,
    "name": "Categories",
    "type": 133
  };
  var perspectiveAssetsVolume = {
    "id": 2007,
    "name": "Perspective Assets",
    "type": 954
  };

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/members/1000/photo',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 404;
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=109661',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
              {"token": "1000\/182623\/158049\/15589\/7f6f59393680830f4a04677d617abae15a9ae3c3"};
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=11111',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
              {"token": "1000\/182623\/158049\/15589\/7f6f59393680830f4a04677d617abae15a9ae3c3"};
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2006/ancestors',
        responseTime: 0,
        responseText: {
          "ancestors": [{
            "id": 2006,
            "name": "Content Server Categories",
            "volume_id": -2006,
            "parent_id": -1,
            "type": 133,
            "type_name": "Categories Volume"
          }]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2006?fields=properties',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/2006?fields=properties",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "properties": {
                "container": true,
                "container_size": 26,
                "create_date": "2016-12-13T16:03:47",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"en_IN": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 2006,
                "mime_type": null,
                "modify_date": "2017-05-05T16:56:04",
                "modify_user_id": 1000,
                "name": "Content Server Categories",
                "name_multilingual": {"en_IN": "Content Server Categories"},
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": -1,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 26,
                "size_formatted": "26 Items",
                "type": 133,
                "type_name": "Categories Volume",
                "versions_control_advanced": false,
                "volume_id": -2006
              }
            }
          }
        }
      }));
      var childrenOf2006 = {
        "data": [{
          "volume_id": {
            "container": true,
            "container_size": 26,
            "create_date": "2016-12-13T16:03:47",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {"en_IN": ""},
            "external_create_date": null,
            "external_identity": "",
            "external_identity_type": "",
            "external_modify_date": null,
            "external_source": "",
            "favorite": false,
            "guid": null,
            "icon": "\/img\/webattribute\/16vol_categories.gif",
            "icon_large": "\/img\/webattribute\/16vol_categories_large.gif",
            "id": 2006,
            "modify_date": "2017-05-05T16:56:04",
            "modify_user_id": 1000,
            "name": "Content Server Categories",
            "name_multilingual": {"en_IN": "Content Server Categories"},
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 133,
            "type_name": "Categories Volume",
            "versions_control_advanced": false,
            "volume_id": -2006
          },
          "id": 84943,
          "parent_id": {
            "container": true,
            "container_size": 26,
            "create_date": "2016-12-13T16:03:47",
            "create_user_id": 1000,
            "description": "",
            "description_multilingual": {"en_IN": ""},
            "external_create_date": null,
            "external_identity": "",
            "external_identity_type": "",
            "external_modify_date": null,
            "external_source": "",
            "favorite": false,
            "guid": null,
            "icon": "\/img\/webattribute\/16vol_categories.gif",
            "icon_large": "\/img\/webattribute\/16vol_categories_large.gif",
            "id": 2006,
            "modify_date": "2017-05-05T16:56:04",
            "modify_user_id": 1000,
            "name": "Content Server Categories",
            "name_multilingual": {"en_IN": "Content Server Categories"},
            "owner_group_id": 1001,
            "owner_user_id": 1000,
            "parent_id": -1,
            "reserved": false,
            "reserved_date": null,
            "reserved_user_id": 0,
            "type": 133,
            "type_name": "Categories Volume",
            "versions_control_advanced": false,
            "volume_id": -2006
          },
          "name": "Dummy Category",
          "type": 131,
          "description": "",
          "create_date": "2017-04-26T09:45:37",
          "modify_date": "2017-04-26T12:00:04",
          "reserved": false,
          "reserved_user_id": 0,
          "reserved_date": null,
          "icon": "\/img\/webattribute\/16category.gif",
          "mime_type": null,
          "original_id": 0,
          "type_name": "Category",
          "container": false,
          "size": 1474,
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
          "size_formatted": "",
          "reserved_user_login": null,
          "action_url": "\/v1\/actions\/84943",
          "parent_id_url": "\/v1\/nodes\/2006",
          "commands": {
            "copy": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "api\/v1\/forms\/nodes\/copy?id=84943",
              "method": "",
              "name": "Copy"
            },
            "delete": {
              "body": "",
              "content_type": "",
              "href": "api\/v1\/nodes\/84943",
              "href_form": "",
              "method": "DELETE",
              "name": "Delete"
            },
            "move": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "api\/v1\/forms\/nodes\/move?id=84943",
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
              "href": "api\/v1\/nodes\/84943\/audit?limit=1000",
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
            "properties_general": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "api\/v1\/forms\/nodes\/properties\/general?id=84943",
              "method": "",
              "name": "General"
            },
            "rename": {
              "body": "",
              "content_type": "",
              "href": "",
              "href_form": "\/api\/v1\/forms\/nodes\/rename?id=84943",
              "method": "",
              "name": "Rename"
            },
            "reserve": {
              "body": "reserved_user_id=1000",
              "content_type": "application\/x-www-form-urlencoded",
              "href": "api\/v1\/nodes\/84943",
              "href_form": "",
              "method": "PUT",
              "name": "Reserve"
            }
          },
          "commands_map": {
            "properties": ["properties_general", "properties_audit", "properties_categories"]
          },
          "commands_order": ["rename", "copy", "move", "reserve", "delete", "properties"]
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
        "limit": 30,
        "page": 1,
        "page_total": 1,
        "range_max": 26,
        "range_min": 1,
        "sort": "asc_name",
        "total_count": 26,
        "where_facet": [],
        "where_name": "",
        "where_type": [131, -1]
      };
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/2006/nodes(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: childrenOf2006
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2006/nodes(?:\\?(.*))?$'),
        responseTime: 0,
        response: function () {
          var responseText = childrenOf2006;
          if (false) {
          } else {
            responseText = {
              results: responseText.data.map(getV2Node),
              collection: {
                paging: {
                  page: responseText.page,
                  limit: responseText.limit,
                  total_count: responseText.total_count,
                  page_total: responseText.page_total,
                  range_min: responseText.range_min,
                  range_max: responseText.range_max,
                },
                sorting: {
                  sort: [responseText.sort]
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
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v2/nodes/11111\\?expand=(.*)$'),
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/11111?expand=properties%7Boriginal_id%7D&fields=properties&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "addversion": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111\/versions",
                  "method": "POST",
                  "name": "Add Version"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=11111",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "download": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111\/content?download",
                  "method": "GET",
                  "name": "Download"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=11111",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111\/content",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=11111",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "PUT",
                  "name": "Rename"
                },
                "reserve": {
                  "body": "reserved_user_id=1000",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111",
                  "method": "PUT",
                  "name": "Reserve"
                }
              },
              "map": {"default_action": "open", "more": ["properties"]},
              "order": ["open", "download", "addversion", "rename", "copy", "move",
                "reserve", "delete"]
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2017-01-12T11:17:45",
                "create_user_id": 1000,
                "description": "\u4f60\u597d\uff0c\u4e16\u754c",
                "description_multilingual": {"en_IN": "\u4f60\u597d\uff0c\u4e16\u754c"},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": true,
                "id": 11111,
                "mime_type": "application\/pdf",
                "modify_date": "2017-05-15T17:20:16",
                "modify_user_id": 1000,
                "name": "Comparison-Safety.pdf",
                "name_multilingual": {"en_IN": "react basic.pdf"},
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 41381,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 1244967,
                "size_formatted": "2 MB",
                "type": 144,
                "type_name": "Document",
                "versions_control_advanced": false,
                "volume_id": -2000,
                "wnd_comments": 0
              }
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/nodes/(.+)/categories/(.+)/actions$'),
        responseTime: 0,
        responseText: {
          "data":{
            "categories_remove":"api\/v1\/nodes\/24400\/categories\/6390",
            "categories_update":"api\/v1\/forms\/nodes\/categories\/update?id=24400&category_id=6390"
          },
          "definitions":{
            "categories_remove":{
              "body":"",
              "content_type":"",
              "display_hint":"",
              "display_href":"",
              "handler":"",
              "image":"",
              "method":"DELETE",
              "name":"Remove",
              "parameters":{
        
              },
              "tab_href":""
            },
            "categories_update":{
              "body":"",
              "content_type":"",
              "display_hint":"",
              "display_href":"",
              "handler":"form",
              "image":"",
              "method":"GET",
              "name":"Update",
              "parameters":{
        
              },
              "tab_href":""
            }
          },
          "definitions_map":{
        
          },
          "definitions_order":[
            "categories_remove",
            "categories_update"
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/11111/categories/66666/actions',
        responseTime: 0,
        response: function () {
          return {
            "data": {"categories_add": "api\/v1\/forms\/nodes\/categories\/create?id=66666"},
            "definitions": {
              "categories_add": {
                "body": "",
                "content_type": "",
                "display_hint": "",
                "display_href": "",
                "handler": "node_picker_form",
                "image": "",
                "method": "GET",
                "name": "Add Categories",
                "parameters": {},
                "tab_href": ""
              }
            },
            "definitions_map": {},
            "definitions_order": ["categories_add"]
          };
        }

      }));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/nodes/11111/categories/66667/actions',
            responseText: {
              "data": {
                "categories_remove": "api\/v1\/nodes\/11111\/categories\/66667",
                "categories_update": "api\/v1\/forms\/nodes\/categories\/update?id=11111&category_id=66667"
              },
              "definitions": {
                "categories_remove": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "",
                  "display_href": "",
                  "handler": "",
                  "image": "",
                  "method": "DELETE",
                  "name": "Remove",
                  "parameters": {},
                  "tab_href": ""
                },
                "categories_update": {
                  "body": "",
                  "content_type": "",
                  "display_hint": "",
                  "display_href": "",
                  "handler": "form",
                  "image": "",
                  "method": "GET",
                  "name": "Update",
                  "parameters": {},
                  "tab_href": ""
                }
              },
              "definitions_map": {},
              "definitions_order": ["categories_remove", "categories_update"]
            }
          }
      ));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/11111\\?(.*)$'),
        responseTime: 0,
        responseText: {
          data: {
            container: false,
            container_size: 0,
            id: 11111,
            name: "Comparison-Safety.pdf",
            description: "This is a document from mockjax data on the client side.",
            mime_type: 'application/pdf',
            type: 144,
            type_name: "Document"
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/11111/versions\\?(.*)$'),
        responseTime: 0,
        responseText: {
          "data": [
            {
              "create_date": "2016-03-23T23:04:50",
              "description": null,
              "file_create_date": "2016-03-23T23:04:49",
              "file_modify_date": "2016-03-23T23:04:50",
              "file_name": "Comparison-Safety.pdf",
              "file_size": 12345,
              "file_type": "pdf",
              "id": 111112,
              "locked": false,
              "locked_date": null,
              "locked_user_id": null,
              "mime_type": "application/pdf",
              "modify_date": "2016-03-23T23:04:50",
              "name": "Comparison-Safety.pdf",
              "version_id": 111112,
              "version_number": 1,
              "version_number_major": 0,
              "version_number_minor": 1,
              "version_number_name": "1",
              "file_size_formatted": "12 KB",
              "commands": {
                "versions_download": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/577458/versions/1/content?action=download",
                  "href_form": "",
                  "method": "GET",
                  "name": "Download"
                },
                "versions_open": {
                  "body": "",
                  "content_type": "",
                  "href": "api/v1/nodes/577458/versions/1/content?action=open",
                  "href_form": "",
                  "method": "GET",
                  "name": "Open"
                },
                "versions_properties": {
                  "body": "",
                  "content_type": "",
                  "href": "",
                  "href_form": "",
                  "method": "",
                  "name": "Properties"
                }
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/11111/categories(\/(.*))*$'),
        responseTime: 0,
        responseText: {
          data: [
            {
              id: 66666,
              name: "BRFG-Payment"
            },
            {
              id: 66667,
              name: "BC Asset Images"
            },
            {
              id: 66668,
              name: "BC Event Photos"
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/11111/categories/actions',
        responseTime: 0,
        responseText: {
          data: {
            categories_add: "api/v1/forms/nodes/categories/create?id=11111"
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/properties/general?id=11111',
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "name": "Enterprise",
                "description": "",
                "create_date": "2010-10-20T18:31:01",
                "create_user_id": "Admin",
                "type": 141,
                "type_name": "Enterprise Workspace",
                "modify_date": "2015-03-26T15:45:22",
                "owner_user_id": "Admin"
              },
              "options": {
                "fields": {
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Name",
                    "readonly": false,
                    "type": "text"
                  },
                  "description": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Description",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "create_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "create_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created By",
                    "readonly": true,
                    "type": "text"
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "integer"
                  },
                  "type_name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "text"
                  },
                  "modify_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Modified",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "owner_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Owned By",
                    "readonly": true,
                    "type": "text"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes/2000",
                    "method": "PUT"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": false,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "description": {
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "create_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Created",
                    "type": "string"
                  },
                  "create_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Created By",
                    "type": "string"
                  },
                  "type": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "integer"
                  },
                  "type_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "string"
                  },
                  "modify_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Modified",
                    "type": "string"
                  },
                  "owner_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "string"
                  }
                },
                "type": "object"
              }
            }
          ]
        }

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/22222/categories',
        responseTime: 0,
        responseText: {
          data: [
            {
              id: 66666,
              name: "BRFG-Payment"
            },
            {
              id: 66667,
              name: "BC Asset Images"
            },
            {
              id: 66668,
              name: "BC Event Photos"
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/22222/categories/actions',
        responseTime: 0,
        responseText: {
          data: {
            categories_add: "api/v1/forms/nodes/categories/create?id=22222"
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/properties/general?id=22222',
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "name": "Enterprise",
                "description": "",
                "create_date": "2010-10-20T18:31:01",
                "create_user_id": "Admin",
                "type": 141,
                "type_name": "Enterprise Workspace",
                "modify_date": "2015-03-26T15:45:22",
                "owner_user_id": "Admin"
              },
              "options": {
                "fields": {
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Name",
                    "readonly": false,
                    "type": "text"
                  },
                  "description": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Description",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "create_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "create_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created By",
                    "readonly": true,
                    "type": "text"
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "integer"
                  },
                  "type_name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "text"
                  },
                  "modify_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Modified",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "owner_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Owned By",
                    "readonly": true,
                    "type": "text"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes/2000",
                    "method": "PUT"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": false,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "description": {
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "create_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Created",
                    "type": "string"
                  },
                  "create_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Created By",
                    "type": "string"
                  },
                  "type": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "integer"
                  },
                  "type_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "string"
                  },
                  "modify_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Modified",
                    "type": "string"
                  },
                  "owner_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "string"
                  }
                },
                "type": "object"
              }
            }
          ]
        }

      }));

      var categoryForm = {
        "forms": [{
          "data": {
            "186529_2": null,
            "186529_3": null,
            "186529_4": null,
            "186529_5": false
          },
          "options": {
            "fields": {
              "186529_2": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Manual Description",
                "readonly": false,
                "type": "text"
              },
              "186529_3": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Manual Id",
                "readonly": false,
                "type": "integer"
              },
              "186529_4": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Long Description",
                "readonly": false,
                "type": "textarea"
              },
              "186529_5": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Type",
                "readonly": false,
                "type": "checkbox"
              }
            },
            "form": {
              "attributes": {
                "action": "api\/v1\/nodes\/103827\/categories\/186529",
                "method": "PUT"
              }, "renderForm": true
            }
          },
          "schema": {
            "properties": {
              "186529_2": {
                "maxLength": 32,
                "readonly": false,
                "required": false,
                "title": "Manual Description",
                "type": "string"
              },
              "186529_3": {
                "readonly": false,
                "required": false,
                "title": "Manual Id",
                "type": "integer"
              },
              "186529_4": {
                "readonly": false,
                "required": false,
                "title": "Long Description",
                "type": "string"
              },
              "186529_5": {
                "readonly": false,
                "required": true,
                "title": "Type",
                "type": "boolean"
              }
            }, "type": "object"
          }
        }]
      };

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/11111/thumbnails/medium/content?suppress_response_codes',
        responseTime: 0,
        responseText: ''

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=11111&category_id=66666',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=11111&category_id=66667',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=11111&category_id=66668',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=22222&category_id=66666',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=22222&category_id=66667',
        responseTime: 0,
        responseText: categoryForm
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=22222&category_id=66668',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/22222/categories/66666/actions',
        responseTime: 0,
        response: function () {
          return {
            "data": {"categories_add": "api\/v1\/forms\/nodes\/categories\/create?id=66666"},
            "definitions": {
              "categories_add": {
                "body": "",
                "content_type": "",
                "display_hint": "",
                "display_href": "",
                "handler": "node_picker_form",
                "image": "",
                "method": "GET",
                "name": "Add Categories",
                "parameters": {},
                "tab_href": ""
              }
            },
            "definitions_map": {},
            "definitions_order": ["categories_add"]
          };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/22222/categories/66667/actions',
        responseTime: 0,
        responseText: {
          "data": {
            "categories_remove": "api\/v1\/nodes\/22222\/categories\/66667",
            "categories_update": "api\/v1\/forms\/nodes\/categories\/update?id=22222&category_id=66667"
          },
          "definitions": {
            "categories_remove": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "",
              "image": "",
              "method": "DELETE",
              "name": "Remove",
              "parameters": {},
              "tab_href": ""
            },
            "categories_update": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "",
              "method": "GET",
              "name": "Update",
              "parameters": {},
              "tab_href": ""
            }
          },
          "definitions_map": {},
          "definitions_order": ["categories_remove", "categories_update"]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/22222\\?(.*)$'),
        responseTime: 0,
        responseText: {
          container: true,
          container_size: 1,
          id: 22222,
          name: "Folder 1",
          description: "This is a folder from mockjax data on the client side.",
          type: 0,
          type_name: "Folder"
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/141'),
        responseTime: 0,
        responseText: enterpriseVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/142'),
        responseTime: 0,
        responseText: personalVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/133'),
        responseTime: 0,
        responseText: categoriesVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/954'),
        responseTime: 0,
        responseText: perspectiveAssetsVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/141(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: enterpriseVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/142(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: personalVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/133(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: categoriesVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/954(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: perspectiveAssetsVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v2/members/targets(?:\\?(.*))?$'),
        responseTime: 0,
        responseText: {     // TODO: return useful result
          "results": []
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/info?id=22222',
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "id": 109661,
                "name": "Assignment folder",
                "description": "",
                "create_date": "2015-04-21T11:43:20",
                "create_user_id": "Admin",
                "modify_date": "2015-04-21T11:43:20",
                "modify_user_id": "Admin",
                "owner_user_id": "Admin",
                "owner_group_id": "DefaultGroup",
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": "<Unknown>"
              },
              "options": {
                "fields": {
                  "id": {
                    "hidden": false,
                    "label": "ID",
                    "readonly": true,
                    "type": "number"
                  },
                  "name": {
                    "hidden": false,
                    "label": "Name",
                    "readonly": true,
                    "type": "text"
                  },
                  "description": {
                    "hidden": false,
                    "label": "Description",
                    "readonly": true,
                    "type": "textarea"
                  },
                  "create_date": {
                    "hidden": false,
                    "label": "Created",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "create_user_id": {
                    "hidden": false,
                    "label": "Created By",
                    "readonly": true,
                    "type": "text"
                  },
                  "modify_date": {
                    "hidden": false,
                    "label": "Modified",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "modify_user_id": {
                    "hidden": false,
                    "label": "Modified By",
                    "readonly": true,
                    "type": "text"
                  },
                  "owner_user_id": {
                    "hidden": false,
                    "label": "Owned By",
                    "readonly": true,
                    "type": "text"
                  },
                  "owner_group_id": {
                    "hidden": false,
                    "label": "Owned By",
                    "readonly": true,
                    "type": "text"
                  },
                  "reserved": {
                    "hidden": false,
                    "label": "Reserved",
                    "readonly": true,
                    "type": "checkbox"
                  },
                  "reserved_date": {
                    "hidden": false,
                    "label": "Reserved",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "reserved_user_id": {
                    "hidden": false,
                    "label": "Reserved By",
                    "readonly": true,
                    "type": "text"
                  }
                }
              },
              "schema": {
                "properties": {
                  "id": {
                    "readonly": true,
                    "required": false,
                    "title": "ID",
                    "type": "integer"
                  },
                  "name": {
                    "readonly": true,
                    "required": false,
                    "title": "Name",
                    "type": "string"
                  },
                  "description": {
                    "readonly": true,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "create_date": {
                    "format": "datetime",
                    "readonly": true,
                    "required": false,
                    "title": "Created",
                    "type": "string"
                  },
                  "create_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Created By",
                    "type": "string"
                  },
                  "modify_date": {
                    "format": "datetime",
                    "readonly": true,
                    "required": false,
                    "title": "Modified",
                    "type": "string"
                  },
                  "modify_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Modified By",
                    "type": "string"
                  },
                  "owner_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "string"
                  },
                  "owner_group_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "string"
                  },
                  "reserved": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved",
                    "type": "boolean"
                  },
                  "reserved_date": {
                    "format": "datetime",
                    "readonly": true,
                    "required": false,
                    "title": "Reserved",
                    "type": "string"
                  },
                  "reserved_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved By",
                    "type": "string"
                  }
                },
                "title": null,
                "type": "object"
              }
            }
          ]
        }
      }));
      
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/forms/nodes/update\\?id=(.+)$'),
        responseTime: 0,
        responseText:{
          "forms":[
            {
              "data":{
                "name":"minion1.jpg",
                "description":"",
                "create_date":"2018-04-26T14:15:36",
                "create_user_id":1000,
                "type":144,
                "type_name":"Document",
                "modify_date":"2018-05-14T16:15:59",
                "owner_user_id":1000,
                "reserved_user_id":1000,
                "reserved_date":"2018-04-30T11:26:55"
              },
              "options":{
                "fields":{
                  "name":{
                    "hidden":false,
                    "hideInitValidationError":true,
                    "label":"Name",
                    "readonly":false,
                    "type":"text"
                  },
                  "description":{
                    "hidden":false,
                    "hideInitValidationError":true,
                    "label":"Description",
                    "readonly":false,
                    "type":"textarea"
                  },
                  "create_date":{
                    "hidden":false,
                    "hideInitValidationError":true,
                    "label":"Created",
                    "readonly":true,
                    "type":"datetime"
                  },
                  "create_user_id":{
                    "hidden":false,
                    "hideInitValidationError":true,
                    "label":"Created By",
                    "readonly":true,
                    "type":"otcs_user_picker",
                    "type_control":{
                      "action":"api\/v1\/members",
                      "method":"GET",
                      "name":"Admin",
                      "parameters":{
                        "filter_types":[
                          0
                        ],
                        "select_types":[
                          0
                        ]
                      }
                    }
                  },
                  "type":{
                    "hidden":true,
                    "hideInitValidationError":true,
                    "label":"Type",
                    "readonly":true,
                    "type":"integer"
                  },
                  "type_name":{
                    "hidden":false,
                    "hideInitValidationError":true,
                    "label":"Type",
                    "readonly":true,
                    "type":"text"
                  },
                  "modify_date":{
                    "hidden":false,
                    "hideInitValidationError":true,
                    "label":"Modified",
                    "readonly":true,
                    "type":"datetime"
                  },
                  "owner_user_id":{
                    "hidden":false,
                    "hideInitValidationError":true,
                    "label":"Owned By",
                    "readonly":true,
                    "type":"otcs_user_picker",
                    "type_control":{
                      "action":"api\/v1\/members",
                      "method":"GET",
                      "name":"Admin",
                      "parameters":{
                        "filter_types":[
                          0
                        ],
                        "select_types":[
                          0
                        ]
                      }
                    }
                  },
                  "reserved_user_id":{
                    "hidden":false,
                    "hideInitValidationError":true,
                    "label":"Reserved By",
                    "readonly":true,
                    "type":"otcs_member_picker",
                    "type_control":{
                      "action":"api\/v1\/members",
                      "method":"GET",
                      "name":"Admin",
                      "parameters":{
                        "filter_types":[
                          0,
                          1
                        ],
                        "select_types":[
                          0,
                          1
                        ]
                      }
                    }
                  },
                  "reserved_date":{
                    "hidden":false,
                    "hideInitValidationError":true,
                    "label":"Reserved",
                    "readonly":true,
                    "type":"datetime"
                  }
                },
                "form":{
                  "attributes":{
                    "action":"api\/v1\/nodes\/24400",
                    "method":"PUT"
                  },
                  "renderForm":true
                }
              },
              "schema":{
                "properties":{
                  "name":{
                    "maxLength":248,
                    "minLength":1,
                    "readonly":false,
                    "required":true,
                    "title":"Name",
                    "type":"string"
                  },
                  "description":{
                    "readonly":false,
                    "required":false,
                    "title":"Description",
                    "type":"string"
                  },
                  "create_date":{
                    "readonly":true,
                    "required":false,
                    "title":"Created",
                    "type":"string"
                  },
                  "create_user_id":{
                    "readonly":true,
                    "required":false,
                    "title":"Created By",
                    "type":"otcs_user_picker"
                  },
                  "type":{
                    "readonly":true,
                    "required":false,
                    "title":"Type",
                    "type":"integer"
                  },
                  "type_name":{
                    "readonly":true,
                    "required":false,
                    "title":"Type",
                    "type":"string"
                  },
                  "modify_date":{
                    "readonly":true,
                    "required":false,
                    "title":"Modified",
                    "type":"string"
                  },
                  "owner_user_id":{
                    "readonly":true,
                    "required":false,
                    "title":"Owned By",
                    "type":"otcs_user_picker"
                  },
                  "reserved_user_id":{
                    "readonly":true,
                    "required":false,
                    "title":"Reserved By",
                    "type":"otcs_member_picker"
                  },
                  "reserved_date":{
                    "readonly":true,
                    "required":false,
                    "title":"Reserved",
                    "type":"string"
                  }
                },
                "type":"object"
              }
            },
            {
              "data":{
                "6390":{
                  "6390_3":12,
                  "6390_1":{
                    "version_number":2
                  }
                },
                "6963":{
                  "6963_2":"hello world",
                  "6963_1":{
                    "version_number":2
                  }
                },
                "30205":{
                  "30205_2":"2",
                  "30205_1":{
                    "version_number":2
                  }
                }
              },
              "options":{
                "fields":{
                  "6390":{
                    "fields":{
                      "6390_3":{
                        "hidden":false,
                        "hideInitValidationError":true,
                        "label":"Integer",
                        "readonly":false,
                        "type":"integer"
                      },
                      "6390_1":{
                        "hidden":true,
                        "hideInitValidationError":true,
                        "readonly":true,
                        "type":"object"
                      }
                    },
                    "hideInitValidationError":true,
                    "label":"Integer Field",
                    "type":"object"
                  },
                  "6963":{
                    "fields":{
                      "6963_2":{
                        "hidden":false,
                        "hideInitValidationError":true,
                        "label":"TextField",
                        "readonly":false,
                        "type":"text"
                      },
                      "6963_1":{
                        "hidden":true,
                        "hideInitValidationError":true,
                        "readonly":true,
                        "type":"object"
                      }
                    },
                    "hideInitValidationError":true,
                    "label":"Text*",
                    "type":"object"
                  },
                  "30205":{
                    "fields":{
                      "30205_2":{
                        "hidden":false,
                        "hideInitValidationError":true,
                        "label":"Select field",
                        "readonly":false,
                        "type":"select"
                      },
                      "30205_1":{
                        "hidden":true,
                        "hideInitValidationError":true,
                        "readonly":true,
                        "type":"object"
                      }
                    },
                    "hideInitValidationError":true,
                    "label":"select field",
                    "type":"object"
                  }
                }
              },
              "role_name":"categories",
              "schema":{
                "properties":{
                  "6390":{
                    "properties":{
                      "6390_3":{
                        "readonly":false,
                        "required":true,
                        "title":"Integer",
                        "type":"integer"
                      },
                      "6390_1":{
                        "readonly":true,
                        "required":false,
                        "type":"object"
                      }
                    },
                    "title":"Integer Field",
                    "type":"object"
                  },
                  "6963":{
                    "properties":{
                      "6963_2":{
                        "maxLength":32,
                        "readonly":false,
                        "required":true,
                        "title":"TextField",
                        "type":"string"
                      },
                      "6963_1":{
                        "readonly":true,
                        "required":false,
                        "type":"object"
                      }
                    },
                    "title":"Text",
                    "type":"object"
                  },
                  "30205":{
                    "properties":{
                      "30205_2":{
                        "enum":[
                          "1",
                          "2",
                          "3",
                          "4",
                          "5"
                        ],
                        "readonly":false,
                        "required":true,
                        "title":"Select field",
                        "type":"string"
                      },
                      "30205_1":{
                        "readonly":true,
                        "required":false,
                        "type":"object"
                      }
                    },
                    "title":"select field*",
                    "type":"object"
                  }
                },
                "title":"Categories",
                "type":"object"
              }
            }
          ]
        }
      }));  

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/actions?ids=11111&actions=addcategory',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/actions?actions=addcategory&ids=11111",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "11111": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/11111/categories",
                  "method": "POST",
                  "name": "Add Category"
                }
              },
              "map": {
                "default_action": "open"
              },
              "order": [
                "addcategory"
              ]
            }
          }
        }}));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };
});
