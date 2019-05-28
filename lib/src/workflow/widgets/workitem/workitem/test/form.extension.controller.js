/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/controls/globalmessage/globalmessage',
  'workflow/utils/workitem.extension.controller'
], function (_, $, Marionette, log, GlobalMessage, WorkItemExtensionController) {
  'use strict';
  var FormExtensionController = WorkItemExtensionController.extend({
    type: 101,
    sub_type: 1,

    constructor: function (attributes, options) {
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
      var deferred = $.Deferred();
      if (extensionPoint === WorkItemExtensionController.ExtensionPoints.AddForm) {

       var MyLayout = Marionette.LayoutView.extend({
          className: 'extensiontest-view',
          template: '<h4>This is the Text for ExtensionPoints Test</h4>',

          constructor: function MyLayout(options) {
            options || (options = {});

            this.context = options.context;
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);
          }
        });
        var view = new MyLayout();
        deferred.resolve({viewToShow: view});
        return deferred.promise(  );
      } else {
        deferred.resolve({});
        return deferred.promise();
      }
    },
    executeAction: function (options) {
      var deferred = $.Deferred();

      var task = options.model.get('task');
      if (!_.isUndefined(task) && (task.type === 1000) && (task.sub_type === 1004)) {
        GlobalMessage.showMessage('success', 'This is the executeAction Dialog.');
        setTimeout(_.bind(function () {
          var data = {
            action: options.action,
            comment: 'processed by wfstatus extensions...'
          }
          if (options.model.get('authentication') === true) {
            data.authentication_info = {
              username: 'admin',
              password: 'livelink'
            }
          }
          deferred.resolve({
            scope: 'custom',
            data: data
          });
        }, this), 100);
      } else {
        deferred.resolve({});
      }
      return deferred.promise();
    }

  });

  return FormExtensionController;
});
