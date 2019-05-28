csui.define('workflow/models/workitem/workitem.model',[
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/base',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/contexts/factories/connector'
], function (Backbone, Url, base, _, $, ConnectorFactory) {
  

  var ActionModel = Backbone.Model.extend({

    defaults: {
      id: "",
      key: "",
      label: "",
      custom: false
    },
    constructor: function ActionModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    parse: function (response, options) {
      //parse the current action structure into a model structure
      var key = response.key;
      var label = response.label;
      var id = options.custom ? "custom-" + key : "standard-" + key;
      // Return the data
      return {key: key, label: label, id: id, custom: options.custom};
    }

  });

  var ActionsCollection = Backbone.Collection.extend({
    model: ActionModel,

    constructor: function ActionsCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });

  var FormModel = Backbone.Model.extend({

    constructor: function FormModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    _saveChanges: function (changes, formView) {
      var connector = formView.options.context.getObject(ConnectorFactory),
          baseUrl   = connector.connection.url.replace('/v1', '/v2'),
          formUrl   = (formView.alpaca.options.form.attributes.action).split("v1"),
          putUrl    = Url.combine(baseUrl, formUrl[1]),
          dfd       = $.Deferred(),
          callAsync = true;
      //When this is a draft process then the ajax call has to be syncron, so that the save is
      //already finished when the initiate is done
      if (formView.mode === "create") {
        callAsync = false;
      }
      $.ajax(connector.extendAjaxOptions({
            type: 'PUT',
            url: putUrl,
            async: callAsync,
            data: {body: JSON.stringify(changes)}
          }))
          .done(_.bind(function () {
            dfd.resolve();
          }, this))
          .fail(_.bind(function (jqxhr) {
            // show the error
            var error = new base.Error(jqxhr);
            dfd.reject(error);
          }, this));
      return dfd;
    }
  });

  var FormsCollection = Backbone.Collection.extend({
    model: FormModel,

    constructor: function FormsCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });

  /**
   * Workitem model which represents an instance of a running workflow
   * It contains the REST calls to get and set the workitem properties and to send on the workflow.
   *
   * The model fires the following events:
   *
   * workitem:sendon  This event is triggered when the workitem was successful sent on.
   *
   */
  var WorkItemModel = Backbone.Model.extend({

    defaults: {
      process_id: 0,
      subprocess_id: 0,
      task_id: 0,
      isDraft: false,
      title: "",
      instructions: "",
      doc_id: 0,
      mapsList: []
    },

    // Constructor gives an explicit name to the object in the debugger
    constructor: function WorkItemModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    url: function () {

      var baseUrl = this.connector.connection.url;

      var isDraft   = this.get('isDraft'),
          mapsList  = this.get('mapsList'),
          draftId   = this.get('draft_id'),
          processId = draftId ? draftId : this.get('process_id');

      if (isDraft || this.get('isDocDraft') || (mapsList && mapsList.length === 1)) {
        // URL of the REST call to get the work item
        return Url.combine(baseUrl,
            '/forms/draftprocesses/update?draftprocess_id=' + processId);
      } else {
        // URL of the REST call to get the work item
        return Url.combine(baseUrl,
            '/forms/processes/tasks/update?process_id=' + this.get('process_id') +
            '&subprocess_id=' +
            this.get('subprocess_id') + '&task_id=' + this.get('task_id'));
      }
    },

    parse: function (response) {
      // Forms
      this.forms = new FormsCollection(response.forms);

      // Actions
      this.actions = new ActionsCollection(response.data.actions, {parse: true, custom: false});
      delete response.data.actions; //remove action property, so that it is not part of the general model

      this.customActions = new ActionsCollection(response.data.custom_actions, {
        parse: true,
        custom: true
      });
      delete response.data.custom_actions;//remove action property, so that it is not part of the general model

      // Return the data
      return response.data;

    },

    isFetchable: function () {
      var docId = this.get('doc_id');
      return docId ? docId : !!this.get('process_id');
    },

    /**
     * Clear the model and its collections
     * @param options
     */
    reset: function (options) {
      this.clear(options);

      //reset the different collections
      if (!_.isUndefined(this.actions)) {
        this.actions.reset();
      }
      if (!_.isUndefined(this.customActions)) {
        this.customActions.reset();
      }
      if (!_.isUndefined(this.forms)) {
        this.forms.reset();
      }
    },

    title: function () {
      return this.get('title');
    },

    /**
     * Sends an action to the server
     * @param action Action object for the current action.
     *
     * @returns a promise object. This promise is resolved when the send action call returns from the server without an error.
     * In the case of an error the promise will be rejected.
     */
    sendAction: function (action) {
      // URL of the REST call to send the workflow with the correct action attached
      var baseUrl   = this.connector.connection.url.replace('/v1', '/v2'),
          putUrl    = Url.combine(baseUrl, 'processes', this.get('process_id'), 'subprocesses',
              this.get('subprocess_id'), 'tasks', this.get('task_id')),
          dfd       = $.Deferred(),
          isDraft   = this.get('isDraft'),
          mapsList  = this.get('mapsList'),
          draftId   = this.get('draft_id'),
          processId = draftId ? draftId : this.get('process_id');

      // is it a draft process
      if (isDraft || this.get('isDocDraft') || (mapsList && mapsList.length === 1)) {
        putUrl = Url.combine(baseUrl, 'draftprocesses', processId);
      }

      // prepare request content - action
      var content = {};
      if (action.get('custom')) {
        //custom action
        content.custom_action = action.get('key');
      } else {
        //standard action
        content.action = action.get('key');
      }
      // prepare request content - comment
      // TODO: verify whether the 'comments_on' flag is set.
      if (this.get('comment') !== undefined && this.get('comment').length > 0) {
        content.comment = this.get('comment');
      }
      // prepare request content - assignee
      if (action.get('key') === 'Delegate') {
        content.assignee = this.get('assignee').toString();
      }
      // prepare request content - assignee and assignee option
      if (action.get('key') === 'Review') {
        content.assignee = this.get('assignee').toString();
        if (_.isNumber(this.get('assigneeOption'))) {
          content.assigneeOption = this.get('assigneeOption').toString();
        } else {
          // fall back to default value which is 0 == member accept
          content.assigneeOption = '0';
        }
      }
      // prepare request content - assignee and assignee option
      if (this.get('authentication') === true) {
        content.authentication_info = this.get('authentication_info');
      }

      var formData = new FormData();
      formData.append('body', JSON.stringify(content));

      var ajaxOptions = {
        type: 'PUT',
        url: putUrl,
        data: formData,
        contentType: false,
        processData: false
      };
      this.connector && this.connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            dfd.resolve(resp.results);
            //the workitem was sent on, fire an event
            this.trigger('workitem:sendon');
          }, this))
          .fail(_.bind(function (resp) {
            dfd.reject(resp);
          }, this));

      return dfd;
    },

    /**
     * Sends a member accept action to the server to accept the current workitem.
     *
     * @returns a promise object. This promise is resolved when the accept call returns from the server without an error. In the case of an error
     * the promise will be rejected.
     */
    sendMemberAcceptAction: function (acceptStatus) {
      // URL of the REST call to send the workflow with the accept action
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2');
      var putUrl = Url.combine(baseUrl, 'processes', this.get('process_id'), 'subprocesses',
          this.get('subprocess_id'), 'tasks', this.get('task_id'));
      acceptStatus = acceptStatus ? acceptStatus : "accept";
      var content = {action: acceptStatus};
      var formData = new FormData();
      var dfd = $.Deferred();
      formData.append('body', JSON.stringify(content));

      var ajaxOptions = {
        type: 'PUT',
        url: putUrl,
        data: formData,
        contentType: false,
        processData: false
      };
      this.connector && this.connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(_.bind(function () {
            dfd.resolve();
          }, this))
          .fail(_.bind(function (resp) {
            var response = JSON.parse(resp.responseText);
            dfd.reject(response);
          }, this));
      return dfd;
    }

  });

  return WorkItemModel;

});

csui.define('workflow/models/workflow/workflow.model',[
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/base',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/contexts/factories/connector'
], function (Backbone, Url, base, _, $, ConnectorFactory) {
  

  /**
   * Workflow model which represents a workflow definition
   * It contains the REST calls to create a draft process which could then be initiate.
   * Other parts for the workflow are currently not implemented
   */
  var WorkflowModel = Backbone.Model.extend({

    defaults: {
      workflow_id: 0
    },

    // Constructor gives an explicit name to the object in the debugger
    constructor: function WorkflowModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    /**
     * Create a draft process instance for the workflow
     *
     * @returns {*}
     */
    createDraftProcess: function () {
      // URL of the REST call to create a draft process
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2');
      var postUrl = Url.combine(baseUrl, 'draftprocesses');
      var content = {workflow_id: this.get('workflow_id'),doc_ids : this.get('DocIDs')};
      var formData = new FormData();
      var dfd = $.Deferred();
      formData.append('body', JSON.stringify(content));

      // call REST service to create a draft processs
      var ajaxOptions = {
        type: 'POST',
        url: postUrl,
        data: formData,
        contentType: false,
        processData: false
      };
      this.connector && this.connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            // call successful, return draft process id
            dfd.resolve(resp.results);
          }, this))
          .fail(_.bind(function (resp) {
            // call failed, return error
            dfd.reject(resp.responseJSON.error);
          }, this));
      return dfd;
    },

    /**
     * list workflows for document node
     *
     * @returns {*}
     */
    getDocumentWorkflows: function () {

      var generateUrl = function (attributes) {
        var url         = '',
            docIds      = (attributes.doc_id) ? attributes.doc_id.split(',') : attributes.DocIDs,
            selectionID = $("#selectionID");

        _.each(docIds, function (docId) {
          url = url.concat('doc_id').concat('=').concat(docId).concat('&');
        });

        if (attributes.ParentID) {
          url = url.concat('parent_id=').concat(attributes.ParentID);
        }
        if (attributes.checkEnabled) {
          url = url.concat('&checkEnabled=').concat(attributes.checkEnabled);
        }
        // The unique ID is used to determine that the user selection(of the documents) is happening
        // from the the same page
        // Created : On the first selection of the node(document)
        // Removed : This uinique ID is removed on deselection of a node
        if (selectionID.length === 0) {
          var firstRow = $("#tableview tbody>tr")[0];
          if(firstRow){
            $('<input>').attr({
              type: 'hidden',
              id: 'selectionID',
              value: _.uniqueId()
            }).appendTo(firstRow);
            selectionID = $("#selectionID");
          }
        }
        if(selectionID.val()){
          url = url.concat('&selectionID=').concat(selectionID.val());
        }
        // newDocID contains the document id's of the newly selected nodes(documents) if there is a
        // previous selection already exist
        if (attributes.newDocID) {
          _.each(attributes.newDocID, function (docId) {
            url = url.concat('&newDocID').concat('=').concat(docId);
          });

          
        }
        return url;
      };

      // URL of the REST call to create a draft process
      var baseUrl     = this.connector.connection.url.replace('/v1', '/v2'),
          getUrl      = Url.combine(baseUrl, 'docworkflows?' + generateUrl(this.attributes)),
          dfd         = $.Deferred(),
          // call REST service to get matched workflow types
          ajaxOptions = {
            type: 'GET',
            url: getUrl,
            async: (this.get("CheckEnable")) ? false : true
          };

      this.connector && this.connector.extendAjaxOptions(ajaxOptions);
      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            //'CheckEnable' is used for enabling the start workflow.
            if (!this.get("CheckEnable")) {
              // call successful, call for the draft process id
              if (resp.results.data.length === 1) {
                this.set("workflow_id", resp.results.data[0].DataID);
                this.set("resp", resp.results);
                this.createDraftProcess()
                    .done(_.bind(function (resp) {
                      // call successful, return draft process id
                      var response = this.get("resp");
                      response.data[0].draftprocess_id = resp.draftprocess_id;
                      dfd.resolve(response);
                    }, this))
                    .fail(_.bind(function (error) {
                      dfd.reject(error);
                    }, this));
              } else {
                dfd.resolve(resp.results);
              }
            } else {
              dfd.resolve(resp.results);
            }
          }, this))
          .fail(_.bind(function (resp) {
            // call failed, return error
            dfd.reject(resp);
          }, this));
      return dfd;
    }
  });

  return WorkflowModel;
});

csui.define('workflow/models/workitem/workitem.model.factory',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/contexts/factories/factory',   // Factory base to inherit from
  'csui/utils/contexts/factories/connector', // Factory for the server connector
  'workflow/models/workitem/workitem.model',     // Model to create the factory for
  'workflow/models/workflow/workflow.model'
], function ($, _, ModelFactory, ConnectorFactory, WorkItemModel, WorkflowModel) {
  

  var WorkItemModelFactory = ModelFactory.extend({

    // Unique prefix of the default model instance, when this model is placed
    // to a context to be shared by multiple widgets
    propertyPrefix: 'workitem',

    constructor: function WorkItemModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      // Obtain the server connector from the application context to share
      // the server connection with the rest of the application; include
      // the options, which can contain settings for dependent factories
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;

      // Expose the model instance in the `property` key on this factory
      // instance to be used by the context
      this.property = new WorkItemModel(undefined, {
        connector: connector
      });

      this.workflow = new WorkflowModel(undefined, {
        connector: connector
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {

      var isDoc   = this.property.get('isDoc'),
          mapList = this.property.get('mapsList'),
          dfd     = $.Deferred();

      if (isDoc && !(this.property.get('process_id') || this.property.get('draft_id'))) {

        if (mapList && mapList.length > 0) {
          return dfd.resolve(this.property);

        } else {

          this.workflow.set('doc_id', this.property.get("doc_id"));
          this.workflow.set('ParentID', this.property.get("parent_id"));
          // create a draft process
          this.workflow.getDocumentWorkflows()
              .done(_.bind(function (resp) {
                this.property.set({datafetched: true}, {silent: true});
                this.property.set('mapsList', resp.data);
                dfd.resolve(this.property);
              }, this))
              .fail(_.bind(function (error) {
                dfd.reject(error);
              }, this));

          return dfd.promise();

        }

      } else if (this.property.get('isDocDraft')) {
        var model = this.property.fetch({silent: true});
        model.done(_.bind(function (resp) {

          this.workflow.set('doc_id', this.property.get("doc_id"));
          this.workflow.set('ParentID', this.property.get("parent_id"));
          // create a draft process
          this.workflow.getDocumentWorkflows()
              .done(_.bind(function (resp) {
                this.property.set({datafetched: true}, {silent: true});
                this.property.set('mapsList', resp.data);
                dfd.resolve(this.property);
              }, this))
              .fail(_.bind(function (error) {
                dfd.reject(error);
              }, this));
        }, this))
            .fail(_.bind(function (error) {
              dfd.reject(error);
            }, this));
        return dfd.promise();
      } else {
        // Just fetch the model exposed y this factory
        return this.property.fetch(options);
      }
    }

  });

  return WorkItemModelFactory;

});

csui.define('workflow/commands/defaultactionitems',[],function () {
    

    return [
        // Workflow
        {
            equals: {type: [128]},
            signature: 'InitiateWorkflow',
            sequence: 30
        },
        // WorkItem
        {
            equals: {type: [153]},
            signature: 'OpenWorkflowStep',
            sequence: 30
        }
    ];

});
csui.define('workflow/commands/initiate.workflow/initiate.workflow',['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page',
  'workflow/models/workitem/workitem.model.factory',
  'workflow/models/workflow/workflow.model'
], function ($, _, CommandHelper, OpenClassicPageCommand, WorkitemModelFactory, WorkflowModel) {
  

  // Dependencies loaded in the execute method first
  var GlobalMessage,
      ConnectorFactory;

  var InitiateWorkflowCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'InitiateWorkflow',
      command_key: ['initiateworkflow'],
      scope: 'single'
    },

    // check if work item should be opened in smart or standard UI
    execute: function (status, options) {
      var node     = CommandHelper.getJustOneNode(status),
          deferred = $.Deferred();

      var cmd = node.actions.get(this.get('command_key')[0]);

      if (cmd && cmd.get('body') === 'initiate_in_smartview') {
        // init workflow in smart UI
        csui.require(['csui/controls/globalmessage/globalmessage',
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

          // create a draft process
          workflow.createDraftProcess()
              .done(_.bind(function (resp) {
                // creation of the draft process succeeded, load the work item model and switch perspective
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
                // creation of the draft process failed, show message
                GlobalMessage.showMessage('error', error);
                deferred.reject();
              }, this));

          // set the map it to load the temp map

        }, function (error) {
          deferred.reject(error);
        });
        // Return deferred to react on issues/success in the caller
        return deferred;
      } else {
        // classic UI
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
csui.define('workflow/commands/initiate.document.workflow/initiate.document.workflow',['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page',
  'csui/models/node/node.model',
  'csui/controls/globalmessage/globalmessage',
  'workflow/models/workitem/workitem.model.factory',
  'workflow/models/workflow/workflow.model'
], function ($, _, CommandHelper, OpenClassicPageCommand, NodeModel, GlobalMessage, WorkitemModelFactory,
    WorkflowModel) {
  

  // Dependencies loaded in the execute method first
  var ConnectorFactory,
      NodeModelFactory;

  var InitiateDocumentWorkflowCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'InitiateDocumentWorkflow',
      command_key: ['initiatedocumentworkflow'],
      scope: 'multiple'
    },

    // returns a boolean value by caluclating common workflows of selected doc's.
    hasCommonWorkflows: function (selectedWfList) {

      // return a boolean value by caluclating common workflows.
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
      //Document initiate command is not supported for the widgets which has
      //documents of different containers(parents)(Ex favorites etc).
      //so disabling document initiate command for such widgets.
      //will revisit this code when command is supported for all widgets.
      if (!status.container || $("csui-expanded.cs-dialog").length > 0) {
        return false;
      }

      // For inline actions, call the rest service only on click of three dots(more actions)
      // Note: Attribute: csuiLazyActionsRetrieved will be true only after clicking on three
      // dots(more actions)
      var signatures   = this.get("command_key"),
          nodes        = CommandHelper.getAtLeastOneNode(status).models,
          enableAction = false;

      if (!this._checkPermittedActions(nodes, signatures, status.container)) {
        return false;
      }

      //filtering the unselected nodes from the selected one by using "csuiIsSelected"
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
    //Get all the doc_ids for the selected nodes(document).
    getDocIds: function (nodes) {
      var docIds = [];
      _.each(nodes, function (node) {
        docIds.push(node.get('id'));
      });
      return docIds;
    },
    //Get all the doc names for the selected nodes(document).
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
        // Determine the newly selected nodes using  previous node selection
        var newDocID = _.filter(curSelection, function (id) {
          return !_.contains(prevNodeSelection, id);
        });

        // Determining the action based on the current selection(curSelection) and previous selection of
        // nodes(prevNodeSelection)
        if (curSelection.length > prevNodeSelection.length &&
            $(curSelection).filter(prevNodeSelection).length === prevNodeSelection.length) {
          // Adding newDocID if the current node selection contains previous node selection along
          // with newly added nodes
          workflow.set('newDocID', newDocID);
        } else if (((curSelection.length < prevNodeSelection.length) ||
                    (curSelection.length === 1 && curSelection.length === prevNodeSelection.length &&
                     curSelection[0] !== prevNodeSelection[0]) ) && $("#selectionID").length > 0) {
          // Removing selectionID on deselecting a node
          $("#selectionID").remove();
        }
      }

      // 'prevEnabledNodeLen'  stores the length of the selected documents.
      // Once the results are available, based on 'prevEnabledNodeLen' we make 'commandEnabled'
      // as a check to stop other 'XHR'/'REST' calls.
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
    // check if work item should be opened in smart or standard UI
    execute: function (status, options) {

      var nodes     = CommandHelper.getAtLeastOneNode(status).models,
          parent_id = status.container.attributes.id,
          deferred  = $.Deferred(),
          that      = this,
          docIds    = this.getDocIds(nodes),
          docNames   = this.getDocNames(nodes),
          docArgs   = {DocIDs: docIds, ParentID: parent_id},
          delimitedDocIds = this.getDelimitedString(docIds, ",");

      // init workflow in smart UI
      csui.require(['csui/utils/contexts/factories/connector', // Factory for the server connector
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

        // create a draft process
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
              // creation of the draft process failed, show message
              if (error.responseJSON) {
                GlobalMessage.showMessage('error', error.responseJSON.error);
              }
              deferred.reject();
            }, this));

        // set the map it to load the temp map

      }, function (error) {
        deferred.reject(error);
      });

      // Return deferred to react on issues/success in the caller
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
csui.define('workflow/commands/open.workitem/open.workitem',['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page',
  'csui/utils/command.error',
  'csui/utils/contexts/factories/connector',
  'workflow/models/workitem/workitem.model.factory',
], function (_, $, CommandHelper, OpenClassicPageCommand, CommandError, ConnectorFactory, WorkitemModelFactory) {
  

  var OpenWorkItemCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenWorkflowStep'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 153;
    },

    // check if work item should be opened in smart or standard UI
    execute: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      if (node.get('workflow_open_in_smart_ui')) {
        // smart UI
        options = options || {};
        var context   = status.context || options && options.context,
            deferred  = $.Deferred(),
            workItem = context.getModel(WorkitemModelFactory);

        // set the work item ids in the model
        workItem.set({
          process_id: node.get('workflow_id'),
          subprocess_id: node.get('workflow_subworkflow_id'),
          task_id: node.get('workflow_subworkflow_task_id'),
          url_org: location.href
        });


        // Return deferred to react on issues/success in the caller
        return deferred;
      } else {
        // classic UI
        return this._navigateTo(node, options);
      }
    },

    // URL for standard UI
    getUrlQueryParameters: function (node, options) {

      return {
        func: 'work.EditTask',
        workid: node.get('workflow_id'),
        subworkid: node.get('workflow_subworkflow_id'),
        taskid: node.get('workflow_subworkflow_task_id'),
        nexturl: location.href
      };
    }
  });

  return OpenWorkItemCommand;

});
csui.define('workflow/perspective/routers/workflow.perspective.router',['csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/application.scope.factory',
  'workflow/models/workitem/workitem.model.factory',
], function (PerspectiveRouter, ApplicationScopeModelFactory,
    WorkItemModelFactory) {
  

  var WorkflowPerspectiveRouter = PerspectiveRouter.extend({

    // defined routes, see workflow.perspective.router.md for more details
    routes: {
      'processes/:process_id/:subprocess_id/:task_id': 'openProcess',
      'draftprocesses/:draftprocess_id': 'openDraftProcess',
      'docworkflows/:doc_id/:parent_id': 'openDocumentProcess',
      'docworkflows/:doc_id/:parent_id/draftprocesses/:draftprocess_id': 'openDocumentDraftProcess'
    },

    constructor: function WorkflowPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);

      this.workItem = this.context.getModel(WorkItemModelFactory);
      this.listenTo(this.workItem, 'change:process_id', this._updateUrl);
      this.listenTo(this.workItem, 'change:doc_id', this._updateUrl);
    },

    /**
     * Called when the route is activated
     * @param process_id Process id of the workflow
     * @param subprocess_id Sub process od of the workflow
     * @param task_id Task id of the workflow
     */
    openProcess: function (process_id, subprocess_id, task_id) {
      //set the ids in the model to reload it
      this.workItem.set({
        process_id: parseInt(process_id),
        subprocess_id: parseInt(subprocess_id),
        task_id: parseInt(task_id),
        isDraft: false
      });
    },

    /**
     * Called when the route is activated
     * @param draftprocess_id Draft process id of the workflow
     */
    openDraftProcess: function (draftprocess_id) {
      //set the ids in the model to reload it
      this.workItem.set({
        process_id: parseInt(draftprocess_id),
        isDraft: true
      });
    },

    /**
     * Called when the route is activated
     * @param doc_id docId to retrive list of workflows associated to document
     * @param parent_id parentId to retrive  list of workflows associated to document
     */
    openDocumentProcess: function (doc_id, parent_id) {

      var defaults = this.workItem.defaults;
      this.workItem.reset({silent: true});
      this.workItem.set(defaults, {silent: true});
      //set the ids in the model to reload it
      this.workItem.set({
        parent_id: parseInt(parent_id),
        isDoc: true,
        doc_id: doc_id
      });
    },

    /**
     * Called when the route is activated
     * @param doc_id docId to retrive list of workflows associated to document
     * @param parent_id parentId to retrive  list of workflows associated to document
     * @param draftprocess_id Draft process id of the workflow
     */
    openDocumentDraftProcess: function (doc_id, parent_id, draftprocess_id) {
      //set the ids in the model to reload it
      this.workItem.set({
        parent_id: parseInt(parent_id),
        draft_id: parseInt(draftprocess_id),
        isDocDraft: true,
        doc_id: doc_id
      });
    },

    onOtherRoute: function () {
      // reset the model in the case a different route is activated
      this.workItem.reset({silent: true});
    },

    /**
     * Update the URL when a model is changed
     * @private
     */
    _updateUrl: function () {
      // get the workflow ids for the URL
      var process_id    = this.workItem.get('process_id'),
          subprocess_id = this.workItem.get('subprocess_id'),
          task_id       = this.workItem.get('task_id'),
          isDraft       = this.workItem.get('isDraft'),
          isDocDraft    = this.workItem.get('isDocDraft'),
          isDoc         = this.workItem.get('isDoc'),
          mapsList      = this.workItem.get('mapsList'),
          doc_id        = this.workItem.get('doc_id'),
          parent_id     = this.workItem.get('parent_id'),
          draftId       = this.workItem.get('draft_id');

      if (!!process_id && !!doc_id) {
        return;
      }
      if (!(doc_id || process_id) && this.applicationScope.id !== 'workflow') {
        return;
      }

      var url = 'processes';

      if (isDraft) {
        // create the URL from the workflow ids
        url = 'draftprocesses';
        if (process_id) {
          url += '/' + process_id;
        }
      } else if (isDocDraft || (mapsList && mapsList.length === 1)) {
        url = 'docworkflows';
        if (doc_id && parent_id && draftId) {
          url += '/' + doc_id + '/' + parent_id + '/' + 'draftprocesses' + '/' +
                 draftId;
        }
      } else if (isDoc) {
        // create the URL from the workflow ids
        url = 'docworkflows';
        if (doc_id && parent_id) {
          url += '/' + doc_id + '/' + parent_id;
        }
      } else {
        // create the URL from the workflow ids
        url = 'processes';
        if (process_id) {
          url += '/' + process_id + '/' + subprocess_id + '/' + task_id;
        }
      }

      this.navigate(url);
    }

  });

  return WorkflowPerspectiveRouter;

});

csui.define('bundles/workflow-core',[
  //factories
  'workflow/models/workitem/workitem.model.factory',

  // Commands
  'workflow/commands/defaultactionitems',
  'workflow/commands/initiate.workflow/initiate.workflow',
  'workflow/commands/initiate.document.workflow/initiate.document.workflow',
  'workflow/commands/open.workitem/open.workitem',

  // Perspective router
  'workflow/perspective/routers/workflow.perspective.router'
], {});



