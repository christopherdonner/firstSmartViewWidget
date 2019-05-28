/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/log',
  'csui/utils/contexts/factories/node',
  'workflow/utils/workitem.extension.controller',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.view',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
], function (_, $, log, NodeModelFactory, WorkItemExtensionController, WorkItemAttachmentsView, lang) {
  'use strict';
  var WorkItemAttachmentsController = WorkItemExtensionController.extend({
    type: 1,
    sub_type: 1,
    position: 1,

    constructor: function WorkItemAttachmentsController(attributes, options) {
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

      var extensionPoint = options.extensionPoint;
      var data = options.data;
      var parentView = options.parentView;
      var deferred = $.Deferred();
      if (extensionPoint === WorkItemExtensionController.ExtensionPoints.AddSidebar) {
        var model = this.context.getModel(NodeModelFactory,
            {attributes: {id: data.attachment_folder_id}});

        model.fetch()
            .done(_.bind(function (args) {

              args.title = lang.TabTitle;
              args.position = this.position;
              args.viewToRender = WorkItemAttachmentsView;
              args.viewToRenderOptions = {context: this.context, model: model, view: parentView};
              deferred.resolve(args);
            }, this))
            .fail(_.bind(function (args) {
              args.errorMsg = lang.ErrorMessageLoadAttachments;
              deferred.reject(args);
            }, this));
        return deferred.promise();
      } else {
        deferred.resolve({});
        return deferred.promise();
      }
    }

  });

  return WorkItemAttachmentsController;
});
