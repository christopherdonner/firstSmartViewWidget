/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(function () {
  'use strict';

  return [
    {
      equals: {type: 215},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'view',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: [130, 134]},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'view',
          objId: node.get('id'),
          show: 1,
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 206},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseTask',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 204},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseTaskList',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 205},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseTaskGroup',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 212},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'BrowseMilestone',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 207},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'ViewChannel',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 208},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'ViewNews',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 218},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'OpenPoll',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 223},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'EditForm',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 299},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'RunReport',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 384},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'ProspectorBrowse',
          objId: node.get('id'),
          order: '-SCORE',
          summaries: 1,
          nexturl: location.href
        };
      }
    },
    {
      equals: {type: 31214},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'addresubmission',
          RS_FUNCTION: 'Edit',
          RSID: node.get('followup_id'),
          objId: node.get('location_id'),
          nexturl: location.href
        };
      }
    }
  ];
});
