/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 
  'csui/lib/jquery', 
  'csui/lib/backbone', 
  'csui/utils/url'
], function (_, $, Backbone, Url) {
  'use strict'; 

  var WFStatusModel = Backbone.Model.extend( {

    constructor:function WFStatusModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments); 
      if (options && options.connector) {
        options.connector.assignTo(this); 
      }
    }, 

    url:function () {

      var baseUrl = this.connector.connection.url.replace('/v1', '/v2'), 
          getUrl = Url.combine(baseUrl, 'workflows/status/widget'), 
          filterWorkflowtype = this.get("filterWorkflowtype"), 
          retention = this.get("retention"),
          selectionType = this.get("selectionType"),
          wfstatusfilter = this.get("wfstatusfilter");

      if (!filterWorkflowtype) {
        var isFilterInitiated = this.get("filterWorkflows") ?
                                this.get("filterWorkflows").filterInitiated : true;
        var isFilterManaged = this.get("filterWorkflows") ?
                              this.get("filterWorkflows").filterManaged : true;
        filterWorkflowtype = 'Both';
        if (isFilterInitiated && isFilterManaged) {
          filterWorkflowtype = 'Both';
        } else if (isFilterInitiated) {
          filterWorkflowtype = 'Initiated';
        } else if (isFilterManaged) {
          filterWorkflowtype = 'Managed';
        }
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

    parse:function (response) {

      return response.results; 

    }, 

    isFetchable:function () {

      return true; 
    }, 
    sendReAssignAction:function (acceptStatus) {
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2'), 
          postUrl = Url.combine(baseUrl, 'workflows', 'status'), 
          formData = new FormData(), content =  {
            workid:acceptStatus.wfData.process_id || acceptStatus.wfData.processId, 
            subworkid:acceptStatus.wfData.subprocess_id || acceptStatus.wfData.subProcessId, 
            taskid:acceptStatus.wfData.task_id || acceptStatus.wfData.taskId, 
            newuserid:acceptStatus.model.get('assignee'), 
            comment:acceptStatus.model.get('comment')
          }, 
          dfd = $.Deferred(); 
      formData.append('body', JSON.stringify(content)); 
      var ajaxOptions =  {
        type:'POST', 
        url:postUrl, 
        data:formData, 
        contentType:false, 
        processData:false
      }; 
      this.connector && this.connector.extendAjaxOptions(ajaxOptions); 

      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            dfd.resolve(resp); 
          }, this))
          .fail(_.bind(function (resp) {
            var responseMsg = ""; 
            if (resp.responseText) {
               responseMsg = JSON.parse(resp.responseText); 
            }
            dfd.reject(responseMsg); 
          }, this)); 
      return dfd; 
    }
  }); 

  return WFStatusModel; 

}); 
