/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/utils/contexts/factories/node',
  'workflow/utils/workitem.extension.controller',
  'workflow/models/activity/activity.collection.model.factory',
  'workflow/widgets/workitem/workitem.activities/workitem.activities.view',
  'i18n!workflow/widgets/workitem/workitem.activities/impl/nls/lang'
], function (_, $, Backbone, Marionette, log, NodeModelFactory, WorkItemExtensionController,
    ActivityCollectionModelFactory, ActivityView, lang) {
  'use strict';
  var WorkItemActivitiesController = WorkItemExtensionController.extend({
    type: 100,
    sub_type: 100,
    position: 2,

    constructor: function WorkItemActivitiesController(attributes, options) {
      WorkItemExtensionController.prototype.constructor.apply(this, arguments);

      options || (options = {});

      this.context = attributes.context;
    },
    validate: function (type, sub_type) {
      if (type === this.type && sub_type === this.sub_type) {
        return true;
      }
      return false;
    },
    execute: function (options) {
      var deferred = $.Deferred();
      if (options.extensionPoint === WorkItemExtensionController.ExtensionPoints.AddSidebar &&
          !options.model.get("isDraft") && (options.model.get("isDoc") === undefined) &&
          (options.model.get("isDocDraft") === undefined)) {
        var activities = this.context.getModel(ActivityCollectionModelFactory);
        activities.setData({
          processId: options.model.get('process_id'),
          subprocessId: options.model.get('subprocess_id')
        });
        activities.fetch();
        var args = {
          title: lang.viewTitle,
          position: this.position,
          viewToRender: ActivityView,
          viewToRenderOptions: {
            context: this.context,
            collection: activities
          }
        };
        deferred.resolve(args);
        return deferred.promise();
      } else {
        deferred.resolve({});
        return deferred.promise();
      }
    }
  });

  return WorkItemActivitiesController;
});
