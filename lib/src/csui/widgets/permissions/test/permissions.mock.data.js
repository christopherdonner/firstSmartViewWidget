/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {

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
          {
            "data": {
              "birth_date": null,
              "business_email": null,
              "business_fax": null,
              "business_phone": null,
              "cell_phone": null,
              "deleted": false,
              "display_name": "Admin",
              "first_name": null,
              "gender": null,
              "group_id": 1001,
              "home_address_1": null,
              "home_address_2": null,
              "home_fax": null,
              "home_phone": null,
              "id": 1000,
              "last_name": null,
              "middle_name": null,
              "name": "Admin",
              "office_location": null,
              "pager": null,
              "personal_email": null,
              "personal_interests": null,
              "personal_url_1": null,
              "personal_url_2": null,
              "personal_url_3": null,
              "personal_website": null,
              "photo_url": null,
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
            "perspective": {
              "options": {
                "widgets": [{
                  "type": "csui\/widgets\/welcome.placeholder"
                }, {
                  "type": "csui\/widgets\/myassignments"
                }, {
                  "type": "csui\/widgets\/favorites"
                }, {
                  "options": {
                    "background": "cs-tile-background2",
                    "type": 141
                  },
                  "type": "csui\/widgets\/shortcut"
                }, {
                  "options": {
                    "background": "cs-tile-background3",
                    "type": 142
                  },
                  "type": "csui\/widgets\/shortcut"
                }, {
                  "type": "csui\/widgets\/recentlyaccessed"
                }]
              },
              "type": "flow"
            }
          };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=22222',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
          {
            "data": {
              "birth_date": null,
              "business_email": null,
              "business_fax": null,
              "business_phone": null,
              "cell_phone": null,
              "deleted": false,
              "display_name": "Admin",
              "first_name": null,
              "gender": null,
              "group_id": 1001,
              "home_address_1": null,
              "home_address_2": null,
              "home_fax": null,
              "home_phone": null,
              "id": 1000,
              "last_name": null,
              "middle_name": null,
              "name": "Admin",
              "office_location": null,
              "pager": null,
              "personal_email": null,
              "personal_interests": null,
              "personal_url_1": null,
              "personal_url_2": null,
              "personal_url_3": null,
              "personal_website": null,
              "photo_url": null,
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
            "perspective": {
              "options": {
                "widgets": [{
                  "type": "csui\/widgets\/welcome.placeholder"
                }, {
                  "type": "csui\/widgets\/myassignments"
                }, {
                  "type": "csui\/widgets\/favorites"
                }, {
                  "options": {
                    "background": "cs-tile-background2",
                    "type": 141
                  },
                  "type": "csui\/widgets\/shortcut"
                }, {
                  "options": {
                    "background": "cs-tile-background3",
                    "type": 142
                  },
                  "type": "csui\/widgets\/shortcut"
                }, {
                  "type": "csui\/widgets\/recentlyaccessed"
                }]
              },
              "type": "flow"
            }
          };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=33333',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
          {
            "data": {
              "birth_date": null,
              "business_email": null,
              "business_fax": null,
              "business_phone": null,
              "cell_phone": null,
              "deleted": false,
              "display_name": "Admin",
              "first_name": null,
              "gender": null,
              "group_id": 1001,
              "home_address_1": null,
              "home_address_2": null,
              "home_fax": null,
              "home_phone": null,
              "id": 1000,
              "last_name": null,
              "middle_name": null,
              "name": "Admin",
              "office_location": null,
              "pager": null,
              "personal_email": null,
              "personal_interests": null,
              "personal_url_1": null,
              "personal_url_2": null,
              "personal_url_3": null,
              "personal_website": null,
              "photo_url": null,
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
            "perspective": {
              "options": {
                "widgets": [{
                  "type": "csui\/widgets\/welcome.placeholder"
                }, {
                  "type": "csui\/widgets\/myassignments"
                }, {
                  "type": "csui\/widgets\/favorites"
                }, {
                  "options": {
                    "background": "cs-tile-background2",
                    "type": 141
                  },
                  "type": "csui\/widgets\/shortcut"
                }, {
                  "options": {
                    "background": "cs-tile-background3",
                    "type": 142
                  },
                  "type": "csui\/widgets\/shortcut"
                }, {
                  "type": "csui\/widgets\/recentlyaccessed"
                }]
              },
              "type": "flow"
            }
          };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=55555',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
          {
            "data": {
              "birth_date": null,
              "business_email": null,
              "business_fax": null,
              "business_phone": null,
              "cell_phone": null,
              "deleted": false,
              "display_name": "Admin",
              "first_name": null,
              "gender": null,
              "group_id": 1001,
              "home_address_1": null,
              "home_address_2": null,
              "home_fax": null,
              "home_phone": null,
              "id": 1000,
              "last_name": null,
              "middle_name": null,
              "name": "Admin",
              "office_location": null,
              "pager": null,
              "personal_email": null,
              "personal_interests": null,
              "personal_url_1": null,
              "personal_url_2": null,
              "personal_url_3": null,
              "personal_website": null,
              "photo_url": null,
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
            "perspective": {
              "options": {
                "widgets": [{
                  "type": "csui\/widgets\/welcome.placeholder"
                }, {
                  "type": "csui\/widgets\/myassignments"
                }, {
                  "type": "csui\/widgets\/favorites"
                }, {
                  "options": {
                    "background": "cs-tile-background2",
                    "type": 141
                  },
                  "type": "csui\/widgets\/shortcut"
                }, {
                  "options": {
                    "background": "cs-tile-background3",
                    "type": 142
                  },
                  "type": "csui\/widgets\/shortcut"
                }, {
                  "type": "csui\/widgets\/recentlyaccessed"
                }]
              },
              "type": "flow"
            }
          };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth?*',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
              {
                "data": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": false,
                  "display_name": "Admin",
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
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
                "perspective": {
                  "options": {
                    "widgets": [{
                      "type": "csui\/widgets\/welcome.placeholder"
                    }, {
                      "type": "csui\/widgets\/myassignments"
                    }, {
                      "type": "csui\/widgets\/favorites"
                    }, {
                      "options": {
                        "background": "cs-tile-background2",
                        "type": 141
                      },
                      "type": "csui\/widgets\/shortcut"
                    }, {
                      "options": {
                        "background": "cs-tile-background3",
                        "type": 142
                      },
                      "type": "csui\/widgets\/shortcut"
                    }, {
                      "type": "csui\/widgets\/recentlyaccessed"
                    }]
                  },
                  "type": "flow"
                }
              };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/11111/permissions/effective/1000',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
              {
                "results": {
                  "data": {
                    "permissions": {
                      "permissions": ["add_items", "delete", "delete_versions", "edit_attributes",
                        "edit_permissions", "modify", "reserve", "see", "see_contents"],
                      "right_id": 1000,
                      "type": null
                    }
                  }
                }
              };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/22222/permissions/effective/1000',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
              {
                "results": {
                  "data": {
                    "permissions": {
                      "permissions": ["add_items", "delete", "delete_versions", "edit_attributes",
                        "edit_permissions", "modify", "reserve", "see", "see_contents"],
                      "right_id": 1000,
                      "type": null
                    }
                  }
                }
              };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/33333/permissions/effective/1000',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
              {
                "results": {
                  "data": {
                    "permissions": {
                      "permissions": ["add_items", "delete", "delete_versions", "edit_attributes",
                        "edit_permissions", "modify", "reserve", "see", "see_contents"],
                      "right_id": 1000,
                      "type": null
                    }
                  }
                }
              };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/55555/permissions/effective/1000',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
              {
                "results": {
                  "data": {
                    "permissions": {
                      "permissions": ["add_items", "delete", "delete_versions", "edit_attributes",
                        "edit_permissions", "modify", "reserve", "see", "see_contents"],
                      "right_id": 1000,
                      "type": null
                    }
                  }
                }
              };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/11111/permissions/effective/1500',
        responseTime: 5,
        type: 'GET',
        response: function (settings) {
          this.status = 200;
          this.responseText =
              {
                "results": {
                  "data": {
                    "permissions": {
                      "permissions": ["see", "see_contents"],
                      "right_id": 1000,
                      "type": null
                    }
                  }
                }
              };
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/22222/permissions/owner',
        responseTime: 0,
        type: 'PUT',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/3752\/permissions\/owner",
                "method": "PUT",
                "name": ""
              }
            }
          }
          ,
          "results": {}
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/33333/permissions/owner',
        responseTime: 0,
        type: 'PUT',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/3752\/permissions\/owner",
                "method": "PUT",
                "name": ""
              }
            }
          }
          ,
          "results": {}
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/55555/permissions/group',
        responseTime: 0,
        type: 'PUT',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/3752\/permissions\/owner",
                "method": "PUT",
                "name": ""
              }
            }
          }
          ,
          "results": {}
        }
      }));

      mocks.push(mockjax({
        url: '/api/v2/nodes/44444?fields=properties{name}&fields=permissions{right_id,' +
             ' permissions,type}&expand=permissions{right_id}',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/44444?expand=permissions{right_id}&fields=permissions{right_id,permissions,type}&fields=properties{name}",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "permissions": [{
                "permissions": ["delete", "delete_versions", "edit_attributes",
                  "edit_permissions",
                  "modify", "reserve", "see", "see_contents"],
                "right_id": 1000,
                "right_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
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
                  "photo_url": "api\/v1\/members\/1000\/photo?v=40103.1",
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "type": "owner"
              }, {
                "permissions": ["add_items", "delete", "delete_versions", "edit_attributes",
                  "edit_permissions", "modify", "reserve", "see", "see_contents"],
                "right_id": 1001,
                "right_id_expand": {
                  "id": 1001,
                  "leader_id": null,
                  "name": "DefaultGroup",
                  "name_formatted": "DefaultGroup",
                  "type": 1,
                  "type_name": "Group"
                },
                "type": "group"
              }, {
                "permissions": ["see", "see_contents"],
                "right_id": null,
                "type": "public"
              }, {
                "permissions": ["delete", "delete_versions", "modify", "see", "see_contents"],
                "right_id": 24085,
                "right_id_expand": {
                  "id": 24085,
                  "leader_id": null,
                  "name": "TestPermissionGroup1",
                  "name_formatted": "TestPermissionGroup1",
                  "type": 1,
                  "type_name": "Group"
                },
                "type": "custom"
              }, {
                "permissions": ["edit_attributes", "modify", "see", "see_contents"],
                "right_id": 19915,
                "right_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": "test user",
                  "gender": null,
                  "group_id": 24085,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 19915,
                  "last_name": "test user",
                  "middle_name": "1",
                  "name": "TestUser1",
                  "name_formatted": "TestUser1",
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
              }],
              "properties": {
                "name": "AllPermissions.JPG"
              }
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/members/(.+)$'),
        responseTime: 0,
        responseText: ''
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
                "href": "\/api\/v2\/nodes\/11111?expand=properties%7Boriginal_id%7D&fields=properties&actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve",
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
                  "href": "\/api\/v2\/nodes\/11111\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
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
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/11111\/permissions",
                  "method": "GET",
                  "name": "permissions"
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
              "order": ["open", "download", "addversion", "addcategory", "rename", "copy",
                "move", "reserve", "delete", "permissions"]
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
        url: '//server/otcs/cs/api/v2/members?limit=5&where_type=0&expand=properties{group_id,leader_id}&query=u',
        responseTime: 0,
        type: 'GET',
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "page": 1,
              "page_total": 1,
              "range_max": 5,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members?limit=5&where_type=0&expand=properties{group_id,leader_id}&query=u",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": {
                    "deleted": false,
                    "id": 1456,
                    "leader_id": null,
                    "name": "UserGroup",
                    "name_formatted": "UserGroup",
                    "photo_url": "api\/v1\/members\/1001\/photo",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1234,
                  "last_name": null,
                  "middle_name": null,
                  "name": "user",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User",
                  "name_formatted": "user",
                  "leader_id": null
                }
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({

        url: '//server/otcs/cs/api/v2/members?limit=5&where_type=1&expand=properties{group_id,leader_id}&query=b',
        responseTime: 0,
        type: 'GET',
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "page": 1,
              "page_total": 1,
              "range_max": 5,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members?limit=5&where_type=1&expand=properties{group_id,leader_id}&query=b",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "properties": {
                  birth_date: null,
                  business_email: null,
                  business_fax: null,
                  business_phone: null,
                  cell_phone: null,
                  deleted: 0,
                  first_name: null,
                  gender: null,
                  group_id: null,
                  home_address_1: null,
                  home_address_2: null,
                  home_fax: null,
                  home_phone: null,
                  id: 11503,
                  last_name: null,
                  leader_id: null,
                  middle_name: null,
                  name: "Business Attributes",
                  name_formatted: "Business Attributes",
                  office_location: null,
                  pager: null,
                  personal_email: null,
                  personal_interests: null,
                  personal_url_1: null,
                  personal_url_2: null,
                  personal_url_3: null,
                  personal_website: null,
                  photo_url: null,
                  time_zone: null,
                  title: null,
                  type: 1,
                  type_name: "Group"
                }
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members?limit=20&where_type=0&where_type=1&expand=properties{group_id,leader_id}&query=a',
        responseTime: 0,
        type: 'GET',
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "page": 1,
              "page_total": 1,
              "range_max": 5,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members?limit=20&where_type=0&where_type=1&expand=properties{group_id,leader_id}&query=a",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": {
                    "deleted": false,
                    "id": 1001,
                    "leader_id": 6276,
                    "name": "DefaultGroup",
                    "name_formatted": "DefaultGroup",
                    "photo_url": "api\/v1\/members\/1001\/photo",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User",
                  "name_formatted": "Admin",
                  "initials": "A",
                  "leader_id": null
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": null,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1001,
                  "last_name": null,
                  "middle_name": null,
                  "name": "DefaultGroup",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 1,
                  "type_name": "Group",
                  "name_formatted": "DefaultGroup",
                  "initials": "D",
                  "leader_id": {
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
                    "id": 6276,
                    "last_name": null,
                    "middle_name": null,
                    "name": "testuser",
                    "name_formatted": "testuser",
                    "office_location": null,
                    "pager": null,
                    "personal_email": null,
                    "personal_interests": null,
                    "personal_url_1": null,
                    "personal_url_2": null,
                    "personal_url_3": null,
                    "personal_website": null,
                    "photo_id": null,
                    "photo_url": "api\/v1\/members\/6276\/photo",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  }
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": null,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 2001,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Business Administrators",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 1,
                  "type_name": "Group",
                  "name_formatted": "Business Administrators",
                  "initials": "B",
                  "leader_id": null
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": null,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 15705,
                  "last_name": null,
                  "middle_name": null,
                  "name": "user",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 1,
                  "type_name": "Group",
                  "name_formatted": "user",
                  "initials": "u",
                  "leader_id": null
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": {
                    "deleted": false,
                    "id": 1001,
                    "leader_id": 6276,
                    "name": "DefaultGroup",
                    "name_formatted": "DefaultGroup",
                    "photo_url": "api\/v1\/members\/1001\/photo",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 24739,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Administrator",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_id": null,
                  "photo_url": null,
                  "time_zone": -1,
                  "title": null,
                  "type": 0,
                  "type_name": "User",
                  "name_formatted": "Administrator",
                  "initials": "A",
                  "leader_id": null
                }
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members?limit=5&where_type=0&where_type=1&expand=properties{group_id,leader_id}&query=a',
        responseTime: 0,
        type: 'GET',
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "page": 1,
              "page_total": 1,
              "range_max": 5,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members?limit=5&where_type=0&where_type=1&expand=properties{group_id,leader_id}&query=a",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": {
                    "deleted": false,
                    "id": 1001,
                    "leader_id": null,
                    "name": "DefaultGroup",
                    "name_formatted": "DefaultGroup",
                    "photo_url": "api/v1/members/1001/photo",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User",
                  "name_formatted": "Admin",
                  "leader_id": null
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": "Arabic",
                  "gender": null,
                  "group_id": {
                    "deleted": false,
                    "id": 1001,
                    "leader_id": null,
                    "name": "DefaultGroup",
                    "name_formatted": "DefaultGroup",
                    "photo_url": "api/v1/members/1001/photo",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 41703,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Arabic",
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
                  "type_name": "User",
                  "name_formatted": "Arabic",
                  "leader_id": null
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": "TestUser",
                  "gender": null,
                  "group_id": {
                    "deleted": false,
                    "id": 1001,
                    "leader_id": null,
                    "name": "DefaultGroup",
                    "name_formatted": "DefaultGroup",
                    "photo_url": "api/v1/members/1001/photo",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 41704,
                  "last_name": null,
                  "middle_name": null,
                  "name": "TestUser",
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
                  "type_name": "User",
                  "name_formatted": "TestUser",
                  "leader_id": null
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": {
                    "deleted": false,
                    "id": 1001,
                    "leader_id": null,
                    "name": "DefaultGroup",
                    "name_formatted": "DefaultGroup",
                    "photo_url": "api/v1/members/1001/photo",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User",
                  "name_formatted": "Admin",
                  "leader_id": null
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": null,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1001,
                  "last_name": null,
                  "middle_name": null,
                  "name": "DefaultGroup",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 1,
                  "type_name": "Group",
                  "name_formatted": "DefaultGroup",
                  "leader_id": null
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": null,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 2001,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Business Administrator",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 1,
                  "type_name": "Group",
                  "name_formatted": "Business Administrators",
                  "leader_id": null
                }
              }
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/nodes/11111?fields=properties%7Bcontainer%2C+name%2C+type%2C+versions_control_advanced%2C+permissions_model%7D&fields=permissions%7Bright_id%2C+permissions%2C+type%7D&fields=versions%7Bversion_id%7D&expand=permissions%7Bright_id%7D",
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/8536778?expand=permissions{right_id}&fields=permissions{right_id,permissions,type}&fields=properties{container,name,type}&fields=versions{version_id}",
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
                    "add_major_version",
                    "see",
                    "see_contents"
                  ],
                  "right_id": 1100,
                  "right_id_expand": {
                    "birth_date": "1900-10-31T00:00:00",
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": null,
                    "gender": null,
                    "group_id": 2426,
                    "home_address_1": null,
                    "home_address_2": null,
                    "home_fax": null,
                    "home_phone": null,
                    "id": 1100,
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
                    "time_zone": 4,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "type": "owner"
                },
                {
                  "permissions": [
                    "see",
                    "see_contents"
                  ],
                  "right_id": 1001,
                  "right_id_expand": {
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
                  "permissions": [
                    "see",
                    "see_contents"
                  ],
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
                  "right_id": 2244,
                  "right_id_expand": {
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
                    "name_formatted": "Kristen Smith",
                    "office_location": "Waterloo",
                    "pager": null,
                    "personal_email": null,
                    "personal_interests": null,
                    "personal_url_1": null,
                    "personal_url_2": null,
                    "personal_url_3": null,
                    "personal_website": null,
                    "photo_url": null,
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
                    "modify",
                    "reserve",
                    "see",
                    "see_contents"
                  ],
                  "right_id": 1000,
                  "right_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": null,
                    "gender": null,
                    "group_id": 1001,
                    "home_address_1": null,
                    "home_address_2": null,
                    "home_fax": null,
                    "home_phone": null,
                    "id": 1000,
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
                "container": true,
                "name": "000000_KR",
                "type": 0
              }
            }
          }
        }

      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/members/2244/members?limit=30&page=1&sort=asc_name",
        responseTime: 0,
        responseText: {
          "collection": {
            "paging": {
              "limit": 30,
              "page": 1,
              "page_total": 1,
              "range_max": 1,
              "range_min": 1,
              "total_count": 1
            },
            "sorting": {
              "sort": [{
                "key": "sort",
                "value": "asc_asc_name"
              }]
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/members\/15705\/members?limit=30&page=1&sort=asc_name",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [{
            "data": {
              "properties": {
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
                "id": 6276,
                "initials": "t",
                "last_name": null,
                "middle_name": null,
                "name": "testuser",
                "name_formatted": "testuser",
                "office_location": null,
                "pager": null,
                "personal_email": null,
                "personal_interests": null,
                "personal_url_1": null,
                "personal_url_2": null,
                "personal_url_3": null,
                "personal_website": null,
                "photo_id": null,
                "photo_url": null,
                "time_zone": -1,
                "title": null,
                "type": 0,
                "type_name": "User"
              }
            }
          }]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/44444?expand=properties%7Boriginal_id%7D&expand=permissions%7B44444%7D&fields=properties&actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=editactivex&actions=editofficeonline&actions=editwebdav&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=permissions&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=description&actions=savefilter&actions=collectionCanCollect&actions=removefromcollection',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/44444?expand=permissions{right_id}&fields=permissions{right_id,permissions,type}&fields=properties{container,name,type}&fields=versions{version_id}",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "permissions": [
                {
                  "permissions": [],
                  "right_id": 9458780,
                  "right_id_expand": {
                    "deleted": false,
                    "id": 9458780,
                    "leader_id": null,
                    "name": "Empty group",
                    "name_formatted": "Empty group",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "type": "custom"
                }
              ],
              "properties": {
                "container": true,
                "name": "00 Navya's Test folder",
                "type": 0
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/44444/permissions/effective/1000',
        responseTime: 0,
        responseText: {}
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/44444?expand=properties%7Boriginal_id%7D&expand=permissions%7B44444%7D&fields=properties&actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=editactivex&actions=editofficeonline&actions=editwebdav&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=permissions&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=description&actions=savefilter&actions=collect&actions=remove',
        responseText: '',
        responseTime: 0
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/44444?fields=properties%7Bcontainer%2C+name%2C+type%2C+versions_control_advanced%2C+permissions_model%7D&fields=permissions%7Bright_id%2C+permissions%2C+type%7D&fields=versions%7Bversion_id%7D&expand=permissions%7Bright_id%7D',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members/9458780/members",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "permissions": [
                {
                  "permissions": [],
                  "right_id": 9458780,
                  "right_id_expand": {
                    "deleted": false,
                    "id": 9458780,
                    "leader_id": null,
                    "name": "Empty group",
                    "name_formatted": "Empty group",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "type": "custom"
                }
              ],
              "properties": {
                "container": true,
                "name": "00 Navya's Test folder",
                "type": 0
              }
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/44444?expand=properties%7Boriginal_id%7D&expand=permissions%7B44444%7D&fields=properties&actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=editactivex&actions=editofficeonline&actions=editwebdav&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=permissions&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=description&actions=thumbnail&actions=savefilter&actions=collectionCanCollect&actions=removefromcollection',
        responseText: '',
        responseTime: 0
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/9458780/members?limit=30&page=1&sort=asc_name',
        responseText: {
          "collection": {
            "paging": {
              "limit": 30,
              "page": 1,
              "page_total": -1,
              "range_max": 0,
              "range_min": 1,
              "total_count": 0
            },
            "sorting": {
              "sort": [{
                "key": "sort",
                "value": "asc_asc_name"
              }]
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/members\/116045\/members?limit=30&page=1&sort=asc_name",
                "method": "GET", "name": ""
              }
            }
          },
          "results": {}
        }

      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/9458780/members',
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/members\/9458780\/members",
                "method": "GET",
                "name": ""
              }
            }
          }, "results": {}
        }
      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/nodes/22222?fields=properties%7Bcontainer%2C+name%2C+type%2C+versions_control_advanced%2C+permissions_model%7D&fields=permissions%7Bright_id%2C+permissions%2C+type%7D&fields=versions%7Bversion_id%7D&expand=permissions%7Bright_id%7D",
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/9901863?expand=permissions{right_id}&fields=permissions{right_id,permissions,type}&fields=properties{container,name,type}&fields=versions{version_id}",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "permissions": [
                {
                  "permissions": null,
                  "right_id": null,
                  "type": "owner"
                },
                {
                  "permissions": [
                    "see",
                    "see_contents"
                  ],
                  "right_id": 1001,
                  "right_id_expand": {
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
                  "permissions": [
                    "see",
                    "see_contents"
                  ],
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
                  "right_id": 2244,
                  "right_id_expand": {
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
                    "name_formatted": "Kristen Smith",
                    "office_location": "Waterloo",
                    "pager": null,
                    "personal_email": null,
                    "personal_interests": null,
                    "personal_url_1": null,
                    "personal_url_2": null,
                    "personal_url_3": null,
                    "personal_website": null,
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
                    "modify",
                    "reserve",
                    "see",
                    "see_contents"
                  ],
                  "right_id": 1000,
                  "right_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": null,
                    "gender": null,
                    "group_id": 1001,
                    "home_address_1": null,
                    "home_address_2": null,
                    "home_fax": null,
                    "home_phone": null,
                    "id": 1000,
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
                "name": "dummy-pdf_2.pdf",
                "type": 144
              },
              "versions": [
                {
                  "version_id": 9901863
                }
              ]
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/nodes/33333?fields=properties%7Bcontainer%2C+name%2C+type%2C+versions_control_advanced%2C+permissions_model%7D&fields=permissions%7Bright_id%2C+permissions%2C+type%7D&fields=versions%7Bversion_id%7D&expand=permissions%7Bright_id%7D",
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/9901865?expand=permissions{right_id}&fields=permissions{right_id,permissions,type}&fields=properties{container,name,type}&fields=versions{version_id}",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "permissions": [
                {
                  "permissions": null,
                  "right_id": null,
                  "type": "owner"
                },
                {
                  "permissions": null,
                  "right_id": null,
                  "type": "group"
                },
                {
                  "permissions": [
                    "see",
                    "see_contents"
                  ],
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
                  "right_id": 2244,
                  "right_id_expand": {
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
                    "name_formatted": "Kristen Smith",
                    "office_location": "Waterloo",
                    "pager": null,
                    "personal_email": null,
                    "personal_interests": null,
                    "personal_url_1": null,
                    "personal_url_2": null,
                    "personal_url_3": null,
                    "personal_website": null,
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
                    "modify",
                    "reserve",
                    "see",
                    "see_contents"
                  ],
                  "right_id": 1000,
                  "right_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
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
                    "name": "1000",
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
                "name": "pdf-sample.pdf",
                "type": 144
              },
              "versions": [
                {
                  "version_id": 9901865
                }
              ]
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/nodes/55555?fields=properties%7Bcontainer%2C+name%2C+type%2C+versions_control_advanced%2C+permissions_model%7D&fields=permissions%7Bright_id%2C+permissions%2C+type%7D&fields=versions%7Bversion_id%7D&expand=permissions%7Bright_id%7D",
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/nodes/9901865?expand=permissions{right_id}&fields=permissions{right_id,permissions,type}&fields=properties{container,name,type}&fields=versions{version_id}",
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
                    "add_major_version",
                    "see",
                    "see_contents"
                  ],
                  "right_id": 1100,
                  "right_id_expand": {
                    "birth_date": "1900-10-31T00:00:00",
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": null,
                    "gender": null,
                    "group_id": 2426,
                    "home_address_1": null,
                    "home_address_2": null,
                    "home_fax": null,
                    "home_phone": null,
                    "id": 1100,
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
                    "time_zone": 4,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "type": "owner"
                },
                {
                  "permissions": null,
                  "right_id": null,
                  "type": "group"
                },
                {
                  "permissions": [
                    "see",
                    "see_contents"
                  ],
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
                  "right_id": 2244,
                  "right_id_expand": {
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
                    "name_formatted": "Kristen Smith",
                    "office_location": "Waterloo",
                    "pager": null,
                    "personal_email": null,
                    "personal_interests": null,
                    "personal_url_1": null,
                    "personal_url_2": null,
                    "personal_url_3": null,
                    "personal_website": null,
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
                    "modify",
                    "reserve",
                    "see",
                    "see_contents"
                  ],
                  "right_id": 1000,
                  "right_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": null,
                    "gender": null,
                    "group_id": 1001,
                    "home_address_1": null,
                    "home_address_2": null,
                    "home_fax": null,
                    "home_phone": null,
                    "id": 1000,
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
                "name": "pdf-sample-3.pdf",
                "type": 144
              },
              "versions": [
                {
                  "version_id": 9901865
                }
              ]
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/members?limit=20&page=1&sort=asc_name",
        responseTime: 0,
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "links": {
                "data": {
                  "next": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/members?limit=20&page=2",
                    "method": "GET",
                    "name": "Next"
                  }
                }
              },
              "page": 1,
              "page_total": 1,
              "range_max": 20,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/members?limit=20",
                "method": "GET",
                "name": ""
              }
            }
          }
          ,
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1100,
                  "last_name": null,
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
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
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
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 10863,
                  "last_name": null,
                  "middle_name": null,
                  "name": "usera",
                  "name_formatted": "usera",
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
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 10864,
                  "last_name": null,
                  "middle_name": null,
                  "name": "userb",
                  "name_formatted": "userb",
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
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 10865,
                  "last_name": null,
                  "middle_name": null,
                  "name": "userc",
                  "name_formatted": "userc",
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
                }
              }
            },
            {
              "data": {
                "properties": {
                  "id": 10866,
                  "leader_id": null,
                  "name": "userabc",
                  "name_formatted": "userabc",
                  "type": 1,
                  "type_name": "Group"
                }
              }
            },
            {
              "data": {
                "properties": {
                  "id": 2244,
                  "leader_id": null,
                  "name": "recommender",
                  "name_formatted": "Recommender",
                  "type": 1,
                  "type_name": "Group"
                }
              }
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/members?where_type=1&limit=20&page=1&sort=asc_name",
        responseTime: 0,
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "links": {
                "data": {
                  "next": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/members?limit=20&page=2",
                    "method": "GET",
                    "name": "Next"
                  }
                }
              },
              "page": 1,
              "page_total": 1,
              "range_max": 20,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/members?limit=20&where_type=1",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [{
            "data": {
              "properties": {
                "deleted": false,
                "id": 1001,
                "leader_id": null,
                "name": "DefaultGroup",
                "name_formatted": "DefaultGroup",
                "type": 1,
                "type_name": "Group"
              }
            }
          }, {
            "data": {
              "properties": {
                "deleted": false,
                "id": 2001,
                "leader_id": null,
                "name": "Business Administrators",
                "name_formatted": "Business Administrators",
                "type": 1,
                "type_name": "Group"
              }
            }
          }, {
            "data": {
              "properties": {
                "deleted": false,
                "id": 2069,
                "leader_id": null,
                "name": "eLink",
                "name_formatted": "eLink",
                "type": 1,
                "type_name": "Group"
              }
            }
          }, {
            "data": {
              "properties": {
                "id": 2244,
                "leader_id": null,
                "name": "recommender",
                "name_formatted": "Recommender",
                "type": 1,
                "type_name": "Group"
              }
            }
          }, {
            "data": {
              "properties": {
                "deleted": false,
                "id": 3866,
                "leader_id": null,
                "name": "dummy group",
                "name_formatted": "dummy group",
                "type": 1,
                "type_name": "Group"
              }
            }
          }, {
            "data": {
              "properties": {
                "deleted": false,
                "id": 3976,
                "leader_id": null,
                "name": "My Group",
                "name_formatted": "My Group",
                "type": 1,
                "type_name": "Group"
              }
            }
          }]
        }
      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/members/10866/members?limit=20&page=1&sort=asc_name",
        responseTime: 0,
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "links": {
                "data": {
                  "next": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/members?limit=20&page=2",
                    "method": "GET",
                    "name": "Next"
                  }
                }
              },
              "page": 1,
              "page_total": 1,
              "range_max": 20,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members/10866/members?limit=20&page=1",
                "method": "GET",
                "name": ""
              }
            }
          }
          ,
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 10863,
                  "last_name": null,
                  "middle_name": null,
                  "name": "usera",
                  "name_formatted": "usera",
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
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 10864,
                  "last_name": null,
                  "middle_name": null,
                  "name": "userb",
                  "name_formatted": "userb",
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
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 10865,
                  "last_name": null,
                  "middle_name": null,
                  "name": "userc",
                  "name_formatted": "userc",
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
                }
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/members/2244/members?limit=20&page=1&sort=asc_name",
        responseTime: 0,
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "links": {
                "data": {
                  "next": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/members?limit=20&page=2",
                    "method": "GET",
                    "name": "Next"
                  }
                }
              },
              "page": 1,
              "page_total": 1,
              "range_max": 20,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members/2244/members",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 2244,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 2245,
                  "last_name": null,
                  "middle_name": null,
                  "name": "recommender1",
                  "name_formatted": "recommender1",
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
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 2244,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 2122,
                  "last_name": null,
                  "middle_name": null,
                  "name": "recommender99",
                  "name_formatted": "recommender99",
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
                }
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/members/2244/members?where_type=1&limit=20&page=1&sort=asc_name",
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members/2244/members",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 2244,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 2245,
                  "last_name": null,
                  "middle_name": null,
                  "name": "recommender1",
                  "name_formatted": "recommender1",
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
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 2244,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 2122,
                  "last_name": null,
                  "middle_name": null,
                  "name": "recommender99",
                  "name_formatted": "recommender99",
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
                }
              }
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v2/members/2244/members",
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members/2244/members",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 2244,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 2245,
                  "last_name": null,
                  "middle_name": null,
                  "name": "recommender1",
                  "name_formatted": "recommender1",
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
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 2244,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 2122,
                  "last_name": null,
                  "middle_name": null,
                  "name": "recommender99",
                  "name_formatted": "recommender99",
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
                }
              }
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v2/nodes/11111'),
        responseTime: 0,
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/3862",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "categories": [{
                "28705_2": null
              }],
              "columns": [{
                "data_type": 2,
                "key": "type",
                "name": "Type",
                "sort_key": "x3209"
              }, {
                "data_type": -1,
                "key": "name",
                "name": "Name",
                "sort_key": "x3206"
              }, {
                "data_type": -1,
                "key": "size_formatted",
                "name": "Size",
                "sort_key": "x3207"
              }, {
                "data_type": 401,
                "key": "modify_date",
                "name": "Modified",
                "sort_key": "x3205"
              }],
              "properties": {
                "container": true,
                "container_size": 4,
                "create_date": "2017-08-16T12:26:56",
                "create_user_id": 1000,
                "description": "test",
                "description_multilingual": {
                  "en_US": "test"
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 3862,
                "mime_type": null,
                "modify_date": "2017-08-31T12:30:38",
                "modify_user_id": 1000,
                "name": "006 Bhaskar",
                "name_multilingual": {
                  "en_US": "006 Bhaskar"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2000,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 4,
                "size_formatted": "4 Items",
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
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
