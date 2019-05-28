/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/marionette',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/controls/table/table.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'workflow/models/wfstatus/wfstatus.collection.factory',
  'workflow/widgets/wfstatus/impl/wfstatus.list.view',
  'workflow/utils/workitem.util',
  'hbs!workflow/widgets/wfstatus/impl/wfstatus.extended',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function (Marionette, _, $, TableView, LayoutViewEventsPropagationMixin,
    WFStatusCollectionFactory, WFStatusListView, WorkItemUtil,
    template, lang) {

  'use strict';

  var WFStatusExtendedView = Marionette.LayoutView.extend({

    className: 'wfstatus-extended-view',

    template: template,

    events: {
      'click #selectAll': 'toggleCheckBoxAll',
      'click #wfstatus-late ,#wfstatus-ontime ,#wfstatus-completed': 'toggleCheckBoxSelection'
    },

    regions: {
      filterRegion: '.wfstatus-filter-view',
      listRegion: '.wfstatus-list-view'
    },

    templateHelpers: function () {
      var checkedAll         = '', checkedLate = '', checkedOnTime = '', checkedCompleted = '', checked = "checked",
          completeCollection = this.options.context.getCollection(WFStatusCollectionFactory),
          statusList         = completeCollection.options.status,
          wfstatusData       = completeCollection.model.get('data');
      if (statusList && statusList.length > 0) {
        _.each(statusList, function (status) {
          if (status === 'ontime') {
            checkedOnTime = checked;
          } else if (status === 'workflowlate') {
            checkedLate = checked;
          } else if (status === 'completed') {
            checkedCompleted = checked;
          }
        });
      } else {
        checkedAll = checked;
        checkedOnTime = checked;
        checkedLate = checked;
        checkedCompleted = checked;
      }

      return {
        completedFilterLabel: lang.completedFilterLabel,
        lateFilterLabel: lang.lateFilterLabel,
        ontimeFilterLabel: lang.ontimeFilterLabel,
        headerFilterTitle: lang.headerFilterTitle,
        headerFilterLabel: lang.headerFilterLabel,
        allFilterLabel: lang.allFilterLabel,
        allWFStatusCount: completeCollection.model.get('count'),
        ontimeCount: wfstatusData[0] ? wfstatusData[0].count : wfstatusData.status === 'ontime' ? 1 : 0,
        completedCount:wfstatusData[0] ?wfstatusData[1].count : wfstatusData.status === 'completed'? 1 : 0,
        lateCount: wfstatusData[0] ? wfstatusData[2].count : wfstatusData.status === 'workflowlate' ? 1 : 0,
        checkedAll: checkedAll,
        checkedLate: checkedLate,
        checkedOnTime: checkedOnTime,
        checkedCompleted: checkedCompleted

      };

    },

    constructor: function WFStatusExtendedView(options) {
      this.options = options;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'click:actionIcon', this.onClickFilter);
      this.listenTo(this, 'destroy', this.destroyUserCardPopovers);
      this.propagateEventsToRegions();
    },

    onRender: function () {

      if (this.collection.options.isFilterVisible !== true) {
        this.collection.add({});
      }
      var that = this;
      setTimeout(function () {
        that.listRegion.show(new WFStatusListView({
          context: that.options.context,
          collection: that.collection
        }));
      }, 1);
      if (this.collection.options.status.length > 0) {
        this.$el.find('.wfstatus-filter-view').addClass('wfstatus-show-filter-view');
      }
    },

    onClickFilter: function () {
      WorkItemUtil.unbindPopover();
      if (this.$el.find('.wfstatus-show-filter-view').length === 0) {
        this.$el.find('.wfstatus-table').addClass('wfstatus-filter-width');
        this.$el.find('.wfstatus-filter-view').addClass('wfstatus-show-filter-view');
      } else {
        this.$el.find('.wfstatus-table').removeClass('wfstatus-filter-width');
        this.$el.find('.wfstatus-filter-view').removeClass('wfstatus-show-filter-view');
      }
      $(window).trigger("resize.tableview", TableView.onTableWinResize);
    },

    toggleCheckBoxAll: function (event) {
      WorkItemUtil.unbindPopover();
      if (this.$el.find("[id='selectAll']:checked").length === 1) {
        $('.csui-selected-checkbox input:not(:checked)').each(function () {
          $(this).prop("checked", true).trigger('change');
        });
      } else {
        $('.csui-selected-checkbox input:checked').each(function () {
          $(this).prop("checked", false).trigger('change');
        });
      }
      this.collection.options.isFilterVisible = true;
      this.getStatusList(event);
    },

    toggleCheckBoxSelection: function (event) {
      WorkItemUtil.unbindPopover();
      var statusList = [];
      if ($('.wfstatus-body .csui-selected-checkbox input:not(:checked)').length > 0) {
        $('.wfstatus-body .csui-selected-checkbox input:checked').each(function () {
          var id = this.id;
          if (id === "wfstatus-late") {
            statusList.push("workflowlate");
          } else if (id === "wfstatus-ontime") {
            statusList.push("ontime");
          } else if (id === "wfstatus-completed") {
            statusList.push("completed");
          }
        });
        event.data = statusList;
        $('#selectAll').prop("checked", false).trigger('change');
      } else if ($('.wfstatus-body .csui-selected-checkbox input:checked').length === 3) {
        $('#selectAll').prop("checked", true).trigger('change');
      }
      this.collection.options.isFilterVisible = true;
      this.getStatusList(event);
    },

    getStatusList: function (event) {

      this.collection.options.status = event.data ? event.data : [];
      event.stopPropagation();
      this.onRender();
    },
    destroyUserCardPopovers: function () {
      WorkItemUtil.unbindPopover();
    }
  });

  _.extend(WFStatusExtendedView.prototype, LayoutViewEventsPropagationMixin);

  return WFStatusExtendedView;
});