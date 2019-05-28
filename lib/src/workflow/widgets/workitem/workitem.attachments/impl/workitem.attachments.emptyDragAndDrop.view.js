/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.emptyDragAndDrop',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function (_, Marionette, lang, WorkItemDragAndDropTemplate) {
  'use strict';
  var EmptyDragAndDropView = Marionette.ItemView.extend({
    template: WorkItemDragAndDropTemplate,
    className: 'workitem-attachments-emptylist',
    templateHelpers: function () {
      return {
        messages: {
          dragAndDropEmptyMsg: lang.EmptyDragAndDropMessage
        }
      };
    },
    constructor: function EmptyDragAndDropView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  return EmptyDragAndDropView;
});