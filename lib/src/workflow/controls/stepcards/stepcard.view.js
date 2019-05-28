/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'workflow/controls/usercards/usercards.popover.view',
  'hbs!workflow/controls/stepcards/impl/stepcard',
  'i18n!workflow/controls/stepcards/nls/lang',
  'css!workflow/controls/stepcards/impl/stepcard'
], function (require, $, _, Backbone, Marionette, ConnectorFactory, UsercardsPopoverView, Template,
    Lang) {
  'use strict';

  var StepCardView = Marionette.ItemView.extend({

    template: Template,

    className: 'wfstatus-stepcard',

    constructor: function WFStatusStepCardView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.stepCardsListView = this.options.stepCardsListView;
      this.model.connector = this.options.context.getObject(ConnectorFactory, this.options);
      this.listenTo(this.model, 'change', this.render);
    },

    templateHelpers: function () {

      var data         = {},
          assigneeData = this.model.get('task_assignees'),
          utils        = require('workflow/utils/workitem.util');

      var stepName        = this.model.get('task_name') === null ? "" :
                            this.model.get('task_name'),
          dueDate         = this.model.get('task_due_date') === null ? "" :
                            this.model.get('task_due_date'),
          status          = this.model.get('task_status') === null ? "" :
                            this.model.get('task_status'),
          assignee        = '',
          taskId          =  this.model.get('task_id'),
          statusOptions         = {
            dueDate: dueDate,
            status: status
          },
          formattedStatus = utils.formatStatus(statusOptions);
      if (assigneeData !== null) {
        assigneeData.assignees = assigneeData.assignee;
        assignee = utils.getAssignee(assigneeData);
      }

      data = {
        taskId: taskId,
        dueDate: formattedStatus.status,
        stepName: stepName,
        assignee: assignee,
        stepIcon: status
      };

      _.extend(data, {OpenWorkflowLabel: Lang.OpenWorkflow});
      return data;
    },

    events: {
      'click .wfstatus-step-assignee': 'showUserPopOver'
    },

    showUserPopOver:function () {
      var taskAssignees = this.model.get("task_assignees"),
          assignees      = taskAssignees.assignee,
          context        = this.options.context,
          userCardOffset = $('.wfstatusitem-step-cards').position().top;

      if (userCardOffset) {
        $('.wfstatusitem-user-cards').css({"top": userCardOffset});
      }

      this.model.unset("userId");
      this.model.unset("assignedto");

      if (assignees.length === 1) {
        this.model.set("userId", assignees[0].userId);
      } else {
        this.model.set("assignedto", taskAssignees.assignedto);
      }

      var assigneeOptions = {
        model: this.model,
        nodeModel: this.model,
        context: context,
        originatingView: this.options.cellView,
        currentView: this,
        stepCardsListView: this.stepCardsListView,
        stepType: this.options.stepType,
        wfData: _.pick(this.model.attributes, 'process_id', 'subprocess_id', 'task_id', 'userId')
      };

      var popoverOptions      = {
            delegateTarget: this.$el,
            UserCardviewOptions: assigneeOptions
          };
      if (assignees.length !== 0) {
        UsercardsPopoverView.ShowPopOver(popoverOptions);
      }

    }

  });

  return StepCardView;

})
;