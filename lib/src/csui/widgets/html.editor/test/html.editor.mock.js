/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax'
], function (_, mockjax) {
  'use strict';
  var mocks = [];
  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/211987777/content',
        status: 500
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/211987777/content',
        status: 500
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth',
        status: 200,
        responseText: {}
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/211987777?expand=properties%7Boriginal_id%2Cparent_id%7D&fields=properties&actions=permissions&actions=properties&actions=reserve&actions=unreserve&actions=addcategory',
        responseText:
            {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "/api/v2/nodes/211987777?actions=rename&actions=permissions&actions=properties&actions=unreserve&actions=addcategory&expand=properties{original_id,parent_id}&fields=properties",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": {
                "actions": {
                  "data": {
                    "addcategory": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "/api/v2/nodes/211987777/categories",
                      "method": "POST",
                      "name": "Add Category"
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
                      "href": "/api/v2/nodes/211987777",
                      "method": "GET",
                      "name": "Properties"
                    },
                    "rename": {
                      "body": "",
                      "content_type": "",
                      "form_href": "/api/v2/forms/nodes/rename?id=211987777",
                      "href": "/api/v2/nodes/211987777",
                      "method": "PUT",
                      "name": "Rename"
                    }
                  },
                  "map": {
                    "default_action": "",
                    "more": [
                      "properties"
                    ]
                  },
                  "order": [
                    "addcategory",
                    "rename",
                    "permissions"
                  ]
                },
                "data": {
                  "properties": {
                    "container": false,
                    "container_size": 0,
                    "create_date": "2017-03-08T04:32:15",
                    "create_user_id": 1000,
                    "current_version": 166,
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
                    "featured": false,
                    "id": 2119877,
                    "mime_type": "text/plain",
                    "modify_date": "2017-12-26T18:12:13",
                    "modify_user_id": 1000,
                    "name": "Make in India!",
                    "name_multilingual": {
                      "de_DE": "Make in India!",
                      "en": "Make in India!",
                      "ja": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 2120317,
                    "parent_id_expand": {
                      "container": true,
                      "container_size": 6,
                      "create_date": "2017-03-08T04:30:56",
                      "create_user_id": 1000,
                      "customsidebars": [],
                      "description": "This Wiki talks about innovations all over World!",
                      "description_multilingual": {
                        "de_DE": "",
                        "en": "This Wiki talks about innovations all over World!",
                        "ja": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 2120317,
                      "image_folder_id": 2120318,
                      "imagebrowseenabled": true,
                      "main_page_id": 0,
                      "mime_type": null,
                      "modify_date": "2017-12-21T19:33:00",
                      "modify_user_id": 1000,
                      "name": "Innovation",
                      "name_multilingual": {
                        "de_DE": "Innovation",
                        "en": "Innovation rename",
                        "ja": ""
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 2117787,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 6,
                      "size_formatted": "6 Items",
                      "type": 5573,
                      "type_name": "Wiki",
                      "versions_control_advanced": false,
                      "volume_id": -2000,
                      "wnd_comments": null
                    },
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "showtoc": false,
                    "size": 2897,
                    "size_formatted": "3 KB",
                    "type": 5574,
                    "type_name": "Wiki Page",
                    "versions_control_advanced": false,
                    "volume_id": -2000,
                    "wnd_comments": null
                  }
                }
              }
            }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2119877/content',
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        response: function () {
          this.responseText = '<h2>What is Lorem Ipsum?</h2>\n' +
                              '\n' +
                              '<p><strong>Lorem <a href="/alpha/cs.exe/open/10117422" title="">Ipsum</a></strong><a href="/alpha/cs.exe/open/10117422" title="">&nbsp;</a>is simply <em><strong>dummy </strong></em>text of the <em><strong>printing </strong></em>and typesetting <strong>inddfgdfgdfgdfgustry</strong>. Lorem Ipsum has been the industry\'s standard <em><strong>dummy </strong></em>text ever since the <em><strong>1500s</strong></em>, when an <em><strong>unknown </strong></em>printer took a galley of type and <em><strong>scrambled </strong></em>it to <strong>make </strong>a <em><strong>type specimen book</strong></em>. It has <em><strong>survived </strong></em>not <em><strong>only </strong></em>five centuries, but also the <em><strong>leap into electronic </strong></em>typesetting, <em><strong>remaining </strong></em>essentially <strong>unchanged</strong>. It was dfdfdf in the 1960s with the <em><strong>release</strong></em> of <strong>Letraset </strong>sheets containin g <em><strong>Lorem </strong></em>Ipsum passages, and more recently <em><strong>with </strong></em>desktop publishing software like Aldus <em><strong>PageMaker </strong></em>including <em><strong>versions</strong></em> of Lorem Ipsum.</p>\n' +
                              '\n' +
                              '<p>11222233333 <em><strong>4444444 </strong></em>5555 66666</p>\n' +
                              '\n' +
                              '<p>&nbsp;</p>\n' +
                              '\n' +
                              '<h2 id="link1">Why do we use it?</h2>\n' +
                              '\n' +
                              '<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-<em><strong>less </strong></em>normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n' +
                              '\n' +
                              '<p>&nbsp;</p>\n' +
                              '\n' +
                              '<h2 id="link2">Where does it come from?</h2>\n' +
                              '\n' +
                              '<p>Contrary to popular belief, <a href="/alpha/cs.exe/open/7947678">Lorem </a>Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>\n' +
                              '\n' +
                              '<p>Cache-Control: no-cache, no-store, must-revalidate, max-age=0 Pragma: no-cache Expires: 0 OTCSTicket: kzaCxsS9K6gLM8uHpigEq0kWGg0+wzO1hpw1cZNbHGJ2FPx/VEjfQSHLS9OGrTQnaZnBqRYjSAXnpw0jqIV8Rp3X16Cq9wlO Status: 200 OK Content-type: application/json; charset=UTF-8 Content-Length: 139 {"links":{"data":{"self":{"body":"","content_type":"","href":"\\/api\\/v2\\/nodes\\/2119877\\/content","method":"<a href="/alpha/cs.exe/open/7947678">GET</a>","name":""}}},"results":{}}</p>\n';
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2119877',
        status: 200,
        responseText: {reserved_user_id: 1000}
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2119877?expand=properties%7Boriginal_id%2Cparent_id%7D&fields=properties&actions=permissions&actions=properties&actions=reserve&actions=unreserve&actions=addcategory',
        responseText:
            {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "/api/v2/nodes/2119877?actions=permissions&actions=properties&actions=reserve&actions=unreserve&actions=addcategory&expand=properties{original_id,parent_id}&fields=properties",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": {
                "actions": {
                  "data": {
                    "addcategory": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "/api/v2/nodes/2119877/categories",
                      "method": "POST",
                      "name": "Add Category"
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
                      "href": "/api/v2/nodes/2119877",
                      "method": "GET",
                      "name": "Properties"
                    },
                    "reserve": {
                      "body": "reserved_user_id=1000",
                      "content_type": "application/x-www-form-urlencoded",
                      "form_href": "",
                      "href": "/api/v2/nodes/2119877",
                      "method": "PUT",
                      "name": "Reserve"
                    }
                  },
                  "map": {
                    "default_action": "",
                    "more": [
                      "properties"
                    ]
                  },
                  "order": [
                    "addcategory",
                    "permissions",
                    "reserve"
                  ]
                },
                "data": {
                  "properties": {
                    "container": false,
                    "container_size": 0,
                    "create_date": "2017-03-08T04:32:15",
                    "create_user_id": 1000,
                    "current_version": 215,
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
                    "featured": false,
                    "id": 2119877,
                    "mime_type": "text/plain",
                    "modify_date": "2018-01-02T20:33:54",
                    "modify_user_id": 1000,
                    "name": "Make in India!",
                    "name_multilingual": {
                      "de_DE": "Make in India!",
                      "en": "Make in India!",
                      "ja": ""
                    },
                    "owner": "Admin",
                    "owner_group_id": 1001,
                    "owner_user_id": 1000,
                    "parent_id": 2120317,
                    "parent_id_expand": {
                      "container": true,
                      "container_size": 6,
                      "create_date": "2017-03-08T04:30:56",
                      "create_user_id": 1000,
                      "customsidebars": [],
                      "description": "This Wiki talks about innovations all over World!",
                      "description_multilingual": {
                        "de_DE": "",
                        "en": "This Wiki talks about innovations all over World!",
                        "ja": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 2120317,
                      "image_folder_id": 2120318,
                      "imagebrowseenabled": true,
                      "main_page_id": 0,
                      "mime_type": null,
                      "modify_date": "2017-12-27T23:40:03",
                      "modify_user_id": 1000,
                      "name": "Innovation",
                      "name_multilingual": {
                        "de_DE": "Innovation",
                        "en": "Innovation rename",
                        "ja": ""
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 2117787,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 6,
                      "size_formatted": "6 Items",
                      "type": 5573,
                      "type_name": "Wiki",
                      "versions_control_advanced": false,
                      "volume_id": -2000,
                      "wnd_comments": null
                    },
                    "permissions_model": "advanced",
                    "reserved": false,
                    "reserved_date": null,
                    "reserved_shared_collaboration": false,
                    "reserved_user_id": 0,
                    "showtoc": false,
                    "size": 3436,
                    "size_formatted": "4 KB",
                    "type": 5574,
                    "type_name": "Wiki Page",
                    "versions_control_advanced": false,
                    "volume_id": -2000,
                    "wnd_comments": null
                  }
                }
              }
            }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2119877/permissions/effective/',
        responseText:
            {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "/api/v2/nodes/2119877?expand=permissions{right_id}&fields=permissions{right_id,permissions,type}&fields=properties{container,name,type}&fields=versions{version_id}",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": {
                "data": {
                  "permissions": [
                    {
                      "permissions": [
                        "add_items",
                        "delete",
                        "delete_versions",
                        "edit_attributes",
                        "edit_permissions",
                        "modify",
                        "reserve",
                        "see",
                        "see_contents"
                      ],
                      "right_id": 1000,
                      "right_id_expand": {
                        "birth_date": "1900-10-31T00:00:00",
                        "business_email": null,
                        "business_fax": null,
                        "business_phone": null,
                        "cell_phone": null,
                        "deleted": false,
                        "first_name": null,
                        "gender": 2,
                        "group_id": 2426,
                        "home_address_1": null,
                        "home_address_2": null,
                        "home_fax": null,
                        "home_phone": null,
                        "id": 1000,
                        "last_name": "N/A",
                        "middle_name": null,
                        "name": "Admin",
                        "name_formatted": "Admin",
                        "office_location": null,
                        "pager": null,
                        "personal_email": null,
                        "personal_interests": null,
                        "personal_url_1": null,
                        "personal_url_2": null,
                        "personal_url_3": null,
                        "personal_website": null,
                        "photo_url": "api/v1/members/1000/photo?v=197642.1",
                        "time_zone": 6,
                        "title": null,
                        "type": 0,
                        "type_name": "User"
                      },
                      "type": "owner"
                    },
                    {
                      "permissions": [],
                      "right_id": 1001,
                      "right_id_expand": {
                        "deleted": false,
                        "id": 1001,
                        "leader_id": 0,
                        "name": "DefaultGroup",
                        "name_formatted": "DefaultGroup",
                        "type": 1,
                        "type_name": "Group"
                      },
                      "type": "group"
                    },
                    {
                      "permissions": [],
                      "right_id": null,
                      "type": "public"
                    },
                    {
                      "permissions": [
                        "see",
                        "see_contents"
                      ],
                      "right_id": 2116,
                      "right_id_expand": {
                        "deleted": false,
                        "id": 2116,
                        "leader_id": null,
                        "name": "Filter",
                        "name_formatted": "Filter",
                        "type": 1,
                        "type_name": "Group"
                      },
                      "type": "custom"
                    },
                    {
                      "permissions": [
                        "see",
                        "see_contents"
                      ],
                      "right_id": 2244,
                      "right_id_expand": {
                        "deleted": false,
                        "id": 2244,
                        "leader_id": null,
                        "name": "Recommender",
                        "name_formatted": "Recommender",
                        "type": 1,
                        "type_name": "Group"
                      },
                      "type": "custom"
                    },
                    {
                      "permissions": [
                        "add_items",
                        "delete",
                        "delete_versions",
                        "edit_attributes",
                        "edit_permissions",
                        "modify",
                        "reserve",
                        "see",
                        "see_contents"
                      ],
                      "right_id": 10313789,
                      "right_id_expand": {
                        "birth_date": null,
                        "business_email": "arvtest@opentext.com",
                        "business_fax": "0987654321",
                        "business_phone": "987654321",
                        "cell_phone": null,
                        "deleted": false,
                        "first_name": "Arvinder",
                        "gender": null,
                        "group_id": 321251,
                        "home_address_1": null,
                        "home_address_2": null,
                        "home_fax": null,
                        "home_phone": null,
                        "id": 10313789,
                        "last_name": "Singh",
                        "middle_name": null,
                        "name": "Arvinder",
                        "name_formatted": "Arvinder",
                        "office_location": "Hyderabad",
                        "pager": null,
                        "personal_email": null,
                        "personal_interests": null,
                        "personal_url_1": null,
                        "personal_url_2": null,
                        "personal_url_3": null,
                        "personal_website": null,
                        "photo_url": "api/v1/members/10313789/photo?v=10320609.1",
                        "time_zone": 43,
                        "title": "Sr.Product Manager",
                        "type": 0,
                        "type_name": "User"
                      },
                      "type": "custom"
                    },
                    {
                      "permissions": [
                        "add_items",
                        "delete",
                        "delete_versions",
                        "edit_attributes",
                        "modify",
                        "reserve",
                        "see",
                        "see_contents"
                      ],
                      "right_id": 64039,
                      "right_id_expand": {
                        "birth_date": null,
                        "business_email": "kbobbet@compay.com",
                        "business_fax": "519-999-9999",
                        "business_phone": "519-888-8888",
                        "cell_phone": null,
                        "deleted": false,
                        "first_name": "Kristen",
                        "gender": null,
                        "group_id": 131327,
                        "home_address_1": null,
                        "home_address_2": null,
                        "home_fax": null,
                        "home_phone": null,
                        "id": 64039,
                        "last_name": "Smith",
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
                        "photo_url": "api/v1/members/64039/photo?v=10617161.1",
                        "time_zone": -1,
                        "title": "Producer",
                        "type": 0,
                        "type_name": "User"
                      },
                      "type": "custom"
                    },
                    {
                      "permissions": [
                        "add_items",
                        "delete",
                        "delete_versions",
                        "edit_attributes",
                        "edit_permissions",
                        "modify",
                        "reserve",
                        "see",
                        "see_contents"
                      ],
                      "right_id": 327084,
                      "right_id_expand": {
                        "birth_date": null,
                        "business_email": "nkuchana@opentext.com",
                        "business_fax": null,
                        "business_phone": null,
                        "cell_phone": null,
                        "deleted": false,
                        "first_name": "Navya",
                        "gender": null,
                        "group_id": 14630,
                        "home_address_1": null,
                        "home_address_2": null,
                        "home_fax": null,
                        "home_phone": null,
                        "id": 327084,
                        "last_name": "Kuchana",
                        "middle_name": null,
                        "name": "navya",
                        "name_formatted": "navya",
                        "office_location": "Hyderabad",
                        "pager": null,
                        "personal_email": null,
                        "personal_interests": null,
                        "personal_url_1": null,
                        "personal_url_2": null,
                        "personal_url_3": null,
                        "personal_website": null,
                        "photo_url": "api/v1/members/327084/photo?v=1714977.1",
                        "time_zone": 43,
                        "title": "Senior Software Engineer",
                        "type": 0,
                        "type_name": "User"
                      },
                      "type": "custom"
                    },
                    {
                      "permissions": [
                        "add_items",
                        "delete",
                        "delete_versions",
                        "edit_attributes",
                        "edit_permissions",
                        "modify",
                        "reserve",
                        "see",
                        "see_contents"
                      ],
                      "right_id": 10820555,
                      "right_id_expand": {
                        "birth_date": null,
                        "business_email": "nraskoti@ot,com",
                        "business_fax": null,
                        "business_phone": null,
                        "cell_phone": null,
                        "deleted": false,
                        "first_name": "Niraj",
                        "gender": null,
                        "group_id": 1001,
                        "home_address_1": null,
                        "home_address_2": null,
                        "home_fax": null,
                        "home_phone": null,
                        "id": 10820555,
                        "last_name": "Raskoti",
                        "middle_name": null,
                        "name": "nraskoti",
                        "name_formatted": "nraskoti",
                        "office_location": null,
                        "pager": null,
                        "personal_email": null,
                        "personal_interests": null,
                        "personal_url_1": null,
                        "personal_url_2": null,
                        "personal_url_3": null,
                        "personal_website": null,
                        "photo_url": "api/v1/members/10820555/photo?v=10820881.1",
                        "time_zone": 43,
                        "title": null,
                        "type": 0,
                        "type_name": "User"
                      },
                      "type": "custom"
                    },
                    {
                      "permissions": [
                        "add_items",
                        "delete",
                        "delete_versions",
                        "edit_attributes",
                        "edit_permissions",
                        "modify",
                        "reserve",
                        "see",
                        "see_contents"
                      ],
                      "right_id": 615327,
                      "right_id_expand": {
                        "birth_date": null,
                        "business_email": "ravi.puppala@ot.com",
                        "business_fax": "111",
                        "business_phone": "999",
                        "cell_phone": null,
                        "deleted": false,
                        "first_name": "Ravi",
                        "gender": null,
                        "group_id": 1001,
                        "home_address_1": null,
                        "home_address_2": null,
                        "home_fax": null,
                        "home_phone": null,
                        "id": 615327,
                        "last_name": "Puppala",
                        "middle_name": null,
                        "name": "ravi",
                        "name_formatted": "ravi",
                        "office_location": "Hyderabad",
                        "pager": null,
                        "personal_email": null,
                        "personal_interests": null,
                        "personal_url_1": null,
                        "personal_url_2": null,
                        "personal_url_3": null,
                        "personal_website": null,
                        "photo_url": "api/v1/members/615327/photo?v=615218.1",
                        "time_zone": -1,
                        "title": "Developer",
                        "type": 0,
                        "type_name": "User"
                      },
                      "type": "custom"
                    },
                    {
                      "permissions": [
                        "add_items",
                        "delete",
                        "delete_versions",
                        "edit_attributes",
                        "modify",
                        "reserve",
                        "see",
                        "see_contents"
                      ],
                      "right_id": 5351091,
                      "right_id_expand": {
                        "birth_date": null,
                        "business_email": null,
                        "business_fax": null,
                        "business_phone": null,
                        "cell_phone": null,
                        "deleted": false,
                        "first_name": null,
                        "gender": null,
                        "group_id": 1001,
                        "home_address_1": null,
                        "home_address_2": null,
                        "home_fax": null,
                        "home_phone": null,
                        "id": 5351091,
                        "last_name": null,
                        "middle_name": null,
                        "name": "spencer5",
                        "name_formatted": "spencer5",
                        "office_location": null,
                        "pager": null,
                        "personal_email": null,
                        "personal_interests": null,
                        "personal_url_1": null,
                        "personal_url_2": null,
                        "personal_url_3": null,
                        "personal_website": null,
                        "photo_url": null,
                        "time_zone": -1,
                        "title": null,
                        "type": 0,
                        "type_name": "User"
                      },
                      "type": "custom"
                    }
                  ],
                  "properties": {
                    "container": false,
                    "name": "Make in India!",
                    "type": 5574
                  },
                  "versions": [
                    {
                      "version_id": 2119877
                    },
                    {
                      "version_id": 2120320
                    },
                    {
                      "version_id": 2120539
                    },
                    {
                      "version_id": 2120542
                    },
                    {
                      "version_id": 2120648
                    },
                    {
                      "version_id": 2120545
                    },
                    {
                      "version_id": 2120651
                    },
                    {
                      "version_id": 2120548
                    },
                    {
                      "version_id": 2120101
                    },
                    {
                      "version_id": 2120104
                    },
                    {
                      "version_id": 2119882
                    },
                    {
                      "version_id": 2121092
                    },
                    {
                      "version_id": 2120109
                    },
                    {
                      "version_id": 2122958
                    },
                    {
                      "version_id": 2122961
                    },
                    {
                      "version_id": 2122190
                    },
                    {
                      "version_id": 2122628
                    },
                    {
                      "version_id": 2122193
                    },
                    {
                      "version_id": 2122964
                    },
                    {
                      "version_id": 2122300
                    },
                    {
                      "version_id": 2875865
                    },
                    {
                      "version_id": 2875755
                    },
                    {
                      "version_id": 2875868
                    },
                    {
                      "version_id": 2874876
                    },
                    {
                      "version_id": 4117152
                    },
                    {
                      "version_id": 4643714
                    },
                    {
                      "version_id": 4815871
                    },
                    {
                      "version_id": 4837644
                    },
                    {
                      "version_id": 4880984
                    },
                    {
                      "version_id": 4883184
                    },
                    {
                      "version_id": 4883187
                    },
                    {
                      "version_id": 4883844
                    },
                    {
                      "version_id": 4885274
                    },
                    {
                      "version_id": 4885604
                    },
                    {
                      "version_id": 4930374
                    },
                    {
                      "version_id": 4930156
                    },
                    {
                      "version_id": 4932684
                    },
                    {
                      "version_id": 4932794
                    },
                    {
                      "version_id": 4969974
                    },
                    {
                      "version_id": 4969864
                    },
                    {
                      "version_id": 4970524
                    },
                    {
                      "version_id": 4974484
                    },
                    {
                      "version_id": 5021320
                    },
                    {
                      "version_id": 5021210
                    },
                    {
                      "version_id": 5021100
                    },
                    {
                      "version_id": 5021430
                    },
                    {
                      "version_id": 5021433
                    },
                    {
                      "version_id": 5021436
                    },
                    {
                      "version_id": 5021213
                    },
                    {
                      "version_id": 5020990
                    },
                    {
                      "version_id": 5021439
                    },
                    {
                      "version_id": 5021540
                    },
                    {
                      "version_id": 5021442
                    },
                    {
                      "version_id": 5021219
                    },
                    {
                      "version_id": 5021650
                    },
                    {
                      "version_id": 5020996
                    },
                    {
                      "version_id": 5026160
                    },
                    {
                      "version_id": 5026163
                    },
                    {
                      "version_id": 5026166
                    },
                    {
                      "version_id": 5026169
                    },
                    {
                      "version_id": 5028580
                    },
                    {
                      "version_id": 5028583
                    },
                    {
                      "version_id": 5028586
                    },
                    {
                      "version_id": 5027920
                    },
                    {
                      "version_id": 5084460
                    },
                    {
                      "version_id": 5095680
                    },
                    {
                      "version_id": 5097440
                    },
                    {
                      "version_id": 5101840
                    },
                    {
                      "version_id": 5102170
                    },
                    {
                      "version_id": 5133081
                    },
                    {
                      "version_id": 5135500
                    },
                    {
                      "version_id": 5135060
                    },
                    {
                      "version_id": 5137590
                    },
                    {
                      "version_id": 5137150
                    },
                    {
                      "version_id": 5136820
                    },
                    {
                      "version_id": 5136823
                    },
                    {
                      "version_id": 5136826
                    },
                    {
                      "version_id": 5136930
                    },
                    {
                      "version_id": 5136829
                    },
                    {
                      "version_id": 5181920
                    },
                    {
                      "version_id": 5181370
                    },
                    {
                      "version_id": 5181040
                    },
                    {
                      "version_id": 5181590
                    },
                    {
                      "version_id": 5181923
                    },
                    {
                      "version_id": 5181260
                    },
                    {
                      "version_id": 5183563
                    },
                    {
                      "version_id": 5183342
                    },
                    {
                      "version_id": 5183566
                    },
                    {
                      "version_id": 5183236
                    },
                    {
                      "version_id": 5233502
                    },
                    {
                      "version_id": 5297647
                    },
                    {
                      "version_id": 5339102
                    },
                    {
                      "version_id": 5341305
                    },
                    {
                      "version_id": 5341308
                    },
                    {
                      "version_id": 6248469
                    },
                    {
                      "version_id": 6576054
                    },
                    {
                      "version_id": 6576057
                    },
                    {
                      "version_id": 6883059
                    },
                    {
                      "version_id": 6953019
                    },
                    {
                      "version_id": 6952689
                    },
                    {
                      "version_id": 8366616
                    },
                    {
                      "version_id": 8367048
                    },
                    {
                      "version_id": 8367491
                    },
                    {
                      "version_id": 9954314
                    },
                    {
                      "version_id": 10092782
                    },
                    {
                      "version_id": 10099162
                    },
                    {
                      "version_id": 10117643
                    },
                    {
                      "version_id": 10122063
                    },
                    {
                      "version_id": 10138780
                    },
                    {
                      "version_id": 10138340
                    },
                    {
                      "version_id": 10140980
                    },
                    {
                      "version_id": 10140870
                    },
                    {
                      "version_id": 10257361
                    },
                    {
                      "version_id": 10257250
                    },
                    {
                      "version_id": 10260220
                    },
                    {
                      "version_id": 10286400
                    },
                    {
                      "version_id": 10336782
                    },
                    {
                      "version_id": 10336560
                    },
                    {
                      "version_id": 10336785
                    },
                    {
                      "version_id": 10336788
                    },
                    {
                      "version_id": 10360100
                    },
                    {
                      "version_id": 10359660
                    },
                    {
                      "version_id": 10387270
                    },
                    {
                      "version_id": 10464262
                    },
                    {
                      "version_id": 10464702
                    },
                    {
                      "version_id": 10464705
                    },
                    {
                      "version_id": 10475262
                    },
                    {
                      "version_id": 10516952
                    },
                    {
                      "version_id": 10516732
                    },
                    {
                      "version_id": 10516955
                    },
                    {
                      "version_id": 10516622
                    },
                    {
                      "version_id": 10612214
                    },
                    {
                      "version_id": 10614522
                    },
                    {
                      "version_id": 10614412
                    },
                    {
                      "version_id": 10626734
                    },
                    {
                      "version_id": 10626737
                    },
                    {
                      "version_id": 10640922
                    },
                    {
                      "version_id": 10640925
                    },
                    {
                      "version_id": 10640928
                    },
                    {
                      "version_id": 10640814
                    },
                    {
                      "version_id": 10644992
                    },
                    {
                      "version_id": 10645874
                    },
                    {
                      "version_id": 10645432
                    },
                    {
                      "version_id": 10650052
                    },
                    {
                      "version_id": 10649173
                    },
                    {
                      "version_id": 10651484
                    },
                    {
                      "version_id": 10651702
                    },
                    {
                      "version_id": 10651812
                    },
                    {
                      "version_id": 10654234
                    },
                    {
                      "version_id": 10654452
                    },
                    {
                      "version_id": 10662702
                    },
                    {
                      "version_id": 10661822
                    },
                    {
                      "version_id": 10662262
                    },
                    {
                      "version_id": 10661932
                    },
                    {
                      "version_id": 10661825
                    },
                    {
                      "version_id": 10661935
                    },
                    {
                      "version_id": 10662482
                    },
                    {
                      "version_id": 10666112
                    },
                    {
                      "version_id": 10666556
                    },
                    {
                      "version_id": 10666444
                    },
                    {
                      "version_id": 10689652
                    },
                    {
                      "version_id": 10725072
                    },
                    {
                      "version_id": 10725402
                    },
                    {
                      "version_id": 10779742
                    },
                    {
                      "version_id": 10779745
                    },
                    {
                      "version_id": 10793822
                    },
                    {
                      "version_id": 10799982
                    },
                    {
                      "version_id": 10820552
                    },
                    {
                      "version_id": 10820772
                    },
                    {
                      "version_id": 10877862
                    },
                    {
                      "version_id": 10884358
                    },
                    {
                      "version_id": 10884022
                    },
                    {
                      "version_id": 10883820
                    },
                    {
                      "version_id": 10883585
                    },
                    {
                      "version_id": 10883588
                    },
                    {
                      "version_id": 10884248
                    },
                    {
                      "version_id": 10884361
                    },
                    {
                      "version_id": 10883481
                    },
                    {
                      "version_id": 10884025
                    },
                    {
                      "version_id": 10884251
                    },
                    {
                      "version_id": 10884364
                    },
                    {
                      "version_id": 10883257
                    },
                    {
                      "version_id": 10883823
                    },
                    {
                      "version_id": 10883826
                    },
                    {
                      "version_id": 10883591
                    },
                    {
                      "version_id": 10883484
                    },
                    {
                      "version_id": 10883594
                    },
                    {
                      "version_id": 10883378
                    },
                    {
                      "version_id": 10883381
                    },
                    {
                      "version_id": 10883829
                    },
                    {
                      "version_id": 10883832
                    },
                    {
                      "version_id": 10883263
                    },
                    {
                      "version_id": 10883384
                    },
                    {
                      "version_id": 10884028
                    },
                    {
                      "version_id": 10884367
                    },
                    {
                      "version_id": 10883266
                    },
                    {
                      "version_id": 10883269
                    },
                    {
                      "version_id": 10884254
                    },
                    {
                      "version_id": 10884370
                    },
                    {
                      "version_id": 10883490
                    },
                    {
                      "version_id": 10884257
                    },
                    {
                      "version_id": 10883493
                    },
                    {
                      "version_id": 10883835
                    },
                    {
                      "version_id": 10883272
                    },
                    {
                      "version_id": 10884263
                    },
                    {
                      "version_id": 10884031
                    },
                    {
                      "version_id": 10883496
                    },
                    {
                      "version_id": 10883390
                    },
                    {
                      "version_id": 10883838
                    },
                    {
                      "version_id": 10883841
                    },
                    {
                      "version_id": 10890292
                    },
                    {
                      "version_id": 10889522
                    },
                    {
                      "version_id": 10889742
                    },
                    {
                      "version_id": 10919662
                    },
                    {
                      "version_id": 10919552
                    }
                  ]
                }
              }
            }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2119877?fields=properties%7Bcontainer%2C+name%2C+type%7D&fields=permissions%7Bright_id%2C+permissions%2C+type%7D&fields=versions%7Bversion_id%7D&expand=permissions%7Bright_id%7D',
        responseText:
            {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "/api/v2/nodes/2119877/permissions/effective/1000",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": {
                "data": {
                  "permissions": {
                    "permissions": [
                      "add_items",
                      "delete",
                      "delete_versions",
                      "edit_attributes",
                      "edit_permissions",
                      "modify",
                      "reserve",
                      "see",
                      "see_contents"
                    ],
                    "right_id": 1000,
                    "type": null
                  }
                }
              }
            }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/wiki/2119877/autosave',
        responseText:
            {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "/api/v2/wiki/2119877/autosave",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": {
                "data": {
                  "content": "<h2>What is Lorem Ipsum?</h2>\r\n\r\n<p><strong>Lorem <a href=\"/alpha/cs.exe/open/10117422\" title=\"\">Ipsum</a></strong><a href=\"/alpha/cs.exe/open/10117422\" title=\"\">&nbsp;</a>is simply <em><strong>dummy </strong></em>text of the <em><strong>printing </strong></em>and typesetting <strong>inddfgdfgdfgdfgustry</strong>. Lorem Ipsum has been the industry's standard <em><strong>dummy </strong></em>text ever since the <em><strong>1500s</strong></em>, when an <em><strong>unknown </strong></em>printer took a galley of type and <em><strong>scrambled </strong></em>it to <strong>make </strong>a <em><strong>type specimen book</strong></em>. It has <em><strong>survived </strong></em>not <em><strong>only </strong></em>five centuries, but also the <em><strong>leap into electronic </strong></em>typesetting, <em><strong>remaining </strong></em>essentially <strong>unchanged</strong>. It was dfdfdf in the 1960s with the <em><strong>release</strong></em> of <strong>Letraset </strong>sheets containin g <em><strong>Lorem </strong></em>Ipsum passages, and more recently <em><strong>with </strong></em>desktop publishing software like Aldus <em><strong>PageMaker </strong></em>including <em><strong>versions</strong></em> of Lorem Ipsum.</p>\r\n\r\n<p>11222233333 <em><strong>4444444 </strong></em>5555 66666</p>\r\n\r\n<p><a href=\"http://murdock.opentext.com/alpha/llisapi.dll/open/9280250\">P1</a></p>\r\n\r\n<h2 id=\"link1\">Why do we use it?</h2>\r\n\r\n<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-<em><strong>less </strong></em>normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\r\n\r\n<p>&nbsp;</p>\r\n\r\n<h2 id=\"link2\">Where does it come from?</h2>\r\n\r\n<p>Contrary to popular belief, <a href=\"/alpha/cs.exe/open/7947678\" title=\"\">Lorem </a>Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.</p>\r\n\r\n<p>Cache-Control: no-cache, no-store, must-revalidate, max-age=0 Pragma: no-cache Expires: 0 OTCSTicket: kzaCxsS9K6gLM8uHpigEq0kWGg0+wzO1hpw1cZNbHGJ2FPx/VEjfQSHLS9OGrTQnaZnBqRYjSAXnpw0jqIV8Rp3X16Cq9wlO Status: 200 OK Content-type: application/json; charset=UTF-8 Content-Length: 139 {\"links\":{\"data\":{\"self\":{\"body\":\"\",\"content_type\":\"\",\"href\":\"\\/api\\/v2\\/nodes\\/2119877\\/content\",\"method\":\"<a href=\"/alpha/cs.exe/open/7947678\">GET</a>\",\"name\":\"\"}}},\"results\":{}}</p>\r\n"
                }
              }
            }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/wiki/autosave',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/wiki\/autosave",
                "method": "POST",
                "name": ""
              }
            }
          }, "results": {}
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
