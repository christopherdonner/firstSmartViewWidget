/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'workflow/widgets/wfstatus/impl/wfstatusitem.body.view',
  'workflow/models/wfstatus/tabpanel.model',
  'workflow/widgets/wfstatus/impl/wfstatusitem.tabpanel.view',
  'workflow/widgets/wfstatus/impl/wfstatusitem.details.view',
  'workflow/widgets/wfstatus/impl/wfstatusitem.attachments.view',
  'workflow/models/wfstatus/wfstatusinfo.model.factory',
  'hbs!workflow/widgets/wfstatus/impl/wfstatus.progress',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang',
  'css!workflow/widgets/wfstatus/impl/wfstatus.progress'

], function (require, $, _, Backbone, Marionette, WFStatusItemBodyView, TabpanelCollection,
    WFStatusItemTabPanelView, WFStatusItemDetailsView, WFStatusItemAttachmentsView,
    WFStatusInfoModelFactory, template, lang) {
  'use strict';

  var WFStatusProgressView = Marionette.LayoutView.extend({

    className: 'wfstatus-progress-view',

    template: template,

    regions: {
      body: '.wfstatusitem-body',
      tabPanel: '.wfstatusitem-tabpanel'
    },
    events: {
      'click .wfstatusitem-body, .wfstatusitem-tabpanel': 'destroyUserCardPopovers'
    },
    constructor: function WFStatusProgressView(options) {

      var Utils        = require('workflow/utils/workitem.util'),
          cellModel    = options.model,
          processId    = cellModel.get('process_id') ? cellModel.get('process_id') : 0,
          subProcessId = cellModel.get('subprocess_id') ? cellModel.get('subprocess_id') : 0,
          taskId       = cellModel.get('task_id') ? cellModel.get('task_id') : 0,
          wfStatusInfo = options.context.getModel(WFStatusInfoModelFactory);

      wfStatusInfo.set({'process_id': processId, 'subprocess_id': subProcessId, 'task_id': taskId});
      this.dataFetched = false;

      wfStatusInfo.fetch()
          .done(_.bind(function () {
            this.dataFetched = true;
            var wfDetails = wfStatusInfo.get('wf_details'),
                displayName = wfDetails.initiator.firstName + " " + wfDetails.initiator.lastName,
                loginName = wfDetails.initiator.loginName,
                dueDateVal = wfDetails.due_date,
                startDateVal = wfDetails.date_initiated,
                statusResult = Utils.formatStatus({
                  dueDate: dueDateVal,
                  status: wfDetails.status
                }),
                details = {
                  wf_name: wfDetails.wf_name,
                  due_date: (dueDateVal) ? Utils.dateConversion(dueDateVal) : '',
                  status_key: statusResult.status,
                  initiator: displayName === " " ? loginName : displayName,
                  date_initiated: (startDateVal) ? Utils.dateConversion(startDateVal) : '',
                  userId: wfDetails.initiator.userId,
                  end_date: dueDateVal,
                  start_date: startDateVal
                };
            wfStatusInfo.set('details', details);//Once backend ready with details,we can remove
            this.model = wfStatusInfo;
            this.viewOptions = {model: this.model, context: this.options.context, cellView: this.options.cellView};

            this.tabpanelCollection = new TabpanelCollection([{
              title: lang.details,
              viewToRender: WFStatusItemDetailsView,
              viewToRenderOptions: this.viewOptions,
              id: _.uniqueId('wfstatusitem-tab')
            }]);
            if (!_.isEmpty(this.model.get("attachments"))) {
              this.tabpanelCollection.add({
                title: lang.attachments,
                viewToRender: WFStatusItemAttachmentsView,
                viewToRenderOptions: this.viewOptions,
                id: _.uniqueId('wfstatusitem-tab')
              });
            }
            this.render();
          }, this));

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

    },
    onRender: function () {
      if (this.dataFetched) {
        this._renderBody();
        this._renderTabPanel();
      }
    },

    destroyUserCardPopovers: function (e) {
      if($(".wfstatus-usercard-popover").length > 0){
        var Utils = require('workflow/utils/workitem.util');
        Utils.unbindPopover();
      }
    },
    onDomRefresh: function () {

      if ($('.wfstatusitem-bar').length > 0 && ($('.wfstatus-progress-view')[0].offsetHeight) > 0) {
        var stepList = this.model.get('step_list'),
                       currentStepListLength   = (stepList && stepList.current)? stepList.current.length : 0,
                       completedStepListLength = (stepList && stepList.completed)? stepList.completed.length : 0,
                       type = 'current',
                       noOfNodes;
                      
                if (currentStepListLength === 0) {
                    noOfNodes = 2;
                    type = 'completed';
                } else {
                    if (completedStepListLength === 0) {
                        noOfNodes = 3;
                    } else {
                        noOfNodes = 4;
                    }
                }     
 
        this.body.currentView.onClickStep(type);
        this.body.currentView.adjustStepCardPosition(noOfNodes);
      }
    },

    _renderBody: function () {
      this.body.show( new WFStatusItemBodyView(this.viewOptions ));
    },

    _renderTabPanel: function () {

      if (this.tabpanelCollection.models.length > 0) {
        var wfStatusItemTabPanelView = new WFStatusItemTabPanelView({
          collection: this.tabpanelCollection
        });
        this.tabPanel.show(wfStatusItemTabPanelView);
      }
    },
    onBeforeDestroy : function(){
      $(window).unbind("resize.app");
      this.model.reset();
      var Utils = require('workflow/utils/workitem.util');
      Utils.unbindPopover();
    }

  });

  return WFStatusProgressView;
});
