/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/models/node/node.model',
  'csui/models/nodechildren',
  'csui/utils/contexts/page/page.context',
  'workflow/testutils/activity/activity.mock',
  'workflow/testutils/workitem/workitem.mock',
  'workflow/testutils/members/members.mock',
  'workflow/models/workitem/workitem.model',
  'workflow/models/workflow/workflow.model',
  'workflow/models/wfstatus/wfstatus.model',
  'csui/utils/contexts/factories/connector',
  'json!./workitem/action.data.json'
], function (_, $, Backbone, NodeModel, NodeChildrenCollection, PageContext, ActivityMock,
    WorkItemMock, MembersMock, WorkItemModel, WorkflowModel, WFStatusModel, ConnectorFactory,
    ActionData) {
  'use strict';

  var workItemMock = WorkItemMock;

  var membersMock = MembersMock;

  var activityMock = ActivityMock;

  function getContext() {
    return new PageContext({
      factories: {
        connector: {
          connection: {
            url: '//server/otcs/cs/api/v1',
            supportPath: '/support',
            session: {
              ticket: 'dummy'
            }
          },
          assignTo: function assignTo(model) {
            model.connector = this;
          }
        }
      }
    });
  }

  function getConnector(context) {
    return context.getObject(ConnectorFactory);
  }

  function getWorkitemStatusModel(context, options) {
    var connector = context.getObject(ConnectorFactory);
    return new WFStatusModel({
      retention: options.retention,
      filterWorkflowtype: options.filterWorkflowtype
    }, _.extend({
      connector: connector
    }));
  }

  function getSimpleWorkItemModel(context, processId) {
    var connector = context.getObject(ConnectorFactory);
    processId = processId || 1;
    return new WorkItemModel({
      process_id: processId,
      subprocess_id: 1,
      task_id: 1
    }, _.extend({
      connector: connector
    }));
  }

  function getSimpleWorkItemModelForDraftProcess(context, draftProcessId) {
    var connector = context.getObject(ConnectorFactory);
    return new WorkItemModel({
      process_id: draftProcessId,
      isDraft: true
    }, _.extend({
      connector: connector
    }));
  }

  function getListOfWorkflowMapsAvailableForDocument(context, docIdList, parent_id) {
    var connector = context.getObject(ConnectorFactory);
    return new WorkflowModel({
      DocIDs: docIdList,
      ParentID: parent_id
    }, _.extend({
      connector: connector
    }));
  }

  function getDocModel(context, docId) {
    var connector = context.getObject(ConnectorFactory);
    return new NodeModel({
      "type": 1,
      "type_name": "Shortcut",
      "container": false,
      "name": "test.jpg",
      "original_id": docId,
      "original_id_expand": ""
    }, {connector: connector});
  }

  function getSimpleWorkItemModelWithAction(context, processId) {
    var connector = context.getObject(ConnectorFactory);
    processId = processId || 1;
    return new WorkItemModel({
      data: {
        process_id: processId,
        subprocess_id: 1,
        task_id: 1,
        actions: [{
          "key": "SendOn",
          "label": "SendOnLabel"
        }]
      }
    }, _.extend({
      connector: connector,
      parse: true
    }));
  }

  function getSimpleWorkItemModelWithMaxDispositions(context, processId) {
    var connector = context.getObject(ConnectorFactory);
    processId = processId || 1;
    return new WorkItemModel({
      data: {
        process_id: processId,
        subprocess_id: 1,
        task_id: 1,
        actions: [{
          "key": "SendOn",
          "label": "SendOnLabel"
        }],
        custom_actions: [
          {
            "key": "Disp01",
            "label": "Disp01Label"
          },
          {
            "key": "Disp02",
            "label": "Disp02Label"
          },
          {
            "key": "Disp03",
            "label": "Disp03Label"
          },
          {
            "key": "Disp04",
            "label": "Disp04Label"
          },
          {
            "key": "Disp05",
            "label": "Disp05Label"
          }
        ]
      }
    }, _.extend({
      connector: connector,
      parse: true
    }));
  }

  function getWorkItemModel(context, data, actions) {
    actions || (actions = [{
      id: 'standard-SendOn',
      key: 'SendOn',
      label: 'Send On'
    }]);
    data || (data = {
      process_id: 1,
      subprocess_id: 1,
      task_id: 1,
      title: 'workitem title'
    });
    data.actions = actions;
    return new WorkItemModel({data: data}, _.extend({
      connector: context.getObject(ConnectorFactory),
      parse: true
    }));
  }

  function getSimpleDraftWorkItemModel(context, draftProcessId) {
    var connector = context.getObject(ConnectorFactory);
    draftProcessId = draftProcessId || 1;
    return new WorkItemModel({
      process_id: draftProcessId,
      isDraft: true
    }, _.extend({
      connector: connector
    }));
  }

  function isWorkItemFetched(model) {
    var modelFetched = model && model.title() && model.title().length > 0;
    return modelFetched
  }

  function isWorkItemRendered(jqueryElement, className) {
    className = className || ".workitem-body-row";
    return jqueryElement.find(className).length > 0;
  }

  function getWorkflowAttachments(context, folderId) {
    folderId = folderId || 4711;
    return new NodeChildrenCollection(undefined, {
      node: new NodeModel({id: folderId}, {connector: context.getObject(ConnectorFactory)}),
      includeActions: false,
      delayRestCommands: true,
      expand: ['node'],
      commands: ['openshortlink', 'download', 'properties', "rename", "delete", "default",
        "addcategory"]
    });
  }

  function getWorkflowAttachmentFolder(context, folderId) {
    folderId = folderId || 4711;
    return new NodeModel({id: folderId}, {connector: context.getObject(ConnectorFactory)});
  }

  function getWorkflowAttachmentAddableTypes(addableTypes) {
    addableTypes = addableTypes || [{type: 0}, {type: 1}, {type: 144}];

    return new Backbone.Collection(addableTypes);
  }

  function getActions() {
    return ActionData;
  }
  function _clearTimers(timeout, interval) {
    clearTimeout(timeout);
    clearInterval(interval);
  }
  function waitUntil(escapeFunction, maxWait, checkDelay) {
    var _maxWait = maxWait || 1000;
    var _checkDelay = checkDelay || 100;

    var _deferredObject = $.Deferred();

    var maxWaitTimeout;
    var interval = setInterval(function () {
      try {
        var escapeFunctionRes = escapeFunction();

        if (escapeFunctionRes) {
          _clearTimers(maxWaitTimeout, interval);

          _deferredObject.resolve(escapeFunctionRes);
        }
      } catch (e) {
        _clearTimers(maxWaitTimeout, interval);

        _deferredObject.reject(e);
      }
    }, _checkDelay);

    maxWaitTimeout = setTimeout(function () {
      _clearTimers(maxWaitTimeout, interval);

      _deferredObject.reject(new Error('Wait until promise timed out'));
    }, _maxWait);

    return _deferredObject.promise();
  }

  return {
    workItemMock: workItemMock,
    membersMock: membersMock,
    activityMock: activityMock,
    getContext: getContext,
    getConnector: getConnector,
    getWorkItemModel: getWorkItemModel,
    getSimpleWorkItemModel: getSimpleWorkItemModel,
    getWorkitemStatusModel: getWorkitemStatusModel,
    getListOfWorkflowMapsAvailableForDocument: getListOfWorkflowMapsAvailableForDocument,
    getSimpleWorkItemModelForDraftProcess: getSimpleWorkItemModelForDraftProcess,
    getDocModel: getDocModel,
    getSimpleWorkItemModelWithAction: getSimpleWorkItemModelWithAction,
    getSimpleWorkItemModelWithMaxDispositions: getSimpleWorkItemModelWithMaxDispositions,
    getWorkflowAttachments: getWorkflowAttachments,
    getWorkflowAttachmentFolder: getWorkflowAttachmentFolder,
    getWorkflowAttachmentAddableTypes: getWorkflowAttachmentAddableTypes,
    getActions: getActions,
    isWorkItemFetched: isWorkItemFetched,
    isWorkItemRendered: isWorkItemRendered,
    getSimpleDraftWorkItemModel: getSimpleDraftWorkItemModel,
    waitUntil: waitUntil
  };

});
