/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp(
            '^//server/otcs/cs/api/v2/members/favorites\\?(.*)?$'
        ),
        responseTime: 0,
        responseText: {
          "results": [
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/13983\/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/13983\/content",
                    "method": "GET",
                    "name": "Open"
                  }
                },
                "map": {"default_action": "open"},
                "order": ["open", "download"]
              },
              "data": {
                "favorites": {"name": "1-6014-EN.pdf", "order": 13, "tab_id": null},
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2016-08-10T10:51:25",
                  "create_user_id": 3313,
                  "description": "",
                  "description_multilingual": {"en_US": ""},
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": true,
                  "id": 13983,
                  "mime_type": "application\/pdf",
                  "modify_date": "2017-04-10T15:20:53",
                  "modify_user_id": 3313,
                  "name": "1-6014-EN.pdf",
                  "name_multilingual": {"en_US": "1-6014-EN.pdf"},
                  "owner_group_id": 1001,
                  "owner_user_id": 3313,
                  "parent_id": 12663,
                  "parent_id_expand": {
                    "container": true,
                    "container_size": 10,
                    "create_date": "2016-08-10T10:50:00",
                    "create_user_id": 3313,
                    "description": "",
                    "description_multilingual": {"en_US": ""},
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 12663,
                    "mime_type": null,
                    "modify_date": "2016-08-10T10:51:28",
                    "modify_user_id": 3313,
                    "name": "Spandaupumpen",
                    "name_multilingual": {"en_US": "Spandaupumpen"},
                    "owner_group_id": 1001,
                    "owner_user_id": 3313,
                    "parent_id": 13982,
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_user_id": 0,
                    "size": 10,
                    "size_formatted": "10 Items",
                    "type": 0,
                    "type_name": "Folder",
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "reserved": true,
                  "reserved_date": "2017-04-10T15:25:56",
                  "reserved_user_id": 3313,
                  "reserved_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Kristen",
                    "gender": null,
                    "group_id": 3312,
                    "home_address_1": null,
                    "home_address_2": null,
                    "home_fax": null,
                    "home_phone": null,
                    "id": 3313,
                    "last_name": null,
                    "middle_name": null,
                    "name": "Kristen",
                    "name_formatted": "Kristen",
                    "office_location": "Waterloo",
                    "pager": null,
                    "personal_email": null,
                    "personal_interests": null,
                    "personal_url_1": null,
                    "personal_url_2": null,
                    "personal_url_3": null,
                    "personal_website": null,
                    "photo_url": "api\/v1\/members\/3313\/photo?v=3321.1",
                    "time_zone": -1,
                    "title": "Producer",
                    "type": 0,
                    "type_name": "User"
                  },
                  "size": 644786,
                  "size_formatted": "630 KB",
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/35221\/content",
                    "method": "GET",
                    "name": "Open"
                  }
                },
                "map": {"default_action": "open"},
                "order": ["open"]
              },
              "data": {
                "favorites": {
                  "name": "F Die Grundlagen der allgemeinen Relativit\u00e4tstheorie",
                  "order": 10,
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2017-01-05T15:07:51",
                  "create_user_id": 3313,
                  "description": "!KOSValue error string!",
                  "description_multilingual": {"en_US": "!KOSValue error string!"},
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": true,
                  "id": 35223,
                  "mime_type": null,
                  "modify_date": "2017-01-05T15:07:51",
                  "modify_user_id": 3313,
                  "name": "Die Grundlagen der allgemeinen Relativit\u00e4tstheorie",
                  "name_multilingual": {"en_US": "Die Grundlagen der allgemeinen Relativit\u00e4tstheorie"},
                  "original_id": 35221,
                  "original_id_expand": {
                    "container": false,
                    "container_size": 0,
                    "create_date": "2017-01-05T15:06:40",
                    "create_user_id": 3313,
                    "description": "Written originally by Albert Einstein",
                    "description_multilingual": {"en_US": "Written originally by Albert Einstein"},
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 35221,
                    "mime_type": "application\/pdf",
                    "modify_date": "2017-03-13T15:51:39",
                    "modify_user_id": 3313,
                    "name": "Die Grundlagen der allgemeinen Relativit\u00e4tstheorie",
                    "name_multilingual": {"en_US": "Die Grundlagen der allgemeinen Relativit\u00e4tstheorie"},
                    "owner_group_id": 1001,
                    "owner_user_id": 3313,
                    "parent_id": 19922,
                    "reserved": true,
                    "reserved_date": "2017-03-28T14:07:09",
                    "reserved_user_id": 3313,
                    "size": 2379946,
                    "size_formatted": "3 MB",
                    "type": 144,
                    "type_name": "Document",
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 3313,
                  "parent_id": 4632,
                  "parent_id_expand": {
                    "container": true,
                    "container_size": 3,
                    "create_date": "2016-08-03T13:40:17",
                    "create_user_id": 3313,
                    "description": "",
                    "description_multilingual": {"en_US": ""},
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 4632,
                    "mime_type": null,
                    "modify_date": "2017-04-13T13:34:58",
                    "modify_user_id": 3313,
                    "name": "This is Smart UI from main branch, which has a very long name that should be displayed with an ellipsis",
                    "name_multilingual": {"en_US": "This is Smart UI from main branch, which has a very long name that should be displayed with an ellipsis"},
                    "owner_group_id": 1001,
                    "owner_user_id": 3313,
                    "parent_id": 2000,
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_user_id": 0,
                    "size": 3,
                    "size_formatted": "3 Items",
                    "type": 0,
                    "type_name": "Folder",
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "size": null,
                  "size_formatted": "",
                  "type": 1,
                  "type_name": "Shortcut",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                }
              }
            },
            {
              "actions": {
                "data": {
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/38624\/nodes",
                    "method": "GET",
                    "name": "Open"
                  }
                },
                "map": {"default_action": "open"},
                "order": ["open"]
              },
              "data": {
                "favorites": {"name": "F A door opener (wiki)", "order": 7, "tab_id": null},
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2017-01-17T13:35:27",
                  "create_user_id": 3313,
                  "description": "!KOSValue error string!",
                  "description_multilingual": {"en_US": "!KOSValue error string!"},
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": true,
                  "id": 38337,
                  "mime_type": null,
                  "modify_date": "2017-01-17T13:35:27",
                  "modify_user_id": 3313,
                  "name": "A door opener (wiki)",
                  "name_multilingual": {"en_US": "A door opener (wiki)"},
                  "original_id": 38624,
                  "original_id_expand": {
                    "container": true,
                    "container_size": 4,
                    "create_date": "2017-01-10T10:03:54",
                    "create_user_id": 3313,
                    "customsidebars": [{"body": "", "title": ""}],
                    "description": "",
                    "description_multilingual": {"en_US": ""},
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 38624,
                    "image_folder_id": 38326,
                    "mime_type": null,
                    "modify_date": "2017-01-10T10:12:44",
                    "modify_user_id": 3313,
                    "name": "A door opener (wiki)",
                    "name_multilingual": {"en_US": "A door opener (wiki)"},
                    "owner_group_id": 1001,
                    "owner_user_id": 3313,
                    "parent_id": 38292,
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_user_id": 0,
                    "size": 4,
                    "size_formatted": "4 Items",
                    "type": 5573,
                    "type_name": "Wiki",
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 3313,
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "container": true,
                    "container_size": 23,
                    "create_date": "2016-08-01T12:28:05",
                    "create_user_id": 1000,
                    "description": "",
                    "description_multilingual": {"en_US": ""},
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 2000,
                    "mime_type": null,
                    "modify_date": "2017-04-19T16:16:03",
                    "modify_user_id": 3313,
                    "name": "Enterprise",
                    "name_multilingual": {"en_US": "Enterprise"},
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": -1,
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_user_id": 0,
                    "size": 23,
                    "size_formatted": "23 Items",
                    "type": 141,
                    "type_name": "Enterprise Workspace",
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "size": null,
                  "size_formatted": "",
                  "type": 1,
                  "type_name": "Shortcut",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/1330336\/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/1330336\/content",
                    "method": "GET",
                    "name": "Open"
                  }
                },
                "map": {"default_action": "open"},
                "order": ["open", "download"]
              },
              "data": {
                "favorites": {
                  "name": "2015-08-15 at 16.23.43_Anton.jpg", "order": 15, "tab_id": null
                },
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2017-04-11T12:32:47",
                  "create_user_id": 3313,
                  "description": "",
                  "description_multilingual": {"en_US": ""},
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": true,
                  "id": 1330336,
                  "mime_type": "image\/jpeg",
                  "modify_date": "2017-04-11T12:36:18",
                  "modify_user_id": 3313,
                  "name": "2015-08-15 at 16.23.43_Anton.jpg",
                  "name_multilingual": {"en_US": "2015-08-15 at 16.23.43_Anton.jpg"},
                  "owner_group_id": 1001,
                  "owner_user_id": 3313,
                  "parent_id": 1328026,
                  "parent_id_expand": {
                    "container": true,
                    "container_size": 2,
                    "create_date": "2017-04-11T12:24:18",
                    "create_user_id": 3313,
                    "description": "",
                    "description_multilingual": {"en_US": ""},
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 1328026,
                    "mime_type": null,
                    "modify_date": "2017-04-11T14:38:07",
                    "modify_user_id": 3313,
                    "name": "Category Special",
                    "name_multilingual": {"en_US": "Category Special"},
                    "owner_group_id": 1001,
                    "owner_user_id": 3313,
                    "parent_id": 2000,
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_user_id": 0,
                    "size": 2,
                    "size_formatted": "2 Items",
                    "type": 0,
                    "type_name": "Folder",
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "size": 3199479,
                  "size_formatted": "4 MB",
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                }
              }
            },
            {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/1332536\/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/1332536\/content",
                    "method": "GET",
                    "name": "Open"
                  }
                },
                "map": {"default_action": "open"},
                "order": ["open", "download"]
              },
              "data": {
                "favorites": {
                  "name": "2015-08-15 at 16.24.12_Anton.jpg", "order": 14, "tab_id": null
                },
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2017-04-11T14:38:07",
                  "create_user_id": 3313,
                  "description": "",
                  "description_multilingual": {"en_US": ""},
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": true,
                  "id": 1332536,
                  "mime_type": "image\/jpeg",
                  "modify_date": "2017-04-11T14:39:33",
                  "modify_user_id": 3313,
                  "name": "2015-08-15 at 16.24.12_Anton.jpg",
                  "name_multilingual": {"en_US": "2015-08-15 at 16.24.12_Anton.jpg"},
                  "owner_group_id": 1001,
                  "owner_user_id": 3313,
                  "parent_id": 1328026,
                  "parent_id_expand": {
                    "container": true,
                    "container_size": 2,
                    "create_date": "2017-04-11T12:24:18",
                    "create_user_id": 3313,
                    "description": "",
                    "description_multilingual": {"en_US": ""},
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 1328026,
                    "mime_type": null,
                    "modify_date": "2017-04-11T14:38:07",
                    "modify_user_id": 3313,
                    "name": "Category Special",
                    "name_multilingual": {"en_US": "Category Special"},
                    "owner_group_id": 1001,
                    "owner_user_id": 3313,
                    "parent_id": 2000,
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_user_id": 0,
                    "size": 2,
                    "size_formatted": "2 Items",
                    "type": 0,
                    "type_name": "Folder",
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "size": 2576645,
                  "size_formatted": "3 MB",
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                }
              }
            }, {
              "actions": {
                "data": {
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/1367846\/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "\/api\/v2\/nodes\/1367846\/content",
                    "method": "GET",
                    "name": "Open"
                  }
                },
                "map": {"default_action": "open"},
                "order": ["open", "download"]
              },
              "data": {
                "favorites": {
                  "name": "F ECCN Questionnaire Business Center 16.0.2 (1).docx",
                  "order": 11,
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2017-04-12T17:08:07",
                  "create_user_id": 3313,
                  "description": "",
                  "description_multilingual": {"en_US": ""},
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": true,
                  "id": 1367846,
                  "mime_type": "application\/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "modify_date": "2017-04-24T12:53:07",
                  "modify_user_id": 3313,
                  "name": "ECCN Questionnaire Business Center 16.0.2 (1).docx",
                  "name_multilingual": {"en_US": "ECCN Questionnaire Business Center 16.0.2 (1).docx"},
                  "owner_group_id": 1001,
                  "owner_user_id": 3313,
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "container": true,
                    "container_size": 23,
                    "create_date": "2016-08-01T12:28:05",
                    "create_user_id": 1000,
                    "description": "",
                    "description_multilingual": {"en_US": ""},
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 2000,
                    "mime_type": null,
                    "modify_date": "2017-04-19T16:16:03",
                    "modify_user_id": 3313,
                    "name": "Enterprise",
                    "name_multilingual": {"en_US": "Enterprise"},
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": -1,
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_user_id": 0,
                    "size": 23,
                    "size_formatted": "23 Items",
                    "type": 141,
                    "type_name": "Enterprise Workspace",
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "reserved": true,
                  "reserved_date": "2017-04-24T12:53:07",
                  "reserved_user_id": 3313,
                  "reserved_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Kristen",
                    "gender": null,
                    "group_id": 3312,
                    "home_address_1": null,
                    "home_address_2": null,
                    "home_fax": null,
                    "home_phone": null,
                    "id": 3313,
                    "last_name": null,
                    "middle_name": null,
                    "name": "Kristen",
                    "name_formatted": "Kristen",
                    "office_location": "Waterloo",
                    "pager": null,
                    "personal_email": null,
                    "personal_interests": null,
                    "personal_url_1": null,
                    "personal_url_2": null,
                    "personal_url_3": null,
                    "personal_website": null,
                    "photo_url": "api\/v1\/members\/3313\/photo?v=3321.1",
                    "time_zone": -1,
                    "title": "Producer",
                    "type": 0,
                    "type_name": "User"
                  },
                  "size": 120847,
                  "size_formatted": "119 KB",
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                }
              }
            },
            {
              "actions": {
                "data": {},
                "map": {"default_action": ""},
                "order": []
              },
              "data": {
                "favorites": {
                  "name": "F Generation More OScript Coding Conventions.docx",
                  "order": 12,
                  "tab_id": null
                },
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2017-04-19T16:16:03",
                  "create_user_id": 3313,
                  "description": "",
                  "description_multilingual": {"en_US": ""},
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": true,
                  "id": 1628766,
                  "mime_type": null,
                  "modify_date": "2017-04-19T16:16:03",
                  "modify_user_id": 3313,
                  "name": "Generation More OScript Coding Conventions.docx",
                  "name_multilingual": {"en_US": "Generation More OScript Coding Conventions.docx"},
                  "owner_group_id": 1001,
                  "owner_user_id": 3313,
                  "parent_id": 2000,
                  "parent_id_expand": {
                    "container": true,
                    "container_size": 23,
                    "create_date": "2016-08-01T12:28:05",
                    "create_user_id": 1000,
                    "description": "",
                    "description_multilingual": {"en_US": ""},
                    "external_create_date": null,
                    "external_identity": "",
                    "external_identity_type": "",
                    "external_modify_date": null,
                    "external_source": "",
                    "favorite": false,
                    "id": 2000,
                    "mime_type": null,
                    "modify_date": "2017-04-19T16:16:03",
                    "modify_user_id": 3313,
                    "name": "Enterprise",
                    "name_multilingual": {"en_US": "Enterprise"},
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": -1,
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_user_id": 0,
                    "size": 23,
                    "size_formatted": "23 Items",
                    "type": 141,
                    "type_name": "Enterprise Workspace",
                    "versions_control_advanced": false,
                    "volume_id": -2000
                  },
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "size": null,
                  "size_formatted": "",
                  "type": 2,
                  "type_name": "Generation",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                }
              }
            }
          ],
          "columns": [
            {
              "default_action": true,
              "column_key": "type",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Type",
              "required": false,
              "type": 2,
              "type_name": "Integer"
            },
            {
              "default_action": true,
              "column_key": "favorite_name",
              "max_length": null,
              "min_length": null,
              "multi_value": false,
              "multiline": false,
              "multilingual": false,
              "name": "Name",
              "password": false,
              "required": false,
              "type": -1,
              "type_name": "String"
            },
            {
              "column_key": "reserved",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Reserved",
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "noTitleInHeader": true
            },
            {
              "column_key": "parent_id",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Parent ID",
              "required": false,
              "type": 2,
              "type_name": "Integer"
            },
            {
              "column_key": "size",
              "key_value_pairs": false,
              "max_value": null,
              "min_value": null,
              "multi_value": false,
              "name": "Size",
              "required": false,
              "type": 2,
              "type_name": "Integer"
            },
            {
              "column_key": "favorite",
              "key_value_pairs": false,
              "multi_value": false,
              "name": "Favorite",
              "required": false,
              "type": 5,
              "type_name": "Boolean",
              "noTitleInHeader": true,
              "permanentColumn": true
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites/tabs.*'),
        responseTime: 0,
        responseText: {
          "results": [
          ]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions\\?(.*)?$'),
        responseTime: 0,
        responseText: {
          "results": {
            "35223": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4263376\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "addversion": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4263376\/versions",
                  "method": "POST",
                  "name": "Add Version"
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
                  "form_href": "\/api\/v2\/forms\/nodes\/copy?id=4263376",
                  "href": "\/api\/v2\/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4263376",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/move?id=4263376",
                  "href": "\/api\/v2\/nodes\/4263376",
                  "method": "PUT",
                  "name": "Move"
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
                  "href": "\/api\/v2\/nodes\/4263376",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "\/api\/v2\/forms\/nodes\/rename?id=4263376",
                  "href": "\/api\/v2\/nodes\/4263376",
                  "method": "PUT",
                  "name": "Rename"
                },
                "reserve": {
                  "body": "reserved_user_id=3313",
                  "content_type": "application\/x-www-form-urlencoded",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4263376",
                  "method": "PUT",
                  "name": "Reserve"
                }
              },
              "map": {"default_action": "open", "more": ["properties"]},
              "order": ["addversion", "addcategory", "rename", "copy", "move", "permissions",
                "reserve", "delete", "comment"]
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
