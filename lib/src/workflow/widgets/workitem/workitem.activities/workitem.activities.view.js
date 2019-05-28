/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'workflow/widgets/workitem/workitem.activities/impl/activity.list.view',
  'hbs!workflow/widgets/workitem/workitem.activities/impl/workitem.activities',
  'css!workflow/widgets/workitem/workitem.activities/impl/workitem.activities'
], function (_, $, Marionette, PerfectScrollingBehavior, LayoutViewEventsPropagationMixin, ActivitiesListView, template) {
  'use strict';

  var WorkflowActivitiesView = Marionette.LayoutView.extend({

    className: 'workflow-activities-container',

    template: template,

    regions: {
      activitiesListRegion: '.workflow-activities'
    },

    constructor: function WorkflowActivitiesView(options) {
      this.options = options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    behaviors: {
      ScrollingBehavior: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.workflow-activities',
        suppressScrollX: true,
      }
    },

    onRender: function () {
      var listView = new ActivitiesListView(this.options);
      this.activitiesListRegion.show(listView);
    }
  });

  _.extend(WorkflowActivitiesView.prototype, LayoutViewEventsPropagationMixin);
  return WorkflowActivitiesView;
});
