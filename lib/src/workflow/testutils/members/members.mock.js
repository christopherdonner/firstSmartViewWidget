/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery.mockjax'
], function (_, mockjax) {
  'use strict';

  var MembersMock = function MembersMock() {
  };

  MembersMock._groupTemplate = {
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
    "id": 10800,
    "last_name": null,
    "middle_name": null,
    "name": "",
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
    "name_formatted": "",
    "leader_id": null
  };

  MembersMock._groupLeaderTemplate = {
    "birth_date": null,
    "business_email": "",
    "business_fax": null,
    "business_phone": null,
    "cell_phone": "",
    "deleted": false,
    "first_name": "",
    "gender": null,
    "group_id": 10800,
    "home_address_1": "",
    "home_address_2": "",
    "home_fax": "",
    "home_phone": "",
    "id": 10587,
    "last_name": "",
    "middle_name": null,
    "name": "",
    "office_location": "",
    "pager": "",
    "personal_email": "",
    "personal_interests": "",
    "personal_url_1": "",
    "personal_url_2": "",
    "personal_url_3": "",
    "personal_website": "",
    "photo_url": "",
    "privilege_login": true,
    "privilege_modify_groups": false,
    "privilege_modify_users": false,
    "privilege_public_access": true,
    "privilege_system_admin_rights": false,
    "privilege_user_admin_rights": false,
    "time_zone": -1,
    "title": "",
    "type": 0,
    "type_name": ""
  }

  MembersMock._userTemplate = {
    "birth_date": null,
    "business_email": null,
    "business_fax": null,
    "business_phone": null,
    "cell_phone": null,
    "deleted": 0,
    "first_name": "",
    "gender": null,
    "group_id": null,
    "home_address_1": null,
    "home_address_2": null,
    "home_fax": null,
    "home_phone": null,
    "id": 18279,
    "last_name": null,
    "middle_name": null,
    "name": "",
    "office_location": null,
    "pager": null,
    "personal_email": null,
    "personal_interests": null,
    "personal_url_1": null,
    "personal_url_2": null,
    "personal_url_3": null,
    "personal_website": null,
    "photo_url": "",
    "privilege_login": true,
    "privilege_modify_groups": false,
    "privilege_modify_users": false,
    "privilege_public_access": true,
    "privilege_system_admin_rights": false,
    "privilege_user_admin_rights": false,
    "time_zone": null,
    "title": null,
    "type": 0,
    "type_name": "User",
    "name_formatted": "",
    "leader_id": null
  };

  MembersMock.createGroupLeader = function (leaders) {
    _.each(leaders, function (current) {
      MembersMock._leaders[current.name] = _.extend(_.clone(MembersMock._groupLeaderTemplate),
          current);
    });
  };

  MembersMock.createUserGroup = function (groups) {
    _.each(groups, function (current) {
      MembersMock._groups[current.name] = _.extend(_.clone(MembersMock._userGroupTemplate),
          current);
    });
  };

  MembersMock.createMembers = function (members) {
    var member;
    _.each(members, function (current) {
      if (current.type === 0) {
        if (current.group_id !== null) {
          var group = _.findWhere(MembersMock._groups, {id: current.group_id});
          if (!_.isUndefined(group)) {
            current.group_id = group;
          }
        }
        MembersMock._members[current.name] = _.extend(_.clone(MembersMock._userTemplate), current);
      } else if (current.type === 1) {
        if (current.leader_id !== null) {
          var leader = _.findWhere(MembersMock._leaders, {id: current.leader_id});
          if (!_.isUndefined(leader)) {
            current.leader_id = leader;
          }
        }
        MembersMock._members[current.name] = _.extend(_.clone(MembersMock._groupTemplate), current);
      }
    });
  };

  MembersMock.membersResultArray = function () {
    var ret = {
      "links": {
        "self": {
          "body": "",
          "content_type": "",
          "href": MembersMock._membersUrl,
          "method": "GET",
          "name": ""
        }
      },
      "data": _.values(MembersMock._members)
    };
    return ret;
  };

  MembersMock.v2MembersResultArray = function () {
    var memberData = [];
    var properties ={};
    var data ={};
    _.each(_.values(MembersMock._members), function (currentMember) {
      properties = {"properties": currentMember};
      data = {"data": properties};
      memberData.push(data);
    });
    var ret = {
      "links": {
        "self": {
          "body": "",
          "content_type": "",
          "href": MembersMock._membersUrl,
          "method": "GET",
          "name": ""
        }
      },
      "results": memberData
    };
    return ret;
  };

  MembersMock.membersResultSingle = function () {
    var ret = {
      "links": {
        "self": {
          "body": "",
          "content_type": "",
          "href": MembersMock._membersUrl,
          "method": "GET",
          "name": ""
        }
      },
      "data": _.values(MembersMock._members)[0]
    };
    return ret;
  };

  MembersMock.prepareDefaultData = function () {

    MembersMock.createUserGroup([
      {
        id: 101,
        type: 1,
        name: 'Famous Actors',
        display_name: 'Famous Actors',
        name_formatted: 'Famous Actors'
      }
    ]);
    MembersMock.createGroupLeader([
      {
        id: 1001,
        type: 0,
        name: 'bwillis',
        display_name: 'Bruce Willis',
        name_formatted: 'Bruce Willis'
      }
    ]);
    MembersMock.createMembers([
      {
        id: 1002,
        type: 0,
        name: 'bwillis',
        business_email: 'bwillis@elink.loc',
        office_location: 'Nakatomi Plaza (Office Building in Los Angeles)',
        title: 'New York Police Officer (Retired)',
        display_name: 'Bruce Willis',
        name_formatted: 'Bruce Willis',
        group_id: 101
      },
      {
        id: 1003,
        type: 0,
        name: 'cnorris',
        display_name: 'Chuck Norris',
        name_formatted: 'Chuck Norris',
        group_id: 101
      },
      {
        id: 1004,
        type: 0,
        name: 'jrambo',
        display_name: 'John Rambo',
        name_formatted: 'John Rambo',
        group_id: 101
      },
      {
        id: 102,
        type: 1,
        name: 'Super Heroes',
        display_name: 'Super Heroes',
        name_formatted: 'Super Heroes',
        leader_id: 1001
      }
    ]);
  };
  MembersMock.enable = function (data) {
    MembersMock._membersUrl = '//server/otcs/cs/api/v1/members*';
    MembersMock._v2MembersUrl = '//server/otcs/cs/api/v2/members*';
    MembersMock._mocks = [];
    MembersMock._members = {};
    MembersMock._leaders = {};
    MembersMock._groups = {};
    MembersMock._roles = {};
    if (!data){
      MembersMock.prepareDefaultData();
      MembersMock._mocks.push(mockjax({
        url: MembersMock._membersUrl,
        response: function (settings) {
          this.responseText = MembersMock.membersResultArray();
        }
      }));
      MembersMock._mocks.push(mockjax({
        url: MembersMock._v2MembersUrl,
        response: function (settings) {
          this.responseText = MembersMock.v2MembersResultArray();
        }
      }));
    } else {
      MembersMock.createMembers([data]);
      MembersMock._mocks.push(mockjax({
        url: MembersMock._membersUrl,
        response: function (settings) {
          this.responseText = MembersMock.membersResultSingle();
        }
      }));
    }
  };
  MembersMock.disable = function () {
    var mock;
    while ((mock = MembersMock._mocks.pop())) {
      mockjax.clear(mock);
    }
  };
  return MembersMock;

});
