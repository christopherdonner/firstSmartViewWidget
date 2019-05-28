/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param',
  'json!./tklfield.data.json',
  'csui/utils/deepClone/deepClone'
], function (_, mockjax, parseParam, mocked) {
  'use strict';
  var mocks = [];

  return {
    enable: function () {

      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/tklattribute/validvalues'),
        response: function (settings) {
          if (!!settings.data.attribute_values) {
            var attribute_values = JSON.parse(settings.data.attribute_values),
                attribute_key    = settings.data.attribute_key,
                parent           = mocked[settings.data.attribute_key]["parent"];
            this.responseText = {};
            this.responseText[attribute_key] = !!mocked[attribute_values[parent]] ?
                                               mocked[attribute_values[parent]] : [""];
          } else {
            this.responseText = mocked;
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp(
            '//server/otcs/cs/api/v1/members\\?limit=20&where_type=0&expand_fields=group_id&expand_fields=leader_id&query=(.*)$'),
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
              "name": "CWS",
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
              "name_formatted": "CWS",
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
              "name": "Enterprise",
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
              "name_formatted": "Enterprise",
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
              "name": "Content Server Policies",
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
              "name_formatted": "Content Server Policies",
              "leader_id": null
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/nodes/162675/categories'),
        response: function (settings) {
          this.responseText = {};
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/nodes/14106/categories'),
        response: function (settings) {
          this.responseText = {};
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/nodes/14105/categories'),
        response: function (settings) {
          this.responseText = {};
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/nodes/60717/categories'),
        response: function (settings) {
          this.responseText = {};
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/nodes/60663/categories'),
        response: function (settings) {
          this.responseText = {};
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/tklattribute/defaultvalues',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/tklattribute\/defaultvalues",
                "method": "POST",
                "name": ""
              }
            }
          }, "results": {"data": {}}
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
