/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery.mockjax'
], function (_, mockjax) {
  'use strict';

  var ActivityMock = function ActivityMock() {
  };

  ActivityMock._nodeDataLinkToDoc = {
    "actions": {
      "data": {
        "open": {
          "body": "",
          "content_type": "",
          "form_href": "",
          "href": "\/api\/v2\/nodes\/436537\/content",
          "method": "GET",
          "name": "Open"
        }
      }, "map": {"default_action": "open"}, "order": ["open"]
    },
    "data": {
      "properties": {
        "container": false,
        "container_size": 0,
        "create_date": "2018-01-05T13:49:30",
        "create_user_id": 1000,
        "description": "",
        "description_multilingual": {"de_DE": "", "en": "", "en_US": ""},
        "external_create_date": null,
        "external_identity": "",
        "external_identity_type": "",
        "external_modify_date": null,
        "external_source": "",
        "favorite": false,
        "id": 437852,
        "mime_type": null,
        "modify_date": "2018-01-05T13:52:52",
        "modify_user_id": 1000,
        "name": "Document.pdf (Link)",
        "name_multilingual": {"de_DE": "", "en": "Document.pdf (Link)", "en_US": ""},
        "original_id": 436537,
        "original_id_expand": {
          "container": false,
          "container_size": 0,
          "create_date": "2018-01-05T13:44:08",
          "create_user_id": 1000,
          "description": "",
          "description_multilingual": {"de_DE": "", "en": "", "en_US": ""},
          "external_create_date": null,
          "external_identity": "",
          "external_identity_type": "",
          "external_modify_date": null,
          "external_source": "",
          "favorite": false,
          "id": 436537,
          "mime_type": "application\/pdf",
          "modify_date": "2018-01-05T13:44:17",
          "modify_user_id": 1000,
          "name": "Document.pdf",
          "name_multilingual": {"de_DE": "", "en": "Document.pdf", "en_US": ""},
          "owner": "Mighty, Mighty Administrator",
          "owner_group_id": 1001,
          "owner_user_id": 1000,
          "parent_id": 436518,
          "permissions_model": "advanced",
          "reserved": false,
          "reserved_date": null,
          "reserved_shared_collaboration": false,
          "reserved_user_id": 0,
          "size": 781494,
          "size_formatted": "764 KB",
          "type": 144,
          "type_name": "Document",
          "versions_control_advanced": false,
          "volume_id": -2000
        },
        "owner": "Mighty, Mighty Administrator",
        "owner_group_id": 1001,
        "owner_user_id": 1000,
        "parent_id": 437506,
        "permissions_model": "advanced",
        "reserved": false,
        "reserved_date": null,
        "reserved_shared_collaboration": false,
        "reserved_user_id": 0,
        "size": null,
        "size_formatted": "",
        "type": 1,
        "type_name": "Shortcut",
        "versions_control_advanced": false,
        "volume_id": -2023
      }
    }
  };

  ActivityMock._nodeDataDoc = {
    "actions": {
      "data": {
        "open": {
          "body": "",
          "content_type": "",
          "form_href": "",
          "href": "\/api\/v2\/nodes\/437383\/content",
          "method": "GET",
          "name": "Open"
        }
      }, "map": {"default_action": "open"}, "order": ["open"]
    },
    "data": {
      "properties": {
        "container": false,
        "container_size": 0,
        "create_date": "2018-01-05T13:44:08",
        "create_user_id": 1000,
        "description": "",
        "description_multilingual": {"de_DE": "", "en": "", "en_US": ""},
        "external_create_date": null,
        "external_identity": "",
        "external_identity_type": "",
        "external_modify_date": null,
        "external_source": "",
        "favorite": false,
        "id": 437383,
        "mime_type": "application\/pdf",
        "modify_date": "2018-01-05T13:52:26",
        "modify_user_id": 1000,
        "name": "Document.pdf",
        "name_multilingual": {"de_DE": "", "en": "Document.pdf", "en_US": ""},
        "owner": "Mighty, Mighty Administrator",
        "owner_group_id": 1001,
        "owner_user_id": 1000,
        "parent_id": 437506,
        "permissions_model": "advanced",
        "reserved": false,
        "reserved_date": null,
        "reserved_shared_collaboration": false,
        "reserved_user_id": 0,
        "size": 781494,
        "size_formatted": "764 KB",
        "type": 144,
        "type_name": "Document",
        "versions_control_advanced": false,
        "volume_id": -2023
      }
    }
  };

  ActivityMock._nodeDataLinkToWorkflow = {
    "actions": {
      "data": {}, "map": {"default_action": "open"}, "order": []
    },
    "data": {
      "properties": {
        "container": false,
        "container_size": 0,
        "create_date": "2018-01-05T13:49:47",
        "create_user_id": 1000,
        "description": "",
        "description_multilingual": {"de_DE": "", "en": "", "en_US": ""},
        "external_create_date": null,
        "external_identity": "",
        "external_identity_type": "",
        "external_modify_date": null,
        "external_source": "",
        "favorite": false,
        "id": 437853,
        "mime_type": null,
        "modify_date": "2018-01-05T13:53:19",
        "modify_user_id": 1000,
        "name": "LPAD-61174 - Workflow (Link)",
        "name_multilingual": {"de_DE": "", "en": "LPAD-61174 - Workflow (Link)", "en_US": ""},
        "original_id": 437174,
        "original_id_expand": {
          "container": false,
          "container_size": 2,
          "create_date": "2018-01-05T13:42:56",
          "create_user_id": 1000,
          "description": "",
          "description_multilingual": {"de_DE": "", "en": "", "en_US": ""},
          "external_create_date": null,
          "external_identity": "",
          "external_identity_type": "",
          "external_modify_date": null,
          "external_source": "",
          "favorite": true,
          "id": 437174,
          "mime_type": null,
          "modify_date": "2018-01-05T13:43:48",
          "modify_user_id": 1000,
          "name": "LPAD-61174 - Workflow",
          "name_multilingual": {"de_DE": "", "en": "LPAD-61174 - Workflow", "en_US": ""},
          "owner": "Mighty, Mighty Administrator",
          "owner_group_id": 1001,
          "owner_user_id": 1000,
          "parent_id": 436518,
          "permissions_model": "advanced",
          "reserved": false,
          "reserved_date": null,
          "reserved_shared_collaboration": false,
          "reserved_user_id": 0,
          "size": null,
          "size_formatted": "3 KB",
          "type": 128,
          "type_name": "Initiate Workflow",
          "versions_control_advanced": false,
          "volume_id": -2000
        },
        "owner": "Mighty, Mighty Administrator",
        "owner_group_id": 1001,
        "owner_user_id": 1000,
        "parent_id": 437506,
        "permissions_model": "advanced",
        "reserved": false,
        "reserved_date": null,
        "reserved_shared_collaboration": false,
        "reserved_user_id": 0,
        "size": null,
        "size_formatted": "",
        "type": 1,
        "type_name": "Shortcut",
        "versions_control_advanced": false,
        "volume_id": -2023
      }
    }
  };

  ActivityMock.prepareDefaultActivitiesData = function () {

    var now = new Date();
    ActivityMock._dates = {
      'now': now,
      'beforeaday': new Date(now.getTime() - (24 * 60 * 60 * 1000)),
      'beforeamonth': new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)),
      'beforeayear': new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000))
    }

    ActivityMock._activities = [{
      'date': this._dates.now.toJSON(),
      'user_id': 1002,
      'action': 'sendon',
      'comment': 'Please take a look into the attached document. It could contain interesting' +
                 ' stuff for you!'
    }, {
      'date': this._dates.beforeaday.toJSON(),
      'user_id': 1002,
      'action': 'forward',
      'action_properties': {
        'user_id': 1002
      },
      'comment': 'I forwarded this task to you, because I am on vacation for the next 3 weeks.'
    }, {
      'date': this._dates.beforeamonth.toJSON(),
      'user_id': 1002,
      'action': 'reply',
      'comment': 'Your approval seems OK to me. Go ahead!'
    }, {
      'date': this._dates.beforeamonth.toJSON(),
      'user_id': 1002,
      'action': 'review',
      'action_properties': {
        'user_id': 1002
      },
      'comment': 'Hi Matt, can you please review my approval? It is urgent! So please work on' +
                 ' this ASAP!\n\nThanks Bruce'
    }, {
      'date': this._dates.beforeayear.toJSON(),
      'user_id': 1002,
      'action': 'sendon',
      'comment': null
    }, {
      'date': this._dates.beforeayear.toJSON(),
      'user_id': 1002,
      'action': 'disposition',
      'action_properties': {
        'event': 'reject',
        'label': 'Reject Approval'
      },
      'comment': 'I guess we should reject this customer request!'
    }, {
      'date': this._dates.beforeayear.toJSON(),
      'user_id': 1002,
      'action': 'start',
      'comment': 'I am starting this workflow'
    }, {
      'date': this._dates.beforeayear.toJSON(),
      'user_id': 1002,
      'action': 'attachment',
      'action_properties': {
        'event': 'create',
        'node': {
          'id': 4711,
          'name': 'Hardware Renewal Request, John Doe',
          'description': 'This is an auto-generated document containing the renewal details.',
          'type': 144,
          'mime_type': 'application/pdf'
        },
      },
      'comment': null
    }, {
      'date': this._dates.beforeayear.toJSON(),
      'user_id': 1002,
      'action': 'attachment',
      'action_properties': {
        'event': 'addversion',
        'node': {
          'id': 4711,
          'name': 'Hardware Renewal Request, John Doe',
          'description': 'Changed the document.',
          'type': 144,
          'mime_type': 'application/pdf'
        }
      },
      'comment': null
    }, {
      'date': this._dates.beforeayear.toJSON(),
      'user_id': null,
      'action': 'forward',
      'action_properties': {
        'user_id': null
      },
      'comment': 'From anonymous to anonymous.'
    }];
  };

  ActivityMock.prepareDefaultNodesData = function () {
    ActivityMock._nodes = ActivityMock._nodeDataDoc;
  };

  ActivityMock.activitiesResult = function () {
    var ret = {
      'links': {
        'data': {
          'self': {
            'body': '',
            'content_type': '',
            'href': ActivityMock._activitiesUrl,
            'method': 'GET',
            'name': ''
          }
        }
      },
      'results': {
        'data': _.values(ActivityMock._activities)
      }
    };
    return ret;
  };

  ActivityMock.nodesResult = function () {
    var ret = {
      'links': {
        'data': {
          'self': {
            'body': '',
            'content_type': '',
            'href': '\/api\/v2\/nodes\/*?actions',
            'method': 'GET',
            'name': ''
          }
        }
      },
      'results': ActivityMock._nodes
    }
    return ret;
  };
  ActivityMock.enable = function (activities, nodes) {
    ActivityMock._activitiesUrl = '//server/otcs/cs/api/v2/processes/x/subprocesses/x/activities';
    ActivityMock._mocks = [];
    ActivityMock._activities = [];
    ActivityMock._nodesUrl = new RegExp('//server/otcs/cs/api/v2/nodes/*?([^/?]+)' + '(\\?.*)?$');
    ActivityMock._nodes = [];
    if (!activities) {
      ActivityMock.prepareDefaultActivitiesData();
    } else {
      ActivityMock._activities = activities;
    }

    if (!nodes) {
      ActivityMock.prepareDefaultNodesData();
    } else {
      ActivityMock._nodes = nodes;
    }
    ActivityMock._mocks.push(mockjax({
      url: ActivityMock._activitiesUrl,
      response: function (settings) {
        this.responseText = ActivityMock.activitiesResult();
      }
    }));
    ActivityMock._mocks.push(mockjax({
      url: ActivityMock._nodesUrl,
      response: function (settings) {
        this.responseText = ActivityMock.nodesResult();
      }
    }));
  };
  ActivityMock.disable = function () {
    var mock;
    while ((mock = ActivityMock._mocks.pop())) {
      mockjax.clear(mock);
    }
  };
  return ActivityMock;
});
 