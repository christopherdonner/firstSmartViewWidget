/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page',
  'workflow/models/workitem/workitem.model.factory',
  'workflow/models/workflow/workflow.model'
], function ($, _, CommandHelper, OpenClassicPageCommand, WorkitemModelFactory, WorkflowModel) {
  'use strict';
  var GlobalMessage,
      ConnectorFactory;

  var InitiateWorkflowCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'InitiateWorkflow',
      command_key: ['initiateworkflow'],
      scope: 'single'
    },
    execute: function (status, options) {
      var node     = CommandHelper.getJustOneNode(status),
          deferred = $.Deferred();

      var cmd = node.actions.get(this.get('command_key')[0]);

      if (cmd && cmd.get('body') === 'initiate_in_smartview') {
        require(['csui/controls/globalmessage/globalmessage',
          'csui/utils/contexts/factories/connector' // Factory for the server connector
        ], function () {
          GlobalMessage = arguments[0];
          ConnectorFactory = arguments[1];

          options = options || {};
          var context   = status.context || options && options.context,
              connector = context.getObject(ConnectorFactory, options),
              workflow  = new WorkflowModel({
                    workflow_id: node.get('id'),
                    DocIDs : status.doc_id
                  },
                  _.extend(options, {
                    connector: connector
                  }));
          workflow.createDraftProcess()
              .done(_.bind(function (resp) {
                var workItem = context.getModel(WorkitemModelFactory);

                if (status.isDoc === true) {
                  var attrs = {};
                  attrs.isDocDraft = true;
                  attrs.docModels = status.docModel;
                  attrs.parent_id = status.parent_id;
                  attrs.status = status;
                  attrs.draft_id = resp.draftprocess_id;

                  workItem.set(attrs, {silent: true});
                  workItem.set('doc_id', status.doc_id);
                  workItem.set('doc_names', status.docNames);

                } else {
                  workItem.set('isDraft', true);
                  workItem.set('process_id', resp.draftprocess_id);
                }
              }, this))
              .fail(_.bind(function (error) {
                GlobalMessage.showMessage('error', error);
                deferred.reject();
              }, this));

        }, function (error) {
          deferred.reject(error);
        });
        return deferred;
      } else {
        var context  = status.context || options && options.context,
            workItem = context.getModel(WorkitemModelFactory);
        options = options || {};
        workItem.set('isDoc', status.isDoc);
        workItem.set('parent_id', status.parent_id);
        workItem.set('doc_id', status.doc_id);
        workItem.set('doc_names', status.docNames);
        if (status.isDoc === true) {
          options.isDoc = true;
          options.doc_id = status.doc_id;
          options.parent_id = status.parent_id;
          options.doc_names = status.docNames;
          options.connector = workItem.connector;
        }
        return this._navigateTo(node, options);
      }
    },

    getUrlQueryParameters: function (node, options) {
      var urlParams;
      if (options.isDoc === true) {
        var params = {},
            baseUrl     = options.connector.connection.url.replace('/api/v1', '');
        params.func = 'wfinitiation.InitiateWorkflowMap';
        params.ParentID = options.parent_id;
        params.DocNames = options.doc_names;
        params.WFMapsDataID = node.get('id');
        params.nexturl = baseUrl + '/app/nodes/' + params.ParentID;
        urlParams = $.param(params);
        var docIds = options.doc_id.split(",");
        for (var docId in  docIds) {
          urlParams += '&DocID='.concat(docIds[docId]);
        }
      } else {
        urlParams = {};
        urlParams.func = 'll';
        urlParams.objAction = 'Initiate';
        urlParams.objId = node.get('id');
        urlParams.nexturl = location.href;
      }

      return urlParams;

    }
  });

  return InitiateWorkflowCommand;

});