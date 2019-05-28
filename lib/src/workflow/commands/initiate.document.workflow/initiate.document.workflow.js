/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page',
  'csui/models/node/node.model',
  'csui/controls/globalmessage/globalmessage',
  'workflow/models/workitem/workitem.model.factory',
  'workflow/models/workflow/workflow.model'
], function ($, _, CommandHelper, OpenClassicPageCommand, NodeModel, GlobalMessage, WorkitemModelFactory,
    WorkflowModel) {
  'use strict';
  var ConnectorFactory,
      NodeModelFactory;

  var InitiateDocumentWorkflowCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'InitiateDocumentWorkflow',
      command_key: ['initiatedocumentworkflow'],
      scope: 'multiple'
    },
    hasCommonWorkflows: function (selectedWfList) {
      var wfListLength = selectedWfList.length;
      for (var i = 0, lengthFirstSelectedWfList = selectedWfList[0].length;
           i < lengthFirstSelectedWfList; i++) {
        var item = selectedWfList[0][i];
        var j;
        for (j = 1; j < wfListLength; j++) {
          if (!_.contains(selectedWfList[j], item)) { break; }
        }
        if (j === wfListLength) { return true; }
      }
      return false;
    },

    enabled: function (status, options) {
      if (!status.container || $("csui-expanded.cs-dialog").length > 0) {
        return false;
      }
      var signatures   = this.get("command_key"),
          nodes        = CommandHelper.getAtLeastOneNode(status).models,
          enableAction = false;

      if (!this._checkPermittedActions(nodes, signatures, status.container)) {
        return false;
      }
      for (var i = 0; i < nodes.length; i++) {
        if (nodes.length === 1 &&
            (nodes[i].get("csuiLazyActionsRetrieved") || nodes[0].isLocallyCreated)) {
          continue;
        } else if (!nodes[i].get('csuiIsSelected')) {
          return false;
        }
      }
      var wfList;
      var list = [];
      if (nodes.length === 1) {

        wfList = nodes[0].actions.get("initiatedocumentworkflow").get("wfList");
        if(wfList) {
          enableAction = wfList.length > 0 ? true : false;
        }
      } else if (nodes.length > 1) {

        for (var j = 0; j < nodes.length; j++) {

          wfList = nodes[j].actions.get("initiatedocumentworkflow").get("wfList");
          if (wfList && wfList.length > 0) {
            enableAction = true;
            list.push(wfList);
          } else {
            return false;
          }
        }

        return enableAction ? this.hasCommonWorkflows(list) : false;
      }
      return enableAction;
    },
    getDocIds: function (nodes) {
      var docIds = [];
      _.each(nodes, function (node) {
        docIds.push(node.get('id'));
      });
      return docIds;
    },
    getDocNames: function (nodes) {
      var docNames = {};
      _.each(nodes, function (node) {
        docNames[node.get('id')] = node.get('name');
      });
      return docNames;
    },
    getDelimitedString : function (docList , delimiter) {
      var delimitedString = '', delim = '';
      _.each(docList, function (doc) {
        delimitedString = delimitedString.concat(delim).concat(doc);
        delim = delimiter;
      });
      return delimitedString;
    },
    getCommonWorkflows: function (status, options) {
      var deferred = $.Deferred();
      var connector = status.container.connector;
      var scope      = this.get("scope"),
          cmdOptions = options || {},
          nodes      = this._getNodesByScope(status, scope);
      var workflow = new WorkflowModel({
            CheckEnable: true
          },
          _.extend(cmdOptions, {
            connector: connector
          }));
      var curSelection = this.getDocIds(nodes);
      workflow.set('DocIDs', curSelection);
      workflow.set('ParentID', status.container.attributes.id);
      workflow.set('checkEnabled', options.checkEnabled );

      var prevNodeSelection = this.get("prevNodeSelection");

      if (prevNodeSelection) {
        var newDocID = _.filter(curSelection, function (id) {
          return !_.contains(prevNodeSelection, id);
        });
        if (curSelection.length > prevNodeSelection.length &&
            $(curSelection).filter(prevNodeSelection).length === prevNodeSelection.length) {
          workflow.set('newDocID', newDocID);
        } else if (((curSelection.length < prevNodeSelection.length) ||
                    (curSelection.length === 1 && curSelection.length === prevNodeSelection.length &&
                     curSelection[0] !== prevNodeSelection[0]) ) && $("#selectionID").length > 0) {
          $("#selectionID").remove();
        }
      }
      workflow.getDocumentWorkflows()
          .done(_.bind(function (resp) {

            this.set('prevEnabledNodeLen', nodes.length);
            this.set('prevNodeSelection', curSelection);

            if (resp.data.length > 0) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
          }, this))
          .fail(_.bind(function (resp) {
            this.set('prevEnabledNodeLen', nodes.length);
            this.set('prevNodeSelection', curSelection);
            deferred.reject();
          }, this));
      return deferred.promise();
    },
    execute: function (status, options) {

      var nodes     = CommandHelper.getAtLeastOneNode(status).models,
          parent_id = status.container.attributes.id,
          deferred  = $.Deferred(),
          that      = this,
          docIds    = this.getDocIds(nodes),
          docNames   = this.getDocNames(nodes),
          docArgs   = {DocIDs: docIds, ParentID: parent_id},
          delimitedDocIds = this.getDelimitedString(docIds, ",");
      require(['csui/utils/contexts/factories/connector', // Factory for the server connector
        'csui/utils/contexts/factories/node'
      ], function () {
        ConnectorFactory = arguments[0];
        NodeModelFactory = arguments[1];

        options = options || {};
        var context   = status.context || options && options.context,
            connector = context.getObject(ConnectorFactory, options),
            workflow  = new WorkflowModel(docArgs,
                _.extend(options, {
                  connector: connector
                }));
        workflow.getDocumentWorkflows()
            .done(_.bind(function (resp) {

              if (resp.statusMsg) {
                GlobalMessage.showMessage('error', resp.statusMsg);
                deferred.reject();
              } else {
                var docModels = [];

                _.each(nodes, function (model) {
                  var docModel = new NodeModel({
                    "type": 1,
                    "type_name": "Shortcut",
                    "container": false,
                    "name": model.attributes.name,
                    "original_id": model.attributes.id,
                    "original_id_expand": model.attributes
                  }, {connector: connector});
                  docModels.push(docModel);
                });

                var workItem = context.getModel(WorkitemModelFactory);
                workItem.set('isDoc', true);
                workItem.set('docModels', docModels);
                workItem.set('mapsList', resp.data);
                workItem.set('datafetched', true);
                workItem.set('parent_id', parent_id);
                workItem.set('status', status);

                if (resp.data.length === 1) {
                  var mapModel = context.getModel(NodeModelFactory,
                      {attributes: {id: resp.data[0].DataID}});

                  mapModel.fetch()
                      .done(_.bind(function (args) {
                        var cmd = mapModel.actions.get('initiateworkflow');
                        if (cmd && cmd.get('body') === 'initiate_in_smartview') {
                          workItem.set('draft_id', resp.data[0].draftprocess_id);
                          workItem.set('doc_id', delimitedDocIds);
                          workItem.set('doc_names', docNames);
                        } else {
                          options.isDoc = true;
                          options.doc_id = delimitedDocIds;
                          options.doc_names = docNames;
                          options.parent_id = parent_id;
                          return that._navigateTo(mapModel, options);
                        }

                      }, this))
                      .fail(_.bind(function (error) {
                        if (error.responseJSON) {
                          GlobalMessage.showMessage('error', error.responseJSON.error);
                        }
                      }, this));

                } else {
                  workItem.set('doc_id', delimitedDocIds);
                  workItem.set('doc_names', docNames);
                }
              }
            }, this))
            .fail(_.bind(function (error) {
              if (error.responseJSON) {
                GlobalMessage.showMessage('error', error.responseJSON.error);
              }
              deferred.reject();
            }, this));

      }, function (error) {
        deferred.reject(error);
      });
      return deferred;
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

  return InitiateDocumentWorkflowCommand;

});