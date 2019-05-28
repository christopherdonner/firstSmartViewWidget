/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/log',
  'csui/utils/commands/open.node.perspective',
  'csui/models/nodes',
  'csui/utils/commandhelper',
  'csui/utils/contexts/factories/node',
  'csui/controls/dialog/dialog.view',
  'workflow/widgets/wfstatus/impl/wfstatus.progress.view',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function (_, $, Backbone, Url, log, OpenNodePerspective, NodeCollection, CommandHelper,
    NodeModelFactory, DialogView, WFStatusProgressView, lang) {
  'use strict';
  var Utils = {
    constants: {
      WFSTATUS_ONTIME: "ontime",
      WFSTATUS_COMPLETED: "completed",
      WFSTATUS_LATE: "workflowlate",
      URI_DELIMITER: ":",
      AT_SIGN_SYMBOL: "@",
      URI_PREFIX: "sip"
    },

    dateConversion: function (date, format) {
      var dateValue = new Date(date),
          formatedDate;
      switch (format) {
      case 'Month DD':
        formatedDate = lang.months[dateValue.getMonth()] + " " + dateValue.getDate();
        break;
      default:
        formatedDate = lang.months[dateValue.getMonth()] + " " + dateValue.getDate() + ", " +
                       dateValue.getFullYear();
        break;
      }
      return formatedDate;
    },

    getAssignee: function (options) {

      var assignees = options.assignees,
          assignee  = '',
          fullName  = '';

      if (assignees && assignees.length > 1) {
        fullName = (assignees[0].firstName + " " + assignees[0].lastName).trim();
        if (fullName !== "") {
          assignee = fullName + " +" + (assignees.length - 1);
        } else if (options.assignedto) {
          assignee = options.assignedto.groupName + " + " + assignees.length;
        }
      } else if (assignees.length === 1) {
        if (options.assignedto && options.assignedto.groupName !== '') {
          fullName = (assignees[0].firstName + " " + assignees[0].lastName).trim();
          if (fullName !== "") {
            assignee = fullName;
          } else {
            assignee = options.assignedto.groupName;
          }
        } else {
          assignee = (assignees[0].firstName + " " + assignees[0].lastName).trim();
          assignee = assignee === "" ? assignees[0].loginName : assignee;
        }

      }
      return assignee;

    },

    displayWfstatusItemProgresspanel: function (options) {
      this.unbindPopover();
      this.progressDialog = new DialogView();
      var expanadedViewEle = $('.wfstatus.csui-expanded');
      expanadedViewEle.hide();
      this.progressDialog.options.title = options.model.get('wf_name');
      this.progressDialog.options.iconRight = 'wfstatusitem-no-icon-right';
      this.progressDialog.options.iconLeft = 'title-icon mime_workflow_status';
      this.progressDialog.options.className = 'wfstatus-progress-view-dialog';
      this.progressDialog.options.actionIconLeft = "arrow_back wfstatus-progress-view-dialog-back";
      this.progressDialog.options.largeSize = true;
      this.progressDialog.options.view = new WFStatusProgressView(options);
      this.progressDialog.show();
      var that = this;

      this.progressDialog.listenTo(this.progressDialog, 'destroy', function () {
        expanadedViewEle.show();
      });
      var progressViewBackButtonEle = $(".wfstatus-progress-view-dialog-back").attr("tabindex", "0");
      progressViewBackButtonEle.on("click", function () {
        that.progressDialog.options.view.destroy();
        that.progressDialog.remove();
        expanadedViewEle.show();
      });

      $(window).unbind("resize.app");
      var progressViewCloseButtonEle = $(".wfstatusitem-no-icon-right");
      progressViewCloseButtonEle.hide();
    },

    unbindPopover: function (options) {
      if (options) {
        $(options.delegateTarget).css("overflow", "");
      }
      if ($(".wfstatus-usercard-popover").length > 0) {
        $(window).unbind('resize.onUserCardPopOver');
        $(window).unbind('popstate.onUserCardPopOver');
        $(window).unbind('hashchange.onUserCardPopOver');
        $(".wfstatus-table tbody").off('scroll');
        $(".binf-modal-backdrop").unbind('keydown click');
        $(".binf-modal-header").unbind('keydown click');

        $("[id*=wfstatus-usercard-popover]").remove();
        $("[id*=wfstatus-usercard-popover-pointer]").remove();
        $("[id*=wfstatus-usercard-popover-mask]").remove();
      }
    },

    formatStatus: function (options) {

      var value        = options.status,
          dueDate      = options.dueDate,
          styleclass   = "wfstatus-" + value + "-icon",
          current_date = new Date(Date.now()),
          date_difference,
          status,
          due_date;

      if (value === this.constants.WFSTATUS_ONTIME) {
        due_date = dueDate ? new Date(dueDate) : '';
        date_difference = (due_date !== '') ? Math.round(
            due_date.getDifference(current_date) / 1000 /
            60 / 60 / 24) : undefined;
        if (date_difference === 0) {
          status = lang.dueLabel + ' ' + lang.todayLabel;
        } else if (date_difference === 1) {
          status = lang.dueInLabel + ' ' + date_difference + ' ' + lang.day;
        } else if (date_difference <= 5) {
          status = lang.dueInLabel + ' ' + date_difference + ' ' + lang.days;
        } else {
          status = (lang.onTime).toLowerCase();
        }

      } else if (value === this.constants.WFSTATUS_COMPLETED) {
        status = (lang.completed).toLowerCase();
      } else if (value === this.constants.WFSTATUS_LATE) {
        due_date = dueDate ? new Date(dueDate) : '';
        date_difference = (due_date !== '') ?
                          Math.round(current_date.getDifference(due_date) / 1000 / 60 / 60 / 24) :
                          undefined;
        if (date_difference === 1) {
          status = date_difference + ' ' + lang.day + ' ' + lang.lateFilterLabel.toLowerCase();
        } else if (date_difference > 1 && date_difference <= 5) {
          status = date_difference + ' ' + lang.days + ' ' +
                   lang.lateFilterLabel.toLowerCase();
        } else {
          status = (lang.late).toLowerCase();
        }
      }

      return {
        status: status,
        styleclass: styleclass
      };
    },

    showProfilePic: function (model) {
      var deferred = $.Deferred();
      if (model.get("photo_url")) {
        var userData = model.get("photo_url");
        var picUrl               = userData.substring(6),
            photoUrl             = Url.combine(
                (model.connector.connection.url), picUrl),
            getCategoriesOptions = model.connector.extendAjaxOptions({
              url: photoUrl,
              method: 'GET',
              dataType: 'binary'
            });
        $.ajax(getCategoriesOptions)
            .done(function (response) {
              deferred.resolve(response);
            }).fail(function (response) {
              deferred.reject(response);
            });
      }
      return deferred.promise();
    },

    getChatURI: function (options) {

      var uriPrefix = options.uriPrefix ? options.uriPrefix :
                      this.constants.URI_PREFIX,
          uri       = uriPrefix +
                      this.constants.URI_DELIMITER + options.tguser +
                      this.constants.AT_SIGN_SYMBOL + options.domain;
      return uri;
      
    },

    getWorkflowtype: function (filterWorkflows) {
      var isFilterInitiated = true;
      var isFilterManaged = true;
      var filterWorkflowtype = 'Both';
      if (filterWorkflows) {
        isFilterInitiated = filterWorkflows.filterInitiated;
        isFilterManaged = filterWorkflows.filterManaged;
      }
      if (isFilterInitiated && isFilterManaged) {
        filterWorkflowtype = 'Both';
      } else if (isFilterInitiated) {
        filterWorkflowtype = 'Initiated';
      } else if (isFilterManaged) {
        filterWorkflowtype = 'Managed';
      }
      return filterWorkflowtype;
    },
    
    validateURL: function (surl) {  
        var url = this.parseURL(surl);  
        var urlHostname = url.hostname.trim();  

        if (urlHostname === '') {  
            return surl;  
        }  
        else {  
            if (urlHostname.toUpperCase() === location.hostname.trim().toUpperCase()) {  
                return surl;  
            }  
            else
            {  
                return "";
            }  
        }  
    } , 

    parseURL: function(url) {  
        
        var a =document.createElement('a');  
        a.href = url;  
        
        return {  
            source: url,  
            protocol: a.protocol.replace(':', ''),  
            hostname: a.hostname,  
            host: a.host,  
            port: a.port,  
            query: a.search,  
            params: (function () {  
                var ret = {},  
                    seg = a.search.replace(/^\?/, '').split('&'),  
                    len = seg.length, i = 0, s;  
                for (; i < len; i++) {  
                    if (!seg[i]) { continue; }  
                    s = seg[i].split('=');  
                    ret[s[0]] = s[1];  
                }  
                return ret;  
            })(),  
           
            hash: a.hash.replace('#', ''),  
           
            segments: a.pathname.replace(/^\//, '').split('/')  
        };  
    }  
  };
  return Utils;

});
