/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url', 
  'csui/models/mixins/connectable/connectable.mixin', 
  'csui/models/mixins/fetchable/fetchable.mixin', 
  'csui/models/fetchable', 
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin', 
  'csui/models/mixins/v2.fields/v2.fields.mixin', 
  'csui/models/mixins/v2.expandable/v2.expandable.mixin', 
  'csui/models/mixins/v2.commandable/v2.commandable.mixin', 
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin', 
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns', 
  'csui/models/node/node.model', 
  'workflow/utils/workitem.util', 
  'i18n!csui/models/widget/nls/lang', 
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ConnectableMixin, FetchableMixin, FetchableModel, 
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, CommandableV2Mixin, 
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin, NodeChildrenColumnModel, 
    NodeChildrenColumnCollection, NodeModel, WorkItemUtil, lang) {
  'use strict'; 

  var WFStatusColumnModel = NodeChildrenColumnModel.extend( {

    constructor:function WFStatusColumnModel(attributes, options) {

      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options); 
    }

  }); 

  var WFStatusColumnCollection = NodeChildrenColumnCollection.extend( {

    model:WFStatusColumnModel, 
    getColumnModels:function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions); 
      _.each(columns, function (column) {
        var columnKey = column['column_key'], 
            columns = ['status_key', 'due_date', 'wf_name', 'step_name', 'assignee', 
              'date_initiated']; 
        if (columns.indexOf(columnKey) >= 0) {
          column.sort = true; 
        }
      }); 
      return columns; 
    }, 

    getV2Columns:function (response) {

      var definitions = (response.results && response.results[0] && 
                         response.results[0].definitions && 
                         response.results[0].definitions.wfstatus) ||  {}; 

      var columnKeys = _.keys(definitions); 

      return this.getColumnModels(columnKeys, definitions); 
    }

  }); 

  var WFStatusModel = NodeModel.extend( {

        parse:function (response, options) {

          if (response.data && response.data.wfstatus) {
            var assigneeData =  {}, userId = 0; 
            assigneeData.assignees = response.data.wfstatus.assignee; 
            if (assigneeData.assignees.length === 1) {
              userId = assigneeData.assignees[0].userId; 
            }
            if (response.data.wfstatus.assignedto) {
              response.data.wfstatus.assignedto.assignees = assigneeData.assignees; 
            }
            assigneeData.assignedto = response.data.wfstatus.assignedto; 
            response.data.wfstatus.userId = userId; 
            response.data.wfstatus.assignee = WorkItemUtil.getAssignee(assigneeData); 
            response.data.properties = response.data.wfstatus; 
          }

            var node = NodeModel.prototype.parse.call(this, response, options); 
            return node; 
        }

  }); 

  var WFStatusCollection = Backbone.Collection.extend(_.extend( {}, FetchableModel(Backbone.Collection),  {

    model:WFStatusModel, 

    constructor:function WFStatusCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments); 
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset', 
          'includeResources', 'fields', 'expand', 'commands', 'status', 'retention', 'wfstatusfilter',
          'filterWorkflowtype', 'filterWorkflows', 'selectionType', 'isFilterVisible', 'statusListCount', 'chatSettings']);
      }


      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options); 

      this.columns = new WFStatusColumnCollection(); 
    }, 

    clone:function () {
      var clone = new this.constructor(this.models, this.options); 
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON()); 
      }
      clone.actualSkipCount = this.actualSkipCount; 
      clone.wfstatus = this.model; 
      clone.totalCount = this.totalCount; 
      clone.filteredCount = this.filteredCount; 
      return clone; 
    }, 

    url:function () {

      var baseUrl = this.connector.connection.url.replace('/v1', '/v2'), 
      getUrl = Url.combine(baseUrl, '/workflows/status'), 
      filterWorkflowtype = this.options.filterWorkflowtype, 
      retention = this.options.retention,
      selectionType = this.options.selectionType,
      wfstatusfilter = this.options.wfstatusfilter;

      if (!filterWorkflowtype) {
        filterWorkflowtype = WorkItemUtil.getWorkflowtype(this.options.filterWorkflows);
      }
      
      getUrl += "?selectionType=" + selectionType; 
      
      if(wfstatusfilter && wfstatusfilter!=='')
      {
        getUrl += "&wfstatusfilter=" + wfstatusfilter; 
      }
      else
      {
        getUrl += "&wfretention=" + retention; 
        getUrl += "&kind=" + filterWorkflowtype; 
      }
     
      
      return getUrl; 
    }, 

    parse:function (response, options) {

      this.parseBrowsedState(response, options); 
      this.columns && this.columns.resetColumnsV2(response, this.options); 
      return this.parseBrowsedItems(response, options); 
    }, 

    getResourceScope:function () {
      return _.deepClone( {
        fields:this.fields, 
        expand:this.expand, 
        includeResources:this._additionalResources, 
        commands:this.commands
      }); 
    }, 
    fetchdata:function (options) {
      if (options) {
        this.options = options; 
      }
      return this.Fetchable.fetch.apply(this, arguments); 
    }, 
    setResourceScope:function (scope) {
      this.excludeResources(); 
      scope.includeResources && this.includeResources(scope.includeResources); 
      this.resetFields(); 
      scope.fields && this.setFields(scope.fields); 
      this.resetExpand(); 
      scope.expand && this.setExpand(scope.expand); 
      this.resetCommands(); 
      scope.commands && this.setCommands(scope.commands); 
    }

  })); 

  ClientSideBrowsableMixin.mixin(WFStatusCollection.prototype); 
  var originalCompareValues = WFStatusCollection.prototype._compareValues; 
  WFStatusCollection.prototype._compareValues = function (property, left, right) {
    if (property.indexOf('date') >= 0) {
      if (left === null) {
        return 1; 
      }
      if (right === null) {
        return-1; 
      }
    }
    return originalCompareValues.apply(this, arguments); 
  }; 

  BrowsableV2ResponseMixin.mixin(WFStatusCollection.prototype); 
  ConnectableMixin.mixin(WFStatusCollection.prototype); 
  FetchableMixin.mixin(WFStatusCollection.prototype); 
  AdditionalResourcesV2Mixin.mixin(WFStatusCollection.prototype); 
  FieldsV2Mixin.mixin(WFStatusCollection.prototype); 
  ExpandableV2Mixin.mixin(WFStatusCollection.prototype); 
  CommandableV2Mixin.mixin(WFStatusCollection.prototype); 

  return WFStatusCollection; 

}); 
