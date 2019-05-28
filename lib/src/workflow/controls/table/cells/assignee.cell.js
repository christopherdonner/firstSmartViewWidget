/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/table/cells/cell.registry',
  'csui/controls/table/cells/templated/templated.view',
  'workflow/controls/usercards/usercards.list.view',
  'workflow/models/wfstatus/usercard.model',
  'workflow/utils/workitem.util',
  'hbs!workflow/controls/table/cells/impl/assignee'
], function ($, _, Backbone, Marionette, cellViewRegistry, TemplatedCellView, UsercardsLayoutView,
    UserCardModel, WorkItemUtil, Template) {
  'use strict';

  var AssigneeCellView = TemplatedCellView.extend({

    template: Template,

    renderValue: function () {
      var data = this.getValueData(),
          html = data ? this.template(data) : '';
      this.$el.html(html);
    },

    getValueData: function () {
      var model          = this.model,
          column         = this.options.column,
          columnName     = column.name,
          formattedValue = model.get(columnName);
      if (formattedValue == null) {
        formattedValue = '';
      }
      formattedValue = formattedValue.toString();
      return {
        formattedValue: formattedValue
      };
    }
  });
  cellViewRegistry.registerByColumnKey('assignee', AssigneeCellView);

  return AssigneeCellView;
});