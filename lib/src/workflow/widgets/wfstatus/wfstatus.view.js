/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/marionette', 
  'csui/lib/backbone', 
  'csui/lib/underscore', 
  'csui/lib/jquery', 
  'csui/utils/contexts/factories/connector', 
  'csui/behaviors/expanding/expanding.behavior', 
  'csui/controls/tile/behaviors/perfect.scrolling.behavior', 
  'workflow/models/wfstatus/wfstatus.collection.factory', 
  'workflow/models/wfstatus/wfstatus.model.factory', 
  'workflow/controls/visualdata/visual.data.donut.view', 
  'workflow/widgets/wfstatus/impl/wfstatus.extended.view', 
  'workflow/utils/workitem.util', 
  'hbs!workflow/widgets/wfstatus/impl/wfstatus', 
  'i18n!workflow/widgets/wfstatus/impl/nls/lang', 
  'css!workflow/widgets/wfstatus/impl/wfstatus'
], function (Marionette, Backbone, _, $, ConnectorFactory, ExpandingBehavior, 
    PerfectScrollingBehavior, WFStatusCollectionFactory, WFStatusModelFactory, 
    VisualDataDonutContentView, WFStatusExtendedView, WorkItemUtil, template, lang) {

  'use strict'; 

  var WFStatusView = Marionette.LayoutView.extend( {

    className:'cs-list tile content-tile csui-acc-tab-region wf-wfstatus', 
    widgetTitle : lang.dialogTitle,
    template:template, 

    regions: {
      donut:'.wfstatus-donut-chart'
    }, 

    templateHelpers:function () {
      var count = this.model.get("count"); 
      var singleStatus = count === 1?true:false; 
      if (singleStatus) {
        var data = this.model.get("data"), 
            status = data.status, 
            startDate = (data.dateinitiated)?WorkItemUtil.dateConversion(data.dateinitiated):
                           '', 
            dueDate = (data.duedate)?WorkItemUtil.dateConversion(data.duedate):'', 
            statusInfo, 
            assignees = data.assignee, 
            assignee = '', 
            assigneeData =  {}; 

        assigneeData.assignees = assignees; 
        assigneeData.assignedto = data.assignedto; 
        assignee = WorkItemUtil.getAssignee(assigneeData); 

        if (status === WorkItemUtil.constants.WFSTATUS_ONTIME) {
          statusInfo = lang.onTime; 
        }else if (status === WorkItemUtil.constants.WFSTATUS_COMPLETED) {
          statusInfo = lang.completed; 
        }else if (status === WorkItemUtil.constants.WFSTATUS_LATE) {
          statusInfo = lang.late; 
        }
      }
      return {
        dialogTitle:this.widgetTitle, 
        totalMsg:lang.totalMsg, 
        emptyListText:lang.emptyListText, 
        expandLabel:lang.expandLabel, 
        dueDateLabel:lang.dueDateLabel, 
        currentStepNameLabel:lang.currentStepNameLabel, 
        assignedToLabel:lang.assignedToLabel, 
        startDateLabel:lang.startDateLabel, 
        emptyTextRequired:count === 0?true:false, 
        isSingleStatus:singleStatus, 
        statusInfo:statusInfo, 
        donutChart:count > 1?true:false, 
        showExpand:count > 0?true:false, 
        model:this.model.toJSON(), 
        startDate:startDate, 
        dueDate:dueDate, 
        wfNameLabel:lang.wfNameLabel, 
        assignee:assignee
      }; 
    }, 
    behaviors: {

      ScrollingInstructions: {
        behaviorClass:PerfectScrollingBehavior, 
        contentParent:'.wfstatus-scrolling', 
        suppressScrollX:true, 
        scrollYMarginOffset:16
      }, 
      ExpandableList: {
        behaviorClass:ExpandingBehavior, 
        expandedView:WFStatusExtendedView, 
        orderBy:'status_key desc', 
        actionTitleBarIcon:"icon-toolbarFilter", 
        dialogTitle: function () { return this.widgetTitle; },
        dialogTitleIconRight:"icon-tileCollapse", 
        dialogClassName:'wfstatus'
      }

    }, 

    constructor:function WFStatusView(options) {
      
      options.unique = _.uniqueId(); 
      options.data.unique = _.uniqueId(); 
      
      options.data.selectionType = 100; //Task level , 

      options.model = options.context.getModel(WFStatusModelFactory, options.data);
      if (options.model.get("widgetTitle") && _.str.trim(options.model.get("widgetTitle")).length > 0) {
        this.widgetTitle = options.model.get("widgetTitle");
      }

      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.listenTo(this.model, 'change', this.onModelChange); 
      this.listenTo(this, 'click:segment', this.getExpandStatusList); 
      options = options.data?_.extend(options, options.data):options; 
      delete options["data"]; 
      options["detached"] = true; 

      options.unique = _.uniqueId(); 

      var completeCollection = this.options.context.getCollection(WFStatusCollectionFactory, options); 
      this.completeCollection = completeCollection; 
      options["detached"] = true; 
      options["internal"] = false; 

     
    }, 

    events: {
      'click #cs-more,.tile-expand,.pie-total-container,.tile-header':'getExpandStatusList'
    }, 
    getExpandStatusList:function (event) {
      if (this.model.get('count') > 0) {
        var statusList = []; 
        if (event.data) {
          var status = event.data.status === "late"?"workflowlate":event.data.status; 
          statusList.push(status); 
        }
        this.completeCollection.model = this.model; 
        this.completeCollection.options.retention = this.model.get("retention");
        this.completeCollection.options.selectionType = this.model.get("selectionType");
        this.completeCollection.options.wfstatusfilter = this.model.get("wfstatusfilter");
        this.completeCollection.options.status = statusList; 
        this.completeCollection.options.chatSettings = this.model.get('chatSettings');
        var filterWorkflowtype = this.model.get("filterWorkflowtype");
        if (!filterWorkflowtype) {
          filterWorkflowtype = WorkItemUtil.getWorkflowtype(this.model.get("filterWorkflows"));
        }
        this.completeCollection.options.filterWorkflowtype = filterWorkflowtype;
        event.preventDefault(); 
        event.stopPropagation(); 
        this.triggerMethod('expand'); 
      }
    }, 

    isSearchOpen:function () {
      return false; 
    }, 

    onModelChange:function () {
      this.render(); 
    }, 

    onKeyDown:function (event) {
      var keyCode = event.keyCode, 
          target = $(event.target), 
          retVal = true; 
      if (keyCode === 13 && (target.hasClass('tile-header') || target.hasClass('tile-expand'))) {
        event.preventDefault(); 
        event.stopPropagation(); 
        this.getExpandStatusList(event); 
        retVal = false; 
      }
      return retVal; 
    }, 
    onRender:function () {
      this.$el.on('keydown', _.bind(this.onKeyDown, this)); 
      if (this._isRendered && this._isShown &&
          this.model.get('count') > 0) {
        this.collection = new Backbone.Collection(this.model.get('data'));

        if (this.model.get('count') > 1) {
          var that     = this,
              interval = setInterval(function () {
                if ($('.wf-wfstatus').length > 0) {
                  var options = {};
                  options.dataset = that.model.get('data');
                  var statusArray = {};
                  statusArray.ontime = lang.onTime;
                  statusArray.late = lang.late;
                  statusArray.completed = lang.completed;
                  options.statusArray = statusArray;
                  options.parent = that;
                  var donutView = new VisualDataDonutContentView(options);
                  that.donut.show(donutView);
                  clearInterval(interval);
                }
              }, 500);
        }
      }
    },
    onDestroy: function () {
      $(".wfstatus-progress-view-dialog-back").click();
    }
  });

  return WFStatusView;

});
