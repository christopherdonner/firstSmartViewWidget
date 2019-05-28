/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1111',
        responseTime: 0,
        responseText: {}
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/1111?fields=properties',
        responseTime: 0,
        responseText: {}
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2000*',
        responseTime: 0,
        responseText: [
          {
            "data": {
              "id": 2000,
              "name": "Enterprise",
              "volume_id": -2000,
              "parent_id": -1,
              "type": 141,
              "type_name": "Enterprise Workspace"
            }
          }
        ]
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/ancestors',
        responseTime: 0,
        responseText: [
          {
            "ancestors": [{
              "id": 2000,
              "name": "Enterprise",
              "volume_id": -2000,
              "parent_id": -1,
              "type": 141,
              "type_name": "Enterprise Workspace"
            }, {
              "id": 69544,
              "name": "Alberi - Demo Content",
              "volume_id": -2000,
              "parent_id": 2000,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 68880,
              "name": "Water Management",
              "volume_id": -2000,
              "parent_id": 69544,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 68333,
              "name": "Water pumps",
              "volume_id": -2000,
              "parent_id": 68880,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 240231,
              "name": "Classic 3000\/6",
              "volume_id": -2000,
              "parent_id": 68333,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 305354,
              "name": "CS16_versions_spec.pdf",
              "volume_id": -2000,
              "parent_id": 240231,
              "type": 144,
              "type_name": "Document"
            }]
          }
        ]
      }));

      mocks.push(mockjax({
        url: '/nodes/69321/ancestors',
        responseTime: 0,
        responseText: [
          {
            "ancestors": [{
              "id": 2000,
              "name": "Enterprise",
              "volume_id": -2000,
              "parent_id": -1,
              "type": 141,
              "type_name": "Enterprise Workspace"
            }, {
              "id": 69544,
              "name": "Alberi - Demo Content",
              "volume_id": -2000,
              "parent_id": 2000,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 68880,
              "name": "Water Management",
              "volume_id": -2000,
              "parent_id": 69544,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 68333,
              "name": "Water pumps",
              "volume_id": -2000,
              "parent_id": 68880,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 240231,
              "name": "Classic 3000\/6",
              "volume_id": -2000,
              "parent_id": 68333,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 305354,
              "name": "CS16_versions_spec.pdf",
              "volume_id": -2000,
              "parent_id": 240231,
              "type": 144,
              "type_name": "Document"
            }]
          }
        ]
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs',
        responseTime: 5,
        responseText: function (settings) {
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/members\\?limit=20&where_type=0&where_type=1&expand_fields=group_id&expand_fields=leader_id&query=(.*)$'),
        responseTime: 0,
        responseText: {
          "data": [
            {
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
              "privilege_login": true,
              "privilege_modify_groups": true,
              "privilege_modify_users": true,
              "privilege_public_access": true,
              "privilege_system_admin_rights": true,
              "privilege_user_admin_rights": true,
              "time_zone": null,
              "title": null,
              "type": 0,
              "type_name": "User",
              "name_formatted": "Admin",
              "leader_id": null
            },
            {
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
              "privilege_login": true,
              "privilege_modify_groups": false,
              "privilege_modify_users": false,
              "privilege_public_access": true,
              "privilege_system_admin_rights": false,
              "privilege_user_admin_rights": false,
              "time_zone": -1,
              "title": null,
              "type": 0,
              "type_name": "User",
              "name_formatted": "Arabic",
              "leader_id": null
            },
            {
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
              "privilege_login": true,
              "privilege_modify_groups": false,
              "privilege_modify_users": false,
              "privilege_public_access": true,
              "privilege_system_admin_rights": false,
              "privilege_user_admin_rights": false,
              "time_zone": -1,
              "title": null,
              "type": 0,
              "type_name": "User",
              "name_formatted": "TestUser",
              "leader_id": null
            },
            {
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
              "privilege_login": true,
              "privilege_modify_groups": true,
              "privilege_modify_users": true,
              "privilege_public_access": true,
              "privilege_system_admin_rights": true,
              "privilege_user_admin_rights": true,
              "time_zone": null,
              "title": null,
              "type": 0,
              "type_name": "User",
              "name_formatted": "Admin",
              "leader_id": null
            },
            {
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
              "privilege_login": false,
              "privilege_modify_groups": false,
              "privilege_modify_users": false,
              "privilege_public_access": false,
              "privilege_system_admin_rights": false,
              "privilege_user_admin_rights": false,
              "time_zone": null,
              "title": null,
              "type": 1,
              "type_name": "Group",
              "name_formatted": "DefaultGroup",
              "leader_id": null
            },
            {
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
              "privilege_login": false,
              "privilege_modify_groups": false,
              "privilege_modify_users": false,
              "privilege_public_access": false,
              "privilege_system_admin_rights": false,
              "privilege_user_admin_rights": false,
              "time_zone": null,
              "title": null,
              "type": 1,
              "type_name": "Group",
              "name_formatted": "Business Administrators",
              "leader_id": null
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/members\\?limit=20&where_type=0&where_type=1&expand_fields=group_id&expand_fields=leader_id&query=(.*)$'),
        responseTime: 0,
        responseText: {
          "data": [
            {
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
              "privilege_login": true,
              "privilege_modify_groups": true,
              "privilege_modify_users": true,
              "privilege_public_access": true,
              "privilege_system_admin_rights": true,
              "privilege_user_admin_rights": true,
              "time_zone": null,
              "title": null,
              "type": 0,
              "type_name": "User",
              "name_formatted": "Admin",
              "leader_id": null
            },
            {
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
              "privilege_login": false,
              "privilege_modify_groups": false,
              "privilege_modify_users": false,
              "privilege_public_access": false,
              "privilege_system_admin_rights": false,
              "privilege_user_admin_rights": false,
              "time_zone": null,
              "title": null,
              "type": 1,
              "type_name": "Group",
              "name_formatted": "DefaultGroup",
              "leader_id": null
            },
            {
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
              "photo_url": null,
              "privilege_login": false,
              "privilege_modify_groups": false,
              "privilege_modify_users": false,
              "privilege_public_access": false,
              "privilege_system_admin_rights": false,
              "privilege_user_admin_rights": false,
              "time_zone": null,
              "title": null,
              "type": 1,
              "type_name": "Group",
              "name_formatted": "Business Administrators",
              "leader_id": null
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
